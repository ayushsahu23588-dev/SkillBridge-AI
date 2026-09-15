import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  BookOpen,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const FacultyDashboard: React.FC = () => {
  const {
    studentProfile,
    mentorships,
    verifyStudentCertificate,
    setActiveTab,
    isDarkMode,
  } = useApp();

  const pendingCerts = studentProfile.certifications.filter((c) => !c.verified);
  const pendingMentors = mentorships.filter((m) => m.status === 'Requested');

  const cohortReadinessData = [
    { department: 'CS & Eng', avgScore: 88, placedPct: 92 },
    { department: 'AI & Data', avgScore: 91, placedPct: 95 },
    { department: 'ECE & IoT', avgScore: 82, placedPct: 84 },
    { department: 'Information Tech', avgScore: 85, placedPct: 89 },
    { department: 'Mechanical AI', avgScore: 76, placedPct: 78 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-blue-900/40 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Institutional Faculty & Mentor Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Department Faculty & Mentorship Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Review student micro-credentials, endorse candidate skill proficiencies, and conduct 1-on-1 industry placement coaching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="view-cert-approvals-btn"
            onClick={() => setActiveTab('verifications')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Verify Certificates ({pendingCerts.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Department Cohort
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">348</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Active engineering candidates
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Pending Cert Approvals
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {pendingCerts.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting institutional stamp
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Mentorship Requests
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {pendingMentors.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              1-on-1 office hour requests
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Avg Industry Readiness
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              87.4%
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              +11.2% over previous academic year
            </p>
          </div>
        </div>
      </div>

      {/* Department Cohort Readiness Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Department Cohort Readiness & Placement Conversion
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Verified skills index vs. enterprise placement rates
            </p>
          </div>
          <button
            onClick={() => setActiveTab('students_monitor')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Inspect All Students</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohortReadinessData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis
                dataKey="department"
                tick={{ fill: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: 11 }}
              />
              <YAxis domain={[0, 100]} tick={{ fill: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="avgScore" fill="#3B82F6" name="Avg Readiness Score" radius={[6, 6, 0, 0]} />
              <Bar dataKey="placedPct" fill="#10B981" name="Placement %" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Action Quick Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Approvals Queue */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Pending Certificate Approvals ({pendingCerts.length})
            </h3>
            <button
              onClick={() => setActiveTab('verifications')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View Full Queue
            </button>
          </div>

          {pendingCerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              All student certificates are verified and up to date!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCerts.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{c.title}</h4>
                    <p className="text-[11px] text-gray-500">
                      {studentProfile.name} • {c.issuer}
                    </p>
                  </div>

                  <button
                    onClick={() => verifyStudentCertificate(c.id, 'Dr. Evelyn Vance')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    Verify & Stamp
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentorship Slot Requests */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Office Hour Requests ({pendingMentors.length})
            </h3>
            <button
              onClick={() => setActiveTab('mentorship_queue')}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Manage Schedule
            </button>
          </div>

          {pendingMentors.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No pending mentorship booking requests.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMentors.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{m.topic}</h4>
                    <p className="text-[11px] text-gray-500">
                      From {m.studentName} • {m.scheduledDate} ({m.timeSlot})
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('mentorship_queue')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    Confirm Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
