import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface ChatbotContextType {
  setExerciseContext: (context: any) => void;
  clearExerciseContext: () => void;
  exerciseContext: any;
  dailyStreak: number;
  updateDailyStreak: () => Promise<number>;
  setPageContext: (context: string) => void;
  pageContext: string | null;
  addPoints: (points: number, reason?: string) => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exerciseContext, setExerciseContextState] = useState<any>(null);
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [pageContext, setPageContextState] = useState<string | null>(null);
  const { user } = useAuth();

  const setExerciseContext = (context: any) => {
    setExerciseContextState(context);
  };

  const clearExerciseContext = () => {
    setExerciseContextState(null);
  };

  const setPageContext = (context: string) => {
    setPageContextState(context);
  };


  useEffect(() => {
    if (user) {
      loadDailyStreak();
    } else {
      const localStreak = parseInt(localStorage.getItem('user-streak') || '0');
      setDailyStreak(localStreak);
    }
  }, [user]);

  const loadDailyStreak = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('daily_streak, last_streak_update')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const lastUpdate = data.last_streak_update ? new Date(data.last_streak_update) : null;
        const today = new Date();
        
        if (!lastUpdate || !isSameDay(lastUpdate, today)) {
          // No actualizamos el contador aquí, solo cuando se completa un ejercicio
          setDailyStreak(data.daily_streak || 0);
        } else {
          setDailyStreak(data.daily_streak || 0);
          localStorage.setItem('user-streak', (data.daily_streak || 0).toString());
        }
      }
    } catch (error) {
      console.error('Error cargando racha diaria:', error);
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const updateDailyStreak = async () => {
    const newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    localStorage.setItem('user-streak', newStreak.toString());
    
    if (user) {
      try {
        // Actualizar en la base de datos
        const { error } = await supabase
          .from('profiles')
          .update({ 
            daily_streak: newStreak,
            last_streak_update: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error actualizando racha diaria:', error);
      }
    }
    
    return newStreak;
  };

  const addPoints = async (points: number, reason?: string) => {
    if (!user) {
      const currentPoints = parseInt(localStorage.getItem('user-points') || '0');
      const newPoints = currentPoints + points;
      localStorage.setItem('user-points', newPoints.toString());
      
      // Show toast notification
      toast({
        title: `¡Has ganado ${points} puntos!`,
        description: reason || 'Sigue practicando para ganar más.',
        variant: "default",
      });
      
      return;
    }
    
    try {
      const { data, error } = await supabase
        .rpc('increment_points', { 
          user_uuid: user.id,
          points_to_add: points
        });
      
      if (error) throw error;
      
      toast({
        title: `¡Has ganado ${points} puntos!`,
        description: reason || 'Sigue practicando para ganar más.',
        variant: "default",
      });
    } catch (err) {
      console.error('Error adding points:', err);
      toast({
        title: 'Error al añadir puntos',
        description: 'Ha ocurrido un problema. Inténtalo de nuevo más tarde.',
        variant: "destructive",
      });
    }
  };

  return (
    <ChatbotContext.Provider value={{ 
      exerciseContext,
      setExerciseContext,
      clearExerciseContext,
      dailyStreak,
      updateDailyStreak,
      pageContext,
      setPageContext,
      addPoints
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
