import React, { useState, useEffect } from 'react';
import { checkAiHealth, AiMode } from '../../config/ai';
import { aiCacheService } from '../../services/aiCacheService';
import { Sparkles, CheckCircle2, Sliders, RefreshCw, Bot, ShieldCheck } from 'lucide-react';

interface AIStatusIndicatorProps {
  className?: string;
  showToggle?: boolean;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  className = '',
  showToggle = true,
}) => {
  const [mode, setMode] = useState<AiMode>('demo');
  const [online, setOnline] = useState(false);
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshStatus = async (force = false) => {
    setLoading(true);
    const health = await checkAiHealth(force);
    setOnline(health.online);
    setGeminiConfigured(health.geminiConfigured);
    setMode(health.mode);
    setLoading(false);
  };

  useEffect(() => {
    refreshStatus();
    // Re-check periodically
    const timer = setInterval(() => refreshStatus(), 45000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMode = (newMode: AiMode) => {
    aiCacheService.updatePreferences({ aiMode: newMode });
    setMode(newMode);
    setIsOpen(false);
    refreshStatus(true);
  };

  const isGemini = mode === 'gemini' && geminiConfigured;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        id="ai-status-indicator-btn"
        onClick={() => showToggle && setIsOpen(!isOpen)}
        title={isGemini ? 'Cloud AI Connected (Active)' : 'Demo AI Mode (Deterministic Local Intelligence Active)'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none shadow-xs ${
          isGemini
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isGemini ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isGemini ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">AI Status:</span>
        <span className="font-extrabold flex items-center gap-1">
          {isGemini ? 'Cloud AI Connected' : 'Demo AI Mode'}
        </span>
        {showToggle && <Sliders className="w-3 h-3 ml-0.5 opacity-60" />}
      </button>

      {/* Popover settings modal */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#1A1B23] border border-gray-200 dark:border-white/10 shadow-2xl p-4 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5 mb-3">
              <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                SkillBridge AI Engine
              </span>
              <button
                onClick={() => refreshStatus(true)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500"
                title="Refresh Status"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
              Switch between live cloud AI generation and resilient, zero-latency Demo AI Mode.
            </p>

            <div className="space-y-2">
              <button
                id="select-gemini-mode-btn"
                onClick={() => handleToggleMode('gemini')}
                disabled={!geminiConfigured}
                className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-2.5 transition-all cursor-pointer ${
                  mode === 'gemini'
                    ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                } ${!geminiConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Bot className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Cloud AI Mode</span>
                    {mode === 'gemini' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {geminiConfigured ? 'Live cloud AI reasoning active' : 'API Key required in server environment'}
                  </div>
                </div>
              </button>

              <button
                id="select-demo-mode-btn"
                onClick={() => handleToggleMode('demo')}
                className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-2.5 transition-all cursor-pointer ${
                  mode === 'demo'
                    ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Demo AI Mode</span>
                    {mode === 'demo' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Deterministic local AI simulation (offline ready)
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
