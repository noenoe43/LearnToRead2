
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useStorageInit() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initStorage = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('storage-init');
        
        if (error) {
          console.error('Error initializing storage:', error);
          toast.error('Error al inicializar el almacenamiento');
          return;
        }
        
        console.log('Storage initialization response:', data);
        setInitialized(true);
        toast.success('Almacenamiento inicializado correctamente');
      } catch (error) {
        console.error('Error initializing storage:', error);
        toast.error('Error al inicializar el almacenamiento');
      } finally {
        setLoading(false);
      }
    };
    
    initStorage();
  }, []);
  
  return { initialized, loading };
}
