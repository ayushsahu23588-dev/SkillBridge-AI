import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Sparkles,
  Plus,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const PostJobView: React.FC = () => {
  const { addJob, currentUser, setActiveTab, showToast } = useApp();

  const [title, setTitle] = useState('Senior Cloud Infrastructure Intern');
  const [companyName, setCompanyName] = useState(currentUser.organization || 'NovaCloud Systems');
  const [type, setType] = useState<'Internship' | 'Full-time' | 'Part-time'>('Internship');
  const [location, setLocation] = useState('San Jose, CA (Hybrid)');
  const [stipendOrSalary, setStipendOrSalary] = useState('$55 / hr + Housing Stipend');
  const [description, setDescription] = useState(
    'Join our Core Cloud Infrastructure team to design, deploy, and benchmark distributed Redis telemetry collectors and Kubernetes cluster auto-scalers handling 50M+ RPC events daily.'
  );
  const [requiredSkills, setRequiredSkills] = useState('TypeScript, Node.js, Docker, Redis, Kubernetes');
  const [minGpa, setMinGpa] = useState(3.5);
  const [deadline, setDeadline] = useState('2026-10-31');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !description) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    const skills = requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addJob({
      companyId: 'comp_1',
      companyName,
      companyLogo:
        'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      title,
      type,
      location,
      stipendOrSalary,
      description,
      requiredSkills: skills.length > 0 ? skills : ['TypeScript', 'Cloud'],
      minGpa,
      deadline,
    });

    setActiveTab('applicant_kanban');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Campus Placement & Internship Dispatch
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Publish New Job / Internship Listing
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Broadcast openings to verified college partner talent pools with automated AI pre-screening and minimum GPA cutoffs.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Position Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="Internship">Internship (Summer / Fall)</option>
                <option value="Full-time">Full-Time (Graduating Batch)</option>
                <option value="Part-time">Part-Time / Research</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Jose, CA (Hybrid)"
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Stipend / Annual CTC
              </label>
              <input
                type="text"
                value={stipendOrSalary}
                onChange={(e) => setStipendOrSalary(e.target.value)}
                placeholder="e.g. $55/hr or $135,000 / yr"
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Required Technical Competencies (comma-separated) *
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. TypeScript, React, Docker, Redis, Go"
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Minimum GPA Cutoff
              </label>
              <input
                type="number"
                step="0.1"
                min="2.0"
                max="4.0"
                value={minGpa}
                onChange={(e) => setMinGpa(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Job Description & Responsibilities *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Listing to Colleges</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
