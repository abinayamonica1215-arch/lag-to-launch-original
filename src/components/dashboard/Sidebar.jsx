import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Map,
  GraduationCap,
  Sparkles,
  MessageSquareCode,
  Briefcase,
  Award,
  LogOut,
  X,
  Rocket,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Arrear Analysis', path: '/arrear-details', icon: FileSpreadsheet, highlight: user?.academicStatus === 'Active Arrears' },
    { name: 'AI Study Roadmap', path: '/roadmap', icon: Map },
    { name: 'Training & Modules', path: '/training', icon: GraduationCap },
    { name: 'Placement Readiness', path: '/placement-readiness', icon: Sparkles, highlight: user?.academicStatus !== 'Active Arrears' },
    { name: 'Mock Interview', path: '/mock-interview', icon: MessageSquareCode },
    { name: 'Career & Jobs', path: '/careers', icon: Briefcase },
    { name: 'Final Clearance', path: '/final-assessment', icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0F172A] border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Lag<span className="text-[#A3E635]">-to-</span>Launch
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Card Mini */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Current Status
            </span>
            {user?.academicStatus === 'Active Arrears' ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                Active Arrears
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F766E]/30 text-[#A3E635] border border-[#0F766E]/50 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {user?.academicStatus || 'Placement Track'}
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-white truncate">
            {user?.fullName || 'Student'}
          </div>
          <div className="text-xs text-slate-400 truncate">
            {user?.department ? `${user.department}${user.batch ? ` • ${user.batch}` : ''}` : 'Not Specified'}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0F766E] text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
