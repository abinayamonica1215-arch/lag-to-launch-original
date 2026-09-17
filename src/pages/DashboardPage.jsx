import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Rocket,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  MessageSquareCode,
  Briefcase,
  Flame,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { careersApi, trainingApi } from '../api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { activeRoadmap } = useApp();
  const navigate = useNavigate();

  const [careerSummary, setCareerSummary] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [careerRes, attRes] = await Promise.all([
          careersApi.getPlacementSummary(),
          trainingApi.getAttendance(),
        ]);
        setCareerSummary(careerRes);
        setAttendance(attRes);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const isArrearTrack = user?.academicStatus === 'Active Arrears';
  const score = careerSummary?.careerReadinessScore || 85;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* 1. WELCOME / STUDENT OVERVIEW BANNER */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F766E] rounded-2xl p-6 sm:p-8 text-white shadow-elevated border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#A3E635] border border-white/10">
              <Rocket className="w-3.5 h-3.5" />
              <span>Lag-to-Launch Student Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {user?.fullName || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              {isArrearTrack
                ? `You are on Track 1: Backlog Remediation${user?.department ? ` for ${user.department}` : ''}. Stay disciplined with your daily 2-hour milestones to secure exam clearance.`
                : `You are on Track 2: Direct Placement Acceleration${user?.department ? ` for ${user.department}` : ''}. Practice mock interviews and apply to partner hiring drives.`}
            </p>
          </div>

          {/* Quick Action Button based on Track */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            {isArrearTrack ? (
              <Link
                to="/roadmap"
                className="px-5 py-3 rounded-xl font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] transition-all shadow-card flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <span>Continue AI Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/mock-interview"
                className="px-5 py-3 rounded-xl font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] transition-all shadow-card flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <span>Launch Mock Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 1.5 CONDITIONAL RECOVERY / ACCELERATION PATHWAY */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-[#0F766E] uppercase tracking-wider">
              {isArrearTrack ? 'Path 1 — Active Arrear Recovery' : 'Path 2 — Cleared Arrear Acceleration'}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
              {isArrearTrack ? 'Your Active Arrear Recovery Journey' : 'Your Placement Readiness Pathway'}
            </h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${isArrearTrack ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-[#CCFBF1] text-[#0F766E] border border-teal-200'}`}>
            {isArrearTrack ? 'Active Arrear Track' : 'Cleared / Skill-Up Track'}
          </span>
        </div>

        {/* Step Sequence Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 pt-1">
          {isArrearTrack ? (
            [
              { step: '1', title: 'Arrear Identified', active: true, desc: 'Problem' },
              { step: '2', title: 'Find Your Weak Subject', active: true, desc: 'Understand' },
              { step: '3', title: 'Create Recovery Plan', active: false, desc: 'Plan' },
              { step: '4', title: 'Weekly Study Plan', active: false, desc: 'Study' },
              { step: '5', title: 'Clear the Arrear', active: false, desc: 'Clear Arrear' },
              { step: '6', title: 'Build Job Skills', active: false, desc: 'Build Skills' },
              { step: '7', title: 'Prepare for Placement', active: false, desc: 'Prepare' },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-3 rounded-xl border text-left transition-all ${
                  item.active
                    ? 'bg-[#CCFBF1]/40 border-[#0F766E] shadow-sm'
                    : 'bg-slate-50 border-slate-100 opacity-75'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${item.active ? 'bg-[#0F766E] text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.desc}</span>
                </div>
                <div className="text-xs font-bold text-[#0F172A] leading-snug">{item.title}</div>
              </div>
            ))
          ) : (
            [
              { step: '1', title: 'Academically Ready', active: true, desc: 'Starting Point' },
              { step: '2', title: 'Study Gap Analysis', active: true, desc: 'Identify Gaps' },
              { step: '3', title: 'Personalized Learning', active: false, desc: 'Learn Key Skills' },
              { step: '4', title: 'Career Preparation', active: false, desc: 'Resume & Projects' },
              { step: '5', title: 'Placement Preparation', active: false, desc: 'Mock Rounds' },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-3 rounded-xl border text-left transition-all sm:col-span-1 lg:col-span-1 ${
                  item.active
                    ? 'bg-[#CCFBF1]/40 border-[#0F766E] shadow-sm'
                    : 'bg-slate-50 border-slate-100 opacity-75'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${item.active ? 'bg-[#0F172A] text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.desc}</span>
                </div>
                <div className="text-xs font-bold text-[#0F172A] leading-snug">{item.title}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. CORE METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Readiness Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Career Readiness
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F172A]">{score}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
              <span className="text-xs font-bold text-[#0F766E] ml-auto">+4% this week</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#0F766E]" style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>

        {/* Metric 2: Academic Standing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Academic Status
            </span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isArrearTrack ? 'bg-amber-50 text-amber-600' : 'bg-[#CCFBF1] text-[#0F766E]'}`}>
              {isArrearTrack ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-base font-extrabold text-[#0F172A] block truncate">
              {user?.academicStatus || 'Active Arrears'}
            </span>
            <span className="text-xs text-slate-500 block truncate">
              {user?.department ? `${user.department}${user.batch ? ` • ${user.batch}` : ''}` : 'Department Not Specified'}
            </span>
          </div>
        </div>

        {/* Metric 3: Consistency Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Streak
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F172A]">{attendance?.currentStreak || 12}</span>
              <span className="text-xs text-slate-400 font-semibold">Days Active</span>
            </div>
            <span className="text-xs text-slate-500 block">Attendance: {attendance?.attendancePercentage || 92}%</span>
          </div>
        </div>

        {/* Metric 4: Placement Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Drives
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F172A]">
                {careerSummary?.applicationsSubmitted || 2}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Applied</span>
              <span className="text-xs font-bold text-[#0F766E] ml-auto">1 Offer</span>
            </div>
            <span className="text-xs text-slate-500 block">1 Interview Scheduled</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Active Roadmap & Training Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Roadmap Snapshot */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A]">Current AI Roadmap Progress</h2>
                  <p className="text-xs text-slate-500">
                    {activeRoadmap?.roadmap?.subject || 'Data Structures and Algorithms'}
                  </p>
                </div>
              </div>
              <Link
                to="/roadmap"
                className="text-xs font-bold text-[#0F766E] hover:text-[#115E59] flex items-center gap-1"
              >
                <span>View Full Roadmap</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4 space-y-3">
              {activeRoadmap?.roadmap?.weeks?.[0]?.days?.slice(0, 3).map((day) => (
                <div
                  key={day.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-teal-100 text-[#0F766E] font-bold flex items-center justify-center text-[10px]">
                      D{day.dayNumber}
                    </span>
                    <span className="font-semibold text-slate-800">{day.title}</span>
                  </div>
                  <span className="text-slate-400 font-medium">{day.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Training & Modules Progress */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">Training Modules</h2>
                <p className="text-xs text-slate-500">Skill development curriculum</p>
              </div>
              <Link
                to="/training"
                className="text-xs font-bold text-[#0F766E] hover:text-[#115E59] flex items-center gap-1"
              >
                <span>All Modules</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Data Structures & Algorithmic Thinking</span>
                  <span className="text-[#0F766E]">62% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0F766E]" style={{ width: '62%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>System Design & OS Fundamentals</span>
                  <span className="text-[#0F766E]">50% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0F766E]" style={{ width: '50%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Placement Quantitative Aptitude</span>
                  <span className="text-[#0F766E]">33% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0F766E]" style={{ width: '33%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Actions, Assessments, Badges */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/arrear-details"
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-[#CCFBF1]/30 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Update Arrear Parameters</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/placement-readiness"
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-[#CCFBF1]/30 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F766E]" />
                  <span>Diagnostic Readiness Test</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/mock-interview"
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-[#CCFBF1]/30 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquareCode className="w-4 h-4 text-indigo-600" />
                  <span>AI Mock Interview Simulator</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/careers"
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-[#CCFBF1]/30 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Explore Job Drives</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earned Badges</h2>
              <Award className="w-4 h-4 text-[#A3E635]" />
            </div>

            <div className="space-y-3">
              {careerSummary?.badges?.map((badge) => (
                <div key={badge.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">{badge.name}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
