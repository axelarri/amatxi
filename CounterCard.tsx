
import React from 'react';

interface CounterCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

const CounterCard: React.FC<CounterCardProps> = ({ title, value, unit, icon, colorClass = 'bg-teal-500' }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md text-white ${colorClass}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        {icon && <span className="opacity-70">{icon}</span>}
      </div>
      <p className="text-3xl font-bold">
        {value}
        {unit && <span className="text-lg ml-1 opacity-90">{unit}</span>}
      </p>
    </div>
  );
};

export default CounterCard;
    