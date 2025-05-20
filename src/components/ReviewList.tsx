
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Tipo para las valoraciones
type Review = {
  id: number | string;
  name: string;
  rating: number;
  date?: string;
  created_at?: string;
  comment: string;
  avatar: string;
};

// Datos de ejemplo para las valoraciones iniciales (fallback if database is empty)
const initialReviews = [
  {
    id: 1,
    name: "María López",
    rating: 5,
    date: "15 abril, 2025",
    comment: "¡Increíble plataforma! Mi hijo ha mejorado muchísimo su lectura en solo dos meses. Los juegos son divertidos y educativos.",
    avatar: "ML"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    rating: 4,
    date: "3 marzo, 2025",
    comment: "Una herramienta muy útil para los niños con dislexia. Las actividades son entretenidas y mi hija disfruta mucho aprendiendo.",
    avatar: "CR"
  },
  {
    id: 3,
    name: "Ana Martínez",
    rating: 5,
    date: "27 febrero, 2025",
    comment: "Como profesora, recomiendo LearntoRead a todos mis alumnos con dificultades. Los recursos son excelentes y los resultados notables.",
    avatar: "AM"
  },
];

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const reviewsPerPage = 3;
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * reviewsPerPage, page * reviewsPerPage - 1);
        
      if (error) throw error;
      
      const formattedReviews = data.map(review => ({
        ...review,
        date: new Date(review.created_at).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      }));
      
      if (page === 1) {
        setReviews(formattedReviews.length > 0 ? formattedReviews : initialReviews);
      } else {
        setReviews(prevReviews => [...prevReviews, ...formattedReviews]);
      }
      
      setHasMore(count !== null && page * reviewsPerPage < count);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (page === 1) {
        setReviews(initialReviews);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Load initial reviews
  useEffect(() => {
    fetchReviews();
  }, [page]);
  
  // Listen for new reviews
  useEffect(() => {
    const handleNewReview = () => {
      // Reset to first page and reload
      setPage(1);
      fetchReviews();
    };
    
    window.addEventListener('new-review-added', handleNewReview);
    return () => window.removeEventListener('new-review-added', handleNewReview);
  }, []);
  
  // Función para cargar más reviews
  const loadMoreReviews = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Lo que dice nuestra comunidad</h2>
      
      {reviews.map((review) => (
        <Card key={review.id} className="kid-card bg-white/90 backdrop-blur-sm hover:-translate-y-1 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="bg-kid-blue/20">{review.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold">{review.name}</h4>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {hasMore && (
        <div className="text-center mt-8">
          <Button 
            onClick={loadMoreReviews}
            className="kid-button bg-kid-blue hover:bg-kid-blue/90"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar más valoraciones'}
          </Button>
        </div>
      )}
      
      {reviews.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">No hay valoraciones aún. ¡Sé el primero en comentar!</p>
        </div>
      )}
      
      {loading && page === 1 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Cargando valoraciones...</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
