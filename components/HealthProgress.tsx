
import React from 'react';
import { HealthMilestone } from '../types';
import { HEALTH_MILESTONES } from '../constants';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

interface HealthProgressProps {
  timeSmokeFreeMs: number;
}

const HealthProgress: React.FC<HealthProgressProps> = ({ timeSmokeFreeMs }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Tu Recuperación</h3>
      <ul className="space-y-4">
        {HEALTH_MILESTONES.map((milestone) => {
          const achieved = timeSmokeFreeMs >= milestone.timeToAchieve;
          return (
            <li key={milestone.id} className={`flex items-start p-3 rounded-md ${achieved ? 'bg-green-50 border-l-4 border-green-500' : 'bg-slate-50 border-l-4 border-slate-300'}`}>
              <div className="flex-shrink-0 mr-3">
                {achieved ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className={`font-semibold ${achieved ? 'text-green-700' : 'text-slate-600'}`}>{milestone.title}</h4>
                <p className={`text-sm ${achieved ? 'text-green-600' : 'text-slate-500'}`}>{milestone.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HealthProgress;
    
