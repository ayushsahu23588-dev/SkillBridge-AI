import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  BookOpen,
  Briefcase,
  Users,
} from 'lucide-react';

export const StudentCalendarView: React.FC = () => {
  const { applications, mentorships, workshops, setActiveTab } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Interviews' | 'Mentorship' | 'Workshops'>('All');

  // Aggregated Schedule Items
  const scheduledInterviews = applications
    .filter((a) => a.interviewDate || a.status === 'Interview Scheduled' || a.status === 'Technical Round')
    .map((a) => ({
      id: `int_${a.id}`,
      title: `Technical Panel: ${a.jobTitle}`,
      organizer: a.companyName,
      type: 'Interview',
      date: a.interviewDate || 'Tomorrow',
      time: '10:00 AM - 11:00 AM PST',
      link: 'https://meet.google.com/abc-xyz-recruit',
      status: 'Confirmed',
      icon: Briefcase,
      color: 'bg-emerald-500',
    }));

  const scheduledMentorships = mentorships.map((m) => ({
    id: `men_${m.id}`,
    title: `Mentorship: ${m.topic}`,
    organizer: m.facultyName,
    type: 'Mentorship',
    date: m.date,
    time: m.time,
    link: m.meetingLink || 'https://meet.edubridge.ai/room/' + m.id,
    status: m.status,
    icon: Users,
    color: 'bg-blue-500',
  }));

  const scheduledWorkshops = workshops.map((w) => ({
    id: `ws_${w.id}`,
    title: `Masterclass: ${w.title}`,
    organizer: `${w.instructorName} (${w.company})`,
    type: 'Workshop',
    date: w.date,
    time: w.time,
    link: 'https://edubridge.ai/live/' + w.id,
    status: 'Enrolled',
    icon: BookOpen,
    color: 'bg-indigo-500',
  }));

  const allEvents = [...scheduledInterviews, ...scheduledMentorships, ...scheduledWorkshops];

  const filteredEvents = allEvents.filter((ev) => {
    if (selectedFilter === 'Interviews') return ev.type === 'Interview';
    if (selectedFilter === 'Mentorship') return ev.type === 'Mentorship';
    if (selectedFilter === 'Workshops') return ev.type === 'Workshop';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Schedule & Recruitment Deadlines
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
            Integrated calendar for technical interviews, 1-on-1 faculty mentorship, and masterclasses
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 self-start sm:self-auto">
          {(['All', 'Interviews', 'Mentorship', 'Workshops'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left = Upcoming Agenda Cards, Right = Mini Monthly View & Sync Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agenda List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Upcoming Events ({filteredEvents.length})
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Timezone: America/Los_Angeles (PST)
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((ev) => {
              const Icon = ev.icon;
              return (
                <div
                  key={ev.id}
                  className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${ev.color} text-white shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {ev.type}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            ev.status === 'Confirmed' || ev.status === 'Enrolled' || ev.status === 'Scheduled'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600'
                          }`}
                        >
                          ● {ev.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-normal">
                        Host: {ev.organizer}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-1 font-normal">
                        <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                          <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                          {ev.date}
                        </span>
                        <span className="flex items-center gap-1 tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {ev.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Google Calendar Sync & Quick Summary */}
        <div className="space-y-6">
          {/* Quick Schedule Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Weekly Overview
              </span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>

            <div>
              <div className="text-3xl font-bold tracking-tight tabular-nums">{filteredEvents.length} Sessions</div>
              <p className="text-xs text-blue-100 mt-1 font-normal">
                Scheduled across interviews, faculty coaching & live masterclasses this week.
              </p>
            </div>

            <div className="pt-2 border-t border-white/20 grid grid-cols-3 gap-2 text-center text-xs font-normal">
              <div className="p-2 rounded-xl bg-white/10">
                <div className="font-semibold tabular-nums">{scheduledInterviews.length}</div>
                <div className="text-[10px] text-blue-200 font-medium">Interviews</div>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <div className="font-semibold tabular-nums">{scheduledMentorships.length}</div>
                <div className="text-[10px] text-blue-200 font-medium">Mentors</div>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <div className="font-semibold tabular-nums">{scheduledWorkshops.length}</div>
                <div className="text-[10px] text-blue-200 font-medium">Classes</div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Direct Quick Links
            </h4>
            <button
              type="button"
              onClick={() => setActiveTab('mentorship')}
              className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 text-left text-xs font-medium text-gray-900 dark:text-white flex items-center justify-between transition-colors"
            >
              <span>Book 1-on-1 Faculty Mentorship</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interview_trainer')}
              className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 text-left text-xs font-medium text-gray-900 dark:text-white flex items-center justify-between transition-colors"
            >
              <span>Practice AI Mock Interview Now</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
