import React, { useState, useEffect } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';
import { aiCacheService } from '../../services/aiCacheService';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const prefs = aiCacheService.getPreferences();
    setEnabled(prefs.aiAssistanceEnabled);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Floating Button in bottom-right corner */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="ask-skillbridge-ai-floating-btn"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#181920] text-white dark:bg-[#D4F73C] dark:text-[#111216] font-extrabold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white/20 dark:ring-black/10"
          aria-label="Ask SkillBridge AI"
        >
          <div className="w-6 h-6 rounded-full bg-[#D4F73C] text-[#111216] dark:bg-[#111216] dark:text-[#D4F73C] flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="tracking-tight">Ask SkillBridge AI</span>
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>

      {/* Slide-in Chat Panel */}
      <AIChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
