import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionStudentItem } from '../../types';
import {
  Search,
  Filter,
  Users,
  GraduationCap,
  Download,
  ExternalLink,
  Award,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface InstitutionStudentsViewProps {
  onSelectStudent: (student: InstitutionStudentItem) => void;
}

export const InstitutionStudentsView: React.FC<InstitutionStudentsViewProps> = ({
  onSelectStudent,
}) => {
  const { institutionStudents, isDarkMode, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [placementFilter, setPlacementFilter] = useState('All');
  const [readinessFilter, setReadinessFilter] = useState('All');

  // Filter logic
  const filteredStudents = useMemo(() => {
    return institutionStudents.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (Array.isArray(s.topSkills) &&
          s.topSkills.some((sk) =>
            typeof sk === 'string'
              ? sk.toLowerCase().includes(q)
              : sk.skill && sk.skill.toLowerCase().includes(q)
          ));

      const matchDept = deptFilter === 'All' || s.department === deptFilter;
      const matchYear = yearFilter === 'All' || s.year === yearFilter;
      const matchPlacement =
        placementFilter === 'All' || s.placementStatus === placementFilter;

      const score = s.skillReadiness || s.overallSkillScore || 0;
      let matchReadiness = true;
      if (readinessFilter === 'High') matchReadiness = score >= 80;
      else if (readinessFilter === 'Medium') matchReadiness = score >= 60 && score < 80;
      else if (readinessFilter === 'Low') matchReadiness = score < 60;

      return matchSearch && matchDept && matchYear && matchPlacement && matchReadiness;
    });
  }, [
    institutionStudents,
    searchQuery,
    deptFilter,
    yearFilter,
    placementFilter,
    readinessFilter,
  ]);

  // Export CSV
  const handleExportCSV = () => {
    const headers =
      'Roll No,Student Name,Email,Department,Academic Year,CGPA,Skill Readiness,Internship Status,Placement Status\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.rollNumber || s.id}","${s.name}","${s.email}","${s.department}","${s.year}","${
            s.cgpa || s.gpa || 'N/A'
          }","${s.skillReadiness || 75}%","${s.internshipStatus || 'Seeking'}","${
            s.placementStatus || 'Eligible'
          }"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institutional_Students_Registry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Exported ${filteredStudents.length} student records to CSV`, 'success');
  };

  const departments = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];
  const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const placementStatuses = [
    'All',
    'Eligible',
    'In Process',
    'Placed',
    'Higher Studies',
    'Interviewing',
  ];

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>Student Management & Academic Directory</span>
          </h2>
          <p className="text-xs text-gray-400">
            Monitor real-time academic performance, verified skill scores, internships, and placement records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">
            Showing <strong className="text-white dark:text-white font-bold">{filteredStudents.length}</strong> of {institutionStudents.length} Students
          </span>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div
        className={`p-4 rounded-2xl border space-y-3 transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, email, or skills (e.g., React, Python)..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border transition-colors outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {(searchQuery ||
            deptFilter !== 'All' ||
            yearFilter !== 'All' ||
            placementFilter !== 'All' ||
            readinessFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDeptFilter('All');
                setYearFilter('All');
                setPlacementFilter('All');
                setReadinessFilter('All');
              }}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 whitespace-nowrap cursor-pointer px-2"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdown filters row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gray-100 dark:border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept} className="bg-[#18191E] text-white">
                Dept: {dept}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-[#18191E] text-white">
                Year: {y}
              </option>
            ))}
          </select>

          {/* Placement Filter */}
          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {placementStatuses.map((st) => (
              <option key={st} value={st} className="bg-[#18191E] text-white">
                Placement: {st}
              </option>
            ))}
          </select>

          {/* Skill Readiness Filter */}
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <option value="All" className="bg-[#18191E] text-white">
              Readiness: All Tiers
            </option>
            <option value="High" className="bg-[#18191E] text-white">
              High Readiness (&ge;80%)
            </option>
            <option value="Medium" className="bg-[#18191E] text-white">
              Moderate (60-79%)
            </option>
            <option value="Low" className="bg-[#18191E] text-white">
              Foundational (&lt;60%)
            </option>
          </select>
        </div>
      </div>

      {/* Students Directory Table */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-gray-400 font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Roll & Dept</th>
                <th className="py-3 px-3">Academic Info</th>
                <th className="py-3 px-3">Top Competencies</th>
                <th className="py-3 px-3">Skill Readiness</th>
                <th className="py-3 px-3">Internship</th>
                <th className="py-3 px-3">Placement</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">No students found matching current filters.</p>
                    <p className="text-[11px] mt-1">Try relaxing the search keyword or filter settings.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const score = s.skillReadiness || s.overallSkillScore || 75;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s)}
                      className="hover:bg-blue-500/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              s.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={s.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                          />
                          <div>
                            <span className="font-bold block text-gray-900 dark:text-white">
                              {s.name}
                            </span>
                            <span className="text-[11px] text-gray-400 block">{s.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Roll & Department */}
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{s.rollNumber || s.id}</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-mono">
                          {s.department}
                        </span>
                      </td>

                      {/* Academic Info */}
                      <td className="py-3 px-3">
                        <span className="block font-medium">{s.year}</span>
                        <span className="text-[11px] text-gray-400">
                          CGPA: <strong className="text-emerald-500 font-bold">{s.cgpa || s.gpa || '8.2'}</strong>
                        </span>
                      </td>

                      {/* Skills badges */}
                      <td className="py-3 px-3 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {(s.topSkills || []).slice(0, 3).map((sk: any, i: number) => {
                            const label = typeof sk === 'string' ? sk : sk.skill || 'Skill';
                            return (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium"
                              >
                                {label}
                              </span>
                            );
                          })}
                          {(s.topSkills || []).length > 3 && (
                            <span className="text-[10px] text-gray-400 self-center">
                              +{(s.topSkills || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Readiness */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs font-black ${
                              score >= 80
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : score >= 65
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}
                          >
                            {score}%
                          </div>
                          <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                score >= 80
                                  ? 'bg-emerald-500'
                                  : score >= 65
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Internship Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.internshipStatus === 'In Internship'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : s.internshipStatus === 'Completed'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {s.internshipStatus || 'Seeking'}
                        </span>
                      </td>

                      {/* Placement Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.placementStatus === 'Placed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : s.placementStatus === 'Interviewing' || s.placementStatus === 'In Process'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {s.placementStatus || 'Eligible'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudent(s);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
                          title="View Full Profile & Skill Gaps"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
