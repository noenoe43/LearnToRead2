
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TestSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-kid-yellow to-white">
      <div className="kid-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Test de diagnóstico</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre qué áreas necesita practicar más tu pequeño con nuestro sencillo test. Te ayudará a seleccionar los ejercicios más adecuados para sus necesidades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="kid-card bg-kid-pink bg-opacity-30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="rounded-full bg-white p-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">¿Para qué sirve el test?</h3>
                  <p className="text-gray-600">
                    Nuestro test ayuda a identificar las áreas específicas donde el niño presenta mayores dificultades, ya sea en:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Lectura y reconocimiento de letras</li>
                    <li>Escritura y ortografía</li>
                    <li>Números y cálculo básico</li>
                    <li>Asociación de sonidos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="kid-card bg-kid-blue bg-opacity-30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="rounded-full bg-white p-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">¿Cómo funciona?</h3>
                  <p className="text-gray-600">
                    El test consiste en una serie de ejercicios simples y divertidos que el niño puede realizar en aproximadamente 10 minutos. Basado en los resultados, el sistema recomendará:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Ejercicios personalizados</li>
                    <li>Un plan de práctica diario</li>
                    <li>Juegos adaptados a sus necesidades</li>
                    <li>Seguimiento de su progreso</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Link to="/test">
            <Button className="kid-button bg-primary text-lg px-8">
              Realizar el test ahora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestSection;
