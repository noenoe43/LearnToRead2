
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { useChatbot } from '@/components/ChatbotProvider';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      }
    }
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const DictationExercise: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { setExerciseContext, updateDailyStreak } = useChatbot();
  
  const words = [
    'bruja',     // tiene "br" y "j"
    'queso',     // "qu" y "s"
    'zapato',    // confusión entre "z" y "s"
    'planta',    // grupo consonántico "pl"
    'grillo',    // doble "l", "gr"
    'coche',     // "ch" y "c"
    'ratón',     // nasal al final
    'cerro',     // doble "r"
    'bosque',    // "b", "s", "qu"
    'huevo',     // "h" muda, diptongo
    'jirafa',    // "j", "f" y "a"
    'globo',     // "gl" y "b"
  ];

  const pseudowords = [
    'blarino',  // bl + estructura natural
    'pralute',  // pr + final inusual
    'truvelo',  // tr + v + e-o
    'quefina',  // qu + diptongo suave
    'zolipa',   // z + l + final suave
    'friqueno', // fr + qu + eño
    'dranico',  // dr + estructura silábica compleja
    'glisuma',  // gl + mezcla inventada
    'huresti',  // h muda + estructura creíble
    'trolina',  // tr + o + lina
    'crudame',  // cr + u + da
    'vletoza'   // combinación poco común "vl"
  ];

  useEffect(() => {
    setExerciseContext({
      currentExercise: {
        id: 'dictation-1',
        title: 'Ejercicio de Dictado',
        type: 'dictado'
      }
    });

    setStartTime(new Date());

    return () => {
      setExerciseContext(null);
    };
  }, []);

  useEffect(() => {
    if (exerciseCompleted) {
      const isPerfectScore = score === totalAttempts;
      const pointsEarned = isPerfectScore ? 100 : Math.round((score / totalAttempts) * 50);
      
      setExerciseContext({
        exerciseCompleted: true,
        score,
        maxScore: totalAttempts,
        isPerfectScore,
        pointsEarned,
        currentExercise: {
          id: 'dictation-1',
          title: 'Ejercicio de Dictado',
          type: 'dictado'
        }
      });

      if (user) {
        saveExerciseResult(pointsEarned);
        
        updateDailyStreak().then(newStreak => {
          toast({
            title: "¡Racha actualizada!",
            description: `Has mantenido tu racha durante ${newStreak} días. ¡Sigue así!`,
            variant: "default",
          });
        });
      }
    }
  }, [exerciseCompleted]);

  const saveExerciseResult = async (pointsEarned: number) => {
    try {
      const completionTime = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;
      
      const { error } = await supabase.from('exercise_results').insert({
        user_id: user.id,
        exercise_type: 'dictado',
        exercise_id: 'dictation-1',
        score: score,
        max_score: totalAttempts,
        points_earned: pointsEarned,
        grade: Math.round((score / totalAttempts) * 10),
        details: {
          words_attempted: totalAttempts,
          words_correct: score,
          completion_time_seconds: completionTime
        }
      });

      if (error) throw error;

      toast({
        title: "Progreso guardado",
        description: `Tu resultado ha sido guardado. ${pointsEarned === 100 ? '¡Has ganado 100 puntos por puntuación perfecta!' : `Has ganado ${pointsEarned} puntos.`}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving exercise result:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu resultado",
        variant: "destructive",
      });
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);
        setTotalAttempts(prev => prev + 1);
        
        if (transcript === currentWord.toLowerCase()) {
          setScore(prev => prev + 1);
          toast({
            title: "¡Correcto!",
            description: "¡Muy bien! Has pronunciado la palabra correctamente.",
            variant: "default",
          });
        } else {
          toast({
            title: "¡Inténtalo de nuevo!",
            description: `La palabra era "${currentWord}". Tú dijiste "${transcript}"`,
            variant: "destructive",
          });
        }

        // Check if exercise is completed (after 10 words)
        if (totalAttempts >= 9) {
          setExerciseCompleted(true);
        }
      };

      recognition.start();
    } else {
      toast({
        title: "Error",
        description: "Tu navegador no soporta el reconocimiento de voz.",
        variant: "destructive",
      });
    }
  };

  const speakWord = (word: string) => {
    setCurrentWord(word);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  };

  const getRandomWord = (isPseudoword = false) => {
    const wordList = isPseudoword ? pseudowords : words;
    const randomIndex = Math.floor(Math.random() * wordList.length);
    speakWord(wordList[randomIndex]);
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Ejercicio de Dictado</h2>
      
      {exerciseCompleted ? (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">¡Ejercicio completado!</h3>
          <p className="text-lg mb-4">Tu puntuación final: {score}/{totalAttempts}</p>
          <p className="text-md mb-4">
            {score === totalAttempts 
              ? "¡Perfecto! Has obtenido la puntuación máxima y ganado 100 puntos."
              : score >= totalAttempts * 0.7 
                ? `¡Muy bien! Has ganado ${Math.round((score / totalAttempts) * 50)} puntos. Sigue practicando para mejorar.`
                : `Has ganado ${Math.round((score / totalAttempts) * 50)} puntos. Sigue practicando, ¡lo harás mejor la próxima vez!`}
          </p>
          <Button 
            onClick={() => {
              setExerciseCompleted(false);
              setScore(0);
              setTotalAttempts(0);
              setTranscript('');
              setCurrentWord('');
              setStartTime(new Date());
            }}
            className="bg-kid-green hover:bg-kid-green/80"
          >
            Intentar de nuevo
          </Button>
        </div>
      ) : (
        <div className="text-center mb-6">
          <p className="text-lg mb-2">Puntuación: {score}/{totalAttempts}</p>
          <div className="flex justify-center gap-4 mb-4">
            <Button 
              onClick={() => getRandomWord(false)}
              className="bg-kid-purple hover:bg-kid-purple/80  text-black"
            >
              <Play className="w-4 h-4 mr-2" />
              Palabra Normal
            </Button>
            <Button 
              onClick={() => getRandomWord(true)}
              className="bg-kid-blue hover:bg-kid-blue/80  text-black"
            >
              <Play className="w-4 h-4 mr-2" />
              Pseudopalabra
            </Button>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={startListening}
              disabled={isListening || !currentWord}
              className={isListening ? "bg-red-500" : "bg-kid-green hover:bg-kid-green/80 text-black"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Escuchando...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Hablar
                </>
              )}
            </Button>
          </div>

          {transcript && (
            <div className="mt-4">
              <p className="text-gray-600">Tu respuesta:</p>
              <p className="text-lg font-bold">{transcript}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default DictationExercise;
