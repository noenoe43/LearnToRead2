
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-kid-blue via-blue-300 to-blue-400 py-16 md:py-24">
      <div className="kid-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="animate-bounce inline-block bg-white text-primary font-bold py-2 px-4 rounded-full mb-4">
              ¡Nuevo!
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-red-500">Learn</span>
              <span className="text-white">to</span>
              <span className="text-blue-900">Read</span>
              <span className="block mt-2 text-white">¡Aprender es una aventura!</span>
            </h1>
            <p className="text-xl mb-8 max-w-lg mx-auto md:mx-0 text-white">
              Juegos y ejercicios divertidos para ayudar a niños con dislexia a mejorar sus habilidades de lectura y escritura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/auth">
                <Button className="kid-button bg-red-500 text-white text-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                  ¡Comienza a jugar!
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="kid-button bg-transparent text-white border-2 border-white text-lg hover:bg-white hover:text-blue-700 transition-all duration-300">
                  Saber más
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square w-full max-w-md mx-auto bg-white rounded-full p-6 shadow-xl">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png"
                alt="Snorlax"
                className="rounded-full object-contain h-full w-full p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
