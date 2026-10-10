import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  skillBridgeEngine,
  PlacementDriveScheduleItem,
  ConflictResolutionResult,
} from '../../services/skillBridgeIntelligenceEngine';
import {
  Calendar,
  Clock,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Users,
  MapPin,
  X,
} from 'lucide-react';

export const DriveSchedulerPanel: React.FC = () => {
  const { showToast } = useApp();

  // Initial Sample Placement Drives with intentional slot overlap to demonstrate conflict detection
  const [drives, setDrives] = useState<PlacementDriveScheduleItem[]>([
    {
      id: 'drive_1',
      companyName: 'NovaCloud Systems',
      roleTitle: 'Associate Software Engineer (Cloud & DevOps)',
      date: '2026-05-18',
      startTime: '09:30',
      endTime: '12:30',
      targetBranches: ['Computer Science', 'Information Technology'],
      expectedCandidatesCount: 220,
      venueOrPlatform: 'Lab 4 & 5 (Computer Center)',
      roundType: 'Online Aptitude Test',
    },
    {
      id: 'drive_2',
      companyName: 'Apex Data Networks',
      roleTitle: 'Data Engineer & Microservices Trainee',
      date: '2026-05-18',
      startTime: '10:00', // Conflict with NovaCloud (09:30 - 12:30) on CS/IT
      endTime: '13:00',
      targetBranches: ['Computer Science', 'Data Science'],
      expectedCandidatesCount: 180,
      venueOrPlatform: 'Lab 5 (Server Hall)',
      roundType: 'System Design & Coding',
    },
    {
      id: 'drive_3',
      companyName: 'Krypton CyberSec',
      roleTitle: 'Security Analyst & Pen-Tester',
      date: '2026-05-20',
      startTime: '10:00',
      endTime: '13:00',
      targetBranches: ['Information Technology', 'Cyber Security'],
      expectedCandidatesCount: 95,
      venueOrPlatform: 'Seminar Hall B',
      roundType: 'Technical Interview',
    },
    {
      id: 'drive_4',
      companyName: 'Stellar FinTech Corp',
      roleTitle: 'Quantitative Analyst & Financial Systems',
      date: '2026-05-22',
      startTime: '14:00',
      endTime: '17:00',
      targetBranches: ['Computer Science', 'Mathematics & Computing'],
      expectedCandidatesCount: 140,
      venueOrPlatform: 'Central Auditorium & Virtual Panel',
      roundType: 'HR & Leadership Round',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDate, setNewDate] = useState('2026-05-25');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('13:00');
  const [newBranches, setNewBranches] = useState('Computer Science, Information Technology');
  const [newVenue, setNewVenue] = useState('Lab 3 (Digital Hall)');

  // Run conflict detection engine
  const conflictReport: ConflictResolutionResult = useMemo(
    () => skillBridgeEngine.detectAndResolveDriveConflicts(drives),
    [drives]
  );

  const handleApplyOptimization = () => {
    setDrives(conflictReport.optimizedSchedule);
    showToast('AI optimized conflict-free schedule applied! All slot clashes resolved.', 'success');
  };

  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) {
      showToast('Please specify company and role title', 'error');
      return;
    }

    const branchesArray = newBranches.split(',').map((b) => b.trim()).filter(Boolean);

    const newDrive: PlacementDriveScheduleItem = {
      id: `drive_${Date.now()}`,
      companyName: newCompany.trim(),
      roleTitle: newRole.trim(),
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      targetBranches: branchesArray,
      expectedCandidatesCount: 150,
      venueOrPlatform: newVenue,
      roundType: 'Online Aptitude Test',
    };

    setDrives((prev) => [newDrive, ...prev]);
    showToast(`Scheduled drive for ${newCompany}. Conflict engine evaluated.`, 'success');
    setIsAddModalOpen(false);
    setNewCompany('');
    setNewRole('');
  };

  return (
    <div id="ai-conflict-free-scheduler" className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-800 via-purple-700 to-blue-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <Zap className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Multi-Tenant Placement Synchronization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Conflict-Free Drive Scheduler
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
              Detect recruitment time clashes, overlapping student eligibility pools, and lab venue bottlenecks. Automatically staggered slot recommendations prevent student test dropouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Drive Slot</span>
            </button>

            {conflictReport.hasConflicts && (
              <button
                onClick={handleApplyOptimization}
                className="px-4 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resolve Overlaps Automatically</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Status Alert Box */}
      <div
        className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          conflictReport.hasConflicts
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              conflictReport.hasConflicts
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {conflictReport.hasConflicts ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {conflictReport.hasConflicts
                ? `Conflict Detected: ${conflictReport.conflictsDetected.length} Schedule Clash Found`
                : 'All Drives 100% Conflict-Free'}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {conflictReport.resolutionSummary}
            </p>
          </div>
        </div>

        {conflictReport.hasConflicts && (
          <button
            onClick={handleApplyOptimization}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shrink-0 cursor-pointer shadow-sm"
          >
            Apply Conflict-Free Resolution
          </button>
        )}
      </div>

      {/* Conflict Details Cards (if any) */}
      {conflictReport.hasConflicts && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Detected Critical Schedule Overlaps:
          </h3>
          {conflictReport.conflictsDetected.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-rose-200 dark:border-rose-900/40 space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>{c.driveA} vs {c.driveB}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500/10 text-rose-600">
                  Critical Overlap
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {c.description}
              </p>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-[11px] font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>AI Recommendation: {c.recommendedResolution}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Scheduled Drives Table */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Campus Recruitment Drive Schedule ({drives.length})
            </h3>
            <p className="text-xs text-gray-400">
              Synchronized campus calendar with live venue and slot management
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
            Automated Staggering Active
          </span>
        </div>

        <div className="space-y-3">
          {drives.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {d.companyName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {d.roundType}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {d.roleTitle}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>{d.date}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{d.startTime} - {d.endTime}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{d.venueOrPlatform}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                    Target Branches
                  </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {d.targetBranches.join(', ')}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 font-bold text-gray-900 dark:text-white shrink-0">
                  {d.expectedCandidatesCount} Candidates
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Drive Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Schedule New Campus Drive Slot
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDrive} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goldman Sachs"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Development Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Target Branches (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newBranches}
                  onChange={(e) => setNewBranches(e.target.value)}
                  placeholder="Computer Science, IT"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Assigned Lab / Venue
                </label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. Lab 4 (Digital Center)"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
