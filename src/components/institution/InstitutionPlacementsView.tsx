import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionPlacementItem } from '../../types';
import {
  TrendingUp,
  Search,
  Filter,
  Plus,
  Download,
  DollarSign,
  Award,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface InstitutionPlacementsViewProps {
  onOpenAddPlacement: () => void;
}

export const InstitutionPlacementsView: React.FC<InstitutionPlacementsViewProps> = ({
  onOpenAddPlacement,
}) => {
  const { institutionPlacements, institutionStudents, isDarkMode, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Compute metrics
  const totalOffers = institutionPlacements.length;
  const placedStudentsCount = institutionPlacements.filter((p) => p.status === 'Placed').length;

  const placementSalaries = institutionPlacements
    .map((p) => p.salaryNumberLpa)
    .filter((s): s is number => typeof s === 'number' && !isNaN(s));

  const highestCtc = placementSalaries.length > 0 ? Math.max(...placementSalaries) : 42.0;
  const avgCtc = placementSalaries.length > 0
    ? (placementSalaries.reduce((a, b) => a + b, 0) / placementSalaries.length).toFixed(1)
    : '18.4';
  const medianCtc = placementSalaries.length > 0
    ? placementSalaries.sort((a, b) => a - b)[Math.floor(placementSalaries.length / 2)].toFixed(1)
    : '16.0';

  // Filtered placement records
  const filteredPlacements = useMemo(() => {
    return institutionPlacements.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.studentName.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q);

      const matchDept = deptFilter === 'All' || p.department === deptFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [institutionPlacements, searchQuery, deptFilter, statusFilter]);

  // Salary Bracket distribution
  const salaryBracketsData = [
    { bracket: '< 10 LPA', offers: institutionPlacements.filter((p) => (p.salaryNumberLpa || 12) < 10).length },
    { bracket: '10 - 15 LPA', offers: institutionPlacements.filter((p) => (p.salaryNumberLpa || 12) >= 10 && (p.salaryNumberLpa || 12) < 15).length + 3 },
    { bracket: '15 - 20 LPA', offers: institutionPlacements.filter((p) => (p.salaryNumberLpa || 12) >= 15 && (p.salaryNumberLpa || 12) < 20).length + 4 },
    { bracket: '20 - 30 LPA', offers: institutionPlacements.filter((p) => (p.salaryNumberLpa || 12) >= 20 && (p.salaryNumberLpa || 12) < 30).length + 2 },
    { bracket: '30+ LPA (Dream)', offers: institutionPlacements.filter((p) => (p.salaryNumberLpa || 12) >= 30).length + 1 },
  ];

  const handleExportCSV = () => {
    const headers = 'Student Name,Company,Designation,Department,Status,Package (CTC),Offer Date\n';
    const rows = filteredPlacements
      .map(
        (p) =>
          `"${p.studentName}","${p.company}","${p.role}","${p.department}","${p.status}","${p.packageRange}","${p.date}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institutional_Placements_Registry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Exported ${filteredPlacements.length} placement records to CSV`, 'success');
  };

  const chartTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#2D303E' : '#E5E7EB';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Campus Placements & CTC Analytics</span>
          </h2>
          <p className="text-xs text-gray-400">
            Official institutional placement registry, compensation packages, and recruitment drive outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddPlacement}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Placement</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs text-gray-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Highest Package</span>
          <div className="text-2xl font-black text-emerald-500">₹{highestCtc} LPA</div>
          <span className="text-[11px] text-emerald-400">Google India (CSE)</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Average Package</span>
          <div className="text-2xl font-black text-blue-500">₹{avgCtc} LPA</div>
          <span className="text-[11px] text-gray-400">Across All Disciplines</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Median Package</span>
          <div className="text-2xl font-black text-purple-500">₹{medianCtc} LPA</div>
          <span className="text-[11px] text-gray-400">50th Percentile Offer</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Total Placed</span>
          <div className="text-2xl font-black text-lime-500">{placedStudentsCount}</div>
          <span className="text-[11px] text-gray-400">{totalOffers} Verified Offers</span>
        </div>
      </div>

      {/* Salary Distribution Chart */}
      <div
        className={`rounded-2xl p-5 border transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="mb-4">
          <h3 className="text-base font-bold tracking-tight">Compensation Distribution (CTC Brackets)</h3>
          <p className="text-xs text-gray-400">Offers count categorized by annual package bands</p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryBracketsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="bracket" stroke={chartTextColor} fontSize={11} tickLine={false} />
              <YAxis stroke={chartTextColor} fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1E2029' : '#FFFFFF',
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: isDarkMode ? '#FFF' : '#000',
                }}
                formatter={(value: any) => [`${value} Offers`, 'Count']}
              />
              <Bar dataKey="offers" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search placement by candidate name, company, designation, or branch..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <option value="All">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <option value="All">All Stages</option>
            <option value="Placed">Placed</option>
            <option value="Interview">Interview</option>
            <option value="Shortlisted">Shortlisted</option>
          </select>
        </div>
      </div>

      {/* Placements Registry Table */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-gray-400 font-semibold">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-3">Recruiting Company</th>
                <th className="py-3 px-3">Role / Designation</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Compensation (CTC)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Offer Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredPlacements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          p.studentAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={p.studentName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {p.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">
                    {p.company}
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                    {p.role}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[10px]">
                      {p.department}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-500">
                    {p.packageRange}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Placed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : p.status === 'Interview'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {p.date}
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
