import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import {
  X,
  Send,
  Bot,
  Sparkles,
  User,
  Loader2,
  Trash2,
  Copy,
  Check,
  Zap,
  Cpu,
  BrainCircuit,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CareerChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type ModelMode = 'fast' | 'general' | 'complex';

const MODEL_INFO: Record<ModelMode, { name: string; modelId: string; description: string; icon: React.ReactNode }> = {
  fast: {
    name: 'Fast',
    modelId: 'gemini-3.1-flash-lite',
    description: 'Quick answers & rapid tips',
    icon: <Zap className="w-3 h-3 text-amber-500" />,
  },
  general: {
    name: 'General',
    modelId: 'gemini-3.8-flash',
    description: 'Default campus placement coach',
    icon: <Cpu className="w-3 h-3 text-[#D4F73C]" />,
  },
  complex: {
    name: 'Complex',
    modelId: 'gemini-3.1-pro-preview',
    description: 'Deep technical reasoning & mock rounds',
    icon: <BrainCircuit className="w-3 h-3 text-purple-400" />,
  },
};

export const CareerChatDrawer: React.FC<CareerChatDrawerProps> = ({ isOpen, onClose }) => {
  const { studentProfile, jobs, showToast } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Hello ${studentProfile.name.split(' ')[0]}! I am your **SkillBridge AI Placement & Career Coach** powered by Gemini.

I have direct access to your verified placement readiness metrics (${studentProfile.skills.length} skills tracked, **${studentProfile.industryReadinessScore}% Placement Readiness**) and campus hiring trends.

Ask me about:
• Closing your technical skill gaps for Tier-1 hiring drives
• Live mock technical interview practice (DSA & System Design)
• ATS resume optimization & Google XYZ impact bullets
• Company-specific campus drive strategy & salary package benchmarks`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelMode, setModelMode] = useState<ModelMode>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const studentContext = {
        name: studentProfile.name,
        college: studentProfile.college,
        department: studentProfile.department,
        gpa: studentProfile.gpa,
        skills: studentProfile.skills.map((s) => s.name),
        projects: studentProfile.projects.map((p) => p.title),
        readinessScore: studentProfile.industryReadinessScore,
        targetRoles: ['Full-Stack Cloud Engineer', 'AI/ML Solutions Architect'],
      };

      const historyPayload = updated.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await geminiService.askSkillBridgeAI(
        userMsg.content,
        'student',
        historyPayload,
        {
          studentContext,
          jobs: (jobs || []).slice(0, 5),
        },
        {
          taskComplexity: modelMode,
          model: MODEL_INFO[modelMode].modelId,
        }
      );

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('[CareerChatDrawer] Error communicating with AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          role: 'assistant',
          content:
            'I encountered a temporary connection issue. Immediate actionable placement tip: Focus on building end-to-end full stack projects with Next.js and Redis caching to boost your placement readiness score above 90%!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. I am ready to help you with campus placement readiness, skill gaps, or interview strategy!`,
        timestamp: 'Just now',
      },
    ]);
    showToast('Conversation cleared', 'info');
  };

  const quickPrompts = [
    'How do I stand out for NovaCloud Systems placement drive?',
    'What are my top 3 missing skills for Full-Stack roles?',
    'Generate a 30-second elevator pitch based on my projects.',
    'Simulate a live technical interview question on distributed caching.',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#121318] shadow-2xl z-10 flex flex-col h-full border-l border-gray-200 dark:border-white/10 animate-in slide-in-from-right duration-200 font-sans">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/90 dark:bg-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#84B000] to-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                  SkillBridge Placement Coach
                </h3>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#D4F73C]/20 text-[#3d630a] dark:text-[#D4F73C] border border-[#D4F73C]/30">
                  Gemini
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{MODEL_INFO[modelMode].modelId} active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              title="Clear Conversation"
              className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              id="close-career-chat-drawer"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Mode Toggle */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex items-center justify-between text-[11px]">
          <span className="text-gray-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4F73C]" />
            Speed & Depth:
          </span>
          <div className="flex items-center gap-1 bg-gray-200/60 dark:bg-white/5 p-0.5 rounded-xl border border-gray-300/40 dark:border-white/5">
            {(['fast', 'general', 'complex'] as ModelMode[]).map((mode) => {
              const info = MODEL_INFO[mode];
              const active = modelMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setModelMode(mode)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-[#1E2029] text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                  title={info.description}
                >
                  {info.icon}
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#181920] text-white dark:bg-[#D4F73C] dark:text-[#111216] font-medium rounded-br-xs shadow-xs'
                    : 'bg-gray-100/90 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-xs'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-xs dark:prose-invert max-w-none space-y-2 leading-relaxed">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}

                <div className="mt-2 pt-1 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{m.timestamp}</span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-2xl p-3 bg-gray-100/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] font-semibold">
                  SkillBridge AI is thinking ({MODEL_INFO[modelMode].name} model)...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <span className="text-gray-400 font-bold shrink-0 text-[10px] uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#84B000] dark:text-[#D4F73C]" />
              Prompts:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/25 text-gray-700 dark:text-gray-300 font-medium transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-[#121318] border-t border-gray-100 dark:border-white/5 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              id="career-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask your Placement Coach anything (${MODEL_INFO[modelMode].name} mode)...`}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-gray-400 dark:focus:border-white/30 transition-all font-medium"
            />
            <button
              id="send-career-chat-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer shadow-xs ${
                input.trim() && !loading
                  ? 'bg-[#D4F73C] text-[#111216] hover:bg-[#c5ea2d]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
