
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DonationSection: React.FC = () => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomAmount, setShowCustomAmount] = useState<boolean>(false);

  const handleDonation = (amount: string) => {
    alert(`Gracias por tu donación de ${amount}€. ¡Tu apoyo ayudará a mejorar nuestra plataforma!`);
  };

  const handleCustomDonation = () => {
    if (customAmount && !isNaN(parseFloat(customAmount))) {
      handleDonation(customAmount);
    } else {
      alert('Por favor, introduce una cantidad válida');
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-kid-pink to-kid-purple text-white">
      <div className="kid-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Apoya nuestro proyecto</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Tu donación nos permite seguir mejorando nuestras herramientas educativas 
            para ayudar a más niños con dislexia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white text-gray-800">
            <CardHeader>
              <CardTitle className="text-center">Colaborador</CardTitle>
              <div className="text-center text-3xl font-bold text-primary">5€</div>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="mb-4">
                Tu apoyo nos ayuda a mantener la plataforma
              </CardDescription>
              <Button 
                className="bg-primary hover:bg-primary/80"
                onClick={() => handleDonation('5')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Donar 5€
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white text-gray-800 border-2 border-primary transform -translate-y-4">
            <CardHeader>
              <div className="text-center bg-primary text-white py-1 px-4 rounded-full w-fit mx-auto -mt-8 mb-2">
                Popular
              </div>
              <CardTitle className="text-center">Amigo</CardTitle>
              <div className="text-center text-3xl font-bold text-primary">15€</div>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="mb-4">
                Ayuda con el desarrollo de nuevos ejercicios
              </CardDescription>
              <Button 
                className="bg-primary hover:bg-primary/80"
                onClick={() => handleDonation('15')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Donar 15€
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white text-gray-800">
            <CardHeader>
              <CardTitle className="text-center">Patrocinador</CardTitle>
              <div className="text-center text-3xl font-bold text-primary">30€</div>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="mb-4">
                Contribuye al crecimiento de nuestra plataforma
              </CardDescription>
              <Button 
                className="bg-primary hover:bg-primary/80"
                onClick={() => handleDonation('30')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Donar 30€
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          {!showCustomAmount ? (
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => setShowCustomAmount(true)}
            >
              Otra cantidad
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xs mx-auto">
              <Input
                type="number"
                placeholder="Cantidad en €"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="bg-white text-gray-800"
              />
              <Button 
                className="bg-white text-primary hover:bg-primary hover:text-white"
                onClick={handleCustomDonation}
              >
                Donar
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-sm">
            <p>Datos bancarios:</p>
            <p>IBAN: ES12 3456 7890 1234 5678 9012</p>
            <p>BIC/SWIFT: ABCDESMMXXX</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
