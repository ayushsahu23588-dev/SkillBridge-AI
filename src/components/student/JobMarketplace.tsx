import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';
import { aiService } from '../../services/aiService';
import {
  Briefcase,
  Search,
  MapPin,
  Banknote,
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Bookmark,
  ExternalLink,
  Award,
  Send,
  X,
  UserCheck,
  GraduationCap,
  Layers,
  Loader2,
} from 'lucide-react';
import { AIMatchExplanation } from '../common/AIMatchExplanation';

export const JobMarketplace: React.FC = () => {
  const {
    jobs,
    applications,
    applyForJobWithDetails,
    selectedJobId,
    setSelectedJobId,
    savedInternshipIds,
    toggleSaveInternship,
    studentProfile,
    navigate,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [matchThreshold, setMatchThreshold] = useState<'all' | '80' | '60'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'latest'>('match');
  // Organization filter for jobs: 'all' | 'saved' | 'applied'
  const [activityFilter, setActivityFilter] = useState<'all' | 'saved' | 'applied'>('all');

  // Gemini AI Match Explanation Modal state
  const [explainingJob, setExplainingJob] = useState<JobPosting | null>(null);

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [customPitch, setCustomPitch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine Career Track tag for a job
  const getJobCareerTrack = (job: JobPosting): string => {
    const titleLower = job.title.toLowerCase();
    const skillsLower = job.requiredSkills.map((s) => s.toLowerCase()).join(' ');

    if (titleLower.includes('ai') || titleLower.includes('ml') || skillsLower.includes('pytorch') || skillsLower.includes('llm')) {
      return 'AI/ML Developer';
    }
    if (titleLower.includes('data') || titleLower.includes('bi') || skillsLower.includes('powerbi') || skillsLower.includes('tableau')) {
      return 'Data Analyst';
    }
    if (titleLower.includes('cloud') || titleLower.includes('devops') || skillsLower.includes('docker') || skillsLower.includes('kubernetes')) {
      return 'Cloud & DevOps';
    }
    if (titleLower.includes('full stack') || titleLower.includes('fullstack') || (skillsLower.includes('react') && skillsLower.includes('node'))) {
      return 'Full Stack Developer';
    }
    if (titleLower.includes('backend') || skillsLower.includes('spring boot') || skillsLower.includes('microservices')) {
      return 'Backend Developer';
    }
    return 'Software Developer';
  };

  // Precompute match for each full-time job
  const jobMatchesMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof aiService.matchJob>>();
    jobs.forEach((j) => {
      map.set(j.id, aiService.matchJob(studentProfile, j));
    });
    return map;
  }, [jobs, studentProfile]);

  // Selected job for detail view
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const hasApplied = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const getApplication = (jobId: string) => {
    return applications.find((app) => app.jobId === jobId);
  };

  const isSaved = (jobId: string) => {
    return savedInternshipIds.includes(jobId);
  };

  // Pre-calculate full-time jobs counts for filter tabs & pipeline organization
  const fulltimeCounts = useMemo(() => {
    const ftJobs = jobs.filter((j) => j.type === 'Full-time');
    const total = ftJobs.length;
    const saved = ftJobs.filter((j) => savedInternshipIds.includes(j.id)).length;
    const applied = ftJobs.filter((j) => applications.some((app) => app.jobId === j.id)).length;
    return { total, saved, applied };
  }, [jobs, savedInternshipIds, applications]);

  const openApplyModal = (job: JobPosting) => {
    if (hasApplied(job.id)) {
      showToast('You have already applied for this graduate role! Tracking status in Applications.', 'info');
      navigate('/student/applications');
      return;
    }
    setApplyingJob(job);
    const match = jobMatchesMap.get(job.id);
    const defaultPitch = `I am eager to apply for the ${job.title} graduate opening at ${job.companyName}. With verified competencies in ${match?.matchedSkills?.slice(0, 3).join(', ') || 'modern software engineering'}, I am ready to excel in your team.`;
    setCustomPitch(defaultPitch);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    setIsSubmitting(true);
    setTimeout(() => {
      applyForJobWithDetails(
        applyingJob.id,
        customPitch,
        '/verified_graduate_cv.pdf'
      );
      setIsSubmitting(false);
      setApplyingJob(null);
      showToast(`Application submitted for ${applyingJob.title} at ${applyingJob.companyName}!`, 'success');
    }, 400);
  };

  // Filter and sort full-time jobs
  const fulltimeJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Only Full-time graduate roles
        if (job.type !== 'Full-time') return false;

        // Activity / Pipeline filter ('all' | 'saved' | 'applied')
        if (activityFilter === 'saved' && !savedInternshipIds.includes(job.id)) {
          return false;
        }
        if (activityFilter === 'applied' && !applications.some((app) => app.jobId === job.id)) {
          return false;
        }

        const track = getJobCareerTrack(job);
        const match = jobMatchesMap.get(job.id);
        const matchScore = match?.matchScore || 70;

        const matchesSearch =
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTrack = selectedTrack === 'All' || track === selectedTrack;

        const matchesLocation =
          selectedLocation === 'All' ||
          job.location.toLowerCase().includes(selectedLocation.toLowerCase());

        const matchesWorkplace =
          selectedWorkplace === 'All' || job.workplaceType === selectedWorkplace;

        const matchesScore =
          matchThreshold === 'all' ||
          (matchThreshold === '80' && matchScore >= 80) ||
          (matchThreshold === '60' && matchScore >= 60);

        return matchesSearch && matchesTrack && matchesLocation && matchesWorkplace && matchesScore;
      })
      .sort((a, b) => {
        const matchA = jobMatchesMap.get(a.id)?.matchScore || 0;
        const matchB = jobMatchesMap.get(b.id)?.matchScore || 0;

        if (sortBy === 'match') {
          return matchB - matchA;
        } else if (sortBy === 'salary') {
          const numA = parseInt(a.stipendOrSalary.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.stipendOrSalary.replace(/\D/g, '')) || 0;
          return numB - numA;
        } else {
          return b.id.localeCompare(a.id);
        }
      });
  }, [
    jobs,
    jobMatchesMap,
    searchQuery,
    selectedTrack,
    selectedLocation,
    selectedWorkplace,
    matchThreshold,
    sortBy,
    activityFilter,
    savedInternshipIds,
    applications,
  ]);

  // Detail View for Full-Time Job
  if (selectedJob && selectedJob.type === 'Full-time') {
    const match = jobMatchesMap.get(selectedJob.id) || {
      matchScore: 86,
      matchedSkills: selectedJob.requiredSkills.slice(0, 2),
      missingSkills: selectedJob.requiredSkills.slice(2),
      gpaEligible: true,
      recommendationSummary: 'Strong technical fit for enterprise placement.',
      competitiveEdge: 'Verified coursework and practical capstone experience.',
    };
    const applied = hasApplied(selectedJob.id);
    const saved = isSaved(selectedJob.id);
    const appDetails = getApplication(selectedJob.id);
    const careerTrack = getJobCareerTrack(selectedJob);

    return (
      <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedJobId(null);
              navigate('/student/jobs');
            }}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Full-Time Graduate Roles</span>
          </button>

          <button
            onClick={() => toggleSaveInternship(selectedJob.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              saved
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? 'Saved in Bookmarks' : 'Bookmark Role'}</span>
          </button>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-start gap-4">
              <img
                src={selectedJob.companyLogo}
                alt={selectedJob.companyName}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-white/10 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {selectedJob.companyName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-500/30">
                    Track: {careerTrack}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30">
                    Campus Hiring Partner
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {selectedJob.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                    <Banknote className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                    <span>{selectedJob.stipendOrSalary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Graduating Senior Hiring</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    {selectedJob.workplaceType}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-[#D4F73C]/20 border border-emerald-500/30 text-center shrink-0 self-start space-y-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Match Score</span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums mt-0.5">
                {match.matchScore}%
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                {match.matchScore >= 80 ? 'High Fit Placement' : 'Eligible Candidate'}
              </span>
              <button
                onClick={() => setExplainingJob(selectedJob)}
                className="w-full mt-2 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#D4F73C]" />
                <span>AI Fit Breakdown</span>
              </button>
            </div>
          </div>

          {/* AI Match Fit Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Placement Compatibility Insights</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {match.recommendationSummary}
            </p>
            {match.competitiveEdge && (
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                <Award className="w-3.5 h-3.5" />
                <span>Competitive Advantage: {match.competitiveEdge}</span>
              </div>
            )}
          </div>

          {/* Quick Apply Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-white block">
                {applied
                  ? `Application Status: ${appDetails?.status || 'Submitted'}`
                  : 'Direct Campus Recruitment Fast-Track'}
              </span>
              <span>
                {applied
                  ? `Submitted on ${appDetails?.appliedDate || 'recently'}. Track your application stages and interviews directly in the tracker.`
                  : 'Fast-track technical interview scheduling with corporate HR partners.'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {applied && (
                <button
                  onClick={() => navigate('/student/applications')}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                id="apply-job-detail-btn"
                onClick={() => openApplyModal(selectedJob)}
                className={`px-6 py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  applied
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216]'
                }`}
              >
                {applied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Zap className="w-4 h-4" />}
                <span>{applied ? `Applied (${appDetails?.status || 'In Review'})` : 'Submit Graduate Application'}</span>
              </button>
            </div>
          </div>

          {/* Role Description */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Role Description & Practice Area
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {selectedJob.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {selectedJob.responsibilities && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Day-to-Day Responsibilities
              </h2>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {selectedJob.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Breakdown */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Required Technical Stack & Fit Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedJob.requiredSkills.map((req, i) => {
                const isMatched = match.matchedSkills.some(
                  (ms) => ms.toLowerCase() === req.toLowerCase()
                );
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                      isMatched
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/30 text-gray-900 dark:text-white'
                        : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span>{req}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isMatched
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {isMatched ? 'Verified Competency' : 'Gap to Address'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {applyingJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Graduate Placement Application
                  </h3>
                </div>
                <button
                  onClick={() => setApplyingJob(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Applying for <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.title}</span> at <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.companyName}</span>.
              </p>

              <form onSubmit={submitApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Candidate Statement / Pitch:
                  </label>
                  <textarea
                    rows={4}
                    value={customPitch}
                    onChange={(e) => setCustomPitch(e.target.value)}
                    placeholder="Highlight relevant engineering achievements, capstone projects or why you are a strong candidate..."
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-500 space-y-1">
                  <div className="font-bold text-gray-700 dark:text-gray-300">Attached Placement Dossier:</div>
                  <div>• Candidate: {studentProfile.name} ({studentProfile.department})</div>
                  <div>• Academic CGPA: {studentProfile.cgpa} / 10.0</div>
                  <div>• AI Skill Scorecard & Portfolio Capstone links attached</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Directory View
  return (
    <div className="space-y-8 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Step 5.2 • Full-Time Graduate Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Full-Time Graduate Jobs
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl leading-relaxed">
            Campus hiring positions and enterprise graduate engineering openings calibrated with your verified skills and target career benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="quick-filter-saved-btn"
            onClick={() => setActivityFilter(activityFilter === 'saved' ? 'all' : 'saved')}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activityFilter === 'saved'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
            title="Filter by saved bookmarks"
          >
            <Bookmark className={`w-3.5 h-3.5 ${activityFilter === 'saved' ? 'fill-current text-amber-500' : ''}`} />
            <span>Saved ({fulltimeCounts.saved})</span>
          </button>

          <button
            id="quick-filter-applied-btn"
            onClick={() => setActivityFilter(activityFilter === 'applied' ? 'all' : 'applied')}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activityFilter === 'applied'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
            title="Filter by roles you have applied for"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${activityFilter === 'applied' ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span>Applied ({fulltimeCounts.applied})</span>
          </button>

          <button
            id="nav-applications-btn"
            onClick={() => navigate('/student/applications')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>My Applications ({applications.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Segmented Pipeline Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-gray-100/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            id="tab-all-roles"
            onClick={() => setActivityFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activityFilter === 'all'
                ? 'bg-white dark:bg-[#1C1D24] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            <span>All Graduate Roles</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activityFilter === 'all'
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                  : 'bg-gray-200/70 dark:bg-white/5 text-gray-600 dark:text-gray-400'
              }`}
            >
              {fulltimeCounts.total}
            </span>
          </button>

          <button
            id="tab-saved-roles"
            onClick={() => setActivityFilter('saved')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activityFilter === 'saved'
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 shadow-xs border border-amber-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                activityFilter === 'saved' ? 'fill-current text-amber-500' : 'text-gray-400'
              }`}
            />
            <span>Saved Roles</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activityFilter === 'saved'
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200'
                  : 'bg-gray-200/70 dark:bg-white/5 text-gray-600 dark:text-gray-400'
              }`}
            >
              {fulltimeCounts.saved}
            </span>
          </button>

          <button
            id="tab-applied-roles"
            onClick={() => setActivityFilter('applied')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activityFilter === 'applied'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 shadow-xs border border-emerald-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                activityFilter === 'applied' ? 'text-emerald-500' : 'text-gray-400'
              }`}
            />
            <span>Applied Roles</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activityFilter === 'applied'
                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                  : 'bg-gray-200/70 dark:bg-white/5 text-gray-600 dark:text-gray-400'
              }`}
            >
              {fulltimeCounts.applied}
            </span>
          </button>
        </div>

        {activityFilter !== 'all' && (
          <button
            onClick={() => setActivityFilter('all')}
            className="text-[11px] font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white px-2 py-1 transition-colors cursor-pointer self-end sm:self-center"
          >
            Show All Roles ({fulltimeCounts.total})
          </button>
        )}
      </div>

      {/* Multi-Filter Controls */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="job-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search graduate job title, company name or skill (e.g. Python, Spring Boot, DevOps)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-semibold">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Pipeline Status</label>
            <select
              id="pipeline-filter-select"
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="all">All Roles ({fulltimeCounts.total})</option>
              <option value="saved">Saved Only ({fulltimeCounts.saved})</option>
              <option value="applied">Applied Only ({fulltimeCounts.applied})</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Career Track</label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="All">All Tracks</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="AI/ML Developer">AI / ML Engineer</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Data Analyst">Data Analyst</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">AI Match Score</label>
            <select
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="all">All Match Scores</option>
              <option value="80">&gt; 80% Match (High Fit)</option>
              <option value="60">&gt; 60% Match (Good Fit)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="All">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Workplace Mode</label>
            <select
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="All">All Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="match">Highest AI Match</option>
              <option value="salary">Highest Package (CTC)</option>
              <option value="latest">Latest Posted</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(activityFilter !== 'all' ||
          searchQuery.trim() !== '' ||
          selectedTrack !== 'All' ||
          selectedLocation !== 'All' ||
          selectedWorkplace !== 'All' ||
          matchThreshold !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5 text-[11px]">
            <span className="text-gray-400 font-medium">Active Filters:</span>

            {activityFilter === 'saved' && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1.5">
                <Bookmark className="w-3 h-3 fill-current" />
                <span>Saved Roles Only</span>
                <button
                  onClick={() => setActivityFilter('all')}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                  title="Remove saved filter"
                >
                  ✕
                </button>
              </span>
            )}

            {activityFilter === 'applied' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Applied Roles Only</span>
                <button
                  onClick={() => setActivityFilter('all')}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                  title="Remove applied filter"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                <span>Keyword: &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedTrack !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium flex items-center gap-1.5">
                <span>Track: {selectedTrack}</span>
                <button
                  onClick={() => setSelectedTrack('All')}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {matchThreshold !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                <span>Match &gt; {matchThreshold}%</span>
                <button
                  onClick={() => setMatchThreshold('all')}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTrack('All');
                setSelectedLocation('All');
                setSelectedWorkplace('All');
                setMatchThreshold('all');
                setActivityFilter('all');
              }}
              className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white underline cursor-pointer ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>
            Showing {fulltimeJobs.length} Graduate Opportunities
            {activityFilter === 'saved' && ' (Saved)'}
            {activityFilter === 'applied' && ' (Applied)'}
          </span>
          <span>Ranked by AI Compatibility</span>
        </div>

        {fulltimeJobs.length === 0 ? (
          activityFilter === 'saved' ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">No Saved Graduate Jobs Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  You haven&apos;t bookmarked any graduate opportunities yet. Click the bookmark icon on any job card to save roles you want to review or apply to later.
                </p>
              </div>
              <button
                onClick={() => setActivityFilter('all')}
                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] text-xs font-bold cursor-pointer transition-all hover:opacity-90"
              >
                Browse All Graduate Roles ({fulltimeCounts.total})
              </button>
            </div>
          ) : activityFilter === 'applied' ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">No Applied Graduate Jobs Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  You haven&apos;t submitted applications to any graduate roles yet. Explore open positions matching your verified competencies to kickstart recruitment.
                </p>
              </div>
              <button
                onClick={() => setActivityFilter('all')}
                className="px-4 py-2 rounded-xl bg-[#D4F73C] text-[#111216] hover:bg-[#c6ea31] text-xs font-bold cursor-pointer transition-all"
              >
                Explore Available Graduate Roles ({fulltimeCounts.total})
              </button>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 space-y-3">
              <Briefcase className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="font-bold text-sm text-gray-800 dark:text-gray-200">No graduate jobs match your criteria</div>
              <p className="text-xs text-gray-500">Try adjusting your filters or resetting the search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTrack('All');
                  setSelectedLocation('All');
                  setSelectedWorkplace('All');
                  setMatchThreshold('all');
                  setActivityFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fulltimeJobs.map((job) => {
              const match = jobMatchesMap.get(job.id) || {
                matchScore: 82,
                matchedSkills: job.requiredSkills.slice(0, 2),
                missingSkills: job.requiredSkills.slice(2),
                gpaEligible: true,
                recommendationSummary: '',
                competitiveEdge: '',
              };
              const applied = hasApplied(job.id);
              const jobApp = getApplication(job.id);
              const saved = isSaved(job.id);
              const track = getJobCareerTrack(job);

              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-gray-400 dark:hover:border-white/20 transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              {job.companyName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                              {track}
                            </span>
                            {applied && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                <span>Applied • {jobApp?.status || 'Submitted'}</span>
                              </span>
                            )}
                            {saved && !applied && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Bookmark className="w-2.5 h-2.5 fill-current text-amber-500" />
                                <span>Saved</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug mt-0.5">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleSaveInternship(job.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            saved
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/40 text-amber-600 dark:text-amber-400'
                              : 'border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white'
                          }`}
                          title={saved ? 'Remove Bookmark' : 'Save Bookmark'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                        </button>
                        <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#84B000] dark:text-[#D4F73C]" />
                          <span>{match.matchScore}% Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                        <Banknote className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                        <span>{job.stipendOrSalary}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        {job.workplaceType}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Matched vs Missing Skills */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mr-1">Matched:</span>
                        {match.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {match.missingSkills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase mr-1">Gaps:</span>
                          {match.missingSkills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                    <button
                      id={`ai-explain-job-${job.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExplainingJob(job);
                      }}
                      className="px-2.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="AI Match Breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span className="hidden sm:inline">AI Match</span>
                    </button>

                    <button
                      id={`view-details-${job.id}`}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        navigate(`/student/jobs/${job.id}`);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Fit & Details</span>
                    </button>

                    <button
                      id={`apply-now-${job.id}`}
                      onClick={() => (applied ? navigate('/student/applications') : openApplyModal(job))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        applied
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                          : 'bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216]'
                      }`}
                      title={applied ? 'View application status in tracker' : 'Submit graduate application'}
                    >
                      {applied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Applied ({jobApp?.status || 'In Review'})</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Apply Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Pitch Modal for Full-Time Directory */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Graduate Placement Application
                </h3>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Applying for <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.title}</span> at <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.companyName}</span>.
            </p>

            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Candidate Statement / Pitch:
                </label>
                <textarea
                  rows={4}
                  value={customPitch}
                  onChange={(e) => setCustomPitch(e.target.value)}
                  placeholder="Highlight relevant engineering achievements, capstone projects or why you are a strong candidate..."
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-500 space-y-1">
                <div className="font-bold text-gray-700 dark:text-gray-300">Attached Placement Dossier:</div>
                <div>• Candidate: {studentProfile.name} ({studentProfile.department})</div>
                <div>• Academic CGPA: {studentProfile.cgpa} / 10.0</div>
                <div>• AI Skill Scorecard & Portfolio Capstone links attached</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gemini AI Match Explanation Modal */}
      {explainingJob && (
        <AIMatchExplanation
          job={explainingJob}
          studentProfile={studentProfile}
          onClose={() => setExplainingJob(null)}
          onApply={() => {
            const j = explainingJob;
            setExplainingJob(null);
            openApplyModal(j);
          }}
        />
      )}
    </div>
  );
};
