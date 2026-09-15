import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCheck,
  Bell,
  Briefcase,
  Award,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Real-time updates across academia & industry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="mark-all-read-btn"
                onClick={markAllNotificationsRead}
                className="p-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
              <button
                id="close-notifications-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs mt-1">You're all caught up with your ecosystem updates.</p>
              </div>
            ) : (
              notifications.map((item) => {
                let icon = <Info className="w-4 h-4 text-blue-500" />;
                if (item.type === 'interview' || item.type === 'application') {
                  icon = <Briefcase className="w-4 h-4 text-purple-500" />;
                } else if (item.type === 'verification') {
                  icon = <Award className="w-4 h-4 text-emerald-500" />;
                } else if (item.type === 'mentorship') {
                  icon = <Calendar className="w-4 h-4 text-amber-500" />;
                } else if (item.type === 'ai_recommendation') {
                  icon = <Sparkles className="w-4 h-4 text-sky-500" />;
                }

                return (
                  <div
                    key={item.id}
                    id={`notif-${item.id}`}
                    onClick={() => {
                      markNotificationRead(item.id);
                      if (item.type === 'interview' || item.type === 'application') {
                        setActiveTab('applications');
                        onClose();
                      } else if (item.type === 'verification') {
                        setActiveTab('portfolio');
                        onClose();
                      } else if (item.type === 'mentorship') {
                        setActiveTab('mentorship');
                        onClose();
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      item.read
                        ? 'bg-gray-50/50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800/80 opacity-70'
                        : 'bg-white dark:bg-gray-800/90 border-blue-200 dark:border-blue-800/80 shadow-xs'
                    } hover:border-blue-400 dark:hover:border-blue-500`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/80 shrink-0 mt-0.5">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed font-normal">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
