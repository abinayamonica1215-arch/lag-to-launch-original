import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  PlayCircle,
  Code2,
  FileText,
  Clock,
  Flame,
  Award,
  Calendar,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { trainingApi } from '../api';
import { useApp } from '../context/AppContext';

export const TrainingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [modules, setModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState('');
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);

  useEffect(() => {
    const loadTrainingData = async () => {
      try {
        const [modList, attData] = await Promise.all([
          trainingApi.getModules(),
          trainingApi.getAttendance(),
        ]);
        setModules(modList);
        if (modList.length > 0) {
          setActiveModuleId(modList[0].id);
        }
        setAttendance(attData);
      } catch (err) {
        console.error('Failed to load training data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTrainingData();
  }, []);

  const handleToggleTopic = async (moduleId, topicId, completed) => {
    try {
      await trainingApi.updateTopicProgress(moduleId, topicId, completed);
      setModules((prev) =>
        prev.map((m) => {
          if (m.id === moduleId) {
            const topics = m.topics.map((t) => (t.id === topicId ? { ...t, completed } : t));
            const done = topics.filter((t) => t.completed).length;
            return {
              ...m,
              topics,
              completedTopics: done,
              progressPercent: Math.round((done / topics.length) * 100),
            };
          }
          return m;
        })
      );
      showToast(completed ? 'Topic marked complete!' : 'Topic marked incomplete.');
    } catch (err) {
      console.error('Failed to toggle topic:', err);
    }
  };

  const handleMarkAttendance = async () => {
    setMarkingAttendance(true);
    try {
      const res = await trainingApi.markAttendance();
      setAttendance(res.data);
      showToast('Daily attendance recorded! Streak updated.');
    } catch (err) {
      console.error('Failed to mark attendance:', err);
    } finally {
      setMarkingAttendance(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F766E] mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading Training Modules & Attendance...</p>
      </div>
    );
  }

  const currentModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. Header with Daily Attendance Check-In Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Structured Technical Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            Skill Development & Placement Training
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            High-yield modules bridging theoretical academic syllabi and industrial placement requirements. Track your daily attendance and topic mastery.
          </p>
        </div>

        {/* Attendance & Streak Tracker Widget */}
        <div className="bg-[#0F172A] rounded-2xl p-6 text-white border border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Study Attendance
            </span>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>{attendance?.currentStreak || 12} Day Streak</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{attendance?.attendancePercentage || 92}%</span>
            <span className="text-xs text-slate-400">Monthly Attendance Rate</span>
          </div>

          {attendance?.todayMarked ? (
            <div className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Checked in for today!</span>
            </div>
          ) : (
            <button
              onClick={handleMarkAttendance}
              disabled={markingAttendance}
              className="w-full py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>{markingAttendance ? 'Recording...' : 'Mark Today’s Attendance'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Training Modules Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Selector Sidebar */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Available Modules ({modules.length})
          </h2>

          <div className="space-y-2">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModuleId(m.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  m.id === activeModuleId
                    ? 'border-[#0F766E] bg-white shadow-card ring-1 ring-[#0F766E]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {m.category}
                  </span>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {m.progressPercent}%
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug line-clamp-2">
                  {m.title}
                </h3>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 font-medium">
                  <span>{m.completedTopics} of {m.totalTopics} Topics</span>
                  <span>{m.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Module Detail View */}
        <div className="lg:col-span-2 space-y-6">
          {currentModule && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
              {/* Module Header */}
              <div className="pb-6 border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E]">
                    {currentModule.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Instructor: <span className="text-slate-800 font-semibold">{currentModule.instructor}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  {currentModule.title}
                </h2>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Mastery Progress</span>
                    <span className="text-[#0F766E]">{currentModule.progressPercent}% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#0F766E] transition-all duration-500"
                      style={{ width: `${currentModule.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Curriculum Topics ({currentModule.topics?.length})
                </h3>

                <div className="divide-y divide-slate-100">
                  {currentModule.topics?.map((topic) => (
                    <div
                      key={topic.id}
                      className={`py-3.5 px-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                        topic.completed ? 'bg-emerald-50/20' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTopic(currentModule.id, topic.id, !topic.completed)}
                          className="text-slate-300 hover:text-[#0F766E] transition-colors shrink-0"
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#0F766E] fill-teal-50" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                        <div className="space-y-0.5">
                          <span
                            className={`text-xs sm:text-sm font-semibold block ${
                              topic.completed ? 'line-through text-slate-400' : 'text-[#0F172A]'
                            }`}
                          >
                            {topic.title}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {topic.type} • {topic.duration}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTopic(currentModule.id, topic.id, !topic.completed)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                            topic.completed
                              ? 'border-emerald-200 text-[#0F766E] bg-emerald-50'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {topic.completed ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Assessment Card Link */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Finished this module's topics?</span>
                  <span className="text-slate-500">Take the Final Clearance Assessment or practice in AI Mock Interviews.</span>
                </div>
                <Link
                  to="/final-assessment"
                  className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Final Test
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
