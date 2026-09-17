import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, GraduationCap, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white font-sans">
                Lag<span className="text-[#A3E635]">-to-</span>Launch
              </span>
            </Link>
            <p className="text-slate-300 font-medium">
              Small Steps → Better Skills → Bigger Opportunities → Launch
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Lag-to-Launch is a dedicated career development platform bridging the gap for students facing academic arrears and accelerating cleared students toward premium placement opportunities.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#A3E635]" />
                Arrear Recovery Track
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                Direct Placement Track
              </span>
            </div>
          </div>

          {/* Column 2: Platform Journeys */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              Student Journeys
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/register" className="hover:text-[#A3E635] transition-colors flex items-center gap-1">
                  Active Arrears Flow
                </Link>
              </li>
              <li>
                <Link to="/placement-readiness" className="hover:text-[#A3E635] transition-colors">
                  Placement Readiness Test
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-[#A3E635] transition-colors">
                  AI Personalized Roadmap
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-[#A3E635] transition-colors">
                  Skill Training & Attendance
                </Link>
              </li>
              <li>
                <Link to="/mock-interview" className="hover:text-[#A3E635] transition-colors">
                  AI Mock Technical Interview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Opportunities */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              Careers & Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/careers" className="hover:text-[#A3E635] transition-colors">
                  Verified Job Openings
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Recruiter Arrear-Tolerance Policies</span>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#A3E635] transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#A3E635] transition-colors">
                  New Student Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Lag-to-Launch Career Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>FastAPI + MongoDB Ready</span>
            <span>WCAG 2.1 Accessible</span>
            <span>EdTech & Placement Accelerator</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
