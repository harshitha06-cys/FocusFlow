import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import {
  INITIAL_COURSES,
  INITIAL_TASKS,
  INITIAL_ASSIGNMENTS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_USER_PROFILE,
  WEEKLY_STATS_HISTORY
} from '../data/sampleData';

const AppContext = createContext(null);

const STORAGE_KEY = 'focusflow_data_v2';

export function AppProvider({ children }) {
  // Load initial state from LocalStorage or Fallback to sample data
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          courses: parsed.courses || INITIAL_COURSES,
          tasks: parsed.tasks || INITIAL_TASKS,
          assignments: parsed.assignments || INITIAL_ASSIGNMENTS,
          studySessions: parsed.studySessions || INITIAL_STUDY_SESSIONS,
          profile: parsed.profile || INITIAL_USER_PROFILE,
          weeklyStats: parsed.weeklyStats || WEEKLY_STATS_HISTORY
        };
      }
    } catch (e) {
      console.error('Error loading FocusFlow data from localStorage', e);
    }
    return {
      courses: INITIAL_COURSES,
      tasks: INITIAL_TASKS,
      assignments: INITIAL_ASSIGNMENTS,
      studySessions: INITIAL_STUDY_SESSIONS,
      profile: INITIAL_USER_PROFILE,
      weeklyStats: WEEKLY_STATS_HISTORY
    };
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddModal, setQuickAddModal] = useState({ isOpen: false, defaultType: 'task' });

  // Sync theme with document classList
  useEffect(() => {
    if (data.profile?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    sounds.enabled = data.profile?.soundEnabled ?? true;
  }, [data.profile?.theme, data.profile?.soundEnabled]);

  // Persist to LocalStorage on every state update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  // Trigger celebration confetti
  const triggerConfetti = (origin = { x: 0.5, y: 0.6 }) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin,
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899']
      });
    } catch {
      // safe fallback
    }
  };

  // Profile actions
  const updateProfile = (updates) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  };

  const toggleTheme = () => {
    const nextTheme = data.profile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: nextTheme });
    sounds.playClick();
  };

  const toggleSound = () => {
    const nextSound = !data.profile.soundEnabled;
    updateProfile({ soundEnabled: nextSound });
    sounds.enabled = nextSound;
    if (nextSound) sounds.playClick();
  };

  // Course actions
  const addCourse = (course) => {
    const newCourse = {
      id: 'c_' + Date.now(),
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      credits: 3,
      currentGrade: 90,
      ...course
    };
    setData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
    sounds.playClick();
    return newCourse;
  };

  const updateCourse = (id, updates) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
  };

  const deleteCourse = (id) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
      tasks: prev.tasks.filter((t) => t.courseId !== id),
      assignments: prev.assignments.filter((a) => a.courseId !== id),
      studySessions: prev.studySessions.filter((s) => s.courseId !== id)
    }));
    sounds.playClick();
  };

  // Task actions
  const addTask = (task) => {
    const newTask = {
      id: 't_' + Date.now(),
      completed: false,
      priority: 'Medium',
      subtasks: [],
      estimatedMinutes: 45,
      ...task
    };
    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    sounds.playClick();
    return newTask;
  };

  const updateTask = (id, updates) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }));
  };

  const toggleTask = (id, event) => {
    const targetTask = data.tasks.find((t) => t.id === id);
    const willBeCompleted = targetTask ? !targetTask.completed : false;

    if (willBeCompleted) {
      sounds.playTaskComplete();
      let origin = { x: 0.5, y: 0.5 };
      if (event && event.clientX) {
        origin = {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight
        };
      }
      triggerConfetti(origin);
    } else {
      sounds.playClick();
    }

    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: willBeCompleted } : t))
    }));
  };

  const deleteTask = (id) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
    sounds.playClick();
  };

  const batchCompleteTasks = (ids) => {
    sounds.playCelebration();
    triggerConfetti();
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (ids.includes(t.id) ? { ...t, completed: true } : t))
    }));
  };

  // Assignment actions
  const addAssignment = (assignment) => {
    const newAssignment = {
      id: 'a_' + Date.now(),
      status: 'Not Started',
      priority: 'Medium',
      progress: 0,
      checklist: [],
      weightPercentage: 10,
      ...assignment
    };
    setData((prev) => ({
      ...prev,
      assignments: [newAssignment, ...prev.assignments]
    }));
    sounds.playClick();
    return newAssignment;
  };

  const updateAssignment = (id, updates) => {
    if (updates.status === 'Submitted' || updates.status === 'Graded') {
      sounds.playCelebration();
      triggerConfetti();
    }
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a))
    }));
  };

  const deleteAssignment = (id) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id)
    }));
    sounds.playClick();
  };

  // Study session actions
  const addStudySession = (session) => {
    const newSession = {
      id: 's_' + Date.now(),
      completed: false,
      focusRating: null,
      technique: 'Deep Work',
      durationMinutes: 60,
      ...session
    };
    setData((prev) => ({
      ...prev,
      studySessions: [...prev.studySessions, newSession]
    }));
    sounds.playClick();
    return newSession;
  };

  const updateStudySession = (id, updates) => {
    setData((prev) => ({
      ...prev,
      studySessions: prev.studySessions.map((s) => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  const toggleSessionComplete = (id) => {
    const s = data.studySessions.find((item) => item.id === id);
    const willBeCompleted = s ? !s.completed : false;
    if (willBeCompleted) {
      sounds.playTaskComplete();
      triggerConfetti();
    } else {
      sounds.playClick();
    }
    setData((prev) => ({
      ...prev,
      studySessions: prev.studySessions.map((session) =>
        session.id === id ? { ...session, completed: willBeCompleted } : session
      )
    }));
  };

  const deleteStudySession = (id) => {
    setData((prev) => ({
      ...prev,
      studySessions: prev.studySessions.filter((s) => s.id !== id)
    }));
    sounds.playClick();
  };

  // Record completed Pomodoro or Study focus duration into today's stats
  const logFocusMinutes = (minutes, courseId = null) => {
    setData((prev) => {
      const currentStats = [...prev.weeklyStats];
      const todayIndex = currentStats.length - 1;
      if (todayIndex >= 0) {
        currentStats[todayIndex] = {
          ...currentStats[todayIndex],
          hours: +(currentStats[todayIndex].hours + (minutes / 60)).toFixed(2)
        };
      }
      return {
        ...prev,
        weeklyStats: currentStats
      };
    });
    sounds.playTimerFinished();
    triggerConfetti();
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    setData({
      courses: INITIAL_COURSES,
      tasks: INITIAL_TASKS,
      assignments: INITIAL_ASSIGNMENTS,
      studySessions: INITIAL_STUDY_SESSIONS,
      profile: INITIAL_USER_PROFILE,
      weeklyStats: WEEKLY_STATS_HISTORY
    });
    sounds.playCelebration();
    triggerConfetti();
  };

  // Export / Import JSON data backup
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `focusflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonData) => {
    try {
      if (jsonData && jsonData.courses && jsonData.tasks) {
        setData(jsonData);
        sounds.playCelebration();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Helper selectors
  const getCourseById = (id) => data.courses.find((c) => c.id === id);

  return (
    <AppContext.Provider
      value={{
        ...data,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        quickAddModal,
        setQuickAddModal,
        updateProfile,
        toggleTheme,
        toggleSound,
        addCourse,
        updateCourse,
        deleteCourse,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        batchCompleteTasks,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        addStudySession,
        updateStudySession,
        toggleSessionComplete,
        deleteStudySession,
        logFocusMinutes,
        resetToSampleData,
        exportData,
        importData,
        getCourseById,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
