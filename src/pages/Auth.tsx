
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';
import useAuth from '@/hooks/useAuth';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'register';
  const { user } = useAuth();
  
  // Redirección si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="py-12 bg-gradient-to-r from-kid-blue via-blue-200 to-blue-300">
        <div className="kid-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
                  {mode === 'register' ? '¡Únete a la aventura!' : '¡Bienvenido de vuelta!'}
                </h1>
                <p className="text-lg mb-6 text-blue-700">
                  {mode === 'register' 
                    ? 'Crea tu cuenta de aventurero para empezar a jugar y aprender con LearntoRead.' 
                    : 'Inicia sesión para continuar tu aventura de aprendizaje.'}
                </p>
                
                <div className="relative">
                  <div className="animate-float bg-red-500 rounded-full p-3 absolute -top-10 right-0">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" 
                    alt="Squirtle" 
                    className="rounded-3xl object-cover mx-auto h-64 bg-white p-4"
                  />
                </div>
              </div>
              
              <div>
                {mode === 'register' ? <RegisterForm /> : <LoginForm />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
