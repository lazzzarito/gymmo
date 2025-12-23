export interface Exercise {
  id: string;
  name: string;
  description: string;
  tags: ('Casa' | 'Gym' | 'Mancuernas' | 'PesoCorporal')[];
  // Later, we can add a gif or spritesheet URL
  // visual: string;
}

export const grimoire: Exercise[] = [
  {
    id: 'ex001',
    name: 'Flexiones (Push-ups)',
    description: 'Un ejercicio clásico para el pecho, hombros y tríceps.',
    tags: ['PesoCorporal', 'Casa', 'Gym'],
  },
  {
    id: 'ex002',
    name: 'Sentadillas (Squats)',
    description: 'El rey de los ejercicios de pierna. Trabaja cuádriceps, glúteos y femorales.',
    tags: ['PesoCorporal', 'Casa', 'Gym'],
  },
  {
    id: 'ex003',
    name: 'Plancha (Plank)',
    description: 'Fortalece el core, la espalda y los hombros.',
    tags: ['PesoCorporal', 'Casa'],
  },
  {
    id: 'ex004',
    name: 'Zancadas (Lunges)',
    description: 'Excelente para el equilibrio y la fuerza unilateral de las piernas.',
    tags: ['PesoCorporal', 'Casa'],
  },
  {
    id: 'ex005',
    name: 'Press de Banca (Bench Press)',
    description: 'El ejercicio fundamental para la fuerza del pectoral en el gimnasio.',
    tags: ['Gym'],
  },
  {
    id: 'ex006',
    name: 'Curl de Bíceps (Bicep Curls)',
    description: 'Aísla y construye los músculos del bíceps.',
    tags: ['Mancuernas', 'Gym'],
  },
  // Add more exercises to reach 100 for the MVP
];
