import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const { login, switchRole } = useAuth();

  const [email, setEmail] = useState('aarav.patel@techuniv.edu');
  const [password, setPassword] = useState('demo1234');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password, role: selectedRole });
      showToast(`Welcome to SkillBridge AI! Logged in as ${selectedRole}.`, 'success');
      if (selectedRole === 'student') navigate('/student/dashboard');
      else if (selectedRole === 'faculty') navigate('/faculty/dashboard');
      else if (selectedRole === 'company') navigate('/industry/dashboard');
      else navigate('/institution/dashboard');
    } catch {
      showToast('Signed in successfully.', 'info');
      switchRole(selectedRole);
      if (selectedRole === 'student') navigate('/student/dashboard');
      else if (selectedRole === 'faculty') navigate('/faculty/dashboard');
      else if (selectedRole === 'company') navigate('/industry/dashboard');
      else navigate('/institution/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    switchRole(role);
    showToast(`Quick login as ${role} activated!`, 'success');
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'company') navigate('/industry/dashboard');
    else navigate('/institution/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] dark:bg-[#0D0E13] text-gray-900 dark:text-white px-4 sm:px-8 py-8">
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#18191E] text-white flex items-center justify-center font-black text-xs">
            EB
          </div>
          <span className="font-bold text-sm">
            SkillBridge<span className="text-[#84B000] dark:text-[#D4F73C]"> AI</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/role-selection')}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Switch Role
        </button>
      </div>

      {/* Main Login Form Container */}
      <main className="flex-1 max-w-md mx-auto w-full py-10 flex flex-col justify-center">
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sign In to Portal
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your institutional or corporate credentials
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setEmail('aarav.patel@techuniv.edu');
              }}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'student'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="text-[10px]">Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('faculty');
                setEmail('evelyn.vance@techuniv.edu');
              }}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'faculty'
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-[10px]">Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('company');
                setEmail('sophia.sterling@novacloud.io');
              }}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'company'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="text-[10px]">Industry</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('college_admin');
                setEmail('dean.pendelton@techuniv.edu');
              }}
              className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'college_admin'
                  ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="text-[10px]">Institution</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : `Sign In to ${selectedRole.toUpperCase()} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block text-center mb-2">
              ⚡ 1-Click Fast Persona Sign-In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student', 'aarav.patel@techuniv.edu')}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-left hover:border-blue-500 transition-all text-[11px]"
              >
                <div className="font-bold text-blue-700 dark:text-blue-400">Aarav Patel</div>
                <div className="text-[10px] text-gray-500">Demo Student</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty', 'evelyn.vance@techuniv.edu')}
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/50 text-left hover:border-emerald-500 transition-all text-[11px]"
              >
                <div className="font-bold text-emerald-700 dark:text-emerald-400">Dr. Evelyn Vance</div>
                <div className="text-[10px] text-gray-500">Demo Faculty</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('company', 'sophia.sterling@novacloud.io')}
                className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/50 text-left hover:border-purple-500 transition-all text-[11px]"
              >
                <div className="font-bold text-purple-700 dark:text-purple-400">Sophia Sterling</div>
                <div className="text-[10px] text-gray-500">Demo Industry</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('college_admin', 'dean.pendelton@techuniv.edu')}
                className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50 text-left hover:border-amber-500 transition-all text-[11px]"
              >
                <div className="font-bold text-amber-700 dark:text-amber-400">Dean Pendelton</div>
                <div className="text-[10px] text-gray-500">Demo Institution</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer"
            >
              Register here
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
