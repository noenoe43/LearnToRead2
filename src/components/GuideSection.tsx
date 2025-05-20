
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const GuideSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-kid-blue bg-opacity-20">
      <div className="kid-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo Funciona?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guía paso a paso para aprovechar al máximo DislexiDiversión
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="register" className="text-lg py-3">Registro</TabsTrigger>
              <TabsTrigger value="profile" className="text-lg py-3">Perfil</TabsTrigger>
              <TabsTrigger value="exercises" className="text-lg py-3">Ejercicios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="register" className="mt-6">
              <div className="kid-card bg-white">
                <h3 className="text-2xl font-bold mb-4">1. Crea tu cuenta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="mb-4">
                      Primero debes registrarte con la ayuda de un adulto. Es muy fácil:
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Haz clic en el botón "¡Comienza a jugar!"</li>
                      <li>Elige un nombre de usuario divertido</li>
                      <li>Selecciona un avatar que te guste</li>
                      <li>¡Y listo! Ya puedes empezar tu aventura</li>
                    </ul>
                  </div>
                  <div className="bg-kid-yellow rounded-xl p-4 flex justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                      alt="Niño usando una tablet" 
                      className="rounded-lg max-h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <div className="kid-card bg-white">
                <h3 className="text-2xl font-bold mb-4">2. Explora tu perfil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="mb-4">
                      En tu perfil podrás ver:
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Tu racha de días consecutivos jugando</li>
                      <li>Los niveles que has alcanzado</li>
                      <li>Estadísticas de tus ejercicios</li>
                      <li>Recomendaciones personalizadas</li>
                      <li>Frases motivadoras para animarte</li>
                    </ul>
                  </div>
                  <div className="bg-kid-green rounded-xl p-4 flex justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                      alt="Niña viendo estadísticas" 
                      className="rounded-lg max-h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="exercises" className="mt-6">
              <div className="kid-card bg-white">
                <h3 className="text-2xl font-bold mb-4">3. ¡A jugar y aprender!</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="mb-4">
                      Explora nuestros diferentes tipos de ejercicios:
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Juegos de rimas y sonidos</li>
                      <li>Dictados divertidos</li>
                      <li>Historias con palabras faltantes</li>
                      <li>Ejercicios para letras confusas (b/d, p/q)</li>
                      <li>Actividades de voz a texto</li>
                      <li>¡Y muchos más!</li>
                    </ul>
                  </div>
                  <div className="bg-kid-pink rounded-xl p-4 flex justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1009&q=80" 
                      alt="Niños jugando juntos" 
                      className="rounded-lg max-h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default GuideSection;
