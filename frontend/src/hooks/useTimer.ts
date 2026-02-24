import { useState, useEffect, useCallback } from 'react';
import { useStudyProgress } from './useStudyProgress';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const { addSession } = useStudyProgress();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Get session count from localStorage
  const getSessionCount = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('pomodoro-sessions');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        return data.count;
      }
    }
    return 0;
  };

  const [sessionCount, setSessionCount] = useState(getSessionCount());

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      setIsRunning(false);
      
      if (!isBreak) {
        // Focus session completed
        addSession(25); // Add 25 minutes to study time
        
        // Update session count
        const today = new Date().toDateString();
        const newCount = sessionCount + 1;
        localStorage.setItem('pomodoro-sessions', JSON.stringify({ date: today, count: newCount }));
        setSessionCount(newCount);
        
        // Show motivational message
        alert('🎉 Great job! You completed a focus session. Time for a break!');
      } else {
        alert('✨ Break time is over. Ready for another focus session?');
      }
      
      // Switch between focus and break
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? FOCUS_TIME : BREAK_TIME);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, addSession, sessionCount]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
  }, []);

  return {
    minutes,
    seconds,
    isRunning,
    isBreak,
    sessionCount,
    progress,
    start,
    pause,
    reset,
  };
}
