import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';

export const CompanyJobsView: React.FC = () => {
  const { jobs, addJob, editJob, deleteJob, applications, currentCompany, setActiveTab, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Internship' | 'Full-time'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form State for creating/editing job
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Software Engineering',
    type: 'Full-time' as JobPosting['type'],
    location: 'Hybrid • San Francisco, CA / Remote',
    salaryOrStipend: '$140,000 - $165,000 / year + Equity',
    minGpa: 3.5,
    description: '',
    requirements: ['React / TypeScript', 'Node.js', 'PostgreSQL / SQL', 'REST & GraphQL APIs', 'Git & CI/CD'],
    eligibleBatches: ['2025', '2026'],
    targetColleges: ['Apex NIT', 'Metro State University', 'All Partner Campuses'],
    deadline: '2025-06-30',
  });

  const [reqInput, setReqInput] = useState('');

  const companyJobs = jobs.filter(
    (j) => j.companyName?.toLowerCase() === currentCompany.name?.toLowerCase() || true
  );

  const filteredJobs = companyJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleOpenCreate = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      department: 'Software Engineering',
      type: 'Full-time',
      location: 'Hybrid • San Francisco, CA / Remote',
      salaryOrStipend: '$140,000 - $165,000 / year + Equity',
      minGpa: 3.5,
      description: 'We are seeking an ambitious Junior / New Grad Engineer to join our distributed infrastructure team. You will build high-throughput microservices, design event-driven architectures, and deploy cloud-native systems.',
      requirements: ['TypeScript / Node.js', 'React', 'Docker & Kubernetes basics', 'Solid CS Fundamentals & Data Structures'],
      eligibleBatches: ['2025', '2026'],
      targetColleges: ['Apex NIT', 'Metro State University', 'All Partner Campuses'],
      deadline: '2025-06-30',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (job: JobPosting) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      department: job.department || (job.departmentTarget && job.departmentTarget[0]) || 'Engineering',
      type: job.type,
      location: job.location,
      salaryOrStipend: job.salaryOrStipend || job.stipendOrSalary || '$45/hr',
      minGpa: job.minGpa || 3.5,
      description: job.description,
      requirements: job.requirements || job.qualifications || [],
      eligibleBatches: job.eligibleBatches || ['2025', '2026'],
      targetColleges: job.targetColleges || ['All Partner Campuses'],
      deadline: job.deadline,
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title.trim()) return;

    if (editingJobId) {
      editJob(editingJobId, {
        title: jobForm.title,
        department: jobForm.department,
        type: jobForm.type,
        location: jobForm.location,
        salaryOrStipend: jobForm.salaryOrStipend,
        minGpa: jobForm.minGpa,
        description: jobForm.description,
        requirements: jobForm.requirements,
        eligibleBatches: jobForm.eligibleBatches,
        targetColleges: jobForm.targetColleges,
        deadline: jobForm.deadline,
      });
    } else {
      addJob({
        title: jobForm.title,
        companyId: currentCompany.id,
        companyName: currentCompany.name,
        companyLogo: currentCompany.logo,
        type: jobForm.type,
        location: jobForm.location,
        salaryOrStipend: jobForm.salaryOrStipend,
        minGpa: jobForm.minGpa,
        description: jobForm.description,
        requirements: jobForm.requirements,
        eligibleBatches: jobForm.eligibleBatches,
        targetColleges: jobForm.targetColleges,
        deadline: jobForm.deadline,
      });
    }

    setIsCreateModalOpen(false);
  };

  const handleAddRequirement = () => {
    if (reqInput.trim() && !jobForm.requirements.includes(reqInput.trim())) {
      setJobForm({ ...jobForm, requirements: [...jobForm.requirements, reqInput.trim()] });
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (req: string) => {
    setJobForm({
      ...jobForm,
      requirements: jobForm.requirements.filter((r) => r !== req),
    });
  };

  // AI JD Generator helper
  const handleGenerateAiJD = () => {
    const title = jobForm.title || 'Full Stack Cloud Engineer';
    const generatedDesc = `As a ${title} at ${currentCompany.name}, you will be part of a mission-critical squad delivering resilient distributed architectures. You will architect REST & GraphQL microservices, collaborate directly with staff engineers, participate in bi-weekly design reviews, and ship features used by enterprise customers globally.`;
    setJobForm((prev) => ({
      ...prev,
      description: generatedDesc,
    }));
    showToast('AI synthesized a tailored job description based on role & company profile!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Campus Jobs & Internship Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Publish openings to partner university placement drives, configure GPA minimums, and track candidate pipeline velocity.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opening</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search job title, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-purple-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Internship', 'Full-time'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeFilter === type
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const jobApplicants = applications.filter((a) => a.jobId === job.id);
          const highFitCount = jobApplicants.filter((a) => a.aiMatchScore >= 85).length;

          return (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between hover:border-purple-500/50 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          job.type === 'Internship'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {job.type}
                      </span>
                      {job.department && (
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                          {job.department}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                      {job.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="p-2 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                      title="Edit Opening"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="Delete Opening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salaryOrStipend}
                  </span>
                  {job.minGpa && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                      Min GPA: {job.minGpa}
                    </span>
                  )}
                </div>

                {/* Requirements badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requirements.slice(0, 4).map((req, ri) => (
                    <span
                      key={ri}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-400">
                      +{job.requirements.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">Applicants:</span>{' '}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {jobApplicants.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">High Match:</span>{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {highFitCount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('applicant_kanban')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span>Review Pipeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Job Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingJobId ? 'Edit Job Opening' : 'Post Campus Hiring Opening'}
                </h3>
                <p className="text-xs text-gray-500">
                  Targeted to verified engineering student cohorts
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Cloud Systems Engineer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Opportunity Type
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Full-time">Full-time Graduate Hire (FTE)</option>
                    <option value="Internship">Summer / Fall Internship (3-6 Months)</option>
                    <option value="Contract">Co-op / Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Location & Work Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hybrid • San Francisco / Remote"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Compensation / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $140k - $165k + Equity"
                    value={jobForm.salaryOrStipend}
                    onChange={(e) => setJobForm({ ...jobForm, salaryOrStipend: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Minimum GPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="4.0"
                    value={jobForm.minGpa}
                    onChange={(e) => setJobForm({ ...jobForm, minGpa: parseFloat(e.target.value) || 3.0 })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    Role Description & Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiJD}
                    className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    Auto-Generate with AI
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Requirements tags */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Required Competencies & Skills
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {jobForm.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(req)}
                        className="text-purple-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add required skill (e.g. Distributed Systems, Kubernetes)..."
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  {editingJobId ? 'Save Updates' : 'Publish Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
