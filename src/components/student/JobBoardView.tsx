import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  Building,
  Users,
  Send,
  Filter,
} from 'lucide-react';

export const JobBoardView: React.FC = () => {
  const { jobs, studentProfile, applyForJob, saveJob, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'all' || job.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const calculateMatchScore = (job: JobPosting) => {
    const studentSkills = studentProfile.skills.map((s) => s.name.toLowerCase());
    const matched = job.requiredSkills.filter((s) =>
      studentSkills.includes(s.toLowerCase())
    );
    const score = Math.round((matched.length / Math.max(1, job.requiredSkills.length)) * 100);
    return Math.max(70, Math.min(99, score + (studentProfile.gpa >= 3.8 ? 8 : 0)));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Enterprise Openings
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Industry Internships & Campus Placement Board
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Direct institutional hiring pipelines with automated AI candidate profile matching and pre-screen endorsements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
              Active Openings
            </span>
            <span className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400 tabular-nums">
              {jobs.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            id="job-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role title, company name, tech skill (React, Cloud, Python)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            id="job-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-44 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
          >
            <option value="all">All Employment Types</option>
            <option value="Internship">Internships Only</option>
            <option value="Full-time">Full-Time Only</option>
            <option value="Part-time">Part-Time / Research</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const matchScore = calculateMatchScore(job);
          const isApplied = studentProfile.appliedJobIds.includes(job.id);
          const isSaved = studentProfile.savedJobIds.includes(job.id);

          return (
            <div
              key={job.id}
              id={`job-card-${job.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header with logo and save */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-xs"
                    />
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {job.companyName}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`save-job-btn-${job.id}`}
                    onClick={() => saveJob(job.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-500'
                        : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                    title="Bookmark job"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Badges & Meta */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {job.stipendOrSalary}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
                      {job.type}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 flex items-center gap-1 tabular-nums">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      {matchScore}% AI Match
                    </span>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed font-normal">
                  {job.description}
                </p>

                {/* Required Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-400">
                      +{job.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <button
                  id={`view-modal-job-${job.id}`}
                  onClick={() => setSelectedJob(job)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Details
                </button>

                <button
                  id={`apply-job-btn-${job.id}`}
                  onClick={() => applyForJob(job.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                    isApplied
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : '1-Click Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedJob(null)}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedJob.companyLogo}
                  alt={selectedJob.companyName}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-xs"
                />
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-normal">
                    {selectedJob.companyName} • {selectedJob.location}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                    {selectedJob.stipendOrSalary} • {selectedJob.type}
                  </p>
                </div>
              </div>

              <button
                id="close-job-modal-btn"
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Candidate Fit Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  AI Candidate Match Breakdown
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 font-normal">
                  You possess {selectedJob.requiredSkills.filter(s => studentProfile.skills.some(sk => sk.name.toLowerCase() === s.toLowerCase())).length} of {selectedJob.requiredSkills.length} required skill sets.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">
                  {calculateMatchScore(selectedJob)}%
                </span>
                <span className="text-[10px] text-emerald-600 block font-semibold">Top Candidate</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Job Overview
              </h3>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements & Skills */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Required Technical Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.requiredSkills.map((s, idx) => {
                  const hasSkill = studentProfile.skills.some(
                    (sk) => sk.name.toLowerCase() === s.toLowerCase()
                  );
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                        hasSkill
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {hasSkill ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : null}
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Application Deadline & Action */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 font-normal">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Deadline: {selectedJob.deadline}
              </span>

              <div className="flex items-center gap-2">
                <button
                  id="modal-apply-btn"
                  onClick={() => {
                    applyForJob(selectedJob.id);
                    setSelectedJob(null);
                  }}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all ${
                    studentProfile.appliedJobIds.includes(selectedJob.id)
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
                  }`}
                >
                  {studentProfile.appliedJobIds.includes(selectedJob.id)
                    ? 'Already Applied'
                    : 'Submit 1-Click Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
