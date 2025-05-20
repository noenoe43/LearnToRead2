
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

type DonationOption = {
  id: string;
  amount: number;
  label: string;
  description: string;
};

const DonationForm: React.FC = () => {
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
  const [selectedOption, setSelectedOption] = useState<string>('option2');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  
  const donationOptions: DonationOption[] = [
    {
      id: 'option1',
      amount: 5,
      label: '5€',
      description: 'Ayuda a un niño con materiales básicos'
    },
    {
      id: 'option2',
      amount: 15,
      label: '15€',
      description: 'Proporciona recursos para toda una clase'
    },
    {
      id: 'option3',
      amount: 30,
      label: '30€',
      description: 'Contribuye al desarrollo de nuevos ejercicios'
    },
    {
      id: 'option4',
      amount: 50,
      label: '50€',
      description: 'Patrocina un mes de nuestra plataforma'
    },
    {
      id: 'optionCustom',
      amount: 0,
      label: 'Cantidad personalizada',
      description: 'Elige la cantidad que deseas donar'
    }
  ];
  
  const selectedOptionData = donationOptions.find(option => option.id === selectedOption);

  // Check for success or canceled payment status from URL
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      toast.success('¡Gracias por tu donación!', {
        description: 'Tu contribución ayudará a mejorar nuestra plataforma para niños con dislexia.'
      });
    }
    
    if (canceled === 'true') {
      toast.error('Donación cancelada', {
        description: 'Tu donación ha sido cancelada. Puedes intentarlo de nuevo si lo deseas.'
      });
    }
  }, [searchParams]);
  
  const handleSubmitAmount = () => {
    if (selectedOption === 'optionCustom' && (!customAmount || parseFloat(customAmount) <= 0)) {
      toast.error('Por favor, introduce una cantidad válida');
      return;
    }
    
    setStep('payment');
  };
  
  const initiateStripePayment = async () => {
    setIsSubmitting(true);
    
    try {
      const amount = selectedOption === 'optionCustom' 
        ? parseFloat(customAmount) 
        : selectedOptionData?.amount || 0;
      
      const paymentType = selectedOption === 'optionCustom'
        ? `Donación de ${amount}€`
        : `Donación - ${selectedOptionData?.description}`;
        
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount, paymentType }
      });
      
      if (error) throw error;
      if (!data.url) throw new Error('No se recibió URL de pago');
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error al iniciar el pago:', error);
      toast.error('Error al procesar el pago', {
        description: error.message || 'Por favor, intenta de nuevo más tarde'
      });
      setIsSubmitting(false);
    }
  };
  
  // Formateadores para los campos de tarjeta
  const formatCardNumber = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '');
    return numeric.substring(0, 16);
  };
  
  const formatExpiryDate = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '');
    if (numeric.length <= 2) return numeric;
    return `${numeric.substring(0, 2)}/${numeric.substring(2, 4)}`;
  };
  
  const formatCVC = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '');
    return numeric.substring(0, 3);
  };

  return (
    <Card className="kid-card bg-white max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {step === 'amount' 
            ? 'Elige una cantidad para donar' 
            : 'Confirma tu donación'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'amount' ? (
          <>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
              {donationOptions.map(option => (
                <div 
                  key={option.id} 
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedOption === option.id 
                      ? 'bg-blue-50 border-2 border-blue-500' 
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mr-4" />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="text-lg font-bold cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            
            {selectedOption === 'optionCustom' && (
              <div className="mt-4">
                <Label htmlFor="customAmount">Cantidad (€)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <Input
                    id="customAmount"
                    type="number"
                    min="1"
                    step="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-8"
                    placeholder="Introduce la cantidad"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
              <p className="text-blue-800">
                Serás redirigido a una página segura de Stripe para completar tu donación
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <div className="flex justify-between">
                <span>Total a donar:</span>
                <span className="font-bold">
                  {selectedOption === 'optionCustom' 
                    ? `${customAmount || 0}€` 
                    : `${selectedOptionData?.amount || 0}€`}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {step === 'amount' ? (
          <Button 
            onClick={handleSubmitAmount} 
            className="kid-button bg-primary hover:bg-primary/90 w-full"
          >
            Continuar
          </Button>
        ) : (
          <>
            <Button 
              onClick={() => setStep('amount')}
              variant="outline" 
              className="kid-button w-full sm:w-auto"
            >
              Volver
            </Button>
            <Button 
              onClick={initiateStripePayment}
              className="kid-button bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Completar donación'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DonationForm;
