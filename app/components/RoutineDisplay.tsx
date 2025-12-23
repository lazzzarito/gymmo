interface Exercise {
  id: number;
  name: string;
  tags: string[];
  tier: number;
}

interface Routine {
  name: string;
  exercises: Exercise[];
}

interface RoutineDisplayProps {
  routine: Routine;
}

const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine }) => {
  return (
    <div className="w-full max-w-md p-6 bg-surface rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-press-start text-secondary mb-4">{routine.name}</h2>
      <ul>
        {routine.exercises.map(ex => (
          <li key={ex.id} className="py-2 border-b border-gray-700">
            <p className="text-base sm:text-lg font-vt323">{ex.name}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-vt323">{ex.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
      <button className="mt-6 w-full px-4 py-3 bg-primary text-white rounded font-press-start text-sm sm:text-base">Start Routine</button>
    </div>
  );
};

export default RoutineDisplay;
