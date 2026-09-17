import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  BookOpen,
  Briefcase,
  RefreshCw,
  Sliders,
  Layers,
  Check,
} from 'lucide-react';
import { assessmentApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const FinalAssessmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateAcademicStatus } = useAuth();
  const { activeRoadmap, showToast } = useApp();

  // Determine available subjects
  const availableSubjects = 
    location.state?.selectedSubjects ||
    activeRoadmap?.selectedSubjects ||
    user?.selectedSubjects ||
    (activeRoadmap?.subject ? [activeRoadmap.subject] : ['Data Structures and Algorithms']);

  const initialSubject =
    searchParams.get('subject') ||
    location.state?.subject ||
    activeRoadmap?.subject ||
    availableSubjects[0] ||
    'Data Structures and Algorithms';

  const initialType =
    searchParams.get('type') ||
    searchParams.get('assessmentType') ||
    location.state?.assessmentType ||
    'dynamic_self';

  const department =
    searchParams.get('department') ||
    location.state?.department ||
    activeRoadmap?.subjectDetails?.department ||
    user?.department ||
    user?.academicStatus?.department ||
    'Computer Science & Engineering';

  const semester =
    searchParams.get('semester') ||
    location.state?.semester ||
    activeRoadmap?.subjectDetails?.semester ||
    user?.semester ||
    'Semester 3';

  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [assessmentType, setAssessmentType] = useState(initialType);

  const [assessment, setAssessment] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      setResult(null);
      setSelectedAnswers({});
      setCurrentIdx(0);
      try {
        const data = await assessmentApi.getCategoryAssessment({
          subject: selectedSubject,
          assessmentType,
          department,
          semester,
        });
        setAssessment(data);
      } catch (err) {
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [selectedSubject, assessmentType, department, semester]);

  const handleSelect = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await assessmentApi.submitFinalAssessment({
        subject: selectedSubject,
        assessmentType,
        answers: selectedAnswers,
      });
      setResult(res);

      if (res.passed) {
        updateAcademicStatus('Arrears Cleared');
        showToast('Congratulations! Assessment benchmark passed. Placement track unlocked.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const questions = assessment?.questions || [];
  const currentQ = questions[currentIdx];
  const totalQ = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Partition & Metadata Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
        {/* Top Metadata Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-medium text-slate-600">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">{department}</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">{semester}</span>
            <span>&rarr;</span>
            <span className="font-bold text-[#0F766E]">{selectedSubject}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Mode:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              assessmentType === 'weak_link'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-teal-100 text-[#0F766E]'
            }`}>
              {assessmentType === 'weak_link' ? 'Weak-Link Assessment' : 'Dynamic Self-Assessment'}
            </span>
          </div>
        </div>

        {/* Assessment Title & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Subject Evaluation Gateway</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              {selectedSubject} Benchmark Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Score 60%+ to certify mastery and progress along your placement preparation track.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
            <Clock className="w-4 h-4 text-[#0F766E]" />
            <span>{assessment?.durationMinutes || 20} Mins</span>
          </div>
        </div>

        {/* Filters / Switchers for Subject and Assessment Type */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {/* Subject Dropdown / Picker */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <BookOpen className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span className="text-xs font-bold text-slate-600">Target Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F766E] max-w-full"
            >
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Type Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => setAssessmentType('dynamic_self')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                assessmentType === 'dynamic_self'
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dynamic Self-Assessment
            </button>
            <button
              type="button"
              onClick={() => setAssessmentType('weak_link')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                assessmentType === 'weak_link'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weak-Link Assessment
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F766E] mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Fetching question partition for {selectedSubject} ({assessmentType === 'weak_link' ? 'Weak-Link' : 'Dynamic Self-Assessment'})...
          </p>
        </div>
      ) : !result ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
              <span>Question {currentIdx + 1} of {totalQ}</span>
              <span className="text-[#0F766E] font-bold">{answeredCount} of {totalQ} Answered</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#0F766E] transition-all duration-300"
                style={{ width: `${totalQ > 0 ? ((currentIdx + 1) / totalQ) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {assessmentType === 'weak_link' ? 'Diagnostic Weak-Link Item' : 'Dynamic Self-Evaluation Item'}
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
                  onClick={() => handleSelect(currentQ.id, idx)}
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
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => p - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIdx < totalQ - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Grading Assessment...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Certify Clearance</span>
                    <Award className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULT VIEW */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evaluation Verdict
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl font-black text-[#0F172A]">
                  {result.passed ? 'Benchmark Passed!' : 'Benchmark Pending'}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    result.passed
                      ? 'bg-emerald-50 text-[#0F766E] border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  Score: {result.percentage}% ({result.score}/{result.totalScore})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Status Transition</span>
              <span className="text-sm font-bold text-[#0F766E]">{result.newStatus}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {result.message}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            {result.passed ? (
              <>
                <button
                  onClick={() => navigate('/mock-interview')}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Placement Mock Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/careers')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Explore Jobs</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedAnswers({});
                  setCurrentIdx(0);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59]"
              >
                Review Topics & Re-Attempt
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalAssessmentPage;

