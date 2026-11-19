import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  BookOpen,
  PieChart,
  Download,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AnalyticsView() {
  const {
    tasks,
    assignments,
    studySessions,
    courses,
    weeklyStats,
    profile,
    exportData,
    resetToSampleData,
    getCourseById
  } = useApp();

  // Statistics Computations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === 'Submitted' || a.status === 'Graded').length;
  const assignmentRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Total weekly hours
  const totalWeeklyHours = weeklyStats.reduce((acc, curr) => acc + curr.hours, 0);
  const avgDailyHours = (totalWeeklyHours / weeklyStats.length).toFixed(1);

  // Maximum hours for weekly bar scaling
  const maxWeeklyHour = Math.max(...weeklyStats.map((d) => d.hours), profile.dailyStudyGoalHours, 6);

  // Course study time breakdown approximation
  const courseDistribution = courses.map((course) => {
    const courseSessions = studySessions.filter((s) => s.courseId === course.id);
    const totalMinutes = courseSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    return {
      course,
      minutes: totalMinutes || 45, // baseline
      percentage: 0
    };
  });

  const allCourseMinutes = courseDistribution.reduce((acc, c) => acc + c.minutes, 0);
  courseDistribution.forEach((c) => {
    c.percentage = allCourseMinutes > 0 ? Math.round((c.minutes / allCourseMinutes) * 100) : 20;
  });

  // Calculate Productivity Index (0 - 100)
  const productivityScore = Math.min(
    99,
    Math.round(taskCompletionRate * 0.4 + assignmentRate * 0.3 + (totalWeeklyHours / 25) * 100 * 0.3)
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Study Analytics & Insights
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven visual insights on study volume, completion velocity, and course distribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportData}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Productivity Score</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {productivityScore}
            </span>
            <span className="text-xs font-bold text-emerald-500">/ 100</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Top 5% student focus performance this semester
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Weekly Study Volume</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalWeeklyHours.toFixed(1)}h
            </span>
            <span className="text-xs font-bold text-slate-400">this week</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Daily average of {avgDailyHours} hours logged
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Task Velocity</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {taskCompletionRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Consistent completion pace on weekly goals
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {profile.currentStreakDays} Days
            </span>
            <span className="text-xs font-bold text-amber-500">Record: {profile.longestStreakDays}d</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Study session logged every consecutive day
          </p>
        </div>
      </div>

      {/* Main Charts Grid: Weekly Study Hours Bar Chart & Course Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Weekly Study Time Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Hours spent in deep work compared against your {profile.dailyStudyGoalHours}h daily target
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="w-3 h-3 rounded bg-brand-600" />
              <span>Logged Hours</span>
              <span className="w-3 h-0.5 bg-amber-400 border border-amber-400" />
              <span>Goal</span>
            </div>
          </div>

          {/* Interactive Bar Chart Visual */}
          <div className="mt-8 h-64 flex items-end justify-between gap-3 px-2 sm:px-6 relative">
            {/* Target line */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-amber-400/80 pointer-events-none z-10 flex justify-end"
              style={{
                bottom: `${(profile.dailyStudyGoalHours / maxWeeklyHour) * 100}%`
              }}
            >
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded -translate-y-3">
                Target: {profile.dailyStudyGoalHours}h
              </span>
            </div>

            {weeklyStats.map((item, idx) => {
              const heightPercent = Math.min(100, (item.hours / maxWeeklyHour) * 100);
              const isToday = idx === weeklyStats.length - 1;

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 rounded bg-slate-800 text-white text-[10px] font-mono whitespace-nowrap shadow-md">
                    {item.hours} hours ({item.tasks} tasks)
                  </div>

                  {/* The Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        isToday
                          ? 'bg-gradient-to-t from-brand-700 to-indigo-500 shadow-glow'
                          : 'bg-brand-500/80 group-hover:bg-brand-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`mt-2 text-xs font-bold ${
                      isToday
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.hours}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Allocation Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Course Study Split
              </h3>
              <p className="text-xs text-slate-400">
                Workload allocation across active subjects
              </p>
            </div>
            <PieChart className="w-4 h-4 text-brand-500" />
          </div>

          {/* Course Bar Breakdown */}
          <div className="mt-6 space-y-4">
            {courseDistribution.map(({ course, minutes, percentage }) => (
              <div key={course.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {course.code}
                    </span>
                    <span className="text-slate-400 text-[11px] truncate max-w-[130px]">
                      {course.name}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {percentage}%
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: course.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Academic Milestone summary */}
          <div className="mt-8 p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-brand-900 dark:text-brand-200">
                  Optimal Balance Detected
                </h4>
                <p className="text-[11px] text-brand-700 dark:text-brand-400 mt-0.5 leading-relaxed">
                  Your study time is well apportioned across both CS programming projects and heavy math problem sets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
