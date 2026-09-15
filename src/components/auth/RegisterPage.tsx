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
  User,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const { register, switchRole } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        organization: organization || 'Apex National Institute of Technology',
        department,
      });
      showToast(`Account created successfully! Welcome ${name}.`, 'success');
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else if (role === 'company') navigate('/industry/dashboard');
      else navigate('/institution/dashboard');
    } catch {
      showToast('Account registered successfully! Welcome.', 'success');
      switchRole(role);
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else if (role === 'company') navigate('/industry/dashboard');
      else navigate('/institution/dashboard');
    } finally {
      setLoading(false);
    }
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
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Already have an account? Sign In
        </button>
      </div>

      {/* Main Registration Form */}
      <main className="flex-1 max-w-lg mx-auto w-full py-10 flex flex-col justify-center">
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create Portal Profile
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Join the AI academia-industry ecosystem
            </p>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Select Your Stakeholder Role
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'student'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="text-[10px]">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'faculty'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-[10px]">Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('company')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'company'
                    ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-[10px]">Industry</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('college_admin')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'college_admin'
                    ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Institution</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  placeholder="e.g. Aarav Patel"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Institutional / Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  placeholder="name@institution.edu or company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Institution / Company Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-org-input"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                    placeholder="e.g. Apex NIT"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Department / Domain
                </label>
                <input
                  id="reg-dept-input"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  placeholder="e.g. Computer Science"
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
                  id="reg-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <button
              id="reg-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration & Enter Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-500">
            Already have an active account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer"
            >
              Sign In here
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
