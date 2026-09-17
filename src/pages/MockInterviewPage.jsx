import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquareCode,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Briefcase,
  Mic,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { interviewApi } from '../api';
import { useApp } from '../context/AppContext';

export const MockInterviewPage = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState({});
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const initInterview = async () => {
      try {
        const data = await interviewApi.getMockInterviewSession('Software Engineering');
        setSession(data);
      } catch (err) {
        console.error('Failed to start interview session:', err);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, []);

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert('Please type or dictate your answer before submitting.');
      return;
    }

    const currentQ = session.questions[currentIdx];
    setSubmitting(true);

    try {
      const res = await interviewApi.submitAnswer({
        sessionId: session.sessionId,
        questionId: currentQ.id,
        answerText,
        expectedKeywords: currentQ.expectedKeywords || [],
        questionTitle: currentQ.type || currentQ.question,
        timeSpentSeconds: 120,
      });

      setQuestionFeedback((prev) => ({
        ...prev,
        [currentQ.id]: res,
      }));

      showToast(`Answer evaluated! Score: ${res.score}%`);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert('Error submitting answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishSession = async () => {
    setSubmitting(true);
    try {
      const report = await interviewApi.getFinalFeedback(session.sessionId);
      setFinalReport(report);
      showToast('Comprehensive interview evaluation generated!');
    } catch (err) {
      console.error('Failed to finish session:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F766E] mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Initializing AI Mock Interview Simulator...</p>
      </div>
    );
  }

  const questions = session?.questions || [];
  const currentQ = questions[currentIdx];
  const currentFb = currentQ ? questionFeedback[currentQ.id] : null;
  const isAllAnswered = questions.every((q) => questionFeedback[q.id]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Interactive Placement Simulator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            AI Technical Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Domain: <span className="font-bold text-[#0F172A]">{session?.domain || 'Software Engineering'}</span>. Simulates real campus recruitment questions.
          </p>
        </div>

        {/* Progress status */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
          <span>Question {currentIdx + 1} of {questions.length}</span>
        </div>
      </div>

      {!finalReport ? (
        <div className="space-y-6">
          {/* Question Stepper Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {questions.map((q, i) => {
              const isAnswered = !!questionFeedback[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIdx(i);
                    setShowHint(false);
                    setAnswerText('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    i === currentIdx
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : isAnswered
                      ? 'bg-emerald-50 text-[#0F766E] border border-emerald-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>Q{i + 1}</span>
                  {isAnswered && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                {currentQ?.type}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-relaxed">
                {currentQ?.question}
              </h2>
            </div>

            {/* Hint toggler */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Guidance Hint' : 'Show Guidance & Key Points'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-[#0F766E]">Interviewer Expectation: </span>
                  {currentQ?.hints}
                </div>
              )}
            </div>

            {/* Answer Input Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label htmlFor="answerText">Your Response</label>
                <span className="text-slate-400">Aim for structured, concise explanations</span>
              </div>
              <textarea
                id="answerText"
                rows={5}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your structured explanation here (e.g. Core definition, architectural trade-offs, practical scenario)..."
                className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all leading-relaxed"
              />
            </div>

            {/* Action Submit Answer */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  // Pre-fill answer demo for speed testing
                  setAnswerText(
                    'A process is an execution instance with its own virtual address space, PCB, and system resources. A thread is an execution unit inside a process sharing memory. Context switching between processes incurs TLB and cache flushes, making thread context switching significantly faster and more lightweight.'
                  );
                }}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Fill Sample Response
              </button>

              <button
                type="button"
                disabled={submitting || !answerText.trim()}
                onClick={handleAnswerSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Submit For Evaluation</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Feedback Breakdown UI if Answered */}
            {currentFb && (
              <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      AI Response Evaluation
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#CCFBF1] text-[#0F766E] border border-teal-200">
                    Score: {currentFb.score}%
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentFb.evaluation?.feedbackNotes}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <span className="font-bold text-emerald-800 block mb-1">Key Strengths:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {currentFb.evaluation?.strengths?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <span className="font-bold text-amber-800 block mb-1">Growth Opportunities:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {currentFb.evaluation?.improvements?.map((im, idx) => (
                        <li key={idx}>{im}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => {
                  setCurrentIdx((p) => p - 1);
                  setShowHint(false);
                  setAnswerText('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous Question
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIdx((p) => p + 1);
                    setShowHint(false);
                    setAnswerText('');
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishSession}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Generate Final Evaluation Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* COMPREHENSIVE FINAL EVALUATION REPORT */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Final Assessment Report
              </span>
              <h2 className="text-2xl font-black text-[#0F172A]">
                {finalReport.performanceBadge}
              </h2>
              <span className="text-xs text-[#0F766E] font-semibold">{finalReport.verdict}</span>
            </div>

            <div className="bg-[#CCFBF1] p-4 rounded-2xl border border-teal-200 text-center shrink-0">
              <span className="text-3xl font-black text-[#0F766E] block">
                {finalReport.overallScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-600">
                Placement Index
              </span>
            </div>
          </div>

          {/* Metric radar breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {Object.entries(finalReport.metrics || {}).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-lg font-black text-[#0F172A] block">{val}%</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
            ))}
          </div>

          {/* Key Takeaways */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key Evaluator Takeaways
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {finalReport.keyTakeaways?.map((t, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => {
                setFinalReport(null);
                setQuestionFeedback({});
                setCurrentIdx(0);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50"
            >
              Start New Interview Round
            </button>
            <button
              onClick={() => navigate('/careers')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-card flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Proceed to Verified Job Drives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
