
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const AboutDyslexiaSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-kid-blue/20">
      <div className="kid-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-kid-purple/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
            Sobre la Dislexia
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Qué es la dislexia?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La dislexia es una dificultad de aprendizaje que afecta principalmente a la lectura y escritura.
            ¡Pero no te preocupes! Con las herramientas adecuadas, cada niño puede desarrollar todo su potencial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="kid-card bg-kid-pink bg-opacity-20 transform transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">Para niños</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>No significa que seas menos inteligente. De hecho, ¡muchas personas con dislexia son super creativas!</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p>Las letras y palabras pueden parecer que "se mueven" o se confunden, pero ¡hay trucos geniales para hacer que sea más fácil!</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="kid-card bg-kid-green bg-opacity-20 transform transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">Para padres y maestros</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>La detección temprana es clave. Si notas dificultades persistentes en la lectura, busca ayuda profesional.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p>La paciencia, el apoyo y celebrar cada pequeño logro son fundamentales para ayudar a los niños con dislexia.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <p>Las estrategias multisensoriales (ver, escuchar, tocar) son muy efectivas para el aprendizaje.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Link to="/about" className="inline-flex items-center text-primary font-bold hover:underline">
            Aprender más sobre la dislexia
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutDyslexiaSection;
