
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState("mission");
  
  return (
    <Layout>
      <div className="py-12 bg-gradient-to-r from-kid-blue to-blue-200">
        <div className="kid-container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-900 animate-fade-in">
                ¡Bienvenido a <span className="text-red-500">LearnToRead</span>!
              </h1>
              <p className="text-xl text-blue-800 max-w-3xl mx-auto">
                Tu compañero educativo para niños con dislexia
              </p>
            </div>
            
            <Card className="kid-card bg-white mb-12 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
                <Tabs defaultValue="mission" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-2 bg-blue-600">
                    <TabsTrigger 
                      value="mission" 
                      className={activeTab === "mission" ? "text-white bg-blue-800" : "text-blue-100"}
                    >
                      Nuestra Misión
                    </TabsTrigger>
                    <TabsTrigger 
                      value="approach" 
                      className={activeTab === "approach" ? "text-white bg-blue-800" : "text-blue-100"}
                    >
                      Enfoque Educativo
                    </TabsTrigger>
                    <TabsTrigger 
                      value="team" 
                      className={activeTab === "team" ? "text-white bg-blue-800" : "text-blue-100"}
                    >
                      Nuestro Equipo
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <CardContent className="p-0">
                <Tabs defaultValue="mission" value={activeTab} className="w-full">
                  <TabsContent value="mission" className="mt-0 animate-fade-in">
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-red-500">Nuestra Misión</h2>
                          <p className="text-lg mb-6">
                            En LearnToRead creemos que todos los niños merecen aprender de forma divertida y adaptada 
                            a sus necesidades. Nuestra misión es ayudar a niños con dislexia a mejorar sus 
                            habilidades de lectura, escritura y comprensión a través de juegos y ejercicios 
                            interactivos diseñados específicamente para ellos.
                          </p>
                          
                          <h3 className="text-xl font-bold mb-2">¿Qué es la dislexia?</h3>
                          <p className="mb-4">
                            La dislexia es una dificultad de aprendizaje que afecta la capacidad de leer, 
                            escribir y procesar información. Afecta a aproximadamente el 10% de la población 
                            y no está relacionada con la inteligencia. Con las herramientas adecuadas, los 
                            niños con dislexia pueden mejorar significativamente sus habilidades y tener éxito académico.
                          </p>
                        </div>
                        
                        <div className="flex justify-center animate-float">
                          <img 
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" 
                            alt="Mascota" 
                            className="rounded-xl shadow-lg object-cover hover:scale-110 transition-transform duration-300"
                            style={{ maxHeight: "300px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="approach" className="mt-0 animate-fade-in">
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-blue-600">Nuestro Enfoque Educativo</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-100 rounded-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
                          <div className="bg-blue-500 text-white rounded-full p-3 mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold mb-2">Visual</h3>
                          <p>Utilizamos recursos visuales atractivos y adaptados para facilitar la comprensión y el aprendizaje.</p>
                        </div>
                        
                        <div className="bg-red-100 rounded-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
                          <div className="bg-red-500 text-white rounded-full p-3 mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold mb-2">Auditivo</h3>
                          <p>Integramos ejercicios de sonidos, rimas y reconocimiento fonológico para reforzar el aprendizaje.</p>
                        </div>
                        
                        <div className="bg-blue-100 rounded-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
                          <div className="bg-blue-500 text-white rounded-full p-3 mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold mb-2">Kinestésico</h3>
                          <p>Proporcionamos actividades interactivas que involucran el movimiento y la escritura para un aprendizaje completo.</p>
                        </div>
                      </div>
                      
                      <div className="mt-8 bg-black text-white rounded-xl p-6">
                        <h3 className="text-2xl font-bold mb-4">Beneficios de LearnToRead</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                              <div className="bg-red-500 rounded-full p-1 mt-1 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p>Mejora la fluidez y comprensión lectora</p>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="bg-red-500 rounded-full p-1 mt-1 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p>Desarrolla habilidades fonológicas y conciencia fonémica</p>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="bg-red-500 rounded-full p-1 mt-1 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p>Refuerza la memoria y las asociaciones visuales</p>
                            </li>
                          </ul>
                          <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                              <div className="bg-red-500 rounded-full p-1 mt-1 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p>Aumenta la confianza y la motivación para el aprendizaje</p>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="bg-red-500 rounded-full p-1 mt-1 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p>Proporciona un entorno de aprendizaje positivo y divertido</p>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="bg-red-500 rounded-full p-1 mt-1 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p>Personaliza el aprendizaje según las necesidades de cada niño</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="team" className="mt-0 animate-fade-in">
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-blue-700">Nuestro Equipo</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            className="bg-blue-50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto mb-4 overflow-hidden">
                            <img
                                src="https://media.tenor.com/ITL556MnC1wAAAAe/coquette-hampter.png"
                                alt="Shirley Noelia"
                                className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-lg font-bold">Shirley Noelia</h3>
                          <p className="text-blue-700 mb-2">Directora Educativa & Creadora de esta plataforma</p>
                          <p className="text-sm">Especialista en Pedagogía Terapéutica con más de 15 años de
                            experiencia. Comprometida con ayudar a niños con dislexia a través de herramientas digitales
                            creadas con amor y dedicación.</p>

                        </div>
                        <div
                            className="bg-blue-50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto mb-4 overflow-hidden">
                            <img
                                src="https://i.pinimg.com/736x/5b/41/b3/5b41b3b94dc5b55e9867fef2434d7526.jpg"
                                alt="aless"
                                className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-lg font-bold">Alessandro Nicolás</h3>
                          <p className="text-blue-700 mb-2">Colaborador en Diseño</p>
                          <p className="text-sm">Apoyó en el diseño visual de la plataforma, aportando ideas frescas y
                            funcionales para lograr una experiencia accesible y atractiva.</p>


                        </div>


                      </div>

                      <div className="mt-8 text-center">
                        <Button className="bg-blue-700 hover:bg-blue-800">Únete a nuestro equipo</Button>
                      </div>

                      <div className="bg-blue-100 rounded-xl p-6 mt-8 text-center">
                        <h3 className="text-xl font-bold mb-2 text-blue-700">Contáctanos</h3>
                        <p className="mb-4">
                          ¿Tienes alguna pregunta o sugerencia? No dudes en contactarnos.
                        </p>
                        <p>
                          Email: <strong>shirley43708@gmail.com</strong>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button className="bg-red-500 hover:bg-red-600 mr-4">
                <Link to="/exercises">Explorar Ejercicios</Link>
              </Button>
              <Button className="bg-blue-700 hover:bg-blue-800">
                <Link to="/donation">Apoyar el Proyecto</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
