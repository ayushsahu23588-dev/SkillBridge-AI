import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import { aiCacheService, AiChatMessage } from '../../services/aiCacheService';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Trash2,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Loader2,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, onClose }) => {
  const { currentUser, studentProfile, jobs, navigate } = useApp();
  const role = currentUser.role || 'student';

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested prompts per role
  const getSuggestedPrompts = () => {
    switch (role) {
      case 'student':
        return [
          { text: 'Explain my biggest skill gap and how to fix it', action: { label: 'View Skill Gaps', path: '/student/skill-gap' } },
          { text: 'What internships match my profile right now?', action: { label: 'Explore Internships', path: '/student/internships' } },
          { text: 'How do I prepare for a backend interview?', action: { label: 'AI Interview Prep', path: '/student/interview-prep' } },
          { text: 'How can I make my portfolio stand out to recruiters?', action: { label: 'View Portfolio', path: '/student/portfolio' } },
        ];
      case 'company':
        return [
          { text: 'Which candidates match our Python & SQL criteria?', action: { label: 'Candidate Matching', path: '/industry/candidates' } },
          { text: 'Generate 3 technical screening questions for backend interns' },
          { text: 'What are the current student skill distributions in this region?' },
        ];
      case 'faculty':
        return [
          { text: 'What are the top industry collaboration opportunities?', action: { label: 'Faculty Programs', path: '/faculty/dashboard' } },
          { text: 'Suggest a workshop topic based on student skill gaps' },
          { text: 'Which students need priority mentorship in DSA?' },
        ];
      case 'college_admin':
        return [
          { text: 'Summarize institutional placement readiness across departments', action: { label: 'Institution Overview', path: '/institution/dashboard' } },
          { text: 'What training programs will raise cohort readiness the most?' },
          { text: 'Which skills have the highest industry demand mismatch?' },
        ];
      case 'super_admin':
        return [
          { text: 'Summarize platform verification metrics and growth', action: { label: 'Admin Analytics', path: '/admin/analytics' } },
          { text: 'What are the top demanded skills across all active jobs?' },
        ];
      default:
        return [
          { text: 'How does SkillBridge AI match students with opportunities?' },
          { text: 'Tell me about the SkillBridge verification workflow' },
        ];
    }
  };

  const getRoleGreeting = () => {
    switch (role) {
      case 'student':
        return `Hello ${currentUser.name.split(' ')[0]}! Ask me about your skill gaps, career roadmap, digital portfolio, or matching internships.`;
      case 'company':
        return `Hello! As your Talent Intelligence Advisor, ask me about candidate matching, screening rubrics, or hiring trends.`;
      case 'faculty':
        return `Welcome Professor ${currentUser.name.split(' ')[0]}! Ask me about curriculum gaps, workshop proposals, or industry collaborations.`;
      case 'college_admin':
        return `Welcome Administrator. Ask me about department skill analytics, institutional readiness, or placement insights.`;
      case 'super_admin':
        return `Platform Intelligence Active. Ask me about platform growth, verification statistics, or skill analytics.`;
      default:
        return `Hello! I am SkillBridge AI. How can I assist your academia-industry workflows today?`;
    }
  };

  // Load existing history or initialize greeting
  useEffect(() => {
    if (!isOpen) return;

    const history = aiCacheService.getChatHistory(role);
    if (history.length > 0) {
      setMessages(history);
    } else {
      const initialGreeting: AiChatMessage = {
        id: `greeting_${Date.now()}`,
        role: 'assistant',
        userRole: role,
        content: getRoleGreeting(),
        timestamp: new Date().toISOString(),
      };
      setMessages([initialGreeting]);
      aiCacheService.saveChatMessage(initialGreeting);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, role]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string, action?: { label: string; path: string }) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      userRole: role,
      content: promptText.trim(),
      timestamp: new Date().toISOString(),
      suggestedAction: action,
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    aiCacheService.saveChatMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = updated.map((m) => ({ role: m.role, content: m.content }));
      const reply = await geminiService.askSkillBridgeAI(
        userMsg.content,
        role,
        historyPayload,
        { studentProfile, jobs }
      );

      const aiMsg: AiChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        userRole: role,
        content: reply,
        timestamp: new Date().toISOString(),
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, aiMsg]);
      aiCacheService.saveChatMessage(aiMsg);
    } catch (err) {
      const errorMsg: AiChatMessage = {
        id: `ai_err_${Date.now()}`,
        role: 'assistant',
        userRole: role,
        content: 'I encountered an unexpected issue connecting to the AI service. Switching to resilient local analysis. Try asking about your core skills, DSA roadmap, or internship matches!',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    aiCacheService.clearChatHistory(role);
    const greeting: AiChatMessage = {
      id: `greeting_${Date.now()}`,
      role: 'assistant',
      userRole: role,
      content: getRoleGreeting(),
      timestamp: new Date().toISOString(),
    };
    setMessages([greeting]);
    aiCacheService.saveChatMessage(greeting);
  };

  return (
    <div
      id="ai-assistant-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-md h-[92vh] sm:h-[680px] bg-white dark:bg-[#121319] border border-gray-200 dark:border-white/10 sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-200 font-sans">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/80 dark:bg-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#84B000] to-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                  SkillBridge AI
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  {role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Assistant Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="clear-chat-history-btn"
              onClick={handleClear}
              title="Clear Conversation"
              className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              id="close-ai-chat-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#181920] text-white dark:bg-white dark:text-gray-900 font-medium rounded-br-xs shadow-xs'
                    : 'bg-gray-100/90 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-xs'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-xs dark:prose-invert max-w-none space-y-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div>{m.content}</div>
                )}

                {/* Quick Action Button if provided */}
                {m.suggestedAction && (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(m.suggestedAction!.path);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4F73C] text-[#111216] font-bold text-[11px] hover:bg-[#c4e82b] transition-all shadow-xs cursor-pointer"
                  >
                    <span>{m.suggestedAction.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-2xl p-3 bg-gray-100/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] font-semibold">SkillBridge AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Carousel */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <span className="text-gray-400 font-bold shrink-0 text-[10px] uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#84B000] dark:text-[#D4F73C]" />
              Prompts:
            </span>
            {getSuggestedPrompts().map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text, p.action)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/25 text-gray-700 dark:text-gray-300 font-medium transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {p.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="p-3 bg-white dark:bg-[#121319] border-t border-gray-100 dark:border-white/5 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SkillBridge AI anything..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-gray-400 dark:focus:border-white/30 transition-all font-medium"
            />
            <button
              id="send-ai-message-btn"
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
