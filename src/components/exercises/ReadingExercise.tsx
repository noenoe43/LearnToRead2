
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { useChatbot } from '@/components/ChatbotProvider';

const ReadingExercise: React.FC = () => {
  const [difficulty, setDifficulty] = useState('normal');
  const [isReading, setIsReading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(500); // ms por palabra
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { setExerciseContext, updateDailyStreak } = useChatbot();

  const normalText = [
    "El", "zorro", "marrón", "saltó", "rápidamente", "sobre", "el", "perro", "perezoso.", 
    "Luego,", "corrió", "hacia", "el", "bosque", "buscando", "nuevas", "aventuras.", 
    "A", "los", "niños", "les", "encantaba", "observar", "a", "los", "animales", 
    "jugar", "libremente", "en", "el", "parque."
  ];

  const dyslexiaText = [
    "Las", "letras", "bailan", "en", "la", "página", "como", "si", "tuvieran", "vida", 
    "propia.", "Para", "muchos", "niños", "con", "dislexia,", "cada", "palabra", "es", 
    "un", "desafío", "que", "requiere", "concentración", "extra.", "La", "b", "y", "la", 
    "d", "se", "confunden,", "mientras", "que", "la", "p", "y", "la", "q", "parecen", 
    "gemelas."
  ];

  useEffect(() => {
    // Set exercise context for chatbot
    setExerciseContext({
      currentExercise: {
        id: 'reading-1',
        title: 'Ejercicio de Lectura',
        type: 'lectura'
      }
    });

    return () => {
      // Clear exercise context and interval when component unmounts
      setExerciseContext(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startReading = () => {
    setIsReading(true);
    setStartTime(new Date());
    setCurrentIndex(0);
    setCompleted(false);
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const currentText = difficulty === 'normal' ? normalText : dyslexiaText;
        if (prevIndex >= currentText.length - 1) {
          clearInterval(intervalRef.current!);
          setIsReading(false);
          setEndTime(new Date());
          setCompleted(true);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, readingSpeed);
  };

  const pauseReading = () => {
    setIsReading(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetReading = () => {
    setIsReading(false);
    setCurrentIndex(0);
    setCompleted(false);
    setStartTime(null);
    setEndTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const completeExercise = async () => {
    if (!user || !startTime || !endTime) return;

    const currentText = difficulty === 'normal' ? normalText : dyslexiaText;
    const totalWords = currentText.length;
    const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
    const wordsPerMinute = Math.round((totalWords / timeSpent) * 60);
    
    const wordsByDifficultyThreshold = difficulty === 'normal' ? 120 : 80; // Umbral de palabras por minuto según dificultad
    const percentageOfThreshold = Math.min((wordsPerMinute / wordsByDifficultyThreshold) * 100, 100);
    const score = Math.round(percentageOfThreshold);
    const isPerfectScore = score >= 95;
    const pointsEarned = isPerfectScore ? 100 : Math.round(score / 2);
    
    try {
      const { error } = await supabase.from('exercise_results').insert({
        user_id: user.id,
        exercise_type: 'lectura',
        exercise_id: `reading-${difficulty}`,
        score: score,
        max_score: 100,
        points_earned: pointsEarned,
        grade: Math.round(score / 10),
        details: {
          difficulty,
          words_per_minute: wordsPerMinute,
          time_spent_seconds: Math.round(timeSpent),
          total_words: totalWords
        }
      });

      if (error) throw error;

      toast({
        title: "Ejercicio completado",
        description: `¡Bien hecho! Leíste a ${wordsPerMinute} palabras por minuto. ${isPerfectScore ? '¡Has ganado 100 puntos por tu excelente velocidad!' : `Has ganado ${pointsEarned} puntos.`}`,
        variant: "default",
      });
      
      // Actualizar racha diaria
      await updateDailyStreak();
      
    } catch (error) {
      console.error("Error guardando resultado:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu resultado",
        variant: "destructive",
      });
    } finally {
      setCompleted(false);
      resetReading();
    }
  };

  const renderText = () => {
    const currentText = difficulty === 'normal' ? normalText : dyslexiaText;
    
    return (
      <div className="bg-gray-50 p-6 rounded-xl mb-6">
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed">
            {currentText.map((word, index) => (
              <span
                key={index}
                className={`${index === currentIndex && isReading ? "bg-primary text-white px-1 py-0.5 rounded" : ""}`}
              >
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="kid-card p-6">
      <h3 className="text-xl font-bold mb-4">
        Lectura guiada con seguimiento visual
      </h3>
      
      <p className="mb-4">
        Sigue el texto mientras se ilumina cada palabra para mejorar tu fluidez lectora.
      </p>
      
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span>Dificultad:</span>
          <ToggleGroup type="single" value={difficulty} onValueChange={(value) => value && setDifficulty(value)}>
            <ToggleGroupItem value="normal" disabled={isReading}>Normal</ToggleGroupItem>
            <ToggleGroupItem value="dyslexia" disabled={isReading}>Adaptada para Dislexia</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Velocidad de lectura:</span>
          <ToggleGroup type="single" value={readingSpeed.toString()} 
            onValueChange={(value) => value && setReadingSpeed(parseInt(value))}
          >
            <ToggleGroupItem value="800" disabled={isReading}>Lenta</ToggleGroupItem>
            <ToggleGroupItem value="500" disabled={isReading}>Media</ToggleGroupItem>
            <ToggleGroupItem value="300" disabled={isReading}>Rápida</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {renderText()}
      
      <div className="flex justify-between items-center">
        <Badge className="bg-green-100 text-green-800">
          {difficulty === 'normal' ? 'Básico' : 'Avanzado'}
        </Badge>
        <div className="flex gap-2">
          {!isReading && !completed && (
            <Button onClick={startReading} className="bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4 mr-2" />
              Comenzar
            </Button>
          )}
          {isReading && (
            <Button onClick={pauseReading} className="bg-amber-500 hover:bg-amber-600">
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>
          )}
          {!isReading && currentIndex > 0 && !completed && (
            <Button onClick={resetReading} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          )}
          {completed && (
            <Button onClick={completeExercise} className="bg-green-600 hover:bg-green-700">
              Completar Ejercicio
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReadingExercise;
