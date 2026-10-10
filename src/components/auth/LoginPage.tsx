import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const { login, forgotPassword, switchRole } = useAuth();

  // Mode: standard login or forgot password
  const [view, setView] = useState<'login' | 'forgot-password'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Forgot password form fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Validation & Error Handling
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Separate Demo Mode state
  const [showDemoMode, setShowDemoMode] = useState(false);

  // Dynamic portal configurations (strictly 3 roles)
  const rolePortals: Record<
    'student' | 'company' | 'college_admin',
    {
      label: string;
      portalName: string;
      route: string;
      placeholder: string;
      icon: React.ReactNode;
      accentBg: string;
      accentText: string;
    }
  > = {
    student: {
      label: 'Student',
      portalName: 'Student Portal',
      route: '/student/dashboard',
      placeholder: 'student@university.edu',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      accentBg: 'bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/30',
      accentText: 'text-blue-600 dark:text-blue-400',
    },
    company: {
      label: 'Recruiter',
      portalName: 'Recruiter Portal',
      route: '/industry/dashboard',
      placeholder: 'recruiter@company.com',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      accentBg: 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/30',
      accentText: 'text-purple-600 dark:text-purple-400',
    },
    college_admin: {
      label: 'Placement Cell',
      portalName: 'Placement Cell Portal',
      route: '/institution/dashboard',
      placeholder: 'placement@university.edu',
      icon: <Building2 className="w-3.5 h-3.5" />,
      accentBg: 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30',
      accentText: 'text-amber-600 dark:text-amber-400',
    },
  };

  const currentPortal =
    rolePortals[selectedRole as 'student' | 'company' | 'college_admin'] ||
    rolePortals.student;

  // Validation helper
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setErrorMsg(null);
    setFieldErrors({});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password, role: selectedRole });
      showToast(`Welcome! Signed in to ${currentPortal.portalName}.`, 'success');
      navigate(currentPortal.route);
    } catch (err: any) {
      const message =
        err?.message ||
        'Authentication failed. Please verify your credentials and try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your email address to reset password.');
      return;
    }
    if (!emailRegex.test(forgotEmail.trim())) {
      setErrorMsg('Please enter a valid email address format.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email: forgotEmail.trim() });
      setForgotSubmitted(true);
      showToast('Password recovery instructions dispatched to your email.', 'success');
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Unable to process reset request. Please check email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Separate Demo Mode Quick Sign-In (strictly 3 placement roles)
  const handleDemoSignIn = async (
    role: 'student' | 'company' | 'college_admin',
    demoEmail: string
  ) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('demo1234');
    setErrorMsg(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await login({ email: demoEmail, password: 'demo1234', role });
      switchRole(role);
      showToast(`Demo sign-in: Entering ${rolePortals[role].portalName}`, 'success');
      navigate(rolePortals[role].route);
    } catch {
      switchRole(role);
      showToast(`Demo sign-in: Entering ${rolePortals[role].portalName}`, 'success');
      navigate(rolePortals[role].route);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] dark:bg-[#0D0E13] text-gray-900 dark:text-white px-4 sm:px-8 py-8 font-sans selection:bg-[#D4F73C] selection:text-black">
      {/* Top Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#18191E] text-white flex items-center justify-center font-black text-xs shadow-md ring-1 ring-white/10">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#D4F73C] to-emerald-400 flex items-center justify-center text-[#111216] font-black text-[10px]">
              SB
            </div>
          </div>
          <div className="text-left">
            <div className="font-bold text-sm tracking-tight text-gray-900 dark:text-white leading-tight">
              SkillBridge<span className="text-[#84B000] dark:text-[#D4F73C]"> AI</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
              AI-Powered Campus Placement Management
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/role-selection')}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Switch Role
        </button>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 max-w-md mx-auto w-full py-8 sm:py-12 flex flex-col justify-center">
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {view === 'login' ? 'Sign In' : 'Reset Password'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {view === 'login'
                ? 'Sign in to your SkillBridge AI account'
                : 'Enter your email to receive password recovery instructions'}
            </p>
          </div>

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot-password' ? (
            <div className="space-y-4">
              {forgotSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Recovery Link Dispatched</span>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] leading-relaxed">
                    If an account is associated with <strong>{forgotEmail}</strong>, password reset instructions have been sent. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setForgotSubmitted(false);
                      setForgotEmail('');
                    }}
                    className="w-full mt-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          setErrorMsg(null);
                        }}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        placeholder="name@university.edu"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Processing...' : 'Send Recovery Link'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setErrorMsg(null);
                      }}
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* VIEW: STANDARD LOGIN */
            <div className="space-y-5">
              {/* Exactly 3 Roles: Student | Recruiter | Placement Cell */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-bold">
                  {(['student', 'company', 'college_admin'] as const).map((r) => {
                    const cfg = rolePortals[r];
                    const isSelected = selectedRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <span className={isSelected ? cfg.accentText : 'text-gray-400'}>
                          {cfg.icon}
                        </span>
                        <span className="text-[11px] font-bold">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                {/* Email Field */}
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }
                        setErrorMsg(null);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C] transition-all ${
                        fieldErrors.email
                          ? 'border-rose-500 ring-1 ring-rose-500/20'
                          : 'border-gray-300 dark:border-white/10'
                      }`}
                      placeholder={currentPortal.placeholder}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field + Show/Hide Toggle + Forgot Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setView('forgot-password');
                        setErrorMsg(null);
                      }}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }
                        setErrorMsg(null);
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C] transition-all ${
                        fieldErrors.password
                          ? 'border-rose-500 ring-1 ring-rose-500/20'
                          : 'border-gray-300 dark:border-white/10'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Dynamic Login Button showing selected portal */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? `Authenticating to ${currentPortal.portalName}...`
                      : `Sign In to ${currentPortal.portalName}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* SEPARATE DEMO MODE TOGGLE */}
              <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowDemoMode(!showDemoMode)}
                  className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                    <span>Demo Mode (1-Click Evaluation)</span>
                  </div>
                  {showDemoMode ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Demo Mode Drawer: Strictly 3 roles */}
                {showDemoMode && (
                  <div className="mt-2 p-3 rounded-2xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Select Demo Persona
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleDemoSignIn('student', 'aarav.patel@techuniv.edu')
                        }
                        className="p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-blue-500/20 hover:border-blue-500 flex items-center justify-between text-left text-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              Student Account
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              aarav.patel@techuniv.edu
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                          Enter →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDemoSignIn('company', 'sophia.sterling@novacloud.io')
                        }
                        className="p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-purple-500/20 hover:border-purple-500 flex items-center justify-between text-left text-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                            <Briefcase className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              Recruiter Account
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              sophia.sterling@novacloud.io
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                          Enter →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDemoSignIn('college_admin', 'dean.pendelton@techuniv.edu')
                        }
                        className="p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-amber-500/20 hover:border-amber-500 flex items-center justify-between text-left text-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              Placement Cell Account
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              dean.pendelton@techuniv.edu
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                          Enter →
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Link */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="font-bold text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer"
                >
                  Register here
                </button>
              </div>

              {/* Small Privacy & Security Notice */}
              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  Encrypted session protected by 256-bit TLS and university RBAC protocols.
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
