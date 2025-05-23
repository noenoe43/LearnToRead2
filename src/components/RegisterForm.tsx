import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Por favor, completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!acceptTerms) {
      setFormError('Debes aceptar los términos y condiciones');
      return;
    }
    
    try {
      const response = await signUp(email, password, { username: name });
      
      if (response && response.user) {

        toast({
          title: "¡Bienvenido!",
          description: "Para poder personalizar tu experiencia, te invitamos a realizar un breve test diagnóstico.",
        });
        navigate('/test');
      } else {
        // Si no tenemos respuesta con user, redirigimos al test por defecto
        navigate('/test');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      // El mensaje de error ya se muestra en un toast desde useAuth
    }
  };

  return (
    <Card className="kid-card bg-white w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Crea tu cuenta</CardTitle>
        <CardDescription>Ingresa tus datos para comenzar tu aventura</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formError && (
          <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              placeholder="Tu nombre" 
              className="kid-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="tu-email@ejemplo.com" 
              className="kid-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••••" 
              className="kid-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••••" 
              className="kid-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los términos y condiciones
              </label>
              <p className="text-sm text-gray-500">
                Al registrarte, estás aceptando nuestra{" "}
                <Link to="#" className="text-primary hover:underline">
                  política de privacidad
                </Link>
                .
              </p>
            </div>
          </div>
          
          <Button type="submit" className="w-full kid-button bg-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/auth?mode=login" className="text-primary font-bold hover:underline">
            ¡Inicia sesión!
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
