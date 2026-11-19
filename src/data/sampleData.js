// Helper to generate dynamic dates relative to current date
export const getDateOffset = (days, hour = 18, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const getTodayDateString = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_COURSES = [
  {
    id: 'c1',
    code: 'CS 301',
    name: 'Data Structures & Algorithms',
    color: '#6366f1', // Indigo
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    instructor: 'Prof. Miller',
    credits: 4,
    currentGrade: 94
  },
  {
    id: 'c2',
    code: 'MATH 240',
    name: 'Linear Algebra & Probabilities',
    color: '#3b82f6', // Blue
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    instructor: 'Dr. Chen',
    credits: 3,
    currentGrade: 88
  },
  {
    id: 'c3',
    code: 'ENG 205',
    name: 'Technical Writing & Comm',
    color: '#10b981', // Emerald
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    instructor: 'Dr. Al-Mansoor',
    credits: 3,
    currentGrade: 92
  },
  {
    id: 'c4',
    code: 'PHYS 150',
    name: 'Modern Physics & Quantum',
    color: '#8b5cf6', // Violet
    badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    instructor: 'Prof. Vance',
    credits: 4,
    currentGrade: 85
  },
  {
    id: 'c5',
    code: 'BIO 110',
    name: 'Cellular & Molecular Biology',
    color: '#f59e0b', // Amber
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    instructor: 'Dr. Gomez',
    credits: 3,
    currentGrade: 96
  }
];

export const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Implement AVL Tree rebalancing rotations in C++',
    courseId: 'c1',
    dueDate: getTodayDateString(0),
    dueTime: '21:00',
    priority: 'High',
    completed: false,
    estimatedMinutes: 90,
    tags: ['Coding', 'Project 3'],
    subtasks: [
      { id: 'st1', text: 'Left-Left and Right-Right single rotations', done: true },
      { id: 'st2', text: 'Left-Right and Right-Left double rotations', done: true },
      { id: 'st3', text: 'Edge case test suite validation', done: false }
    ],
    notes: 'Remember to verify height recalculations in O(1) after rotation.'
  },
  {
    id: 't2',
    title: 'Review Chapter 5: Eigenvalues & Diagonalization',
    courseId: 'c2',
    dueDate: getTodayDateString(0),
    dueTime: '17:30',
    priority: 'Medium',
    completed: false,
    estimatedMinutes: 60,
    tags: ['Reading', 'Midterm Prep'],
    subtasks: [
      { id: 'st4', text: 'Solve practice problems 5.1 - 5.8', done: true },
      { id: 'st5', text: 'Summary cheat sheet on characteristic polynomials', done: false }
    ],
    notes: 'Midterm covers chapters 3 through 6.'
  },
  {
    id: 't3',
    title: 'Draft Methodology section for Engineering Whitepaper',
    courseId: 'c3',
    dueDate: getTodayDateString(1),
    dueTime: '23:59',
    priority: 'High',
    completed: false,
    estimatedMinutes: 75,
    tags: ['Writing', 'Milestone 2'],
    subtasks: [
      { id: 'st6', text: 'Compile 4 academic citations', done: true },
      { id: 'st7', text: 'Write 800 words on system architecture', done: false }
    ],
    notes: 'Use IEEE citation formatting standard.'
  },
  {
    id: 't4',
    title: 'Physics Wave Mechanics problem set #4',
    courseId: 'c4',
    dueDate: getTodayDateString(2),
    dueTime: '18:00',
    priority: 'High',
    completed: false,
    estimatedMinutes: 110,
    tags: ['Problem Set', 'Lab Prep'],
    subtasks: [
      { id: 'st8', text: 'Questions 1-5 on particle in a box', done: false },
      { id: 'st9', text: 'Graph probability densities in Python or Desmos', done: false }
    ],
    notes: 'Office hours are Thursday 2pm if needed.'
  },
  {
    id: 't5',
    title: 'Active recall flashcards: Glycolysis & Krebs cycle',
    courseId: 'c5',
    dueDate: getTodayDateString(0),
    dueTime: '14:00',
    priority: 'Low',
    completed: true,
    estimatedMinutes: 30,
    tags: ['Anki', 'Review'],
    subtasks: [
      { id: 'st10', text: '65 cards reviewed on Anki', done: true }
    ],
    notes: '100% mastery achieved on enzyme regulators.'
  },
  {
    id: 't6',
    title: 'Review Peer Review comments for CS Design Doc',
    courseId: 'c1',
    dueDate: getTodayDateString(-1),
    dueTime: '16:00',
    priority: 'Medium',
    completed: true,
    estimatedMinutes: 45,
    tags: ['Review'],
    subtasks: [],
    notes: 'Addressed Alex and Sarah feedback.'
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'AVL & Red-Black Balanced Search Trees Implementation',
    courseId: 'c1',
    dueDate: getDateOffset(2, 23, 59),
    status: 'In Progress', // Not Started, In Progress, Submitted, Graded
    weightPercentage: 15,
    priority: 'High',
    submissionType: 'GitHub Repository + Autograder',
    description: 'Build complete self-balancing binary search trees with asymptotic analysis benchmark report.',
    progress: 70,
    checklist: [
      { id: 'c1', item: 'Core AVL tree rotation logic', done: true },
      { id: 'c2', item: 'Deletion & rebalance propagation', done: true },
      { id: 'c3', item: 'Benchmark against std::map', done: false },
      { id: 'c4', item: 'PDF writeup and complexity analysis', done: false }
    ],
    instructorNotes: 'Late submissions penalized 10% per 24 hours. Extra credit for Red-Black tree.'
  },
  {
    id: 'a2',
    title: 'Linear Systems & Orthogonal Projections Midterm',
    courseId: 'c2',
    dueDate: getDateOffset(4, 14, 0),
    status: 'In Progress',
    weightPercentage: 25,
    priority: 'High',
    submissionType: 'In-Person Exam (Hall B)',
    description: 'Comprehensive exam covering vector spaces, Gram-Schmidt process, least squares, and eigenvalues.',
    progress: 45,
    checklist: [
      { id: 'c5', item: 'Review past year midterm 2024', done: true },
      { id: 'c6', item: 'Master SVD geometric interpretation', done: false },
      { id: 'c7', item: 'Timed mock practice test', done: false }
    ],
    instructorNotes: 'One two-sided handwritten formula cheat sheet permitted.'
  },
  {
    id: 'a3',
    title: 'Technical Whitepaper: Scalable Distributed Systems',
    courseId: 'c3',
    dueDate: getDateOffset(7, 23, 59),
    status: 'Not Started',
    weightPercentage: 20,
    priority: 'Medium',
    submissionType: 'Canvas PDF Upload',
    description: 'Research report detailing consensus protocols (Raft vs Paxos) and trade-offs in cloud databases.',
    progress: 10,
    checklist: [
      { id: 'c8', item: 'Thesis proposal & outline approved', done: true },
      { id: 'c9', item: 'Draft literature review', done: false },
      { id: 'c10', item: 'Final editing and grammar check', done: false }
    ],
    instructorNotes: 'Minimum 2,500 words, IEEE format, minimum 8 peer-reviewed citations.'
  },
  {
    id: 'a4',
    title: 'Quantum Wave Mechanics Lab Report #4',
    courseId: 'c4',
    dueDate: getDateOffset(1, 17, 0),
    status: 'In Progress',
    weightPercentage: 10,
    priority: 'High',
    submissionType: 'Gradescope Submission',
    description: 'Analyze spectral emission data from hydrogen and mercury gas discharge lamps with error propagation.',
    progress: 85,
    checklist: [
      { id: 'c11', item: 'Extract wavelengths from diffraction grating', done: true },
      { id: 'c12', item: 'Calculate Rydberg constant with uncertainty', done: true },
      { id: 'c13', item: 'Write discussion on systematic spectrometer error', done: false }
    ],
    instructorNotes: 'Ensure all graphs contain labelled axes and error bars.'
  },
  {
    id: 'a5',
    title: 'Enzyme Kinetics & Metabolic Pathways Case Study',
    courseId: 'c5',
    dueDate: getDateOffset(-2, 12, 0),
    status: 'Graded',
    weightPercentage: 12,
    priority: 'Medium',
    submissionType: 'Online Portal',
    description: 'Analysis of competitive vs non-competitive inhibition in human lactase enzyme under varying pH.',
    progress: 100,
    grade: '96 / 100 (A)',
    checklist: [
      { id: 'c14', item: 'Lineweaver-Burk double reciprocal plot', done: true },
      { id: 'c15', item: 'Submit final report', done: true }
    ],
    instructorNotes: 'Excellent analysis of Michaelis-Menten constant Vmax values.'
  }
];

