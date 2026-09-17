import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, SEMESTERS } from '../api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const BATCH_YEARS = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    department: '',
    batch: '',
    academicPosition: 'Currently studying',
    currentSemester: '',
    academicStatus: 'Active Arrears',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.collegeName.trim()) {
      setError('Please enter your college name.');
      return;
    }
    if (!formData.department) {
      setError('Please select your department.');
      return;
    }
    if (formData.academicPosition === 'Currently studying' && !formData.currentSemester) {
      setError('Please select your current semester.');
      return;
    }
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!pwdRegex.test(formData.password)) {
      setError(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        collegeName: formData.collegeName.trim(),
        department: formData.department,
        batch: formData.batch,
        academicPosition: formData.academicPosition,
        currentSemester: formData.academicPosition === 'Currently studying' ? formData.currentSemester : null,
        academicStatus: formData.academicStatus,
      };

      const res = await register(payload);

      setSuccessMsg('Account created successfully! Preparing your personalized portal...');

      // Conditional routing based on academic status
      setTimeout(() => {
        if (formData.academicStatus === 'Active Arrears') {
          navigate('/arrear-details');
        } else {
          navigate('/placement-readiness');
        }
      }, 1000);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Header Title */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold">
            <Rocket className="w-3.5 h-3.5" />
            <span>Create Student Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Begin Your Lag-to-Launch Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Tell us about your academic standing so our AI engine can tailor your path.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-card">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F766E] text-xs sm:text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal Information */}
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white text-xs flex items-center justify-center">1</span>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="fullName">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
                    Email ID *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your college or personal email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="confirmPassword">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="collegeName">
                    College Name *
                  </label>
                  <input
                    id="collegeName"
                    name="collegeName"
                    type="text"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college / institution name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Academic Information */}
            <div className="pt-4">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white text-xs flex items-center justify-center">2</span>
                Academic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="department">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                  >
                    <option value="">-- Select Your Department --</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="batch">
                    Expected Year of Graduation
                  </label>
                  <select
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                  >
                    <option value="">-- Select Graduation Year --</option>
                    {BATCH_YEARS.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Academic Position *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.academicPosition === 'Currently studying'
                          ? 'border-[#0F766E] bg-[#CCFBF1]/30 font-medium'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="academicPosition"
                        value="Currently studying"
                        checked={formData.academicPosition === 'Currently studying'}
                        onChange={handleChange}
                        className="text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span className="text-xs text-slate-800 font-medium">Currently studying</span>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.academicPosition === 'Degree completed, arrears pending'
                          ? 'border-[#0F766E] bg-[#CCFBF1]/30 font-medium'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="academicPosition"
                        value="Degree completed, arrears pending"
                        checked={formData.academicPosition === 'Degree completed, arrears pending'}
                        onChange={handleChange}
                        className="text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span className="text-xs text-slate-800 font-medium">Degree completed, arrears pending</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Semester Selector */}
                {formData.academicPosition === 'Currently studying' && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="currentSemester">
                      Current Semester
                    </label>
                    <select
                      id="currentSemester"
                      name="currentSemester"
                      value={formData.currentSemester}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all"
                    >
                      <option value="">-- Select Current Semester --</option>
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Academic Status Selector */}
                <div className="sm:col-span-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Academic Status *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'Active Arrears', label: 'Active Arrear', desc: 'Need recovery roadmap & subject study plan' },
                      { id: 'No Arrears', label: 'No Arrear', desc: 'Direct skill training & placement testing' },
                    ].map((status) => (
                      <label
                        key={status.id}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          formData.academicStatus === status.id
                            ? 'border-[#0F766E] bg-[#CCFBF1]/40 ring-1 ring-[#0F766E]'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name="academicStatus"
                            value={status.id}
                            checked={formData.academicStatus === status.id}
                            onChange={handleChange}
                            className="text-[#0F766E] focus:ring-[#0F766E]"
                          />
                          <span className="text-xs font-bold text-[#0F172A]">{status.label}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 pl-5">{status.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.99] shadow-card transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#0F766E] hover:underline">
                Sign In here
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
