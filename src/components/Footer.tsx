
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-kid-purple bg-opacity-20 py-8 mt-12">
      <div className="kid-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LearnToRead</h3>
            <p className="text-gray-600">
              Ayudando a niños con dislexia a aprender de forma divertida y efectiva
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/exercises" className="text-gray-600 hover:text-primary">
                  Ejercicios
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-600 hover:text-primary">
                  Entrar / Registro
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p className="text-gray-600 mb-2">¿Preguntas o sugerencias?</p>
            <p className="text-gray-600">Email: shirley43708@gmail.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} LearnToRead. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
