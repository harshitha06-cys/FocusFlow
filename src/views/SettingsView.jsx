import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  BookOpen,
  Database,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Save,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/audio';

export default function SettingsView() {
  const {
    profile,
    updateProfile,
    toggleTheme,
    toggleSound,
    courses,
    addCourse,
    deleteCourse,
    exportData,
    importData,
    resetToSampleData
  } = useApp();

  // Local form for profile
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    university: profile.university,
    major: profile.major,
    term: profile.term,
    dailyStudyGoalHours: profile.dailyStudyGoalHours,
    focusDuration: profile.pomodoroSettings.focusDuration,
    shortBreakDuration: profile.pomodoroSettings.shortBreakDuration,
    longBreakDuration: profile.pomodoroSettings.longBreakDuration
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // New course form
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseColor, setNewCourseColor] = useState('#6366f1');

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      university: profileForm.university,
      major: profileForm.major,
      term: profileForm.term,
      dailyStudyGoalHours: Number(profileForm.dailyStudyGoalHours),
      pomodoroSettings: {
        ...profile.pomodoroSettings,
        focusDuration: Number(profileForm.focusDuration),
        shortBreakDuration: Number(profileForm.shortBreakDuration),
        longBreakDuration: Number(profileForm.longBreakDuration)
      }
    });

    sounds.playTaskComplete();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseName.trim()) return;

    addCourse({
      code: newCourseCode.trim().toUpperCase(),
      name: newCourseName.trim(),
      color: newCourseColor,
      currentGrade: 90
    });

    setNewCourseCode('');
    setNewCourseName('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const ok = importData(parsed);
        if (ok) {
          alert('FocusFlow backup restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Workspace & Study Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Customize student profile, study intervals, enrolled subjects, and local data backups
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            Saved!
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleProfileSave} className="space-y-6">
        {/* Card 1: Student Profile */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Student Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                University / College
              </label>
              <input
                type="text"
                value={profileForm.university}
                onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Academic Major
              </label>
              <input
                type="text"
                value={profileForm.major}
                onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Current Term / Semester
              </label>
              <input
                type="text"
                value={profileForm.term}
                onChange={(e) => setProfileForm({ ...profileForm, term: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Study Goals & Pomodoro Durations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Goals & Pomodoro Durations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Daily Study Goal (Hours): {profileForm.dailyStudyGoalHours}h
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={profileForm.dailyStudyGoalHours}
                onChange={(e) => setProfileForm({ ...profileForm, dailyStudyGoalHours: e.target.value })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Pomodoro Focus Interval (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                step="5"
                value={profileForm.focusDuration}
                onChange={(e) => setProfileForm({ ...profileForm, focusDuration: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Short Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={profileForm.shortBreakDuration}
                onChange={(e) => setProfileForm({ ...profileForm, shortBreakDuration: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Long Break (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="45"
                value={profileForm.longBreakDuration}
                onChange={(e) => setProfileForm({ ...profileForm, longBreakDuration: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </form>

      {/* Card 3: Enrolled Course Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Course Management ({courses.length})
            </h3>
          </div>
        </div>

        {/* Existing courses list */}
        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {course.code}
                  </span>
                  <span className="text-slate-400 text-xs ml-2">
                    {course.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteCourse(course.id)}
                disabled={courses.length <= 1}
                title="Remove course"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 disabled:opacity-40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new course input */}
        <form onSubmit={handleAddCourse} className="pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            required
            placeholder="Code (e.g. STAT 200)"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            className="sm:w-36 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
          <input
            type="text"
            required
            placeholder="Course Name (e.g. Applied Statistics)"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
          <input
            type="color"
            value={newCourseColor}
            onChange={(e) => setNewCourseColor(e.target.value)}
            className="w-10 h-9 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </form>
      </div>

      {/* Card 4: Local Persistence & Backup Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Data Storage & Sample Data
          </h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          FocusFlow automatically synchronizes all tasks, study sessions, courses, and timer records in your browser's secure <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">localStorage</code>. Your data persists across page refreshes and browser restarts.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export button */}
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>

          {/* Import button */}
          <label className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset to sample data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all tasks, assignments, and sessions to realistic sample student data?')) {
                resetToSampleData();
              }
            }}
            className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
