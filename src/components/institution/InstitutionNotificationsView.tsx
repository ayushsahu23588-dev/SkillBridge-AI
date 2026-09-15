import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
  Check,
  Bell,
} from 'lucide-react';

export const InstitutionNotificationsView: React.FC = () => {
  const { addNotification, currentUser, isDarkMode, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Students');
  const [category, setCategory] = useState('Placement Drive');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');

  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: 'bc_1',
      title: 'Google India Campus Recruitment Drive Announcement',
      message: 'Registrations open for B.Tech Class of 2026. Online coding assessment scheduled for this Saturday at 10:00 AM.',
      audience: 'Class of 2026 (Final Year)',
      category: 'Placement Drive',
      priority: 'Urgent',
      timestamp: 'Today at 09:30 AM',
      reachCount: 380,
    },
    {
      id: 'bc_2',
      title: 'Mandatory Industry Skill Assessment Week',
      message: 'All 3rd and 4th year students must complete the Cloud Computing & Data Structures benchmark on SkillBridge.',
      audience: '3rd & 4th Year Students',
      category: 'Skill Assessment',
      priority: 'Important',
      timestamp: 'Yesterday at 04:15 PM',
      reachCount: 750,
    },
    {
      id: 'bc_3',
      title: 'Faculty FDP on AI Agents & LLM Development',
      message: 'Nominations invited for the 2-week AICTE approved Faculty Development Program partnered with Microsoft India.',
      audience: 'All Faculty Members',
      category: 'Academic Notice',
      priority: 'Normal',
      timestamp: '3 days ago',
      reachCount: 82,
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please enter both a title and message body for the notification', 'error');
      return;
    }

    // Direct integration with AppContext addNotification
    addNotification({
      userId: currentUser?.id || 'college_admin',
      title: `[${category.toUpperCase()}] ${title}`,
      message: `${message} (Target: ${targetAudience})`,
      type: priority === 'Urgent' ? 'verification' : 'system',
    });

    const newBroadcast = {
      id: `bc_${Date.now()}`,
      title,
      message,
      audience: targetAudience,
      category,
      priority,
      timestamp: 'Just now',
      reachCount: targetAudience.includes('Faculty') ? 82 : 450,
    };

    setBroadcastHistory([newBroadcast, ...broadcastHistory]);
    setTitle('');
    setMessage('');
    showToast(`Broadcast notification dispatched to ${targetAudience}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-lime-400" />
            <span>Targeted Institutional Broadcast Center</span>
          </h2>
          <p className="text-xs text-gray-400">
            Dispatch official announcements, placement notices, and academic alerts directly to student and faculty portals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Broadcast Form */}
        <div
          className={`lg:col-span-7 rounded-2xl p-6 border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5 mb-4">
            <h3 className="text-base font-bold tracking-tight">Compose Announcement</h3>
            <span className="text-xs text-gray-400">Multi-Channel In-App Dispatch</span>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Announcement Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Campus Placement Drive: Amazon India Software Development Engineer"
                className={`w-full p-2.5 rounded-xl border outline-none focus:ring-1 focus:ring-lime-400 transition-colors ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={`w-full p-2 rounded-xl border outline-none cursor-pointer ${
                    isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="All Students">All Students ({450})</option>
                  <option value="Class of 2026 (Final Year)">Class of 2026 (Final Year)</option>
                  <option value="Class of 2027 (Pre-Final)">Class of 2027 (Pre-Final)</option>
                  <option value="Placement Eligible Cohort">Placement Eligible Cohort</option>
                  <option value="CSE & IT Departments">CSE & IT Departments</option>
                  <option value="All Faculty Members">All Faculty Members (82)</option>
                  <option value="Corporate Industry Partners">Corporate Industry Partners</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notice Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-2 rounded-xl border outline-none cursor-pointer ${
                    isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="Placement Drive">Placement Drive</option>
                  <option value="Skill Assessment">Skill Assessment</option>
                  <option value="Internship Approval">Internship Approval</option>
                  <option value="Technical Workshop">Technical Workshop</option>
                  <option value="Academic Notice">Academic Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Urgency Priority</label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className={`w-full p-2 rounded-xl border outline-none cursor-pointer ${
                    isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="Important">Important (Banner)</option>
                  <option value="Urgent">Urgent (Immediate Alert)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Announcement Content *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed instructions, eligibility criteria, date deadlines, and link references..."
                className={`w-full p-2.5 rounded-xl border outline-none focus:ring-1 focus:ring-lime-400 transition-colors ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            {/* Instant Preview Box */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                Live Broadcast Preview
              </span>
              <div className="font-bold text-gray-900 dark:text-white">
                {title || 'Announcement Headline Preview'}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                {message || 'The full message content will be formatted and delivered to user notification drawers instantly.'}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-semibold">
                <span>Audience: {targetAudience}</span>
                <span>•</span>
                <span>Priority: {priority}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Broadcast Notice</span>
              </button>
            </div>
          </form>
        </div>

        {/* Broadcast History */}
        <div
          className={`lg:col-span-5 rounded-2xl p-6 border flex flex-col justify-between transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5 mb-4">
              <h3 className="text-base font-bold tracking-tight">Broadcast Audit Log</h3>
              <span className="text-xs text-gray-400">Recent Dispatches</span>
            </div>

            <div className="space-y-3">
              {broadcastHistory.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-white/5 space-y-1 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-900 dark:text-white leading-snug">
                      {b.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        b.priority === 'Urgent'
                          ? 'bg-rose-500/10 text-rose-500'
                          : b.priority === 'Important'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {b.priority}
                    </span>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-[11px] line-clamp-2">
                    {b.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400 border-t border-gray-100 dark:border-white/5 mt-2">
                    <span>{b.audience}</span>
                    <span>Delivered to {b.reachCount} users • {b.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-[11px] text-gray-400 text-center">
            All notifications are persisted to institutional audit records.
          </div>
        </div>
      </div>
    </div>
  );
};
