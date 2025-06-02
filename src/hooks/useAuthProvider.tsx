import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { fetchUserProfile, updateUserTimeSpent } from '@/utils/authUtils';

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActive, setLastActive] = useState<Date | null>(null);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (event === 'SIGNED_IN' && currentSession?.user) {
            // Fetch user profile when signed in
            fetchUserProfile(currentSession.user.id).then(data => {
              if (data) setProfile(data);
            });
            setLastActive(new Date());
            // Update daily streak on login
            updateDailyStreakOnLogin(currentSession.user.id);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            localStorage.removeItem('user-authenticated');
            localStorage.removeItem('user-name');
          }
        }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(data => {
          if (data) setProfile(data);
        });
        setLastActive(new Date());
        localStorage.setItem('user-authenticated', 'true');
        // Update daily streak on session restore
        updateDailyStreakOnLogin(currentSession.user.id);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const activityInterval = setInterval(() => {
      if (lastActive) {
        updateTimeSpent();
        setLastActive(new Date());
      }
    }, 60000); // Update time spent every minute

    return () => clearInterval(activityInterval);
  }, [user, lastActive]);

  // Function to update daily streak on login
  const updateDailyStreakOnLogin = async (userId: string) => {
    try {
      // Get current profile data
      const { data: currentProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('daily_streak, last_streak_update')
          .eq('id', userId)
          .single();

      if (fetchError) {
        console.error('Error fetching profile for streak update:', fetchError);
        return;
      }

      const today = new Date();
      const lastUpdate = currentProfile?.last_streak_update ? new Date(currentProfile.last_streak_update) : null;

      // Check if we should update the streak
      let shouldUpdateStreak = false;
      let newStreak = 1;

      if (!lastUpdate) {
        // First time login
        shouldUpdateStreak = true;
        newStreak = 1;
      } else {
        // Check if last update was yesterday or earlier
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (lastUpdateDate.getTime() < todayDate.getTime()) {
          // Haven't updated today yet
          shouldUpdateStreak = true;

          if (lastUpdateDate.getTime() === yesterdayDate.getTime()) {
            // Last update was yesterday, increment streak
            newStreak = (currentProfile.daily_streak || 0) + 1;
          } else {
            // Last update was more than a day ago, reset streak
            newStreak = 1;
          }
        }
      }

      if (shouldUpdateStreak) {
        // Update the streak in database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
              daily_streak: newStreak,
              last_streak_update: today.toISOString()
            })
            .eq('id', userId);

        if (updateError) {
          console.error('Error updating daily streak:', updateError);
        } else {
          console.log('Daily streak updated to:', newStreak);

          // Update local profile state
          setProfile(prev => prev ? {
            ...prev,
            daily_streak: newStreak,
            last_streak_update: today.toISOString()
          } : null);

          // Show toast for streak milestone
          if (newStreak > 1) {
            toast({
              title: `¡Racha de ${newStreak} días! 🔥`,
              description: "¡Sigue así! La constancia es clave para el aprendizaje.",
              variant: "default",
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in updateDailyStreakOnLogin:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: "¡Inicio de sesión exitoso!",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message || 'Error al iniciar sesión',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente."
      });

      // Devolver el resultado para permitir que el componente acceda al usuario
      return { data, user: data.user };
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error al registrarse",
        description: error.message || 'Error al registrarse',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await updateTimeSpent();
      await supabase.auth.signOut();
      toast({
        title: "¡Sesión cerrada!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });

      // Update username in localStorage if it was changed
      if (updates.username) {
        localStorage.setItem('user-name', updates.username);
      } else if (!profile?.username && user?.email) {
        // Use email username as fallback
        localStorage.setItem('user-name', user.email.split('@')[0]);
      }

      toast({
        title: "¡Perfil actualizado!",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error al actualizar el perfil",
        description: error.message || 'Error al actualizar el perfil',
        variant: "destructive",
      });
    }
  };

  const updateTimeSpent = useCallback(async () => {
    if (!user || !lastActive) return;

    const updatedProfile = await updateUserTimeSpent(user.id, profile, lastActive);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  }, [user, profile, lastActive]);

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateTimeSpent
  };
};