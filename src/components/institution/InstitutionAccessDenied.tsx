import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface InstitutionAccessDeniedProps {
  targetPortal?: string;
  requiredRole?: string;
}

export const InstitutionAccessDenied: React.FC<InstitutionAccessDeniedProps> = ({
  targetPortal = 'College Administration Portal',
  requiredRole = 'college_admin',
}) => {
  const { navigate, isDarkMode } = useApp();
  const { currentRole, switchRole } = useAuth();

  const roleLabelMap: Record<string, string> = {
    student: 'Student',
    faculty: 'Faculty Member',
    company: 'Industry Partner',
    college_admin: 'College Administrator',
    super_admin: 'Super Administrator',
  };

  const currentRoleLabel = roleLabelMap[currentRole] || currentRole;
  const requiredRoleLabel = roleLabelMap[requiredRole] || requiredRole;

  const handleReturnToDashboard = () => {
    if (currentRole === 'student') navigate('/student/dashboard');
    else if (currentRole === 'faculty') navigate('/faculty/dashboard');
    else if (currentRole === 'company') navigate('/industry/dashboard');
    else if (currentRole === 'super_admin') navigate('/admin/dashboard');
    else navigate('/institution/dashboard');
  };

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full rounded-2xl p-8 border text-center shadow-xl transition-all ${
          isDarkMode
            ? 'bg-[#18191E] border-white/10 text-white shadow-black/40'
            : 'bg-white border-gray-200 text-gray-900 shadow-gray-200/50'
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center ring-8 ring-rose-500/5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold tracking-tight mb-2">Access Restricted</h2>
        <p
          className={`text-sm mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          The <span className="font-semibold text-rose-400">{targetPortal}</span> is reserved exclusively for verified institutional administrators. Your current active role is{' '}
          <span className="font-semibold text-amber-400">{currentRoleLabel}</span>.
        </p>

        <div
          className={`rounded-xl p-3.5 mb-6 text-xs text-left border ${
            isDarkMode
              ? 'bg-white/5 border-white/10 text-gray-300'
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Role-Based Access Policy Enforced</span>
          </div>
          <p className="text-gray-400 dark:text-gray-400 leading-relaxed">
            Unauthorized users are restricted from viewing institutional placement registries, student assessments, and institutional administrative controls.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleReturnToDashboard}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/role-selection')}
            className={`w-full py-2 px-4 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-white/10 text-gray-300 hover:bg-white/5'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Switch to Authorized Admin Account
          </button>
        </div>
      </div>
    </div>
  );
};
