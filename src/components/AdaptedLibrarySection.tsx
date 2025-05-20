
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdaptedLibrarySection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-kid-purple/20">
      <div className="kid-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-kid-green/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
            Biblioteca Adaptada
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lecturas pensadas para todos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Historias fascinantes con tipografía especial, ajustes de contraste y opción de audio para hacer la lectura más accesible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                alt="Niño leyendo un libro" 
                className="rounded-2xl shadow-xl"
              />
              
              <div className="absolute -bottom-10 -right-10 z-10">
                <div className="bg-white rounded-full p-4 shadow-lg animate-bounce">
                  <svg className="w-12 h-12 text-kid-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute -top-8 -left-8 z-10 hidden md:block">
                <div className="bg-kid-yellow rounded-2xl p-6 shadow-lg transform -rotate-6 font-dyslexic">
                  <span className="text-xl font-bold">Ejemplos de texto con fuente OpenDyslexic</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6">
            <h3 className="text-2xl font-bold mb-6">Características especiales</h3>
            
            <div className="space-y-6">
              <Card className="kid-card bg-kid-blue/20">
                <CardContent className="p-5">
                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-white p-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Tipografía amigable</h4>
                      <p>Fuentes especiales como OpenDyslexic que facilitan la lectura</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="kid-card bg-kid-pink/20">
                <CardContent className="p-5">
                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-white p-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Audio sincronizado</h4>
                      <p>Las palabras se iluminan mientras se escucha la narración</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="kid-card bg-kid-green/20">
                <CardContent className="p-5">
                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-white p-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Preguntas de comprensión</h4>
                      <p>Actividades interactivas después de cada lectura</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Button className="kid-button bg-primary text-lg px-8">
                Explorar la biblioteca
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdaptedLibrarySection;
