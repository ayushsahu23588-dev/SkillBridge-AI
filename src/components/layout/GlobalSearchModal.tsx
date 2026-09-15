import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import { NaturalLanguageSearchResult } from '../../services/aiFallbackService';
import {
  Search,
  X,
  Briefcase,
  Target,
  Bot,
  Compass,
  Building2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Filter,
  Zap,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { jobs, workshops, studentProfile, setActiveTab, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [aiParsedResult, setAiParsedResult] = useState<NaturalLanguageSearchResult | null>(null);
  const [isAiParsing, setIsAiParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setAiParsedResult(null);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Natural Language AI Parsing with debounce
  useEffect(() => {
    if (!query.trim() || query.trim().length < 4) {
      setAiParsedResult(null);
      setIsAiParsing(false);
      return;
    }

    let isCurrent = true;
    const timer = setTimeout(async () => {
      setIsAiParsing(true);
      try {
        const result = await geminiService.parseNaturalLanguageSearch(query);
        if (isCurrent) {
          setAiParsedResult(result);
        }
      } catch {
        // fallback handles
      } finally {
        if (isCurrent) setIsAiParsing(false);
      }
    }, 280);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query]);

  if (!isOpen) return null;

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.companyName.toLowerCase().includes(query.toLowerCase()) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredWorkshops = workshops.filter(
    (w) =>
      w.title.toLowerCase().includes(query.toLowerCase()) ||
      w.instructorName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSkills = studentProfile.skills.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectAiResult = () => {
    if (!aiParsedResult) return;
    onClose();
    navigate(aiParsedResult.targetRoute);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center font-sans">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#14151B] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden transform transition-all">
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aiParsedResult) {
                handleSelectAiResult();
              }
            }}
            placeholder="Ask anything (e.g. 'Show internships needing Python', 'Find backend roadmap')..."
            className="w-full px-3.5 py-4 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Natural Language AI Parsed Card */}
          {aiParsedResult && (
            <div
              onClick={handleSelectAiResult}
              className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                  <span>AI Natural Language Search Intent</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  Press Enter ↵
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {aiParsedResult.intentSummary}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Navigate directly to: <strong className="text-gray-800 dark:text-gray-200">{aiParsedResult.targetRoute}</strong>
                  </p>
                </div>

                <div className="w-8 h-8 rounded-xl bg-[#D4F73C] text-[#111216] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Matched Filters Pills */}
              {aiParsedResult.matchedFilters.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-blue-500/20 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Filters:
                  </span>
                  {aiParsedResult.matchedFilters.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-extrabold text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Shortcuts */}
          {!query && (
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-1">
                Suggested Natural Language Inquiries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { text: 'Show internships needing Python', route: '/student/internships' },
                  { text: 'Show backend developer roadmap', route: '/student/roadmap' },
                  { text: 'Start AI mock interview for software role', route: '/student/interview-prep' },
                  { text: 'Find students with high readiness', route: '/industry/candidates' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item.text);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border border-gray-100 dark:border-white/5"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">
                      "{item.text}"
                    </span>
                    <Zap className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C] shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-1 mb-2">
                  Platform Destinations
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      navigate('/student/interview-prep');
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                  >
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">AI Interview Prep</p>
                      <p className="text-[10px] text-gray-500">10-question adaptive simulator</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/student/skill-gap');
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">Skill Gap Analysis</p>
                      <p className="text-[10px] text-gray-500">Industry readiness benchmark</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Job Postings matches */}
          {filteredJobs.length > 0 && (
            <div className="space-y-1 pt-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-1">
                Opportunities & Roles ({filteredJobs.length})
              </p>
              {filteredJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    navigate('/student/internships');
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {job.title}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {job.companyName} • {job.stipendOrSalary}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}

          {/* Workshops matches */}
          {filteredWorkshops.length > 0 && (
            <div className="space-y-1 pt-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-1">
                Workshops & Masterclasses ({filteredWorkshops.length})
              </p>
              {filteredWorkshops.map((w) => (
                <div
                  key={w.id}
                  onClick={() => {
                    navigate('/student/internships');
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-emerald-600 dark:text-emerald-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{w.title}</p>
                      <p className="text-[11px] text-gray-500">
                        By {w.instructorName} • {w.date}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}

          {/* If no matches found */}
          {query && !aiParsedResult && filteredJobs.length === 0 && filteredWorkshops.length === 0 && filteredSkills.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm font-semibold">No direct matches for "{query}"</p>
              <p className="text-xs mt-1">Try questions like "Show internships needing Python", "Show backend roadmap", or "Find workshops".</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/2 flex items-center justify-between text-[11px] text-gray-400">
          <span>Press ESC to close</span>
          <span className="font-semibold text-gray-500 dark:text-gray-400">Powered by SkillBridge AI Engine</span>
        </div>
      </div>
    </div>
  );
};
