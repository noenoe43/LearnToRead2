
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import DonationForm from '@/components/DonationForm';

const Donation: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-kid-blue to-blue-100">
        <div className="kid-container">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-900">
              Apoya nuestro proyecto
            </h1>
            
            <Card className="kid-card bg-white mb-12 transform transition-all duration-500 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">¿Por qué donar?</h2>
                    <p className="text-lg mb-6">
                      Tu donación nos permite seguir desarrollando herramientas educativas de calidad para niños con dislexia. Cada contribución marca la diferencia en la vida de un niño.
                    </p>
                    
                    <h3 className="text-xl font-bold mb-2 text-blue-700">Con tu donación podemos:</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start space-x-3">
                        <div className="bg-blue-500 rounded-full p-1 mt-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p>Crear nuevos juegos y ejercicios interactivos</p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="bg-blue-500 rounded-full p-1 mt-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p>Mejorar nuestra plataforma con tecnología adaptativa</p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="bg-blue-500 rounded-full p-1 mt-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p>Ampliar nuestro equipo de educadores y especialistas</p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="bg-blue-500 rounded-full p-1 mt-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p>Ofrecer becas para familias con recursos limitados</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center animate-float">
                    <div className="relative">
                      <div className="absolute -top-6 -right-6 bg-red-500 text-white rounded-full p-3 transform rotate-12">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <img 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" 
                        alt="Snorlax" 
                        className="rounded-3xl bg-white p-4 shadow-lg transform hover:scale-105 transition-all duration-300"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-blue-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">Transparencia</h3>
                  <p className="mb-2">
                    Nos comprometemos con la máxima transparencia en el uso de tus donaciones. 
                    Cada trimestre publicamos un informe detallado de cómo se han utilizado los fondos.
                  </p>
                  <p>
                    Si tienes alguna pregunta sobre nuestro proyecto o el uso de las donaciones, 
                    no dudes en contactarnos en <strong>donaciones@learntoread.com</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Haz tu donación</h2>
              <DonationForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Donation;
