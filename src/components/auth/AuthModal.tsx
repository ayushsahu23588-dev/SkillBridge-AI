import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole, AuthMode } from '../../types';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Building,
  GraduationCap,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldAlert,
  RotateCw,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  initialRole,
}) => {
  const {
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    isLoading,
    user,
  } = useAuth();
  const { showToast } = useApp();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'student');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [batch, setBatch] = useState('2023 - 2027');

  // OTP Verification
  const [otp, setOtp] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Validation Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode) setMode(initialMode);
    if (initialRole) setSelectedRole(initialRole);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode, initialRole, isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  const roleOptions: { role: UserRole; label: string; icon: React.ReactNode; defaultEmail: string }[] = [
    {
      role: 'student',
      label: 'Student',
      icon: <GraduationCap className="w-4 h-4" />,
      defaultEmail: 'alex.morgan@university.edu',
    },
    {
      role: 'faculty',
      label: 'Faculty',
      icon: <BookOpen className="w-4 h-4" />,
      defaultEmail: 's.jenkins@university.edu',
    },
    {
      role: 'company',
      label: 'Recruiter',
      icon: <Briefcase className="w-4 h-4" />,
      defaultEmail: 'marcus.v@cloudscale.io',
    },
    {
      role: 'college_admin',
      label: 'College Admin',
      icon: <Building2 className="w-4 h-4" />,
      defaultEmail: 'arthur.p@university.edu',
    },
    {
      role: 'super_admin',
      label: 'Super Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      defaultEmail: 'root@edubridge.ai',
    },
  ];

  // Quick Demo Auto-Fill
  const handleQuickDemoFill = (role: UserRole) => {
    setSelectedRole(role);
    const config = roleOptions.find((r) => r.role === role);
    if (config) {
      setEmail(config.defaultEmail);
      setPassword('Password@123');
    }
  };

  // 1. Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      await login({ email, password, role: selectedRole });
      showToast(`Signed in successfully as ${selectedRole}`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify and retry.');
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      const generatedOtp = await register({
        name,
        email,
        password,
        role: selectedRole,
        organization: organization || 'Institute of Technology',
        department: department || 'Computer Science',
        degree,
        batch,
      });

      setDemoOtpNotice(generatedOtp || '123456');
      setSuccessMsg('Account created successfully! Please verify your email with the OTP code.');
      setMode('verify_email');
      setCountdown(60);
      showToast('Registration successful! Verification code sent.', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
    }
  };

  // 3. Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      const simulatedGoogleUsers = {
        student: { email: 'student.google@university.edu', name: 'Jordan Hayes', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        faculty: { email: 'faculty.google@university.edu', name: 'Prof. Elena Rostova', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
        company: { email: 'recruiter.google@techcorp.com', name: 'Samantha Reed', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
        college_admin: { email: 'admin.google@university.edu', name: 'Dean Robert Sterling', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
        super_admin: { email: 'root.google@edubridge.ai', name: 'Master Administrator', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
      };

      const profile = simulatedGoogleUsers[selectedRole];
      await loginWithGoogle({
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        role: selectedRole,
      });

      showToast(`Welcome! Signed in via Google as ${profile.name}`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google OAuth failed.');
    }
  };

  // 4. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    try {
      const generatedOtp = await forgotPassword({ email });
      setDemoOtpNotice(generatedOtp || '849201');
      setSuccessMsg(`A 6-digit reset OTP code has been generated for ${email}.`);
      setMode('reset_password');
      setCountdown(60);
      showToast('Reset OTP dispatched to email.', 'info');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to request reset OTP.');
    }
  };

  // 5. Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otp || !password) {
      setErrorMsg('Please enter the 6-digit OTP code and your new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword: password });
      setSuccessMsg('Your password has been reset successfully! Please sign in.');
      setMode('signin');
      setPassword('');
      setConfirmPassword('');
      showToast('Password reset successfully!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    }
  };

  // 6. Handle Email Verification
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otp) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      await verifyEmail({ email: email || (user ? user.email : ''), otp });
      setSuccessMsg('Email verified successfully! You now have full access.');
      showToast('Email verified successfully!', 'success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid verification code.');
    }
  };

  // 7. Handle Resend Verification OTP
  const handleResendOtp = async () => {
    setErrorMsg(null);
    try {
      const generatedOtp = await resendVerification(email || (user ? user.email : ''));
      setDemoOtpNotice(generatedOtp || '123456');
      setCountdown(60);
      showToast('New verification code sent!', 'info');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all max-h-[90vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              EB
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                EduBridge<span className="text-blue-600 dark:text-blue-400">AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  RBAC Gate
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === 'signin' && 'Secure multi-role authentication'}
                {mode === 'signup' && 'Create your institutional account'}
                {mode === 'forgot_password' && 'Recover your credentials'}
                {mode === 'reset_password' && 'Set a new secure password'}
                {mode === 'verify_email' && 'Verify your institutional email'}
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Role Persona Switcher (Only on SignIn & SignUp) */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Select Role Persona
                </label>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  One-Click Demo Roles
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                {roleOptions.map((item) => {
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      id={`auth-role-select-${item.role}`}
                      onClick={() => handleQuickDemoFill(item.role)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/60 dark:border-gray-700'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="mb-1">{item.icon}</div>
                      <span className="truncate w-full text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && (
            <div
              id="auth-error-banner"
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMsg && (
            <div
              id="auth-success-banner"
              className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* Demo OTP Notice Box (For instant review) */}
          {demoOtpNotice && (
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                <KeyRound className="w-4 h-4" />
                <span>Simulated Email OTP:</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold tracking-widest text-sm">
                {demoOtpNotice}
              </span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 1: SIGN IN */}
          {/* ------------------------------------------------------------- */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Institutional / Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex.morgan@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    id="forgot-password-link-btn"
                    onClick={() => {
                      setMode('forgot_password');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Demo Credentials Reminder Box */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>Default Password for all roles:</span>
                <code className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono font-semibold">
                  Password@123
                </code>
              </div>

              {/* Submit Button */}
              <button
                id="signin-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {selectedRole.replace('_', ' ').toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Google OAuth Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
                <span className="bg-white dark:bg-gray-900 px-3 text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold absolute">
                  Or continue with
                </span>
              </div>

              {/* Google OAuth Button */}
              <button
                id="google-signin-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace / Gmail</span>
              </button>

              {/* Mode Toggle Footer */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    id="switch-to-signup-btn"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Register new profile
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 2: SIGN UP */}
          {/* ------------------------------------------------------------- */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Vance"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jordan.vance@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Role Specific Fields */}
              {selectedRole === 'student' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                      Batch
                    </label>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {selectedRole === 'company' ? 'Company Name' : 'College / Institution'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={selectedRole === 'company' ? 'e.g. Google, CloudScale' : 'e.g. National Institute of Technology'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm-password-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as {selectedRole.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch to Sign In */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Sign in instead
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 3: FORGOT PASSWORD */}
          {/* ------------------------------------------------------------- */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Enter your registered account email. We will generate a secure 6-digit one-time password (OTP) code to verify your identity.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex.morgan@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Send Reset OTP Code</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 4: RESET PASSWORD */}
          {/* ------------------------------------------------------------- */}
          {mode === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  6-Digit Reset OTP
                </label>
                <input
                  id="reset-otp-input"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center tracking-widest font-mono text-lg font-bold py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  id="reset-new-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  id="reset-confirm-password-input"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <button
                id="reset-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Set New Password</span>
              </button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 5: EMAIL VERIFICATION */}
          {/* ------------------------------------------------------------- */}
          {mode === 'verify_email' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  We've sent a 6-digit verification code to <br />
                  <strong className="text-gray-900 dark:text-white">{email || (user ? user.email : '')}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Enter 6-Digit Code
                </label>
                <input
                  id="email-verify-otp-input"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest font-mono text-xl font-bold py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                />
              </div>

              <button
                id="verify-email-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Verify Email & Activate Badge</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-gray-500 hover:underline"
                >
                  Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline disabled:opacity-50"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend OTP Code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
