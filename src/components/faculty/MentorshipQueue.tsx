import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  ExternalLink,
  X,
  Sparkles,
  Users,
} from 'lucide-react';

export const MentorshipQueue: React.FC = () => {
  const { mentorships, updateMentorshipStatus, showToast } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Faculty Office Hours
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            1-on-1 Student Mentorship & Coaching Schedule
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Approve slot requests, auto-generate secure WebRTC room links, and track advisory milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">
              Total Sessions
            </span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {mentorships.length}
            </span>
          </div>
        </div>
      </div>

      {/* List of sessions */}
      <div className="space-y-4">
        {mentorships.map((session) => (
          <div
            key={session.id}
            id={`mentor-session-${session.id}`}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      session.status === 'Scheduled'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : session.status === 'Requested'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {session.status}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {session.scheduledDate} • {session.timeSlot}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{session.topic}</h3>
                <p className="text-xs text-gray-500">
                  Student: <span className="font-semibold text-gray-800 dark:text-gray-200">{session.studentName}</span>
                </p>

                {session.meetingLink && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold pt-1">
                    <Video className="w-3.5 h-3.5" /> Room: {session.meetingLink}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {session.status === 'Requested' ? (
                <>
                  <button
                    onClick={() =>
                      updateMentorshipStatus(
                        session.id,
                        'Scheduled',
                        'https://meet.edubridge.ai/room/' + session.id
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Approve & Link Room
                  </button>
                  <button
                    onClick={() => updateMentorshipStatus(session.id, 'Declined')}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    Decline
                  </button>
                </>
              ) : session.status === 'Scheduled' ? (
                <button
                  onClick={() => updateMentorshipStatus(session.id, 'Completed')}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors"
                >
                  Mark as Completed ✓
                </button>
              ) : (
                <span className="text-xs text-gray-400 font-semibold">Session Concluded</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
