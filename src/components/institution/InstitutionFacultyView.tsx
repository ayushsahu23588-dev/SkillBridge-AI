import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FacultyMember } from '../../types';
import {
  GraduationCap,
  Search,
  Filter,
  Briefcase,
  BookOpen,
  Award,
  Building,
  FlaskConical,
  Calendar,
  Users,
  Eye,
  Mail,
  Phone,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const InstitutionFacultyView: React.FC = () => {
  const {
    facultyMembers,
    industrialTraining,
    fdpPrograms,
    facultyConsultancy,
    researchCollaborations,
    facultyWorkshops,
    guestLectures,
    isDarkMode,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  // Compute aggregate engagement stats
  const totalFacultyCount = facultyMembers.length;
  const ongoingResearchCount = researchCollaborations.length;
  const activeConsultancyCount = facultyConsultancy.length;
  const completedTrainingCount = industrialTraining.filter((t) => t.status === 'Completed').length;

  const filteredFaculty = useMemo(() => {
    return facultyMembers.filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        (f.department && f.department.toLowerCase().includes(q)) ||
        (Array.isArray(f.expertise) && f.expertise.some((e) => e.toLowerCase().includes(q)));

      const matchDept =
        deptFilter === 'All' ||
        (f.department && f.department.toLowerCase().includes(deptFilter.toLowerCase()));

      return matchSearch && matchDept;
    });
  }, [facultyMembers, searchQuery, deptFilter]);

  const departments = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <span>Faculty Management & Industry Engagements</span>
          </h2>
          <p className="text-xs text-gray-400">
            Track faculty corporate consultancy, sponsored research projects, industrial training, and FDP cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Showing <strong className="text-white dark:text-white font-bold">{filteredFaculty.length}</strong> of {totalFacultyCount} Faculty Members
          </span>
        </div>
      </div>

      {/* Engagement Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-semibold">Total Faculty</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black">{totalFacultyCount}</div>
          <span className="text-[11px] text-gray-400">Accredited Mentors</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-semibold">Active Consultancy</span>
            <Building className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black">{activeConsultancyCount}</div>
          <span className="text-[11px] text-gray-400">Industry Engagements</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-semibold">Research Projects</span>
            <FlaskConical className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black">{ongoingResearchCount}</div>
          <span className="text-[11px] text-gray-400">Sponsored Grants</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-semibold">Industrial Training</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black">{industrialTraining.length}</div>
          <span className="text-[11px] text-gray-400">{completedTrainingCount} Completed</span>
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
            placeholder="Search faculty by name, department, designation, or expertise..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-purple-500 transition-colors ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Branch:</span>
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#18191E] text-white">
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((faculty) => (
          <div
            key={faculty.id}
            onClick={() => setSelectedFaculty(faculty)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-purple-400/50 hover:scale-[1.01] ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    faculty.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={faculty.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                    {faculty.name}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {faculty.title || faculty.designation || 'Professor'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 font-mono text-gray-600 dark:text-gray-300">
                    {faculty.department || 'Engineering'}
                  </span>
                </div>
              </div>
            </div>

            {/* Expertise Badges */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                Areas of Expertise
              </span>
              <div className="flex flex-wrap gap-1">
                {(faculty.expertise || ['Distributed Systems', 'Cloud Computing']).map(
                  (exp: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-medium"
                    >
                      {exp}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Mini Activity Stats */}
            <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-center text-xs mb-3">
              <div>
                <span className="text-[10px] text-gray-400 block">Mentorship</span>
                <span className="font-bold text-blue-500">{faculty.activeMenteesCount || 18}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Projects</span>
                <span className="font-bold text-emerald-500">4</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">FDPs</span>
                <span className="font-bold text-purple-500">6</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
              <span className="truncate">{faculty.email}</span>
              <span className="text-purple-500 font-semibold flex items-center gap-0.5">
                <span>Engagements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Faculty Engagement Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`max-w-2xl w-full rounded-2xl p-6 border shadow-2xl max-h-[90vh] overflow-y-auto transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedFaculty.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={selectedFaculty.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-4 ring-purple-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold">{selectedFaculty.name}</h3>
                  <p className="text-xs text-purple-500 font-semibold">
                    {selectedFaculty.title || 'Senior Professor & Research Guide'} • {selectedFaculty.department}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedFaculty.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFaculty(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Engagement Breakdown */}
            <div className="space-y-4">
              {/* Research Collaboration */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-xs">Research & Industry Projects</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Lead investigator on "High-Efficiency Distributed Consensus Algorithms for Microgrid IoT Networks" sponsored by TechNova Research Labs.
                </p>
              </div>

              {/* Corporate Consultancy */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-xs">Corporate Consultancy Engagement</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold">
                    MoU Partnered
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Advisory consultant to CloudScale Technologies for Cloud Security Architecture review and SOC-2 compliance preparation.
                </p>
              </div>

              {/* Industrial Training */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs">Faculty Industrial Training & FDPs</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold">
                    Completed 2026
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Completed 4-week Faculty Industry Immersion at Microsoft India on Generative AI Copilot Extensions and LLM Evaluation.
                </p>
              </div>

              {/* Student Mentorship */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-xs">Student Capstone & Career Mentorship</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-bold">
                    18 Active Mentees
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Overseeing 4 final-year B.Tech projects in Distributed Computing with 100% campus placement offer readiness.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
