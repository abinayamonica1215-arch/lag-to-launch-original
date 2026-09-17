import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Student Career Platform
              </span>
              <h1 className="text-sm font-bold text-[#0F172A] hidden sm:block">
                Lag-to-Launch Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#CCFBF1] text-[#0F766E] border border-teal-200">
              {user?.academicStatus === 'Active Arrears' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Track: Arrear Remediation</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                  <span>Track: Placement Acceleration</span>
                </>
              )}
            </div>

            {/* Notifications button */}
            <button
              onClick={() => alert('All caught up! Weekly roadmap milestone assessment is pending.')}
              className="p-2 rounded-lg text-slate-600 hover:text-[#0F766E] hover:bg-slate-100 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A3E635] ring-2 ring-white" />
            </button>

            {/* Profile Avatar / Name */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-[#0F172A] leading-tight">
                  {user?.fullName || 'Student'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {user?.department || 'Not Specified'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
