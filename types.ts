
export interface UserSettings {
  lastCigaretteDate: string | null;
  cigarettesPerDay: number;
  packPrice: number;
  packSize: number;
  mainMotivation: string;
  personalMotivations: string[];
}

export interface CravingLog {
  id: string;
  timestamp: string;
  overcome: boolean;
  notes?: string;
}

export interface RelapseLog {
  id: string;
  timestamp: string;
  reason?: string;
  trigger?: string; 
  previousStreakDays?: number;
}

export interface UserData extends UserSettings {
  cravings: CravingLog[];
  relapses: RelapseLog[];
  achievementsUnlocked: string[];
  totalSmokeFreeDaysEver: number;
  currentAttemptStartDate: string | null; 
}

export interface HealthMilestone {
  id: string;
  timeToAchieve: number; // in milliseconds
  title: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode; 
  condition: (data: UserData, stats: Stats) => boolean;
}

export interface Stats {
  daysSmokeFree: number;
  hoursSmokeFree: number;
  minutesSmokeFree: number;
  secondsSmokeFree: number;
  cigarettesNotSmoked: number;
  moneySaved: number;
}

export enum GameCardState {
  Hidden,
  Revealed,
  Matched
}

export interface GameCard {
  id: number;
  value: string; // e.g. emoji or image url
  state: GameCardState;
}

export enum AppView {
  Dashboard = 'DASHBOARD',
  CravingHelper = 'CRAVING_HELPER',
  Motivations = 'MOTIVATIONS',
  Progress = 'PROGRESS',
  Settings = 'SETTINGS' // For editing initial setup data
}
    