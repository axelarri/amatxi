
import React from 'react';
import { UserData, Stats, RelapseLog, Achievement as AchievementType } from '../types';
import { ACHIEVEMENTS, RELAPSE_TRIGGERS } from '../constants';
import Button from './Button';
import { formatDateTime, formatDate } from '../utils/dateUtils';
import { TrophyIcon, ArrowPathIcon, CalendarDaysIcon, ForwardIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

interface ProgressProps {
  userData: UserData;
  stats: Stats;
  setUserData: (data: UserData | ((prevState: UserData | null) => UserData | null)) => void;
  onShowRelapseModal: () => void;
}

const Progress: React.FC<ProgressProps> = ({ userData, stats, setUserData, onShowRelapseModal }) => {
  const unlockedAchievements = ACHIEVEMENTS.filter(ach => userData.achievementsUnlocked.includes(ach.id));

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg">
        <CalendarDaysIcon className="h-10 w-10 mb-2 opacity-90" />
        <h2 className="text-2xl font-bold">Tu Viaje Hasta Ahora</h2>
        <p className="opacity-90">Cada paso cuenta. Mira todo lo que has avanzado.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
            <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500"/>
            Logros Desbloqueados ({unlockedAchievements.length} de {ACHIEVEMENTS.length})
        </h3>
        {unlockedAchievements.length > 0 ? (
          <ul className="space-y-3 mt-4">
            {unlockedAchievements.map((ach) => (
              <li key={ach.id} className="flex items-center p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                {React.createElement(ach.icon, {className: "h-7 w-7 text-yellow-600 mr-3 flex-shrink-0"})}
                <div>
                    <h4 className="font-medium text-yellow-800">{ach.name}</h4>
                    <p className="text-xs text-yellow-700">{ach.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 mt-3">¡Sigue adelante para desbloquear logros!</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center">
            <ArrowPathIcon className="h-6 w-6 mr-2 text-blue-500"/>
            Historial de Intentos y Recaídas
        </h3>
        <p className="text-sm text-slate-600 mb-2">Días totales sin fumar en tu vida: <span className="font-bold">{userData.totalSmokeFreeDaysEver + stats.daysSmokeFree}</span></p>
        
        {userData.relapses.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-4">Recuerda, una recaída es una oportunidad para aprender y fortalecerte. No es el fin del camino.</p>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {userData.relapses.slice().reverse().map((relapse) => ( // Show newest first
                <li key={relapse.id} className="p-3 bg-rose-50 rounded-md border-l-4 border-rose-400">
                  <p className="font-medium text-rose-700">Recaída el: {formatDateTime(relapse.timestamp)}</p>
                  {relapse.previousStreakDays !== undefined && <p className="text-xs text-rose-600">Racha anterior: {relapse.previousStreakDays} días</p>}
                  {relapse.trigger && <p className="text-xs text-rose-600">Posible desencadenante: {relapse.trigger}</p>}
                  {relapse.reason && <p className="text-xs text-rose-600">Notas: {relapse.reason}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-slate-500">Aún no has registrado ninguna recaída. ¡Sigue así!</p>
        )}
         <Button 
            onClick={onShowRelapseModal} 
            variant="danger" 
            className="w-full mt-6"
            leftIcon={<EyeSlashIcon className="h-5 w-5"/>}
          >
            Registrar una Recaída
          </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center">
            <ForwardIcon className="h-6 w-6 mr-2 text-green-500"/>
            Mirando Hacia Adelante
        </h3>
        <p className="text-slate-600">
          Tu progreso es admirable. Cada día sin fumar es una victoria para tu salud y para tus seres queridos. 
          Sigue utilizando las herramientas de la app, especialmente la sección de "Antojo" cuando lo necesites.
          ¡Estamos contigo en cada paso!
        </p>
      </div>
    </div>
  );
};

export default Progress;
    