
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize the Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { message, userId, contextData, pageContext } = await req.json();

    console.log("Chatbot request received:", { message, userId, contextData, pageContext });

    // Process the message based on context
    let response = "";
    let suggestions = [];
    
    // More detailed responses for different pages
    if (message.toLowerCase().includes("ayuda") || message.toLowerCase().includes("qué es")) {
      if (pageContext && pageContext.includes("Nosotros")) {
        response = "En la página 'Sobre Nosotros' puedes encontrar información sobre nuestra misión educativa, cómo ayudamos a niños con dislexia, nuestro enfoque pedagógico basado en métodos multisensoriales, y conocer al equipo detrás de LearnToRead. También explicamos los beneficios de nuestra plataforma y cómo puedes contactarnos si tienes preguntas adicionales.";
      } else if (pageContext && pageContext.includes("ejercicios")) {
        response = "En la sección de ejercicios encontrarás actividades interactivas diseñadas específicamente para niños con dislexia. Incluyen ejercicios de conciencia fonológica, discriminación visual de letras, formación de palabras y comprensión lectora. Cada ejercicio se adapta al nivel del usuario y ofrece retroalimentación inmediata.";
      } else if (pageContext && pageContext.includes("biblioteca")) {
        response = "Nuestra biblioteca contiene libros y textos adaptados para personas con dislexia, con tipografías especiales, mayor espaciado entre líneas y palabras, y un diseño que facilita la lectura. Los textos están organizados por nivel de dificultad y temáticas para que encuentres exactamente lo que necesitas.";
      } else if (pageContext && pageContext.includes("perfil")) {
        response = "En tu perfil puedes ver tus estadísticas de aprendizaje, incluyendo tiempo dedicado, ejercicios completados, progreso general y logros desbloqueados. También puedes personalizar tu avatar, ajustar tus preferencias de aprendizaje y ver tu plan personalizado.";
      } else {
        response = "LearnToRead es una aplicación educativa diseñada para ayudar a niños con dislexia a mejorar sus habilidades de lectura y escritura mediante juegos y ejercicios interactivos. ¿Sobre qué sección específica te gustaría saber más?";
      }
    } else if (message.toLowerCase().includes("dislexia")) {
      response = "La dislexia es una dificultad de aprendizaje que afecta principalmente la capacidad de leer y procesar el lenguaje escrito. Las personas con dislexia suelen tener dificultades para reconocer las letras, relacionar sonidos con símbolos o entender secuencias. LearnToRead está especialmente diseñado para ayudar a niños con dislexia mediante ejercicios adaptados que fortalecen estas habilidades específicas.";
    } else if (message.toLowerCase().includes("ejercicio") || message.toLowerCase().includes("actividad")) {
      if (contextData?.currentExercise) {
        response = `Estás trabajando en el ejercicio "${contextData.currentExercise.title}". Este tipo de ejercicios ayuda a desarrollar tu ${contextData.currentExercise.type === 'fonológico' ? 'conciencia fonológica y reconocimiento de sonidos' : contextData.currentExercise.type === 'visual' ? 'discriminación visual y reconocimiento de letras' : 'habilidades de comprensión lectora'}. ¿En qué parte necesitas ayuda?`;
      } else {
        response = "Tenemos varios tipos de ejercicios diseñados para ayudarte con diferentes aspectos de la lectura y escritura. Incluyen actividades de conciencia fonológica, discriminación visual, formación de palabras y comprensión lectora. Cada uno está diseñado para ser divertido a la vez que educativo. ¿Quieres que te recomiende algunos ejercicios?";
        // Fetch recommended exercises based on user profile
        try {
          const { data: exercises } = await supabase
            .from('exercises')
            .select('id, title, type, difficulty')
            .limit(3);
          
          if (exercises && exercises.length > 0) {
            suggestions = exercises.map(ex => ({
              id: ex.id,
              title: ex.title,
              type: ex.type === 'fonológico' ? 'Conciencia Fonológica' : ex.type === 'visual' ? 'Discriminación Visual' : 'Comprensión Lectora',
              difficulty: ex.difficulty === 'easy' ? 'Fácil' : ex.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'
            }));
          }
        } catch (error) {
          console.error("Error fetching exercise suggestions:", error);
        }
      }
    } else if (message.toLowerCase().includes("progreso") || message.toLowerCase().includes("avance")) {
      response = "Puedes ver tu progreso completo en tu perfil personal. Allí encontrarás gráficos detallados de tu avance, ejercicios completados, tiempo dedicado al aprendizaje, puntos acumulados y tu racha diaria. También podrás ver qué habilidades has mejorado más y cuáles necesitan más práctica.";
    } else if (message.toLowerCase().includes("perfil")) {
      response = "En tu perfil personal puedes ver todas tus estadísticas de aprendizaje, personalizar tu avatar, ajustar tus preferencias de aprendizaje y revisar tu plan personalizado. Es tu espacio individual donde puedes hacer seguimiento de todo tu progreso en la plataforma. ¿Te gustaría que te dirija a tu perfil?";
    } else if (message.toLowerCase().includes("puntos") || message.toLowerCase().includes("calificación") || message.toLowerCase().includes("puntaje")) {
      response = "En LearnToRead ganarás puntos por completar ejercicios, mantener una racha diaria de estudio y alcanzar nuevos logros. Los puntos te permiten desbloquear nuevas funciones, personalizar tu avatar con elementos especiales y avanzar en el ranking de la comunidad. ¡Es una forma divertida de mantenerte motivado en tu aprendizaje!";
    } else if (contextData?.exerciseCompleted) {
      const score = contextData.score || 0;
      const maxScore = contextData.maxScore || 10;
      const percentage = Math.round((score / maxScore) * 100);
      
      if (percentage >= 90) {
        response = `¡Excelente trabajo! Has obtenido ${score}/${maxScore} puntos (${percentage}%). ¡Has ganado 100 puntos extra! Tu esfuerzo está dando frutos y estás avanzando rápidamente en tu aprendizaje.`;
      } else if (percentage >= 70) {
        response = `¡Buen trabajo! Has obtenido ${score}/${maxScore} puntos (${percentage}%). Estás en buen camino. Sigue practicando y verás cómo mejoras cada vez más.`;
      } else {
        response = `Has obtenido ${score}/${maxScore} puntos (${percentage}%). No te desanimes, el aprendizaje es un proceso. Te recomiendo repasar los conceptos básicos y volver a intentarlo. ¡Con práctica lo conseguirás!`;
      }
    } else if (message.toLowerCase().includes("equipo") || message.toLowerCase().includes("creadores")) {
      response = "LearnToRead fue creado por un equipo de especialistas en educación, psicopedagogos expertos en dislexia, diseñadores de experiencia de usuario y desarrolladores. Nuestra directora educativa, Shirley Noelia, es especialista en Pedagogía Terapéutica con más de 15 años de experiencia ayudando a niños con dificultades de aprendizaje. Puedes conocer más sobre nuestro equipo en la sección 'Sobre Nosotros'.";
    } else if (message.toLowerCase().includes("método") || message.toLowerCase().includes("enfoque") || message.toLowerCase().includes("metodología")) {
      response = "Nuestro enfoque se basa en métodos multisensoriales que combinan estímulos visuales, auditivos y kinestésicos para reforzar el aprendizaje. Utilizamos técnicas como la instrucción fonética sistemática, la repetición espaciada para mejorar la memorización, y gamificación para mantener la motivación. Todos nuestros ejercicios están diseñados siguiendo las últimas investigaciones sobre educación para personas con dislexia.";
    } else {
      response = "Estoy aquí para ayudarte a entender mejor LearnToRead y cómo puede beneficiar tu aprendizaje o el de tu hijo/a. Puedo explicarte sobre nuestros ejercicios, métodos de enseñanza, cómo interpretar el progreso, o resolver cualquier duda que tengas sobre la plataforma. ¿Hay algo específico que te gustaría saber?";
    }

    // Save the message and response to the database
    if (userId) {
      try {
        // Save user message
        await supabase.from('chat_messages').insert({
          user_id: userId,
          content: message,
          is_bot: false
        });

        // Save bot response
        await supabase.from('chat_messages').insert({
          user_id: userId,
          content: response,
          is_bot: true
        });
        
        // Save exercise suggestions if any
        if (suggestions.length > 0) {
          const suggestionInserts = suggestions.map(suggestion => ({
            user_id: userId,
            exercise_id: suggestion.id,
            reason: `Sugerido basado en tu consulta: "${message.substring(0, 50)}..."`
          }));
          
          await supabase.from('exercise_suggestions').insert(suggestionInserts);
        }
      } catch (error) {
        console.error("Error saving chat messages:", error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: response,
        suggestions
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in chatbot-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
