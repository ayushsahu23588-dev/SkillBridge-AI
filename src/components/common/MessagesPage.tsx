import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Video,
  Info,
  CheckCheck,
  Paperclip,
  Smile,
  MoreVertical,
  User,
  Building2,
  GraduationCap,
  Circle,
  Clock,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Bot,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const {
    directConversations,
    sendDirectMessage,
    currentUser,
    currentRole,
    isDarkMode,
    showToast,
  } = useApp();

  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    directConversations[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'mentor' | 'recruiter' | 'faculty'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    directConversations.find((c) => c.id === selectedConversationId) || directConversations[0];

  const filteredConversations = directConversations.filter((c) => {
    const matchesQuery =
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (filterRole === 'all') return true;
    if (filterRole === 'mentor') return c.contactRole.toLowerCase().includes('mentor');
    if (filterRole === 'recruiter') return c.contactRole.toLowerCase().includes('recruiter') || c.contactRole.toLowerCase().includes('talent');
    if (filterRole === 'faculty') return c.contactRole.toLowerCase().includes('professor') || c.contactRole.toLowerCase().includes('faculty') || c.contactRole.toLowerCase().includes('dean');
    return true;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    sendDirectMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const getRoleIcon = (roleText: string) => {
    const lower = roleText.toLowerCase();
    if (lower.includes('recruiter') || lower.includes('talent')) {
      return <Briefcase className="w-3 h-3 text-purple-500" />;
    }
    if (lower.includes('professor') || lower.includes('faculty') || lower.includes('dean')) {
      return <GraduationCap className="w-3 h-3 text-emerald-500" />;
    }
    return <User className="w-3 h-3 text-blue-500" />;
  };

  return (
    <div
      className="h-[calc(100vh-6.5rem)] flex flex-col rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14151B] shadow-sm overflow-hidden"
      id="messages-page-root"
    >
      {/* Top Banner / Breadcrumb */}
      <div className="px-6 py-3.5 border-b border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#D4F73C]/20 dark:bg-[#D4F73C]/10 text-[#2f4d07] dark:text-[#D4F73C] flex items-center justify-center border border-[#D4F73C]/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              Messages & Direct Communications
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Direct discussions with university mentors, industry talent recruiters, and faculty
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
            Live Network Active
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Conversations List & Right Chat Window */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar: Conversations Directory */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-white/10 flex flex-col bg-white dark:bg-[#14151B] shrink-0 ${
            mobileConversationOpen ? 'hidden md:flex' : 'flex'
          }`}
          id="conversations-sidebar"
        >
          {/* Search & Filter Bar */}
          <div className="p-3.5 border-b border-gray-200 dark:border-white/10 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors, recruiters, chats..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[#D4F73C] text-gray-900 dark:text-white placeholder-gray-400 outline-hidden transition-all"
                id="search-conversations-input"
              />
            </div>

            {/* Role Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {(['all', 'recruiter', 'faculty', 'mentor'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterRole(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    filterRole === cat
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xs'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeConversation?.id;
                return (
                  <button
                    key={c.id}
                    id={`conversation-item-${c.id}`}
                    onClick={() => {
                      setSelectedConversationId(c.id);
                      setMobileConversationOpen(true);
                    }}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-white/10 border-l-3 border-[#D4F73C]'
                        : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.contactAvatar}
                        alt={c.contactName}
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-black/10 dark:ring-white/10"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#14151B]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {c.contactName}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                          {c.lastTimestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        {getRoleIcon(c.contactRole)}
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                          {c.contactRole}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-1">
                        {c.lastMessage}
                      </p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Conversation */}
        <div
          className={`flex-1 flex flex-col bg-gray-50/40 dark:bg-[#121318] min-w-0 ${
            mobileConversationOpen ? 'flex' : 'hidden md:flex'
          }`}
          id="active-chat-container"
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#14151B] flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileConversationOpen(false)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={activeConversation.contactAvatar}
                      alt={activeConversation.contactName}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#D4F73C]/50"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#14151B]" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
                      {activeConversation.contactName}
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {getRoleIcon(activeConversation.contactRole)}
                        {activeConversation.contactRole}
                      </span>
                    </h2>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active now • Academic / Industry Verified
                    </p>
                  </div>
                </div>

                {/* Communication Action Shortcuts */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => showToast(`Initiating encrypted voice call with ${activeConversation.contactName}...`, 'info')}
                    className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    title="Audio Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast(`Opening secure video conference room with ${activeConversation.contactName}...`, 'info')}
                    className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    title="Video Meeting"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast(`Profile info for ${activeConversation.contactName}: Verified SkillBridge collaborator.`, 'info')}
                    className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    title="Conversation Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                id="chat-messages-stream"
              >
                {/* Security encryption notice */}
                <div className="text-center py-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium bg-gray-200/70 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                    <Sparkles className="w-3 h-3 text-[#D4F73C]" />
                    SkillBridge verified messaging. All academic and placement records are protected.
                  </span>
                </div>

                {activeConversation.messages.map((msg) => {
                  const isSelf = msg.isSelf;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                        {!isSelf && (
                          <img
                            src={activeConversation.contactAvatar}
                            alt=""
                            className="w-7 h-7 rounded-xl object-cover shrink-0 mb-1"
                          />
                        )}

                        <div
                          className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs ${
                            isSelf
                              ? 'bg-gray-900 dark:bg-[#D4F73C] text-white dark:text-[#121316] font-medium rounded-br-xs'
                              : 'bg-white dark:bg-[#1C1D24] text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-white/10 rounded-bl-xs'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1 ${
                          isSelf ? 'justify-end' : 'justify-start pl-9'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isSelf && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-white dark:bg-[#14151B] border-t border-gray-200 dark:border-white/10 flex items-center gap-2"
                id="send-message-form"
              >
                <button
                  type="button"
                  onClick={() => showToast('Attach portfolio or resume attachment.', 'info')}
                  className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${activeConversation.contactName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[#D4F73C] text-gray-900 dark:text-white placeholder-gray-400 outline-hidden transition-all"
                  id="message-input-field"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c2e430] text-[#121316] font-bold text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  id="send-message-btn"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                No Active Conversation Selected
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                Choose a conversation from the left sidebar to communicate directly with mentors and recruiters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
