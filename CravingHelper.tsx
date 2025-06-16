
import React, { useState, useEffect } from 'react';
import { UserData, CravingLog } from '../types';
import Button from './Button';
import { CRAVING_TIPS } from '../constants';
import MemoryGame from './MemoryGame';
import BreathingExercise from './BreathingExercise';
import Modal from './Modal';
import { LightBulbIcon, ShieldCheckIcon, HandThumbUpIcon, PuzzlePieceIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface CravingHelperProps {
  userData: UserData;
  setUserData: (data: UserData | ((prevState: UserData | null) => UserData | null)) => void;
}

type Activity = 'game' | 'breathing' | null;

const CravingHelper: React.FC<CravingHelperProps> = ({ userData, setUserData }) => {
  const [currentTip, setCurrentTip] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeActivity, setActiveActivity] = useState<Activity>(null);
  const [cravingLoggedToday, setCravingLoggedToday] = useState(0);

  useEffect(() => {
    setCurrentTip(CRAVING_TIPS[Math.floor(Math.random() * CRAVING_TIPS.length)]);
    updateCravingLoggedToday();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.cravings]);

  const updateCravingLoggedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const count = userData.cravings.filter(c => c.timestamp.startsWith(today) && c.overcome).length;
    setCravingLoggedToday(count);
  };

  const handleStartActivity = (activity: Activity) => {
    setActiveActivity(activity);
    setShowActivityModal(true);
  };

  const handleEndActivity = () => {
    setShowActivityModal(false);
    setActiveActivity(null);
    // Optionally log craving overcome after activity
  };

  const logCraving = (overcome: boolean) => {
    const newCraving: CravingLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      overcome: overcome,
    };
    setUserData(prev => prev ? ({ ...prev, cravings: [...prev.cravings, newCraving] }) : null);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl shadow-lg text-center">
        <ShieldCheckIcon className="h-12 w-12 mx-auto mb-3 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">¡Alto al Antojo!</h2>
        <p className="opacity-90">Estás en control. Utiliza estas herramientas para superarlo.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center">
          <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
          Consejo Rápido
        </h3>
        <p className="text-slate-600 italic text-lg mb-4">"{currentTip}"</p>
        <Button variant="ghost" onClick={() => setCurrentTip(CRAVING_TIPS[Math.floor(Math.random() * CRAVING_TIPS.length)])}>
          Otro Consejo
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Actividades de Distracción</h3>
        <p className="text-slate-600 mb-4">Desvía tu atención por unos minutos. ¡Tú puedes!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={() => handleStartActivity('game')} 
            leftIcon={<PuzzlePieceIcon className="h-5 w-5" />}
            size="lg"
            variant="secondary"
            className="bg-sky-100 text-sky-700 hover:bg-sky-200"
          >
            Juego de Memoria
          </Button>
          <Button 
            onClick={() => handleStartActivity('breathing')} 
            leftIcon={<SparklesIcon className="h-5 w-5" />}
            size="lg"
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          >
            Respiración Guiada
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
         <h3 className="text-xl font-semibold text-slate-700 mb-3">Registra tu Esfuerzo</h3>
         <p className="text-slate-600 mb-4">¿Superaste un antojo? ¡Reconoce tu victoria!</p>
         <Button 
            onClick={() => logCraving(true)} 
            leftIcon={<HandThumbUpIcon className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            ¡Sí, lo superé!
         </Button>
         {cravingLoggedToday > 0 && (
            <p className="text-green-600 mt-3 text-sm">
                ¡Has vencido {cravingLoggedToday} {cravingLoggedToday === 1 ? 'antojo' : 'antojos'} hoy!
            </p>
         )}
      </div>

      <Modal isOpen={showActivityModal} onClose={handleEndActivity} title={activeActivity === 'game' ? 'Juego de Memoria' : 'Ejercicio de Respiración'} size="md">
        {activeActivity === 'game' && <MemoryGame onGameEnd={handleEndActivity} />}
        {activeActivity === 'breathing' && <BreathingExercise onComplete={handleEndActivity} />}
      </Modal>
    </div>
  );
};

export default CravingHelper;
    