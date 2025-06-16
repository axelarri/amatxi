
import React, { useState } from 'react';
import { UserData } from '../types';
import Button from './Button';
import { Input, Textarea } from './Input';
import { HeartIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MotivationsProps {
  userData: UserData;
  setUserData: (data: UserData | ((prevState: UserData | null) => UserData | null)) => void;
}

const Motivations: React.FC<MotivationsProps> = ({ userData, setUserData }) => {
  const [mainMotivationInput, setMainMotivationInput] = useState(userData.mainMotivation);
  const [personalMotivationInput, setPersonalMotivationInput] = useState('');
  const [editingMain, setEditingMain] = useState(false);

  const handleSaveMainMotivation = () => {
    setUserData(prev => prev ? ({ ...prev, mainMotivation: mainMotivationInput }) : null);
    setEditingMain(false);
  };

  const handleAddPersonalMotivation = () => {
    if (personalMotivationInput.trim() === '') return;
    setUserData(prev => prev ? ({ ...prev, personalMotivations: [...prev.personalMotivations, personalMotivationInput.trim()] }) : null);
    setPersonalMotivationInput('');
  };

  const handleRemovePersonalMotivation = (index: number) => {
    setUserData(prev => prev ? ({ ...prev, personalMotivations: prev.personalMotivations.filter((_, i) => i !== index) }) : null);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg">
        <HeartIcon className="h-10 w-10 mb-2 opacity-90" />
        <h2 className="text-2xl font-bold">Tus Razones para Seguir</h2>
        <p className="opacity-90">Recuerda por qué empezaste este camino. Estas son tus fuentes de fortaleza.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-slate-700">Tu Motivación Principal</h3>
            {!editingMain && (
                <Button variant="ghost" size="sm" onClick={() => setEditingMain(true)} leftIcon={<PencilIcon className="h-4 w-4"/>}>
                    Editar
                </Button>
            )}
        </div>
        {editingMain ? (
          <>
            <Textarea
              value={mainMotivationInput}
              onChange={(e) => setMainMotivationInput(e.target.value)}
              placeholder="Ej: Quiero estar sana para mis hijos..."
              rows={3}
            />
            <div className="flex gap-2 mt-2">
                <Button onClick={handleSaveMainMotivation} size="sm">Guardar</Button>
                <Button variant="secondary" size="sm" onClick={() => { setEditingMain(false); setMainMotivationInput(userData.mainMotivation); }}>Cancelar</Button>
            </div>
          </>
        ) : (
          <p className="text-slate-700 text-lg italic">"{userData.mainMotivation || 'Aún no has definido tu motivación principal.'}"</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-3">Otras Motivaciones Personales</h3>
        {userData.personalMotivations.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {userData.personalMotivations.map((motivation, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                <span className="text-slate-600">{motivation}</span>
                <Button variant="ghost" size="sm" onClick={() => handleRemovePersonalMotivation(index)} aria-label="Eliminar motivación">
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 mb-4">Añade otras razones que te impulsen a seguir adelante.</p>
        )}
        <div className="flex gap-2 items-end">
          <Input
            wrapperClassName="flex-grow mb-0"
            label="Añadir nueva motivación:"
            value={personalMotivationInput}
            onChange={(e) => setPersonalMotivationInput(e.target.value)}
            placeholder="Ej: Para viajar sin problemas, para ahorrar dinero..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddPersonalMotivation()}
          />
          <Button onClick={handleAddPersonalMotivation} leftIcon={<PlusIcon className="h-5 w-5"/>} className="whitespace-nowrap">
            Añadir
          </Button>
        </div>
      </div>
       <div className="bg-rose-50 p-4 rounded-lg shadow-inner">
        <h4 className="font-semibold text-rose-700 mb-2">Un Recordatorio Importante:</h4>
        <p className="text-sm text-rose-600">
          Tus hijos son una gran motivación. Cada paso que das hacia una vida sin humo es un ejemplo de amor y fortaleza para ellos. ¡Están muy orgullosos de ti, Amaia!
        </p>
      </div>
    </div>
  );
};

export default Motivations;
    
