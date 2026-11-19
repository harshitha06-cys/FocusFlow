import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Kanban,
  List,
  Check,
  ChevronDown,
  ChevronUp,
  Percent
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDateOffset } from '../data/sampleData';
import { sounds } from '../utils/audio';

export default function AssignmentsView() {
  const {
    assignments,
    courses,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getCourseById,
    setQuickAddModal
  } = useApp();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Status Columns for Kanban
  const statusColumns = [
    { id: 'Not Started', label: 'Not Started', color: 'border-slate-300 dark:border-slate-700' },
    { id: 'In Progress', label: 'In Progress', color: 'border-amber-400 dark:border-amber-500' },
    { id: 'Submitted', label: 'Submitted', color: 'border-blue-400 dark:border-blue-500' },
    { id: 'Graded', label: 'Graded', color: 'border-emerald-400 dark:border-emerald-500' },
  ];

  // Helper for deadline countdown and badge
  const getDeadlineBadge = (dueDateStr, status) => {
    if (status === 'Graded') {
      return { text: 'Graded', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    }
    if (status === 'Submitted') {
      return { text: 'Submitted', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }

    const due = new Date(dueDateStr);
    const now = new Date();
    const diffMs = due - now;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return { text: 'Overdue!', bg: 'bg-rose-600 text-white animate-pulse' };
    }
    if (diffHours <= 24) {
      return { text: `Due in ${diffHours}h`, bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    }
    return { text: `Due in ${diffDays} days`, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' };
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((a) => {
    if (filterCourse !== 'all' && a.courseId !== filterCourse) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  // Toggle checklist item
  const handleToggleChecklist = (assignmentId, checklistItemId) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;

    const updatedChecklist = target.checklist.map((item) =>
      item.id === checklistItemId ? { ...item, done: !item.done } : item
    );

    // Auto-update progress based on checklist
    const completedCount = updatedChecklist.filter((i) => i.done).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);

    updateAssignment(assignmentId, {
      checklist: updatedChecklist,
      progress
    });
    sounds.playClick();
  };

  // Change assignment status
  const handleStatusChange = (assignmentId, newStatus) => {
    updateAssignment(assignmentId, {
      status: newStatus,
      progress: newStatus === 'Submitted' || newStatus === 'Graded' ? 100 : undefined
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Assignment Tracker & Deadlines
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track high-stake coursework, grade weights, submission portals, and deliverables
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setQuickAddModal({ isOpen: true, defaultType: 'assignment' })}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Track Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Filter by:
          </span>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
            <option value="Graded">Graded</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing {filteredAssignments.length} assignments
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {statusColumns.map((col) => {
            const colAssignments = filteredAssignments.filter((a) => a.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full border-2 ${col.color} bg-current`}
                    />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {colAssignments.length}
                  </span>
                </div>

                {/* Cards in this column */}
                <div className="space-y-3">
                  {colAssignments.length > 0 ? (
                    colAssignments.map((assignment) => {
                      const course = getCourseById(assignment.courseId);
                      const badge = getDeadlineBadge(assignment.dueDate, assignment.status);
                      const isExpanded = expandedAssignmentId === assignment.id;

                      return (
                        <div
                          key={assignment.id}
                          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all space-y-2.5"
                        >
                          {/* Course badge & deadline countdown */}
                          <div className="flex items-center justify-between gap-2">
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
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                            >
                              {badge.text}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {assignment.title}
                          </h4>

                          {/* Weight & submission format */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                              <Percent className="w-3 h-3" />
                              {assignment.weightPercentage}% of Grade
                            </span>
                            <span className="truncate max-w-[120px]">
                              {assignment.submissionType}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                              <span>Progress</span>
                              <span className="font-mono">{assignment.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-brand-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${assignment.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Move status buttons & expandable checklist */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1">
                            <select
                              value={assignment.status}
                              onChange={(e) => handleStatusChange(assignment.id, e.target.value)}
                              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Submitted">Submitted</option>
                              <option value="Graded">Graded</option>
                            </select>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  setExpandedAssignmentId(isExpanded ? null : assignment.id)
                                }
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                title="Checklist"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => setEditingAssignment(assignment)}
                                className="p-1 rounded text-slate-400 hover:text-brand-600"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteAssignment(assignment.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-500"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Checklist */}
                          {isExpanded && (
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 space-y-1.5 animate-fade-in">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Checklist
                              </span>
                              {assignment.checklist?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.done}
                                    onChange={() => handleToggleChecklist(assignment.id, item.id)}
                                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                                  />
                                  <span className={item.done ? 'line-through text-slate-400 text-[11px]' : 'text-[11px]'}>
                                    {item.item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE / LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-[11px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Assignment & Course</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssignments.map((assignment) => {
                const course = getCourseById(assignment.courseId);
                const badge = getDeadlineBadge(assignment.dueDate, assignment.status);
                const due = new Date(assignment.dueDate);

                return (
                  <tr
                    key={assignment.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: course?.color ? `${course.color}20` : '#6366f120',
                            color: course?.color || '#6366f1'
                          }}
                        >
                          {course?.code}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {assignment.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {assignment.description || assignment.submissionType}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.bg}`}>
                        {badge.text}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-brand-600 dark:text-brand-400">
                      {assignment.weightPercentage}%
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={assignment.status}
                        onChange={(e) => handleStatusChange(assignment.id, e.target.value)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Graded">Graded</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-brand-600 h-1.5 rounded-full"
                            style={{ width: `${assignment.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{assignment.progress}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingAssignment(assignment)}
                          className="p-1 rounded text-slate-400 hover:text-brand-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAssignment(assignment.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Edit Assignment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingAssignment.title}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Course
                  </label>
                  <select
                    value={editingAssignment.courseId}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, courseId: e.target.value })}
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
                    Grade Weight (%)
                  </label>
                  <input
                    type="number"
                    value={editingAssignment.weightPercentage}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, weightPercentage: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Submission Portal
                </label>
                <input
                  type="text"
                  value={editingAssignment.submissionType}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, submissionType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingAssignment(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateAssignment(editingAssignment.id, editingAssignment);
                  setEditingAssignment(null);
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
