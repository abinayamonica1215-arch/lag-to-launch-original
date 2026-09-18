import apiClient from './client';

export const trainingApi = {
  /**
   * Get list of training modules
   */
  async getModules() {
    const fallback = () => [
      {
        id: 'mod-1',
        title: 'Foundational Data Structures & Algorithmic Thinking',
        category: 'Core Technical',
        duration: '18 Hours',
        totalTopics: 8,
        completedTopics: 5,
        progressPercent: 62,
        status: 'In Progress',
        instructor: 'Dr. S. Ramanathan, Senior Tech Lead',
        topics: [
          { id: 'top-1-1', title: 'Memory Architecture & Dynamic Pointers', duration: '45 mins', type: 'video', completed: true },
          { id: 'top-1-2', title: 'Singly and Doubly Linked Lists Implementations', duration: '60 mins', type: 'interactive', completed: true },
          { id: 'top-1-3', title: 'Stack & Queue Applications in Compilers', duration: '50 mins', type: 'video', completed: true },
          { id: 'top-1-4', title: 'Binary Search Tree & Self Balancing Trees', duration: '75 mins', type: 'interactive', completed: true },
          { id: 'top-1-5', title: 'Graph Traversals: BFS & DFS Real-world cases', duration: '60 mins', type: 'video', completed: true },
          { id: 'top-1-6', title: 'Dynamic Programming & Memoization Patterns', duration: '90 mins', type: 'practice', completed: false },
          { id: 'top-1-7', title: 'Sorting Algorithm Comparisons & Optimizations', duration: '45 mins', type: 'video', completed: false },
          { id: 'top-1-8', title: 'University 16-Mark High-Frequency Problem Solving', duration: '120 mins', type: 'assessment', completed: false },
        ],
      },
      {
        id: 'mod-2',
        title: 'System Design & Operating Systems Masterclass',
        category: 'Systems & Architecture',
        duration: '14 Hours',
        totalTopics: 6,
        completedTopics: 3,
        progressPercent: 50,
        status: 'In Progress',
        instructor: 'Priya Sundaram, Systems Architect',
        topics: [
          { id: 'top-2-1', title: 'Process Lifecycle & Context Switching Internals', duration: '60 mins', type: 'video', completed: true },
          { id: 'top-2-2', title: 'CPU Scheduling Algorithms with Numerical Solvers', duration: '75 mins', type: 'interactive', completed: true },
          { id: 'top-2-3', title: 'Deadlock Handling & Banker’s Algorithm', duration: '60 mins', type: 'video', completed: true },
          { id: 'top-2-4', title: 'Virtual Memory, Page Replacement & Thrashing', duration: '80 mins', type: 'interactive', completed: false },
          { id: 'top-2-5', title: 'File System Architecture & Disk Scheduling', duration: '50 mins', type: 'video', completed: false },
          { id: 'top-2-6', title: 'Module Milestone Evaluation', duration: '45 mins', type: 'assessment', completed: false },
        ],
      },
      {
        id: 'mod-3',
        title: 'Quantitative Aptitude & Logical Reasoning Accelerator',
        category: 'Placement Aptitude',
        duration: '16 Hours',
        totalTopics: 6,
        completedTopics: 2,
        progressPercent: 33,
        status: 'In Progress',
        instructor: 'Kavitha R., Lead Aptitude Trainer',
        topics: [
          { id: 'top-3-1', title: 'Time, Speed, Distance & Train Problems', duration: '60 mins', type: 'video', completed: true },
          { id: 'top-3-2', title: 'Work, Pipes, and Cisterns High-Speed Formulas', duration: '60 mins', type: 'interactive', completed: true },
          { id: 'top-3-3', title: 'Permutations, Combinations & Probability', duration: '75 mins', type: 'video', completed: false },
          { id: 'top-3-4', title: 'Data Interpretation & Chart Analysis', duration: '60 mins', type: 'practice', completed: false },
          { id: 'top-3-5', title: 'Syllogisms & Logical Deductions', duration: '50 mins', type: 'video', completed: false },
          { id: 'top-3-6', title: 'Full Length Aptitude Simulation Test', duration: '60 mins', type: 'assessment', completed: false },
        ],
      },
      {
        id: 'mod-4',
        title: 'Full-Stack Web Development & Modern API Engineering',
        category: 'Practical Skills',
        duration: '22 Hours',
        totalTopics: 7,
        completedTopics: 4,
        progressPercent: 57,
        status: 'In Progress',
        instructor: 'Arun Kumar, Senior Full-Stack Engineer',
        topics: [
          { id: 'top-4-1', title: 'Modern React Architecture & Component Patterns', duration: '90 mins', type: 'video', completed: true },
          { id: 'top-4-2', title: 'RESTful API Design & HTTP Status Codes', duration: '60 mins', type: 'interactive', completed: true },
          { id: 'top-4-3', title: 'State Management with Context & Custom Hooks', duration: '75 mins', type: 'video', completed: true },
          { id: 'top-4-4', title: 'Form Validation, Error Boundaries & UX', duration: '60 mins', type: 'interactive', completed: true },
          { id: 'top-4-5', title: 'FastAPI Backend Integration & Async Request Patterns', duration: '80 mins', type: 'video', completed: false },
          { id: 'top-4-6', title: 'Authentication Flow (JWT) & Protected Routes', duration: '70 mins', type: 'practice', completed: false },
          { id: 'top-4-7', title: 'Deployment, CI/CD, and Production Launch', duration: '60 mins', type: 'assessment', completed: false },
        ],
      },
    ];

    try {
      return await apiClient.get('/training/modules', {}, fallback);
    } catch (err) {
      return fallback();
    }
  },

  /**
   * Toggle topic completion
   */
  async updateTopicProgress(moduleId, topicId, completed) {
    const fallback = () => ({
      success: true,
      moduleId,
      topicId,
      completed,
    });

    return apiClient.post(`/training/modules/${moduleId}/topics/${topicId}/progress`, { completed }, {}, fallback);
  },

  /**
   * Get attendance log and streak
   */
  async getAttendance() {
    const fallback = () => {
      const today = new Date().toISOString().split('T')[0];
      const savedAttendance = localStorage.getItem('lag_to_launch_attendance');
      if (savedAttendance) {
        return JSON.parse(savedAttendance);
      }

      const defaultData = {
        currentStreak: 12,
        totalDaysAttended: 24,
        attendancePercentage: 92,
        todayMarked: false,
        recentDays: [
          { date: '2026-09-08', status: 'present' },
          { date: '2026-09-09', status: 'present' },
          { date: '2026-09-10', status: 'present' },
          { date: '2026-09-11', status: 'present' },
          { date: '2026-09-12', status: 'present' },
          { date: '2026-09-13', status: 'present' },
          { date: today, status: 'pending' },
        ],
      };
      return defaultData;
    };

    try {
      return await apiClient.get('/training/attendance', {}, fallback);
    } catch (err) {
      return fallback();
    }
  },

  /**
   * Mark daily attendance check-in
   */
  async markAttendance() {
    const fallback = () => {
      const today = new Date().toISOString().split('T')[0];
      const data = {
        currentStreak: 13,
        totalDaysAttended: 25,
        attendancePercentage: 94,
        todayMarked: true,
        recentDays: [
          { date: '2026-09-08', status: 'present' },
          { date: '2026-09-09', status: 'present' },
          { date: '2026-09-10', status: 'present' },
          { date: '2026-09-11', status: 'present' },
          { date: '2026-09-12', status: 'present' },
          { date: '2026-09-13', status: 'present' },
          { date: today, status: 'present' },
        ],
      };
      localStorage.setItem('lag_to_launch_attendance', JSON.stringify(data));
      return { success: true, message: 'Attendance recorded successfully!', data };
    };

    try {
      return await apiClient.post('/training/attendance/check-in', {}, {}, fallback);
    } catch (err) {
      return fallback();
    }
  },
};

export default trainingApi;
