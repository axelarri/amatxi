
import React, { useState, useEffect } from 'react';
import { UserData, Stats, AppView } from '../types';
import CounterCard from './CounterCard';
import HealthProgress from './HealthProgress';
import { calculateStats, formatTimeDifference } from '../utils/dateUtils';
import { FAMILY_PRIDE_MESSAGES } from '../constants';
import { ClockIcon, NoSymbolIcon, CurrencyEuroIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface DashboardProps {
  userData: UserData;
  stats: Stats;
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, stats, onNavigate }) => {
  const [familyMessage, setFamilyMessage] = useState('');

  useEffect(() => {
    setFamilyMessage(FAMILY_PRIDE_MESSAGES[Math.floor(Math.random() * FAMILY_PRIDE_MESSAGES.length)]);
  }, []);
  
  const timeSmokeFreeMs = userData.currentAttemptStartDate ? new Date().getTime() - new Date(userData.currentAttemptStartDate).getTime() : 0;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">¡Lo estás logrando, Amaia!</h2>
            <UserGroupIcon className="h-8 w-8 opacity-80" />
        </div>
        <p className="text-base opacity-90 italic">"{familyMessage}"</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CounterCard
          title="Tiempo sin fumar"
          value={formatTimeDifference(stats.daysSmokeFree, stats.hoursSmokeFree, stats.minutesSmokeFree)}
          icon={<ClockIcon className="h-6 w-6" />}
          colorClass="bg-sky-500"
        />
        <CounterCard
          title="Cigarrillos no fumados"
          value={stats.cigarettesNotSmoked}
          unit="cigs"
          icon={<NoSymbolIcon className="h-6 w-6" />}
          colorClass="bg-amber-500"
        />
        <CounterCard
          title="Dinero ahorrado"
          value={`€${stats.moneySaved.toFixed(2)}`}
          icon={<CurrencyEuroIcon className="h-6 w-6" />}
          colorClass="bg-lime-500"
        />
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-slate-700 mb-3">¿Sientes un antojo?</h3>
        <p className="text-slate-600 mb-4">No estás sola. Usa nuestras herramientas para superarlo.</p>
        <Button 
            onClick={() => onNavigate(AppView.CravingHelper)} 
            className="w-full sm:w-auto"
            size="lg"
        >
            ¡Ayuda Ya!
        </Button>
      </div>

      <HealthProgress timeSmokeFreeMs={timeSmokeFreeMs > 0 ? timeSmokeFreeMs : 0} />
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-slate-700 mb-3">Tus Motivaciones</h3>
        <p className="text-slate-600 mb-2 italic">"{userData.mainMotivation || 'Aún no has definido tu motivación principal.'}"</p>
        {userData.personalMotivations.length > 0 && (
            <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1 pl-1">
                {userData.personalMotivations.slice(0,2).map((m,i) => <li key={i}>{m}</li>)}
            </ul>
        )}
        <Button 
            onClick={() => onNavigate(AppView.Motivations)} 
            variant="secondary"
            className="w-full sm:w-auto"
        >
            Ver/Editar Motivaciones
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
    