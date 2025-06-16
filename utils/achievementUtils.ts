
import { Achievement, UserData, Stats } from '../types';
import { ACHIEVEMENTS } from '../constants';

export const checkAndUnlockAchievements = (
  userData: UserData,
  stats: Stats,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
): Achievement[] => {
  const newlyUnlocked: Achievement[] = [];
  let changed = false;

  ACHIEVEMENTS.forEach(achievement => {
    if (!userData.achievementsUnlocked.includes(achievement.id)) {
      if (achievement.condition(userData, stats)) {
        newlyUnlocked.push(achievement);
        if (userData) {
            userData.achievementsUnlocked.push(achievement.id);
            changed = true;
        }
      }
    }
  });

  if (changed && setUserData && userData) {
     setUserData(prevData => {
        if (!prevData) return null;
        return {...prevData, achievementsUnlocked: [...prevData.achievementsUnlocked]}; // Force update if internal array changed
     });
  }
  return newlyUnlocked;
};
    