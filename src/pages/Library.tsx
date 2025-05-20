
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Book, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';

const Library: React.FC = () => {
  const [fontFamily, setFontFamily] = useState<string>('font-comic');
  const [fontSize, setFontSize] = useState(16);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [completedBooks, setCompletedBooks] = useState<string[]>([]);
  const { user } = useAuth();
  
  type Book = {
    id: string;
    title: string;
    cover: string;
    content: string;
    age: '5-7' | '8-10' | '11-13';
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    description: string;
  };
  
  const books: Book[] = [
    {
      id: 'book1',
      title: 'Las Aventuras de Luna',
      cover: 'https://m.media-amazon.com/images/I/61DuJSnaI8L._AC_UF1000,1000_QL80_.jpg',
      content: `Luna es una gatita muy curiosa que vive en una casa pequeña con su familia. Todos los días, cuando el sol brilla fuerte, Luna sale a jugar al jardín.

Un día, Luna vio algo brillante detrás de un arbusto. Era una puerta pequeñita. Luna no había visto esta puerta antes. ¿Cómo apareció ahí?

Luna se acercó con cuidado y empujó la puerta. ¡Se abrió! Dentro había un mundo mágico con mariposas brillantes y flores gigantes.

Luna saltó adentro y comenzó a explorar. Conoció a un conejo azul llamado Tino que podía hablar.

"¡Bienvenida al Jardín Mágico!", dijo Tino. "Aquí todos los animales pueden hablar y las plantas cantan".

Luna estaba muy sorprendida pero feliz. Pasó todo el día jugando en el Jardín Mágico con sus nuevos amigos.

Cuando empezó a oscurecer, Luna se despidió de Tino y volvió por la puerta pequeñita. Prometió volver al día siguiente para vivir más aventuras.

Y así, cada día, Luna descubre algo nuevo en el Jardín Mágico. ¿Qué aventura vivirá mañana?`,
      age: '5-7',
      difficulty: 'easy',
      points: 25,
      description: 'Una tierna historia sobre una gatita curiosa que descubre un mundo mágico en su jardín. Ideal para primeros lectores.'
    },
    {
      id: 'book2',
      title: 'El Misterio del Bosque',
      cover: 'https://queleerblog.wordpress.com/wp-content/uploads/2013/10/portadamisteriobosque-comp.jpg',
      content: `Carlos, Ana y Tomás son tres amigos que viven en un pueblo pequeño cerca de un gran bosque. Les encanta explorar y descubrir cosas nuevas.

Un día, mientras jugaban cerca del bosque, encontraron un mapa viejo y arrugado escondido dentro de un árbol hueco. El mapa mostraba un camino que llevaba al centro del bosque, donde había dibujado un gran tesoro.

"¡Tenemos que encontrar ese tesoro!" dijo Carlos, emocionado.

"¿Y si es peligroso?" preguntó Ana, un poco preocupada.

"Iremos juntos y con cuidado", respondió Tomás. "Además, llevaremos comida, agua y una brújula por si nos perdemos".

Al día siguiente, muy temprano, los tres amigos se pusieron sus mochilas y comenzaron su aventura. Siguieron el mapa por el bosque, cruzaron un pequeño arroyo saltando sobre piedras y subieron una colina empinada.

En el camino vieron animales interesantes: ardillas, pájaros de colores y hasta un zorro que los miró curioso desde lejos.

Después de caminar durante horas, llegaron a un claro en medio del bosque. En el centro había un árbol enorme, más grande que todos los demás.

"¡Tiene que ser aquí!", exclamó Carlos, mirando el mapa.

Se acercaron al gran árbol y descubrieron una pequeña puerta en su tronco. La abrieron con cuidado y encontraron... ¡una colección de libros antiguos! Había libros sobre animales, plantas, estrellas y muchas historias fascinantes.

"¡Este es el verdadero tesoro!", dijo Ana con los ojos brillantes. "¡Conocimiento!".

Los tres amigos pasaron horas leyendo los libros maravillosos. Cuando el sol comenzaba a ponerse, decidieron volver a casa, pero prometieron regresar pronto al árbol de los libros para seguir descubriendo sus secretos.

Y así comenzaron las muchas aventuras de Carlos, Ana y Tomás en el misterioso bosque.`,
      age: '8-10',
      difficulty: 'medium',
      points: 50,
      description: 'Una emocionante historia de aventura y descubrimiento que enseña sobre el valor del conocimiento y la amistad.'
    },
    {
      id: 'book3',
      title: 'Viaje a las Estrellas',
      cover: 'https://imgv2-2-f.scribdassets.com/img/document/631846975/original/b8bf3e83af/1?v=1',
      content: `Desde pequeña, Ana soñaba con viajar al espacio. Todas las noches miraba las estrellas desde su ventana y se preguntaba cómo sería flotar entre ellas. Su habitación estaba llena de posters de planetas, cohetes y astronautas.

Ana estudiaba mucho sobre ciencia y astronomía. Sabía los nombres de todas las constelaciones y podía reconocerlas en el cielo nocturno. Su sueño era convertirse en astronauta cuando fuera mayor.

Un día, después de leer un libro sobre cohetes, tuvo una idea brillante: "¡Construiré mi propio cohete espacial!" Corrió al garaje y comenzó a juntar materiales: cajas de cartón, pintura, luces viejas y muchas herramientas.

Trabajó durante semanas en su proyecto. Su padre la ayudaba a veces, impresionado por la dedicación de su hija. Finalmente, el cohete estuvo listo. Era grande, colorido y tenía un asiento cómodo en su interior.

Ana colocó su cohete en el patio trasero. Se puso su casco espacial casero y se preparó para el lanzamiento. Comenzó la cuenta regresiva: "10, 9, 8... ¡Despegue!"

Cerró los ojos e imaginó que su cohete se elevaba hacia el cielo. En su mente, podía ver la Tierra haciéndose cada vez más pequeña mientras ella subía más y más alto.

Pasó por la Luna y saludó a los astronautas que alguna vez caminaron allí. Luego viajó a Marte, vio sus montañas rojas y sus enormes cañones. Continuó su viaje pasando por Júpiter, con sus tormentas gigantes, y Saturno con sus hermosos anillos.

Cuando llegó a las estrellas, eran aún más brillantes y hermosas de lo que había imaginado. Las estrellas parecían bailar a su alrededor, formando patrones deslumbrantes.

Después de su largo viaje, Ana regresó a la Tierra. Cuando abrió los ojos, estaba todavía en su cohete de cartón en el patio, pero sentía como si realmente hubiera estado en el espacio.

"Algún día", se dijo a sí misma, "haré este viaje de verdad". Y mientras miraba al cielo estrellado, sabía que los sueños pueden hacerse realidad si trabajas duro para conseguirlos.`,
      age: '5-7',
      difficulty: 'easy',
      points: 30,
      description: 'Una inspiradora historia sobre una niña que sueña con ser astronauta. Perfecto para motivar a los pequeños a seguir sus sueños.'
    },
    {
      id: 'book4',
      title: 'Los Secretos del Mar Profundo',
      cover: 'https://img.freepik.com/premium-vector/underwater-scene-with-corals-sea-creatures_1308-73387.jpg',
      content: `El océano es un lugar lleno de misterios. En sus profundidades, donde la luz apenas llega, viven criaturas asombrosas que parecen de otro mundo.

Marina era una científica que estudiaba el mar profundo. Tenía un submarino especial que podía bajar hasta las partes más oscuras del océano. Un día, decidió explorar la Fosa de las Marianas, el punto más profundo de todos los océanos.

"Nadie ha llegado tan lejos", pensaba Marina mientras su submarino descendía lentamente. A su alrededor, el agua se volvía cada vez más oscura. Encendió las luces potentes del submarino para ver mejor.

A 2.000 metros de profundidad, vio peces con luces propias en sus cuerpos. Estos peces usaban sus luces para atraer presas en la oscuridad. "¡Fascinante!", exclamó Marina, tomando notas y fotografías.

A 5.000 metros, encontró criaturas transparentes como fantasmas, medusas gigantes y calamares de formas extrañas. Algunos nunca habían sido vistos por humanos antes.

Cuando llegó a 10.000 metros, casi en el fondo de la fosa, Marina quedó asombrada. Allí, donde la presión del agua era inmensa, vio formas de vida resistiendo en condiciones extremas: pequeños crustáceos, gusanos y bacterias que vivían junto a respiraderos hidrotermales, grietas en el fondo marino por donde salía agua caliente rica en minerales.

De repente, las luces de su submarino iluminaron algo inesperado: una estructura que parecía artificial. Era un objeto metálico, cubierto parcialmente por sedimentos y criaturas marinas. "¿Qué podría ser esto?", se preguntó Marina, intrigada.

Acercó el submarino y usó un brazo robótico para tomar una muestra. El objeto tenía inscripciones que no pudo reconocer. ¿Era parte de un barco hundido? ¿Un satélite caído? ¿O algo más misterioso?

Marina decidió volver a la superficie para analizar su descubrimiento. Sabía que este hallazgo podría cambiar nuestra comprensión de las profundidades marinas... y tal vez revelar secretos que nadie imaginaba.

Mientras su submarino ascendía lentamente hacia la luz del sol, Marina miró por última vez la oscuridad de las profundidades. "El océano guarda muchos secretos", pensó, "y hoy he descubierto uno de ellos".`,
      age: '8-10',
      difficulty: 'medium',
      points: 55,
      description: 'Una fascinante exploración de las profundidades marinas que combina ciencia y misterio.'
    },
    {
      id: 'book5',
      title: 'El Código del Dragón',
      cover: 'https://img.freepik.com/premium-vector/dragon-silhouette-vector-illustration_43623-568.jpg',
      content: `Miguel era un chico apasionado por los ordenadores y la programación. Con solo 13 años, ya sabía crear pequeños juegos y aplicaciones. En su habitación, rodeado de equipos electrónicos, pasaba horas escribiendo código y resolviendo problemas.

Un día, mientras navegaba por internet buscando recursos para aprender más sobre programación, encontró un extraño mensaje en un foro antiguo:

"El Código del Dragón espera a quien pueda descifrar este enigma. Quien lo resuelva obtendrá la llave para acceder al mayor desafío de programación jamás creado."

Debajo había una serie de símbolos y números que parecían algún tipo de acertijo. Intrigado, Miguel copió el enigma y comenzó a trabajar en él.

Después de tres días de intenso trabajo, descifrando patrones y aplicando sus conocimientos de criptografía, consiguió resolverlo. El enigma revelaba una dirección web oscura, a la que solo se podía acceder mediante una red especial.

Al entrar en la web, encontró un mensaje que le daba la bienvenida por su nombre. "¿Cómo sabían quién era yo?", se preguntó, sorprendido y un poco preocupado.

La página contenía un desafío llamado "El Código del Dragón". Según explicaba, era una serie de problemas de programación cada vez más complejos, creados por un grupo anónimo de los mejores programadores del mundo. Nadie había conseguido completar todos los niveles.

Miguel comenzó con el primer problema, que parecía sencillo: crear un algoritmo que generara una secuencia específica de números. Lo resolvió en una hora. El segundo problema era más difícil y le llevó un día entero.

A medida que avanzaba, los problemas se volvían más desafiantes. Algunos requerían conceptos avanzados de matemáticas y algoritmos que Miguel no conocía, así que tuvo que estudiar e investigar por su cuenta.

Después de meses de dedicación, llegó al nivel final. El desafío era crear un programa que pudiera predecir patrones aparentemente aleatorios. Miguel trabajó durante semanas, probando diferentes enfoques hasta que finalmente encontró la solución.

Al enviar su respuesta, la pantalla cambió. Apareció una animación de un dragón de código, formado por líneas de programación que se movían y cambiaban. El dragón le habló:

"Felicidades, Miguel. Eres la primera persona en completar El Código del Dragón. Has demostrado habilidades excepcionales de resolución de problemas y perseverancia."

Entonces le ofrecieron algo que nunca hubiera imaginado: una beca completa para estudiar ciencias de la computación en una prestigiosa universidad, financiada por un grupo de tecnólogos visionarios que habían creado el desafío para encontrar jóvenes talentos.

Esta era solo la primera puerta que El Código del Dragón abriría para Miguel, el comienzo de un camino que lo llevaría a convertirse en uno de los grandes innovadores tecnológicos de su generación.`,
      age: '11-13',
      difficulty: 'hard',
      points: 80,
      description: 'Un thriller tecnológico para jóvenes que combina enigmas, programación y aventura. Perfecto para lectores avanzados interesados en la tecnología.'
    }
  ];

  // Fetch completed books on component mount
  useEffect(() => {
    if (user) {
      const storedBooks = localStorage.getItem('completed-books');
      if (storedBooks) {
        setCompletedBooks(JSON.parse(storedBooks));
      }
    }
  }, [user]);
  
  const fontOptions = [
    { id: 'font-comic', name: 'Comic Neue', className: 'font-comic' },
    { id: 'font-dyslexic', name: 'OpenDyslexic', className: 'font-dyslexic' },
    { id: 'font-sans', name: 'Sans-serif', className: 'font-sans' },
    { id: 'font-serif', name: 'Serif', className: 'font-serif' },
    { id: 'font-mono', name: 'Monospace', className: 'font-mono' }
  ];
  
  const colorSchemeOptions = [
    { id: 'default', name: 'Normal', bg: '#ffffff', text: '#000000' },
    { id: 'cream', name: 'Papel crema', bg: '#f8f2e2', text: '#333333' },
    { id: 'dark', name: 'Modo oscuro', bg: '#222222', text: '#ffffff' },
    { id: 'blue-light', name: 'Luz azul reducida', bg: '#f9fbe7', text: '#333333' },
    { id: 'yellow', name: 'Alto contraste', bg: '#ffff99', text: '#000066' },
  ];

  const handleColorSchemeChange = (scheme: { bg: string, text: string }) => {
    setBackgroundColor(scheme.bg);
    setTextColor(scheme.text);
  };
  
  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
  };
  
  const handleBackToLibrary = () => {
    setSelectedBook(null);
  };

  const handleBookCompleted = (bookId: string) => {
    if (!user) {
      toast.error("¡Inicia sesión para guardar tu progreso!");
      return;
    }
    
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Add to completed books if not already there
    if (!completedBooks.includes(bookId)) {
      const newCompletedBooks = [...completedBooks, bookId];
      setCompletedBooks(newCompletedBooks);
      localStorage.setItem('completed-books', JSON.stringify(newCompletedBooks));
      
      // Add points
      const currentPoints = parseInt(localStorage.getItem('user-points') || '0');
      localStorage.setItem('user-points', (currentPoints + book.points).toString());
      
      toast.success(`¡Lectura completada! Has ganado ${book.points} puntos.`, {
        description: `¡Sigue leyendo para ganar más puntos!`
      });
    }
  };

  const currentBook = books.find(book => book.id === selectedBook);
  
  // Filter books based on difficulty
  const filteredBooks = currentFilter === 'all' 
    ? books 
    : books.filter(book => book.difficulty === currentFilter);

  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-kid-blue/20 to-white">
        <div className="kid-container">
          {selectedBook ? (
            // Book reading view
            <div className="max-w-4xl mx-auto">
              <Button 
                onClick={handleBackToLibrary}
                className="mb-4 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Volver a la biblioteca
              </Button>
              
              <Card className="kid-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentBook?.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {currentBook?.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {currentBook?.age} años
                      </Badge>
                      <Badge className={
                        currentBook?.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        currentBook?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }>
                        {currentBook?.difficulty === 'easy' ? 'Nivel Fácil' : 
                         currentBook?.difficulty === 'medium' ? 'Nivel Medio' : 
                         'Nivel Difícil'}
                      </Badge>
                      <div className="text-sm font-medium text-blue-600">
                        {currentBook?.points} puntos
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Reading settings */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold mb-2">Tipo de letra</h3>
                        <RadioGroup 
                          defaultValue={fontFamily}
                          onValueChange={setFontFamily}
                          className="flex flex-wrap gap-2"
                        >
                          {fontOptions.map(font => (
                            <div key={font.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={font.id} id={`book-${font.id}`} />
                              <Label 
                                htmlFor={`book-${font.id}`} 
                                className={`px-2 py-1 bg-white rounded ${font.className} text-sm`}
                              >
                                {font.name}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <h3 className="font-bold mb-2">Tamaño: {fontSize}px</h3>
                        <Slider 
                          value={[fontSize]} 
                          min={14} 
                          max={28} 
                          step={1}
                          onValueChange={(value) => setFontSize(value[0])}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-bold mb-2">Esquema de color</h3>
                      <div className="flex flex-wrap gap-2">
                        {colorSchemeOptions.map(scheme => (
                          <button
                            key={scheme.id}
                            className={`px-2 py-1 rounded-md border text-sm ${backgroundColor === scheme.bg && textColor === scheme.text ? 'border-primary ring-2 ring-primary' : 'border-gray-200'}`}
                            style={{ backgroundColor: scheme.bg, color: scheme.text }}
                            onClick={() => handleColorSchemeChange(scheme)}
                          >
                            {scheme.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Book content */}
                  <div 
                    className="p-6 rounded-xl shadow-sm"
                    style={{ 
                      backgroundColor, 
                      color: textColor,
                      minHeight: "400px"
                    }}
                  >
                    <p 
                      className={fontFamily}
                      style={{ 
                        fontSize: `${fontSize}px`,
                        letterSpacing: `${letterSpacing * 0.05}em`,
                        lineHeight: lineHeight,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {currentBook?.content}
                    </p>
                  </div>
                  
                  {/* After reading section */}
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">¡Has terminado de leer!</h3>
                    <p className="mb-4">¿Qué te ha parecido el libro? Marca esta lectura como completada para ganar {currentBook?.points} puntos:</p>
                    <div className="flex gap-4">
                      <Button 
                        className={`kid-button ${completedBooks.includes(currentBook?.id || '') ? 'bg-green-600 hover:bg-green-700' : 'bg-kid-green hover:bg-kid-green/90'}`}
                        onClick={() => currentBook && handleBookCompleted(currentBook.id)}
                        disabled={completedBooks.includes(currentBook?.id || '')}
                      >
                        {completedBooks.includes(currentBook?.id || '') ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completado
                          </>
                        ) : (
                          'Marcar como Leído'
                        )}
                      </Button>
                      <Button 
                        className="kid-button bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                          // Si el usuario está autenticado, registramos el ejercicio completado
                          if (user) {
                            const currentExercises = parseInt(localStorage.getItem('user-exercises-completed') || '0');
                            localStorage.setItem('user-exercises-completed', (currentExercises + 1).toString());
                            
                            // 50% de probabilidad de obtener puntuación perfecta
                            if (Math.random() > 0.5) {
                              const currentPerfect = parseInt(localStorage.getItem('user-perfect-scores') || '0');
                              localStorage.setItem('user-perfect-scores', (currentPerfect + 1).toString());
                            }
                            
                            // Sumar puntos extra por el ejercicio
                            const currentPoints = parseInt(localStorage.getItem('user-points') || '0');
                            localStorage.setItem('user-points', (currentPoints + 25).toString());
                            
                            toast.success("¡Ejercicio completado! Has ganado 25 puntos adicionales.");
                          } else {
                            toast.error("¡Inicia sesión para guardar tu progreso!");
                          }
                        }}
                      >
                        Hacer ejercicios (+25 puntos)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Library view
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Biblioteca de Lectura Adaptada
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-8">
                Historias fascinantes adaptadas para hacer la lectura más accesible y divertida.
                ¡Gana puntos completando lecturas y ejercicios!
              </p>
              
              {/* Filter tabs by difficulty */}
              <div className="flex justify-center mb-8">
                <Tabs defaultValue="all" value={currentFilter} onValueChange={setCurrentFilter}>
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="easy">Nivel Fácil</TabsTrigger>
                    <TabsTrigger value="medium">Nivel Medio</TabsTrigger>
                    <TabsTrigger value="hard">Nivel Difícil</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredBooks.map((book) => (
                  <Card 
                    key={book.id} 
                    className="kid-card overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                  >
                    <div className="relative h-48">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-800">
                        {book.age} años
                      </Badge>
                      {completedBooks.includes(book.id) && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            book.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                            book.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }>
                            {book.difficulty === 'easy' ? 'Fácil' : 
                            book.difficulty === 'medium' ? 'Medio' : 
                            'Difícil'}
                          </Badge>
                          <span className="text-sm font-medium text-blue-600">{book.points} pts</span>
                        </div>
                        <Button 
                          className="kid-button bg-primary text-sm"
                          onClick={() => handleBookSelect(book.id)}
                        >
                          <Book className="w-4 h-4 mr-2" />
                          Leer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Library;
