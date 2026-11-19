import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Tag,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle,
  XCircle,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../data/sampleData';
import { sounds } from '../utils/audio';

export default function TasksView() {
  const {
    tasks,
    courses,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    batchCompleteTasks,
    searchQuery,
    setSearchQuery,
    getCourseById,
    setQuickAddModal
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'completed', 'today', 'high'
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'time', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Quick inline add state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCourseId, setQuickCourseId] = useState(courses[0]?.id || '');
  const [quickPriority, setQuickPriority] = useState('Medium');

  // Expanded task ID for viewing/editing subtasks
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Editing task modal/state
  const [editingTask, setEditingTask] = useState(null);

  const todayStr = getTodayDateString(0);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Global/Local Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCourse = getCourseById(task.courseId)?.name.toLowerCase().includes(q);
      const matchTags = task.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCourse && !matchTags) return false;
    }

    // Status filter
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'today' && task.dueDate !== todayStr) return false;
    if (filterStatus === 'high' && task.priority !== 'High') return false;

    // Course filter
    if (selectedCourse !== 'all' && task.courseId !== selectedCourse) return false;

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let result = 0;
    if (sortBy === 'dueDate') {
      result = (a.dueDate || '').localeCompare(b.dueDate || '');
    } else if (sortBy === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      result = (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    } else if (sortBy === 'time') {
      result = (a.estimatedMinutes || 0) - (b.estimatedMinutes || 0);
    } else if (sortBy === 'title') {
      result = a.title.localeCompare(b.title);
    }
    return sortOrder === 'asc' ? result : -result;
  });

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      courseId: quickCourseId,
      dueDate: todayStr,
      dueTime: '20:00',
      priority: quickPriority,
      estimatedMinutes: 45,
      tags: ['Study'],
      subtasks: []
    });

    setQuickTitle('');
  };

  const handleAddSubtask = (taskId) => {
    if (!newSubtaskInput.trim()) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSubtask = {
      id: 'st_' + Date.now(),
      text: newSubtaskInput.trim(),
      done: false
    };

    updateTask(taskId, {
      subtasks: [...(task.subtasks || []), newSubtask]
    });

    setNewSubtaskInput('');
    sounds.playClick();
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, done: !st.done } : st
    );

    updateTask(taskId, { subtasks: updatedSubtasks });
    sounds.playClick();
  };

  const handleDeleteSubtask = (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
    updateTask(taskId, { subtasks: updatedSubtasks });
    sounds.playClick();
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Controls & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Task Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize study objectives, coding labs, and exam drills with subtask checklists
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={() => batchCompleteTasks(sortedTasks.filter((t) => !t.completed).map((t) => t.id))}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              Mark View Done
            </button>
          )}
          <button
            onClick={() => setQuickAddModal({ isOpen: true, defaultType: 'task' })}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Full Task Form</span>
          </button>
        </div>
      </div>

      {/* Quick In-line Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row items-center gap-2.5"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="+ Add a quick task and press Enter (e.g. 'Solve LeetCode Tree traversal 102')..."
            className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={quickCourseId}
            onChange={(e) => setQuickCourseId(e.target.value)}
            className="flex-1 md:w-36 px-2.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>

          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value)}
            className="flex-1 md:w-28 px-2.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm whitespace-nowrap active:scale-95 transition-all"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All (${tasks.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'today', label: 'Due Today' },
            { id: 'high', label: 'High Priority' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right side filters: Course selector & Sorting */}
        <div className="flex items-center gap-2">
          {/* Course filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="time">Sort by Duration</option>
            <option value="title">Sort by Title</option>
          </select>

          {/* Sort direction toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
            className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => {
            const course = getCourseById(task.courseId);
            const isExpanded = expandedTaskId === task.id;
            const subtasksCount = task.subtasks?.length || 0;
            const completedSubtasksCount = task.subtasks?.filter((st) => st.done).length || 0;

            return (
              <div
                key={task.id}
                className={`rounded-2xl border transition-all ${
                  task.completed
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-70'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500/40 shadow-sm'
                }`}
              >
                {/* Main Task Row */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => toggleTask(task.id, e)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        task.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500'
                      }`}
                      aria-label="Toggle task completion"
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Course badge */}
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: course?.color ? `${course.color}20` : '#6366f120',
                            color: course?.color || '#6366f1'
                          }}
                        >
                          {course?.code || 'Course'}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : task.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Title */}
                        <h3
                          className={`text-sm sm:text-base font-semibold text-slate-900 dark:text-white ${
                            task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </h3>
                      </div>

                      {/* Meta information row */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due {task.dueDate}</span>
                          {task.dueTime && <span>• {task.dueTime}</span>}
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{task.estimatedMinutes} mins</span>
                        </div>

                        {subtasksCount > 0 && (
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>
                              {completedSubtasksCount}/{subtasksCount} subtasks
                            </span>
                          </button>
                        )}

                        {task.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {task.notes && (
                        <p className="mt-1 text-xs text-slate-500 italic">
                          Note: {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Checklist</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Subtasks Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-850/50 rounded-b-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>Actionable Subtasks Checklist</span>
                      <span className="font-mono text-slate-400">
                        {completedSubtasksCount} of {subtasksCount} done
                      </span>
                    </div>

                    {/* Subtask list */}
                    <div className="space-y-1.5">
                      {task.subtasks?.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={st.done}
                              onChange={() => handleToggleSubtask(task.id, st.id)}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                            />
                            <span
                              className={
                                st.done
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-700 dark:text-slate-200'
                              }
                            >
                              {st.text}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteSubtask(task.id, st.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add subtask input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newSubtaskInput}
                        onChange={(e) => setNewSubtaskInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtask(task.id);
                          }
                        }}
                        placeholder="Add subtask step..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubtask(task.id)}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-brand-600 hover:text-white transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
            <CheckSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No tasks found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no tasks matching your selected filters. Create one above to stay on top of your coursework!
            </p>
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Edit Task</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Course
                  </label>
                  <select
                    value={editingTask.courseId}
                    onChange={(e) => setEditingTask({ ...editingTask, courseId: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    value={editingTask.estimatedMinutes}
                    onChange={(e) => setEditingTask({ ...editingTask, estimatedMinutes: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateTask(editingTask.id, editingTask);
                  setEditingTask(null);
                  sounds.playClick();
                }}
                className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
