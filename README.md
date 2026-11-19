# FocusFlow 🎓⚡

**FocusFlow** is a modern, responsive student productivity SaaS application built with **React**, **Vite**, and **Tailwind CSS**. It is tailored specifically for students managing university courses, academic deadlines, high-focus study sessions, and daily task backlogs.

---

## ✨ Features Overview

### 1. 📊 Executive Dashboard
- **SaaS Metric Cards**: Today's study time progress vs. daily goal, active tasks count, upcoming high-stakes deadlines, and overall academic standing (GPA / average grade).
- **Embedded Pomodoro Mini-Widget**: Start, pause, or switch between Deep Focus (25m), Short Break (5m), and Long Break directly from the dashboard.
- **Today's Study Schedule Timeline**: Real-time view of scheduled time blocks with course tags, techniques, and one-click completion.
- **Priority Tasks List**: Immediate focus on high-priority deliverables.
- **Motivational Wisdom**: Rotating daily focus insights and academic quotes.

### 2. 📝 Task Manager
- **Full CRUD Support**: Add, edit, complete, and delete tasks.
- **Actionable Subtask Checklists**: Break complex coding labs, essays, and problem sets into step-by-step checklists with progress indicators.
- **Smart Filtering & Sorting**: Filter by status (All, Pending, Completed, Due Today, High Priority) and by course. Sort by due date, priority, estimated duration, or title.
- **In-line Quick Add & Batch Actions**: Rapid task entry and "Mark All Done" batch capability.
- **Audio & Haptic Feedback**: Uplifting sound synthesis (via Web Audio API) and celebration confetti upon completion.

### 3. 📅 Daily Study Planner
- **Timeblocking Calendar**: Visual time blocks scheduled across your day (8:00 AM – 10:00 PM).
- **Full Pomodoro Engine**:
  - Interactive radial countdown visualizer.
  - Interval presets with customizable duration slider (10 to 60 minutes).
  - Multi-round tracking with automatic break transitions.
  - Direct logging of focused minutes into course-specific analytics.
- **Study Techniques**: Tag sessions as *Deep Work*, *Pomodoro*, *Active Recall*, or *Review & Write*.

### 4. 🎓 Assignment Tracker with Deadlines
- **Course & Weighting**: Track course codes (CS 301, MATH 240, ENG 205, etc.), grade weighting (e.g. 15% of total grade), and submission formats (Canvas, Gradescope, GitHub).
- **Dynamic Countdown Badges**: Color-coded urgency indicators (*Overdue!*, *Due in X hours*, *Due Tomorrow*, *Submitted*, *Graded*).
- **Dual Display Modes**:
  - **Kanban Board**: Drag/move workflow through *Not Started*, *In Progress*, *Submitted*, and *Graded*.
  - **Detailed Table View**: Compact overview for quick status updates and grade monitoring.
- **Deliverable Checklists**: Multi-step submission milestones with auto-calculated completion percentage.

### 5. 📈 Study Analytics & Insights
- **Weekly Study Volume Bar Chart**: Visual breakdown of hours studied from Monday to Sunday compared against your daily target line.
- **Course Distribution Split**: Workload allocation bars revealing time invested across enrolled subjects.
- **Focus Streak Tracking**: Consecutive study days tracker with personal best milestones.
- **Productivity Index**: Composite score computed from task velocity, assignment completion, and study consistency.

### 6. ⚙️ Workspace Settings & Local Persistence
- **Offline & Local Storage**: All tasks, assignments, courses, and timer logs persist in browser `localStorage`.
- **Pre-populated Sample Data**: Comes loaded with authentic student courses, assignments, and time blocks.
- **Data Portability**: Export complete workspace state to JSON and restore from backup at any time.
- **Dark Mode & Light Mode**: Smooth theme transitions with tailored color palettes.
- **Sound Effects Toggle**: Web Audio API synthesized feedback that requires zero external audio files.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm**

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd "C:\Users\Harshitha A\.gemini\antigravity\scratch\focusflow"
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🛠 Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS & CSS Glassmorphism
- **Icons**: Lucide React
- **Confetti**: Canvas-Confetti
- **Audio**: Native HTML5 Web Audio API Synthesizer
