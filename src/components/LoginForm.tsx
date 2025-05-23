
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  
  const checkTestStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;

      if (!data) {
        toast({
          title: "¡Bienvenido!",
          description: "Para poder personalizar tu experiencia, te invitamos a realizar un breve test diagnóstico.",
        });
        navigate('/test');
      } else {
        // El usuario ya ha realizado el test
        toast({
          title: "¡Bienvenido de vuelta!",
          description: "Te hemos redirigido a tu perfil.",
        });
        navigate('/profile');
      }
    } catch (error) {
      console.error("Error al verificar estado del test:", error);
      navigate('/profile');
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!email || !password) {
      setFormError('Por favor, ingresa tu email y contraseña');
      return;
    }
    try {
      await signIn(email, password);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await checkTestStatus(user.id);
      } else {

        navigate('/profile');
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
    }
  };

  return (
    <Card className="kid-card bg-white w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Inicia sesión</CardTitle>
        <CardDescription>Ingresa tus datos para continuar tu aventura</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formError && (
          <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
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
          
          <div className="flex justify-end">
            <Link to="#" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <Button type="submit" className="w-full kid-button bg-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/auth?mode=register" className="text-primary font-bold hover:underline">
            ¡Regístrate!
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
