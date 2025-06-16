
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserData, UserSettings, Stats, AppView, Achievement, RelapseLog } from './types';
import { INITIAL_USER_DATA, LOCAL_STORAGE_KEY, APP_NAME } from './constants';
import InitialSetup from './components/InitialSetup';
import Dashboard from './components/Dashboard';
import CravingHelper from './components/CravingHelper';
import Motivations from './components/Motivations';
import Progress from './components/Progress';
import SettingsScreen from './components/SettingsScreen';
import NavBar from './components/NavBar';
import AchievementModal from './components/AchievementModal';
import RelapseModal from './components/RelapseModal';
import { calculateStats } from './utils/dateUtils';
import { checkAndUnlockAchievements } from './utils/achievementUtils';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [userData, setUserData] = useLocalStorage<UserData | null>(LOCAL_STORAGE_KEY, null);
  const [stats, setStats] = useState<Stats>(calculateStats(null));
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('amatxi-darkMode', false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);


  useEffect(() => {
    if (userData === null || userData.lastCigaretteDate === null) {
      setShowInitialSetup(true);
    } else {
      setShowInitialSetup(false);
      // Ensure currentAttemptStartDate is set if migrating from old data or first real load
      if (!userData.currentAttemptStartDate && userData.lastCigaretteDate) {
        setUserData(prev => prev ? ({...prev, currentAttemptStartDate: prev.lastCigaretteDate}) : null);
      }
    }
  }, [userData, setUserData]);

  const handleSetupComplete = useCallback((settings: UserSettings) => {
    const fullUserData: UserData = {
      ...INITIAL_USER_DATA,
      ...settings,
      currentAttemptStartDate: settings.lastCigaretteDate, // Start current attempt from this date
      totalSmokeFreeDaysEver: 0, // Reset for a "new" user through setup
      achievementsUnlocked: [], // Reset achievements
      cravings: [],
      relapses: []
    };
    setUserData(fullUserData);
    setShowInitialSetup(false);
    setCurrentView(AppView.Dashboard);
  }, [setUserData]);

  const handleSettingsUpdate = useCallback((updatedSettings: Partial<UserSettings>) => {
    setUserData(prevData => {
      if (!prevData) return null;
      
      const newUserData = { ...prevData, ...updatedSettings };

      // If lastCigaretteDate changed, it means the user is effectively restarting their current quit attempt.
      if (updatedSettings.lastCigaretteDate && updatedSettings.lastCigaretteDate !== prevData.lastCigaretteDate) {
        // Current streak days are lost, but not added to totalSmokeFreeDaysEver here. That happens on relapse.
        newUserData.currentAttemptStartDate = updatedSettings.lastCigaretteDate;
        // Optionally, could clear achievements related to current streak, or handle this more granularly.
        // For simplicity, we just reset the start date.
      }
      return newUserData;
    });
  }, [setUserData]);
  
  const handleLogRelapse = useCallback((relapseDetails: Pick<RelapseLog, 'reason' | 'trigger'>) => {
    setUserData(prevData => {
        if (!prevData || !prevData.currentAttemptStartDate) return prevData;

        const currentStats = calculateStats(prevData);
        const daysThisAttempt = currentStats.daysSmokeFree;

        const newRelapse: RelapseLog = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            reason: relapseDetails.reason,
            trigger: relapseDetails.trigger,
            previousStreakDays: daysThisAttempt
        };
        
        return {
            ...prevData,
            lastCigaretteDate: newRelapse.timestamp, // This is the date of the "last cigarette" for the new attempt
            currentAttemptStartDate: newRelapse.timestamp, // New attempt starts now
            totalSmokeFreeDaysEver: prevData.totalSmokeFreeDaysEver + daysThisAttempt,
            relapses: [...prevData.relapses, newRelapse],
            // Optionally clear streak-based achievements here
            // achievementsUnlocked: prevData.achievementsUnlocked.filter(achId => !isStreakAchievement(achId)) 
        };
    });
    setShowRelapseModal(false);
    setCurrentView(AppView.Dashboard); // Navigate to dashboard after relapse
  }, [setUserData]);


  useEffect(() => {
    if (userData && userData.currentAttemptStartDate) {
      const interval = setInterval(() => {
        const currentStats = calculateStats(userData);
        setStats(currentStats);
        
        const unlocked = checkAndUnlockAchievements(userData, currentStats, setUserData); // setUserData might be too frequent here
        if (unlocked.length > 0) {
          setNewlyUnlockedAchievements(prev => [...prev, ...unlocked.filter(u => !prev.find(p => p.id === u.id))]);
          setShowAchievementModal(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setStats(calculateStats(null)); // Reset stats if no user data or start date
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]); // Removed setUserData from deps to avoid loop with checkAndUnlockAchievements

  const CurrentScreen = useMemo(() => {
    if (!userData) return null; // Or a loading spinner
    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard userData={userData} stats={stats} onNavigate={setCurrentView} />;
      case AppView.CravingHelper:
        return <CravingHelper userData={userData} setUserData={setUserData} />;
      case AppView.Motivations:
        return <Motivations userData={userData} setUserData={setUserData} />;
      case AppView.Progress:
        return <Progress userData={userData} stats={stats} setUserData={setUserData} onShowRelapseModal={() => setShowRelapseModal(true)}/>;
      case AppView.Settings:
        return <SettingsScreen userData={userData} onSettingsUpdate={handleSettingsUpdate} />;
      default:
        return <Dashboard userData={userData} stats={stats} onNavigate={setCurrentView} />;
    }
  }, [currentView, userData, stats, setUserData, handleSettingsUpdate]);


  if (showInitialSetup || !userData) {
    return <InitialSetup onSetupComplete={handleSetupComplete} />;
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      <header className={`p-4 shadow-md sticky top-0 z-30 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-screen-md mx-auto flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>{APP_NAME}</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
            aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-slate-700" />}
          </button>
        </div>
      </header>
      
      <main className="flex-grow p-4 pb-20 max-w-screen-md mx-auto w-full">
        {CurrentScreen}
      </main>
      
      <NavBar currentView={currentView} onNavigate={setCurrentView} />
      
      <AchievementModal 
        isOpen={showAchievementModal && newlyUnlockedAchievements.length > 0} 
        onClose={() => {
            setShowAchievementModal(false);
            setNewlyUnlockedAchievements([]); // Clear after showing
        }}
        achievements={newlyUnlockedAchievements} 
      />
      <RelapseModal
        isOpen={showRelapseModal}
        onClose={() => setShowRelapseModal(false)}
        onLogRelapse={handleLogRelapse}
      />
    </div>
  );
};

export default App;
    