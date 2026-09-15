import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  Briefcase,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

const STATUS_STEPS: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Interview Scheduled',
  'Technical Round',
  'Offer Extended',
  'Hired',
];

export const ApplicationsTrackerView: React.FC = () => {
  const { applications, studentProfile, jobs, setActiveTab } = useApp();

  const userApps = applications.filter((a) => a.studentId === studentProfile.id);

  const getStepIndex = (status: ApplicationStatus) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-200/60 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Live Candidate Pipeline
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Application Status & Interview Tracker
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Track real-time hiring stages, recruiter screening notes, interview meeting links, and offer release updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
              Total Applied
            </span>
            <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">
              {userApps.length}
            </span>
          </div>
        </div>
      </div>

      {userApps.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            No Active Applications Yet
          </h3>
          <p className="text-xs text-gray-500 font-normal max-w-sm mx-auto">
            Explore verified enterprise openings on the job board and submit 1-click applications.
          </p>
          <button
            onClick={() => setActiveTab('jobs')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Browse Job Board
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            const currentStepIdx = getStepIndex(app.status);

            return (
              <div
                key={app.id}
                id={`app-card-${app.id}`}
                className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={job ? job.companyLogo : 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80'}
                      alt={job ? job.companyName : 'Company'}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
                          {job ? job.title : 'Software Engineering Role'}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                        {job ? job.companyName : 'NovaCloud'} • Applied on {app.appliedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 tabular-nums">
                      <Sparkles className="w-3.5 h-3.5" />
                      {app.aiMatchScore}% Profile Fit
                    </div>
                  </div>
                </div>

                {/* Status Timeline Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPast = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-semibold'
                              : isPast
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-400 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-1">
                            {isPast ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : isCurrent ? (
                              <Clock className="w-4 h-4 text-white animate-pulse" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 text-[10px] font-medium flex items-center justify-center">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium truncate leading-tight">
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recruiter Notes / Interview Schedule Box */}
                {(app.recruiterNotes || app.interviewDate) && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 space-y-2">
                    {app.interviewDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-purple-500" /> Confirmed Interview Time:
                        </span>
                        <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold tabular-nums">
                          {app.interviewDate}
                        </span>
                      </div>
                    )}

                    {app.recruiterNotes && (
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 mb-0.5">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Recruiter Feedback:
                        </span>
                        <p className="leading-relaxed pl-5 font-normal">{app.recruiterNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
