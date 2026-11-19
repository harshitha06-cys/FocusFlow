import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Calendar,
  Flame,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Coffee,
  Check,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../data/sampleData';
import { sounds } from '../utils/audio';

export default function PlannerView() {
  const {
    studySessions,
    courses,
    profile,
    addStudySession,
    updateStudySession,
    toggleSessionComplete,
    deleteStudySession,
    logFocusMinutes,
    getCourseById,
    setQuickAddModal
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString(0));

  // Full Pomodoro Timer State
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(profile.pomodoroSettings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(2);
  const [activeCourseId, setActiveCourseId] = useState(courses[0]?.id || '');
  const [customMinutes, setCustomMinutes] = useState(profile.pomodoroSettings.focusDuration);

  // Time slots for schedule (8 AM to 10 PM)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  // Timer Tick Effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (timerMode === 'focus') {
        const nextCount = completedSessionsCount + 1;
        setCompletedSessionsCount(nextCount);
        logFocusMinutes(customMinutes, activeCourseId);

        // Auto transition to break
        if (nextCount % profile.pomodoroSettings.sessionsBeforeLongBreak === 0) {
          setTimerMode('longBreak');
          setTimeLeft(profile.pomodoroSettings.longBreakDuration * 60);
        } else {
          setTimerMode('shortBreak');
          setTimeLeft(profile.pomodoroSettings.shortBreakDuration * 60);
        }
      } else {
        setTimerMode('focus');
        setTimeLeft(customMinutes * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode, customMinutes, activeCourseId, completedSessionsCount, profile.pomodoroSettings]);

  const switchMode = (mode) => {
    sounds.playClick();
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'focus') {
      setTimeLeft(customMinutes * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(profile.pomodoroSettings.shortBreakDuration * 60);
    } else {
      setTimeLeft(profile.pomodoroSettings.longBreakDuration * 60);
    }
  };

  const handleToggleTimer = () => {
    sounds.playClick();
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    sounds.playClick();
    setIsRunning(false);
    if (timerMode === 'focus') {
      setTimeLeft(customMinutes * 60);
    } else if (timerMode === 'shortBreak') {
      setTimeLeft(profile.pomodoroSettings.shortBreakDuration * 60);
    } else {
      setTimeLeft(profile.pomodoroSettings.longBreakDuration * 60);
    }
  };

  const formatTimerDigits = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Total session seconds for progress ring
  const totalModeDuration =
    timerMode === 'focus'
      ? customMinutes * 60
      : timerMode === 'shortBreak'
      ? profile.pomodoroSettings.shortBreakDuration * 60
      : profile.pomodoroSettings.longBreakDuration * 60;

  const progressPercent = Math.max(0, Math.min(100, ((totalModeDuration - timeLeft) / totalModeDuration) * 100));

  // Filter study sessions by selected date
  const dateSessions = studySessions.filter((s) => s.date === selectedDate);
  const totalPlannedMinutes = dateSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const completedMinutes = dateSessions
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  // Quick Date Navigation
  const changeDateBy = (offset) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner / Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Daily Study Planner & Pomodoro
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Time-block your schedule, run deep focus intervals, and log intentional study blocks
          </p>
        </div>

        {/* Date Selector buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => changeDateBy(-1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-transparent text-slate-800 dark:text-slate-100 border-none focus:outline-none"
          />

          <button
            onClick={() => setSelectedDate(getTodayDateString(0))}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm"
          >
            Today
          </button>

          <button
            onClick={() => changeDateBy(1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Left: Full Pomodoro Timer Widget | Right: Timeblocking Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Pomodoro Master Control */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            {/* Ambient background glow */}
            <div
              className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
                timerMode === 'focus'
                  ? 'bg-brand-500'
                  : timerMode === 'shortBreak'
                  ? 'bg-emerald-500'
                  : 'bg-violet-500'
              }`}
            />

            {/* Mode Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 gap-1">
                <button
                  onClick={() => switchMode('focus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timerMode === 'focus'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Deep Focus
                </button>
                <button
                  onClick={() => switchMode('shortBreak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timerMode === 'shortBreak'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Short Break
                </button>
                <button
                  onClick={() => switchMode('longBreak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timerMode === 'longBreak'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Long Break
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Coffee className="w-4 h-4 text-amber-500" />
                <span>Round #{completedSessionsCount + 1}</span>
              </div>
            </div>

            {/* Circular Timer Visual Display */}
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* SVG Radial Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="98"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="98"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 98}
                    strokeDashoffset={2 * Math.PI * 98 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className={`transition-all duration-500 ${
                      timerMode === 'focus'
                        ? 'text-brand-600'
                        : timerMode === 'shortBreak'
                        ? 'text-emerald-500'
                        : 'text-violet-500'
                    }`}
                  />
                </svg>

                {/* Inner Digits */}
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    {formatTimerDigits(timeLeft)}
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 ${
                      timerMode === 'focus'
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300'
                        : timerMode === 'shortBreak'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300'
                    }`}
                  >
                    {isRunning ? 'Interval Active' : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Progress percentage indicator */}
              <p className="mt-3 text-xs text-slate-400 font-mono">
                {Math.round(progressPercent)}% elapsed
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleTimer}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'
                    : timerMode === 'focus'
                    ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Start Interval</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                title="Reset interval"
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Custom duration slider & Course tagging */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  <span>Focus Interval Length:</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">
                    {customMinutes} minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={customMinutes}
                  disabled={isRunning}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCustomMinutes(val);
                    if (timerMode === 'focus' && !isRunning) {
                      setTimeLeft(val * 60);
                    }
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Log Focus Under Course:
                </label>
                <select
                  value={activeCourseId}
                  onChange={(e) => setActiveCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Daily Schedule Timeblocks */}
        <div className="lg:col-span-7 space-y-4">
          {/* Day summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400">Planned</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {(totalPlannedMinutes / 60).toFixed(1)}h
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400">Completed</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {(completedMinutes / 60).toFixed(1)}h
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400">Sessions</span>
              <p className="text-xl font-black text-brand-600 dark:text-brand-400 mt-1">
                {dateSessions.filter((s) => s.completed).length} / {dateSessions.length}
              </p>
            </div>
          </div>

          {/* Timeblocking List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Scheduled Time Blocks ({selectedDate})
              </h3>
              <button
                onClick={() => setQuickAddModal({ isOpen: true, defaultType: 'session' })}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Block</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {dateSessions.length > 0 ? (
                dateSessions.map((session) => {
                  const course = getCourseById(session.courseId);
                  return (
                    <div
                      key={session.id}
                      className={`p-4 rounded-xl border transition-all ${
                        session.completed
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-500/50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleSessionComplete(session.id)}
                            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                              session.completed
                                ? 'bg-emerald-500 text-white'
                                : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500'
                            }`}
                          >
                            {session.completed && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: course?.color ? `${course.color}20` : '#6366f120',
                                  color: course?.color || '#6366f1'
                                }}
                              >
                                {course?.code}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {session.technique}
                              </span>
                              <h4
                                className={`text-sm font-bold text-slate-900 dark:text-white ${
                                  session.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                }`}
                              >
                                {session.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                                {session.startTime} - {session.endTime}
                              </span>
                              <span>•</span>
                              <span>{session.durationMinutes} minutes</span>
                            </div>

                            {session.notes && (
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteStudySession(session.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  <CalendarDays className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  No study sessions scheduled for this day yet. Click "Add Block" above to plan your study time!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
