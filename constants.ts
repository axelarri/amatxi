
import { HealthMilestone, Achievement } from './types';
import { UserData, Stats } from './types';
import { BeakerIcon, CalendarDaysIcon, CurrencyEuroIcon, FaceSmileIcon, HeartIcon, SparklesIcon, TrophyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const APP_NAME = "AMATXI";
export const LOCAL_STORAGE_KEY = "amatxiUserData";

export const INITIAL_USER_DATA: UserData = {
  lastCigaretteDate: null,
  cigarettesPerDay: 10,
  packPrice: 5,
  packSize: 20,
  mainMotivation: "Por mis hijos y mi salud.",
  personalMotivations: [],
  cravings: [],
  relapses: [],
  achievementsUnlocked: [],
  totalSmokeFreeDaysEver: 0,
  currentAttemptStartDate: null,
};

export const HEALTH_MILESTONES: HealthMilestone[] = [
  { id: 'hm1', timeToAchieve: 20 * 60 * 1000, title: "20 Minutos", description: "Tu presión arterial y ritmo cardíaco comienzan a normalizarse." },
  { id: 'hm2', timeToAchieve: 8 * 60 * 60 * 1000, title: "8 Horas", description: "Los niveles de nicotina y monóxido de carbono en sangre se reducen a la mitad. El oxígeno vuelve a la normalidad." },
  { id: 'hm3', timeToAchieve: 48 * 60 * 60 * 1000, title: "48 Horas", description: "El monóxido de carbono se elimina. Tus pulmones empiezan a limpiarse. El sentido del gusto y olfato mejoran." },
  { id: 'hm4', timeToAchieve: 72 * 60 * 60 * 1000, title: "72 Horas", description: "Respirar es más fácil. Los bronquios se relajan. Aumenta tu energía." },
  { id: 'hm5', timeToAchieve: 14 * 24 * 60 * 60 * 1000, title: "2 Semanas", description: "Mejora la circulación sanguínea en todo el cuerpo." },
  { id: 'hm6', timeToAchieve: 3 * 30 * 24 * 60 * 60 * 1000, title: "3 Meses", description: "La tos y la dificultad para respirar disminuyen. La función pulmonar puede aumentar hasta un 10%." },
  { id: 'hm7', timeToAchieve: 1 * 365 * 24 * 60 * 60 * 1000, title: "1 Año", description: "El riesgo de infarto se reduce a la mitad comparado con un fumador." },
  { id: 'hm8', timeToAchieve: 10 * 365 * 24 * 60 * 60 * 1000, title: "10 Años", description: "El riesgo de cáncer de pulmón se reduce a la mitad." },
  { id: 'hm9', timeToAchieve: 15 * 365 * 24 * 60 * 60 * 1000, title: "15 Años", description: "El riesgo de infarto es igual al de alguien que nunca ha fumado." },
];

export const FAMILY_PRIDE_MESSAGES: string[] = [
  "Tus hijos están muy orgullosos de ti por cada día sin humo.",
  "Cada día sin fumar es un regalo para tu salud y para tus hijos.",
  "¡Tu esfuerzo inspira a tu familia! Sigue así.",
  "Amaia, eres un ejemplo de fortaleza para tus seres queridos.",
  "Recuerda cuánto te quieren tus hijos. ¡Lo estás haciendo genial!",
  "Piensa en los momentos felices que compartirás con tus hijos gracias a esta decisión."
];

export const CRAVING_TIPS: string[] = [
  "Bebe un vaso de agua grande.",
  "Mastiga chicle sin azúcar o un caramelo.",
  "Sal a caminar 5 minutos.",
  "Llama a un amigo/a o a tus hijos.",
  "Realiza 10 respiraciones profundas y lentas.",
  "Recuerda tus motivaciones principales.",
  "Piensa en lo orgullosos que están tus hijos.",
  "El antojo pasará en unos minutos. ¡Tú puedes!",
  "Distráete con una tarea rápida.",
  "Haz algunos estiramientos."
];

export const RELAPSE_TRIGGERS: string[] = [
  "Estrés",
  "Evento social",
  "Consumo de alcohol",
  "Después de comer",
  "Con el café",
  "Aburrimiento",
  "Ver a otros fumar",
  "Un mal día",
  "Antigua rutina",
  "Otro"
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1_day', name: "Primer Día Superado", description: "¡Has completado tu primer día sin fumar!", icon: CalendarDaysIcon, condition: (data, stats) => stats.daysSmokeFree >= 1 },
  { id: 'ach_3_days', name: "72 Horas de Victoria", description: "¡Llevas 3 días sin nicotina en tu cuerpo!", icon: ShieldCheckIcon, condition: (data, stats) => stats.daysSmokeFree >= 3 },
  { id: 'ach_1_week', name: "Una Semana Sin Humo", description: "¡Fantástico! Has cumplido una semana.", icon: TrophyIcon, condition: (data, stats) => stats.daysSmokeFree >= 7 },
  { id: 'ach_100_cigs', name: "100 Cigarrillos Menos", description: "Has evitado fumar 100 cigarrillos.", icon: BeakerIcon, condition: (data, stats) => stats.cigarettesNotSmoked >= 100 },
  { id: 'ach_50_eur', name: "Ahorro de 50€", description: "¡Has ahorrado 50€ para darte un capricho!", icon: CurrencyEuroIcon, condition: (data, stats) => stats.moneySaved >= 50 },
  { id: 'ach_1_month', name: "Un Mes de Logros", description: "¡Un mes entero! Tu salud te lo agradece.", icon: HeartIcon, condition: (data, stats) => stats.daysSmokeFree >= 30 },
  { id: 'ach_motivation_set', name: "Motivación Clara", description: "Has definido tus razones para dejarlo. ¡Eso es poder!", icon: FaceSmileIcon, condition: (data) => (data.personalMotivations.length > 0 || !!data.mainMotivation) },
  { id: 'ach_first_craving_overcome', name: "Primer Antojo Vencido", description: "¡Superaste tu primer antojo registrado! Eres fuerte.", icon: SparklesIcon, condition: (data) => data.cravings.some(c => c.overcome) },
];

export const MEMORY_GAME_EMOJIS: string[] = ['😊', '🌟', '💖', '🚀', '🎉', '💡', '🌱', '🎈'];
    