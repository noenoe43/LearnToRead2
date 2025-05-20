
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const CommunitySection: React.FC = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Madre de Lucas, 8 años",
      text: "Desde que empezamos a usar LearntoRead, mi hijo ha ganado mucha confianza con la lectura. Los juegos son divertidos y no se siente como una tarea.",
      avatar: "MG"
    },
    {
      name: "Carlos Ruiz",
      role: "Maestro de primaria",
      text: "Como educador, valoro mucho los recursos que ofrece la plataforma. Mis alumnos con dislexia han mostrado un progreso notable en poco tiempo.",
      avatar: "CR"
    },
    {
      name: "Ana Martínez",
      role: "Terapeuta infantil",
      text: "Recomiendo LearntoRead a todas las familias que buscan complementar las terapias. El enfoque multisensorial es justo lo que necesitan los niños con dislexia.",
      avatar: "AM"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-kid-yellow/20 to-white">
      <div className="kid-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-kid-green/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
            Comunidad y Apoyo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">No estás solo en este camino</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Únete a nuestra comunidad de padres, educadores y niños que comparten experiencias, consejos y celebran los logros juntos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="kid-card transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <svg className="w-10 h-10 text-kid-purple" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-lg mb-6 flex-grow">{testimonial.text}</p>
                  <div className="flex items-center mt-auto">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-kid-blue/20">{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-kid-purple/20 to-kid-pink/20 rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Foro de la comunidad</h3>
              <p className="text-lg mb-6">
                Comparte experiencias, pregunta dudas y conecta con otros padres y educadores en nuestro foro exclusivo para miembros.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/reviews">
                  <button className="kid-button bg-primary text-white px-6 py-3 font-bold rounded-xl">
                    Unirse a la comunidad
                  </button>
                </Link>
                <button className="kid-button bg-white text-primary border-2 border-primary px-6 py-3 font-bold rounded-xl">
                  Ver testimonios
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-kid-green/20">JP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-bold text-sm">Juan Pérez</h5>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <p className="text-sm">Mi hija ha mejorado mucho con los ejercicios de letras confusas. ¿Alguien tiene consejos para practicar en casa?</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-kid-blue/20">LR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-bold text-sm">Laura Ramírez</h5>
                    <p className="text-xs text-gray-500">Hace 5 horas</p>
                  </div>
                </div>
                <p className="text-sm">Los audiolibros con seguimiento visual han sido un gran descubrimiento para nosotros. ¡Mi hijo ahora pide leer todos los días!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
