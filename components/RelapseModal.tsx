
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Input, Textarea } from './Input';
import { RelapseLog } from '../types';
import { RELAPSE_TRIGGERS } from '../constants';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogRelapse: (relapseData: Pick<RelapseLog, 'reason' | 'trigger'>) => void;
}

const RelapseModal: React.FC<RelapseModalProps> = ({ isOpen, onClose, onLogRelapse }) => {
  const [reason, setReason] = useState('');
  const [trigger, setTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');

  const handleSubmit = () => {
    const finalTrigger = trigger === 'Otro' ? customTrigger : trigger;
    onLogRelapse({ reason, trigger: finalTrigger });
    setReason('');
    setTrigger('');
    setCustomTrigger('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar una Recaída" size="md">
      <div className="text-center mb-4">
        <ExclamationTriangleIcon className="h-12 w-12 text-amber-500 mx-auto mb-2" />
        <p className="text-slate-600">
          Un tropiezo no es el fin del camino, es una oportunidad para aprender.
          Registrar esto te ayudará a identificar patrones y fortalecerte para el futuro.
        </p>
      </div>
      
      <div>
        <label htmlFor="trigger" className="block text-sm font-medium text-slate-700 mb-1">¿Qué crees que lo desencadenó? (Opcional)</label>
        <select
            id="trigger"
            name="trigger"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm mb-3"
        >
            <option value="">Selecciona un desencadenante...</option>
            {RELAPSE_TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {trigger === 'Otro' && (
            <Input 
                label="Especifica el desencadenante:"
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                placeholder="Ej: Aniversario difícil"
                wrapperClassName="mb-3"
            />
        )}
      </div>

      <Textarea
        label="Notas adicionales sobre la recaída (Opcional):"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Ej: Me sentía muy estresada por el trabajo..."
        rows={3}
        wrapperClassName="mb-4"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleSubmit} className="w-full sm:flex-1">
          Registrar Recaída y Reiniciar Racha
        </Button>
        <Button variant="secondary" onClick={onClose} className="w-full sm:flex-1">
          Cancelar
        </Button>
      </div>
       <p className="text-xs text-slate-500 mt-4 text-center">
        Tu racha actual se reiniciará, pero tu progreso total de días sin fumar se conservará. ¡No te rindas!
      </p>
    </Modal>
  );
};

export default RelapseModal;
    
