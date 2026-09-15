import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  Briefcase,
  ChevronRight,
  UserCheck,
  Building,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const InstitutionDepartmentsView: React.FC = () => {
  const {
    institutionStudents,
    facultyMembers,
    institutionPlacements,
    institutionSettings,
    isDarkMode,
  } = useApp();

  const [selectedDeptName, setSelectedDeptName] = useState<string | null>(null);

  // Department definitions
  const departmentsList = [
    { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Evelyn Vance', facultyCount: 28 },
    { code: 'IT', name: 'Information Technology', hod: 'Prof. Anirudh Sen', facultyCount: 16 },
    { code: 'ECE', name: 'Electronics & Communication', hod: 'Dr. Suresh Babu', facultyCount: 22 },
    { code: 'EEE', name: 'Electrical & Electronics', hod: 'Dr. Alok Verma', facultyCount: 14 },
    { code: 'Mechanical', name: 'Mechanical Engineering', hod: 'Prof. Rajesh K.', facultyCount: 18 },
    { code: 'Civil', name: 'Civil Engineering', hod: 'Dr. Preeti Saxena', facultyCount: 12 },
  ];

  // Compute live metrics per department
  const deptStats = departmentsList.map((dept) => {
    const students = institutionStudents.filter(
      (s) => s.department.toUpperCase() === dept.code.toUpperCase()
    );
    const studentCount = students.length;

    const totalReadiness = students.reduce(
      (acc, s) => acc + (s.skillReadiness || s.overallSkillScore || 70),
      0
    );
    const avgReadiness = studentCount > 0 ? Math.round(totalReadiness / studentCount) : 75;

    const placedCount = students.filter((s) => s.placementStatus === 'Placed').length;
    const placementRate = studentCount > 0 ? Math.round((placedCount / studentCount) * 100) : 70;

    const activeInternships = students.filter(
      (s) => s.internshipStatus === 'In Internship' || s.internshipStatus === 'Completed'
    ).length;

    const avgCgpa =
      studentCount > 0
        ? (
            students.reduce((acc, s) => acc + (s.cgpa || s.gpa || 8.0), 0) / studentCount
          ).toFixed(2)
        : '8.40';

    return {
      ...dept,
      studentCount: studentCount || 65,
      actualStudents: students,
      avgReadiness,
      placementRate,
      activeInternships: activeInternships || 18,
      avgCgpa,
      readinessVsPlacement: [
        { name: 'Skill Readiness', value: avgReadiness },
        { name: 'Placement Rate', value: placementRate },
      ],
    };
  });

  const chartData = deptStats.map((d) => ({
    department: d.code,
    'Skill Readiness': d.avgReadiness,
    'Placement Rate': d.placementRate,
  }));

  const chartTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#2D303E' : '#E5E7EB';

  const selectedDeptData = selectedDeptName
    ? deptStats.find((d) => d.code === selectedDeptName)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>Academic Department Intelligence</span>
          </h2>
          <p className="text-xs text-gray-400">
            Comparative performance analytics across academic branches, faculty strength, skill readiness, and placement outcomes.
          </p>
        </div>
      </div>

      {/* Comparative Department Chart */}
      <div
        className={`rounded-2xl p-5 border transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold tracking-tight">Branch-Wise Benchmark: Readiness vs. Placement</h3>
            <p className="text-xs text-gray-400">Correlation between student skill assessments and campus recruitment offers</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar dataKey="Skill Readiness" fill="#3B82F6" radius={[5, 5, 0, 0]} />
              <Bar dataKey="Placement Rate" fill="#10B981" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deptStats.map((dept) => (
          <div
            key={dept.code}
            onClick={() => setSelectedDeptName(dept.code)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-indigo-400/50 hover:scale-[1.01] ${
              selectedDeptName === dept.code ? 'ring-2 ring-indigo-500' : ''
            } ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs">
                    {dept.code}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {dept.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>HOD: {dept.hod}</span>
                </p>
              </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xs mb-4">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Enrolled Cohort</span>
                <span className="font-bold">{dept.studentCount} Students</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Faculty Strength</span>
                <span className="font-bold text-purple-400">{dept.facultyCount} Members</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Skill Readiness</span>
                <span className="font-bold text-blue-500">{dept.avgReadiness}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Placement Rate</span>
                <span className="font-bold text-emerald-500">{dept.placementRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
              <span>Avg CGPA: <strong className="text-gray-900 dark:text-white">{dept.avgCgpa}</strong></span>
              <span className="text-indigo-500 font-semibold flex items-center gap-0.5">
                <span>Branch Cohort</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drill-down Drawer for Selected Department */}
      {selectedDeptData && (
        <div
          className={`rounded-2xl p-5 border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5 mb-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                Branch Drill-Down View
              </span>
              <h3 className="text-lg font-bold">
                {selectedDeptData.name} ({selectedDeptData.code})
              </h3>
            </div>
            <button
              onClick={() => setSelectedDeptName(null)}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase block">
              Registered Students in {selectedDeptData.code} ({selectedDeptData.actualStudents.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedDeptData.actualStudents.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold block">{s.name}</span>
                      <span className="text-gray-400 text-[11px]">{s.year} • CGPA {s.cgpa || s.gpa}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">
                    {s.skillReadiness || 80}%
                  </span>
                </div>
              ))}
              {selectedDeptData.actualStudents.length === 0 && (
                <p className="text-xs text-gray-400 col-span-3 py-3">
                  No student records currently allocated under this specific branch in sample records.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
