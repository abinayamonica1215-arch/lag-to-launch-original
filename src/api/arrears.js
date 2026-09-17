import apiClient from './client';

export const arrearsApi = {
  /**
   * Submit student's arrear details for AI analysis & roadmap generation
   * @param {Object} details
   */
  async submitArrearDetails(details) {
    const fallback = () => {
      const arrearId = 'arr_' + Date.now();
      const subjects = Array.isArray(details.selectedSubjects) && details.selectedSubjects.length > 0
        ? details.selectedSubjects
        : [details.arrearSubject || 'Data Structures and Algorithms'];

      const primarySubject = subjects[0];

      // Build per-subject diagnosis & roadmap structures for every selected subject
      const subjectDiagnoses = subjects.map((subj) => {
        const weakAreas = details.perSubjectWeakAreas?.[subj] || details.weakAreas || ['Core Concepts', 'Problem Solving'];
        const weeks = [
          {
            id: `w1_${subj}`,
            weekNumber: 1,
            title: 'Foundations & High-Yield Core Concepts',
            description: `Focus on mastering the foundational weak areas identified in ${subj}.`,
            progressPercent: 0,
            days: [
              { id: `w1d1_${subj}`, dayNumber: 1, title: 'Concept Foundations & Theory', duration: '2 hours', type: 'learning', completed: false, topics: ['Core Definitions', 'Key Theorems', 'Formulae'] },
              { id: `w1d2_${subj}`, dayNumber: 2, title: 'Deep Dive: Primary Weak Topic', duration: '2 hours', type: 'learning', completed: false, topics: weakAreas[0] ? [weakAreas[0]] : ['Primary Concept Review'] },
              { id: `w1d3_${subj}`, dayNumber: 3, title: 'Secondary Focus & Common Pitfalls', duration: '2 hours', type: 'learning', completed: false, topics: weakAreas[1] ? [weakAreas[1]] : ['Standard Problem Patterns'] },
              { id: `w1d4_${subj}`, dayNumber: 4, title: 'Hands-on Practice & Problem Sets', duration: '2.5 hours', type: 'practice', completed: false, topics: ['5 Targeted University Problems', 'Step-by-Step Derivations'] },
              { id: `w1d5_${subj}`, dayNumber: 5, title: 'Diagnostic Self-Assessment', duration: '1.5 hours', type: 'assessment', completed: false, topics: ['Timed Quick Quiz', 'Concept Check'] },
              { id: `w1d6_${subj}`, dayNumber: 6, title: 'Error Analysis & Revision', duration: '2 hours', type: 'revision', completed: false, topics: ['Review Quiz Mistakes', 'Cheat Sheet Compilation'] },
              { id: `w1d7_${subj}`, dayNumber: 7, title: 'Weekly Milestone Assessment', duration: '2 hours', type: 'assessment', completed: false, topics: ['University Pattern Mock Paper'] },
            ],
          },
          {
            id: `w2_${subj}`,
            weekNumber: 2,
            title: 'Complex Problem Solving & Exam Patterns',
            description: `Analytical practice and high-weightage question patterns for ${subj}.`,
            progressPercent: 0,
            days: [
              { id: `w2d1_${subj}`, dayNumber: 8, title: 'Intermediate Concepts & Theorems', duration: '2 hours', type: 'learning', completed: false, topics: ['Advanced Concepts', 'Edge Cases'] },
              { id: `w2d2_${subj}`, dayNumber: 9, title: 'Important University 16-Mark Questions', duration: '2.5 hours', type: 'learning', completed: false, topics: ['Previous Year High-Weightage Questions'] },
              { id: `w2d3_${subj}`, dayNumber: 10, title: 'Complex Topic Breakdown', duration: '2 hours', type: 'learning', completed: false, topics: weakAreas[2] ? [weakAreas[2]] : ['Systematic Problem Decomposition'] },
              { id: `w2d4_${subj}`, dayNumber: 11, title: 'Speed & Accuracy Drill', duration: '2 hours', type: 'practice', completed: false, topics: ['Time-constrained Solving'] },
              { id: `w2d5_${subj}`, dayNumber: 12, title: 'Mid-term Checkpoint Assessment', duration: '2 hours', type: 'assessment', completed: false, topics: ['Mid-point Cumulative Test'] },
              { id: `w2d6_${subj}`, dayNumber: 13, title: 'Formula & Diagram Memorization', duration: '1.5 hours', type: 'revision', completed: false, topics: ['Mind-mapping & Key Diagrams'] },
              { id: `w2d7_${subj}`, dayNumber: 14, title: 'Weekly Assessment 2', duration: '2 hours', type: 'assessment', completed: false, topics: ['Evaluation on Weeks 1 & 2'] },
            ],
          },
          {
            id: `w3_${subj}`,
            weekNumber: 3,
            title: 'Full Exam Simulation & Final Polish',
            description: `Simulated university exam condition practice for ${subj}.`,
            progressPercent: 0,
            days: [
              { id: `w3d1_${subj}`, dayNumber: 15, title: 'Comprehensive Syllabus Scan', duration: '2 hours', type: 'revision', completed: false, topics: ['Rapid Recall of All Units'] },
              { id: `w3d2_${subj}`, dayNumber: 16, title: 'High-Probability Exam Questions', duration: '2.5 hours', type: 'practice', completed: false, topics: ['Top 20 Repeated Exam Questions'] },
              { id: `w3d3_${subj}`, dayNumber: 17, title: 'Presentation & Answer Structuring', duration: '1.5 hours', type: 'learning', completed: false, topics: ['Paper Presentation Tips'] },
              { id: `w3d4_${subj}`, dayNumber: 18, title: 'Full Length Mock Exam', duration: '3 hours', type: 'assessment', completed: false, topics: ['Simulated Exam Paper'] },
              { id: `w3d5_${subj}`, dayNumber: 19, title: 'Remedial Feedback & Gap Clearing', duration: '2 hours', type: 'revision', completed: false, topics: ['Rectifying Critical Gaps'] },
              { id: `w3d6_${subj}`, dayNumber: 20, title: 'Final Rapid Polish', duration: '1.5 hours', type: 'revision', completed: false, topics: ['Formula Flashcards & Quick Notes'] },
              { id: `w3d7_${subj}`, dayNumber: 21, title: 'Final Clearance Benchmark Assessment', duration: '2 hours', type: 'assessment', completed: false, topics: ['Clearance Certification Assessment'] },
            ],
          },
        ];

        return {
          subject: subj,
          weakAreas,
          weeks,
          summary: `Diagnostic analysis for ${subj}: Preparation level is ${details.preparationLevel || 'Basic'}. Focus on high-yield topics (${weakAreas.slice(0, 3).join(', ')}) to build exam readiness.`,
        };
      });

      const primaryDiagnosis = subjectDiagnoses[0];

      const analysis = {
        arrearId,
        subject: primarySubject,
        selectedSubjects: subjects,
        semester: details.arrearSemester,
        attempts: details.attempts,
        preparationLevel: details.preparationLevel,
        recommendedDailyHours: details.studyAvailability || '2-3 hours',
        keyFocusAreas: primaryDiagnosis.weakAreas,
        summary: `Structured multi-subject preparation plan generated for ${subjects.length} arrear subject(s): ${subjects.join(', ')}. Complete the daily 2-hour milestones for each subject to build comprehensive subject mastery.`,
        subjectDiagnoses,
      };

      const result = {
        success: true,
        arrearId,
        analysis,
        roadmap: {
          id: 'rdm_' + Date.now(),
          subject: primarySubject,
          selectedSubjects: subjects,
          totalWeeks: 3,
          totalDays: 21,
          completedDays: 0,
          currentDay: 1,
          weeks: primaryDiagnosis.weeks,
          subjectDiagnoses,
        },
      };

      // Save in localStorage for persistence across reloads during dev/testing
      localStorage.setItem('lag_to_launch_active_arrear', JSON.stringify(result));
      return result;
    };

    return apiClient.post('/arrears/analyze', details, {}, fallback);
  },

  /**
   * Fetch current active arrear analysis & roadmap
   */
  async getActiveRoadmap() {
    const fallback = () => {
      const saved = localStorage.getItem('lag_to_launch_active_arrear');
      if (saved) {
        return JSON.parse(saved);
      }
      // Return default starter roadmap if none submitted yet
      return this.submitArrearDetails({
        arrearSemester: 'Semester 3',
        arrearSubject: 'Data Structures and Algorithms',
        attempts: '1',
        preparationLevel: 'Basic',
        weakAreas: ['Linked List', 'Binary Trees & BST', 'Graphs (BFS/DFS)'],
        studyAvailability: '2-3 hours',
        preferredStudyTime: 'Evening',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        preparationStatus: 'Started learning',
      });
    };

    return apiClient.get('/arrears/active-roadmap', {}, fallback);
  },

  /**
   * Toggle completion of a roadmap day
   */
  async toggleDayCompletion(roadmapId, dayId, completed) {
    const fallback = () => {
      const saved = localStorage.getItem('lag_to_launch_active_arrear');
      if (saved) {
        const data = JSON.parse(saved);
        data.roadmap.weeks.forEach(week => {
          week.days.forEach(day => {
            if (day.id === dayId) {
              day.completed = completed;
            }
          });
          const done = week.days.filter(d => d.completed).length;
          week.progressPercent = Math.round((done / week.days.length) * 100);
        });
        const allDays = data.roadmap.weeks.flatMap(w => w.days);
        data.roadmap.completedDays = allDays.filter(d => d.completed).length;
        localStorage.setItem('lag_to_launch_active_arrear', JSON.stringify(data));
        return data;
      }
      return { success: true, dayId, completed };
    };

    return apiClient.post(`/arrears/roadmap/${roadmapId}/days/${dayId}/toggle`, { completed }, {}, fallback);
  },
};

export default arrearsApi;
