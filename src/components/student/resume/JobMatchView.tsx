import React, { useState } from 'react';
import { JobMatchResult } from '../../../services/aiService';
import {
  Briefcase,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Key,
  Sliders,
  ArrowRight,
  Building,
  Target,
} from 'lucide-react';

interface JobMatchViewProps {
  resumeText: string;
  onRunJobMatch: (jobDesc: string, jobTitle: string) => void;
  isMatching: boolean;
  matchResult: JobMatchResult | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const SAMPLE_JOB_POSTINGS = [
  {
    title: 'Senior Full-Stack AI Engineer',
    company: 'Stripe / Scale AI',
    desc: `We are looking for a Senior Full-Stack AI Engineer to architect high-performance, low-latency applications.
Key Requirements:
• 3+ years experience with TypeScript, React 19, Next.js, and Node.js microservices.
• Deep understanding of relational databases (PostgreSQL), distributed caching (Redis), and connection pooling.
• Experience integrating LLMs (Google Gemini, OpenAI) using structured outputs, tool calling, and streaming.
• Strong Docker containerization, Kubernetes orchestration, and CI/CD automation background.
• Focus on measurable system uptime, sub-50ms latency, and end-to-end testing with Playwright/Jest.`,
  },
  {
    title: 'Cloud Backend Infrastructure Intern',
    company: 'Google Cloud Platform',
    desc: `Join the Google Cloud Platform engineering team to build scalable cloud telemetry and distributed task execution frameworks.
Minimum Qualifications:
• Currently pursuing a B.S. or M.S. in Computer Science or related STEM field with strong GPA (3.5+).
• Proficiency in Python, Go, C++, or TypeScript.
• Practical understanding of data structures, algorithms, event loops, and database indexing.
• Experience with Docker containerization, REST/gRPC protocols, and Git version control.
• Solid communication and cross-functional engineering collaboration skills.`,
  },
  {
    title: 'DevOps & Site Reliability Engineer',
    company: 'Datadog / Cloudflare',
    desc: `Seeking a DevOps / SRE Engineer to scale high-throughput observability pipelines processing millions of events per second.
Qualifications:
• Strong Linux systems administration and Bash scripting proficiency.
• Hands-on experience with Kubernetes, Terraform, Docker, and GitHub Actions CI/CD workflows.
• Deep familiarity with Redis Streams, Kafka, and PostgreSQL replication topologies.
• Proven track record optimizing latency, memory footprints, and system failure recovery.`,
  },
];

export const JobMatchView: React.FC<JobMatchViewProps> = ({
  resumeText,
  onRunJobMatch,
  isMatching,
  matchResult,
  showToast,
}) => {
  const [jobTitle, setJobTitle] = useState(SAMPLE_JOB_POSTINGS[0].title);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_POSTINGS[0].desc);

  const handleSelectSample = (sample: (typeof SAMPLE_JOB_POSTINGS)[0]) => {
    setJobTitle(sample.title);
    setJobDescription(sample.desc);
    showToast(`Loaded sample role: ${sample.title} (${sample.company})`, 'info');
  };

  const handleRunMatch = () => {
    if (!jobDescription.trim()) {
      showToast('Please paste a job description first.', 'error');
      return;
    }
    if (!resumeText.trim()) {
      showToast('Please upload or paste your resume before running job match.', 'error');
      return;
    }
    onRunJobMatch(jobDescription, jobTitle);
  };

  return (
    <div className="space-y-6">
      {/* Input Section: Target Job Details */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Target Job Description Analysis
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-0.5">
              Paste the vacancy posting to simulate real-time enterprise ATS qualification filtering.
            </p>
          </div>

          <button
            id="analyze-against-job-action-btn"
            onClick={handleRunMatch}
            disabled={isMatching || !jobDescription.trim()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating ATS Filter...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Analyze Against Job</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Job Buttons */}
        <div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
            Load Sample Job Posting (1-Click Test):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_JOB_POSTINGS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  jobTitle === sample.title
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-800 dark:text-blue-300'
                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-black dark:text-gray-300 hover:bg-gray-100'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>{sample.title}</span>
                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-normal">
                  ({sample.company})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Job Title Input */}
        <div>
          <label className="block text-xs font-bold text-black dark:text-white mb-1">
            Job Title / Target Role
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#121316] border border-gray-300 dark:border-white/15 text-xs font-semibold text-black dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Description Textarea */}
        <div>
          <label className="block text-xs font-bold text-black dark:text-white mb-1">
            Full Job Description / Requirements
          </label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description or requirements here..."
            className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#121316] border border-gray-300 dark:border-white/15 text-xs font-mono font-medium text-black dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div className="space-y-6">
          {/* Top Verdict Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  ATS Verdict: {matchResult.atsVerdict}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-normal">
                  Target: {matchResult.jobTitle}
                </span>
              </div>
              <h3 className="text-base font-bold text-black dark:text-white">
                Candidate Competency Fit Summary
              </h3>
              <p className="text-xs text-gray-800 dark:text-gray-200 mt-1 max-w-2xl font-normal leading-relaxed">
                {matchResult.fitSummary}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-center shrink-0 min-w-[130px]">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 block">
                Job Match Score
              </span>
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                {matchResult.jobMatchPercentage}%
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                Top 5% Cohort
              </span>
            </div>
          </div>

          {/* Matching Skills vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-black dark:text-white">
                  Matching Required Skills ({matchResult.matchingSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-black dark:text-white">
                  Missing Skills for This Posting ({matchResult.missingSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/60"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Important Keywords & Recommended Changes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Keywords */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-black dark:text-white">
                  High-Weight ATS Keywords
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.importantKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Changes */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  <Sliders className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-black dark:text-white">
                  Recommended Tailoring Changes
                </h4>
              </div>
              <ul className="space-y-2">
                {matchResult.recommendedChanges.map((rec, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-purple-50/30 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs text-black dark:text-gray-200 font-normal leading-relaxed flex items-start gap-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
