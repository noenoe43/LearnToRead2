
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Question = {
  id: number;
  text: string;
  type: 'reading' | 'writing' | 'math' | 'memory';
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "¿Tu niño confunde letras similares como 'b' y 'd', o 'p' y 'q'?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 2,
    text: "¿Le cuesta trabajo leer en voz alta?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 3,
    text: "¿Tiene dificultad para escribir palabras sencillas?",
    type: 'writing',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 4,
    text: "¿Cambia el orden de las letras al escribir?",
    type: 'writing',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 5,
    text: "¿Tiene dificultad para aprender a contar o reconocer números?",
    type: 'math',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 6,
    text: "¿Le cuesta recordar secuencias numéricas como el teléfono?",
    type: 'math',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 7,
    text: "¿Tiene dificultad para recordar instrucciones verbales?",
    type: 'memory',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 8,
    text: "¿Le cuesta trabajo recordar el nombre de objetos o personas?",
    type: 'memory',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 9,
    text: "¿Tiene dificultad para seguir una historia cuando se le lee?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 10,
    text: "¿Le resulta difícil formar rimas?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 11,
    text: "¿Le cuesta reconocer sonidos iniciales o finales en palabras?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 12,
    text: "¿Evita leer o se muestra frustrado al intentarlo?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 13,
    text: "¿Tiene dificultad para copiar texto de la pizarra o de un libro?",
    type: 'writing',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 14,
    text: "¿Su caligrafía es desordenada o irregular?",
    type: 'writing',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 15,
    text: "¿Tiene dificultad para aprender nuevas palabras?",
    type: 'memory',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 16,
    text: "¿Le cuesta trabajo recordar la secuencia de los días de la semana o los meses?",
    type: 'memory',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 17,
    text: "¿Tiene dificultad para entender conceptos matemáticos básicos?",
    type: 'math',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 18,
    text: "¿Le cuesta trabajo seguir instrucciones con varios pasos?",
    type: 'memory',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 19,
    text: "¿Evita actividades que requieren lectura o escritura?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  },
  {
    id: 20,
    text: "¿Se distrae fácilmente durante actividades de lectura o escritura?",
    type: 'reading',
    options: ['Nunca', 'A veces', 'Con frecuencia', 'Siempre']
  }
];

const DiagnosticTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [lastTestDate, setLastTestDate] = useState<string | null>(null);
  const [canTakeTest, setCanTakeTest] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkTestStatus = async () => {
      setLoading(true);
      
      // If not logged in, can always take the test
      if (!user) {
        setCanTakeTest(true);
        setLoading(false);
        return;
      }
      
      try {
        // Check if the user already has test results in the database
        const { data, error } = await supabase
          .from('test_results')
          .select('date')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          // We found test results, check the date
          const testDate = new Date(data.date);
          const currentDate = new Date();
          
          // Calculate days between dates
          const timeDiff = currentDate.getTime() - testDate.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          
          // Only allow one test per week (7 days)
          if (daysDiff < 7) {
            setCanTakeTest(false);
            setLastTestDate(data.date);
          } else {
            setCanTakeTest(true);
          }
        } else {
          // No test results found, user can take the test
          setCanTakeTest(true);
        }
      } catch (error) {
        console.error('Error checking test status:', error);
        // In case of error, allow test to be taken
        setCanTakeTest(true);
      } finally {
        setLoading(false);
      }
    };
    
    checkTestStatus();
  }, [user]);
  
  const handleAnswer = (value: string) => {
    const answerIndex = questions[currentQuestion].options.indexOf(value);
    setAnswers({...answers, [questions[currentQuestion].id]: answerIndex});
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setShowResults(true);
      const currentDate = new Date().toISOString();
      localStorage.setItem('lastTestDate', currentDate);
      setLastTestDate(currentDate);
    }
  };
  
  const calculateResults = () => {
    const results = {
      reading: 0,
      writing: 0,
      math: 0,
      memory: 0
    };
    
    let total = 0;
    
    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        results[q.type] += answers[q.id];
        total += 1;
      }
    });
    
    Object.keys(results).forEach(key => {
      const k = key as keyof typeof results;
      const questionsOfType = questions.filter(q => q.type === k).length;
      const maxScore = questionsOfType * 3;
      results[k] = Math.round((results[k] / maxScore) * 100);
    });
    
    return results;
  };
  
  const getRecommendations = (results: ReturnType<typeof calculateResults>) => {
    const areas = Object.entries(results)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key);
    
    const areaNames = {
      reading: 'Lectura',
      writing: 'Escritura',
      math: 'Matemáticas',
      memory: 'Memoria'
    };
    
    return {
      primaryArea: areaNames[areas[0] as keyof typeof areaNames],
      secondaryArea: areaNames[areas[1] as keyof typeof areaNames]
    };
  };
  
  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };
  
  const saveResults = async () => {
    if (!user) {
      // Not logged in - store in localStorage only
      const results = calculateResults();
      const recommendations = getRecommendations(results);
      
      // Guardar los resultados en localStorage
      const testData = {
        date: new Date().toISOString(),
        areas: results,
        recommendation: recommendations
      };
      
      localStorage.setItem('test-results', JSON.stringify(testData));
      localStorage.setItem('lastTestDate', new Date().toISOString());
      setLastTestDate(new Date().toISOString());
      
      toast({
        title: "Resultados guardados",
        description: "Hemos guardado tus resultados localmente. Para guardarlos en tu cuenta, inicia sesión.",
      });
      return;
    }
    
    // User is logged in - save to database
    try {
      const results = calculateResults();
      const recommendations = getRecommendations(results);
      
      // Save to database
      const { error } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          areas: results,
          recommendation: recommendations,
          date: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Also save to localStorage
      const testData = {
        date: new Date().toISOString(),
        areas: results,
        recommendation: recommendations
      };
      
      localStorage.setItem('test-results', JSON.stringify(testData));
      localStorage.setItem('lastTestDate', new Date().toISOString());
      setLastTestDate(new Date().toISOString());
      
      toast({
        title: "Resultados guardados",
        description: "Hemos guardado tus resultados y personalizado tus recomendaciones.",
      });
      
      // Si el usuario está autenticado, agregamos puntos
      if (user) {
        const currentPoints = parseInt(localStorage.getItem('user-points') || '0');
        localStorage.setItem('user-points', (currentPoints + 200).toString());
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "No pudimos guardar tus resultados. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const getNextTestDate = (dateString: string | null) => {
    if (!dateString) return '';
    const lastDate = new Date(dateString);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 7); // Set to 7 days instead of a month
    return nextDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-kid-yellow to-white min-h-screen">
        <div className="kid-container">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Test de Diagnóstico
          </h1>
          
          {loading ? (
            <Card className="kid-card max-w-3xl mx-auto">
              <CardContent className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                  <p className="text-lg">Cargando...</p>
                </div>
              </CardContent>
            </Card>
          ) : !canTakeTest && !showResults ? (
            <Card className="kid-card max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-center">
                  Test no disponible
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Calendar className="w-16 h-16 text-primary" />
                  <p className="text-lg">
                    Ya has realizado el test este mes ({formatDate(lastTestDate)}).
                  </p>
                  <p>
                    Podrás volver a realizar el test a partir del {getNextTestDate(lastTestDate)}.
                  </p>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Link to="/exercises">
                    <Button className="kid-button bg-primary">
                      Ver ejercicios recomendados
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : !showResults ? (
            <Card className="kid-card max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Pregunta {currentQuestion + 1} de {questions.length}</span>
                  <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <CardTitle className="text-xl md:text-2xl">
                  {questions[currentQuestion].text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup className="gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleAnswer(option)}>
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-lg">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                  >
                    Anterior
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => currentQuestion < questions.length - 1 && setCurrentQuestion(currentQuestion + 1)}
                    disabled={currentQuestion === questions.length - 1 || answers[questions[currentQuestion].id] === undefined}
                  >
                    Saltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="kid-card mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl text-center">Resultados del Test</CardTitle>
                  <CardDescription className="text-center text-lg">
                    Basado en tus respuestas, hemos identificado las áreas en las que tu pequeño puede mejorar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(calculateResults()).map(([key, value]) => (
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
                  
                  <div className="mt-8 bg-kid-green bg-opacity-20 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2">Recomendaciones</h3>
                    {(() => {
                      const results = calculateResults();
                      const { primaryArea, secondaryArea } = getRecommendations(results);
                      return (
                        <div>
                          <p className="mb-4">
                            Basado en el test, recomendamos enfocarse principalmente en ejercicios de <strong>{primaryArea}</strong> y secundariamente en <strong>{secondaryArea}</strong>.
                          </p>
                          <p>
                            Hemos personalizado un plan de ejercicios para ayudar a mejorar estas áreas. ¡Comienza con 15 minutos diarios para ver resultados!
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-blue-600" />
                      <p>
                        <strong>Recuerda:</strong> Podrás volver a realizar este test a partir del {getNextTestDate(lastTestDate)}.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button onClick={saveResults} className="kid-button bg-primary">
                      Guardar resultados
                    </Button>
                    <Link to="/profile">
                      <Button className="kid-button bg-blue-600">
                        Ver en mi perfil
                      </Button>
                    </Link>
                    <Link to="/exercises">
                      <Button className="kid-button bg-accent">
                        Ver ejercicios recomendados
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticTest;
