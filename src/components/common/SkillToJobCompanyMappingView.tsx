import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillCompanyMapping } from '../../types';
import {
  Layers,
  Sparkles,
  Building2,
  TrendingUp,
  Award,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Code2,
  ExternalLink,
} from 'lucide-react';

export const SkillToJobCompanyMappingView: React.FC = () => {
  const { skillCompanyMappings, navigate, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSkillId, setActiveSkillId] = useState<string>(
    skillCompanyMappings[0]?.skillId || ''
  );

  const filteredMappings = useMemo(() => {
    return skillCompanyMappings.filter((m) => {
      const matchSearch =
        m.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hiringCompanies.some((c) => c.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.benchmarkProjectTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [skillCompanyMappings, searchQuery, selectedCategory]);

  const activeMapping = useMemo(() => {
    return (
      skillCompanyMappings.find((m) => m.skillId === activeSkillId) ||
      filteredMappings[0] ||
      skillCompanyMappings[0]
    );
  }, [skillCompanyMappings, activeSkillId, filteredMappings]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
            <Layers className="w-3.5 h-3.5 text-[#D4F73C]" />
            <span>Skill–Demand Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Skill-to-Job & Company Mapping Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Directly connect verified technical competencies with hiring technology enterprises, targeted engineering job titles, compensation brackets, and benchmark capstone requirements.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search skill (e.g. React, Go, Docker)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-xs font-semibold outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Frontend', 'Backend', 'Cloud & DevOps', 'AI & Data Science'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat === 'ALL' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Layout: Left Skills Matrix + Right Hiring Companies & Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Skills List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-gray-500 block px-1">
            Tracked Competencies ({filteredMappings.length})
          </span>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredMappings.map((m) => {
              const isSelected = activeMapping?.skillId === m.skillId;
              const hasGap = m.demandSupplyGapPercentage > 20;

              return (
                <div
                  key={m.skillId}
                  onClick={() => setActiveSkillId(m.skillId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/40 shadow-xs dark:bg-teal-500/15'
                      : 'soft-card hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                        {m.category}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                        {m.skillName}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        {m.recruiterDemandPercentage}% Demand
                      </span>
                      {hasGap && (
                        <span className="text-[10px] text-amber-500 block font-bold">
                          +{m.demandSupplyGapPercentage}% Talent Gap
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cohort vs Demand Progress */}
                  <div className="mt-3 space-y-1 text-[11px]">
                    <div className="flex justify-between text-gray-500">
                      <span>Cohort Verified: {m.cohortProficiencyPercentage}%</span>
                      <span>Target: {m.recruiterDemandPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden flex">
                      <div
                        className="bg-teal-500 h-1.5 rounded-l-full"
                        style={{ width: `${m.cohortProficiencyPercentage}%` }}
                      />
                      <div
                        className="bg-amber-400 h-1.5 opacity-60"
                        style={{ width: `${m.demandSupplyGapPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                    <span>{m.hiringCompanies.length} Top Recruiters</span>
                    <span className="font-semibold text-teal-600">Inspect Map →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Hiring Companies and Benchmark Capstones */}
        <div className="lg:col-span-7">
          {activeMapping ? (
            <div className="soft-card p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {activeMapping.category} Competency
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                    {activeMapping.skillName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/student/roadmap')}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Start Learning Track
                  </button>
                  <button
                    onClick={() => navigate('/student/jobs')}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold text-xs text-gray-700 dark:text-gray-300"
                  >
                    View Open Drives
                  </button>
                </div>
              </div>

              {/* Hiring Companies Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-500" />
                  <span>Companies Actively Hiring For This Skill</span>
                </h4>

                <div className="space-y-2.5">
                  {activeMapping.hiringCompanies.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={comp.companyLogo}
                          alt={comp.companyName}
                          className="w-10 h-10 rounded-2xl object-cover border border-gray-200 dark:border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                              {comp.companyName}
                            </h5>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
                              {comp.tier}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Roles: {comp.roles.join(', ')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          {comp.packageRange}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-bold">Package Band</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Benchmark Project Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent border border-teal-500/20 space-y-2">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  <Code2 className="w-4 h-4" />
                  <span>Recommended Industry Benchmark Capstone</span>
                </div>
                <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                  {activeMapping.benchmarkProjectTitle}
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activeMapping.recommendedBenchmark}
                </p>
              </div>
            </div>
          ) : (
            <div className="soft-card p-12 text-center text-gray-400">
              Select a skill to view mapped recruiters and salary bands.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
