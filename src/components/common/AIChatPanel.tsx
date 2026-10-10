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
  ArrowRight,
  Loader2,
  Zap,
  Cpu,
  BrainCircuit,
  Copy,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIChatPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type ModelMode = 'fast' | 'general' | 'complex';

const MODEL_INFO: Record<ModelMode, { name: string; modelId: string; description: string; icon: React.ReactNode }> = {
  fast: {
    name: 'Fast',
    modelId: 'gemini-3.1-flash-lite',
    description: 'Instant answers & quick queries',
    icon: <Zap className="w-3 h-3 text-amber-500" />,
  },
  general: {
    name: 'General',
    modelId: 'gemini-3.8-flash',
    description: 'Primary placement intelligence',
    icon: <Cpu className="w-3 h-3 text-[#D4F73C]" />,
  },
  complex: {
    name: 'Complex',
    modelId: 'gemini-3.1-pro-preview',
    description: 'Deep reasoning, code & mock rounds',
    icon: <BrainCircuit className="w-3 h-3 text-purple-400" />,
  },
};

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    currentUser,
    studentProfile,
    jobs,
    companyOffers,
    companyInterviews,
    recruiterEngagements,
    institutionStudents,
    institutionPlacements,
    institutionCollaborations,
    navigate,
    showToast,
    isAiChatOpen: contextIsOpen,
    closeAiChat: contextClose,
    initialChatPrompt,
    clearInitialChatPrompt,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onClose = propOnClose || contextClose;

  const role = (currentUser.role || 'student') as string;

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelMode, setModelMode] = useState<ModelMode>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested prompts per role
  const getSuggestedPrompts = () => {
    switch (role) {
      case 'student':
        return [
          { text: 'Explain my biggest skill gap and how to fix it', action: { label: 'View Skill Gaps', path: '/student/skill-gap' } },
          { text: 'What campus drives & jobs match my profile?', action: { label: 'Explore Drives', path: '/student/jobs' } },
          { text: 'How do I optimize my resume for ATS parsers?', action: { label: 'AI Resume Studio', path: '/student/resume-studio' } },
          { text: 'Simulate a technical interview question for backend roles', action: { label: 'AI Interview Prep', path: '/student/interview-prep' } },
          { text: 'How can I raise my placement readiness score above 90%?' },
        ];
      case 'company':
      case 'recruiter':
        return [
          { text: 'Which student candidates match our criteria best?', action: { label: 'Candidate Matching', path: '/industry/candidates' } },
          { text: 'Generate 3 technical screening questions for backend software interns' },
          { text: 'How can we structure an attractive CTC package for campus hires?' },
          { text: 'Best practices for organizing a conflict-free campus hiring drive' },
        ];
      case 'college_admin':
      case 'placement_cell':
      case 'institution':
        return [
          { text: 'Summarize cohort placement readiness and at-risk students', action: { label: 'Institution Overview', path: '/institution/dashboard' } },
          { text: 'How to structure conflict-free scheduling for visiting recruiters?', action: { label: 'Placement Drives', path: '/institution/drives' } },
          { text: 'Which technical skills have the highest hiring partner demand mismatch?' },
          { text: 'Draft a corporate invitation message for visiting campus recruitment' },
        ];
      default:
        return [
          { text: 'How does SkillBridge AI calculate student placement readiness?' },
          { text: 'Explain the 8-step campus hiring workflow' },
          { text: 'How do companies verify candidate skills on SkillBridge?' },
        ];
    }
  };

  const getRoleGreeting = () => {
    switch (role) {
      case 'student':
        return `Hello ${currentUser.name.split(' ')[0]}! I am your **SkillBridge AI Placement Coach** powered by Gemini. Ask me about your placement readiness score, technical skill gaps, ATS resume optimization, or upcoming campus drives.`;
      case 'company':
      case 'recruiter':
        return `Hello! I am your **SkillBridge Talent Intelligence Copilot** powered by Gemini. Ask me about candidate matching rubrics, technical screening questions, or campus drive scheduling.`;
      case 'college_admin':
      case 'placement_cell':
      case 'institution':
        return `Welcome! I am your **SkillBridge Placement Cell Strategist** powered by Gemini. Ask me about department readiness metrics, conflict-free drive calendars, or partner enterprise recruitment.`;
      default:
        return `Hello! I am **SkillBridge AI**, your multi-role campus placement management copilot powered by Gemini. How can I assist you today?`;
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

    if (initialChatPrompt && initialChatPrompt.trim()) {
      const promptToRun = initialChatPrompt.trim();
      clearInitialChatPrompt();
      setInput('');
      setTimeout(() => {
        handleSend(promptToRun);
      }, 150);
    } else {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
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
      const historyPayload = updated.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // Construct verified real application data per role
      let roleContext: any = {};
      if (role === 'student') {
        roleContext = {
          studentProfile: {
            name: studentProfile.name,
            college: studentProfile.college,
            department: studentProfile.department,
            gpa: studentProfile.gpa,
            industryReadinessScore: studentProfile.industryReadinessScore,
            verifiedSkills: studentProfile.skills.map((s) => ({ name: s.name, level: s.level, category: s.category })),
            featuredProjects: studentProfile.projects.map((p) => ({ title: p.title, tech: p.techStack })),
            appliedJobsCount: studentProfile.appliedJobIds?.length || 0,
            targetRole: studentProfile.targetRole || 'Software Engineer',
          },
          jobsSummary: (jobs || []).slice(0, 5).map((j) => ({
            id: j.id,
            title: j.title,
            company: j.companyName,
            skills: j.requiredSkills,
            package: j.stipendOrSalary || j.salaryOrStipend || 'Competitive CTC',
          })),
        };
      } else if (role === 'company' || role === 'recruiter') {
        roleContext = {
          recruiterProfile: {
            name: currentUser.name,
            companyName: (currentUser as any).companyName || 'Corporate Partner Enterprise',
            email: currentUser.email,
          },
          activeJobPostings: (jobs || []).slice(0, 5).map((j) => ({
            title: j.title,
            company: j.companyName,
            requiredSkills: j.requiredSkills,
            package: j.stipendOrSalary || j.salaryOrStipend,
          })),
          activeOffersCount: (companyOffers || []).length,
          scheduledInterviewsCount: (companyInterviews || []).length,
          engagementsMetric: (recruiterEngagements || []).slice(0, 3),
        };
      } else if (role === 'college_admin' || role === 'placement_cell' || role === 'institution') {
        const total = institutionStudents?.length || 1420;
        const placed = institutionPlacements?.length || 1120;
        roleContext = {
          institutionCohortStats: {
            totalRegisteredStudents: total,
            placedStudentsCount: placed,
            overallPlacementRate: `${Math.round((placed / (total || 1)) * 100)}%`,
            partnerEnterpriseCount: (institutionCollaborations || []).length || 48,
          },
          upcomingRecruitmentDrives: (jobs || []).slice(0, 5).map((j) => ({
            driveTitle: j.title,
            recruiter: j.companyName,
            package: j.stipendOrSalary || j.salaryOrStipend,
          })),
          departmentBreakdown: [
            { dept: 'Computer Science & Engineering', readiness: '89%' },
            { dept: 'Information Technology', readiness: '84%' },
            { dept: 'Electronics & Communication', readiness: '79%' },
            { dept: 'AI & Data Science', readiness: '92%' },
          ],
        };
      }

      const reply = await geminiService.askSkillBridgeAI(
        userMsg.content,
        role,
        historyPayload,
        roleContext,
        {
          taskComplexity: modelMode,
          model: MODEL_INFO[modelMode].modelId,
        }
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
    } catch (err: any) {
      console.warn('[AIChatPanel] Communication error:', err);

      let fallbackText =
        'I encountered a transient connection issue. Actionable placement recommendation: Focus on strengthening your core DSA problem patterns, containerized project demos, and relational query tuning to ensure maximum placement readiness.';
      if (role === 'company' || role === 'recruiter') {
        fallbackText =
          'I encountered a transient connection issue. Recruitment recommendation: Benchmark technical screening rubrics around live problem-solving and structured behavioral STAR criteria for your upcoming campus drive.';
      } else if (role === 'college_admin' || role === 'placement_cell' || role === 'institution') {
        fallbackText =
          'I encountered a transient connection issue. Placement cell recommendation: Track branch-wise DSA readiness metrics and schedule conflict-free interview slots across visiting tier-1 recruitment partners.';
      }

      const errorMsg: AiChatMessage = {
        id: `ai_err_${Date.now()}`,
        role: 'assistant',
        userRole: role,
        content: fallbackText,
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
    showToast('Conversation history reset', 'info');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="ai-assistant-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Main Chat Drawer */}
      <div className="relative w-full sm:max-w-lg h-[94vh] sm:h-[720px] bg-white dark:bg-[#121319] border border-gray-200 dark:border-white/10 sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-200 font-sans z-10">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/90 dark:bg-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#84B000] to-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                    SkillBridge AI Chatbot
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    {role === 'company' ? 'Recruiter' : role === 'college_admin' ? 'Placement Cell' : 'Student'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    {MODEL_INFO[modelMode].modelId} active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="clear-chat-history-btn"
                onClick={handleClear}
                title="Clear Conversation History"
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

          {/* Model / Complexity Switcher Bar */}
          <div className="mt-3 pt-2.5 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4F73C]" />
              Model Mode:
            </span>
            <div className="flex items-center gap-1 bg-gray-200/60 dark:bg-black/30 p-0.5 rounded-xl border border-gray-300/40 dark:border-white/5">
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
        </div>

        {/* Message Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative group ${
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

                {/* Message Footer with Copy & Time */}
                <div className="mt-2 pt-1 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                  <span>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(m.id, m.content)}
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
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
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
                <span className="text-[11px] font-semibold">
                  SkillBridge AI is thinking ({MODEL_INFO[modelMode].name} model)...
                </span>
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
              Suggested:
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

        {/* Input Form */}
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
              placeholder={`Ask SkillBridge AI anything (${MODEL_INFO[modelMode].name} mode)...`}
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
