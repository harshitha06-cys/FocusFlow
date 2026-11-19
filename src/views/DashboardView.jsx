import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertCircle,
  Plus,
  ChevronRight,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDY_QUOTES, getTodayDateString } from '../data/sampleData';
import { sounds } from '../utils/audio';

export default function DashboardView() {
  const {
    tasks,
    assignments,
    studySessions,
    courses,
    profile,
    weeklyStats,
    toggleTask,
    toggleSessionComplete,
    setActiveView,
    setQuickAddModal,
    logFocusMinutes,
    getCourseById
  } = useApp();

  // Pick daily quote based on day
  const dailyQuote = STUDY_QUOTES[new Date().getDay() % STUDY_QUOTES.length];

  // Embedded Dashboard Pomodoro Mini-Timer
  const [pomoMode, setPomoMode] = useState('focus'); // focus, shortBreak, longBreak
  const [pomoTimeLeft, setPomoTimeLeft] = useState(profile.pomodoroSettings.focusDuration * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');

  useEffect(() => {
    let interval = null;
    if (pomoIsRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft((t) => t - 1);
      }, 1000);
    } else if (pomoTimeLeft === 0 && pomoIsRunning) {
      setPomoIsRunning(false);
      if (pomoMode === 'focus') {
        logFocusMinutes(profile.pomodoroSettings.focusDuration, selectedCourseId);
        setPomoMode('shortBreak');
        setPomoTimeLeft(profile.pomodoroSettings.shortBreakDuration * 60);
      } else {
        setPomoMode('focus');
        setPomoTimeLeft(profile.pomodoroSettings.focusDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomoIsRunning, pomoTimeLeft, pomoMode, profile.pomodoroSettings, selectedCourseId]);

  const handlePomoToggle = () => {
    sounds.playClick();
    setPomoIsRunning(!pomoIsRunning);
  };

  const handlePomoReset = () => {
    sounds.playClick();
    setPomoIsRunning(false);
    if (pomoMode === 'focus') {
      setPomoTimeLeft(profile.pomodoroSettings.focusDuration * 60);
    } else if (pomoMode === 'shortBreak') {
      setPomoTimeLeft(profile.pomodoroSettings.shortBreakDuration * 60);
    } else {
      setPomoTimeLeft(profile.pomodoroSettings.longBreakDuration * 60);
    }
  };

  const formatPomoTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Metrics Calculations
  const todayDateStr = getTodayDateString(0);
  const todaySessions = studySessions.filter((s) => s.date === todayDateStr);
  const completedSessionsToday = todaySessions.filter((s) => s.completed).length;

  const todayTasks = tasks.filter((t) => t.dueDate === todayDateStr);
  const completedTasksToday = tasks.filter((t) => t.completed && t.dueDate === todayDateStr).length;

  const todayStudyHours = weeklyStats[weeklyStats.length - 1]?.hours || 2.75;
  const studyGoalPercentage = Math.min(100, Math.round((todayStudyHours / profile.dailyStudyGoalHours) * 100));

  const upcomingAssignments = assignments
    .filter((a) => a.status !== 'Submitted' && a.status !== 'Graded')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const priorityTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => (a.priority === 'High' ? -1 : 1))
    .slice(0, 4);

  // Average Grade across courses
  const avgGrade = Math.round(courses.reduce((acc, c) => acc + (c.currentGrade || 90), 0) / courses.length);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* SaaS Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-indigo-200 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-brand-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{profile.term} • {profile.university}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}! 👋
            </h2>
            <p className="mt-2 text-sm sm:text-base text-brand-100/90 leading-relaxed italic">
              "{dailyQuote.quote}"
              <span className="block not-italic text-xs text-brand-200/80 mt-1 font-medium">
                — {dailyQuote.author}
              </span>
            </p>
          </div>

          {/* Banner Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('planner')}
              className="py-2.5 px-4 bg-white hover:bg-slate-50 text-brand-700 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Open Pomodoro
            </button>
            <button
              onClick={() => setQuickAddModal({ isOpen: true, defaultType: 'task' })}
              className="py-2.5 px-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Time Today */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Study Time
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {todayStudyHours}h
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {profile.dailyStudyGoalHours}h Goal
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-700"
              style={{ width: `${studyGoalPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{studyGoalPercentage}% achieved</span>
            <span className="text-brand-600 dark:text-brand-400 font-semibold">
              {(profile.dailyStudyGoalHours - todayStudyHours > 0 ? (profile.dailyStudyGoalHours - todayStudyHours).toFixed(1) + 'h remaining' : 'Goal met! 🎉')}
            </span>
          </div>
        </div>

        {/* Card 2: Tasks Completion */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {priorityTasks.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              pending
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{completedTasksToday} completed today</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-400">
            {tasks.length} total tasks tracked
          </div>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assignments Due
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {upcomingAssignments.length}
            </span>
            <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
              upcoming
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Next due in:</span>
            <span className="font-bold text-rose-500">
              {upcomingAssignments[0]
                ? `${Math.max(1, Math.round((new Date(upcomingAssignments[0].dueDate) - new Date()) / (1000 * 60 * 60)))}h`
                : 'None'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            {upcomingAssignments[0]?.title || 'All caught up!'}
          </div>
        </div>

        {/* Card 4: Focus Streak & Academic Standing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Academic Standing
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {avgGrade}%
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Avg. Grade (3.9 GPA)
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold">{profile.currentStreakDays}-day streak</span>
            <span className="text-slate-400">• Keep it up!</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {courses.length} active courses enrolled
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Schedule + Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Study Schedule Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Today's Study Schedule
                  </h3>
                  <p className="text-xs text-slate-500">
                    {completedSessionsToday} of {todaySessions.length} time blocks completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickAddModal({ isOpen: true, defaultType: 'session' })}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Block Time</span>
                </button>
                <button
                  onClick={() => setActiveView('planner')}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center"
                >
                  Planner
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {todaySessions.length > 0 ? (
                todaySessions.map((session) => {
                  const course = getCourseById(session.courseId);
                  return (
                    <div
                      key={session.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        session.completed
                          ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/70 opacity-75'
                          : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 hover:border-brand-500/50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSessionComplete(session.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            session.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500'
                          }`}
                        >
                          {session.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: course?.color ? `${course.color}20` : '#6366f120',
                                color: course?.color || '#6366f1'
                              }}
                            >
                              {course?.code || 'General'}
                            </span>
                            <h4
                              className={`text-sm font-semibold text-slate-800 dark:text-slate-100 ${
                                session.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                              }`}
                            >
                              {session.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="font-mono text-slate-600 dark:text-slate-400">
                              {session.startTime} - {session.endTime}
                            </span>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-medium">
                              {session.technique}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                          {session.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No study sessions scheduled for today yet.
                </div>
              )}
            </div>
          </div>

          {/* Priority Tasks List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Priority Focus Tasks
                  </h3>
                  <p className="text-xs text-slate-500">
                    Highest priority deliverables to finish today
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('tasks')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center"
              >
                All Tasks ({tasks.length})
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {priorityTasks.map((task) => {
                const course = getCourseById(task.courseId);
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => toggleTask(task.id, e)}
                        className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500 flex items-center justify-center transition-colors"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: course?.color ? `${course.color}20` : '#6366f120',
                              color: course?.color || '#6366f1'
                            }}
                          >
                            {course?.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'High'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Due {task.dueDate} at {task.dueTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      ~{task.estimatedMinutes}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Quick Pomodoro Widget & Urgent Deadlines */}
        <div className="space-y-6">
          {/* Quick SaaS Pomodoro Widget */}
          <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Quick Pomodoro</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 font-semibold">
                {pomoMode === 'focus' ? 'Deep Work' : 'Break Time'}
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => {
                  setPomoMode('focus');
                  setPomoIsRunning(false);
                  setPomoTimeLeft(profile.pomodoroSettings.focusDuration * 60);
                }}
                className={`py-1 text-xs font-bold rounded-lg transition-all ${
                  pomoMode === 'focus'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => {
                  setPomoMode('shortBreak');
                  setPomoIsRunning(false);
                  setPomoTimeLeft(profile.pomodoroSettings.shortBreakDuration * 60);
                }}
                className={`py-1 text-xs font-bold rounded-lg transition-all ${
                  pomoMode === 'shortBreak'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Short
              </button>
              <button
                onClick={() => {
                  setPomoMode('longBreak');
                  setPomoIsRunning(false);
                  setPomoTimeLeft(profile.pomodoroSettings.longBreakDuration * 60);
                }}
                className={`py-1 text-xs font-bold rounded-lg transition-all ${
                  pomoMode === 'longBreak'
                    ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Long
              </button>
            </div>

            {/* Big Timer Digits */}
            <div className="my-5 text-center">
              <div className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formatPomoTime(pomoTimeLeft)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {pomoIsRunning ? 'Session active • Stay locked in!' : 'Paused • Ready when you are'}
              </p>
            </div>

            {/* Course Tagging selector for timer */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tag study session to:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePomoToggle}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  pomoIsRunning
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25'
                }`}
              >
                {pomoIsRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{pomoIsRunning ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={handlePomoReset}
                title="Reset timer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Urgent Deadlines Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => setActiveView('assignments')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View Tracker
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {upcomingAssignments.map((assignment) => {
                const course = getCourseById(assignment.courseId);
                const due = new Date(assignment.dueDate);
                const diffHours = Math.round((due - new Date()) / (1000 * 60 * 60));
                const isUrgent = diffHours < 48;

                return (
                  <div
                    key={assignment.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: course?.color ? `${course.color}20` : '#6366f120',
                          color: course?.color || '#6366f1'
                        }}
                      >
                        {course?.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isUrgent
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {diffHours > 24 ? `${Math.ceil(diffHours / 24)} days left` : `${diffHours}h left`}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-2 line-clamp-1">
                      {assignment.title}
                    </h4>

                    {/* Progress bar */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progress</span>
                        <span className="font-mono">{assignment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-600 h-1.5 rounded-full"
                          style={{ width: `${assignment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
