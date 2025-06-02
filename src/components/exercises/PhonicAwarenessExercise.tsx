
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, Play, VolumeX, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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

const PhonicAwarenessExercise: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pseudowords');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { setExerciseContext, updateDailyStreak } = useChatbot();

  // Pseudopalabras para comprobar relación fonema-grafema
  const pseudowords = [
    'badufo', 'telino', 'sacote', 'piruta', 'maledo', 'noribe',
    'dateno', 'fusila', 'tocami', 'suledo', 'retalo', 'micado',
    'loruda', 'paleta', 'kirimo', 'zenata', 'bufote', 'nelica'
  ];

  // Pares de sílabas para conciencia silábica
  const syllablePairs = [
    { syllables: ['ma', 'pa'], word: 'mapa' },
    { syllables: ['ca', 'sa'], word: 'casa' },
    { syllables: ['pe', 'lo', 'ta'], word: 'pelota' },
    { syllables: ['li', 'bro'], word: 'libro' },
    { syllables: ['co', 'mi', 'da'], word: 'comida' },
    { syllables: ['es', 'cue', 'la'], word: 'escuela' }
  ];

  useEffect(() => {
    setExerciseContext({
      currentExercise: {
        id: 'phonics-1',
        title: 'Ejercicio de Conciencia Fonológica',
        type: 'fonologia'
      }
    });

    setStartTime(new Date());

    return () => {
      setExerciseContext(null);
    };
  }, []);

  useEffect(() => {
    // Si se completan 10 intentos, marcar el ejercicio como completado
    if (attempts >= 10 && !exerciseCompleted) {
      setExerciseCompleted(true);
      
      if (user) {
        const endTime = new Date();
        const timeSpent = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;
        const percentageCorrect = (score / attempts) * 100;
        const isPerfectScore = score === attempts;
        const pointsEarned = isPerfectScore ? 100 : Math.round(percentageCorrect / 2);
        
        saveExerciseResult(pointsEarned, timeSpent, percentageCorrect);
      }
    }
  }, [attempts]);

  const saveExerciseResult = async (pointsEarned: number, timeSpent: number, percentageCorrect: number) => {
    try {
      const { error } = await supabase.from('exercise_results').insert({
        user_id: user.id,
        exercise_type: 'fonologia',
        exercise_id: `phonics-${activeTab}`,
        score: score,
        max_score: attempts,
        points_earned: pointsEarned,
        grade: Math.round(percentageCorrect / 10),
        details: {
          exercise_type: activeTab,
          time_spent_seconds: Math.round(timeSpent),
          attempts: attempts,
          correct_answers: score
        }
      });

      if (error) throw error;

      toast({
        title: "Progreso guardado",
        description: `Tu resultado ha sido guardado. ${pointsEarned === 100 ? '¡Has ganado 100 puntos por puntuación perfecta!' : `Has ganado ${pointsEarned} puntos.`}`,
        variant: "default",
      });
      
      // Actualizar racha diaria
      updateDailyStreak().then(newStreak => {
        toast({
          title: "¡Racha actualizada!",
          description: `Has mantenido tu racha durante ${newStreak} días. ¡Sigue así!`,
          variant: "default",
        });
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
        setAttempts(prev => prev + 1);
        
        const isCorrect = transcript.trim().toLowerCase() === currentWord.toLowerCase();
        
        if (isCorrect) {
          setScore(prev => prev + 1);
          toast({
            title: "¡Correcto!",
            description: "¡Muy bien! Has pronunciado correctamente.",
            variant: "default",
          });
        } else {
          toast({
            title: "¡Inténtalo de nuevo!",
            description: `La palabra era "${currentWord}". Tú dijiste "${transcript}"`,
            variant: "destructive",
          });
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

  const getRandomPseudoword = () => {
    const randomIndex = Math.floor(Math.random() * pseudowords.length);
    speakWord(pseudowords[randomIndex]);
  };

  const getRandomSyllablePair = () => {
    const randomIndex = Math.floor(Math.random() * syllablePairs.length);
    const pair = syllablePairs[randomIndex];
    setCurrentWord(pair.word);
    
    // Reproduce cada sílaba con un pequeño retraso entre ellas
    pair.syllables.forEach((syllable, index) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(syllable);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8; // Más lento para enfatizar las sílabas
        speechSynthesis.speak(utterance);
      }, index * 800);
    });
  };

  const resetExercise = () => {
    setScore(0);
    setAttempts(0);
    setTranscript('');
    setCurrentWord('');
    setExerciseCompleted(false);
    setStartTime(new Date());
  };

  const renderPseudowordsExercise = () => {
    return (
      <div className="space-y-6">
        <p className="text-lg">
          En este ejercicio escucharás pseudopalabras (palabras inventadas) y deberás repetirlas exactamente como las escuchas.
          Esto ayuda a comprobar tu capacidad para relacionar sonidos con letras.
        </p>
        
        {exerciseCompleted ? (
          <div className="text-center bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">¡Ejercicio completado!</h3>
            <p className="text-lg mb-4">Tu puntuación: {score}/{attempts}</p>
            <Button 
              onClick={resetExercise}
              className="bg-kid-green hover:bg-kid-green/80"
            >
              Intentar de nuevo
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-50 p-6 rounded-xl mb-4">
              <p className="text-lg font-bold mb-2">Puntuación: {score}/{attempts}</p>
              <p>Escucha la pseudopalabra y repítela exactamente.</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={getRandomPseudoword}
                className="bg-kid-purple hover:bg-kid-purple/80 w-48  text-black"
              >
                <Play className="w-4 h-4 mr-2" />
                Escuchar palabra
              </Button>
              
              <Button
                onClick={startListening}
                disabled={isListening || !currentWord}
                className={`w-48 ${isListening ? "bg-red-500" : "bg-kid-green hover:bg-kid-green/80  text-black" }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Escuchando...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Repetir palabra
                  </>
                )}
              </Button>
            </div>
            
            {transcript && (
              <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600">Tu respuesta:</p>
                <p className="text-lg font-bold">{transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSyllableExercise = () => {
    return (
      <div className="space-y-6">
        <p className="text-lg">
          En este ejercicio escucharás sílabas separadas y deberás identificar qué palabra forman.
          Esto ayuda a mejorar la conciencia silábica y la capacidad de combinar sonidos.
        </p>
        
        {exerciseCompleted ? (
          <div className="text-center bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">¡Ejercicio completado!</h3>
            <p className="text-lg mb-4">Tu puntuación: {score}/{attempts}</p>
            <Button 
              onClick={resetExercise}
              className="bg-kid-green hover:bg-kid-green/80"
            >
              Intentar de nuevo
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-50 p-6 rounded-xl mb-4">
              <p className="text-lg font-bold mb-2">Puntuación: {score}/{attempts}</p>
              <p>Escucha las sílabas y dime qué palabra forman.</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={getRandomSyllablePair}
                className="bg-kid-purple hover:bg-kid-purple/80 w-48  text-black"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Escuchar sílabas
              </Button>
              
              <Button
                onClick={startListening}
                disabled={isListening || !currentWord}
                className={`w-48 ${isListening ? "bg-red-500" : "bg-kid-green hover:bg-kid-green/80  text-black"}`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Escuchando...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Decir palabra
                  </>
                )}
              </Button>
            </div>
            
            {transcript && (
              <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600">Tu respuesta:</p>
                <p className="text-lg font-bold">{transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Conciencia Fonológica</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        resetExercise();
      }}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pseudowords">Pseudopalabras</TabsTrigger>
          <TabsTrigger value="syllables">Conciencia Silábica</TabsTrigger>
        </TabsList>
        <TabsContent value="pseudowords">
          {renderPseudowordsExercise()}
        </TabsContent>
        <TabsContent value="syllables">
          {renderSyllableExercise()}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Badge className="bg-blue-100 text-blue-800">
          {activeTab === 'pseudowords' ? 'Avanzado' : 'Intermedio'}
        </Badge>
      </div>
    </Card>
  );
};

export default PhonicAwarenessExercise;
