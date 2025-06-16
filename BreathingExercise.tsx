
import React, { useState, useEffect } from 'react';
import Button from './Button';

interface BreathingExerciseProps {
  onComplete: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [instruction, setInstruction] = useState("Prepárate...");
  const [cycle, setCycle] = useState(0);
  const totalCycles = 5; // Number of breath cycles
  const inhaleTime = 4000; // 4 seconds
  const holdTime = 2000; // 2 seconds (optional, can be 0)
  const exhaleTime = 6000; // 6 seconds

  useEffect(() => {
    if (cycle >= totalCycles) {
      setInstruction("¡Bien hecho! Ejercicio completado.");
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }

    setInstruction("Inhala...");
    const inhaleTimer = setTimeout(() => {
      if (holdTime > 0) {
        setInstruction("Sostén...");
        const holdTimer = setTimeout(() => {
          setInstruction("Exhala...");
          const exhaleTimer = setTimeout(() => {
            setCycle(c => c + 1);
          }, exhaleTime);
          return () => clearTimeout(exhaleTimer);
        }, holdTime);
        return () => clearTimeout(holdTimer);
      } else {
        setInstruction("Exhala...");
        const exhaleTimer = setTimeout(() => {
          setCycle(c => c + 1);
        }, exhaleTime);
        return () => clearTimeout(exhaleTimer);
      }
    }, inhaleTime);

    return () => clearTimeout(inhaleTimer);
  }, [cycle, onComplete]);

  const getAnimationClass = () => {
    if (instruction === "Inhala...") return "animate-inhale";
    if (instruction === "Exhala...") return "animate-exhale";
    if (instruction === "Sostén...") return "animate-hold"; // Same as inhale for visual simplicity
    return "";
  };
  
  // Define animations in a style tag or via Tailwind config if more complex
  // For simplicity, using inline styles for keyframes is not ideal for production.
  // Tailwind's JIT mode can create these from class names if configured.
  // Here, we'll use a simple scale for demonstration.

  let scale = 1;
  if (instruction === "Inhala...") scale = 1.5;
  if (instruction === "Exhala...") scale = 0.75;
  if (instruction === "Sostén...") scale = 1.5;


  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold text-teal-700 mb-6">Ejercicio de Respiración</h3>
      <div className="flex justify-center items-center h-48 mb-6">
        <div
          className="w-32 h-32 bg-sky-400 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Optionally, add an inner static circle or icon */}
        </div>
      </div>
      <p className="text-2xl font-medium text-slate-700 mb-2">{instruction}</p>
      <p className="text-sm text-slate-500">Ciclo {Math.min(cycle + 1, totalCycles)} de {totalCycles}</p>
      <Button onClick={onComplete} variant="secondary" className="w-full mt-6">
        Terminar Antes
      </Button>
      <style>{`
        @keyframes inhale { 0% { transform: scale(1); } 100% { transform: scale(1.5); } }
        @keyframes exhale { 0% { transform: scale(1.5); } 100% { transform: scale(0.75); } }
        .animate-inhale { animation: inhale ${inhaleTime/1000}s ease-in-out forwards; }
        .animate-exhale { animation: exhale ${exhaleTime/1000}s ease-in-out forwards; }
        .animate-hold { transform: scale(1.5); } /* Stays at inhaled scale */
      `}</style>
    </div>
  );
};

export default BreathingExercise;
    