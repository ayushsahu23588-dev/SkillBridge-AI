import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Search,
  CheckCircle2,
  Bot,
  User,
  GraduationCap,
  Briefcase,
  Paperclip,
  Sparkles,
  MoreVertical,
  Phone,
  Video,
} from 'lucide-react';

export const StudentMessagingView: React.FC = () => {
  const { directConversations, sendDirectMessage, currentUser } = useApp();
  const [selectedId, setSelectedId] = useState<string>(
    directConversations[0]?.id || 'conv_1'
  );
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const activeConversation =
    directConversations.find((c) => c.id === selectedId) || directConversations[0];

  const filteredConversations = directConversations.filter(
    (c) =>
      c.contactName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.contactRole.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendDirectMessage(activeConversation.id, inputText);
    setInputText('');
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Bot') || role.includes('AI')) {
      return <Bot className="w-3.5 h-3.5 text-indigo-500" />;
    }
    if (role.includes('Faculty') || role.includes('Mentor')) {
      return <GraduationCap className="w-3.5 h-3.5 text-blue-500" />;
    }
    return <Briefcase className="w-3.5 h-3.5 text-emerald-500" />;
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col md:flex-row">
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
        {/* Search & Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Direct Messages
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {directConversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats & mentors..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-normal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversation?.id;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedId(conv.id)}
                className={`w-full p-3.5 text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                    : 'hover:bg-gray-100/60 dark:hover:bg-gray-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar || conv.contactAvatar}
                    alt={conv.contactName}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-semibold flex items-center justify-center tabular-nums">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {conv.contactName}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 font-normal tabular-nums">
                      {conv.lastTimestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                    {getRoleIcon(conv.contactRole)}
                    <span className="truncate">{conv.contactRole}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-1 font-normal">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Main Chat Panel */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.avatar || activeConversation.contactAvatar}
                alt={activeConversation.contactName}
                className="w-10 h-10 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                    {activeConversation.contactName}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {activeConversation.contactRole}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online & Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-400">
              <button
                type="button"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Video Room"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/30 dark:bg-gray-950/20">
            {activeConversation.messages.map((msg) => {
              const isSelf = msg.isSelf;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-[65%] p-3.5 rounded-2xl text-xs space-y-1 ${
                      isSelf
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200/70 dark:border-gray-700/60 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {!isSelf && (
                      <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {msg.senderName}
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap font-normal">{msg.text}</p>
                    <div
                      className={`text-[10px] text-right font-normal tabular-nums ${
                        isSelf ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Message ${activeConversation.contactName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
          Select a conversation to begin messaging
        </div>
      )}
    </div>
  );
};
