
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {

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
    if (message.toLowerCase().includes("ayuda") || message.toLowerCase().includes("qué es") || message.toLowerCase().includes("para que sirve") || message.toLowerCase().includes("sección") || message.toLowerCase().includes("seccion")) {
      if (pageContext && pageContext.includes("perfil")) {
        // Specific explanations for profile page sections
        if (message.toLowerCase().includes("avatar") || message.toLowerCase().includes("foto")) {
          response = "🖼️ **Avatar/Foto de Perfil**: Esta sección te permite personalizar tu imagen de perfil. Puedes subir una foto propia haciendo clic en el ícono de subida junto a tu avatar. Tu avatar aparecerá en toda la plataforma y te ayuda a personalizar tu experiencia de aprendizaje.";
        } else if (message.toLowerCase().includes("estadísticas") || message.toLowerCase().includes("estadisticas")) {
          response = "📊 **Mis Estadísticas**: Esta sección muestra tu rendimiento general:\n\n• **Ejercicios completados**: Total de actividades que has terminado\n• **Puntuaciones perfectas**: Cuántas veces has obtenido el puntaje máximo\n• **Tiempo jugando**: Cuánto tiempo has dedicado a practicar\n• **Categoría favorita**: El tipo de ejercicio que más practicas\n• **Progreso por categoría**: Tu rendimiento promedio en cada tipo de ejercicio (dictado, rimas, lectura, memoria)";
        } else if (message.toLowerCase().includes("racha")) {
          response = "🔥 **Mi Racha**: Esta sección te motiva a practicar diariamente:\n\n• **Días seguidos**: Cuántos días consecutivos has entrado a LearnToRead\n• **Indicadores visuales**: Los círculos muestran tu progreso semanal\n• **Puntos acumulados**: Tu total de puntos ganados\n• **Consejos**: Te recuerda que la constancia es clave para el aprendizaje\n\n¡La racha se mantiene entrando al menos una vez por día!";
        } else if (message.toLowerCase().includes("ejercicios problemáticos") || message.toLowerCase().includes("problematicos") || message.toLowerCase().includes("practicar")) {
          response = "⚠️ **Ejercicios que necesitas practicar más**: Esta sección identifica automáticamente las áreas donde necesitas mejorar:\n\n• Muestra ejercicios donde obtuviste puntuaciones bajas\n• Te da la fecha del último intento\n• Incluye un botón directo para volver a practicar\n• Te ayuda a enfocar tu tiempo de estudio en lo que más necesitas";
        } else if (message.toLowerCase().includes("test") || message.toLowerCase().includes("diagnóstico") || message.toLowerCase().includes("diagnostico")) {
          response = "📋 **Resultados de mi Test de Diagnóstico**: Esta sección muestra tu evaluación inicial:\n\n• **Áreas evaluadas**: Lectura, escritura, matemáticas y memoria\n• **Porcentajes por área**: Tu nivel en cada habilidad\n• **Recomendaciones**: Qué áreas necesitas trabajar más\n• **Ejercicios sugeridos**: Botón para ir directamente a las actividades recomendadas\n\nEste test solo se puede hacer una vez por semana para ver tu progreso real.";
        } else if (message.toLowerCase().includes("calendario")) {
          response = "📅 **Mi Calendario de Actividad**: Esta sección visual muestra tu constancia:\n\n• **Días marcados**: Cada día que has usado LearnToRead aparece destacado\n• **Motivación visual**: Te ayuda a ver tu progreso a lo largo del tiempo\n• **Recordatorio**: Te anima a practicar todos los días\n• **Historial**: Puedes ver qué tan activo has sido en semanas y meses anteriores";
        } else if (message.toLowerCase().includes("logros") || message.toLowerCase().includes("logro")) {
          response = "🏆 **Mis Logros**: Esta sección gamifica tu aprendizaje:\n\n• **Insignias desbloqueadas**: Logros que ya has conseguido (aparecen en color)\n• **Insignias por desbloquear**: Objetivos por alcanzar (aparecen en gris)\n• **Tipos de logros**: \n  - Rachas diarias (7, 14 días)\n  - Ejercicios completados (20, 50)\n  - Maestrías en categorías específicas\n• **Motivación**: Te dan objetivos claros para seguir mejorando";
        } else if (message.toLowerCase().includes("puntos") || message.toLowerCase().includes("nivel")) {
          response = "⭐ **Sistema de Puntos y Niveles**: En tu perfil puedes ver:\n\n• **Puntos actuales**: Total de puntos acumulados\n• **Nivel actual**: Tu nivel basado en tus puntos\n• **Progreso al siguiente nivel**: Barra que muestra cuánto te falta\n• **Cómo ganar puntos**:\n  - Completar ejercicios (+puntos por rendimiento)\n  - Mantener racha diaria (+50 puntos por día)\n  - Obtener puntuaciones perfectas (+puntos extra)";
        } else {
          response = "📱 **Página de Perfil - Todas las Secciones**:\n\n🖼️ **Avatar**: Personaliza tu foto de perfil\n📊 **Estadísticas**: Ve tu rendimiento general y por categorías\n🔥 **Racha Diaria**: Rastrea tu constancia día a día\n⚠️ **Ejercicios Problemáticos**: Identifica qué necesitas practicar más\n📋 **Test de Diagnóstico**: Resultados de tu evaluación inicial\n📅 **Calendario**: Historial visual de tu actividad\n🏆 **Logros**: Insignias y objetivos desbloqueados\n⭐ **Puntos y Niveles**: Tu progreso gamificado\n\n¿Sobre qué sección específica te gustaría saber más detalles?";
        }
      } else if (pageContext && pageContext.includes("Nosotros")) {
        response = "En la página 'Sobre Nosotros' puedes encontrar información sobre nuestra misión educativa, cómo ayudamos a niños con dislexia, nuestro enfoque pedagógico basado en métodos multisensoriales, y conocer al equipo detrás de LearnToRead. También explicamos los beneficios de nuestra plataforma y cómo puedes contactarnos si tienes preguntas adicionales.";
      } else if (pageContext && pageContext.includes("ejercicios")) {
        response = "En la sección de ejercicios encontrarás actividades interactivas diseñadas específicamente para niños con dislexia. Incluyen ejercicios de conciencia fonológica, discriminación visual de letras, formación de palabras y comprensión lectora. Cada ejercicio se adapta al nivel del usuario y ofrece retroalimentación inmediata.";
      } else if (pageContext && pageContext.includes("biblioteca")) {
        response = "Nuestra biblioteca contiene libros y textos adaptados para personas con dislexia, con tipografías especiales, mayor espaciado entre líneas y palabras, y un diseño que facilita la lectura. Los textos están organizados por nivel de dificultad y temáticas para que encuentres exactamente lo que necesitas.";
      } else if (pageContext && pageContext.includes("donación")) {
        response = "En esta página puedes contribuir al desarrollo de LearnToRead mediante donaciones. Tu apoyo nos ayuda a mantener la plataforma gratuita, desarrollar nuevos ejercicios y funcionalidades, y llegar a más niños con dislexia. Cada donación, sin importar el monto, marca la diferencia. Puedes elegir entre diferentes cantidades o establecer una donación personalizada. ¡Gracias por ayudarnos a transformar vidas a través de la educación!";
      } else {
        response = "LearnToRead es una aplicación educativa diseñada para ayudar a niños con dislexia a mejorar sus habilidades de lectura y escritura mediante juegos y ejercicios interactivos. ¿Sobre qué sección específica te gustaría saber más?";
      }
    } else if (message.toLowerCase().includes("donación") || message.toLowerCase().includes("donar") || message.toLowerCase().includes("contribuir") || message.toLowerCase().includes("apoyo")) {
      response = "¡Gracias por tu interés en apoyar LearnToRead! Las donaciones son fundamentales para mantener nuestra plataforma gratuita y accesible para todos los niños con dislexia. Tu contribución nos permite: \n\n• Desarrollar nuevos ejercicios y actividades\n• Mejorar constantemente la plataforma\n• Mantener el servicio gratuito para familias que lo necesitan\n• Investigar y aplicar las últimas metodologías educativas\n• Expandir nuestro alcance a más comunidades\n\nPuedes elegir el monto que desees donar, desde pequeñas contribuciones hasta montos mayores. Cada euro cuenta y nos acerca más a nuestro objetivo de ayudar a más niños. ¿Te gustaría saber más sobre cómo usar el formulario de donación?";
    } else if (message.toLowerCase().includes("formulario") && (message.toLowerCase().includes("donación") || pageContext && pageContext.includes("donación"))) {
      response = "El formulario de donación es muy sencillo de usar:\n\n1. **Selecciona un monto**: Puedes elegir entre las opciones predefinidas (€5, €10, €25, €50) o escribir tu propia cantidad en 'Otro monto'\n\n2. **Información personal**: Completa tu nombre y email para el recibo de donación\n\n3. **Mensaje opcional**: Si quieres, puedes dejarnos un mensaje especial\n\n4. **Procesar pago**: Haz clic en 'Donar ahora' para proceder al pago seguro\n\nTodos los pagos se procesan de forma segura a través de Stripe. Recibirás un recibo por email y tu donación nos ayudará inmediatamente a seguir desarrollando la plataforma.";
    } else if (message.toLowerCase().includes("racha") || message.toLowerCase().includes("días seguidos") || message.toLowerCase().includes("streak")) {
      response = "¡La racha diaria es una forma genial de mantenerte motivado! Funciona así:\n\n🔥 **Cómo funciona**: Cada día que entres a LearnToRead, tu racha aumenta en 1\n\n📅 **Mantener la racha**: Solo necesitas iniciar sesión una vez al día para mantenerla\n\n⚡ **Beneficios**: \n• Ganas puntos extra por mantener tu racha\n• Desbloqueas logros especiales\n• Te motiva a practicar regularmente\n\n❌ **Perder la racha**: Si pasas un día completo sin entrar, se reinicia a 0\n\n✨ **Consejo**: ¡Intenta entrar todos los días, aunque sea por unos minutos! La constancia es clave para el aprendizaje. Tu racha actual puedes verla en tu perfil personal.";
    } else if (message.toLowerCase().includes("dislexia")) {
      response = "La dislexia es una dificultad de aprendizaje que afecta principalmente la capacidad de leer y procesar el lenguaje escrito. Las personas con dislexia suelen tener dificultades para reconocer las letras, relacionar sonidos con símbolos o entender secuencias. LearnToRead está especialmente diseñado para ayudar a niños con dislexia mediante ejercicios adaptados que fortalecen estas habilidades específicas.";
    } else if (message.toLowerCase().includes("ejercicio") || message.toLowerCase().includes("actividad")) {
      if (contextData?.currentExercise) {
        response = `Estás trabajando en el ejercicio "${contextData.currentExercise.title}". Este tipo de ejercicios ayuda a desarrollar tu ${contextData.currentExercise.type === 'fonológico' ? 'conciencia fonológica y reconocimiento de sonidos' : contextData.currentExercise.type === 'visual' ? 'discriminación visual y reconocimiento de letras' : 'habilidades de comprensión lectora'}. ¿En qué parte necesitas ayuda?`;
      } else {
        response = "Tenemos varios tipos de ejercicios diseñados para ayudarte con diferentes aspectos de la lectura y escritura. Incluyen actividades de conciencia fonológica, discriminación visual, formación de palabras y comprensión lectora. Cada uno está diseñado para ser divertido a la vez que educativo. ¿Quieres que te recomiende algunos ejercicios?";
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