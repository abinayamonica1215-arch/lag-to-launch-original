import apiClient from './client';

export const careersApi = {
  /**
   * Get job opportunities / campus placement drives
   */
  async getOpportunities(filters = {}) {
    const fallback = () => [
      {
        id: 'job-101',
        title: 'Associate Software Engineer',
        company: 'CognitiveScale Technologies',
        logoText: 'CST',
        location: 'Bengaluru / Hyderabad (Hybrid)',
        salaryPackage: '₹6.5 - ₹8.5 LPA',
        batchEligible: '2025 / 2026',
        minArrearPolicy: 'Up to 2 cleared arrears eligible (Zero active arrears at joining)',
        skillsRequired: ['Data Structures', 'Python / Java', 'SQL', 'FastAPI / Spring Boot'],
        applicationDeadline: '2026-10-15',
        applied: true,
        status: 'Interview Scheduled', // 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended'
        interviewDate: '2026-09-22 at 10:30 AM',
        recruiterNotes: 'Candidate demonstrates strong comeback profile with 92% readiness index.',
      },
      {
        id: 'job-102',
        title: 'Frontend React Developer',
        company: 'Veloce Digital Labs',
        logoText: 'VDL',
        location: 'Chennai / Coimbatore (On-site)',
        salaryPackage: '₹5.5 - ₹7.2 LPA',
        batchEligible: '2025 / 2026',
        minArrearPolicy: 'History of arrears accepted if practical code test passed',
        skillsRequired: ['React.js', 'Tailwind CSS', 'REST API Integration', 'JavaScript ES6+'],
        applicationDeadline: '2026-10-02',
        applied: false,
        status: 'Open',
        recruiterNotes: 'Focus on portfolio projects and clean responsive component design.',
      },
      {
        id: 'job-103',
        title: 'Graduate Cloud & DevOps Trainee',
        company: 'Apex Cloud Systems',
        logoText: 'ACS',
        location: 'Pune / Remote',
        salaryPackage: '₹6.0 - ₹7.8 LPA',
        batchEligible: '2025 / 2026',
        minArrearPolicy: 'Cleared arrears accepted with certification in Cloud fundamentals',
        skillsRequired: ['Linux Basics', 'Networking (TCP/IP)', 'Docker', 'Python Scripting'],
        applicationDeadline: '2026-10-20',
        applied: false,
        status: 'Open',
        recruiterNotes: 'Hiring partner values persistence, continuous improvement, and hands-on labs.',
      },
      {
        id: 'job-104',
        title: 'Data & Business Intelligence Analyst',
        company: 'StrataMetrics Analytics',
        logoText: 'SMA',
        location: 'Bengaluru',
        salaryPackage: '₹6.0 - ₹8.0 LPA',
        batchEligible: '2025 / 2026',
        minArrearPolicy: 'Cleared arrears accepted',
        skillsRequired: ['SQL Complex Queries', 'Power BI / Tableau', 'Python Pandas', 'Statistics'],
        applicationDeadline: '2026-10-30',
        applied: true,
        status: 'Offer Extended',
        offerDetails: {
          offeredRole: 'Junior BI Analyst',
          ctc: '₹7.2 LPA',
          joiningDate: '2026-11-01',
          acceptanceDeadline: '2026-09-28',
        },
        recruiterNotes: 'Official offer letter released. Verified through Lag-to-Launch fast-track clearance.',
      },
    ];

    return apiClient.get('/careers/opportunities', {}, fallback);
  },

  /**
   * Apply for a job
   */
  async applyJob(jobId) {
    const fallback = () => ({
      success: true,
      jobId,
      message: 'Application successfully submitted to the recruiter! Track your status on the dashboard.',
      status: 'Applied',
    });

    return apiClient.post(`/careers/apply/${jobId}`, {}, {}, fallback);
  },

  /**
   * Get candidate placement status overview
   */
  async getPlacementSummary() {
    const fallback = () => ({
      careerReadinessScore: 88,
      readinessLevel: 'High Placement Readiness',
      applicationsSubmitted: 2,
      interviewsScheduled: 1,
      offersReceived: 1,
      topRecommendedDomain: 'Full Stack & Software Engineering',
      badges: [
        { id: 'b1', name: 'Arrear Overcomer', description: 'Engineered a systematic recovery with structured roadmaps', icon: 'Award' },
        { id: 'b2', name: '7-Day Streak Master', description: 'Consistently practiced daily for 7+ days', icon: 'Flame' },
        { id: 'b3', name: 'Interview Cleared', description: 'Achieved 85%+ score in Technical AI Mock Round', icon: 'CheckCircle2' },
      ],
    });

    return apiClient.get('/careers/summary', {}, fallback);
  },
};

export default careersApi;
