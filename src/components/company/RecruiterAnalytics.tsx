import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Download,
  Building,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecruiterAnalytics: React.FC = () => {
  const { applications, companyOffers, companyInterviews, jobs, showToast } = useApp();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'season'>('season');

  const totalApplicants = applications.length;
  const screenedCount = applications.filter((a) => a.status !== 'Applied').length;
  const interviewedCount = companyInterviews.length || applications.filter((a) => a.status === 'Interview Scheduled' || a.status === 'Technical Round' || a.status === 'Offer Extended' || a.status === 'Hired').length;
  const offersCount = companyOffers.length;
  const hiresCount = companyOffers.filter((o) => o.status === 'Accepted').length || applications.filter((a) => a.status === 'Hired').length;

  const funnelSteps = [
    { label: 'Campus Applicants', count: Math.max(totalApplicants, 142), pct: '100%', color: 'bg-blue-500' },
    { label: 'Resume Screened', count: Math.max(screenedCount, 88), pct: '62%', color: 'bg-indigo-500' },
    { label: 'Tech Evaluations', count: Math.max(interviewedCount, 36), pct: '25%', color: 'bg-purple-500' },
    { label: 'Offers Extended', count: Math.max(offersCount, 12), pct: '8.4%', color: 'bg-teal-500' },
    { label: 'Final Hires Placed', count: Math.max(hiresCount, 9), pct: '6.3%', color: 'bg-emerald-500' },
  ];

  const collegeDistribution = [
    { name: 'Apex National Institute of Technology', applicants: 64, hired: 4, conversion: '6.2%' },
    { name: 'Metro State University of Technology', applicants: 48, hired: 3, conversion: '6.2%' },
    { name: 'Valley Institute of Engineering', applicants: 30, hired: 2, conversion: '6.6%' },
  ];

  const skillDemandMatch = [
    { skill: 'TypeScript / Node.js', demand: 95, cohortSupply: 88, status: 'Balanced' },
    { skill: 'Distributed Cloud / Kubernetes', demand: 90, cohortSupply: 62, status: 'High Demand' },
    { skill: 'React / Frontend Architecture', demand: 85, cohortSupply: 94, status: 'Surplus' },
    { skill: 'AI / Google Gemini API & LLMs', demand: 92, cohortSupply: 58, status: 'High Demand' },
    { skill: 'PostgreSQL / Database Internals', demand: 80, cohortSupply: 75, status: 'Balanced' },
  ];

  const handleExportReport = () => {
    showToast('Exporting comprehensive Placement Drive Recruitment Audit (.CSV)...');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Recruitment Intelligence & Yield Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Campus Placement Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Real-time insights across university partner talent pipelines, conversion rates, hiring velocities, and skill gap supply indexes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white font-semibold"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="season">Campus Season 2025-26</option>
          </select>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pipeline Velocity</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">12.4 Days</h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              -3.2d vs avg
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Time from application to final offer</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Offer Acceptance Yield</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">83.3%</h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +5.4% YoY
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Top-tier candidate lock-in</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Avg Candidate Match Score</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">89.4%</h3>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-0.5" />
              AI-Audited
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Pre-vetted code portfolio score</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Partner Campuses Active</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">3 Institutions</h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">100% Verified</span>
          </div>
          <p className="text-[11px] text-gray-400">Accredited engineering cohorts</p>
        </div>
      </div>

      {/* Main Funnel & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Hiring Funnel Stage Conversion
              </h3>
              <p className="text-xs text-gray-500">
                End-to-end recruitment drop-off and conversion rates
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold">
              Funnel Health: Strong
            </span>
          </div>

          <div className="space-y-4">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    {step.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {step.count} candidates
                    </span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 text-[11px] w-12 text-right">
                      {step.pct}
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${step.color} transition-all duration-500`}
                    style={{ width: step.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institution Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Campus Sourcing Yield
            </h3>
            <p className="text-xs text-gray-500">
              Placement performance per partner college
            </p>
          </div>

          <div className="space-y-3">
            {collegeDistribution.map((col, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-2 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="truncate">{col.name}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                  <span>Applicants: <strong className="text-gray-900 dark:text-white">{col.applicants}</strong></span>
                  <span>Hired: <strong className="text-emerald-600 dark:text-emerald-400">{col.hired}</strong></span>
                  <span>Yield: <strong className="text-purple-600 dark:text-purple-400">{col.conversion}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Demand vs Supply Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Skill Match & Cohort Supply Index
          </h3>
          <p className="text-xs text-gray-500">
            Comparison between your job requirements and verified student proficiencies across colleges
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                <th className="pb-3">Technical Competency</th>
                <th className="pb-3">Company Demand Index</th>
                <th className="pb-3">Candidate Cohort Supply</th>
                <th className="pb-3">Market Alignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {skillDemandMatch.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="py-3.5 font-bold text-gray-900 dark:text-white">
                    {item.skill}
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-purple-600 dark:text-purple-400">
                    {item.demand}%
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {item.cohortSupply}%
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'High Demand'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : item.status === 'Balanced'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
