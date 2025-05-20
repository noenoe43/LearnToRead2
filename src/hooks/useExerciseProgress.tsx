
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { useChatbot } from '@/components/ChatbotProvider';

interface ExerciseType {
  type: string;
  count: number;
  avgScore: number;
  totalPoints: number;
}

interface ProblemExercise {
  exercise_type: string;
  score: number;
  max_score: number;
  completed_at: string;
}

interface ExerciseProgress {
  byType: Record<string, ExerciseType>;
  problemExercises: ProblemExercise[];
  totalCompleted: number;
  totalPoints: number;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

export const useExerciseProgress = (): ExerciseProgress => {
  const [progress, setProgress] = useState<{
    byType: Record<string, ExerciseType>;
    problemExercises: ProblemExercise[];
    totalCompleted: number;
    totalPoints: number;
  }>({
    byType: {},
    problemExercises: [],
    totalCompleted: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { user } = useAuth();
  const { addPoints } = useChatbot();

  const fetchExerciseProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Group exercises by type and calculate statistics
        const statsByType: Record<string, ExerciseType> = {};
        let totalPoints = 0;
        
        data.forEach(result => {
          if (!statsByType[result.exercise_type]) {
            statsByType[result.exercise_type] = {
              type: result.exercise_type,
              count: 0,
              avgScore: 0,
              totalPoints: 0
            };
          }
          
          statsByType[result.exercise_type].count++;
          statsByType[result.exercise_type].avgScore += (result.score / result.max_score) * 100;
          statsByType[result.exercise_type].totalPoints += result.points_earned || 0;
          totalPoints += result.points_earned || 0;
        });
        
        // Calculate averages
        Object.keys(statsByType).forEach(type => {
          statsByType[type].avgScore = statsByType[type].avgScore / statsByType[type].count;
        });
        
        // Find problematic exercises
        const problemExercises = data
          .filter(result => (result.score / result.max_score) < 0.7)
          .slice(0, 5);
        
        setProgress({
          byType: statsByType,
          problemExercises,
          totalCompleted: data.length,
          totalPoints
        });
        
        // Fetch the current profile points
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // Update points in database if they don't match
        if (profileData && profileData.points !== totalPoints) {
          await supabase
            .from('profiles')
            .update({ points: totalPoints })
            .eq('id', user.id);
        }
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching exercise progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseProgress();
  }, [user]);

  return {
    ...progress,
    loading,
    error,
    refetch: fetchExerciseProgress
  };
};
