import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Video,
  Eye,
  Calendar,
  Sparkles,
  ChevronDown,
  X,
  Building,
  Download,
  Award,
} from 'lucide-react';

export type IndustryAppStatus =
  | 'New'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface ApplicationRecord {
  id: string;
  studentName: string;
  avatar: string;
  college: string;
  department: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: 'Internship' | 'Job' | 'Project';
  matchPercentage: number;
  appliedDate: string;
  status: IndustryAppStatus;
  coverNote?: string;
  resumeUrl?: string;
}

const DEFAULT_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app_1',
    studentName: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    college: 'Apex National Institute of Technology',
    department: 'Computer Science & Engineering',
    opportunityId: 'opp_1',
    opportunityTitle: 'Cloud Platform & Distributed Systems Intern',
    opportunityType: 'Internship',
    matchPercentage: 96,
    appliedDate: '2026-09-02',
    status: 'Under Review',
    coverNote: 'Passionate about distributed telemetry, Go, and Kubernetes architectures. Built an open-source rate limiter with 2k GitHub stars.',
  },
  {
    id: 'app_2',
    studentName: 'Riya Das',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    college: 'Apex National Institute of Technology',
    department: 'AI & Data Science',
    opportunityId: 'opp_1',
    opportunityTitle: 'Cloud Platform & Distributed Systems Intern',
    opportunityType: 'Internship',
    matchPercentage: 88,
    appliedDate: '2026-09-01',
    status: 'Shortlisted',
    coverNote: 'Experienced in ETL pipelines, Python, PostgreSQL, and predictive ML deployment.',
  },
  {
    id: 'app_3',
    studentName: 'Rahul Patnaik',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    college: 'Apex National Institute of Technology',
    department: 'Information Technology',
    opportunityId: 'opp_2',
    opportunityTitle: 'Full-Stack Software Development Engineer',
    opportunityType: 'Job',
    matchPercentage: 84,
    appliedDate: '2026-08-30',
    status: 'Interview',
    coverNote: 'Full-stack developer with 3 production React web apps and microservices backend in Spring Boot.',
  },
  {
    id: 'app_4',
    studentName: 'Ananya Singh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    college: 'Apex National Institute of Technology',
    department: 'Computer Science & Engineering',
    opportunityId: 'opp_3',
    opportunityTitle: 'Edge Computing & Telemetry Architecture',
    opportunityType: 'Project',
    matchPercentage: 92,
    appliedDate: '2026-08-28',
    status: 'New',
    coverNote: 'Interested in working on low-latency IoT pipelines and edge sensor telemetry processing.',
  },
  {
    id: 'app_5',
    studentName: 'Dev Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    college: 'Apex National Institute of Technology',
    department: 'Computer Science',
    opportunityId: 'opp_1',
    opportunityTitle: 'Cloud Platform & Distributed Systems Intern',
    opportunityType: 'Internship',
    matchPercentage: 81,
    appliedDate: '2026-08-25',
    status: 'Under Review',
    coverNote: 'Experience with Docker containers and Linux systems programming.',
  },
];

const STORAGE_KEY = 'skillbridge_industry_applications_v1';

