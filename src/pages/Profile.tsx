import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, BookOpen, PieChart, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useExerciseProgress } from '@/hooks/useExerciseProgress';

interface Achievement {
  id: number;
  name: string;
  unlocked: boolean;
}

interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  nextLevel: number;
  daysActive: number;
  earnedPoints: number;
  stats: {
    exercisesCompleted: number;
    perfectScores: number;
    timeSpent: string;
    favoriteCategory: string;
  };
  achievements: Achievement[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useAuth();
  
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Use our new hook for exercise stats
  const { 
    byType: exerciseStatsByType, 
    problemExercises, 
    totalCompleted,
    totalPoints,
    loading: loadingExercises
  } = useExerciseProgress();
  
  const userProfile = {
    name: profile?.username || (user?.email ? user.email.split('@')[0] : 'Usuario'),
    avatar: profile?.avatar_url || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    level: 1,
    points: totalPoints || 0,
    streak: profile?.daily_streak || parseInt(localStorage.getItem('user-streak') || '0'),
    nextLevel: 1000,
    daysActive: selectedDates.length || 0,
    earnedPoints: totalPoints || 0,
    stats: {
      exercisesCompleted: totalCompleted || parseInt(localStorage.getItem('user-exercises-completed') || '0'),
      perfectScores: parseInt(localStorage.getItem('user-perfect-scores') || '0'),
      timeSpent: profile ? `${Math.floor((profile.time_spent || 0) / 60)}h ${(profile.time_spent || 0) % 60}m` : '0h 0m',
      favoriteCategory: determineTopCategory(exerciseStatsByType)
    },
    achievements: [
      { id: 1, name: 'Racha de 7 días', unlocked: (profile?.daily_streak || 0) >= 7 },
      { id: 2, name: '20 ejercicios', unlocked: totalCompleted >= 20 },
      { id: 3, name: 'Nivel 5', unlocked: false },
      { id: 4, name: '50 ejercicios', unlocked: totalCompleted >= 50 },
      { id: 5, name: 'Racha de 14 días', unlocked: (profile?.daily_streak || 0) >= 14 },
      { id: 6, name: 'Maestro de dictado', unlocked: exerciseStatsByType && exerciseStatsByType['dictado']?.avgScore >= 90 },
    ]
  };

  // Helper function to determine top category
  function determineTopCategory(stats: Record<string, any>) {
    if (!stats || Object.keys(stats).length === 0) return 'Juegos de Rimas';
    
    let maxCount = 0;
    let topCategory = 'Juegos de Rimas';
    
    Object.entries(stats).forEach(([type, data]: [string, any]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        // Format the category names nicely
        switch(type) {
          case 'dictado': topCategory = 'Dictado'; break;
          case 'rimas': topCategory = 'Juegos de Rimas'; break;
          case 'lectura': topCategory = 'Lectura'; break;
          case 'memoria': topCategory = 'Memoria'; break;
          default: topCategory = type.charAt(0).toUpperCase() + type.slice(1);
        }
      }
    });
    
    return topCategory;
  }

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    
    // Set avatar URL from profile
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }

    // Update login streak
    updateLoginStreak();

    fetchTestResults();
    fetchUserActivity();
  }, [user, navigate, loading, profile]);

  // Function to update login streak
  const updateLoginStreak = async () => {
    if (!user || !profile) return;
    
    try {
      const today = new Date();
      const lastUpdate = profile.last_streak_update ? new Date(profile.last_streak_update) : null;
      
      // Check if this is a new day login
      if (!lastUpdate || 
          lastUpdate.getDate() !== today.getDate() || 
          lastUpdate.getMonth() !== today.getMonth() || 
          lastUpdate.getFullYear() !== today.getFullYear()) {
        
        // Check if this is a consecutive day (either today or yesterday)
        let newStreak = 1; // Default to 1 if it's not consecutive
        if (lastUpdate) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastUpdate.getDate() === yesterday.getDate() && 
              lastUpdate.getMonth() === yesterday.getMonth() && 
              lastUpdate.getFullYear() === yesterday.getFullYear()) {
            // It's a consecutive day, increment streak
            newStreak = (profile.daily_streak || 0) + 1;
          }
        }
        
        // Update profile with new streak and timestamp
        await updateProfile({
          daily_streak: newStreak,
          last_streak_update: today.toISOString()
        });
        
        console.log('Login streak updated:', newStreak);
      }
    } catch (error) {
      console.error('Error updating login streak:', error);
    }
  };

  const fetchTestResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setTestResults(data);
      } else {
        // Check localStorage for legacy data
        const savedResults = localStorage.getItem('test-results');
        if (savedResults) {
          setTestResults(JSON.parse(savedResults));
        }
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const fetchUserActivity = async () => {
    if (!user) return;
    
    try {
      // Intentar obtener información de actividad de ejercicios completados
      const { data, error } = await supabase
        .from('exercise_results')
        .select('completed_at')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Agrupar fechas para contar días únicos de actividad
        const uniqueDates = new Set();
        const activityDates = [];
        
        data.forEach(item => {
          if (item.completed_at) {
            const date = new Date(item.completed_at);
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            
            if (!uniqueDates.has(dateKey)) {
              uniqueDates.add(dateKey);
              activityDates.push(date);
            }
          }
        });
        
        setSelectedDates(activityDates);
      } else {
        // Si no hay datos reales, simular con fechas aleatorias
        const activityDates = [];
        const today = new Date();
        const daysToSimulate = 30;
        
        for (let i = 0; i < daysToSimulate; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          if (Math.random() > 0.6) {
            activityDates.push(date);
          }
        }
        
        setSelectedDates(activityDates);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/avatar.${fileExt}`;
      
      setUploading(true);
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      if (!data.publicUrl) throw new Error('Error obteniendo URL pública');

      console.log('Avatar uploaded successfully, URL:', data.publicUrl);

      // Update user profile with avatar URL
      await updateProfile({
        avatar_url: data.publicUrl
      });
      
      setAvatarUrl(data.publicUrl);
      toast.success('Foto de perfil actualizada');
    } catch (error: any) {
      console.error('Error in uploadAvatar:', error);
      toast.error(error.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Calculate the percentage for the next level
  const levelProgress = (userProfile.points / userProfile.nextLevel) * 100;

  return (
    <Layout>
      <div className="py-12 bg-gradient-to-r from-kid-blue to-blue-300 min-h-screen">
        <div className="kid-container">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
            Mi Perfil de Aventurero
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tarjeta de perfil principal */}
            <Card className="kid-card bg-white lg:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative">
                  <Avatar className="w-40 h-40 mx-auto">
                    <AvatarImage src={avatarUrl || userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="rounded-full bg-primary p-2 text-white hover:bg-primary/80 transition-colors">
                        <Upload size={20} />
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={uploadAvatar}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-500 mb-2">{userProfile.level}</div>
                    <p className="text-gray-600">Nivel actual</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">Progreso</span>
                      <span>{userProfile.points}/{userProfile.nextLevel} puntos</span>
                    </div>
                    <Progress value={levelProgress} className="h-3 bg-gray-200" />
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="text-blue-500" />
                      <span className="font-bold">{selectedDates.length} días</span>
                    </div>
                    <p className="text-gray-600">Has ganado {selectedDates.length * 50} puntos por tus días de práctica</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta de estadísticas */}
            <Card className="kid-card bg-white">
              <CardHeader>
                <CardTitle>Mis Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500 text-white rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">
                      {userProfile.stats.exercisesCompleted}
                    </div>
                    <p className="text-sm">Ejercicios completados</p>
                  </div>
                  
                  <div className="bg-red-500 text-white rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">{userProfile.stats.perfectScores}</div>
                    <p className="text-sm">Puntuaciones perfectas</p>
                  </div>
                  
                  <div className="bg-blue-700 text-white rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">{userProfile.stats.timeSpent}</div>
                    <p className="text-sm">Tiempo jugando</p>
                  </div>
                  
                  <div className="bg-red-700 text-white rounded-xl p-4 text-center">
                    <div className="text-md font-bold mb-1">{userProfile.stats.favoriteCategory}</div>
                    <p className="text-sm">Categoría favorita</p>
                  </div>
                </div>
                
                {/* Puntuaciones por categoría */}
                {exerciseStatsByType && Object.keys(exerciseStatsByType).length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-bold text-lg">Progreso por categoría</h3>
                    {Object.entries(exerciseStatsByType).map(([type, data]: [string, any]) => (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>{Math.round(data.avgScore)}%</span>
                        </div>
                        <Progress value={data.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tarjeta de racha */}
            <Card className="kid-card bg-white">
              <CardHeader>
                <CardTitle>Mi Racha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-100 rounded-xl p-6 text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">{userProfile.streak}</div>
                  <p className="text-xl">días seguidos practicando</p>
                  <p className="mt-2 text-sm text-gray-600">¡Sigue así para mantener tu racha!</p>
                  <div className="flex justify-center space-x-1 mt-4">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-6 h-6 rounded-full ${index < userProfile.streak ? 'bg-blue-600' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="text-blue-500 h-5 w-5" />
                    <h3 className="font-bold">Tus puntos</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{userProfile.points}</p>
                  <p className="text-sm text-gray-600">
                    Gana puntos completando ejercicios y manteniendo tu racha diaria.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Ejercicios Problemáticos */}
          {problemExercises && problemExercises.length > 0 && (
            <Card className="kid-card bg-white mt-8">
              <CardHeader>
                <CardTitle>
                  Ejercicios que necesitas practicar más
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problemExercises.map((exercise: any, index: number) => (
                    <div key={index} className="bg-red-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{exercise.exercise_type}</h3>
                          <p className="text-gray-600">Completado: {new Date(exercise.completed_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">{exercise.score}/{exercise.max_score}</p>
                          <p className="text-sm text-gray-500">Puntuación</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link to="/exercises">
                    <Button className="kid-button bg-primary">
                      Practicar ejercicios
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Test Results Section */}
          {testResults && (
            <Card className="kid-card bg-white mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Resultados de mi Test de Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Último test realizado: {new Date(testResults.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {Object.entries(testResults.areas).map(([key, value]: [string, number]) => (
                    <div key={key} className="bg-white p-5 rounded-xl shadow">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg capitalize">
                          {key === 'reading' ? 'Lectura' : 
                           key === 'writing' ? 'Escritura' : 
                           key === 'math' ? 'Matemáticas' : 'Memoria'}
                        </h3>
                        <span className="text-lg font-bold">{value}%</span>
                      </div>
                      <Progress value={value} className="h-3" />
                      <p className="mt-2 text-gray-600">
                        {value <= 25 ? 'Nivel básico' :
                         value <= 50 ? 'Nivel intermedio' :
                         value <= 75 ? 'Necesita práctica' : 'Necesita mucha práctica'}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-kid-green bg-opacity-20 p-4 rounded-xl mb-4">
                  <h3 className="font-bold mb-1">Recomendación principal:</h3>
                  <p>
                    Te recomendamos enfocarte en ejercicios de <strong>{testResults.recommendation.primaryArea}</strong> y 
                    en segundo lugar en <strong>{testResults.recommendation.secondaryArea}</strong>.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Link to="/exercises">
                    <Button className="kid-button bg-primary">
                      Ver ejercicios recomendados
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Calendario de actividad */}
          <Card className="kid-card bg-white mt-8">
            <CardHeader>
              <CardTitle>Mi Calendario de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-xl mb-4 text-sm text-blue-800">
                <p>Los días marcados muestran tu actividad en LearntoRead. ¡Intenta practicar todos los días para mantener tu racha!</p>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Logros */}
          <Card className="kid-card bg-white mt-8">
            <CardHeader>
              <CardTitle>Mis Logros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {userProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <p className={`text-sm mt-2 ${achievement.unlocked ? 'font-bold' : 'text-gray-500'}`}>
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
