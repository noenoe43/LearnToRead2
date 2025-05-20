
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const InteractiveExercisesSection: React.FC = () => {
  const exercises = [
    {
      title: "Juegos de Rimas",
      description: "Encuentra palabras que suenan similar al final",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      color: "bg-kid-orange/30",
      link: "/exercises?category=phonics"
    },
    {
      title: "Asociación Imagen-Palabra",
      description: "Relaciona imágenes con sus palabras correctas",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-kid-blue/30",
      link: "/exercises?category=memory"
    },
    {
      title: "Letras Confusas",
      description: "Practica con letras como 'b', 'd', 'p' y 'q'",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-kid-pink/30",
      link: "/exercises?category=reading"
    },
    {
      title: "Historias Incompletas",
      description: "Completa textos con las palabras que faltan",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "bg-kid-green/30",
      link: "/exercises?category=writing"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-kid-yellow/20 to-white">
      <div className="kid-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-kid-orange/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
            Juegos y Ejercicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Aprender jugando es más divertido</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestros ejercicios interactivos están diseñados por especialistas para mejorar las habilidades de lectura de forma divertida.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {exercises.map((exercise, index) => (
            <Link to={exercise.link} key={index}>
              <Card className={`kid-card ${exercise.color} transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-white p-4 mb-4">
                    {exercise.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{exercise.title}</h3>
                  <p className="text-gray-600 mb-4">{exercise.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/exercises">
            <Button className="kid-button bg-primary text-lg px-8">
              Explorar todos los ejercicios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InteractiveExercisesSection;