export const IndustryApplicationsPage: React.FC = () => {
  const {
    industryOpportunities,
    shortlistCandidate,
    scheduleInterview,
    navigate,
    showToast,
  } = useApp();

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse applications from localStorage', e);
    }
    return DEFAULT_APPLICATIONS;
  });

  // Persist applications whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to persist applications to localStorage', e);
    }
  }, [applications]);

  // Filters
  const [activeTab, setActiveTab] = useState<
    'All' | 'New' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'
  >('All');
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>('All');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [viewingApp, setViewingApp] = useState<ApplicationRecord | null>(null);
  const [interviewingApp, setInterviewingApp] = useState<ApplicationRecord | null>(null);
  const [intDate, setIntDate] = useState('2026-09-18');
  const [intTime, setIntTime] = useState('14:00');
  const [intType, setIntType] = useState<'Online' | 'In-person'>('Online');
  const [intLocation, setIntLocation] = useState('https://meet.google.com/technova-campus-interview');
  const [intNotes, setIntNotes] = useState('Discussion on distributed systems & code pairing.');

  const updateAppStatus = (appId: string, newStatus: IndustryAppStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  const handleShortlist = (app: ApplicationRecord) => {
    updateAppStatus(app.id, 'Shortlisted');
    shortlistCandidate(
      app.id,
      app.opportunityId,
      `Shortlisted application for ${app.opportunityTitle}`
    );
    showToast(`${app.studentName} shortlisted!`, 'success');
  };

  const handleMarkSelected = (app: ApplicationRecord) => {
    updateAppStatus(app.id, 'Selected');
    showToast(`${app.studentName} marked as Selected! Offer letter trigger ready.`, 'success');
  };

  const handleReject = (app: ApplicationRecord) => {
    updateAppStatus(app.id, 'Rejected');
    showToast(`Application for ${app.studentName} marked as Rejected.`, 'info');
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewingApp) return;

    updateAppStatus(interviewingApp.id, 'Interview');

    scheduleInterview(interviewingApp.id, {
      date: intDate,
      time: `${intTime} IST`,
      type: intType,
      locationOrLink: intLocation,
      notes: intNotes,
    });

    showToast(
      `Interview scheduled with ${interviewingApp.studentName} on ${intDate} at ${intTime}!`,
      'success'
    );
    setInterviewingApp(null);
  };

  const filteredApps = applications.filter((app) => {
    if (activeTab !== 'All' && app.status !== activeTab) return false;
    if (selectedOppFilter !== 'All' && app.opportunityId !== selectedOppFilter) return false;
    if (app.matchPercentage < selectedMatchFilter) return false;
    if (
      searchQuery &&
      !app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    if (filteredApps.length === 0) {
      showToast('No applications found matching current criteria.', 'warning');
      return;
    }

    const headers = [
      'Application ID',
      'Student Name',
      'College',
      'Department',
      'Opportunity Title',
      'Opportunity Type',
      'AI Match (%)',
      'Applied Date',
      'Status',
      'Cover Note',
    ];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredApps.map((app) => [
      escapeCSV(app.id),
      escapeCSV(app.studentName),
      escapeCSV(app.college),
      escapeCSV(app.department),
      escapeCSV(app.opportunityTitle),
      escapeCSV(app.opportunityType),
      escapeCSV(app.matchPercentage),
      escapeCSV(app.appliedDate),
      escapeCSV(app.status),
      escapeCSV(app.coverNote || ''),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `applications_desk_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported CSV with filtered applications successfully.', 'success');
  };

  const tabOptions: Array<'All' | 'New' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'> = [
    'All',
    'New',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
  ];

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Applications Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review candidate applications, manage progression from New to Selected, and schedule interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="btn-export-applications-desk-csv"
            onClick={handleExportCSV}
            className="text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#14151B] hover:bg-gray-50 dark:hover:bg-white/5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 transition-all shadow-xs"
            title="Export filtered applications as CSV"
          >
            <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Export CSV</span>
          </button>
          <div className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-2 rounded-xl">
            Total: {applications.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabOptions.map((tab) => {
          const count =
            tab === 'All'
              ? applications.length
              : applications.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {tab}
              <span className="ml-1.5 text-[10px] opacity-80">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Opportunity Dropdown */}
          <div>
            <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1">
              Filter by Role
            </label>
            <select
              value={selectedOppFilter}
              onChange={(e) => setSelectedOppFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="All">All Opportunities</option>
              {industryOpportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Match Filter */}
          <div>
            <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1">
              Minimum AI Match
            </label>
            <select
              value={selectedMatchFilter}
              onChange={(e) => setSelectedMatchFilter(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value={0}>Any Match Score</option>
              <option value={70}>70%+ Match</option>
              <option value={80}>80%+ Match</option>
              <option value={90}>90%+ Match (Elite)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1">
              Search Student / Role
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <div className="font-bold text-base text-gray-800 dark:text-gray-200">
              No applications match criteria
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Try adjusting your role or status filter, or clear search queries to view all candidate records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-3">Opportunity</th>
                  <th className="py-3.5 px-3">AI Fit</th>
                  <th className="py-3.5 px-3">Applied Date</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.avatar}
                          alt={app.studentName}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500/20 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span>{app.studentName}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            {app.department} • {app.college}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {app.opportunityTitle}
                      </div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                        {app.opportunityType}
                      </span>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-[#D4F73C] rounded-full"
                            style={{ width: `${app.matchPercentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {app.matchPercentage}%
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-gray-500 whitespace-nowrap">
                      {app.appliedDate}
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => updateAppStatus(app.id, e.target.value as IndustryAppStatus)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                          app.status === 'Selected'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-400'
                            : app.status === 'Interview'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-400'
                            : app.status === 'Shortlisted'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-400'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-400'
                            : app.status === 'New'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border-gray-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingApp(app)}
                          title="View Application Details"
                          className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-800 dark:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {app.status !== 'Shortlisted' && app.status !== 'Interview' && app.status !== 'Selected' && (
                          <button
                            onClick={() => handleShortlist(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                            title="Shortlist"
                          >
                            Shortlist
                          </button>
                        )}

                        <button
                          onClick={() => setInterviewingApp(app)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                          title="Schedule Interview"
                        >
                          <Video className="w-3 h-3" />
                          <span>Interview</span>
                        </button>

                        {app.status !== 'Selected' && (
                          <button
                            onClick={() => handleMarkSelected(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            title="Mark Selected"
                          >
                            <Award className="w-3 h-3" />
                            <span>Select</span>
                          </button>
                        )}

                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleReject(app)}
                            title="Reject Application"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Application Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Application: {viewingApp.studentName}
                </h3>
                <p className="text-xs text-gray-500">
                  {viewingApp.opportunityTitle} • Applied {viewingApp.appliedDate}
                </p>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                    AI Candidate Fit
                  </div>
                  <div className="font-extrabold text-gray-900 dark:text-white text-sm">
                    {viewingApp.matchPercentage}% Competency Match
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D4F73C] text-black">
                  Recommended
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Candidate Note / Statement of Interest
                </label>
                <p className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {viewingApp.coverNote || 'Standard candidate application submitted via SkillBridge campus integration.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
                <div>
                  <strong>College:</strong> {viewingApp.college}
                </div>
                <div>
                  <strong>Department:</strong> {viewingApp.department}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                <span className="font-bold text-gray-600 dark:text-gray-400">Current Status</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{viewingApp.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 rounded-xl text-gray-500 font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = viewingApp;
                  setViewingApp(null);
                  handleShortlist(target);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
              >
                Shortlist Candidate
              </button>
              <button
                onClick={() => {
                  const target = viewingApp;
                  setViewingApp(null);
                  handleMarkSelected(target);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Mark Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Schedule Interview
                </h3>
                <p className="text-gray-500">
                  {interviewingApp.studentName} • {interviewingApp.opportunityTitle}
                </p>
              </div>
              <button
                onClick={() => setInterviewingApp(null)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Format
                </label>
                <select
                  value={intType}
                  onChange={(e) => setIntType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                >
                  <option value="Online">Online Video Meeting</option>
                  <option value="In-person">In-Person Campus Round</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Meeting Location / Link *
                </label>
                <input
                  type="text"
                  required
                  value={intLocation}
                  onChange={(e) => setIntLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={intNotes}
                  onChange={(e) => setIntNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setInterviewingApp(null)}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
