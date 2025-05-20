
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useChatbot } from '@/components/ChatbotProvider';
import { toast } from '@/hooks/use-toast';

interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
}

const ReviewForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>();
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const { addPoints } = useChatbot();
  
  const onSubmit = async (data: ReviewFormData) => {
    if (selectedRating === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una valoración",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const reviewData = {
        name: data.name,
        rating: selectedRating,
        comment: data.comment,
        user_id: user ? user.id : null,
        avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${data.name}`
      };
      
      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);
      
      if (error) throw error;
      
      // Award points for submitting a review (50 points)
      await addPoints(50, 'Has compartido tu experiencia con la comunidad');
      
      toast({
        title: "¡Gracias por tu opinión!",
        description: "Tu comentario ha sido registrado correctamente.",
      });
      
      reset();
      setSelectedRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al enviar tu opinión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card className="kid-card">
      <CardHeader>
        <CardTitle className="text-2xl">Comparte tu opinión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tu nombre</label>
            <Input 
              placeholder="Nombre" 
              {...register("name", { required: true })} 
              defaultValue={profile?.username || ''}
            />
            {errors.name && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tu valoración</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`h-10 w-10 rounded-full ${selectedRating >= rating ? 'bg-yellow-400' : 'bg-gray-200'} flex items-center justify-center text-white transition-colors`}
                  onClick={() => setSelectedRating(rating)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tu comentario</label>
            <Textarea 
              placeholder="Comparte tu experiencia..." 
              rows={4}
              {...register("comment", { required: true })} 
            />
            {errors.comment && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>
          
          <Button 
            type="submit" 
            className="kid-button w-full bg-primary hover:bg-primary/80" 
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar opinión'}
          </Button>
          
          <div className="text-center text-sm text-blue-600 mt-2">
            ¡Ganarás 50 puntos al enviar tu opinión!
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
