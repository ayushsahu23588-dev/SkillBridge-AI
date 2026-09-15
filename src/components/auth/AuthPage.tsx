import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from './AuthModal';
import { GraduationCap, Briefcase, BookOpen, ShieldCheck, Building2, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, openAuthModal, authModalMode, targetRoleForModal, currentRole } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
          EB
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            EduBridge<span className="text-blue-600 dark:text-blue-400">AI</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure Multi-Role Enterprise Authentication
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => openAuthModal('signin')}
            className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Register Profile
          </button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Explore Demo Persona Roles
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => openAuthModal('signin', 'student')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[11px] font-medium border border-blue-200/60 dark:border-blue-800/60"
            >
              Student
            </button>
            <button
              onClick={() => openAuthModal('signin', 'faculty')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-200/60 dark:border-emerald-800/60"
            >
              Faculty
            </button>
            <button
              onClick={() => openAuthModal('signin', 'company')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[11px] font-medium border border-purple-200/60 dark:border-purple-800/60"
            >
              Recruiter
            </button>
            <button
              onClick={() => openAuthModal('signin', 'college_admin')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[11px] font-medium border border-amber-200/60 dark:border-amber-800/60"
            >
              College Admin
            </button>
            <button
              onClick={() => openAuthModal('signin', 'super_admin')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[11px] font-medium border border-rose-200/60 dark:border-rose-800/60"
            >
              Super Admin
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        initialRole={targetRoleForModal || currentRole}
      />
    </div>
  );
};
