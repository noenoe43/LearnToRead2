
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserTimeSpent = async (userId: string, profile: any, lastActive: Date) => {
  if (!userId || !lastActive) return null;

  try {
    const timeElapsed = Math.floor((new Date().getTime() - lastActive.getTime()) / 60000);
    
    if (timeElapsed > 0) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          time_spent: (profile?.time_spent || 0) + timeElapsed,
          last_active: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      return { 
        ...profile, 
        time_spent: (profile?.time_spent || 0) + timeElapsed,
        last_active: new Date().toISOString() 
      };
    }
    return null;
  } catch (error) {
    console.error('Error updating time spent:', error);
    return null;
  }
};
