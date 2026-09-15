import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';

interface TrainingProgram {
  id: string;
  title: string;
  type: 'Bootcamp' | 'Workshop' | 'Certification' | 'Placement Prep';
  partner: string;
  department: string;
  targetBatch: string;
  duration: string;
  enrolled: number;
  completionRate: number;
  status: 'Active' | 'Completed' | 'Upcoming';
  skillsCovered: string[];
}

export const InstitutionTrainingView: React.FC = () => {
  const { isDarkMode, showToast } = useApp();

  const [programs, setPrograms] = useState<TrainingProgram[]>([
    {
      id: 'tp_1',
      title: 'Cloud Native & Kubernetes Accelerator',
      type: 'Bootcamp',
      partner: 'Red Hat Academy',
      department: 'CSE / IT',
      targetBatch: 'Class of 2026',
      duration: '4 Weeks (40 Hours)',
      enrolled: 120,
      completionRate: 88,
      status: 'Active',
      skillsCovered: ['Docker', 'Kubernetes', 'Helm', 'CI/CD Pipelines'],
    },
    {
      id: 'tp_2',
      title: 'High-Performance Distributed Systems in Go',
      type: 'Workshop',
      partner: 'TechNova Engineering Labs',
      department: 'CSE',
      targetBatch: 'Class of 2026 & 2027',
      duration: '3 Days Intensive',
      enrolled: 85,
      completionRate: 94,
      status: 'Completed',
      skillsCovered: ['Go (Golang)', 'gRPC', 'Concurrency', 'Raft Consensus'],
    },
    {
      id: 'tp_3',
      title: 'Full-Stack TypeScript & System Design Placement Prep',
      type: 'Placement Prep',
      partner: 'Apex Placement Cell & Alumni Network',
      department: 'All Engineering',
      targetBatch: 'Class of 2026',
      duration: '6 Weeks',
      enrolled: 210,
      completionRate: 78,
      status: 'Active',
      skillsCovered: ['React', 'Next.js', 'PostgreSQL', 'System Design'],
    },
    {
      id: 'tp_4',
      title: 'Embedded IoT & Automotive Firmware Masterclass',
      type: 'Certification',
      partner: 'Texas Instruments & Ola Electric',
      department: 'ECE / Mechanical',
      targetBatch: 'Class of 2027',
      duration: '5 Weeks',
      enrolled: 64,
      completionRate: 0,
      status: 'Upcoming',
      skillsCovered: ['ARM Cortex', 'CAN Bus', 'RTOS', 'Battery Telemetry'],
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Bootcamp' | 'Workshop' | 'Certification' | 'Placement Prep'>('Bootcamp');
  const [newPartner, setNewPartner] = useState('');
  const [newDept, setNewDept] = useState('CSE / IT');
  const [newBatch, setNewBatch] = useState('Class of 2026');
  const [newDuration, setNewDuration] = useState('4 Weeks');
  const [newSkills, setNewSkills] = useState('System Design, Cloud Native');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPartner) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    const created: TrainingProgram = {
      id: `tp_${Date.now()}`,
      title: newTitle,
      type: newType,
      partner: newPartner,
      department: newDept,
      targetBatch: newBatch,
      duration: newDuration,
      enrolled: 45,
      completionRate: 0,
      status: 'Upcoming',
      skillsCovered: newSkills.split(',').map((s) => s.trim()),
    };

    setPrograms([created, ...programs]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewPartner('');
    showToast(`Created institutional training program: "${created.title}"`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Institutional Training & Skill Development</span>
          </h2>
          <p className="text-xs text-gray-400">
            Orchestrate corporate bootcamps, technical certifications, and placement preparation drives to bridge curriculum gaps.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Training Program</span>
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    prog.type === 'Bootcamp'
                      ? 'bg-blue-500/10 text-blue-500'
                      : prog.type === 'Workshop'
                      ? 'bg-purple-500/10 text-purple-500'
                      : prog.type === 'Placement Prep'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {prog.type}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prog.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : prog.status === 'Completed'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                  }`}
                >
                  {prog.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                {prog.title}
              </h3>
              <p className="text-xs text-indigo-500 font-semibold mb-3">
                Corporate Partner: {prog.partner}
              </p>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-gray-400 block">Department & Batch</span>
                  <span className="font-semibold">{prog.department} • {prog.targetBatch}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Duration & Enrolled</span>
                  <span className="font-semibold">{prog.duration} • {prog.enrolled} Students</span>
                </div>
              </div>

              {/* Skills covered */}
              <div className="space-y-1 mb-4">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">
                  Competencies Covered
                </span>
                <div className="flex flex-wrap gap-1">
                  {prog.skillsCovered.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar & Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Completion Benchmark</span>
                <span className="font-bold text-emerald-500">{prog.completionRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${prog.completionRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => showToast(`Enrolled cohort notified for ${prog.title}`, 'info')}
                  className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold cursor-pointer"
                >
                  Send Cohort Reminder
                </button>
                <button
                  onClick={() => {
                    setPrograms(
                      programs.map((p) => (p.id === prog.id ? { ...p, status: 'Completed', completionRate: 100 } : p))
                    );
                    showToast(`Marked ${prog.title} as completed`, 'success');
                  }}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-medium cursor-pointer transition-colors"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Program Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`max-w-md w-full rounded-2xl p-6 border shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10 mb-4">
              <h3 className="text-base font-bold">Launch New Training Program</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cloud Native & Microservices Bootcamp"
                  className={`w-full p-2 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Program Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Placement Prep">Placement Prep</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Corporate Partner *</label>
                  <input
                    type="text"
                    required
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    placeholder="e.g., AWS Academy / Microsoft"
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Docker, Kubernetes, AWS, Go"
                  className={`w-full p-2 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Launch Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
