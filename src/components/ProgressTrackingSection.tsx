
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProgressTrackingSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-kid-yellow/20">
      <div className="kid-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-kid-blue/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
            Seguimiento del Progreso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Celebra cada logro</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro sistema de seguimiento permite ver el avance en tiempo real, motivando a los niños a seguir mejorando.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Panel de progreso</h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Lectura</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-4 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Escritura</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-4 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Asociación</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-4 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Memoria</span>
                    <span>70%</span>
                  </div>
                  <Progress value={70} className="h-4 bg-gray-100" />
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-kid-pink/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">7</div>
                  <div className="text-sm">Días seguidos</div>
                </div>
                <div className="bg-kid-blue/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">25</div>
                  <div className="text-sm">Ejercicios completados</div>
                </div>
                <div className="bg-kid-green/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm">Horas de práctica</div>
                </div>
                <div className="bg-kid-purple/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm">Nivel actual</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="kid-card bg-gradient-to-br from-kid-orange/20 to-kid-pink/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Logros y recompensas</h3>
                <p className="text-lg mb-6">
                  Cada ejercicio completado desbloquea logros y recompensas virtuales que motivan a seguir aprendiendo.
                </p>
                
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${i < 3 ? 'bg-kid-green' : 'bg-gray-200'}`}>
                        <svg className={`w-8 h-8 ${i < 3 ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <p className={`text-sm mt-2 ${i < 3 ? 'font-bold' : 'text-gray-500'}`}>
                        {i === 0 ? 'Racha 7 días' : 
                         i === 1 ? '10 ejercicios' :
                         i === 2 ? 'Nivel 5' :
                         'Bloqueado'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="kid-card bg-gradient-to-br from-kid-blue/20 to-kid-purple/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Para padres y educadores</h3>
                <p className="text-lg mb-6">
                  Informes detallados para seguir el progreso del niño y conocer las áreas que necesitan más refuerzo.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Informes semanales por correo electrónico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Recomendaciones personalizadas de ejercicios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Gráficos de progreso detallados</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressTrackingSection;
