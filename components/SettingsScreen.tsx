
import React, { useState } from 'react';
import { UserData, UserSettings } from '../types';
import Button from './Button';
import { Input, Textarea } from './Input';
import { Cog6ToothIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SettingsScreenProps {
  userData: UserData;
  onSettingsUpdate: (updatedSettings: Partial<UserSettings>) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ userData, onSettingsUpdate }) => {
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    lastCigaretteDate: userData.lastCigaretteDate,
    cigarettesPerDay: userData.cigarettesPerDay,
    packPrice: userData.packPrice,
    packSize: userData.packSize,
    // Main motivation is handled in Motivations screen, so not here to avoid confusion
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserSettings, string>>>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof UserSettings]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setIsSaved(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: new Date(value).toISOString(),
    }));
    setIsSaved(false);
  };

  const validateSettings = (): boolean => {
    const newErrors: Partial<Record<keyof UserSettings, string>> = {};
    if (settings.lastCigaretteDate && new Date(settings.lastCigaretteDate) > new Date()) {
      newErrors.lastCigaretteDate = "La fecha no puede ser en el futuro.";
    }
    if (settings.cigarettesPerDay !== undefined && settings.cigarettesPerDay <= 0) {
      newErrors.cigarettesPerDay = "Debe ser mayor que 0.";
    }
    if (settings.packPrice !== undefined && settings.packPrice <= 0) {
      newErrors.packPrice = "Debe ser mayor que 0.";
    }
    if (settings.packSize !== undefined && settings.packSize <= 0) {
      newErrors.packSize = "Debe ser mayor que 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateSettings()) {
      onSettingsUpdate(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    }
  };
  
  const nowForInput = new Date().toISOString().slice(0, 16);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-xl shadow-lg">
        <Cog6ToothIcon className="h-10 w-10 mb-2 opacity-90" />
        <h2 className="text-2xl font-bold">Ajustes de la Aplicación</h2>
        <p className="opacity-90">Modifica tus datos iniciales si es necesario.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-3">Datos de Fumador</h3>
          <Input
            label="Fecha del último cigarrillo"
            type="datetime-local"
            name="lastCigaretteDate"
            value={settings.lastCigaretteDate ? settings.lastCigaretteDate.slice(0,16) : ''}
            onChange={handleDateChange}
            max={nowForInput}
            error={errors.lastCigaretteDate}
          />
          <p className="text-xs text-slate-500 -mt-2 mb-3">Cambiar esto reiniciará tu progreso actual de racha.</p>

          <Input
            label="Cigarrillos por día (aprox.)"
            type="number"
            name="cigarettesPerDay"
            value={settings.cigarettesPerDay}
            onChange={handleChange}
            min="1"
            error={errors.cigarettesPerDay}
          />
          <Input
            label="Precio del paquete (€)"
            type="number"
            name="packPrice"
            value={settings.packPrice}
            onChange={handleChange}
            min="0.1"
            step="0.01"
            error={errors.packPrice}
          />
          <Input
            label="Cigarrillos por paquete"
            type="number"
            name="packSize"
            value={settings.packSize}
            onChange={handleChange}
            min="1"
            error={errors.packSize}
          />
        </div>
        
        <Button onClick={handleSubmit} leftIcon={<CheckIcon className="h-5 w-5"/>} className="w-full">
          Guardar Cambios
        </Button>
        {isSaved && (
          <p className="text-sm text-green-600 mt-2 text-center">¡Ajustes guardados con éxito!</p>
        )}
      </div>
      
      <div className="bg-slate-100 p-4 rounded-lg shadow-inner">
        <h4 className="font-semibold text-slate-700 mb-2">Nota Importante:</h4>
        <p className="text-sm text-slate-600">
          La motivación principal se gestiona en la pantalla "Motivos". Los cambios aquí pueden afectar tus estadísticas y logros.
          Recuerda que esta aplicación es una herramienta de apoyo, y la constancia es clave.
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;
    
