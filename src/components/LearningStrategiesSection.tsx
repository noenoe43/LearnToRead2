
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LearningStrategiesSection: React.FC = () => {
  const strategies = [
    {
      title: "Enfoque Multisensorial",
      description: "Usar vista, oído y tacto para reforzar el aprendizaje",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
    },
    {
      title: "Mapas Mentales",
      description: "Organizar información visualmente para recordarla mejor",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Lectura Rítmica",
      description: "Seguir un ritmo o usar música para mejorar la fluidez",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      title: "Aprendizaje Personalizado",
      description: "Adaptado al ritmo y necesidades de cada niño",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-kid-purple/20 to-white">
      <div className="kid-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-kid-pink/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
            Estrategias de Aprendizaje
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Métodos que realmente funcionan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre técnicas respaldadas por especialistas en educación para ayudar a los niños con dislexia a mejorar su lectura y escritura.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {strategies.map((strategy, index) => (
            <Card key={index} className="kid-card transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gradient-to-br from-kid-pink/30 to-kid-purple/30 p-4 mb-4">
                  {strategy.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{strategy.title}</h3>
                <p className="text-gray-600">{strategy.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-kid-green/20 to-kid-blue/20 rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">¿Sabías que?</h3>
              <p className="text-lg mb-6">
                Muchas personas famosas y exitosas tienen o tuvieron dislexia, como Albert Einstein, Steven Spielberg, Walt Disney y muchos más. ¡La dislexia no es un límite para alcanzar grandes logros!
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white py-2 px-4 rounded-full text-primary font-medium">Creatividad</span>
                <span className="bg-white py-2 px-4 rounded-full text-primary font-medium">Pensamiento visual</span>
                <span className="bg-white py-2 px-4 rounded-full text-primary font-medium">Resolución de problemas</span>
                <span className="bg-white py-2 px-4 rounded-full text-primary font-medium">Persistencia</span>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                alt="Niños aprendiendo" 
                className="rounded-2xl shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningStrategiesSection;
