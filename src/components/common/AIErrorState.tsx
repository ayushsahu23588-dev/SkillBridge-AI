import React from 'react';
import { AlertCircle, RefreshCw, Bot, ShieldCheck } from 'lucide-react';
import { aiCacheService } from '../../services/aiCacheService';

interface AIErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  onSwitchToDemo?: () => void;
}

export const AIErrorState: React.FC<AIErrorStateProps> = ({
  message = 'AI temporarily unavailable. You can continue using SkillBridge in Demo AI Mode.',
  onRetry,
  className = '',
  onSwitchToDemo,
}) => {
  const handleSwitch = () => {
    aiCacheService.updatePreferences({ aiMode: 'demo' });
    if (onSwitchToDemo) {
      onSwitchToDemo();
    } else if (onRetry) {
      onRetry();
    }
  };

  return (
    <div
      className={`rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 sm:p-6 text-center text-xs font-sans ${className}`}
    >
      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>

      <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
        AI Service Notice
      </h4>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed mb-4">
        {message}
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}

        <button
          onClick={handleSwitch}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Switch to Demo AI Mode</span>
        </button>
      </div>
    </div>
  );
};
