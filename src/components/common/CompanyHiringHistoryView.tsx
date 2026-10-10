import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyHiringHistoryItem } from '../../types';
import {
  Building2,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  Award,
  Users,
  Sparkles,
  ChevronRight,
  Briefcase,
  Star,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const CompanyHiringHistoryView: React.FC = () => {
  const { companyHiringHistory, isDarkMode } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [activeCompanyId, setActiveCompanyId] = useState<string>(
    companyHiringHistory[0]?.id || ''
  );

  const filteredCompanies = useMemo(() => {
    return companyHiringHistory.filter((c) => {
      const matchSearch =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.primaryTechStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTier = selectedTier === 'ALL' || c.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [companyHiringHistory, searchQuery, selectedTier]);

  const activeCompany = useMemo(() => {
    return (
      companyHiringHistory.find((c) => c.id === activeCompanyId) ||
      filteredCompanies[0] ||
      companyHiringHistory[0]
    );
  }, [companyHiringHistory, activeCompanyId, filteredCompanies]);

  const chartData = useMemo(() => {
    if (!activeCompany) return [];
    return activeCompany.yearlyTrends.map((yt) => ({
      year: yt.year.toString(),
      avgCtc: yt.averageCtcLpa,
      peakCtc: yt.highestCtcLpa,
      hires: yt.totalHires,
      stipend: Math.round(yt.internStipendMonthly / 1000), // in Thousands
    }));
  }, [activeCompany]);

  const chartTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#2D303E' : '#E5E7EB';

  return (
    <div className="space-y-6 font-sans">
      {/* Top Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
            <TrendingUp className="w-3.5 h-3.5 text-[#D4F73C]" />
            <span>Longitudinal Recruiter Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Company Hiring History & Package Trends
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Multi-year hiring volume, compensation trajectory (average and highest CTC), intern-to-PPO conversion ratios, and evaluation tech stacks across campus recruitment seasons.
          </p>
        </div>
      </div>

      {/* Search & Tier Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search company, tech stack, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Super Dream', 'Tier 1 Dream', 'Core Enterprise'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              {tier === 'ALL' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Company List + Right Deep-Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Company Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-500">
              Visiting Recruiters ({filteredCompanies.length})
            </span>
            <span className="text-[11px] text-gray-400">Click to inspect 5-year trends</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredCompanies.map((c) => {
              const latestYear = c.yearlyTrends[c.yearlyTrends.length - 1];
              const isSelected = activeCompany?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCompanyId(c.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-xs dark:bg-indigo-500/15'
                      : 'soft-card hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.companyLogo}
                        alt={c.companyName}
                        className="w-11 h-11 rounded-2xl object-cover border border-gray-200 dark:border-white/10"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>{c.companyName}</span>
                          {c.tier === 'Super Dream' && (
                            <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold text-[9px]">
                              Super Dream
                            </span>
                          )}
                        </h4>
                        <span className="text-[11px] text-gray-500 block truncate max-w-[200px]">
                          {c.industry}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        ₹{latestYear.averageCtcLpa} LPA
                      </div>
                      <span className="text-[10px] text-gray-400">Avg 2026</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-semibold">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{c.overallHiresCount} Total Hires</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{c.ratingByStudents} / 5</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed 5-Year Longitudinal Trend Dashboard */}
        <div className="lg:col-span-7">
          {activeCompany ? (
            <div className="soft-card p-6 space-y-6">
              {/* Company Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <img
                    src={activeCompany.companyLogo}
                    alt={activeCompany.companyName}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-200 dark:border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {activeCompany.companyName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600">
                        {activeCompany.tier}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{activeCompany.headquarters}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold">Repeat Hiring</span>
                    <span className="text-sm font-black text-emerald-600">
                      {activeCompany.repeatHiringConsecutiveYears} Years
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold">Selection Ratio</span>
                    <span className="text-sm font-black text-purple-600">
                      {activeCompany.selectionRatio}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trend Chart: Average CTC & Peak CTC Trajectory */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Compensation Growth Trajectory (2022 - 2026)</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">Values in ₹ LPA</span>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                      <XAxis dataKey="year" stroke={chartTextColor} fontSize={11} />
                      <YAxis stroke={chartTextColor} fontSize={11} domain={[0, 'dataMax + 5']} tickFormatter={(v) => `₹${v}L`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#1E2029' : '#FFFFFF',
                          borderColor: isDarkMode ? '#2D303E' : '#E5E7EB',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Line
                        type="monotone"
                        dataKey="peakCtc"
                        name="Highest Package (₹ LPA)"
                        stroke="#8B5CF6"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgCtc"
                        name="Average Package (₹ LPA)"
                        stroke="#10B981"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Yearly Breakdown Strip */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Season-by-Season Recruitment Log
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {activeCompany.yearlyTrends.map((yt) => (
                    <div
                      key={yt.year}
                      className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center"
                    >
                      <span className="text-xs font-black text-gray-900 dark:text-white block">
                        {yt.year}
                      </span>
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {yt.totalHires} Hires
                      </div>
                      <span className="text-[10px] text-gray-500 block">
                        ₹{yt.averageCtcLpa}L Avg
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 mt-1 block">
                        {yt.ppoConversionRatePercentage}% PPO
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Branch Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-white/5">
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-2">
                    Primary Tech Stack Demanded
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCompany.primaryTechStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-2">
                    Preferred Engineering Branches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCompany.preferredBranches.map((branch, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 block mt-2">
                    Minimum CGPA Cutoff: <strong className="text-gray-900 dark:text-white">{activeCompany.minCgpaCutoff} / 10.0</strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="soft-card p-12 text-center text-gray-400">
              Select a company to view hiring telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
