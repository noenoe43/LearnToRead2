
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Reviews: React.FC = () => {
  const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';

  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-blue-100 to-purple-100">
        <div className="kid-container">
          <div className="text-center mb-12">
            <span className="inline-block bg-kid-green/20 text-primary font-bold py-2 px-4 rounded-full mb-4">
              Comunidad
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">¿Qué opinas de LearntoRead?</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tus comentarios nos ayudan a mejorar. Comparte tu experiencia con nuestra plataforma y lee lo que otros usuarios han dicho.
            </p>
            
            {!isAuthenticated && (
              <div className="mt-6 bg-blue-50 p-4 rounded-xl inline-block">
                <p className="font-medium text-blue-800 mb-2">
                  ¡Únete a nuestra comunidad y gana 100 puntos!
                </p>
                <Link to="/auth">
                  <Button className="kid-button bg-blue-600 hover:bg-blue-700">
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Card className="kid-card mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Forma parte de nuestra comunidad</h2>
                  <p className="mb-4">
                    Al unirte a nuestra comunidad, podrás compartir tus experiencias, hacer preguntas a otros padres y educadores, y ayudar a otros niños con dislexia.
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>Comparte tu experiencia con LearntoRead</li>
                    <li>Conecta con otros padres y educadores</li>
                    <li>Recibe consejos personalizados</li>
                    <li>Participa en eventos exclusivos</li>
                  </ul>
                </CardContent>
              </Card>
              <ReviewForm />
            </div>
            <div>
              <ReviewList />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
