import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, LogIn, RefreshCw, KeyRound, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
  fallbackMessage,
}) => {
  const { user, currentRole, openAuthModal, switchRole, isAuthenticated } = useAuth();

  const hasAccess = isAuthenticated && (allowedRoles.includes(currentRole) || currentRole === 'super_admin');

  if (hasAccess) {
    return <>{children}</>;
  }

  const roleLabels: Record<UserRole, string> = {
    student: 'Student',
    faculty: 'Faculty Evaluator',
    company: 'Corporate Recruiter',
    college_admin: 'College Administrator',
    super_admin: 'Super Administrator',
  };

  return (
    <div
      id="rbac-access-denied-container"
      className="max-w-3xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          RBAC Access Restricted
        </span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Authorized Role Required
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fallbackMessage ||
            `This section requires specialized role privileges. Your current role is `}
          <strong className="text-gray-900 dark:text-white font-semibold">
            {roleLabels[currentRole]}
          </strong>
          .
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 max-w-md mx-auto text-left space-y-2">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-blue-500" />
          Required Authorized Roles:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allowedRoles.map((role) => (
            <span
              key={role}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
            >
              {roleLabels[role]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
        {allowedRoles[0] && (
          <button
            id="rbac-quick-switch-btn"
            onClick={() => switchRole(allowedRoles[0])}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Switch to {roleLabels[allowedRoles[0]]}</span>
          </button>
        )}

        <button
          id="rbac-login-other-btn"
          onClick={() => openAuthModal('signin', allowedRoles[0])}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In with Different Account</span>
        </button>
      </div>
    </div>
  );
};
