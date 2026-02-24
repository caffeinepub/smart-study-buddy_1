import { useState, useEffect } from 'react';

interface ProgressData {
  date: string;
  totalMinutes: number;
  lastStudyDate: string;
}

export function useStudyProgress() {
  const [progressData, setProgressData] = useState<ProgressData>(() => {
    const stored = localStorage.getItem('study-progress');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      date: new Date().toDateString(),
      totalMinutes: 0,
      lastStudyDate: new Date().toDateString(),
    };
  });

  const today = new Date().toDateString();
  const todayGoal = 2; // 2 hours goal

  // Reset if it's a new day
  useEffect(() => {
    if (progressData.date !== today) {
      const newData = {
        date: today,
        totalMinutes: 0,
        lastStudyDate: progressData.lastStudyDate,
      };
      setProgressData(newData);
      localStorage.setItem('study-progress', JSON.stringify(newData));
    }
  }, [today, progressData]);

  // Calculate streak
  const calculateStreak = () => {
    const lastDate = new Date(progressData.lastStudyDate);
    const currentDate = new Date(today);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, maintain streak
      const storedStreak = localStorage.getItem('study-streak');
      return storedStreak ? parseInt(storedStreak) : 1;
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      const storedStreak = localStorage.getItem('study-streak');
      const newStreak = storedStreak ? parseInt(storedStreak) + 1 : 1;
      localStorage.setItem('study-streak', newStreak.toString());
      return newStreak;
    } else {
      // Streak broken, reset to 1
      localStorage.setItem('study-streak', '1');
      return 1;
    }
  };

  const streak = calculateStreak();
  const todayHours = progressData.totalMinutes / 60;
  const progressPercentage = Math.min(Math.round((todayHours / todayGoal) * 100), 100);

  const addSession = (minutes: number) => {
    const newData = {
      date: today,
      totalMinutes: progressData.totalMinutes + minutes,
      lastStudyDate: today,
    };
    setProgressData(newData);
    localStorage.setItem('study-progress', JSON.stringify(newData));
  };

  return {
    streak,
    todayHours,
    todayGoal,
    progressPercentage,
    addSession,
  };
}
