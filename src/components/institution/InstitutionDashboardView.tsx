import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Briefcase,
  TrendingUp,
  Building2,
  Award,
  AlertTriangle,
  ArrowRight,
  Plus,
  Download,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface InstitutionDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddPlacement: () => void;
  onOpenAddCollab: () => void;
}

export const InstitutionDashboardView: React.FC<InstitutionDashboardViewProps> = ({
  onNavigateTab,
  onOpenAddPlacement,
  onOpenAddCollab,
}) => {
  const {
    institutionStudents,
    facultyMembers,
    companies,
    jobs,
    applications,
    institutionPlacements,
    institutionCollaborations,
    industrialTraining,
    isDarkMode,
  } = useApp();

  // Dynamic calculations from live context data
  const totalStudents = institutionStudents.length;
  const totalFaculty = facultyMembers.length;
  const totalCompanies = companies.length;
  const verifiedCompanies = companies.filter((c) => c.verified).length;

  const internshipsCount = jobs.filter((j) => j.type === 'Internship').length;
  const activeStudentInternships = institutionStudents.filter(
    (s) => s.internshipStatus === 'In Internship' || s.internshipStatus === 'Completed'
  ).length;

  const placedStudents = institutionStudents.filter(
    (s) => s.placementStatus === 'Placed'
  ).length;
  const eligibleStudents = institutionStudents.filter(
    (s) => s.year === '4th Year' || s.year === '3rd Year'
  ).length || totalStudents;
  const placementRate = Math.round((placedStudents / (eligibleStudents || 1)) * 100);

  const placementReadyStudents = institutionStudents.filter(
    (s) => (s.skillReadiness || 0) >= 75
  ).length;
  const placementReadyPct = Math.round((placementReadyStudents / (totalStudents || 1)) * 100);

  // Highest, average, median CTC from institution placements
  const placementSalaries = institutionPlacements
    .map((p) => p.salaryNumberLpa)
    .filter((s): s is number => typeof s === 'number' && !isNaN(s));
  const highestCtc = placementSalaries.length > 0 ? Math.max(...placementSalaries) : 42.0;
  const avgCtc = placementSalaries.length > 0
    ? (placementSalaries.reduce((a, b) => a + b, 0) / placementSalaries.length).toFixed(1)
    : '18.4';

  // Department-wise readiness
  const deptReadinessMap: Record<string, { totalScore: number; count: number }> = {};
  institutionStudents.forEach((s) => {
    const dept = s.department || 'Other';
    if (!deptReadinessMap[dept]) {
      deptReadinessMap[dept] = { totalScore: 0, count: 0 };
    }
    deptReadinessMap[dept].totalScore += s.skillReadiness || 70;
    deptReadinessMap[dept].count += 1;
  });

  const departmentReadinessData = Object.entries(deptReadinessMap).map(([dept, data]) => ({
    department: dept,
    readiness: Math.round(data.totalScore / (data.count || 1)),
    students: data.count,
  }));

  // Skill Gaps aggregation
  const skillGapsSummary = [
    { skill: 'Distributed Systems & Go', gap: 32, demand: 88, current: 56, priority: 'High' },
    { skill: 'Kubernetes & Cloud Native CI/CD', gap: 28, demand: 85, current: 57, priority: 'High' },
    { skill: 'System Design & Scalability', gap: 25, demand: 90, current: 65, priority: 'High' },
    { skill: 'DSA & Graph Algorithms', gap: 22, demand: 82, current: 60, priority: 'Medium' },
    { skill: 'PostgreSQL Query Optimization', gap: 18, demand: 78, current: 60, priority: 'Medium' },
    { skill: 'DevOps & Observability', gap: 15, demand: 75, current: 60, priority: 'Low' },
  ];

  // Industry demand data
  const industryDemandSkills = [
    { skill: 'React / Next.js', count: 18, growth: '+24%' },
    { skill: 'TypeScript', count: 16, growth: '+31%' },
    { skill: 'Node.js / Express', count: 14, growth: '+19%' },
    { skill: 'Docker / Kubernetes', count: 13, growth: '+42%' },
    { skill: 'PostgreSQL / NoSQL', count: 11, growth: '+15%' },
    { skill: 'Python / AI Engineering', count: 10, growth: '+55%' },
  ];

  // Placement pipeline counts
  const pipelineCounts = {
    eligible: eligibleStudents,
    applied: institutionStudents.reduce((acc, s) => acc + (s.applications?.length || 1), 0),
    shortlisted: institutionPlacements.filter((p) => p.status === 'Shortlisted' || p.status === 'Interview' || p.status === 'Selected' || p.status === 'Placed').length + 8,
    interviews: institutionPlacements.filter((p) => p.status === 'Interview' || p.status === 'Selected' || p.status === 'Placed').length + 4,
    selected: placedStudents,
  };

  const chartTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#2D303E' : '#E5E7EB';

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div
        className={`rounded-3xl p-6 border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#181920] via-[#1E2029] to-[#181920] border-white/10 text-white'
            : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-gray-200 text-white shadow-xl'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-lime-400 text-black uppercase tracking-wider">
                Autonomous Institution
              </span>
              <span className="text-xs text-gray-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                NAAC A++ • Tier-1 NBA Accredited
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Apex Institute Administration Portal
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl mt-1">
              Institutional intelligence dashboard synchronizing academic progress, industry skill readiness, internships, campus placements, and corporate MoUs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddPlacement}
              className="px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Placement</span>
            </button>
            <button
              onClick={onOpenAddCollab}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-lime-400" />
              <span>Register MoU</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 font-medium text-xs flex items-center gap-1.5 border border-white/5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Accreditation Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-[#18191E] border-white/5 hover:border-lime-400/30'
              : 'bg-white border-gray-200 hover:border-blue-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Total Students</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black">{totalStudents.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-500 font-bold">6</span> Departments
          </div>
        </div>

        {/* Total Faculty */}
        <div
          onClick={() => onNavigateTab('faculty')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-[#18191E] border-white/5 hover:border-lime-400/30'
              : 'bg-white border-gray-200 hover:border-purple-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Total Faculty</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black">{totalFaculty}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-purple-400 font-bold">100%</span> Industry Mentors
          </div>
        </div>

        {/* Registered Industries */}
        <div
          onClick={() => onNavigateTab('industries')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-[#18191E] border-white/5 hover:border-lime-400/30'
              : 'bg-white border-gray-200 hover:border-emerald-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Industries</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black">{totalCompanies}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-500 font-bold">{verifiedCompanies}</span> Verified
          </div>
        </div>

        {/* Active Internships */}
        <div
          onClick={() => onNavigateTab('internships')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-[#18191E] border-white/5 hover:border-lime-400/30'
              : 'bg-white border-gray-200 hover:border-amber-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Internships</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black">{activeStudentInternships}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-amber-500 font-bold">{internshipsCount}</span> Listed Drives
          </div>
        </div>

        {/* Placement Rate */}
        <div
          onClick={() => onNavigateTab('placements')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-[#18191E] border-white/5 hover:border-lime-400/30'
              : 'bg-white border-gray-200 hover:border-lime-500 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Placement Rate</span>
            <div className="w-7 h-7 rounded-lg bg-lime-500/10 text-lime-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black">{placementRate}%</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-lime-500 font-bold">{placedStudents}</span> Placed
          </div>
        </div>

        {/* Placement Ready */}
        <div
          onClick={() => onNavigateTab('skill-intelligence')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-[#18191E] border-white/5 hover:border-lime-400/30'
              : 'bg-white border-gray-200 hover:border-cyan-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Placement-Ready</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black">{placementReadyStudents}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-cyan-500 font-bold">{placementReadyPct}%</span> Benchmark
          </div>
        </div>
      </div>

      {/* Row 2: Skill Readiness by Department + Placement Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Skill Readiness Chart */}
        <div
          className={`lg:col-span-7 rounded-2xl p-5 border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Department Skill Readiness</h2>
              <p className="text-xs text-gray-400">Average student skill readiness score (%) per engineering branch</p>
            </div>
            <button
              onClick={() => onNavigateTab('departments')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              <span>View Departments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentReadinessData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="department" stroke={chartTextColor} fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke={chartTextColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1E2029' : '#FFFFFF',
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDarkMode ? '#FFF' : '#000',
                  }}
                  formatter={(value: any) => [`${value}% Readiness`, 'Average Score']}
                />
                <Bar dataKey="readiness" radius={[6, 6, 0, 0]} fill="#3B82F6">
                  {departmentReadinessData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.readiness >= 80
                          ? '#10B981'
                          : entry.readiness >= 70
                          ? '#3B82F6'
                          : '#F59E0B'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>High Readiness (&ge;80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Competent (70-79%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Training Needed (&lt;70%)</span>
            </div>
          </div>
        </div>

        {/* Placement Pipeline & Salary Snapshot */}
        <div
          className={`lg:col-span-5 rounded-2xl p-5 border flex flex-col justify-between transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight">Placement Pipeline Overview</h2>
                <p className="text-xs text-gray-400">Active recruitment drive funnel for class of 2026</p>
              </div>
              <button
                onClick={() => onNavigateTab('placements')}
                className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Stage Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-400">Eligible Students</span>
                  <span className="font-bold">{pipelineCounts.eligible} Students</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-400">Campus Applications Submitted</span>
                  <span className="font-bold">{pipelineCounts.applied} Applications</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((pipelineCounts.applied / (pipelineCounts.eligible * 2)) * 100))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-400">Shortlisted for Assessments</span>
                  <span className="font-bold">{pipelineCounts.shortlisted} Candidates</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${Math.round((pipelineCounts.shortlisted / (pipelineCounts.eligible || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-400">Technical Interviews Scheduled</span>
                  <span className="font-bold">{pipelineCounts.interviews} Candidates</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.round((pipelineCounts.interviews / (pipelineCounts.eligible || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-400">Confirmed Placement Offers</span>
                  <span className="font-bold text-emerald-500">{pipelineCounts.selected} Offers</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.round((pipelineCounts.selected / (pipelineCounts.eligible || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTC Package Highlights */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-white/5 text-center">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Highest CTC</span>
              <span className="text-base font-black text-emerald-500">₹{highestCtc} LPA</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Average CTC</span>
              <span className="text-base font-black text-blue-500">₹{avgCtc} LPA</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Active MoUs</span>
              <span className="text-base font-black text-purple-500">{institutionCollaborations.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Institutional Skill Gaps + Industry Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Gaps Breakdown */}
        <div
          className={`lg:col-span-7 rounded-2xl p-5 border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold tracking-tight">Top Institutional Skill Gaps</h2>
              </div>
              <p className="text-xs text-gray-400">Identified curriculum gaps between industry requirements and student assessments</p>
            </div>
            <button
              onClick={() => onNavigateTab('skill-intelligence')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              <span>Skill Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 font-semibold">
                  <th className="pb-2.5">Skill Domain</th>
                  <th className="pb-2.5">Industry Demand</th>
                  <th className="pb-2.5">Student Average</th>
                  <th className="pb-2.5">Gap Index</th>
                  <th className="pb-2.5 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {skillGapsSummary.map((gap, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-medium">{gap.skill}</td>
                    <td className="py-2.5 font-semibold text-gray-700 dark:text-gray-300">{gap.demand}%</td>
                    <td className="py-2.5 font-semibold text-gray-500">{gap.current}%</td>
                    <td className="py-2.5">
                      <span className="font-bold text-rose-500">-{gap.gap}%</span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          gap.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-500'
                            : gap.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Recommend introducing targeted bootcamps for High priority gaps.
            </span>
            <button
              onClick={() => onNavigateTab('training')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Schedule Training</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Industry Demand */}
        <div
          className={`lg:col-span-5 rounded-2xl p-5 border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <h2 className="text-base font-bold tracking-tight">Current Industry Demand</h2>
              </div>
              <p className="text-xs text-gray-400">Skills demanded in active campus drives & internship postings</p>
            </div>
            <button
              onClick={() => onNavigateTab('skill-intelligence')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {industryDemandSkills.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </div>
                  <span className="font-semibold">{item.skill}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{item.count} Active Postings</span>
                  <span className="font-bold text-emerald-500">{item.growth}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-xs text-gray-700 dark:text-gray-300">
            <span className="font-bold text-lime-600 dark:text-lime-400 block mb-0.5">
              Placement Cell Insight:
            </span>
            Full-stack TypeScript and Cloud containerization competencies show a 35% higher average package offer rate this season.
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activities & Quick Administrative Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Institutional Activities */}
        <div
          className={`lg:col-span-8 rounded-2xl p-5 border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold tracking-tight">Recent Institutional Activities</h2>
            <span className="text-xs text-gray-400">Live system audit events</span>
          </div>

          <div className="space-y-3">
            {institutionPlacements.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {p.studentName} secured placement at {p.company}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {p.role} • {p.department} Branch • Package: {p.packageRange}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">{p.date}</span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
                </div>
              </div>
            ))}

            {institutionCollaborations.slice(0, 2).map((c, idx) => (
              <div
                key={`collab-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      Corporate MoU Active: {c.industry}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {c.collaborationType} • {c.studentsInvolved || 45} Students Enrolled
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">{c.startDate}</span>
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Active MoU</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div
          className={`lg:col-span-4 rounded-2xl p-5 border flex flex-col justify-between transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div>
            <h2 className="text-base font-bold tracking-tight mb-1">Administrative Shortcuts</h2>
            <p className="text-xs text-gray-400 mb-4">Direct links to primary management tools</p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('students')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Student Directory ({totalStudents})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('faculty')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  <span>Faculty Engagements ({totalFaculty})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('industries')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  <span>Corporate Partners ({totalCompanies})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('training')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Training Programs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('notifications')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Broadcast Notice</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 text-[11px] text-gray-400 text-center">
            Apex National Institute of Technology • AISHE: C-18492
          </div>
        </div>
      </div>
    </div>
  );
};
