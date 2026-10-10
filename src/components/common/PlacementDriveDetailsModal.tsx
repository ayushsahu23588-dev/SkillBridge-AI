import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting, PlacementDriveCalendarEvent } from '../../types';
import { aiService } from '../../services/aiService';
import { AutomaticEligibilityCheckerModal } from './AutomaticEligibilityCheckerModal';
import {
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ShieldCheck,
  X,
  ExternalLink,
  ChevronRight,
  Zap,
  Target,
  Users,
  AlertTriangle,
  Send,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface PlacementDriveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drive?: JobPosting | null;
  calendarEvent?: PlacementDriveCalendarEvent | null;
  onApply?: (drive: JobPosting) => void;
}

export const PlacementDriveDetailsModal: React.FC<PlacementDriveDetailsModalProps> = ({
  isOpen,
  onClose,
  drive,
  calendarEvent,
  onApply,
}) => {
  const { studentProfile, applications, applyForJobWithDetails, showToast, navigate, currentUser } = useApp();
  const [isEligibilityCheckerOpen, setIsEligibilityCheckerOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Normalize drive data from either JobPosting or PlacementDriveCalendarEvent
  const driveData: JobPosting | null = useMemo(() => {
    if (drive) return drive;
    if (calendarEvent) {
      return {
        id: calendarEvent.id,
        companyId: calendarEvent.id || 'comp_calendar',
        companyName: calendarEvent.companyName,
        companyLogo: calendarEvent.companyLogo,
        title: calendarEvent.roleTitle,
        department: calendarEvent.targetBranches[0] || 'Computer Science & Engineering',
        location: calendarEvent.venueOrPlatform,
        type: 'Full-time',
        workplaceType: calendarEvent.mode === 'Virtual' ? 'Remote' : 'On-site',
        stipendOrSalary: `₹${calendarEvent.packageLpa} LPA`,
        description: `Campus Recruitment Drive for ${calendarEvent.companyName} (${calendarEvent.roleTitle}). Format: ${calendarEvent.eventType}. Eligible branches: ${calendarEvent.targetBranches.join(', ')}.`,
        requiredSkills: ['Problem Solving', 'Data Structures & Algorithms', 'System Architecture', 'Database Design'],
        minGpa: calendarEvent.minCgpa,
        departmentTarget: calendarEvent.targetBranches,
        applicantCount: 48,
        postedDate: calendarEvent.date,
        deadline: calendarEvent.registrationDeadline ? calendarEvent.registrationDeadline.slice(0, 10) : '2026-11-01',
      };
    }
    return null;
  }, [drive, calendarEvent]);

  if (!isOpen || !driveData) return null;

  // AI Match Breakdown
  const match = aiService.matchJob(studentProfile, driveData);

  // Check if student has applied
  const existingApp = applications.find((a) => a.jobId === driveData.id);
  const hasApplied = Boolean(existingApp);

  const minCgpaRequired = driveData.minGpa || 7.0;
  const eligibleBranches = driveData.departmentTarget || ['Computer Science', 'Information Technology', 'Electronics & Communication'];
  const studentCgpa = studentProfile.cgpa || studentProfile.gpa || 8.5;
  const isCgpaEligible = studentCgpa >= minCgpaRequired;
  const isBranchEligible = eligibleBranches.some((b) =>
    (studentProfile.department || '').toLowerCase().includes(b.toLowerCase()) ||
    b.toLowerCase().includes((studentProfile.department || '').toLowerCase())
  );

  // Selection Process Rounds
  const selectionProcessRounds = [
    {
      step: 1,
      name: 'Pre-Placement Talk (PPT)',
      duration: '45 mins',
      description: 'Corporate culture, job role overview, compensation breakdown, and Q&A session with hiring leadership.',
    },
    {
      step: 2,
      name: 'Online Assessment (OA)',
      duration: '90 mins',
      description: 'Algorithmic coding (2 DSA problems), core computer science fundamentals, and quantitative aptitude.',
    },
    {
      step: 3,
      name: 'Technical Round 1',
      duration: '45 mins',
      description: 'Deep dive into data structures, system architecture, database optimization, and capstone repository walkthrough.',
    },
    {
      step: 4,
      name: 'Technical Round 2 (Design)',
      duration: '45 mins',
      description: 'High-level / low-level system design, concurrency handling, microservices, and debugging live scenarios.',
    },
    {
      step: 5,
      name: 'HR & Leadership Fitment',
      duration: '30 mins',
      description: 'Cultural alignment, behavioral situations, communication, location preferences, and offer discussion.',
    },
    {
      step: 6,
      name: 'Final Offer Rollout',
      duration: 'Same Day',
      description: 'Formal release of corporate Letter of Intent (LOI) and verification with Central Placement Cell.',
    },
  ];

  const handleApplyClick = () => {
    if (hasApplied) {
      navigate('/student/applications');
      onClose();
      return;
    }

    if (onApply) {
      onApply(driveData);
      onClose();
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      applyForJobWithDetails(
        driveData.id,
        `Formal application for ${driveData.title} campus recruitment drive at ${driveData.companyName}.`
      );
      setIsApplying(false);
      showToast(`Application successfully registered for ${driveData.companyName}!`, 'success');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl my-6 bg-white dark:bg-[#15161D] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 shrink-0 border-b border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative">
            <div className="flex items-start gap-4">
              <img
                src={driveData.companyLogo}
                alt={driveData.companyName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 bg-white shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4F73C] text-black">
                    Campus Placement Drive
                  </span>
                  <span className="text-xs font-semibold text-purple-200">
                    {driveData.companyName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 border border-white/15">
                    {driveData.workplaceType}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {driveData.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{driveData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>{driveData.type}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deadline: {driveData.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compensation & Match Pill */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                  Compensation Package
                </span>
                <span className="text-2xl font-black text-[#D4F73C]">
                  {driveData.stipendOrSalary}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#D4F73C]" />
                <span>Student Match: {match.matchScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Key Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Minimum CGPA</span>
              <span className="text-base font-black text-gray-900 dark:text-white">{minCgpaRequired} / 10.0</span>
              <span className={`text-[10px] font-semibold block mt-0.5 ${isCgpaEligible ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isCgpaEligible ? '✓ Your CGPA meets cutoff' : '⚠ Below cutoff'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Eligible Branches</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{eligibleBranches.join(', ')}</span>
              <span className={`text-[10px] font-semibold block mt-0.5 ${isBranchEligible ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isBranchEligible ? '✓ Department eligible' : 'Check branch criteria'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Backlog Restriction</span>
              <span className="text-base font-black text-gray-900 dark:text-white">0 Active</span>
              <span className="text-[10px] font-semibold text-emerald-500 block mt-0.5">Strict Policy</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Campus Applicants</span>
              <span className="text-base font-black text-gray-900 dark:text-white">{driveData.applicantCount || 42} Registered</span>
              <span className="text-[10px] font-semibold text-indigo-500 block mt-0.5">Active Talent Pool</span>
            </div>
          </div>

          {/* Student Match Score & Skill Breakdown */}
          <div className="p-5 rounded-3xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-[#D4F73C]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Placement Compatibility & Skills Analysis
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Algorithmic match breakdown between candidate profile and company requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-purple-700 dark:text-purple-300">
                  {match.matchScore}%
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Overall Fit</span>
              </div>
            </div>

            {/* Matched vs Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-purple-200/50 dark:border-purple-900/30">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Matching Skills ({match.matchedSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {match.matchedSkills.length > 0 ? (
                    match.matchedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-500/20"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No direct overlaps detected yet.</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing Skills / Gaps to Address ({match.missingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {match.missingSkills.length > 0 ? (
                    match.missingSkills.map((gap, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-semibold text-xs border border-amber-500/20"
                      >
                        • {gap}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-500 font-semibold">All essential technical skills covered!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Overview & Responsibilities */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Role Overview & Responsibilities
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {driveData.description}
            </p>

            {driveData.requiredSkills && (
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Mandatory Required Skills</span>
                <div className="flex flex-wrap gap-2">
                  {driveData.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-800 dark:text-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selection Process Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Recruitment Drive Selection Process
              </h3>
              <span className="text-xs text-gray-400">6 Stages</span>
            </div>

            <div className="space-y-2.5">
              {selectionProcessRounds.map((rnd) => (
                <div
                  key={rnd.step}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start gap-3.5"
                >
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {rnd.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {rnd.name}
                      </span>
                      <span className="text-[11px] font-semibold text-indigo-500">
                        {rnd.duration}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {rnd.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drive / Interview Dates & Schedule */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Drive Schedule & Testing Window
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Registrations close {driveData.deadline}. Assessments start within 48 hours.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEligibilityCheckerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#181920] border border-gray-300 dark:border-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Full Eligibility Audit</span>
            </button>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-[#111217] border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500">
            {hasApplied ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>You have applied for this drive ({existingApp?.status || 'Applied'}).</span>
              </span>
            ) : (
              <span>Review requirements before submitting your dossier.</span>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
            >
              Close
            </button>

            <button
              id="placement-drive-apply-btn"
              onClick={handleApplyClick}
              disabled={isApplying}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                hasApplied
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-[#D4F73C] hover:bg-[#c4e630] text-[#121316]'
              }`}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View in Tracker</span>
                </>
              ) : isApplying ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Apply for Placement Drive</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Automatic Eligibility Checker */}
      {isEligibilityCheckerOpen && (
        <AutomaticEligibilityCheckerModal
          isOpen={true}
          job={driveData}
          customProfile={studentProfile}
          onClose={() => setIsEligibilityCheckerOpen(false)}
          onApplyDirectly={() => {
            setIsEligibilityCheckerOpen(false);
            handleApplyClick();
          }}
        />
      )}
    </div>
  );
};
