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

  // Cargar la racha diaria al iniciar
  useEffect(() => {
    if (user) {
      loadDailyStreak();
    } else {
      // Si no hay usuario autenticado, cargar desde localStorage
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
        // Verificar si la racha diaria se actualizó hoy
        const lastUpdate = data.last_streak_update ? new Date(data.last_streak_update) : null;
        const today = new Date();
        
        // Si no hay actualización o fue hace más de un día, actualizar la fecha
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

  // Función para determinar si dos fechas son el mismo día
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const updateDailyStreak = async () => {
    // Actualizar tanto en estado local como en Supabase
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

  // New function to add points to the user profile
  const addPoints = async (points: number, reason?: string) => {
    if (!user) {
      // Store in localStorage for non-authenticated users
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
      // Use the increment_points function we created in the database
      const { data, error } = await supabase
        .rpc('increment_points', { 
          user_uuid: user.id,
          points_to_add: points
        });
      
      if (error) throw error;
      
      // Show toast notification
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
