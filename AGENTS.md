Gymmo: The RPG Fitness Game

--

## 1. Visión del Producto

Gymmo es una aplicación de entrenamiento físico gamificada que transforma la automejora en una aventura RPG. A diferencia de las apps tradicionales, Gymmo utiliza una estética Pixel Art y mecánicas de progresión de videojuegos para motivar al usuario. El objetivo es llevar al usuario desde "Novato" hasta "Deidad Fitness" mediante la constancia, la comunidad y el esfuerzo físico real.

Filosofía de Diseño:

Interfaz: "Duolingo meets Stardew Valley". Navegación intuitiva, feedback háptico y visual inmediato.

Estética: Pixel Art Retro (8-bit/16-bit). Fuentes pixeladas, bordes "blocky", UI juguetona.

Accesibilidad: Full Responsive (Web, PWA, Nativa). Mobile First (Portrait) pero adaptable a Desktop (Landscape).

--

## 2. Especificaciones Técnicas (Tech Stack)

Frontend & Core
Framework: React (Next.js) o Vue (Nuxt.js) para renderizado rápido y SEO si es web pública.

Lenguaje: TypeScript (Tipado estricto para lógica de ejercicios compleja).

Estilos: Tailwind CSS con configuración personalizada para Pixel Art (shadows duros, bordes sin suavizado) + Librerías de iconos Pixel Art (ej. Lucide Pixel o custom SVGs).

Animaciones: Framer Motion (para transiciones UI) + Spritesheets CSS (para animaciones de avatares).

PWA: Service Workers para funcionamiento offline y caché agresivo.

Backend & Datos
BaaS (Backend as a Service): Supabase o Firebase.

Justificación: Manejo de autenticación, base de datos en tiempo real (para el chat) y almacenamiento de medios sin necesidad de mantener un servidor dedicado complejo.

Base de Datos: PostgreSQL (si usas Supabase) o NoSQL (Firebase). Estructura relacional recomendada para vincular Usuarios <-> Rutinas <-> Ejercicios.

Chat/Mensajería: WebSockets para tiempo real. Almacenamiento híbrido: Caché local (IndexedDB) para historial inmediato + Nube (con retención limitada) para sincronización.

Infraestructura
Hosting: Vercel o Netlify.

CI/CD: GitHub Actions.

--

## 3. Game Design & Mecánicas (El "Core Loop")

# 3.1. Sistema de Progresión (Leveling)

El viaje se divide en 3 Tierras (Categorías):

Tier 1: El Valle del Iniciado (Principiante)

Tier 2: La Montaña de Hierro (Intermedio)

Tier 3: El Olimpo de los Dioses (Profesional)

Niveles: 1 al 100 por Tier.

XP (Puntos de Experiencia):

Reto Diario (Calentamiento): +0.5 XP.

Rutina Principal: +0.5 XP.

Requisito de Nivel: 1.0 XP para subir de nivel.

Matemática: El usuario necesita 200 "acciones de éxito" para completar una categoría. Esto fomenta la constancia a largo plazo.

Recompensa Final: Al llegar al Nivel 100 del Tier 3, se desbloquea el skin mítico "Deidad Fitness" y un modo de extrema dificultad con ejercios mas complejos, rutinas mas estrictas y retos mas dificiles. (con aura animada).

# 3.2. Atributos del Jugador (RPG Stats)

Para hacerlo más inmersivo, los datos reales se traducen a stats de RPG:

FUERZA (STR): Basado en el peso levantado y ejercicios de hipertrofia.

RESISTENCIA (STA): Basado en cardio, repeticiones altas y constancia.

DISCIPLINA (WILL): Basado en la racha de días consecutivos (Streaks).

--

## 4. Arquitectura de la Interfaz (UI/UX)

# 4.1. Onboarding: "El Despertar"

Narrativa: Pantalla negra con texto pixelado escribiéndose tipo Typewriter: "Te has despertado en un mundo donde la fuerza lo es todo...".

Creación de Personaje:

Género: Masculino / Femenino (Iconos pixelados).

Customización: Tono de piel (slider de paleta), Color de pelo.

Datos Biométricos: Edad, Peso, Altura (Input numérico estilo contador arcade).

Selector de Clase (Nivel Inicial): Se presenta como elegir tu "Arma inicial":

Novato: (Icono: Palo de madera).

