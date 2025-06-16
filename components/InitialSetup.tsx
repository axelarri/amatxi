
import React, { useState } from 'react';
import { UserData, UserSettings } from '../types';
import { INITIAL_USER_DATA } from '../constants';
import Button from './Button';
import { Input, Textarea } from './Input';
import { APP_NAME } from '../constants';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

interface InitialSetupProps {
  onSetupComplete: (settings: UserSettings) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<UserSettings>({
    lastCigaretteDate: new Date().toISOString(),
    cigarettesPerDay: INITIAL_USER_DATA.cigarettesPerDay,
    packPrice: INITIAL_USER_DATA.packPrice,
    packSize: INITIAL_USER_DATA.packSize,
    mainMotivation: '',
    personalMotivations: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserSettings, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof UserSettings]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Assuming value is YYYY-MM-DD from input type="date"
    // And time is HH:MM from input type="time"
    // For simplicity, let's combine date and time if they are separate inputs
    // Or just use datetime-local
    setSettings(prev => ({
      ...prev,
      [name]: new Date(value).toISOString(),
    }));
  };


  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof UserSettings, string>> = {};
    if (step === 1) {
      if (!settings.lastCigaretteDate) newErrors.lastCigaretteDate = "Por favor, selecciona una fecha y hora.";
      else if (new Date(settings.lastCigaretteDate) > new Date()) newErrors.lastCigaretteDate = "La fecha no puede ser en el futuro.";
    }
    if (step === 2) {
      if (settings.cigarettesPerDay <= 0) newErrors.cigarettesPerDay = "Debe ser mayor que 0.";
      if (settings.packPrice <= 0) newErrors.packPrice = "Debe ser mayor que 0.";
      if (settings.packSize <= 0) newErrors.packSize = "Debe ser mayor que 0.";
    }
    if (step === 3) {
      if (!settings.mainMotivation.trim()) newErrors.mainMotivation = "Escribe tu motivación principal.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (validateStep()) {
      onSetupComplete(settings);
    }
  };
  
  // Get current date and time in YYYY-MM-DDTHH:MM format for datetime-local input
  const nowForInput = new Date().toISOString().slice(0, 16);


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-cyan-600 flex flex-col justify-center items-center p-4 text-white">
      <div className="bg-white text-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-teal-600 mb-2 text-center">{APP_NAME}</h1>
        <p className="text-slate-600 text-center mb-6">¡Bienvenida! Configura tu camino para dejar de fumar.</p>

        <div className="mb-6">
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-3 h-3 rounded-full ${step >= s ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
            ))}
          </div>

          {step === 1 && (
            <div className="transition-opacity duration-500 ease-in-out opacity-100"> {/* Replaced animate-fadeIn with Tailwind transition */}
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Paso 1: Tu Último Cigarrillo</h2>
              <Input
                label="¿Cuándo fue tu último cigarrillo?"
                type="datetime-local"
                name="lastCigaretteDate"
                value={settings.lastCigaretteDate ? settings.lastCigaretteDate.slice(0,16) : nowForInput}
                onChange={handleDateChange}
                max={nowForInput} // Cannot be in the future
                error={errors.lastCigaretteDate}
              />
               <p className="text-xs text-slate-500 mt-1">Esto nos ayudará a calcular tu progreso.</p>
            </div>
          )}

          {step === 2 && (
            <div className="transition-opacity duration-500 ease-in-out opacity-100"> {/* Replaced animate-fadeIn with Tailwind transition */}
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Paso 2: Tus Hábitos</h2>
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
              <p className="text-xs text-slate-500 mt-1">Estos datos se usan para calcular tu ahorro.</p>
            </div>
          )}

          {step === 3 && (
            <div className="transition-opacity duration-500 ease-in-out opacity-100"> {/* Replaced animate-fadeIn with Tailwind transition */}
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Paso 3: Tu Motivación</h2>
              <Textarea
                label="Tu razón más importante para dejar de fumar:"
                name="mainMotivation"
                value={settings.mainMotivation}
                onChange={handleChange}
                placeholder="Ej: Quiero estar sana para mis hijos, quiero ver crecer a mis nietos..."
                rows={4}
                error={errors.mainMotivation}
              />
              <p className="text-xs text-slate-500 mt-1">Esto te ayudará a mantenerte enfocada.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          {step > 1 ? (
            <Button variant="ghost" onClick={prevStep} leftIcon={<ArrowLeftIcon className="h-5 w-5"/>}>
              Anterior
            </Button>
          ) : <div /> /* Placeholder for spacing */}
          {step < 3 ? (
            <Button onClick={nextStep} rightIcon={<ArrowRightIcon className="h-5 w-5"/>}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} rightIcon={<CheckIcon className="h-5 w-5"/>}>
              Comenzar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialSetup;
