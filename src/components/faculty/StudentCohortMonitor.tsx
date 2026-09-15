import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Award,
  Sparkles,
  CheckCircle2,
  Filter,
  Star,
  X,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const StudentCohortMonitor: React.FC = () => {
  const { studentProfile, endorseStudentSkill, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [endorseModalOpen, setEndorseModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(studentProfile.skills[0]?.id || '');
  const [endorsementText, setEndorsementText] = useState(
    'Demonstrated mastery during Advanced Distributed Systems laboratory projects with exceptional code cleanliness.'
  );
  const [scoreRating, setScoreRating] = useState(94);

  // Mock list of cohort students including our primary active student
  const cohortStudents = [
    {
      id: studentProfile.id,
      name: studentProfile.name,
      avatar: studentProfile.avatar,
      department: studentProfile.department,
      gpa: studentProfile.gpa,
      readinessScore: studentProfile.industryReadinessScore,
      skillsCount: studentProfile.skills.length,
      verifiedCerts: studentProfile.certifications.filter((c) => c.verified).length,
      primaryFocus: 'Distributed Cloud & AI Architecture',
    },
    {
      id: 'stud_2',
      name: 'Rohan Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Computer Science & Eng',
      gpa: 3.84,
      readinessScore: 84,
      skillsCount: 8,
      verifiedCerts: 2,
      primaryFocus: 'Cybersecurity & Network Protocols',
    },
    {
      id: 'stud_3',
      name: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Computer Science & Eng',
      gpa: 3.96,
      readinessScore: 92,
      skillsCount: 11,
      verifiedCerts: 4,
      primaryFocus: 'Machine Learning & LLM Systems',
    },
    {
      id: 'stud_4',
      name: 'Vikram Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Information Technology',
      gpa: 3.72,
      readinessScore: 79,
      skillsCount: 7,
      verifiedCerts: 1,
      primaryFocus: 'Full-Stack Web & Mobile Apps',
    },
  ];

  const filteredStudents = cohortStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.primaryFocus.toLowerCase().includes(search.toLowerCase())
  );

  const handleEndorsementSubmit進 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!endorsementText.trim()) {
      showToast('Please provide an endorsement statement.', 'error');
      return;
    }
    endorseStudentSkill(selectedSkillId, endorsementText, scoreRating);
    setEndorseModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-200/60 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            Class of 2026 Academic Cohort
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Student Cohort Monitor & Skill Endorsements
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Monitor GPA metrics, evaluate project deliverables, and endorse student technical proficiencies to recruiters.
          </p>
        </div>

        <button
          onClick={() => setEndorseModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>Endorse Candidate Skill</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, specialty, GPA..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Cohort Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {s.department} • GPA: <span className="font-bold text-gray-800 dark:text-gray-200">{s.gpa}</span>
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                    {s.primaryFocus}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {s.readinessScore}%
                </span>
                <span className="text-[10px] text-gray-400 block font-bold">Readiness Index</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <span className="text-[10px] text-gray-400 block font-semibold">Skills Logged</span>
                <span className="font-bold">{s.skillsCount} Technical Skills</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <span className="text-[10px] text-gray-400 block font-semibold">Verified Credentials</span>
                <span className="font-bold text-emerald-600">{s.verifiedCerts} Faculty Stamped</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setSelectedSkillId(studentProfile.skills[0]?.id || '');
                  setEndorseModalOpen(true);
                }}
                className="w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Issue Faculty Skill Endorsement</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Endorse Modal */}
      {endorseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setEndorseModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Endorse Student Technical Competency
              </h3>
              <button
                onClick={() => setEndorseModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEndorsementSubmit進} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Select Competency / Skill
                </label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {studentProfile.skills.map((sk) => (
                    <option key={sk.id} value={sk.id}>
                      {sk.name} ({sk.category} - {sk.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Proficiency Rating (0 - 100): <span className="font-bold text-blue-600">{scoreRating}/100</span>
                </label>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={scoreRating}
                  onChange={(e) => setScoreRating(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Faculty Endorsement Notes (visible to recruiters) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={endorsementText}
                  onChange={(e) => setEndorsementText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEndorseModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Sign & Attach Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
