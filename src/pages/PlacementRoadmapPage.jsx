import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart2,
  BookOpen,
  Flame,
  RefreshCw,
} from 'lucide-react';
import { placementRoadmapApi } from '../api';

// ---------------------------------------------------------------------------
// Priority config — mirrors backend evaluate_priority() thresholds
// ---------------------------------------------------------------------------
const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    badgeClass: 'bg-red-50 text-red-700 border-red-300',
    barClass: 'bg-red-500',
    icon: <Flame className="w-3.5 h-3.5 text-red-600" />,
  },
  medium: {
    label: 'Medium Priority',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
    barClass: 'bg-amber-400',
    icon: <BarChart2 className="w-3.5 h-3.5 text-amber-600" />,
  },
  satisfactory: {
    label: 'Satisfactory',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    barClass: 'bg-[#0F766E]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />,
  },
};

// ---------------------------------------------------------------------------
// Single roadmap item card
// ---------------------------------------------------------------------------
const RoadmapItemCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(true);
  const cfg = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
  const pct = typeof item.current_percentage === 'number' ? item.current_percentage : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
      {/* Card Header */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-bold text-[#0F172A]">{item.category}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badgeClass}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Score pill */}
          <div className="text-right">
            <span className="text-lg font-black text-[#0F172A]">{pct}%</span>
            <p className="text-[10px] text-slate-400 font-semibold">Current Score</p>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-0">
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${cfg.barClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="p-5 pt-4 space-y-4 border-t border-slate-100 mt-3">
          {/* Focus Areas */}
          {item.focus_areas && item.focus_areas.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Focus Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {item.focus_areas.map((fa, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700"
                  >
                    <BookOpen className="w-3 h-3 text-[#0F766E]" />
                    {fa}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action */}
          {item.recommended_action && (
            <div className="p-3 rounded-xl bg-[#F0FDF9] border border-teal-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0F766E]">Recommended Action: </span>
              {item.recommended_action}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export const PlacementRoadmapPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await placementRoadmapApi.getPlacementRoadmap();
        setRoadmapData(data);
      } catch (err) {
        console.error('[PlacementRoadmapPage] Failed to load roadmap:', err);
        setError(err.message || 'Failed to load placement roadmap.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F766E] mx-auto" />
        <p className="text-sm font-semibold text-slate-600">
          Generating your Placement Preparation Roadmap…
        </p>
      </div>
    );
  }

  // ── Hard error (neither backend nor localStorage had data) ─────────────────
  if (error || !roadmapData) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#0F172A]">Roadmap Unavailable</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {error ||
            'No placement assessment result was found. Please complete the Placement Readiness Assessment first.'}
        </p>
        <button
          onClick={() => navigate('/placement-readiness')}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          Take Placement Assessment
        </button>
      </div>
    );
  }

  const { roadmap = [], message, source_percentage, ready, _source } = roadmapData;
  const isLocalFallback = _source === 'local';

  // ── Ready state: no weak areas ─────────────────────────────────────────────
  if (ready || roadmap.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flow 2: Placement Readiness Roadmap</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Placement Preparation Roadmap
            </h1>
          </div>
          <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shrink-0">
            <span className="text-3xl font-black text-[#0F172A]">{source_percentage ?? '—'}%</span>
            <span className="text-xs text-slate-500 font-semibold">Overall Score</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-card text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#0F766E] mx-auto" />
          <h2 className="text-xl font-black text-[#0F172A]">You're Placement Ready!</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => navigate('/mock-interview')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to AI Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/careers')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>View Job Opportunities</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal roadmap with weak areas ─────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flow 2: Placement Readiness Roadmap</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            Placement Preparation Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Focus on the areas below to improve your corporate placement readiness.
          </p>
        </div>

        <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shrink-0">
          <span className="text-3xl font-black text-[#0F172A]">{source_percentage ?? '—'}%</span>
          <span className="text-xs text-slate-500 font-semibold">Overall Score</span>
        </div>
      </div>

      {/* Source note */}
      {isLocalFallback && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span>
            Showing a locally generated roadmap based on your most recent assessment result.
            Connect to the backend for a server-generated roadmap.
          </span>
        </div>
      )}

      {/* Summary message */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="font-bold text-[#0F172A] flex items-center gap-2 mb-1">
          <BarChart2 className="w-4 h-4 text-[#0F766E]" />
          Preparation Summary
        </div>
        <p>{message}</p>
      </div>

      {/* Roadmap items */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Areas to Improve ({roadmap.length})
        </h2>
        {roadmap.map((item, idx) => (
          <RoadmapItemCard key={`${item.category}-${idx}`} item={item} index={idx} />
        ))}
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
        <button
          onClick={() => navigate('/training')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Open Training Modules
        </button>
        <button
          onClick={() => navigate('/placement-readiness')}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Re-take Assessment
        </button>
      </div>
    </div>
  );
};

export default PlacementRoadmapPage;
