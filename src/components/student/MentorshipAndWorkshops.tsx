import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  BookOpen,
  Users,
  Video,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  X,
  MessageSquare,
} from 'lucide-react';

export const MentorshipAndWorkshops: React.FC = () => {
  const {
    facultyMembers,
    mentorships,
    workshops,
    requestMentorship,
    registerForWorkshop,
    studentProfile,
    showToast,
  } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(facultyMembers[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('15:00 PST');

  const myMentorships = mentorships.filter((m) => m.studentId === studentProfile.id);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast('Please specify the discussion topic.', 'error');
      return;
    }
    requestMentorship(selectedFacultyId, topic, date, time);
    setTopic('');
    setBookingModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-200/60 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            Academia–Industry Mentorship Network
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            1-on-1 Faculty Mentorship & Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Book office hour sessions with specialized professors and enroll in live enterprise masterclasses hosted by industry partners.
          </p>
        </div>

        <button
          id="request-mentorship-btn"
          onClick={() => setBookingModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Mentorship Slot</span>
        </button>
      </div>

      {/* Active Mentorship Sessions */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Your Mentorship Sessions ({myMentorships.length})
        </h2>

        {myMentorships.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center text-gray-400 text-xs font-normal">
            No scheduled sessions yet. Click "Book Mentorship Slot" to request a session.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myMentorships.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        session.status === 'Scheduled'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : session.status === 'Requested'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {session.status}
                    </span>
                    <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white mt-1.5">
                      {session.topic}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      Mentor: {session.facultyName}
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white tabular-nums">
                      {session.scheduledDate}
                    </p>
                    <p className="text-gray-400 font-mono text-[11px] font-normal">{session.timeSlot}</p>
                  </div>
                </div>

                {session.meetingLink && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1 font-normal">
                      <Video className="w-3.5 h-3.5 text-blue-500" /> WebRTC Video Room
                    </span>
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Join Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Faculty Mentors Directory */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Institutional Faculty Mentors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facultyMembers.map((faculty) => (
            <div
              key={faculty.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={faculty.avatar}
                    alt={faculty.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                      {faculty.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {faculty.designation} • {faculty.department}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Research & Expertise:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faculty.expertise.map((exp, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 font-normal">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> Office Hours: {faculty.officeHours}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFacultyId(faculty.id);
                  setBookingModalOpen(true);
                }}
                className="w-full py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
              >
                Schedule Session
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Industry Masterclasses & Workshops */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          Industry Masterclasses & Technical Workshops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800">
                    {ws.mode} Session
                  </span>
                  <span className="text-xs font-mono text-gray-400 tabular-nums font-normal">{ws.date}</span>
                </div>

                <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white leading-snug">
                  {ws.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-normal">
                  Instructor: <span className="font-semibold text-gray-800 dark:text-gray-200">{ws.instructorName}</span> ({ws.instructorOrg})
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 leading-relaxed font-normal">
                  {ws.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ws.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-normal tabular-nums">
                  {ws.registeredCount} / {ws.capacity} Registered
                </span>

                <button
                  id={`register-workshop-btn-${ws.id}`}
                  onClick={() => registerForWorkshop(ws.id)}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Register (Free)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setBookingModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                Book 1-on-1 Mentorship Slot
              </h3>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Faculty Mentor
                </label>
                <select
                  value={selectedFacultyId}
                  onChange={(e) => setSelectedFacultyId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {facultyMembers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department} - {f.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session Topic / Discussion Goal *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Distributed Systems architecture review for upcoming interview"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Time Slot
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 15:30 PST"
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Request Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
