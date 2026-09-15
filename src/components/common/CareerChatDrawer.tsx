import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  X,
  Send,
  Bot,
  Sparkles,
  User,
  Loader2,
  RefreshCw,
  Lightbulb,
  Compass,
} from 'lucide-react';

interface CareerChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const CareerChatDrawer: React.FC<CareerChatDrawerProps> = ({ isOpen, onClose }) => {
  const { studentProfile, jobs } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${studentProfile.name.split(' ')[0]}! I'm your AI Academia–Industry Career Advisor. 
I have access to your skill profile (${studentProfile.skills.length} skills, ${studentProfile.industryReadinessScore}% readiness) and current industry hiring trends.

How can I help you today? You can ask me to:
• Review your skill gaps for a dream job
• Generate tailored STAR interview talking points
• Suggest high-impact project additions
• Explain cloud & backend architecture concepts`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
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

      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await aiService.chatWithAdvisor(history, studentContext);

      const aiMsg: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error connecting to the AI service. Here is a high-priority tip: Focus on building end-to-end full stack projects with Next.js and Redis caching to boost your placement readiness!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How do I stand out for NovaCloud Systems?',
    'What are the top 3 missing skills for Senior Full-Stack roles?',
    'Give me a 30-second elevator pitch based on my projects.',
    'How should I explain my Raft-consensus project in an interview?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col h-full z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                  EduBridge AI Advisor
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  AI Copilot
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Personalized Career & Placement Copilot
              </p>
            </div>
          </div>

          <button
            id="close-career-chat-drawer"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-gray-100/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 rounded-tl-xs border border-gray-200/50 dark:border-gray-700/50 whitespace-pre-line'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`text-[9px] mt-1.5 text-right ${
                      isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 text-xs text-gray-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span>Analyzing student profile & generating guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-2 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/50 flex gap-1.5 overflow-x-auto">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 text-gray-700 dark:text-gray-300 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="career-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about skills, resumes, interviews, or career paths..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              id="send-career-chat-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
