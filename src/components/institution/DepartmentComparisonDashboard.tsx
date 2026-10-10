import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DepartmentMetric } from '../../types';
import {
  TrendingUp,
  BarChart3,
  Award,
  Users,
  Building,
  CheckCircle2,
  DollarSign,
  Download,
  ArrowUpDown,
  Filter,
  Sparkles,
  ChevronRight,
  Scale,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const DepartmentComparisonDashboard: React.FC = () => {
  const { departmentMetrics, isDarkMode, showToast } = useApp();

  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof DepartmentMetric>('placementPercentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [compareDeptA, setCompareDeptA] = useState<string>('CSE');
  const [compareDeptB, setCompareDeptB] = useState<string>('ECE');

  // Overall university stats
  const totalStudents = departmentMetrics.reduce((sum, d) => sum + d.totalStudents, 0);
  const totalPlaced = departmentMetrics.reduce((sum, d) => sum + d.placedStudents, 0);
  const totalOffers = departmentMetrics.reduce((sum, d) => sum + d.totalOffers, 0);
  const overallPlacementRate = ((totalPlaced / totalStudents) * 100).toFixed(1);
  const overallAvgCtc = (
    departmentMetrics.reduce((sum, d) => sum + d.averagePackageLpa * d.placedStudents, 0) / totalPlaced
  ).toFixed(1);
  const highestPackageUniversity = Math.max(...departmentMetrics.map((d) => d.highestPackageLpa));

  // Sorted and filtered list
  const sortedDepartments = useMemo(() => {
    let list = [...departmentMetrics];
    if (selectedDeptCode !== 'ALL') {
      list = list.filter((d) => d.departmentCode === selectedDeptCode);
    }
    return list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      return 0;
    });
  }, [departmentMetrics, selectedDeptCode, sortField, sortOrder]);

  const handleSort = (field: keyof DepartmentMetric) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const chartData = departmentMetrics.map((d) => ({
    name: d.departmentCode,
    placementRate: d.placementPercentage,
    avgCtc: d.averagePackageLpa,
    highestCtc: d.highestPackageLpa,
    dreamOffers: d.dreamOffersCount,
  }));

  const handleExportCSV = () => {
    const headers =
      'Department,HOD,Total Students,Placed Students,Placement %,Total Offers,Avg CTC (LPA),Median CTC (LPA),Highest CTC (LPA),Dream Offers (>=20 LPA),Readiness Score\n';
    const rows = departmentMetrics
      .map(
        (d) =>
          `"${d.departmentName}","${d.hodName}",${d.totalStudents},${d.placedStudents},${d.placementPercentage}%,${d.totalOffers},${d.averagePackageLpa},${d.medianPackageLpa},${d.highestPackageLpa},${d.dreamOffersCount},${d.averageReadinessScore}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_Department_Placement_Comparison_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Department comparison report exported successfully!', 'success');
  };

  // Compare Dept A & B details
  const deptAData = departmentMetrics.find((d) => d.departmentCode === compareDeptA) || departmentMetrics[0];
  const deptBData = departmentMetrics.find((d) => d.departmentCode === compareDeptB) || departmentMetrics[1];

  const chartTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#2D303E' : '#E5E7EB';

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <BarChart3 className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Institutional Academic Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Department & Branch Placement Comparison
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Cross-departmental telemetry benchmarking placement conversion rates, compensation brackets, dream offers (≥20 LPA), and recruiter demand across all engineering faculties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setComparisonModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-[#D4F73C]" />
              <span>Side-by-Side Comparator</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* University Macro KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="soft-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Placed Rate</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2">
            {overallPlacementRate}%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {totalPlaced} of {totalStudents} Eligible Students
          </span>
        </div>

        <div className="soft-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">University Avg CTC</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2">
            ₹{overallAvgCtc} LPA
          </div>
          <span className="text-[11px] text-gray-500 font-semibold">
            Weighted across all engineering branches
          </span>
        </div>

        <div className="soft-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Highest Package</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
            ₹{highestPackageUniversity} LPA
          </div>
          <span className="text-[11px] text-gray-500 font-semibold">
            Google India (CSE Cadre)
          </span>
        </div>

        <div className="soft-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Offers Issued</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2">
            {totalOffers}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            {(totalOffers / totalPlaced).toFixed(2)} Offers per Placed Student
          </span>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="soft-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Departmental Placement % vs Average Package (CTC)</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comparative visualization benchmarking student placement rate against compensation tier.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Filter Branch:</span>
            <select
              value={selectedDeptCode}
              onChange={(e) => setSelectedDeptCode(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E2029] text-gray-800 dark:text-gray-200 outline-none"
            >
              <option value="ALL">All Departments ({departmentMetrics.length})</option>
              {departmentMetrics.map((d) => (
                <option key={d.id} value={d.departmentCode}>
                  {d.departmentCode} – {d.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis dataKey="name" stroke={chartTextColor} fontSize={12} tickLine={false} />
              <YAxis yAxisId="left" stroke={chartTextColor} fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="right" orientation="right" stroke={chartTextColor} fontSize={11} domain={[0, 50]} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1E2029' : '#FFFFFF',
                  borderColor: isDarkMode ? '#2D303E' : '#E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="placementRate" name="Placement Rate (%)" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgCtc" name="Average Package (₹ LPA)" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Department Table */}
      <div className="soft-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Department Performance Matrix
            </h3>
            <p className="text-xs text-gray-500">
              Click any column header to sort departments by metric.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
            {sortedDepartments.length} Departments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Department & HOD</th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('totalStudents')}>
                  <div className="flex items-center gap-1">
                    <span>Eligible / Total</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('placementPercentage')}>
                  <div className="flex items-center gap-1">
                    <span>Placed %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('averagePackageLpa')}>
                  <div className="flex items-center gap-1">
                    <span>Avg Package</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('medianPackageLpa')}>
                  <div className="flex items-center gap-1">
                    <span>Median CTC</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('highestPackageLpa')}>
                  <div className="flex items-center gap-1">
                    <span>Highest CTC</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('dreamOffersCount')}>
                  <div className="flex items-center gap-1">
                    <span>Dream (≥20L)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Top Recruiters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
              {sortedDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {dept.departmentName} ({dept.departmentCode})
                    </div>
                    <div className="text-[11px] text-gray-500">HOD: {dept.hodName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {dept.eligibleStudents}
                    </span>
                    <span className="text-gray-400"> / {dept.totalStudents}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${dept.placementPercentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {dept.placementPercentage}%
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">{dept.placedStudents} Placed</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{dept.averagePackageLpa} LPA
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-700 dark:text-gray-300">
                    ₹{dept.medianPackageLpa} LPA
                  </td>
                  <td className="py-3 px-3 font-black text-purple-600 dark:text-purple-400">
                    ₹{dept.highestPackageLpa} LPA
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                      {dept.dreamOffersCount} Offers
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {dept.topRecruiters.slice(0, 3).map((r, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] font-semibold text-gray-700 dark:text-gray-300"
                        >
                          {r}
                        </span>
                      ))}
                      {dept.topRecruiters.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{dept.topRecruiters.length - 3}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {comparisonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181920] w-full max-w-4xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  <span>Head-to-Head Department Comparator</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Select any two engineering departments to benchmark placement parameters.
                </p>
              </div>
              <button
                onClick={() => setComparisonModalOpen(false)}
                className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Department A</label>
                <select
                  value={compareDeptA}
                  onChange={(e) => setCompareDeptA(e.target.value)}
                  className="w-full text-sm font-bold p-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E2029] text-gray-900 dark:text-white"
                >
                  {departmentMetrics.map((d) => (
                    <option key={d.id} value={d.departmentCode}>
                      {d.departmentCode} – {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Department B</label>
                <select
                  value={compareDeptB}
                  onChange={(e) => setCompareDeptB(e.target.value)}
                  className="w-full text-sm font-bold p-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E2029] text-gray-900 dark:text-white"
                >
                  {departmentMetrics.map((d) => (
                    <option key={d.id} value={d.departmentCode}>
                      {d.departmentCode} – {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparative Breakdown Cards */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
              {/* Dept A Column */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-white/10 pb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
                    Department A
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {deptAData.departmentName}
                  </h4>
                  <p className="text-xs text-gray-500">HOD: {deptAData.hodName}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Placement Rate:</span>
                    <span className="font-bold text-emerald-600">{deptAData.placementPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average CTC:</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{deptAData.averagePackageLpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Median CTC:</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{deptAData.medianPackageLpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Highest CTC:</span>
                    <span className="font-bold text-purple-600">₹{deptAData.highestPackageLpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dream Offers (≥20L):</span>
                    <span className="font-bold text-gray-900 dark:text-white">{deptAData.dreamOffersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Offers:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{deptAData.totalOffers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI Readiness Index:</span>
                    <span className="font-bold text-blue-600">{deptAData.averageReadinessScore}%</span>
                  </div>
                </div>
              </div>

              {/* Dept B Column */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-white/10 pb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">
                    Department B
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {deptBData.departmentName}
                  </h4>
                  <p className="text-xs text-gray-500">HOD: {deptBData.hodName}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Placement Rate:</span>
                    <span className="font-bold text-emerald-600">{deptBData.placementPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average CTC:</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{deptBData.averagePackageLpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Median CTC:</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{deptBData.medianPackageLpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Highest CTC:</span>
                    <span className="font-bold text-purple-600">₹{deptBData.highestPackageLpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dream Offers (≥20L):</span>
                    <span className="font-bold text-gray-900 dark:text-white">{deptBData.dreamOffersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Offers:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{deptBData.totalOffers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI Readiness Index:</span>
                    <span className="font-bold text-blue-600">{deptBData.averageReadinessScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setComparisonModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 font-bold text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Close Comparator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