export const INITIAL_STUDY_SESSIONS = [
  {
    id: 's1',
    courseId: 'c1',
    title: 'Deep Work: AVL Balance Rotations',
    technique: 'Deep Work',
    startTime: '09:00',
    endTime: '10:30',
    durationMinutes: 90,
    completed: true,
    focusRating: 5,
    notes: 'Fixed left-right rotation bug. Smooth progress.',
    date: getTodayDateString(0)
  },
  {
    id: 's2',
    courseId: 'c2',
    title: 'Pomodoro Drill: Matrix Eigenvalue Computations',
    technique: 'Pomodoro',
    startTime: '11:00',
    endTime: '12:15',
    durationMinutes: 75,
    completed: true,
    focusRating: 4,
    notes: '3 Pomodoros completed. Need more drill on 3x3 determinants.',
    date: getTodayDateString(0)
  },
  {
    id: 's3',
    courseId: 'c4',
    title: 'Lab Report: Spectral Analysis & Uncertainty',
    technique: 'Deep Work',
    startTime: '14:30',
    endTime: '16:00',
    durationMinutes: 90,
    completed: false,
    focusRating: null,
    notes: 'Finish uncertainty calculations and Rydberg constant graph.',
    date: getTodayDateString(0)
  },
  {
    id: 's4',
    courseId: 'c3',
    title: 'Writing Session: Whitepaper Methodology Draft',
    technique: 'Review & Write',
    startTime: '17:00',
    endTime: '18:15',
    durationMinutes: 75,
    completed: false,
    focusRating: null,
    notes: 'Outline system architecture comparison table.',
    date: getTodayDateString(0)
  },
  {
    id: 's5',
    courseId: 'c5',
    title: 'Active Recall: Flashcard Sprint & Quiz Review',
    technique: 'Active Recall',
    startTime: '20:00',
    endTime: '20:45',
    durationMinutes: 45,
    completed: false,
    focusRating: null,
    notes: 'Anki deck review for tomorrow morning test.',
    date: getTodayDateString(0)
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Alex Rivera',
  university: 'Stanford University',
  major: 'Computer Science & Applied Math',
  term: 'Fall Term 2026',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  dailyStudyGoalHours: 4.5,
  currentStreakDays: 6,
  longestStreakDays: 14,
  soundEnabled: true,
  theme: 'light', // 'light' or 'dark'
  pomodoroSettings: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false
  }
};

export const WEEKLY_STATS_HISTORY = [
  { day: 'Mon', hours: 4.2, tasks: 5, target: 4.5 },
  { day: 'Tue', hours: 5.0, tasks: 6, target: 4.5 },
  { day: 'Wed', hours: 3.8, tasks: 4, target: 4.5 },
  { day: 'Thu', hours: 4.6, tasks: 5, target: 4.5 },
  { day: 'Fri', hours: 3.2, tasks: 3, target: 4.5 },
  { day: 'Sat', hours: 5.5, tasks: 7, target: 4.5 },
  { day: 'Sun', hours: 2.75, tasks: 3, target: 4.5 } // Today
];

export const STUDY_QUOTES = [
  { quote: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John C. Maxwell" },
  { quote: "Focus is a muscle. The more you practice deep uninterrupted work, the easier mastery becomes.", author: "Cal Newport" },
  { quote: "You don't have to be extreme, just consistent.", author: "Atomic Habits" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];
