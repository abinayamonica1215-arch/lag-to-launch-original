import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
  RefreshCw,
  Flame,
} from 'lucide-react';
import { arrearsApi } from '../api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// Derive assessment tier from week number and day
// Week 1 → assessment1 | Week 2 → assessment2 | Week 3 Day 21 → final | Week 3 other → assessment3
const getAssessmentTier = (weekNumber, day) => {
  if (weekNumber === 3 && day.dayNumber === 21) return 'final';
  if (weekNumber === 1) return 'assessment1';
  if (weekNumber === 2) return 'assessment2';
  return 'assessment3';
};

// Reusable Week Component
const WeekSection = ({ week, onToggleDay, subject }) => {
  const [expanded, setExpanded] = useState(true);

  const getDayIcon = (type) => {
    switch (type) {
      case 'practice':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'assessment':
        return <FileCheck className="w-3.5 h-3.5 text-[#0F766E]" />;
      case 'revision':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden transition-all">
      {/* Week Header Banner */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white font-bold flex items-center justify-center text-sm shadow-sm">
            W{week.weekNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">{week.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                {week.progressPercent || 0}% Done
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{week.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Bar Mini */}
          <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden hidden md:block">
            <div
              className="h-full bg-[#0F766E] transition-all duration-500"
              style={{ width: `${week.progressPercent || 0}%` }}
            />
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Week Days List */}
      {expanded && (
        <div className="divide-y divide-slate-100">
          {week.days.map((day) => (
            <div
              key={day.id}
              className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                day.completed ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                {/* Completion Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleDay(week.id, day.id, !day.completed)}
                  className="mt-0.5 sm:mt-0 text-slate-300 hover:text-[#0F766E] transition-colors shrink-0"
                  aria-label={`Mark Day ${day.dayNumber} as ${day.completed ? 'incomplete' : 'complete'}`}
                >
                  {day.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#0F766E] fill-teal-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`text-sm font-semibold ${day.completed ? 'line-through text-slate-500' : 'text-[#0F172A]'}`}>
                      {day.title}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {getDayIcon(day.type)}
                      <span className="capitalize">{day.type}</span>
                    </span>
                  </div>

                  {/* Topic list */}
                  {day.topics && day.topics.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      <span>Key focus:</span>
                      {day.topics.map((t, idx) => (
                        <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Day Duration & Status */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {day.duration}
                </span>

                {day.type === 'assessment' ? (
                  <Link
                    to={`/final-assessment?type=${getAssessmentTier(week.weekNumber, day)}&subject=${encodeURIComponent(subject || '')}`}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0F766E] text-white hover:bg-[#115E59] transition-colors"
                  >
                    Take Quiz
                  </Link>
                ) : (
                  <button
                    onClick={() => onToggleDay(week.id, day.id, !day.completed)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      day.completed
                        ? 'border-emerald-200 text-[#0F766E] bg-emerald-50'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {day.completed ? 'Completed' : 'Mark Done'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RoadmapPage = () => {
  const { user } = useAuth();
  const { activeRoadmap, setActiveRoadmap, showToast } = useApp();
  const [loading, setLoading] = useState(!activeRoadmap);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await arrearsApi.getActiveRoadmap();
        setActiveRoadmap(res);
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!activeRoadmap) {
      fetchRoadmap();
    }
  }, [activeRoadmap, setActiveRoadmap]);

  const handleToggleDay = async (weekId, dayId, completed) => {
    if (!activeRoadmap?.roadmap?.id) return;
    try {
      const updated = await arrearsApi.toggleDayCompletion(activeRoadmap.roadmap.id, dayId, completed);
      if (updated?.roadmap) {
        setActiveRoadmap(updated);
      } else {
        // Local state update
        setActiveRoadmap((prev) => {
          if (!prev?.roadmap) return prev;
          const next = { ...prev };
          next.roadmap.weeks = next.roadmap.weeks.map((w) => {
            if (w.id === weekId) {
              const days = w.days.map((d) => (d.id === dayId ? { ...d, completed } : d));
              const done = days.filter((d) => d.completed).length;
              return { ...w, days, progressPercent: Math.round((done / days.length) * 100) };
            }
            return w;
          });
          const all = next.roadmap.weeks.flatMap((w) => w.days);
          next.roadmap.completedDays = all.filter((d) => d.completed).length;
          return next;
        });
      }
      showToast(completed ? 'Milestone marked as complete!' : 'Milestone reopened.');
    } catch (err) {
      console.error('Failed to toggle milestone:', err);
    }
  };

  const roadmapData = activeRoadmap?.roadmap;
  const analysisData = activeRoadmap?.analysis;

  const totalDays = roadmapData?.totalDays || 21;
  const completedDays = roadmapData?.completedDays || 0;
  const overallPercentage = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Summary */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[#A3E635] text-xs font-semibold border border-slate-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Engineered Study Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
              {roadmapData?.subject || 'Data Structures and Algorithms'} Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Calibrated for exam clearance and long-term placement readiness. Follow the daily 2-hour schedule to stay ahead of university examinations.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center">
              <span className="text-2xl font-black text-[#A3E635] block">{overallPercentage}%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Completion</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center">
              <span className="text-2xl font-black text-white block">
                {completedDays} / {totalDays}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Days Cleared</span>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Course Progress</span>
            <span className="text-[#A3E635] font-semibold">{overallPercentage}% Complete</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0F766E] via-teal-400 to-[#A3E635] transition-all duration-500 rounded-full"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week Sections */}
      <div className="space-y-6">
        {roadmapData?.weeks?.map((week) => (
          <WeekSection
            key={week.id}
            week={week}
            onToggleDay={handleToggleDay}
            subject={roadmapData?.subject || ''}
          />
        ))}
      </div>

      {/* Next Milestone CTA Card */}
      <div className="p-6 rounded-2xl bg-[#CCFBF1]/40 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
            Ready to Validate Your Mastery?
          </h3>
          <p className="text-xs text-slate-600">
            Once you complete Week 3, take the Final Arrear Clearance Benchmark Examination to unlock direct Mock Interviews.
          </p>
        </div>
        <Link
          to="/final-assessment"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm flex items-center gap-2 shrink-0 transition-colors"
        >
          <span>Take Final Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RoadmapPage;
