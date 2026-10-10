import React, { useState, useEffect } from 'react';
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
  User,
  Building,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  Award,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate, showToast, updateStudentProfile, studentProfile } = useApp();
  const { register, switchRole } = useAuth();

  // Detect role from URL query param if present
  const getInitialRole = (): 'student' | 'company' | 'college_admin' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('role');
      if (r === 'recruiter' || r === 'company') return 'company';
      if (r === 'placement_cell' || r === 'institution' || r === 'college_admin')
        return 'college_admin';
    }
    return 'student';
  };

  const [selectedRole, setSelectedRole] = useState<'student' | 'company' | 'college_admin'>(
    getInitialRole
  );

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields - Student
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [studentCollege, setStudentCollege] = useState('Apex National Institute of Technology');
  const [studentBranch, setStudentBranch] = useState('Computer Science & Engineering');
  const [studentGradYear, setStudentGradYear] = useState('2026');
  const [studentCgpa, setStudentCgpa] = useState('8.45');
  const [studentPhone, setStudentPhone] = useState('+91 98765 43210');

  // Form Fields - Recruiter
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');
  const [recruiterCompany, setRecruiterCompany] = useState('');
  const [recruiterWebsite, setRecruiterWebsite] = useState('');
  const [recruiterCompanyType, setRecruiterCompanyType] = useState('Product / Tech Enterprise');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [recruiterDesignation, setRecruiterDesignation] = useState('Lead University Recruiter');

  // Form Fields - Placement Cell
  const [officerName, setOfficerName] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [officerCollege, setOfficerCollege] = useState('Apex National Institute of Technology');
  const [officerDesignation, setOfficerDesignation] = useState('Training & Placement Officer (TPO)');
  const [officerPhone, setOfficerPhone] = useState('');

  // UI Flow State: 'form' | 'student-success' | 'verification-pending'
  const [flowState, setFlowState] = useState<'form' | 'student-success' | 'verification-pending'>('form');
  const [registeredData, setRegisteredData] = useState<any>(null);

  // Validation & Error Handling
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setErrorMsg(null);
    setFieldErrors({});
  }, [selectedRole]);

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (selectedRole === 'student') {
      if (!studentName.trim()) errs.studentName = 'Full Name is required.';
      if (!studentEmail.trim()) {
        errs.studentEmail = 'Email address is required.';
      } else if (!emailRegex.test(studentEmail.trim())) {
        errs.studentEmail = 'Please enter a valid email format.';
      }

      if (!studentPassword) {
        errs.studentPassword = 'Password is required.';
      } else if (studentPassword.length < 6) {
        errs.studentPassword = 'Password must be at least 6 characters.';
      }

      if (studentPassword !== studentConfirmPassword) {
        errs.studentConfirmPassword = 'Passwords do not match.';
      }

      if (!studentCollege.trim()) errs.studentCollege = 'College/University is required.';
      if (!studentBranch.trim()) errs.studentBranch = 'Branch/Department is required.';
      if (!studentGradYear) errs.studentGradYear = 'Graduation year is required.';

      const cgpaNum = parseFloat(studentCgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        errs.studentCgpa = 'Enter a valid CGPA between 0.0 and 10.0.';
      }

      if (!studentPhone.trim()) errs.studentPhone = 'Phone number is required.';
    } else if (selectedRole === 'company') {
      if (!recruiterName.trim()) errs.recruiterName = 'Recruiter Name is required.';
      if (!recruiterEmail.trim()) {
        errs.recruiterEmail = 'Work Email is required.';
      } else if (!emailRegex.test(recruiterEmail.trim())) {
        errs.recruiterEmail = 'Please enter a valid corporate email format.';
      }

      if (!recruiterPassword) {
        errs.recruiterPassword = 'Password is required.';
      } else if (recruiterPassword.length < 6) {
        errs.recruiterPassword = 'Password must be at least 6 characters.';
      }

      if (!recruiterCompany.trim()) errs.recruiterCompany = 'Company Name is required.';
      if (!recruiterWebsite.trim()) errs.recruiterWebsite = 'Company Website is required.';
      if (!recruiterPhone.trim()) errs.recruiterPhone = 'Contact number is required.';
      if (!recruiterDesignation.trim()) errs.recruiterDesignation = 'Designation is required.';
    } else if (selectedRole === 'college_admin') {
      if (!officerName.trim()) errs.officerName = 'Officer/Admin Name is required.';
      if (!officerEmail.trim()) {
        errs.officerEmail = 'Official College Email is required.';
      } else if (!emailRegex.test(officerEmail.trim())) {
        errs.officerEmail = 'Please enter a valid institutional email format.';
      }

      if (!officerPassword) {
        errs.officerPassword = 'Password is required.';
      } else if (officerPassword.length < 6) {
        errs.officerPassword = 'Password must be at least 6 characters.';
      }

      if (!officerCollege.trim()) errs.officerCollege = 'College/University Name is required.';
      if (!officerDesignation.trim()) errs.officerDesignation = 'Designation is required.';
      if (!officerPhone.trim()) errs.officerPhone = 'Contact number is required.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (selectedRole === 'student') {
        const payload = {
          name: studentName.trim(),
          email: studentEmail.trim(),
          password: studentPassword,
          role: 'student' as UserRole,
          college: studentCollege.trim(),
          organization: studentCollege.trim(),
          department: studentBranch.trim(),
          graduationYear: studentGradYear,
          cgpa: studentCgpa,
          phone: studentPhone.trim(),
          degree: 'B.Tech',
          batch: `${parseInt(studentGradYear) - 4} - ${studentGradYear}`,
        };

        await register(payload);

        // Update student profile context with the registered details
        updateStudentProfile({
          name: payload.name,
          email: payload.email,
          college: payload.college,
          department: payload.department,
          cgpa: parseFloat(studentCgpa) || 8.5,
          batch: payload.batch,
        });

        setRegisteredData({
          name: payload.name,
          email: payload.email,
          role: 'student',
        });
        setFlowState('student-success');
        showToast('Student registration completed successfully!', 'success');
      } else if (selectedRole === 'company') {
        const payload = {
          name: recruiterName.trim(),
          email: recruiterEmail.trim(),
          password: recruiterPassword,
          role: 'company' as UserRole,
          companyName: recruiterCompany.trim(),
          organization: recruiterCompany.trim(),
          companyWebsite: recruiterWebsite.trim(),
          companyType: recruiterCompanyType,
          contactNumber: recruiterPhone.trim(),
          designation: recruiterDesignation.trim(),
        };

        await register(payload);

        setRegisteredData({
          name: payload.name,
          email: payload.email,
          company: payload.companyName,
          designation: payload.designation,
          role: 'company',
        });
        setFlowState('verification-pending');
        showToast('Recruiter profile submitted for placement verification.', 'info');
      } else if (selectedRole === 'college_admin') {
        const payload = {
          name: officerName.trim(),
          email: officerEmail.trim(),
          password: officerPassword,
          role: 'college_admin' as UserRole,
          collegeUniversityName: officerCollege.trim(),
          organization: officerCollege.trim(),
          designation: officerDesignation.trim(),
          contactNumber: officerPhone.trim(),
        };

        await register(payload);

        setRegisteredData({
          name: payload.name,
          email: payload.email,
          college: payload.collegeUniversityName,
          designation: payload.designation,
          role: 'college_admin',
        });
        setFlowState('verification-pending');
        showToast('Placement Cell registration submitted for domain verification.', 'info');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] dark:bg-[#0D0E13] text-gray-900 dark:text-white px-4 sm:px-8 py-8 font-sans selection:bg-[#D4F73C] selection:text-black">
      {/* Top Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => navigate('/role-selection')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose Account Type</span>
        </button>

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
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Already registered? Sign In
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto w-full py-8 sm:py-10 flex flex-col justify-center">
        {/* POST-REGISTRATION STATE 1: STUDENT SUCCESS & ONBOARDING */}
        {flowState === 'student-success' && (
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-9 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Student Account Created!
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome, <strong>{registeredData?.name}</strong>. Your placement profile has been registered on SkillBridge AI.
              </p>
            </div>

            {/* 4 Steps Journey Checklist */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Your Placement Readiness Roadmap
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      1. Student Dashboard Initialized
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Access live campus drives, centralized calendars, and matching opportunities.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-blue-500/30">
                  <User className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      2. Complete Profile
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Upload your verified resume, link GitHub repositories, and enter project proofs.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-purple-500/30">
                  <Target className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      3. Take AI Skill Assessment
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Verify proficiency in Data Structures, Core Fundamentals, and Aptitude.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white dark:bg-[#181920] border border-amber-500/30">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      4. Unlock Placement Readiness Score
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Receive a predictive 0–100% score to unlock dream company cutoffs.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  switchRole('student');
                  navigate('/student/dashboard');
                }}
                className="w-full py-3.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to Student Dashboard & Start Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  switchRole('student');
                  navigate('/student/assessment');
                }}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-gray-800 dark:text-gray-200 transition-all cursor-pointer"
              >
                Take Diagnostic Skill Assessment Now
              </button>
            </div>
          </div>
        )}

        {/* POST-REGISTRATION STATE 2: VERIFICATION PENDING (RECRUITER & PLACEMENT CELL) */}
        {flowState === 'verification-pending' && (
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-9 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Verification Pending
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {registeredData?.role === 'company'
                  ? `Your Recruiter account for ${registeredData?.company} has been registered.`
                  : `Administrative registration for ${registeredData?.college} has been recorded.`}
              </p>
            </div>

            {/* Explanation Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Institutional Review in Progress</span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed">
                {registeredData?.role === 'company'
                  ? 'Corporate domain credentials and company registration are reviewed by the campus placement network before full hiring drive publishing is unlocked. Full verified access is typically approved within 24 to 48 hours.'
                  : 'Official university email ownership and administrative authority as Training & Placement Officer / Placement Cell Lead are undergoing domain sign-off. Full command center privileges will activate upon domain confirmation.'}
              </p>
            </div>

            {/* Account Details Summary */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Registered Name:</span>
                <span className="font-bold text-gray-900 dark:text-white">{registeredData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Official Email:</span>
                <span className="font-mono text-gray-900 dark:text-white">{registeredData?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Organization / Campus:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {registeredData?.company || registeredData?.college}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Designation:</span>
                <span className="text-gray-700 dark:text-gray-300">{registeredData?.designation}</span>
              </div>
            </div>

            {/* Direct Dashboard Access Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  if (registeredData?.role === 'company') {
                    switchRole('company');
                    navigate('/industry/dashboard');
                  } else {
                    switchRole('college_admin');
                    navigate('/institution/dashboard');
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {registeredData?.role === 'company'
                    ? 'Enter Recruiter Dashboard (Sandbox Mode)'
                    : 'Enter Placement Cell Dashboard (Sandbox Mode)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

        {/* REGISTRATION FORM VIEW */}
        {flowState === 'form' && (
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create Account
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Join the SkillBridge AI Campus Placement Management Platform
              </p>
            </div>

            {/* Exactly 3 Roles Switcher Tabs */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Select Account Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'student'
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('company')}
                  className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'company'
                      ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('college_admin')}
                  className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'college_admin'
                      ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Placement Cell</span>
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FORM BODY */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
              {/* ---------------- 1. STUDENT REGISTRATION FORM ---------------- */}
              {selectedRole === 'student' && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Aarav Patel"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.studentName && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="student@techuniv.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.studentEmail && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentEmail}</p>
                    )}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="Min. 6 chars"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {fieldErrors.studentPassword && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={studentConfirmPassword}
                          onChange={(e) => setStudentConfirmPassword(e.target.value)}
                          placeholder="Confirm match"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {fieldErrors.studentConfirmPassword && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentConfirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* College / University */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      College / University *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentCollege}
                        onChange={(e) => setStudentCollege(e.target.value)}
                        placeholder="e.g. Apex National Institute of Technology"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.studentCollege && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentCollege}</p>
                    )}
                  </div>

                  {/* Branch / Department */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Branch / Department *
                    </label>
                    <select
                      value={studentBranch}
                      onChange={(e) => setStudentBranch(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#181920] border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                    </select>
                  </div>

                  {/* Graduation Year & CGPA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Graduation Year *
                      </label>
                      <select
                        value={studentGradYear}
                        onChange={(e) => setStudentGradYear(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#181920] border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      >
                        <option value="2025">2025 (Immediate Placement)</option>
                        <option value="2026">2026 (Upcoming Batch)</option>
                        <option value="2027">2027 (Pre-Final Year)</option>
                        <option value="2028">2028 (Sophomore)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        CGPA (0.0 - 10.0) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={studentCgpa}
                        onChange={(e) => setStudentCgpa(e.target.value)}
                        placeholder="e.g. 8.45"
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                      {fieldErrors.studentCgpa && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentCgpa}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.studentPhone && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.studentPhone}</p>
                    )}
                  </div>
                </>
              )}

              {/* ---------------- 2. RECRUITER REGISTRATION FORM ---------------- */}
              {selectedRole === 'company' && (
                <>
                  {/* Recruiter Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Recruiter Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        placeholder="e.g. Sophia Sterling"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.recruiterName && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterName}</p>
                    )}
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={recruiterEmail}
                        onChange={(e) => setRecruiterEmail(e.target.value)}
                        placeholder="sophia@novacloud.io"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.recruiterEmail && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterEmail}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={recruiterPassword}
                        onChange={(e) => setRecruiterPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.recruiterPassword && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterPassword}</p>
                    )}
                  </div>

                  {/* Company Name & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={recruiterCompany}
                          onChange={(e) => setRecruiterCompany(e.target.value)}
                          placeholder="e.g. NovaCloud Systems"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        />
                      </div>
                      {fieldErrors.recruiterCompany && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterCompany}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Company Website *
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={recruiterWebsite}
                          onChange={(e) => setRecruiterWebsite(e.target.value)}
                          placeholder="https://novacloud.io"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        />
                      </div>
                      {fieldErrors.recruiterWebsite && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterWebsite}</p>
                      )}
                    </div>
                  </div>

                  {/* Company Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Company Type *
                    </label>
                    <select
                      value={recruiterCompanyType}
                      onChange={(e) => setRecruiterCompanyType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#181920] border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                    >
                      <option value="Product / Tech Enterprise">Product / Tech Enterprise</option>
                      <option value="Software Services & IT Solutions">Software Services & IT Solutions</option>
                      <option value="FinTech & Financial Services">FinTech & Financial Services</option>
                      <option value="High-Growth Tech Startup">High-Growth Tech Startup</option>
                      <option value="Core Engineering & Industrial">Core Engineering & Industrial</option>
                      <option value="Technology Consulting">Technology Consulting</option>
                    </select>
                  </div>

                  {/* Contact Number & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={recruiterPhone}
                          onChange={(e) => setRecruiterPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        />
                      </div>
                      {fieldErrors.recruiterPhone && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Designation *
                      </label>
                      <input
                        type="text"
                        value={recruiterDesignation}
                        onChange={(e) => setRecruiterDesignation(e.target.value)}
                        placeholder="e.g. Campus Talent Partner"
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                      {fieldErrors.recruiterDesignation && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.recruiterDesignation}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ---------------- 3. PLACEMENT CELL REGISTRATION FORM ---------------- */}
              {selectedRole === 'college_admin' && (
                <>
                  {/* Officer/Admin Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Officer / Administrator Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        placeholder="e.g. Dean Arthur Pendelton"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.officerName && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.officerName}</p>
                    )}
                  </div>

                  {/* Official College Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Official College Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        placeholder="tpo@techuniv.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.officerEmail && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.officerEmail}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.officerPassword && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.officerPassword}</p>
                    )}
                  </div>

                  {/* College/University Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      College / University Name *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officerCollege}
                        onChange={(e) => setOfficerCollege(e.target.value)}
                        placeholder="e.g. Apex National Institute of Technology"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      />
                    </div>
                    {fieldErrors.officerCollege && (
                      <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.officerCollege}</p>
                    )}
                  </div>

                  {/* Designation & Contact Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Designation *
                      </label>
                      <select
                        value={officerDesignation}
                        onChange={(e) => setOfficerDesignation(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#181920] border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                      >
                        <option value="Training & Placement Officer (TPO)">Training & Placement Officer (TPO)</option>
                        <option value="Dean of Placements & Career Affairs">Dean of Placements & Career Affairs</option>
                        <option value="Placement Cell Coordinator">Placement Cell Coordinator</option>
                        <option value="Head of Department (Placement)">Head of Department (Placement)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={officerPhone}
                          onChange={(e) => setOfficerPhone(e.target.value)}
                          placeholder="+91 (022) 2854-3210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                        />
                      </div>
                      {fieldErrors.officerPhone && (
                        <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.officerPhone}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                id="submit-registration-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
              >
                <span>
                  {loading
                    ? 'Creating Account...'
                    : selectedRole === 'student'
                    ? 'Register as Student'
                    : selectedRole === 'company'
                    ? 'Register as Recruiter'
                    : 'Register as Placement Cell'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom link to Sign In */}
            <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
              Already have an active account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer"
              >
                Sign In here
              </button>
            </div>

            {/* Security note */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Protected by 256-bit TLS encryption and role-based institutional authentication.
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
