
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import DictationSection from '@/components/exercises/DictationSection';
import ReadingExercise from '@/components/exercises/ReadingExercise';
import PhonicAwarenessExercise from '@/components/exercises/PhonicAwarenessExercise';
import LetterDifferentiationExercise from '@/components/exercises/LetterDifferentiationExercise';
import WordFormationExercise from '@/components/exercises/WordFormationExercise';

const Exercises: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('reading');

  const exerciseCategories = [
    {
      id: 'reading',
      title: 'Lectura',
      description: 'Mejora tu fluidez y comprensión lectora',
      exercise: (
        <ReadingExercise />
      )
    },
    {
      id: 'writing',
      title: 'Escritura',
      description: 'Practica tu escritura y ortografía',
      exercise: (
        <DictationSection />
      )
    },
    {
      id: 'phonics',
      title: 'Conciencia Fonológica',
      description: 'Aprende a reconocer sonidos y sílabas',
      exercise: (
        <PhonicAwarenessExercise />
      )
    },
    {
      id: 'differentiation',
      title: 'Diferenciación de Letras',
      description: 'Mejora tu capacidad para distinguir letras similares',
      exercise: (
        <LetterDifferentiationExercise />
      )
    },
    {
      id: 'wordformation',
      title: 'Formación de Palabras',
      description: 'Practica la ortografía y formación de palabras',
      exercise: (
        <WordFormationExercise />
      )
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-kid-yellow to-white">
        <div className="kid-container">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Ejercicios y Juegos
          </h1>
          
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto mb-8">
              {exerciseCategories.map(category => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id} 
                  className="text-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {exerciseCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="md:max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{category.description}</p>
                  {category.exercise}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Exercises;
