import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  ArrowRight,
  ShieldAlert,
  Brain,
  GraduationCap,
  Sparkles,
  MessageSquareCode,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen,
  Target,
  BarChart3,
  Clock,
  Check,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroBackground3D from '../components/common/HeroBackground3D';
import FeatureBackground3D from '../components/common/FeatureBackground3D';
import Feature3DVisual from '../components/common/Feature3DVisual';
import ContinuousBackground3D from '../components/common/ContinuousBackground3D';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#080F1E] flex flex-col selection:bg-teal-900 selection:text-teal-200">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden text-white pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Cinematic Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-700"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/75 to-[#0F172A] pointer-events-none" />

        {/* 3D Depth Neural Network Particle Field */}
        <HeroBackground3D />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-7">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-[#A3E635] shadow-sm">
            <Rocket className="w-3.5 h-3.5" />
            <span>The Student Career-Development Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans max-w-4xl mx-auto leading-tight sm:leading-tight">
            Turn Academic Setbacks into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] via-teal-300 to-white">Career Launches</span>.
          </h1>

          {/* Subtitle - Clean Structured 2 Lines */}
          <div className="max-w-2xl mx-auto space-y-1">
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
              Whether you are overcoming active arrears or accelerating toward corporate placements,
            </p>
            <p className="text-base sm:text-lg text-teal-200 font-medium">
              Lag-to-Launch engineers your personalized AI pathway from where you are to where you belong.
            </p>
          </div>

          {/* Brand Philosophy */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-100 bg-[#0F766E]/40 backdrop-blur-md px-5 py-2 rounded-full border border-teal-500/40 shadow-sm">
              <span>Small Steps</span>
              <span className="text-[#A3E635]">→</span>
              <span>Better Skills</span>
              <span className="text-[#A3E635]">→</span>
              <span>Bigger Opportunities</span>
              <span className="text-[#A3E635]">→</span>
              <span className="text-[#A3E635] font-bold">Launch</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-card transition-all flex items-center justify-center gap-2 text-base group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 text-base"
            >
              <span>Explore The 2 Flows</span>
            </a>
          </div>

          {/* Product Capabilities Highlights */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 space-y-1">
              <div className="text-sm font-bold text-[#A3E635]">Personalized Career Roadmap</div>
              <div className="text-xs text-slate-300 leading-relaxed">
                A guided preparation path based on your academic status and career readiness.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 space-y-1">
              <div className="text-sm font-bold text-white">Subject-Wise Preparation</div>
              <div className="text-xs text-slate-300 leading-relaxed">
                Targeted learning and assessment based on selected subjects and skill gaps.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 space-y-1">
              <div className="text-sm font-bold text-teal-300">AI-Guided Analysis</div>
              <div className="text-xs text-slate-300 leading-relaxed">
                Identify learning gaps and generate a personalized preparation direction.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 space-y-1">
              <div className="text-sm font-bold text-white">Placement Readiness</div>
              <div className="text-xs text-slate-300 leading-relaxed">
                Mock interviews, assessments, exercises, and structured placement preparation.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
        <ContinuousBackground3D variant="hero-transition" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/60">
              The Core Challenge
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why Students Fall Behind
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Academic problems can build up over time. Students may struggle with arrears, skill gaps, lack of preparation, and placement readiness without knowing what to do next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 hover:border-rose-500/40 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-4 font-bold border border-rose-500/25">
                01
              </div>
              <h3 className="font-bold text-white text-base mb-2">Academic Problems</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Arrears and low academic performance can make it harder for students to focus on career preparation.
              </p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 hover:border-amber-500/40 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4 font-bold border border-amber-500/25">
                02
              </div>
              <h3 className="font-bold text-white text-base mb-2">Missing Skills</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students may know the basics but still lack the skills companies expect in technical rounds and interviews.
              </p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 hover:border-sky-500/40 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-4 font-bold border border-sky-500/25">
                03
              </div>
              <h3 className="font-bold text-white text-base mb-2">Not Enough Preparation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Many students do not know what to learn or how to prepare for technical and aptitude rounds before placements.
              </p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 hover:border-indigo-500/40 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-4 font-bold border border-indigo-500/25">
                04
              </div>
              <h3 className="font-bold text-white text-base mb-2">Placement Readiness</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students may be unsure whether they are actually ready for interviews and placement opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
        <ContinuousBackground3D variant="mid" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/60">
                The Solution
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                From Academic Backlogs to Career Placements
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Lag-to-Launch helps students clear university arrears and build real-world job skills. We turn complex subjects into easy daily study plans so you can pass exams and get hired.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Smart Student Analysis</h4>
                    <p className="text-xs text-slate-400">Pinpoints your exact weak topics (like Trees, Graphs, or SQL) so you focus only on what you need.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI-Powered Guidance & Weekly Action Plan</h4>
                    <p className="text-xs text-slate-400">Daily study goals, practice quizzes, and simple milestone tracking designed for your schedule.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Placement Connections</h4>
                    <p className="text-xs text-slate-400">Once your backlogs are cleared, jump straight into mock interviews and direct placement opportunities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card Graphic */}
            <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-elevated relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-[#A3E635]" />
                </div>
                <span className="text-xs font-mono text-slate-400">Roadmap Engine v2.4</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 flex justify-between">
                    <span>Target Subject</span>
                    <span className="text-[#A3E635] font-bold">Data Structures (CSE Sem 3)</span>
                  </div>
                  <div className="text-slate-400 flex justify-between mt-1">
                    <span>Detected Weak Areas</span>
                    <span className="text-teal-300">Trees, Graphs, Recursion</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300 text-xs">
                    <span>Clearance Probability Projection</span>
                    <span className="text-[#A3E635] font-bold">92% Projected</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0F766E] to-[#A3E635] w-[92%]" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0F766E]/20 border border-[#0F766E]/50 text-slate-200">
                  <div className="flex items-center gap-2 text-[#A3E635] font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Placement Portal Fast-Track</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Students achieving 80%+ on Week 3 Benchmark automatically qualify for direct AI Technical Mock Interviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: THE 2 USER FLOWS */}
      <section id="how-it-works" className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
        <ContinuousBackground3D variant="mid" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/60">
              Structured Pathways
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              How Lag-to-Launch Works
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Two distinct, intelligent student flows designed to meet your specific academic standing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FLOW 1: Active Arrears (Recover & Launch) */}
            <div className="bg-slate-800/75 backdrop-blur-md rounded-2xl border-2 border-teal-500/30 p-6 sm:p-8 shadow-xl hover:border-teal-400/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    AR — Track 1
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Remediation Track</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-1">
                  Recover & Launch
                </h3>
                <p className="text-xs font-medium text-teal-300 mb-3">
                  For students with active academic arrears
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  A dual-focus schedule that allocates time for targeted backlog exam clearance while progressively building industry-standard technical skills.
                </p>

                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Step-by-Step Flow:
                </div>

                {/* Step Sequence */}
                <div className="space-y-2.5 font-sans text-xs">
                  {[
                    { step: '1', title: 'Arrear Identified', desc: 'Initial standing' },
                    { step: '2', title: 'Find Your Weak Subject', desc: 'Identify syllabus gaps' },
                    { step: '3', title: 'Create Recovery Plan', desc: 'Set up study strategy' },
                    { step: '4', title: 'Weekly Study Plan', desc: 'Daily 2-hour study blocks' },
                    { step: '5', title: 'Clear the Arrear', desc: 'Pass university exam' },
                    { step: '6', title: 'Build Job Skills', desc: 'Core technical stack' },
                    { step: '7', title: 'Prepare for Placement', desc: 'Aptitude & mock rounds' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-700/60 border border-slate-600/50">
                      <div className="w-5 h-5 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <span className="font-bold text-white">{item.title}</span>
                        <span className="text-[11px] text-slate-400"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/60 mt-6">
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-center flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <span>Begin Recover & Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* FLOW 2: Cleared / Skill Gap (Skill Up & Launch) */}
            <div className="bg-slate-800/75 backdrop-blur-md rounded-2xl border-2 border-slate-600/50 p-6 sm:p-8 shadow-xl hover:border-[#A3E635]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    SL — Track 2
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Fast-Track</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-1">
                  Skill Up & Launch
                </h3>
                <p className="text-xs font-medium text-teal-300 mb-3">
                  For students who have cleared arrears with skill gaps
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  An accelerated curriculum focused strictly on closing technical stack gaps, competitive coding, and mock rounds to match target company profiles.
                </p>

                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Step-by-Step Flow:
                </div>

                {/* Step Sequence */}
                <div className="space-y-3 font-sans text-xs">
                  {[
                    { step: '1', title: 'Academically Ready', desc: 'Starting point' },
                    { step: '2', title: 'Study Gap Analysis', desc: 'Identify skill & knowledge gaps' },
                    { step: '3', title: 'Personalized Learning', desc: 'Learn Key Skills' },
                    { step: '4', title: 'Career Preparation', desc: 'Resume & project polish' },
                    { step: '5', title: 'Placement Preparation', desc: 'Mock interview simulations' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-700/60 border border-slate-600/50">
                      <div className="w-5 h-5 rounded-full bg-slate-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <span className="font-bold text-white">{item.title}</span>
                        <span className="text-[11px] text-slate-400"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/60 mt-6">
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-bold text-center flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <span>Begin Skill Up & Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTEGRATED PLATFORM MODULES */}
      <section id="features" className="relative overflow-hidden bg-slate-900/90 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <FeatureBackground3D />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A3E635] bg-slate-800/80 px-3.5 py-1 rounded-full border border-slate-700 shadow-sm">
              Integrated Platform Modules
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Everything Students Need to Become Placement-Ready
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Essential tools that combine academic turnaround and modern industry hiring preparation in a single continuous system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldAlert,
                title: '1. Academic Recovery & Analysis',
                desc: 'Identify weak subjects and stay focused on recovery with organized exam schedules, academic analysis, and targeted question banks.',
                visualType: 'academic',
              },
              {
                icon: BarChart3,
                title: '2. Skill Gap Identification',
                desc: 'Understand which technical and career skills need improvement against actual hiring criteria for top tech companies.',
                visualType: 'skill-gap',
              },
              {
                icon: BookOpen,
                title: '3. Structured Pathways & Learning',
                desc: 'Follow a connected learning journey based on individual needs, balancing study hours between backlogs and technical stacks.',
                visualType: 'pathway',
              },
              {
                icon: MessageSquareCode,
                title: '4. Code Challenges & Assessments',
                desc: 'Build aptitude, coding, communication and placement readiness through timed category-specific challenges and simulation tests.',
                visualType: 'code',
              },
              {
                icon: Clock,
                title: '5. Placement Readiness Tracking',
                desc: 'Track learning progress and placement readiness in one place with visible scorecards, training plans, and weekly recovery velocity.',
                visualType: 'progress',
              },
              {
                icon: Award,
                title: '6. Employability Profile & Opportunities',
                desc: 'Bring academics, skills, certifications and readiness together to showcase your genuine competency to career opportunities.',
                visualType: 'employability',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-800/80 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-xl hover:border-teal-400/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <div className="w-24 h-24 -mr-2 -mt-2">
                        <Feature3DVisual type={f.visualType} />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">{f.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CAREER & HIRING PARTNERS SECTION */}
      <section id="careers" className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
        <ContinuousBackground3D variant="dark" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-white border border-slate-700/60 shadow-elevated">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A3E635] bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  Placement & Jobs
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Your Academic Past Doesn't Define Your Future
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Leading technology companies care about problem-solving capability, continuous improvement, and grit. Our hiring partners actively look for students who have turned setbacks into comebacks.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    Software Engineering (₹6–8.5 LPA)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    Cloud & Trainee Roles
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    Data & BI Analyst
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-sm text-white">Recent Placement Offers</div>
                  <span className="text-xs text-[#A3E635]">Verified</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Associate Software Engineer</div>
                      <div className="text-slate-400">CognitiveScale • ₹7.2 LPA</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                      Offer Extended
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Junior React Developer</div>
                      <div className="text-slate-400">Veloce Labs • ₹6.0 LPA</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-[11px]">
                      Interview Round 2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-center">
        <ContinuousBackground3D variant="cta" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Ready to Take the First Step?
          </h2>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Create your profile now. Get an immediate arrear recovery roadmap or take your diagnostic placement readiness evaluation in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-card transition-all text-base"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl font-semibold text-white bg-teal-900/40 hover:bg-teal-900/60 border border-teal-300/30 transition-all text-base"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

