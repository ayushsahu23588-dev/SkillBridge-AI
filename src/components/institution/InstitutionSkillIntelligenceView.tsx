import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

export const InstitutionSkillIntelligenceView: React.FC = () => {
  const { institutionStudents, jobs, isDarkMode } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'industry' | 'readiness'>('overview');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Filter students based on selection
  const filteredStudents = useMemo(() => {
    return institutionStudents.filter((s) => {
      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchYear = selectedYear === 'All' || s.year === selectedYear;
      return matchDept && matchYear;
    });
  }, [institutionStudents, selectedDept, selectedYear]);

  // Skill Gaps Matrix data
  const skillGapMatrix = [
    {
      skill: 'Distributed Systems & Go',
      category: 'Cloud Engineering',
      demand: 88,
      studentProficiency: 54,
      gap: 34,
      priority: 'High',
      recommendation: 'Launch 4-week Go & Microservices Accelerator Bootcamp',
    },
    {
      skill: 'Kubernetes & Helm CI/CD',
      category: 'DevOps & Infra',
      demand: 85,
      studentProficiency: 58,
      gap: 27,
      priority: 'High',
      recommendation: 'Mandate Docker & Kubernetes capstone in 6th semester lab',
    },
    {
      skill: 'System Design & Scalability',
      category: 'Software Architecture',
      demand: 92,
      studentProficiency: 67,
      gap: 25,
      priority: 'High',
      recommendation: 'Host Weekend System Design Hackathon with AWS Architects',
    },
    {
      skill: 'DSA & Graph Algorithms',
      category: 'Computer Science Core',
      demand: 84,
      studentProficiency: 62,
      gap: 22,
      priority: 'Medium',
      recommendation: 'Implement bi-weekly competitive coding placement contest',
    },
    {
      skill: 'PostgreSQL Query Optimization',
      category: 'Data Engineering',
      demand: 79,
      studentProficiency: 61,
      gap: 18,
      priority: 'Medium',
      recommendation: 'Introduce relational index tuning workshops',
    },
    {
      skill: 'TypeScript Strict Mode & Node.js',
      category: 'Full Stack',
      demand: 86,
      studentProficiency: 72,
      gap: 14,
      priority: 'Low',
      recommendation: 'Elective course in Modern TypeScript Fullstack',
    },
  ];

  // Radar chart comparison of student competency vs industry benchmark
  const radarData = [
    { subject: 'Data Structures', current: 74, benchmark: 88 },
    { subject: 'Cloud Architecture', current: 58, benchmark: 85 },
    { subject: 'Full Stack Eng', current: 78, benchmark: 86 },
    { subject: 'Databases & SQL', current: 68, benchmark: 82 },
    { subject: 'DevOps & Linux', current: 55, benchmark: 80 },
    { subject: 'System Design', current: 62, benchmark: 90 },
  ];

  // Industry demand extracted from active postings
  const industryTrends = [
    {
      skill: 'React / Next.js',
      activeDrives: 18,
      growthRate: '+32%',
      avgPackage: '₹16.5 LPA',
      topHiring: 'Razorpay, Swiggy, Microsoft',
    },
    {
      skill: 'TypeScript',
      activeDrives: 16,
      growthRate: '+45%',
      avgPackage: '₹18.0 LPA',
      topHiring: 'CloudScale, Zoho, Amazon',
    },
    {
      skill: 'Go / Microservices',
      activeDrives: 12,
      growthRate: '+60%',
      avgPackage: '₹22.5 LPA',
      topHiring: 'Uber, Google India, Atlassian',
    },
    {
      skill: 'Kubernetes & Docker',
      activeDrives: 14,
      growthRate: '+38%',
      avgPackage: '₹19.2 LPA',
      topHiring: 'Cisco, Intel, Red Hat',
    },
    {
      skill: 'AI / LLM Fine-tuning',
      activeDrives: 9,
      growthRate: '+78%',
      avgPackage: '₹24.0 LPA',
      topHiring: 'TechNova Labs, Nvidia, Wipro AI',
    },
  ];

  // Readiness breakdown
  const readinessTiers = {
    industryReady: filteredStudents.filter((s) => (s.skillReadiness || 75) >= 80).length,
    nearReady: filteredStudents.filter(
      (s) => (s.skillReadiness || 75) >= 65 && (s.skillReadiness || 75) < 80
    ).length,
    needsTraining: filteredStudents.filter((s) => (s.skillReadiness || 75) < 65).length,
  };

  const chartTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#2D303E' : '#E5E7EB';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-lime-400" />
            <span>Curriculum & Skill Intelligence Engine</span>
          </h2>
          <p className="text-xs text-gray-400">
            Real-time telemetry on student skill masteries, industry benchmark divergence, and strategic syllabus interventions.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <option value="All">All Batches</option>
            <option value="4th Year">Class of 2026 (Final Year)</option>
            <option value="3rd Year">Class of 2027 (Pre-final)</option>
            <option value="2nd Year">Class of 2028</option>
          </select>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-white/5 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-lime-400 text-black font-bold shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Skill Overview
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'gaps'
              ? 'bg-lime-400 text-black font-bold shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Skill Gaps Matrix
        </button>
        <button
          onClick={() => setActiveTab('industry')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'industry'
              ? 'bg-lime-400 text-black font-bold shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Industry Demand Trends
        </button>
        <button
          onClick={() => setActiveTab('readiness')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'readiness'
              ? 'bg-lime-400 text-black font-bold shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Readiness Distribution
        </button>
      </div>

      {/* Tab 1: Skill Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div
            className={`lg:col-span-6 rounded-2xl p-5 border transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="mb-4">
              <h3 className="text-base font-bold tracking-tight">Institutional Competency Radar</h3>
              <p className="text-xs text-gray-400">
                Institutional student average vs. Top tier corporate recruiting benchmark
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" stroke={chartTextColor} fontSize={11} />
                  <PolarRadiusAxis domain={[0, 100]} stroke={chartTextColor} fontSize={9} />
                  <Radar
                    name="Student Average"
                    dataKey="current"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Corporate Benchmark"
                    dataKey="benchmark"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1E2029' : '#FFFFFF',
                      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: isDarkMode ? '#FFF' : '#000',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className={`lg:col-span-6 rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold tracking-tight">Core Curriculum Findings</h3>
                <p className="text-xs text-gray-400">Telemetry generated from recent mock interviews & assessments</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="font-bold text-blue-500 block mb-0.5">
                    Strongest Competency: Full-Stack Web Technologies
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    78% of students demonstrate proficient API design and frontend architecture. This accounts for high conversion in initial technical rounds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="font-bold text-amber-500 block mb-0.5">
                    Critical Gap: Cloud Infrastructure & DevOps
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    Average student score in Docker, Kubernetes, and AWS deployment is 55% against an industry hiring expectation of 80%.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="font-bold text-purple-500 block mb-0.5">
                    System Design Deficit
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tier-1 product companies reject 40% of shortlisted candidates in Round 2 System Design due to lack of caching and horizontal scaling knowledge.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-[11px] text-gray-400 text-center">
              Evaluated across {institutionStudents.length} enrolled student assessments.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Gaps Matrix */}
      {activeTab === 'gaps' && (
        <div
          className={`rounded-2xl border overflow-hidden transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold tracking-tight">Strategic Skill Gap Analysis Matrix</h3>
              <p className="text-xs text-gray-400">
                Detailed comparison between hiring requirements and current student assessment scores
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold">
              3 High Priority Gaps Flagged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-gray-400 font-semibold">
                  <th className="py-3 px-4">Skill & Category</th>
                  <th className="py-3 px-3">Industry Demand</th>
                  <th className="py-3 px-3">Student Proficiency</th>
                  <th className="py-3 px-3">Deficit Gap</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-4">Curriculum Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {skillGapMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold block">{item.skill}</span>
                      <span className="text-[11px] text-gray-400">{item.category}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      {item.demand}%
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-500">
                      {item.studentProficiency}%
                    </td>
                    <td className="py-3 px-3 font-black text-rose-500">
                      -{item.gap}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-500'
                            : item.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 text-[11px]">
                      {item.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Industry Demand Trends */}
      {activeTab === 'industry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industryTrends.map((trend, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-lime-400/10 text-lime-600 dark:text-lime-400 font-mono">
                    #{idx + 1} Demand Rank
                  </span>
                  <span className="text-xs font-bold text-emerald-500">{trend.growthRate} YoY</span>
                </div>

                <h4 className="text-base font-bold mb-1">{trend.skill}</h4>
                <div className="text-xs text-gray-400 mb-3">
                  {trend.activeDrives} Recruiting Drives on Campus
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs mb-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Compensation:</span>
                    <span className="font-bold text-emerald-500">{trend.avgPackage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Recruiters:</span>
                    <span className="font-semibold truncate max-w-[140px]">{trend.topHiring}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Readiness Distribution */}
      {activeTab === 'readiness' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3 font-bold">
              &ge;80%
            </div>
            <h4 className="text-base font-bold">Industry Ready</h4>
            <div className="text-3xl font-black text-emerald-500 my-2">
              {readinessTiers.industryReady}
            </div>
            <p className="text-xs text-gray-400">
              Students cleared for Day-1 tier-1 product & core engineering campus interviews.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3 font-bold">
              65-79%
            </div>
            <h4 className="text-base font-bold">Near Ready</h4>
            <div className="text-3xl font-black text-blue-500 my-2">
              {readinessTiers.nearReady}
            </div>
            <p className="text-xs text-gray-400">
              Requires 2-3 weeks targeted problem-solving drills before final technical rounds.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 font-bold">
              &lt;65%
            </div>
            <h4 className="text-base font-bold">Foundational / Needs Training</h4>
            <div className="text-3xl font-black text-amber-500 my-2">
              {readinessTiers.needsTraining}
            </div>
            <p className="text-xs text-gray-400">
              Assigned to mandatory remedial technical bootcamps and faculty mentorship.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
