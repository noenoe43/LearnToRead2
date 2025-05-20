
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { useChatbot } from '@/components/ChatbotProvider';

interface WordOption {
  word: string;
  isReal: boolean;
}

interface JumbledWord {
  jumbled: string;
  correct: string;
}

const WordFormationExercise: React.FC = () => {
  const [activeTab, setActiveTab] = useState('real-words');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentOptions, setCurrentOptions] = useState<WordOption[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [currentJumbledWord, setCurrentJumbledWord] = useState<JumbledWord | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [targetLetter, setTargetLetter] = useState('');
  const [currentWordOptions, setCurrentWordOptions] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { setExerciseContext, updateDailyStreak } = useChatbot();
  const inputRef = useRef<HTMLInputElement>(null);

  // Lista de palabras reales e inventadas
  const wordOptions: WordOption[] = [
    { word: 'casa', isReal: true },
    { word: 'perro', isReal: true },
    { word: 'árbol', isReal: true },
    { word: 'cata', isReal: false },
    { word: 'bicla', isReal: false },
    { word: 'libro', isReal: true },
    { word: 'silla', isReal: true },
    { word: 'ruba', isReal: false },
    { word: 'mesa', isReal: true },
    { word: 'papel', isReal: true },
    { word: 'lápiz', isReal: true },
    { word: 'palaz', isReal: false },
    { word: 'niño', isReal: true },
    { word: 'paro', isReal: true },
    { word: 'sopi', isReal: false },
    { word: 'mina', isReal: true }
  ];

  // Palabras para ordenar
  const jumbledWords: JumbledWord[] = [
    { jumbled: 'asac', correct: 'casa' },
    { jumbled: 'roepr', correct: 'perro' },
    { jumbled: 'orbla', correct: 'arbol' },
    { jumbled: 'broli', correct: 'libro' },
    { jumbled: 'alsil', correct: 'silla' },
    { jumbled: 'aems', correct: 'mesa' },
    { jumbled: 'aalpl', correct: 'pala' },
    { jumbled: 'oñin', correct: 'niño' }
  ];

  // Letras objetivo y palabras que las contienen
  const letterWordPairs = [
    { letter: 'p', words: ['papel', 'perro', 'plato', 'pelota', 'pizarra'] },
    { letter: 's', words: ['casa', 'sol', 'silla', 'sopa', 'semilla'] },
    { letter: 'r', words: ['perro', 'rojo', 'ratón', 'árbol', 'reloj'] },
    { letter: 'm', words: ['mesa', 'mano', 'mamá', 'mapa', 'música'] }
  ];

  useEffect(() => {
    setExerciseContext({
      currentExercise: {
        id: 'word-formation-1',
        title: 'Ejercicio de Formación de Palabras',
        type: 'formacion'
      }
    });

    setStartTime(new Date());
    
    if (activeTab === 'real-words') {
      generateRealWordsQuestion();
    } else if (activeTab === 'find-letter') {
      generateFindLetterQuestion();
    } else if (activeTab === 'jumbled-words') {
      generateJumbledWordsQuestion();
    }

    return () => {
      setExerciseContext(null);
    };
  }, [activeTab]);

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
        exercise_type: 'formacion',
        exercise_id: `word-formation-${activeTab}`,
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

  // Funciones para generar preguntas según el tipo de ejercicio
  const generateRealWordsQuestion = () => {
    // Escoger aleatoriamente 4 palabras, al menos una real y una inventada
    let options: WordOption[] = [];
    let hasRealWord = false;
    let hasFakeWord = false;
    
    // Asegurar que tenemos al menos una palabra real y una inventada
    while (!hasRealWord || !hasFakeWord) {
      options = [];
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * wordOptions.length);
        options.push(wordOptions[randomIndex]);
      }
      
      hasRealWord = options.some(opt => opt.isReal);
      hasFakeWord = options.some(opt => !opt.isReal);
    }
    
    setCurrentOptions(options);
    setSelectedOption('');
  };

  const generateJumbledWordsQuestion = () => {
    const randomIndex = Math.floor(Math.random() * jumbledWords.length);
    setCurrentJumbledWord(jumbledWords[randomIndex]);
    setUserAnswer('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const generateFindLetterQuestion = () => {
    const randomIndex = Math.floor(Math.random() * letterWordPairs.length);
    const pair = letterWordPairs[randomIndex];
    
    setTargetLetter(pair.letter);
    
    // Mezclar y seleccionar 4 palabras (al menos 2 contienen la letra)
    const wordsWithLetter = pair.words;
    
    // Crear un conjunto de palabras que NO contienen la letra
    const wordsWithoutLetter = wordOptions
      .map(opt => opt.word)
      .filter(word => !word.includes(pair.letter));
    
    // Seleccionar 2 palabras con la letra y 2 sin la letra
    const selectedWithLetter = [];
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * wordsWithLetter.length);
      selectedWithLetter.push(wordsWithLetter[idx]);
      wordsWithLetter.splice(idx, 1);
    }
    
    const selectedWithoutLetter = [];
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * wordsWithoutLetter.length);
      selectedWithoutLetter.push(wordsWithoutLetter[idx]);
      wordsWithoutLetter.splice(idx, 1);
    }
    
    // Combinar y mezclar
    const options = [...selectedWithLetter, ...selectedWithoutLetter];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    setCurrentWordOptions(options);
    setSelectedOption('');
  };

  const handleRealWordSelect = (word: string, isReal: boolean) => {
    setSelectedOption(word);
    setAttempts(prev => prev + 1);
    
    if (isReal) {
      setScore(prev => prev + 1);
      toast({
        title: "¡Correcto!",
        description: "¡Muy bien! Has seleccionado una palabra real.",
        variant: "default",
      });
    } else {
      toast({
        title: "¡Incorrecto!",
        description: `"${word}" no es una palabra real.`,
        variant: "destructive",
      });
    }
    
    // Generar una nueva pregunta después de un pequeño retraso
    setTimeout(() => {
      generateRealWordsQuestion();
    }, 1500);
  };

  const handleJumbledWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentJumbledWord) return;
    
    setAttempts(prev => prev + 1);
    
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedCorrect = currentJumbledWord.correct.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (normalizedUserAnswer === normalizedCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "¡Correcto!",
        description: `¡Muy bien! Has ordenado correctamente la palabra "${currentJumbledWord.correct}".`,
        variant: "default",
      });
    } else {
      toast({
        title: "¡Incorrecto!",
        description: `La palabra correcta era "${currentJumbledWord.correct}".`,
        variant: "destructive",
      });
    }
    
    // Generar una nueva pregunta después de un pequeño retraso
    setTimeout(() => {
      generateJumbledWordsQuestion();
    }, 1500);
  };

  const handleLetterWordSelect = (word: string) => {
    setSelectedOption(word);
    setAttempts(prev => prev + 1);
    
    if (word.toLowerCase().includes(targetLetter.toLowerCase())) {
      setScore(prev => prev + 1);
      toast({
        title: "¡Correcto!",
        description: `¡Muy bien! La palabra "${word}" contiene la letra "${targetLetter}".`,
        variant: "default",
      });
    } else {
      toast({
        title: "¡Incorrecto!",
        description: `La palabra "${word}" no contiene la letra "${targetLetter}".`,
        variant: "destructive",
      });
    }
    
    // Generar una nueva pregunta después de un pequeño retraso
    setTimeout(() => {
      generateFindLetterQuestion();
    }, 1500);
  };

  const resetExercise = () => {
    setScore(0);
    setAttempts(0);
    setSelectedOption('');
    setUserAnswer('');
    setExerciseCompleted(false);
    setStartTime(new Date());
    
    if (activeTab === 'real-words') {
      generateRealWordsQuestion();
    } else if (activeTab === 'find-letter') {
      generateFindLetterQuestion();
    } else if (activeTab === 'jumbled-words') {
      generateJumbledWordsQuestion();
    }
  };

  const renderRealWordsExercise = () => {
    return (
      <div className="space-y-6">
        <p className="text-lg">
          Identifica cuál de estas palabras es real. Esto ayuda a reconocer patrones ortográficos correctos.
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
              <p>¿Cuál de estas es una palabra real?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleRealWordSelect(option.word, option.isReal)}
                  disabled={selectedOption !== ''}
                  className={`text-lg font-bold h-16 ${
                    selectedOption === option.word
                      ? option.isReal
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                      : "bg-kid-blue hover:bg-kid-blue/80"
                  }`}
                >
                  {option.word}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJumbledWordsExercise = () => {
    return (
      <div className="space-y-6">
        <p className="text-lg">
          Ordena las letras para formar una palabra real. Esto ayuda a practicar la secuencia correcta de letras.
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
              <p className="mb-2">Ordena estas letras para formar una palabra:</p>
              <h3 className="text-3xl font-bold my-4">{currentJumbledWord?.jumbled}</h3>
              
              <form onSubmit={handleJumbledWordSubmit} className="flex flex-col items-center gap-4">
                <Input
                  ref={inputRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-center text-xl font-bold max-w-xs"
                  placeholder="Escribe la palabra"
                />
                
                <Button 
                  type="submit" 
                  disabled={!userAnswer.trim()}
                  className="bg-kid-green hover:bg-kid-green/80  text-black"
                >
                  Comprobar
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFindLetterExercise = () => {
    return (
      <div className="space-y-6">
        <p className="text-lg">
          Selecciona la palabra que contenga la letra indicada. Esto ayuda a identificar letras específicas dentro de las palabras.
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
              <p className="mb-2">Encuentra una palabra que contenga la letra:</p>
              <h3 className="text-6xl font-bold my-4">{targetLetter}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentWordOptions.map((word, index) => (
                <Button
                  key={index}
                  onClick={() => handleLetterWordSelect(word)}
                  disabled={selectedOption !== ''}
                  className={`text-lg font-bold h-16 ${
                    selectedOption === word
                      ? word.includes(targetLetter)
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                      : "bg-kid-orange hover:bg-kid-orange/80"
                  }`}
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Formación de Palabras</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        resetExercise();
      }}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="real-words">Palabras Reales</TabsTrigger>
          <TabsTrigger value="find-letter">Encontrar Letras</TabsTrigger>
          <TabsTrigger value="jumbled-words">Ordenar Letras</TabsTrigger>
        </TabsList>
        <TabsContent value="real-words">
          {renderRealWordsExercise()}
        </TabsContent>
        <TabsContent value="find-letter">
          {renderFindLetterExercise()}
        </TabsContent>
        <TabsContent value="jumbled-words">
          {renderJumbledWordsExercise()}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Badge className={`${activeTab === 'jumbled-words' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
          {activeTab === 'jumbled-words' ? 'Avanzado' : 'Intermedio'}
        </Badge>
      </div>
    </Card>
  );
};

export default WordFormationExercise;
