
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { useChatbot } from '@/components/ChatbotProvider';

const LetterDifferentiationExercise: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bd');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentPair, setCurrentPair] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { setExerciseContext, updateDailyStreak } = useChatbot();

  // Pares de letras confusas con palabras para cada tipo
  const confusablePairs = {
    bd: {
      letters: ['b', 'd'],
      words: [
        { word: 'barril', correct: 'b' },
        { word: 'dedal', correct: 'd' },
        { word: 'bisagra', correct: 'b' },
        { word: 'doblaje', correct: 'd' },
        { word: 'bombilla', correct: 'b' },
        { word: 'desván', correct: 'd' },
        { word: 'brindis', correct: 'b' },
        { word: 'dificultad', correct: 'd' }
      ]
    },
    pq: {
      letters: ['p', 'q'],
      words: [
        { word: 'previsión', correct: 'p' },
        { word: 'quimérico', correct: 'q' },
        { word: 'precipicio', correct: 'p' },
        { word: 'quirúrgico', correct: 'q' },
        { word: 'persiana', correct: 'p' },
        { word: 'quemadura', correct: 'q' },
        { word: 'perplejo', correct: 'p' },
        { word: 'quedarse', correct: 'q' }
      ]
    },
    mn: {
      letters: ['m', 'n'],
      words: [
        { word: 'murmullo', correct: 'm' },
        { word: 'nebulosa', correct: 'n' },
        { word: 'madrugada', correct: 'm' },
        { word: 'narrador', correct: 'n' },
        { word: 'misterio', correct: 'm' },
        { word: 'nervioso', correct: 'n' },
        { word: 'mecánico', correct: 'm' },
        { word: 'notación', correct: 'n' }
      ]
    }
  };

  useEffect(() => {
    setExerciseContext({
      currentExercise: {
        id: 'letter-diff-1',
        title: 'Ejercicio de Diferenciación de Letras',
        type: 'diferenciacion'
      }
    });

    setStartTime(new Date());
    generateQuestion();

    return () => {
      setExerciseContext(null);
    };
  }, [activeTab]);

  useEffect(() => {
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
        exercise_type: 'diferenciacion',
        exercise_id: `letter-diff-${activeTab}`,
        score: score,
        max_score: attempts,
        points_earned: pointsEarned,
        grade: Math.round(percentageCorrect / 10),
        details: {
          letter_pair: activeTab,
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

  const generateQuestion = () => {
    const currentPairData = confusablePairs[activeTab as keyof typeof confusablePairs];
    if (!currentPairData) return;
    
    const randomIndex = Math.floor(Math.random() * currentPairData.words.length);
    const wordData = currentPairData.words[randomIndex];
    
    setCurrentPair(currentPairData.letters);
    setCorrectAnswer(wordData.correct);
    
    // Establecer la palabra a mostrar
    const word = wordData.word;
    setCurrentWord(word);
    
    // Resetear la selección del usuario
    setSelectedOption('');
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setAttempts(prev => prev + 1);
    
    if (option === correctAnswer) {
      setScore(prev => prev + 1);
      toast({
        title: "¡Correcto!",
        description: "¡Muy bien! Has seleccionado la letra correcta.",
        variant: "default",
      });
    } else {
      toast({
        title: "¡Incorrecto!",
        description: `La respuesta correcta era "${correctAnswer}".`,
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  const resetExercise = () => {
    setScore(0);
    setAttempts(0);
    setSelectedOption('');
    setExerciseCompleted(false);
    setStartTime(new Date());
    generateQuestion();
  };

  const renderExercise = () => {
    if (!currentPair.length) return null;
    
    return (
      <div className="space-y-6">
        <p className="text-lg">
          En este ejercicio deberás identificar con qué letra empieza la palabra mostrada.
          Esto ayuda a mejorar la discriminación de letras similares que suelen confundirse.
        </p>
        
        {exerciseCompleted ? (
          <div className="text-center bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">¡Ejercicio completado!</h3>
            <p className="text-lg mb-4">Tu puntuación: {score}/{attempts}</p>
            <Button 
              onClick={resetExercise}
              className="bg-kid-green hover:bg-kid-green/80  text-black"
            >
              Intentar de nuevo
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-50 p-6 rounded-xl mb-4">
              <p className="text-lg font-bold mb-2">Puntuación: {score}/{attempts}</p>
              <p className="mb-4">¿Con qué letra empieza esta palabra?</p>
              <h3 className="text-3xl font-bold">{currentWord}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentPair.map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleOptionSelect(letter)}
                  disabled={selectedOption !== ''}
                  className={`text-3xl font-bold h-16 ${
                    selectedOption === letter
                      ? letter === correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                      : "bg-kid-blue hover:bg-kid-blue/80"
                  }`}
                >
                  {letter.toUpperCase()}
                </Button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button
                onClick={generateQuestion}
                className="bg-kid-purple hover:bg-kid-purple/80  text-black"
              >
                Siguiente palabra
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Diferenciación de Letras</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        resetExercise();
      }}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="bd">b / d</TabsTrigger>
          <TabsTrigger value="pq">p / q</TabsTrigger>
          <TabsTrigger value="mn">m / n</TabsTrigger>
        </TabsList>
        <TabsContent value="bd">
          {renderExercise()}
        </TabsContent>
        <TabsContent value="pq">
          {renderExercise()}
        </TabsContent>
        <TabsContent value="mn">
          {renderExercise()}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Badge className="bg-orange-100 text-orange-800">
          Intermedio
        </Badge>
      </div>
    </Card>
  );
};

export default LetterDifferentiationExercise;
