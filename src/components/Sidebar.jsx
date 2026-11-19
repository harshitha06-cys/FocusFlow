import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  GraduationCap,
  BarChart3,
  Settings,
  Flame,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Plus,
  BookOpen,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const {
    activeView,
    setActiveView,
    tasks,
    assignments,
    courses,
    profile,
    toggleTheme,
    toggleSound,
    setQuickAddModal
  } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const upcomingAssignmentsCount = assignments.filter((a) => a.status !== 'Submitted' && a.status !== 'Graded').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'planner', label: 'Study Planner', icon: CalendarDays },
    { id: 'assignments', label: 'Assignments', icon: GraduationCap, badge: upcomingAssignmentsCount },
    { id: 'analytics', label: 'Progress & Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-glow">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                FocusFlow
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  PRO
                </span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student Workspace</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Action Button */}
        <div className="p-4 pb-2">
          <button
            onClick={() => setQuickAddModal({ isOpen: true, defaultType: 'task' })}
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-sm shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Create</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white dark:bg-brand-500'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Current Courses section */}
          <div className="pt-5 px-3 pb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Enrolled Courses ({courses.length})
            </span>
            <button
              onClick={() => setActiveView('settings')}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="space-y-1">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleNavClick('assignments')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="truncate">{course.code}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                  {course.currentGrade}%
                </span>
              </button>
            ))}
          </div>

          {/* Focus Streak Widget */}
          <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 dark:border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {profile.currentStreakDays}-Day Focus Streak!
                  </h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Personal Best: {profile.longestStreakDays} days
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-2.5 w-full bg-amber-200/40 dark:bg-amber-950 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (profile.currentStreakDays / 7) * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 text-right">
              1 day until 7-day milestone
            </p>
          </div>
        </div>

        {/* Sidebar Footer: Profile & Quick toggles */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/20"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {profile.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {profile.major}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                title={profile.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                title={profile.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {profile.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
