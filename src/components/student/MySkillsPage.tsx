import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  GitBranch,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

interface DisplaySkill {
  id: string;
  name: string;
  proficiency: number;
  category: 'Programming' | 'Database' | 'Cloud & DevOps' | 'Algorithms' | 'Soft Skill';
  status: 'Verified' | 'In Progress' | 'Needs Improvement';
  source: 'Assessment' | 'Project' | 'Course' | 'GitHub';
  verifiedBy?: string;
}

export const MySkillsPage: React.FC = () => {
  const { navigate, showToast } = useApp();

  const [skillsList, setSkillsList] = useState<DisplaySkill[]>([
    {
      id: 'sk_1',
      name: 'Python',
      proficiency: 85,
      category: 'Programming',
      status: 'Verified',
      source: 'Assessment',
      verifiedBy: 'AI Skill Matrix (Score 92/100)',
    },
    {
      id: 'sk_2',
      name: 'SQL & PostgreSQL',
      proficiency: 82,
      category: 'Database',
      status: 'Verified',
      source: 'Project',
      verifiedBy: 'NovaCloud Internship Project',
    },
    {
      id: 'sk_3',
      name: 'FastAPI & REST APIs',
      proficiency: 78,
      category: 'Programming',
      status: 'Verified',
      source: 'GitHub',
      verifiedBy: 'GitHub Code Scanner',
    },
    {
      id: 'sk_4',
      name: 'Docker & Microservices',
      proficiency: 65,
      category: 'Cloud & DevOps',
      status: 'In Progress',
      source: 'Course',
      verifiedBy: 'NPTEL Cloud Computing Course',
    },
    {
      id: 'sk_5',
      name: 'Data Structures & Algorithms',
      proficiency: 48,
      category: 'Algorithms',
      status: 'Needs Improvement',
      source: 'Assessment',
      verifiedBy: 'Campus Diagnostic Test',
    },
    {
      id: 'sk_6',
      name: 'Cloud Computing (AWS / GCP)',
      proficiency: 50,
      category: 'Cloud & DevOps',
      status: 'Needs Improvement',
      source: 'Course',
      verifiedBy: 'Self-Reported + Lab Modules',
    },
    {
      id: 'sk_7',
      name: 'Communication & Team Leadership',
      proficiency: 80,
      category: 'Soft Skill',
      status: 'Verified',
      source: 'Course',
      verifiedBy: 'Faculty Endorsement (Dr. Evelyn Vance)',
    },
    {
      id: 'sk_8',
      name: 'System Design Basics',
      proficiency: 55,
      category: 'Programming',
      status: 'In Progress',
      source: 'Project',
      verifiedBy: 'Capstone Architecture Review',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState(70);
  const [newSkillCategory, setNewSkillCategory] = useState<DisplaySkill['category']>('Programming');

  const filteredSkills = skillsList.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchQuery;
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newEntry: DisplaySkill = {
      id: `sk_${Date.now()}`,
      name: newSkillName.trim(),
      proficiency: newSkillProf,
      category: newSkillCategory,
      status: newSkillProf >= 75 ? 'Verified' : newSkillProf >= 50 ? 'In Progress' : 'Needs Improvement',
      source: 'Course',
      verifiedBy: 'Self-Verified',
    };
    setSkillsList([newEntry, ...skillsList]);
    setNewSkillName('');
    setIsAddModalOpen(false);
    showToast(`Skill "${newEntry.name}" added to your profile!`, 'success');
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credential Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            My Skills
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Track verified, in-progress, and self-reported competencies across programming, databases, and system design.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="run-skill-gap-analysis-btn"
            onClick={() => navigate('/student/skill-gap')}
            className="px-4 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Run Skill Gap Analysis</span>
          </button>
          <button
            id="update-skills-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Update Skills</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill by name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
          {['All', 'Programming', 'Database', 'Cloud & DevOps', 'Algorithms', 'Soft Skill'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#14151B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((skill) => {
          let statusBadge = (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          );
          if (skill.status === 'In Progress') {
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                In Progress
              </span>
            );
          } else if (skill.status === 'Needs Improvement') {
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Needs Improvement
              </span>
            );
          }

          let sourceIcon = <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
          if (skill.source === 'GitHub') sourceIcon = <GitBranch className="w-3.5 h-3.5 text-purple-500" />;
          if (skill.source === 'Course') sourceIcon = <BookOpen className="w-3.5 h-3.5 text-emerald-500" />;

          return (
            <div
              key={skill.id}
              className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {skill.category}
                  </span>
                  {statusBadge}
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {skill.name}
                </h3>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500 dark:text-gray-400">Proficiency Level</span>
                    <span className="text-gray-900 dark:text-white tabular-nums">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skill.proficiency >= 75
                          ? 'bg-emerald-500'
                          : skill.proficiency >= 50
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  {sourceIcon}
                  <span>Source: {skill.source}</span>
                </div>
                {skill.verifiedBy && (
                  <span className="truncate max-w-[130px] font-medium" title={skill.verifiedBy}>
                    {skill.verifiedBy}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add / update skill */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add or Update Skill
            </h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Kubernetes, TypeScript, PyTorch"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
                >
                  <option value="Programming">Programming</option>
                  <option value="Database">Database</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Soft Skill">Soft Skill</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Proficiency Level</span>
                  <span className="text-blue-600 dark:text-blue-400">{newSkillProf}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={newSkillProf}
                  onChange={(e) => setNewSkillProf(Number(e.target.value))}
                  className="w-full accent-blue-600 dark:accent-[#D4F73C] cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
