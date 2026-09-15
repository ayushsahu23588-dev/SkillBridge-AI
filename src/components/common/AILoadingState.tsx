import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AILoadingStateProps {
  message?: string;
  className?: string;
  variant?: 'inline' | 'card' | 'pulse';
}

export const AILoadingState: React.FC<AILoadingStateProps> = ({
  message = 'SkillBridge AI is analyzing...',
  className = '',
  variant = 'card',
}) => {
  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C] animate-spin" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-white/60 dark:bg-[#14151B]/60 border border-gray-200/80 dark:border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center backdrop-blur-xs transition-all ${className}`}
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin duration-3000" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <Loader2 className="w-3 h-3 animate-spin" />
        </div>
      </div>

      <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
        {message}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
        Synthesizing academic competencies, industry benchmarks, and hiring partner trends...
      </p>

      {/* Shimmer skeleton lines */}
      <div className="w-full max-w-xs space-y-2 mt-4">
        <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse w-3/4 mx-auto" />
        <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse w-1/2 mx-auto" />
      </div>
    </div>
  );
};
