
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, ArrowRight, Bot, Loader2, LightbulbIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import { useChatbot } from './ChatbotProvider';
import { useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  initialMessage?: string;
  contextData?: {
    currentExercise?: {
      id: string;
      title: string;
      type: string;
    };
    exerciseCompleted?: boolean;
    score?: number;
    maxScore?: number;
  }
}

const ChatbotAssistant: React.FC<ChatbotProps> = ({ initialMessage, contextData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { setPageContext, pageContext } = useChatbot();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageInfo = '';
    
    switch(path) {
      case '/':
        pageInfo = 'Página de inicio con información general sobre LearnToRead, una aplicación diseñada para ayudar a niños con dislexia a mejorar sus habilidades de lectura y escritura. Aquí encontrarás secciones sobre características, testimonios y cómo comenzar.';
        break;
      case '/profile':
        pageInfo = 'En tu perfil puedes ver tus estadísticas de aprendizaje, racha diaria, logros desbloqueados y tu progreso general en los ejercicios. También puedes personalizar tu avatar y ajustar tus preferencias de aprendizaje.';
        break;
      case '/exercises':
        pageInfo = 'En esta página encontrarás una variedad de ejercicios interactivos diseñados específicamente para niños con dislexia, incluyendo actividades de reconocimiento fonológico, formación de palabras, discriminación visual y comprensión lectora.';
        break;
      case '/library':
        pageInfo = 'La biblioteca contiene libros y recursos de lectura adaptados para personas con dislexia. Los textos utilizan tipografías especiales, mayor espaciado entre líneas y palabras, y están organizados por nivel de dificultad.';
        break;
      case '/test':
        pageInfo = 'El test de diagnóstico ayuda a evaluar las habilidades actuales de lectura y escritura, identificando áreas específicas de dificultad para personalizar el plan de aprendizaje.';
        break;
      case '/about':
        pageInfo = 'En esta página de "Nosotros" puedes conocer más sobre la misión de LearnToRead, nuestro enfoque educativo y el equipo detrás del proyecto. Explicamos cómo abordamos la educación para niños con dislexia y los beneficios de nuestra plataforma.';
        break;
      case '/donation':
        pageInfo = 'En esta página puedes hacer donaciones para apoyar el desarrollo continuo de LearnToRead y ayudarnos a llegar a más niños con dislexia. Las donaciones contribuyen a nuevos contenidos y funcionalidades.';
        break;
      case '/reviews':
        pageInfo = 'Aquí puedes leer valoraciones de otros usuarios sobre su experiencia con LearnToRead y también puedes compartir tu propia opinión sobre la aplicación.';
        break;
      case '/auth':
        pageInfo = 'Página de inicio de sesión y registro para acceder a tu cuenta personal o crear una nueva cuenta en LearnToRead.';
        break;
      default:
        pageInfo = 'Página no encontrada';
    }
    
    setPageContext(pageInfo);
  }, [location.pathname, setPageContext]);

  // Fetch previous chat messages on load
  useEffect(() => {
    if (user) {
      fetchPreviousMessages();
    }
  }, [user]);

  // Initial welcome message with more context about the current page
  useEffect(() => {
    if (initialMessage && messages.length === 0 && !loading) {
      setMessages([
        {
          id: 'welcome',
          content: initialMessage,
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } else if (messages.length === 0 && !loading && !initialMessage) {

      let welcomeMessage = '¡Hola! Soy tu asistente virtual de LearnToRead. ';
      
      if (location.pathname === '/about') {
        welcomeMessage += 'Estás en la página "Sobre Nosotros" donde puedes conocer nuestra misión educativa, el enfoque pedagógico que utilizamos y al equipo detrás de LearnToRead. Si tienes preguntas sobre cómo trabajamos con niños con dislexia o quieres saber más sobre nuestros métodos, ¡estoy aquí para ayudarte!';
      } else if (pageContext) {
        welcomeMessage += `Estás en la ${pageContext}. ¿Tienes alguna pregunta o necesitas ayuda para navegar por esta sección?`;
      } else {
        welcomeMessage += '¿En qué puedo ayudarte hoy?';
      }
      
      setMessages([
        {
          id: 'welcome',
          content: welcomeMessage,
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage, messages.length, loading, pageContext, location.pathname]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const fetchPreviousMessages = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          isBot: msg.is_bot,
          timestamp: new Date(msg.created_at)
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      toast.error("No se pudieron cargar los mensajes anteriores");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!user) {
      toast.error("Debes iniciar sesión para usar el chat");
      return;
    }
    
    const userMessage = input;
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      content: userMessage,
      isBot: false,
      timestamp: new Date()
    }]);
    
    setLoading(true);
    
    try {
      const response = await supabase.functions.invoke('chatbot-assistant', {
        body: {
          message: userMessage,
          userId: user.id,
          contextData,
          pageContext
        }
      });

      if (response.error) throw new Error(response.error);
      
      // Add bot response to chat
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        content: response.data.message,
        isBot: true,
        timestamp: new Date()
      }]);
      
      // Handle suggestions if any
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions);
      } else {
        setSuggestions([]);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("No se pudo enviar el mensaje");
      
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: "Lo siento, parece que estoy teniendo problemas para responder en este momento. Por favor, inténtalo de nuevo más tarde.",
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 rounded-full p-3 shadow-lg z-50 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isOpen ? <Bot size={24} /> : <LightbulbIcon size={24} />}
      </Button>

      <div 
        className={`fixed bottom-20 right-5 z-50 w-[350px] md:w-[400px] transition-transform duration-300 ${
          isOpen ? 'transform translate-y-0' : 'transform translate-y-[150%]'
        }`}
      >
        <Card className="border-2 border-blue-500 shadow-xl rounded-2xl">
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-comic font-medium">Asistente de LearnToRead</h3>
            </div>
          </div>
          
          <CardContent className="p-0">

            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-blue-50">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? 'order-1' : 'order-2'}`}>
                    {message.isBot && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src="/favicon.ico" />
                        <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`rounded-lg p-3 ${message.isBot 
                      ? 'bg-white text-gray-800 border border-blue-200' 
                      : 'bg-blue-600 text-white'}`}
                    >
                      <p className="text-sm font-comic">{message.content}</p>
                    </div>
                    
                    {!message.isBot && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-red-500 text-white">{profile?.username?.substring(0, 1) || "U"}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              

              {suggestions.length > 0 && (
                <div className="my-2 pl-10">
                  <p className="text-sm text-blue-700 font-medium mb-2">Ejercicios recomendados:</p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <div 
                        key={suggestion.id} 
                        className="bg-white border border-blue-200 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          toast.info(`Navegando al ejercicio: ${suggestion.title}`);
                          // Aquí puedes implementar la navegación al ejercicio
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium font-comic">{suggestion.title}</p>
                          <p className="text-xs text-blue-600">{suggestion.type} • {suggestion.difficulty}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 flex items-center border border-blue-200">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                    <p className="text-sm text-blue-600">Escribiendo...</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            

            <form onSubmit={handleSubmit} className="border-t border-blue-200 p-3 flex gap-2 bg-white rounded-b-xl">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="¿En qué puedo ayudarte hoy?"
                disabled={loading}
                className="flex-1 font-comic border-blue-300 focus-visible:ring-blue-500"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={18} />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ChatbotAssistant;
