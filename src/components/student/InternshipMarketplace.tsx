import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';
import { aiService } from '../../services/aiService';
import {
  Search,
  Filter,
  MapPin,
  Banknote,
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Send,
  X,
  UserCheck,
  Award,
  Loader2,
} from 'lucide-react';
import { AIMatchExplanation } from '../common/AIMatchExplanation';

export const InternshipMarketplace: React.FC = () => {
  const {
    jobs,
    applications,
    applyForJobWithDetails,
    selectedInternshipId,
    setSelectedInternshipId,
    savedInternshipIds,
    toggleSaveInternship,
    studentProfile,
    navigate,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [matchThreshold, setMatchThreshold] = useState<'all' | '80' | '60'>('all');
  const [minStipend, setMinStipend] = useState(0);
  const [sortBy, setSortBy] = useState<'match' | 'latest' | 'stipend'>('match');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Gemini AI Match Explanation Modal state
  const [explainingJob, setExplainingJob] = useState<JobPosting | null>(null);

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [customPitch, setCustomPitch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute AI match for all jobs
  const jobMatchesMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof aiService.matchInternship>>();
    jobs.forEach((j) => {
      map.set(j.id, aiService.matchInternship(studentProfile, j));
    });
    return map;
  }, [jobs, studentProfile]);

  // Selected job for detail view
  const selectedJob = jobs.find((j) => j.id === selectedInternshipId);

  const hasApplied = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const isSaved = (jobId: string) => {
    return savedInternshipIds.includes(jobId);
  };

  const openApplyModal = (job: JobPosting) => {
    if (hasApplied(job.id)) {
      showToast('You have already applied for this role! Tracking status in Applications.', 'info');
      navigate('/student/applications');
      return;
    }
    setApplyingJob(job);
    const match = jobMatchesMap.get(job.id);
    const defaultPitch = `I am very excited to apply for the ${job.title} position at ${job.companyName}. With evaluated proficiencies in ${match?.matchedSkills?.slice(0, 3).join(', ') || 'software engineering'}, I am ready to contribute from day one.`;
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
        '/verified_portfolio_resume.pdf'
      );
      setIsSubmitting(false);
      setApplyingJob(null);
      showToast(`Application submitted for ${applyingJob.title} at ${applyingJob.companyName}!`, 'success');
    }, 400);
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const match = jobMatchesMap.get(job.id);
        const matchScore = match?.matchScore || 70;

        // Only internships/apprenticeships or all
        const isInternshipType = job.type === 'Internship' || job.type === 'Apprenticeship';
        if (!isInternshipType) return false;

        if (showSavedOnly && !savedInternshipIds.includes(job.id)) {
          return false;
        }

        const matchesSearch =
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSkill =
          selectedSkill === 'All' ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));

        const matchesLocation =
          selectedLocation === 'All' ||
          job.location.toLowerCase().includes(selectedLocation.toLowerCase());

        const matchesWorkplace =
          selectedWorkplace === 'All' || job.workplaceType === selectedWorkplace;

        const matchesScore =
          matchThreshold === 'all' ||
          (matchThreshold === '80' && matchScore >= 80) ||
          (matchThreshold === '60' && matchScore >= 60);

        return matchesSearch && matchesSkill && matchesLocation && matchesWorkplace && matchesScore;
      })
      .sort((a, b) => {
        const matchA = jobMatchesMap.get(a.id)?.matchScore || 0;
        const matchB = jobMatchesMap.get(b.id)?.matchScore || 0;

        if (sortBy === 'match') {
          return matchB - matchA;
        } else if (sortBy === 'stipend') {
          // parse rough number from stipend string
          const numA = parseInt(a.stipendOrSalary.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.stipendOrSalary.replace(/\D/g, '')) || 0;
          return numB - numA;
        } else {
          // latest
          return b.id.localeCompare(a.id);
        }
      });
  }, [
    jobs,
    jobMatchesMap,
    searchQuery,
    selectedSkill,
    selectedLocation,
    selectedWorkplace,
    matchThreshold,
    sortBy,
    showSavedOnly,
    savedInternshipIds,
  ]);

  // Detail View
  if (selectedJob) {
    const match = jobMatchesMap.get(selectedJob.id) || {
      matchScore: 88,
      matchedSkills: selectedJob.requiredSkills.slice(0, 2),
      missingSkills: selectedJob.requiredSkills.slice(2),
      gpaEligible: true,
      recommendationSummary: 'Strong match based on verified technical foundations.',
      competitiveEdge: 'High placement compatibility with industry project portfolio',
    };
    const applied = hasApplied(selectedJob.id);
    const saved = isSaved(selectedJob.id);

    return (
      <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedInternshipId(null);
              navigate('/student/internships');
            }}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Internship Directory</span>
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {selectedJob.companyName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30">
                    Verified Industry Partner
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
                  <div className="flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      {selectedJob.stipendOrSalary}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{selectedJob.type}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    {selectedJob.workplaceType}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Match Badge Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-[#D4F73C]/20 border border-emerald-500/30 text-center shrink-0 self-start space-y-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Match Score</span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums mt-0.5">
                {match.matchScore}%
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                {match.matchScore >= 80 ? 'Exceptional Fit' : 'Strong Candidate'}
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

          {/* AI Match Insight Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Why You Matched This Role</span>
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
                Verified Campus Application Pipeline
              </span>
              <span>Your verified academic scorecard, GPA ({studentProfile.cgpa}), and skills will be submitted.</span>
            </div>
            <button
              id="apply-detail-btn"
              onClick={() => openApplyModal(selectedJob)}
              className={`px-6 py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                applied
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-white/10'
                  : 'bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216]'
              }`}
            >
              {applied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Zap className="w-4 h-4" />}
              <span>{applied ? 'Application Under Review' : 'Apply with SkillBridge Profile'}</span>
            </button>
          </div>

          {/* Role Description */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Role Overview
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {selectedJob.description}
            </p>
          </div>

          {/* Responsibilities */}
          {selectedJob.responsibilities && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Key Responsibilities
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

          {/* Skills Breakdown (Matched vs Missing) */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Required Skills & Match Breakdown
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
                      {isMatched ? 'Verified Skill' : 'Gap to Address'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Application Pitch Modal */}
        {applyingJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Campus Application Pitch
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
                Applying to <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.title}</span> at <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.companyName}</span>.
              </p>

              <form onSubmit={submitApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Personalized Elevator Pitch (Optional):
                  </label>
                  <textarea
                    rows={4}
                    value={customPitch}
                    onChange={(e) => setCustomPitch(e.target.value)}
                    placeholder="Describe your relevant projects, coursework or why you are a great fit..."
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-500 space-y-1">
                  <div className="font-bold text-gray-700 dark:text-gray-300">Attached Candidate Credentials:</div>
                  <div>• Candidate: {studentProfile.name} ({studentProfile.department})</div>
                  <div>• Academic GPA: {studentProfile.cgpa} / 10.0</div>
                  <div>• Verified Skill Scorecard & Portfolio Link included</div>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Step 5 • AI Internship & Opportunity Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Internship Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl leading-relaxed">
            Live internships and campus apprenticeships from verified technology partners, with real-time AI compatibility scoring, missing skills warnings, and 1-click applications.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showSavedOnly
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
            <span>Saved Roles ({savedInternshipIds.length})</span>
          </button>
          <button
            onClick={() => navigate('/student/applications')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>My Applications ({applications.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Filter Controls */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="internship-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role title, company name or required skill (e.g. Python, Docker, AI, React)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs font-semibold">
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
            <label className="block text-[11px] text-gray-400 mb-1">Filter by Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="All">All Skills</option>
              <option value="Python">Python</option>
              <option value="React">React / Frontend</option>
              <option value="SQL">SQL / Databases</option>
              <option value="Docker">Docker / Cloud</option>
              <option value="Machine Learning">Machine Learning / AI</option>
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
              <option value="Mumbai">Mumbai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Workplace Type</label>
            <select
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
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
              <option value="latest">Latest Posted</option>
              <option value="stipend">Highest Stipend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>Showing {filteredJobs.length} Live Opportunities</span>
          <span>Ranked by AI Compatibility</span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 space-y-3">
            <Briefcase className="w-8 h-8 text-gray-400 mx-auto" />
            <div className="font-bold text-sm text-gray-800 dark:text-gray-200">No opportunities match your filter criteria</div>
            <p className="text-xs text-gray-500">Try adjusting your filters or resetting the search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('All');
                setSelectedLocation('All');
                setSelectedWorkplace('All');
                setMatchThreshold('all');
                setShowSavedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => {
              const match = jobMatchesMap.get(job.id) || {
                matchScore: 80,
                matchedSkills: job.requiredSkills.slice(0, 2),
                missingSkills: job.requiredSkills.slice(2),
                gpaEligible: true,
                recommendationSummary: '',
                competitiveEdge: '',
              };
              const applied = hasApplied(job.id);
              const saved = isSaved(job.id);

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
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            {job.companyName}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
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

                    {/* Matched vs Missing Skills highlights */}
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
                      id={`ai-explain-${job.id}`}
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
                        setSelectedInternshipId(job.id);
                        navigate(`/student/internships/${job.id}`);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Fit & Details</span>
                    </button>

                    <button
                      id={`apply-now-${job.id}`}
                      onClick={() => openApplyModal(job)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        applied
                          ? 'bg-gray-100 dark:bg-white/10 text-gray-500'
                          : 'bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216]'
                      }`}
                    >
                      {applied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Applied</span>
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

      {/* Application Pitch Modal for Directory View */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Campus Application Pitch
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
              Applying to <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.title}</span> at <span className="font-bold text-gray-800 dark:text-gray-200">{applyingJob.companyName}</span>.
            </p>

            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Personalized Elevator Pitch:
                </label>
                <textarea
                  rows={4}
                  value={customPitch}
                  onChange={(e) => setCustomPitch(e.target.value)}
                  placeholder="Describe your relevant projects, coursework or why you are a great fit..."
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-500 space-y-1">
                <div className="font-bold text-gray-700 dark:text-gray-300">Candidate Credentials Attached:</div>
                <div>• Candidate: {studentProfile.name} ({studentProfile.department})</div>
                <div>• Academic GPA: {studentProfile.cgpa} / 10.0</div>
                <div>• Verified Skill Scorecard & Portfolio Link included</div>
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
