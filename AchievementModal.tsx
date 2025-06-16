
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { Achievement } from '../types';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose, achievements }) => {
  if (!achievements.length) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¡Nuevo Logro Desbloqueado!" size="sm">
      <div className="text-center">
        <SparklesIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        {achievements.map(ach => (
          <div key={ach.id} className="mb-4">
            <h3 className="text-lg font-semibold text-teal-600">{ach.name}</h3>
            <p className="text-sm text-slate-600">{ach.description}</p>
            {ach.icon && React.createElement(ach.icon, {className: "h-8 w-8 text-teal-500 mx-auto mt-2"})}
          </div>
        ))}
        <Button onClick={onClose} className="mt-4 w-full">
          ¡Entendido!
        </Button>
      </div>
    </Modal>
  );
};

export default AchievementModal;
    