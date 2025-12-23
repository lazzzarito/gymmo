'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

const Onboarding = () => {
  const [text, setText] = useState('');
  const [step, setStep] = useState(0);
  const [character, setCharacter] = useState({
    gender: '',
    skinTone: '#ffffff',
    hairColor: '#000000',
    age: '',
    weight: '',
    height: '',
    class: 'novice',
  });
  const router = useRouter();
  const { saveCharacter } = useUser();

  // --- Validation Checks ---
  const isStep1Valid = character.gender !== '';
  const isStep2Valid = 
    character.age && Number(character.age) > 0 &&
    character.weight && Number(character.weight) > 0 &&
    character.height && Number(character.height) > 0;

  const fullText = "You have woken up in a world where strength is everything...";

  useEffect(() => {
    if (step === 0) {
      let i = 0;
      const typing = setInterval(() => {
        if (i < fullText.length) {
          setText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
          setTimeout(() => setStep(1), 1000);
        }
      }, 50);
      return () => clearInterval(typing);
    }
  }, [step]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCharacter({ ...character, [e.target.name]: e.target.value });
  };

  const handleClassSelection = (className: string) => {
    setCharacter({ ...character, class: className });
    nextStep();
  };
  
  const finishOnboarding = () => {
    const finalCharacter = {
        ...character,
        age: Number(character.age),
        weight: Number(character.weight),
        height: Number(character.height),
        // Add initial RPG stats
        level: 1,
        xp: 0,
        gymCoins: 0,
        xpForNextLevel: 100,
    };
    saveCharacter(finalCharacter);
    router.push('/hub');
  };

  const buttonClasses = "mt-8 px-4 py-2 text-white rounded font-press-start text-sm";
  const primaryButtonClasses = `${buttonClasses} bg-primary`;
  const disabledButtonClasses = `${buttonClasses} bg-gray-600 cursor-not-allowed`;
  const backButtonClasses = `${buttonClasses} bg-gray-500`;

  return (
    <div className="w-full max-w-sm sm:max-w-xl p-4 sm:p-8 space-y-8 text-center bg-surface rounded-lg shadow-lg">
      {step === 0 && (
        <div>
          <h1 className="text-2xl font-vt323 text-text">{text}</h1>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-xl sm:text-2xl font-press-start text-primary mb-4">Create your character</h1>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-text mb-1 font-vt323 text-lg">Gender *</label>
              <select name="gender" value={character.gender} onChange={handleChange} className="w-full p-2 rounded bg-background text-text font-vt323 text-lg">
                <option value="" disabled>Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-text mb-1 font-vt323 text-lg">Skin Tone</label>
              <input type="color" name="skinTone" value={character.skinTone} onChange={handleChange} className="w-full p-1 h-10 bg-background" />
            </div>
            <div>
              <label className="block text-text mb-1 font-vt323 text-lg">Hair Color</label>
              <input type="color" name="hairColor" value={character.hairColor} onChange={handleChange} className="w-full p-1 h-10 bg-background" />
            </div>
          </div>
          <button onClick={nextStep} disabled={!isStep1Valid} className={isStep1Valid ? primaryButtonClasses : disabledButtonClasses}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl sm:text-2xl font-press-start text-primary mb-4">Biometrics</h1>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-text mb-1 font-vt323 text-lg">Age *</label>
              <input type="number" name="age" min="1" value={character.age} onChange={handleChange} className="w-full p-2 rounded bg-background text-text font-vt323 text-lg" />
            </div>
            <div>
              <label className="block text-text mb-1 font-vt323 text-lg">Weight (kg) *</label>
              <input type="number" name="weight" min="1" value={character.weight} onChange={handleChange} className="w-full p-2 rounded bg-background text-text font-vt323 text-lg" />
            </div>
            <div>
              <label className="block text-text mb-1 font-vt323 text-lg">Height (cm) *</label>
              <input type="number" name="height" min="1" value={character.height} onChange={handleChange} className="w-full p-2 rounded bg-background text-text font-vt323 text-lg" />
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={prevStep} className={backButtonClasses}>Back</button>
            <button onClick={nextStep} disabled={!isStep2Valid} className={isStep2Valid ? primaryButtonClasses : disabledButtonClasses}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 className="text-xl sm:text-2xl font-press-start text-primary mb-4">Choose your class</h1>
          <div className="space-y-4">
            <button onClick={() => handleClassSelection('novice')} className="w-full p-4 bg-background text-text rounded hover:bg-primary font-press-start">Novice</button>
            <button onClick={() => handleClassSelection('intermediate')} className="w-full p-4 bg-background text-text rounded hover:bg-primary font-press-start">Intermediate</button>
            <button onClick={() => handleClassSelection('pro')} className="w-full p-4 bg-background text-text rounded hover:bg-primary font-press-start">Pro</button>
          </div>
          <button onClick={prevStep} className={backButtonClasses}>Back</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h1 className="text-xl sm:text-2xl font-press-start text-primary mb-4">Welcome, Adventurer!</h1>
          <p className="text-text font-vt323 text-lg">Your journey begins now. Let's get stronger, together.</p>
          <button onClick={finishOnboarding} className={`${buttonClasses} bg-secondary`}>Begin Journey</button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