Intermedio: (Icono: Espada de hierro).

Pro: (Icono: Espada de diamante).

# 4.2. Pantalla Principal (The Hub)

Header: Barra de estado con Avatar (animación 'idle'), Nivel, Barra de XP y Moneda (GymCoins - ver sección 6).

Zona Central (Action Area):

Daily Quest (El Reto): Tarjeta destacada. Ej: "20 Sentadillas ahora mismo". Botón grande "ACEPTAR".

Dungeon Run (La Rutina):

Botón "Iniciar Rutina de Hoy" (Si ya existe).

Botón "Planificar Batalla" (Crear rutina).

Footer: Menú de navegación estilo dock pixelado (Hub, Comunidad, Perfil, Tienda/Ajustes).

# 4.3. El Creador de Rutinas (Routine Builder)

Modo Automático ("Auto-Equip"):

Input: Días disponibles (2-5).

Lógica: El algoritmo distribuye grupos musculares (Ej: Lunes-Pecho, Martes-Pierna). Asigna ejercicios del DB basándose en el Tier del usuario.

Modo Manual ("Crafting"):

Drag & Drop de ejercicios desde la biblioteca.

Base de Datos de Ejercicios (The Grimoire):

500 Ejercicios.

Tags: #Casa, #Gym, #Mancuernas, #PesoCorporal.

Visualización: Cada ejercicio tiene un GIF o Spritesheet pixel art de cómo se hace.

--

## 5. Comunidad y Funciones Sociales

# 5.1. El Gremio (Chats & Grupos)

GymBros/GymSis (DM): Chat directo P2P simulado.

Feature Clave: "Invocar Aliado". Enviar una rutina al chat. Si el amigo acepta, la UI de ambos cambia a "Modo Co-op". Al terminar, ambos reciben un bonus de XP (+0.1 XP extra por amistad).

Clanes (Grupos): Hasta 1000 usuarios.

Tablón de anuncios (para dueños de gimnasios).

Feed de actividad: "Juan acaba de subir a Nivel 15".

Privacidad: Los mensajes multimedia (fotos/videos) se almacenan temporalmente (24-48h) en servidor y permanentemente solo en caché local del dispositivo para reducir costos y aumentar privacidad.

# 5.2. Historias (Tales)

Formato circular en la parte superior de la pestaña Comunidad.

Sin Filtros: La cámara nativa abre una interfaz estilo GameBoy Camera (opcional: efecto dither pixelado) para mantener la estética.

--

## 6. Sistema de Economía y Retención (Adiciones Profesionales)

Para aumentar la retención (Engagement):

GymCoins (Moneda Virtual - No dinero real necesariamente):

Se ganan al completar rutinas y retos.

Se pierden si rompes una racha.

La Tienda (The Shop):

Usa GymCoins para comprar cosméticos para el avatar: Ropa de gym, gorras, botellas de agua, colores de aura.

No afecta a las estadísticas, solo visual ("Fashion Gym").

--

## 7. Diseño Visual (Look & Feel)

Paleta de Colores (Dark Mode Default):

Fondo: #1a1b26 (Azul noche profundo, no negro).

Superficies: #24283b.

Acento Principal: #ff4d4d (Rojo Mate - "Vitalidad").

Acento Secundario: #4fd6be (Cyan Mate - "Energía/Stamina").

Texto: #c0caf5 (Blanco hueso, legible).

Tipografía:

Títulos: "Press Start 2P" o "VT323".

Cuerpo: "Roboto" o "Inter" (para legibilidad en instrucciones largas), pero con interletraje ajustado.

-- 

## 8. Seguridad y Privacidad

Autenticación: Login social (Google/Apple) y Email.

Datos: Opción de "Borrado Total" en ajustes (GDPR compliant).

Caché: Limpieza automática de caché de medios del chat cada 7 días para no saturar el teléfono.

-- 

## 9. Roadmap de Desarrollo Sugerido

Fase 1 (MVP): Onboarding, DB de 100 ejercicios básicos, Sistema de XP y Rutinas Automáticas. Sin Chat.

Fase 2 (Social): Integración de Chat, Clanes y Historias. DB ampliada a 300 ejercicios.

Fase 3 (Polish & Scale): Tienda de cosméticos, Logros (Badges), Modo "Deidad", DB final de 500 ejercicios, App Nativa (React Native o Capacitor).