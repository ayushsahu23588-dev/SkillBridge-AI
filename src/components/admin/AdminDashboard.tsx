import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
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
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { isDarkMode, setActiveTab } = useApp();

  const placementStats = [
    { year: '2023', placed: 82, totalOffers: 420, avgSalary: 112 },
    { year: '2024', placed: 88, totalOffers: 510, avgSalary: 124 },
    { year: '2025', placed: 94, totalOffers: 620, avgSalary: 138 },
    { year: '2026 (YTD)', placed: 96, totalOffers: 680, avgSalary: 145 },
  ];

  const sectorDistribution = [
    { name: 'Cloud & AI Systems', value: 42, color: '#3B82F6' },
    { name: 'Fintech & Quant', value: 24, color: '#10B981' },
    { name: 'Semiconductors & IoT', value: 18, color: '#8B5CF6' },
    { name: 'Autonomous Robotics', value: 16, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-purple-950/50 border border-blue-200/60 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Apex National Institute of Technology • Dean of Placement & Industry Relations
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Institutional Placement & Industry Collaboration Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Real-time multi-department placement conversion rates, active corporate MOUs, and automated accreditation compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('corporate_partners')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Corporate MOUs</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Campus Placement %
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              96.2%
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Class of 2026 graduating batch
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Active Corporate MOUs
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">48</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Fortune 500 & tech leaders
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Average CTC Package
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              $145,000
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              +$21k YoY package surge
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Accreditation Readiness
            </span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              100% Audit-Ready
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              NBA / ABET Criterion Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Dual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                4-Year Placement Trajectory & Average Compensation ($k)
              </h2>
              <p className="text-xs text-gray-500">
                Placement conversion rates vs. industry average starting salaries
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: 11 }}
                />
                <YAxis tick={{ fill: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="placed" fill="#3B82F6" name="Placement Rate %" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avgSalary" fill="#10B981" name="Avg CTC ($k)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution Pie */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Industry Hiring by Sector
            </h2>
            <p className="text-xs text-gray-500">Campus recruit breakdown</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            {sectorDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
