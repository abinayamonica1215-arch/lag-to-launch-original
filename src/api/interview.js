import apiClient from './client';

export const interviewApi = {
  /**
   * Get active or new mock interview session
   * @param {string} domain e.g. 'Software Engineering', 'System Design', 'HR & Behavioral'
   */
  async getMockInterviewSession(domain = 'Software Engineering') {
    const fallback = () => ({
      sessionId: 'mock_session_' + Date.now(),
      domain,
      status: 'Ready',
      totalQuestions: 4,
      currentQuestionIndex: 0,
      questions: [
        {
          id: 'iq1',
          type: 'Technical Foundations',
          question: 'Can you explain the differences between Process and Thread, and how OS context switching differs between them?',
          hints: 'Mention memory address spaces, PCB vs TCB, overhead of cache misses during context switch.',
          expectedKeywords: ['process', 'thread', 'virtual address space', 'pcb', 'tcb', 'cache', 'overhead', 'memory'],
        },
        {
          id: 'iq2',
          type: 'Data Structures & Algorithms',
          question: 'How would you find the median of an incoming stream of numbers in real time with optimal time complexity?',
          hints: 'Think about two heaps: a Max-Heap for the smaller half and a Min-Heap for the greater half.',
          expectedKeywords: ['two heaps', 'max heap', 'min heap', 'log n', 'median', 'rebalance', 'priority queue'],
        },
        {
          id: 'iq3',
          type: 'Problem Solving & Resilience',
          question: 'Tell me about a challenging academic or project setback you faced (such as an exam arrear or code crash) and how you engineered a systematic comeback.',
          hints: 'Use the STAR method: Situation, Task, Action, Result. Highlight growth mindset and disciplined study scheduling.',
          expectedKeywords: ['star method', 'situation', 'action', 'result', 'resilience', 'schedule', 'comeback', 'learning'],
        },
        {
          id: 'iq4',
          type: 'System Architecture',
          question: 'How would you design a rate limiter to protect a web service API from excessive traffic?',
          hints: 'Discuss algorithms like Token Bucket, Leaky Bucket, or Sliding Window Counter, and storage in Redis.',
          expectedKeywords: ['token bucket', 'leaky bucket', 'sliding window', 'redis', 'rate limit', '429', 'traffic'],
        },
      ],
    });

    return apiClient.get(`/interview/session?domain=${encodeURIComponent(domain)}`, {}, fallback);
  },

  /**
   * Submit an answer for AI evaluation
   * Strictly evaluates the submitted text against expected key concepts, relevance, and technical correctness.
   * Prevents random / gibberish text from receiving high scores.
   * @param {Object} data { sessionId, questionId, answerText, timeSpentSeconds, expectedKeywords }
   */
  async submitAnswer(data) {
    const fallback = () => {
      const answer = (data.answerText || '').trim();
      const lowerAnswer = answer.toLowerCase();

      // Retrieve expected keywords for the question
      const defaultKeywords = [
        'process', 'thread', 'pcb', 'tcb', 'memory', 'heap', 'stack', 'cache',
        'star method', 'resilience', 'token bucket', 'sliding window', 'redis', 'algorithm'
      ];
      const keywords = data.expectedKeywords && data.expectedKeywords.length > 0 ? data.expectedKeywords : defaultKeywords;

      // 1. Check for blank or extremely short input
      if (!answer || answer.length < 5) {
        return {
          success: true,
          questionId: data.questionId,
          score: 0,
          evaluation: {
            technicalAccuracy: 'Unanswered',
            communicationClarity: 'None',
            confidenceScore: 0,
            feedbackNotes: 'No response submitted. Please state your answer clearly using core technical concepts.',
            strengths: [],
            improvements: ['Provide a structured explanation answering the question directly.'],
            missingConcepts: keywords,
          },
        };
      }

      // 2. Check for keyboard mash, gibberish, or repeating pattern
      const words = lowerAnswer.split(/\s+/).filter(Boolean);
      const isKeyboardMash =
        /^(.)\1{3,}$/.test(lowerAnswer) ||
        /^(asdf|qwerty|zxcv|1234|test|hello|hi|random)+$/i.test(lowerAnswer.replace(/[^a-z0-9]/g, '')) ||
        (words.length <= 3 && !keywords.some((kw) => lowerAnswer.includes(kw.toLowerCase())));

      // Count matched concepts
      const matched = keywords.filter((kw) => lowerAnswer.includes(kw.toLowerCase()));
      const missing = keywords.filter((kw) => !lowerAnswer.includes(kw.toLowerCase()));
      const matchRatio = keywords.length > 0 ? matched.length / keywords.length : 0;

      let score = 0;
      let technicalAccuracy = 'Incorrect / Irrelevant';
      let communicationClarity = 'Unclear';
      let feedbackNotes = '';
      let strengths = [];
      let improvements = [];

      if (isKeyboardMash || matched.length === 0) {
        // Random / Off-topic answer receives low score (0–15%)
        score = Math.min(15, words.length);
        technicalAccuracy = 'Off-Topic / Incorrect';
        communicationClarity = 'Irrelevant';
        feedbackNotes = 'The submitted response does not address the question asked or contain expected technical concepts. Random or off-topic text receives no score credit.';
        strengths = [];
        improvements = [
          `Focus directly on the question requirements.`,
          `Include key technical concepts such as: ${keywords.slice(0, 3).join(', ')}.`,
        ];
      } else if (matchRatio < 0.4) {
        // Partially correct answer (40–65%)
        score = Math.round(40 + matchRatio * 50 + Math.min(words.length, 20) * 0.4);
        score = Math.min(65, score);
        technicalAccuracy = 'Partially Correct';
        communicationClarity = 'Basic';
        feedbackNotes = `You correctly identified key points (${matched.join(', ')}), but missed essential concepts (${missing.slice(0, 2).join(', ')}).`;
        strengths = [`Identified core concept: ${matched.slice(0, 2).join(' & ')}`];
        improvements = [`Elaborate further on: ${missing.slice(0, 2).join(', ')}`, 'Provide concrete examples and trade-offs.'];
      } else {
        // High quality answer (80–96%)
        score = Math.round(78 + matchRatio * 18 + Math.min(words.length, 25) * 0.3);
        score = Math.min(96, score);
        technicalAccuracy = 'Strong & Accurate';
        communicationClarity = 'Structured & Clear';
        feedbackNotes = `Excellent response! You demonstrated strong technical command by identifying key concepts: ${matched.join(', ')}.`;
        strengths = ['Addressed core question directly', `Covered key concepts: ${matched.slice(0, 3).join(', ')}`];
        improvements = missing.length > 0 ? [`Consider mentioning: ${missing.slice(0, 2).join(', ')}`] : ['Great answer! Ready for advanced rounds.'];
      }

      return {
        success: true,
        questionId: data.questionId,
        score,
        evaluation: {
          technicalAccuracy,
          communicationClarity,
          confidenceScore: score,
          feedbackNotes,
          strengths,
          improvements,
          missingConcepts: missing,
          matchedConcepts: matched,
        },
      };
    };

    return apiClient.post('/interview/submit-answer', data, {}, fallback);
  },

  /**
   * Finalize session and get comprehensive AI evaluation
   */
  async getFinalFeedback(sessionId) {
    const fallback = () => ({
      sessionId,
      overallScore: 86,
      performanceBadge: 'Placement Ready — Top Tier',
      metrics: {
        technicalKnowledge: 88,
        problemSolving: 85,
        communication: 89,
        culturalFit: 84,
      },
      verdict: 'Recommended for Corporate Placement Drives',
      keyTakeaways: [
        'Demonstrates understanding of core system architecture and data structure trade-offs.',
        'High degree of composure and resilience when explaining problem remediation.',
        'Ready for Technical Round 1 and Round 2 interviews at top tech firms.',
      ],
      nextActions: [
        'Proceed to Verified Job Opportunities in the Placement Portal.',
        'Apply directly to hiring partners with your certified Launch Score.',
      ],
    });

    return apiClient.get(`/interview/${sessionId}/final-feedback`, {}, fallback);
  },
};

export default interviewApi;
