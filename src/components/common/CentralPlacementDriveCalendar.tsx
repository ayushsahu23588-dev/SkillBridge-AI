import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PlacementDriveCalendarEvent, JobPosting } from '../../types';
import { AutomaticEligibilityCheckerModal } from './AutomaticEligibilityCheckerModal';
import { PlacementDriveDetailsModal } from './PlacementDriveDetailsModal';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Building2,
  Users,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Video,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const CentralPlacementDriveCalendar: React.FC = () => {
  const { driveCalendarEvents, addDriveCalendarEvent, currentUser, showToast } = useApp();

  const isPlacementStaff = currentUser.role === 'college_admin' || currentUser.role === 'faculty' || currentUser.role === 'super_admin';

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterBranch, setFilterBranch] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<PlacementDriveCalendarEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [isDriveDetailsOpen, setIsDriveDetailsOpen] = useState(false);

  // New Event Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newEventType, setNewEventType] = useState<PlacementDriveCalendarEvent['eventType']>('Online Assessment');
  const [newTier, setNewTier] = useState<PlacementDriveCalendarEvent['tier']>('Dream Tier 1');
  const [newDate, setNewDate] = useState('2026-10-25');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('12:00');
  const [newVenue, setNewVenue] = useState('Central Computing Lab 1 & 2');
  const [newMode, setNewMode] = useState<PlacementDriveCalendarEvent['mode']>('On-Campus');
  const [newBranches, setNewBranches] = useState('CSE, IT, ECE');
  const [newMinCgpa, setNewMinCgpa] = useState('7.5');
  const [newPackage, setNewPackage] = useState('18.0');
  const [newDeadline, setNewDeadline] = useState('2026-10-24T18:00');

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return driveCalendarEvents.filter((evt) => {
      const matchType = filterType === 'ALL' || evt.eventType === filterType;
      const matchBranch =
        filterBranch === 'ALL' ||
        evt.targetBranches.some((b) => b.toLowerCase().includes(filterBranch.toLowerCase()));
      return matchType && matchBranch;
    });
  }, [driveCalendarEvents, filterType, filterBranch]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newRoleTitle) {
      showToast('Please provide company name and role title.', 'warning');
      return;
    }

    addDriveCalendarEvent({
      companyName: newCompanyName,
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      roleTitle: newRoleTitle,
      eventType: newEventType,
      tier: newTier,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      venueOrPlatform: newVenue,
      mode: newMode,
      targetBranches: newBranches.split(',').map((b) => b.trim()),
      minCgpa: parseFloat(newMinCgpa) || 7.0,
      packageLpa: parseFloat(newPackage) || 12.0,
      status: 'Upcoming',
      registrationDeadline: newDeadline,
      coordinators: currentUser.name || 'Placement Cell Coordinator',
    });

    setIsAddModalOpen(false);
    setNewCompanyName('');
    setNewRoleTitle('');
  };

  const getBadgeColor = (type: PlacementDriveCalendarEvent['eventType']) => {
    switch (type) {
      case 'Pre-Placement Talk':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Online Assessment':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Technical Interview':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'HR Round':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Offer Rollout':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Calendar Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <CalendarIcon className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Campus Recruitment Master Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Central Placement Drive Calendar
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Consolidated real-time schedule for Pre-Placement Talks (PPTs), Online Coding Assessments, Technical Interview Rounds, and On-Campus Offer Declarations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isPlacementStaff && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Drive Event</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Event:</span>
          </span>
          {[
            'ALL',
            'Pre-Placement Talk',
            'Online Assessment',
            'Technical Interview',
            'HR Round',
            'Offer Rollout',
          ].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'ALL' ? 'All Events' : type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Branch:</span>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-gray-800 dark:text-gray-200 outline-none"
          >
            <option value="ALL">All Branches</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="IT">Information Tech (IT)</option>
            <option value="AI">AI & Data Science</option>
            <option value="ECE">Electronics (ECE)</option>
            <option value="ME">Mechanical (ME)</option>
          </select>
        </div>
      </div>

      {/* Calendar List / Event Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="soft-card p-5 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getBadgeColor(
                    evt.eventType
                  )}`}
                >
                  {evt.eventType}
                </span>
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{evt.date}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#D4F73C] transition-colors">
                  {evt.companyName}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">{evt.roleTitle}</p>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {evt.startTime} - {evt.endTime} IST
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="line-clamp-1">{evt.venueOrPlatform}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
              <div className="font-bold text-purple-600 dark:text-purple-400">
                ₹{evt.packageLpa} LPA
              </div>
              <span className="text-[11px] font-semibold text-gray-500">
                {evt.targetBranches.slice(0, 2).join(', ')}
                {evt.targetBranches.length > 2 && ` +${evt.targetBranches.length - 2}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="soft-card p-12 text-center text-gray-500">
          No drive events matching the selected filters.
        </div>
      )}

      {/* Event Details Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181920] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeColor(
                    selectedEvent.eventType
                  )}`}
                >
                  {selectedEvent.eventType}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {selectedEvent.companyName}
                </h3>
                <p className="text-xs text-gray-500">{selectedEvent.roleTitle}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                <div>
                  <span className="text-gray-400 block">Date & Timing</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedEvent.date} ({selectedEvent.startTime} - {selectedEvent.endTime})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Compensation Package</span>
                  <span className="font-black text-purple-600 dark:text-purple-400">
                    ₹{selectedEvent.packageLpa} LPA ({selectedEvent.tier})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block">Venue / Testing Platform</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {selectedEvent.venueOrPlatform} ({selectedEvent.mode})
                </span>
              </div>

              <div>
                <span className="text-gray-400 block">Eligible Branches</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {selectedEvent.targetBranches.join(', ')} (Min CGPA: {selectedEvent.minCgpa})
                </span>
              </div>

              <div>
                <span className="text-gray-400 block">Drive Coordinators</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {selectedEvent.coordinators}
                </span>
              </div>

              {selectedEvent.meetingLink && (
                <div className="pt-1">
                  <a
                    href={selectedEvent.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Online Session Room</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-gray-100 dark:border-white/5">
              <span className="text-[11px] text-gray-400">
                Deadline: {selectedEvent.registrationDeadline.slice(0, 10)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="calendar-event-view-details-btn"
                  onClick={() => setIsDriveDetailsOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4F73C]" />
                  <span>Placement Drive Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCheckingEligibility(true)}
                  className="px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Check Eligibility</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Drive event synced to your Google / Outlook calendar!', 'success');
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D4F73C] text-black font-bold text-xs cursor-pointer"
                >
                  Sync to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automatic Eligibility Checker Modal for Calendar Event */}
      {isCheckingEligibility && selectedEvent && (
        <AutomaticEligibilityCheckerModal
          isOpen={true}
          job={{
            id: selectedEvent.id,
            companyId: selectedEvent.id || 'comp_calendar_1',
            companyName: selectedEvent.companyName,
            companyLogo: selectedEvent.companyLogo,
            title: selectedEvent.roleTitle,
            department: selectedEvent.targetBranches[0] || 'Computer Science',
            location: selectedEvent.venueOrPlatform,
            type: 'Full-time',
            workplaceType: selectedEvent.mode === 'Virtual' ? 'Remote' : 'On-site',
            stipendOrSalary: `₹${selectedEvent.packageLpa} LPA`,
            description: `Campus Recruitment Drive for ${selectedEvent.companyName} (${selectedEvent.roleTitle}). Testing rounds: ${selectedEvent.eventType}. Target branches: ${selectedEvent.targetBranches.join(', ')}.`,
            requiredSkills: ['Problem Solving', 'Data Structures & Algorithms', 'System Architecture'],
            minGpa: selectedEvent.minCgpa,
            departmentTarget: selectedEvent.targetBranches,
            applicantCount: 42,
            postedDate: selectedEvent.date,
            deadline: selectedEvent.registrationDeadline.slice(0, 10),
          }}
          onClose={() => setIsCheckingEligibility(false)}
        />
      )}

      {/* Shared Placement Drive Details Modal */}
      {isDriveDetailsOpen && selectedEvent && (
        <PlacementDriveDetailsModal
          isOpen={true}
          calendarEvent={selectedEvent}
          onClose={() => setIsDriveDetailsOpen(false)}
        />
      )}

      {/* Schedule Drive Event Modal (Placement Staff Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white dark:bg-[#181920] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Schedule New Placement Drive Event</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer L3"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Event Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  >
                    <option value="Pre-Placement Talk">Pre-Placement Talk</option>
                    <option value="Online Assessment">Online Assessment</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="HR Round">HR Round</option>
                    <option value="Offer Rollout">Offer Rollout</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Hiring Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  >
                    <option value="Super Dream">Super Dream (≥35 LPA)</option>
                    <option value="Dream Tier 1">Dream Tier 1 (20-35 LPA)</option>
                    <option value="Enterprise">Enterprise (10-20 LPA)</option>
                    <option value="Mass Core">Mass Core (5-10 LPA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">End Time</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Package (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Venue / Platform</label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Target Branches (comma-separated)</label>
                <input
                  type="text"
                  value={newBranches}
                  onChange={(e) => setNewBranches(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Publish to Calendar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
