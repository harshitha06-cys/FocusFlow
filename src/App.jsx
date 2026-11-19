import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import QuickAddModal from './components/QuickAddModal';
import DashboardView from './views/DashboardView';
import TasksView from './views/TasksView';
import PlannerView from './views/PlannerView';
import AssignmentsView from './views/AssignmentsView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

export default function App() {
  const { activeView } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'tasks' && <TasksView />}
          {activeView === 'planner' && <PlannerView />}
          {activeView === 'assignments' && <AssignmentsView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Unified Quick Creation Modal */}
      <QuickAddModal />
    </div>
  );
}
