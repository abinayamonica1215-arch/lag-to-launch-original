import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Loader2,
  Filter,
} from 'lucide-react';
import { careersApi } from '../api';
import { useApp } from '../context/AppContext';

export const CareerPage = () => {
  const { showToast } = useApp();
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const [opps, sum] = await Promise.all([
          careersApi.getOpportunities(),
          careersApi.getPlacementSummary(),
        ]);
        setOpportunities(opps);
        setSummary(sum);
      } catch (err) {
        console.error('Failed to load career listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    try {
      const res = await careersApi.applyJob(jobId);
      setOpportunities((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, applied: true, status: 'Applied' } : j
        )
      );
      showToast(res.message || 'Application successfully submitted!');
    } catch (err) {
      console.error('Failed to apply:', err);
      alert('Application failed. Please try again.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredOpps = opportunities.filter((j) => {
    if (filterType === 'applied') return j.applied;
    if (filterType === 'open') return !j.applied;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F766E] mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading Verified Job Openings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. Placement Readiness Index Banner */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[#A3E635] text-xs font-bold border border-slate-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus & Off-Campus Hiring Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
              Career & Placement Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Verified corporate hiring partners with transparent arrear-tolerance policies. Your certified Lag-to-Launch score qualifies you for direct recruitment rounds.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center gap-6 shrink-0">
            <div>
              <span className="text-3xl font-black text-[#A3E635] block">
                {summary?.careerReadinessScore || 88}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Launch Score Index
              </span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div>
              <span className="text-xl font-bold text-white block">
                {summary?.offersReceived || 1} Offer
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Extended
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[#0F766E] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Openings ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterType('open')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'open'
                ? 'bg-[#0F766E] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Open to Apply
          </button>
          <button
            onClick={() => setFilterType('applied')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'applied'
                ? 'bg-[#0F766E] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            My Applications ({opportunities.filter((j) => j.applied).length})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredOpps.length} verified listings
        </span>
      </div>

      {/* 3. Opportunities List */}
      <div className="space-y-4">
        {filteredOpps.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0F172A] font-extrabold flex items-center justify-center text-sm shrink-0 border border-slate-200">
                  {job.logoText}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#0F172A]">{job.title}</h2>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        job.status === 'Offer Extended'
                          ? 'bg-emerald-50 text-[#0F766E] border border-emerald-200'
                          : job.status === 'Interview Scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : job.status === 'Applied'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="font-semibold text-slate-700">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-[#0F766E]">{job.salaryPackage}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                {job.applied ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                      <span>{job.status}</span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={applyingJobId === job.id}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.99] shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {applyingJobId === job.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Applying...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Fast-Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Arrear Policy & Skills Tags */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-700 shrink-0">Arrear Policy:</span>
                <span className="text-slate-600">{job.minArrearPolicy}</span>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="font-bold text-slate-700 shrink-0">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {job.skillsRequired?.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Offer details banner if offer extended */}
            {job.status === 'Offer Extended' && job.offerDetails && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#0F766E] font-bold">
                  <Award className="w-4 h-4" />
                  <span>Official Job Offer Letter Extended</span>
                </div>
                <p className="text-slate-700">
                  Congratulations! Offered Role: <span className="font-semibold text-[#0F172A]">{job.offerDetails.offeredRole}</span> at CTC <span className="font-semibold text-[#0F172A]">{job.offerDetails.ctc}</span>. Target joining: {job.offerDetails.joiningDate}.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPage;
