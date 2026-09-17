import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Loader2,
  BarChart2,
  RefreshCw,
  Award,
  BookOpen,
  MessageSquareCode,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { assessmentApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const PlacementReadinessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [assessment, setAssessment] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await assessmentApi.getPlacementAssessment();
        setAssessment(data);
      } catch (err) {
        console.error('Failed to load placement assessment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Send answers to backend AI
      const res = await assessmentApi.submitPlacementAssessment({
        answers: selectedAnswers,
      });
      setResult(res);
      showToast('Assessment evaluation received from backend AI.');
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      alert('Failed to evaluate assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F766E] mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading Placement Readiness Assessment...</p>
      </div>
    );
  }

  const questions = assessment?.questions || [];
  const currentQ = questions[currentQuestionIdx];
  const totalQ = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flow 2: Placement Readiness Diagnostic</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            Corporate Placement Readiness Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            For students with no arrears or cleared arrears. Evaluate your multi-domain problem solving readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
          <Clock className="w-4 h-4 text-[#0F766E]" />
          <span>{assessment?.durationMinutes || 20} Mins Test</span>
        </div>
      </div>

      {!result ? (
        /* QUIZ QUESTION CARD */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          {/* Progress Tracker Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
              <span>Question {currentQuestionIdx + 1} of {totalQ}</span>
              <span className="text-[#0F766E] font-bold">{answeredCount} of {totalQ} Answered</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#0F766E] transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / totalQ) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Category & Text */}
          <div className="space-y-3 pt-2">
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
              {currentQ?.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-relaxed">
              {currentQ?.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ?.options?.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#0F766E] bg-[#CCFBF1]/40 text-[#0F172A] font-semibold ring-1 ring-[#0F766E]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx((p) => p - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            {currentQuestionIdx < totalQ - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Answers...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Assessment</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* READINESS RESULT VIEW (READY vs NOT READY) */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Placement Diagnostic Verdict
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-black text-[#0F172A]">
                    Readiness Status:
                  </h2>
                  <span
                    className={`px-3.5 py-1 rounded-full text-sm font-black border ${
                      result.readinessStatus === 'Ready'
                        ? 'bg-emerald-50 text-[#0F766E] border-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {result.readinessStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                <span className="text-3xl font-black text-[#0F172A]">{result.percentage}%</span>
                <span className="text-xs text-slate-500 font-semibold">
                  ({result.score}/{result.totalScore} Correct)
                </span>
              </div>
            </div>

            {/* AI Feedback Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <div className="font-bold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                Backend AI Analysis:
              </div>
              <p>{result.aiFeedback}</p>
            </div>

            {/* Category Score Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Competency Breakdown
              </h3>
              <div className="space-y-2">
                {result.categoryBreakdown?.map((cat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.category}</span>
                    <span className="font-bold text-[#0F766E]">{cat.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Branching Actions driven by Backend AI Verdict */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedAnswers({});
                  setCurrentQuestionIdx(0);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Re-take Assessment
              </button>

              {result.readinessStatus === 'Ready' ? (
                /* READY BRANCH: Direct Mock Interview & Jobs */
                <>
                  <button
                    onClick={() => navigate('/mock-interview')}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-card flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquareCode className="w-4 h-4" />
                    <span>Proceed to AI Mock Interview</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/careers')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>View Job Opportunities</span>
                  </button>
                </>
              ) : (
                /* NOT READY BRANCH: AI Roadmap & Training */
                <>
                  <button
                    onClick={() => navigate('/training')}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-card flex items-center justify-center gap-2 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Remedial Training Modules</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/roadmap')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-[#CCFBF1] hover:bg-teal-100 border border-teal-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>View AI Study Roadmap</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementReadinessPage;
