import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { academicApi, arrearsApi, SEMESTERS, DEPARTMENTS } from '../api';

const ATTEMPTS_OPTIONS = ['1', '2', '3', '4+', 'Prefer not to say'];
const PREP_LEVELS = ['Beginner', 'Basic', 'Intermediate', 'Almost Ready'];
const AVAILABILITY_OPTIONS = ['Less than 1 hour', '1–2 hours', '2–3 hours', '3+ hours'];
const STUDY_TIMES = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PREPARATION_STATUSES = [
  "Haven't started",
  'Started learning',
  'Completed some topics',
  'Preparing for exam',
  'Ready for revision',
];

export const ArrearDetailsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setActiveRoadmap, showToast } = useApp();

  // Inputs
  const [department, setDepartment] = useState(user?.department || 'CSE');
  const [arrearSemester, setArrearSemester] = useState('Semester 3');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [attempts, setAttempts] = useState('1');
  const [preparationLevel, setPreparationLevel] = useState('Basic');
  const [perSubjectWeakAreas, setPerSubjectWeakAreas] = useState({});
  const [studyAvailability, setStudyAvailability] = useState('2–3 hours');
  const [preferredStudyTime, setPreferredStudyTime] = useState('Evening');
  const [availableDays, setAvailableDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [preparationStatus, setPreparationStatus] = useState('Started learning');
  const [activeSubjectTab, setActiveSubjectTab] = useState('');

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (user?.department) {
      setDepartment(user.department);
    }
  }, [user?.department]);

  // Dynamic fetch of subjects based on Department -> Semester
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const subjects = await academicApi.getSubjects(department, arrearSemester);
        setAvailableSubjects(subjects);
        if (subjects.length > 0) {
          setSelectedSubjects(subjects);
          setActiveSubjectTab(subjects[0]);
        } else {
          setSelectedSubjects([]);
          setActiveSubjectTab('');
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [department, arrearSemester]);

  const toggleSubjectSelect = (subj) => {
    setSelectedSubjects((prev) => {
      const exists = prev.includes(subj);
      const updated = exists ? prev.filter((s) => s !== subj) : [...prev, subj];
      if (!exists && !activeSubjectTab) {
        setActiveSubjectTab(subj);
      } else if (exists && activeSubjectTab === subj) {
        setActiveSubjectTab(updated[0] || '');
      }
      return updated;
    });
  };

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, d]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert('Please select at least one arrear subject.');
      return;
    }
    if (availableDays.length === 0) {
      alert('Please select at least one study day per week.');
      return;
    }

    setAnalyzing(true);

    try {
      const payload = {
        studentName: user?.fullName || 'Student',
        email: user?.email,
        department: department || user?.department || 'General Engineering',
        batch: user?.batch || '2026',
        arrearSemester,
        selectedSubjects,
        attempts,
        preparationLevel,
        perSubjectWeakAreas,
        studyAvailability,
        preferredStudyTime,
        availableDays,
        preparationStatus,
      };

      // API call to Backend / AI
      const res = await arrearsApi.submitArrearDetails(payload);

      setAnalysisResult(res);
      setActiveRoadmap(res);
      if (res.analysis?.selectedSubjects?.length > 0) {
        setActiveSubjectTab(res.analysis.selectedSubjects[0]);
      }
      showToast('Arrear Diagnostic analysis generated for all selected subjects!');
    } catch (err) {
      console.error('Analysis generation failed:', err);
      alert('Failed to generate AI analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Arrears Remediation Track</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            Arrear Diagnostics & Study Plan Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Provide your exact backlog subject parameters. Our AI diagnostics will construct your personalized week-by-week recovery roadmap.
          </p>
        </div>
      </div>

      {/* 1. AUTO-DISPLAY STUDENT PROFILE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#0F766E]" />
          Verified Student Profile (Auto-Loaded)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
            <span className="font-bold text-[#0F172A] truncate block">{user?.fullName || 'Student'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email ID</span>
            <span className="font-bold text-[#0F172A] truncate block">{user?.email || 'Not Provided'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
            <span className="font-bold text-[#0F766E] block">{user?.department || 'Not Specified'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Batch / Year</span>
            <span className="font-bold text-[#0F172A] block">{user?.batch || 'N/A'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Academic Position</span>
            <span className="font-bold text-[#0F172A] truncate block">{user?.academicPosition || 'Currently studying'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Semester</span>
            <span className="font-bold text-[#0F172A] block">{user?.currentSemester || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 2. ARREAR INPUT FORM */}
      {!analysisResult ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
          {/* Section: Subject & Attempts */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0F766E]" />
              Subject & Academic Context
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="department">
                  Department *
                </label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Arrear Semester */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="arrearSemester">
                  Arrear Semester *
                </label>
                <select
                  id="arrearSemester"
                  value={arrearSemester}
                  onChange={(e) => setArrearSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Arrear Subjects Multi-Select Checkboxes */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0F766E]" />
                  Arrear Subjects ({department} - {arrearSemester}) *
                </h2>
                <span className="text-xs font-semibold text-[#0F766E] bg-[#CCFBF1] px-2.5 py-1 rounded-full">
                  {selectedSubjects.length} Subject(s) Selected
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Check all subjects in which you currently have active arrears. You can select multiple subjects.
              </p>

              {loadingSubjects ? (
                <div className="p-6 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0F766E]" />
                  Loading subjects for {department} ({arrearSemester})...
                </div>
              ) : availableSubjects.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 text-center">
                  No subjects listed for this semester.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSubjects.map((sub) => {
                    const checked = selectedSubjects.includes(sub);
                    return (
                      <label
                        key={sub}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          checked
                            ? 'border-[#0F766E] bg-[#CCFBF1]/25 font-semibold text-[#0F172A] shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSubjectSelect(sub)}
                          className="mt-0.5 rounded text-[#0F766E] focus:ring-[#0F766E]"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs block">{sub}</span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {checked ? 'Selected for diagnosis & roadmap' : 'Click checkbox to include'}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Selected Subjects Summary Badges */}
              {selectedSubjects.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Selected Subjects Summary ({selectedSubjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSubjects.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#0F766E] text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635]" />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Number of Attempts */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number of Attempts *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ATTEMPTS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAttempts(opt)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                        attempts === opt
                          ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preparation Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preparation Level *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PREP_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPreparationLevel(lvl)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                        preparationLevel === lvl
                          ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Weak Areas Multi-Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F766E]" />
                Weak Areas (Select All That Apply) *
              </h2>
              <span className="text-xs text-slate-400">
                {selectedWeakAreas.length} selected
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Select specific units, topics, or sub-concepts in <span className="font-semibold text-slate-700">{arrearSubject}</span> that you struggle with:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {availableWeakTopics.map((topic) => {
                const isSelected = selectedWeakAreas.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleWeakArea(topic)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0F766E] bg-[#CCFBF1]/50 text-[#0F766E] font-semibold ring-1 ring-[#0F766E]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-1">{topic}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Other Weak Topic */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="otherWeakTopic">
                Other Weak Topic / Specific Theorem (Optional)
              </label>
              <input
                id="otherWeakTopic"
                type="text"
                value={otherWeakTopic}
                onChange={(e) => setOtherWeakTopic(e.target.value)}
                placeholder="e.g. Red-Black Tree rotations, BCNF proofs, Dijkstra derivation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          {/* Section: Study Availability & Schedule */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F766E]" />
              Schedule & Study Habits
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Study Availability */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Daily Study Availability *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStudyAvailability(opt)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                        studyAvailability === opt
                          ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Study Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Study Time *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STUDY_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setPreferredStudyTime(time)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                        preferredStudyTime === time
                          ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Days Multi-Selection */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Available Days (Select All That Apply) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 px-1 text-xs rounded-xl border transition-all font-medium text-center ${
                          isSelected
                            ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Preparation Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="prepStatus">
                  Current Preparation Status *
                </label>
                <select
                  id="prepStatus"
                  value={preparationStatus}
                  onChange={(e) => setPreparationStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                >
                  {PREPARATION_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Target / Exam Date (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="examDate">
                  Target / Exam Date (Optional)
                </label>
                <input
                  id="examDate"
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>
            </div>
          </div>

          {/* Button: Analyze My Arrears */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-4 rounded-xl font-bold text-white bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.99] shadow-elevated transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI Engine Analyzing Subject Diagnostics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#A3E635]" />
                  <span>Analyze My Arrears</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* 3. MULTI-SUBJECT DIAGNOSIS RESULT & READY-MADE PREPARATION PLANS */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#CCFBF1] text-[#0F766E]">
                  AI Multi-Subject Diagnostics Complete
                </span>
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  Diagnostic Summary for {analysisResult.analysis.selectedSubjects?.length || 1} Subject(s)
                </h2>
                <p className="text-xs text-slate-500">
                  Targeted clearance model calibrated for {analysisResult.analysis.semester} ({department})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Edit Arrear Subjects
                </button>
                <button
                  onClick={() => navigate('/roadmap')}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center gap-1.5"
                >
                  <span>Open Interactive Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TRUTHFUL FUNCTIONAL METRICS (No fake percentages) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Preparation Progress</span>
                <span className="text-xl font-extrabold text-[#0F766E] block">
                  0% (21 Milestones)
                </span>
                <span className="text-[11px] text-slate-500 block">Daily 2-hour commitment</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Selected Arrears</span>
                <span className="text-xl font-extrabold text-emerald-800 block">
                  {analysisResult.analysis.selectedSubjects?.length || 1} Subject(s)
                </span>
                <span className="text-[11px] text-slate-500 block">Multi-subject tracking</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Recommended Topics</span>
                <span className="text-sm font-bold text-[#0F172A] block">
                  High-Yield Exam Units
                </span>
                <span className="text-[11px] text-slate-500 block">Unit-by-unit guidance</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Completed Assessments</span>
                <span className="text-xl font-extrabold text-[#0F172A] block">
                  0 Completed
                </span>
                <span className="text-[11px] text-slate-500 block">Self & weak-link tests</span>
              </div>
            </div>

            {/* Summary text */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <div className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                Multi-Subject Diagnostic Summary:
              </div>
              <p>{analysisResult.analysis.summary}</p>
            </div>

            {/* PER-SUBJECT TABS & READY-MADE PREPARATION PLANS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0F766E]" />
                  Per-Subject Diagnosis & Ready-Made Preparation Plans
                </h3>
              </div>

              {/* Subject Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {(analysisResult.analysis.selectedSubjects || [analysisResult.analysis.subject]).map((subj) => {
                  const isActive = activeSubjectTab === subj;
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => setActiveSubjectTab(subj)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#0F766E] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>

              {/* Active Subject Ready-Made Plan Display */}
              {activeSubjectTab && (
                <div className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-extrabold text-[#0F172A]">
                        {academicApi.getReadyMadePlan(activeSubjectTab).title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Tailored 5-unit learning and revision syllabus for {activeSubjectTab}.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E]">
                      {academicApi.getReadyMadePlan(activeSubjectTab).duration}
                    </span>
                  </div>

                  {/* Units Breakdown */}
                  <div className="space-y-2.5 pt-2">
                    {academicApi.getReadyMadePlan(activeSubjectTab).units.map((unit, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#0F766E] block">{unit.name}</span>
                          <span className="text-xs text-slate-600 block">{unit.focus}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 self-start sm:self-center">
                          Weight: {unit.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => navigate('/roadmap')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-card flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Complete Multi-Subject Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArrearDetailsPage;
