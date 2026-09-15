import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Banknote,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Loader2,
} from 'lucide-react';
import { AIGenerationModal } from '../common/AIGenerationModal';

export const PostJobPage: React.FC = () => {
  const { addOpportunity, navigate, showToast } = useApp();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [experience, setExperience] = useState('0-2 Years (Freshers & Early Career)');
  const [qualification, setQualification] = useState('B.Tech / B.E. / M.Tech / MCA in CS/IT/ECE');
  const [salaryRange, setSalaryRange] = useState('₹12.0 - ₹18.0 LPA');
  const [deadline, setDeadline] = useState('2026-11-30');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Job title is required.';
    if (!department.trim()) errs.department = 'Department is required.';
    if (!description.trim()) errs.description = 'Job description is required.';
    if (!responsibilities.trim()) errs.responsibilities = 'Responsibilities are required.';
    if (!requiredSkills.trim()) errs.requiredSkills = 'Required skills are required.';
    if (!location.trim()) errs.location = 'Location is required.';
    if (!experience.trim()) errs.experience = 'Experience level is required.';
    if (!qualification.trim()) errs.qualification = 'Qualification is required.';
    if (!salaryRange.trim()) errs.salaryRange = 'Salary range is required.';
    if (!deadline.trim()) errs.deadline = 'Application deadline is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill in all mandatory job fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate/await asynchronous database persistence
      await new Promise((r) => setTimeout(r, 650));

      const reqSkillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const prefSkillsArray = preferredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const respArray = responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      addOpportunity({
        companyId: 'comp_1',
        companyName: 'TechNova Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title,
        type: 'Job',
        department,
        description,
        responsibilities: respArray.length > 0 ? respArray : [responsibilities],
        requiredSkills: reqSkillsArray,
        preferredSkills: prefSkillsArray,
        location,
        workMode,
        duration: 'Permanent Full-time',
        stipendOrSalary: salaryRange,
        eligibility: experience,
        minQualification: qualification,
        deadline,
        status: 'Active',
      });

      showToast(`Full-Time Job role "${title}" published successfully!`, 'success');
      navigate('/industry/opportunities');
    } catch (err) {
      showToast('Failed to publish job role. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setErrors({ title: 'Provide a title to save a draft.' });
      showToast('Please enter a job title to save a draft.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 450));

      const reqSkillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const prefSkillsArray = preferredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const respArray = responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      addOpportunity({
        companyId: 'comp_1',
        companyName: 'TechNova Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title,
        type: 'Job',
        department: department || 'Technology',
        description: description || 'Draft job posting.',
        responsibilities: respArray,
        requiredSkills: reqSkillsArray.length > 0 ? reqSkillsArray : ['Software Engineering'],
        preferredSkills: prefSkillsArray,
        location: location || 'Bangalore / Remote',
        workMode,
        duration: 'Permanent Full-time',
        stipendOrSalary: salaryRange || '₹10.0 - ₹15.0 LPA',
        eligibility: experience || 'Entry Level',
        minQualification: qualification || 'B.Tech / M.Tech',
        deadline: deadline || '2026-12-31',
        status: 'Draft',
      });

      showToast(`Draft "${title}" saved.`, 'info');
      navigate('/industry/opportunities');
    } catch (err) {
      showToast('Failed to save draft. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/industry/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Industry Dashboard</span>
      </button>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Full-Time Campus Hiring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Post Full-Time Job
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Publish entry-level and graduate engineering positions directly to verified university placement cells.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#D4F73C]" />
            <span>Generate with AI</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handlePublish} className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        {/* Title and Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Associate Backend Engineer"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.title
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Department *
            </label>
            <input
              type="text"
              placeholder="e.g. Core Platform Architecture"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.department
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.department && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.department}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Role Summary & Description *
          </label>
          <textarea
            rows={4}
            placeholder="Outline organizational mission, team scope, technologies used, and career growth trajectories..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.description
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-200 dark:border-white/10'
            } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed`}
          />
          {errors.description && (
            <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Key Responsibilities * (Enter one per line)
          </label>
          <textarea
            rows={3}
            placeholder="Design, build and maintain resilient microservices in Go / Python / Node.js&#10;Implement comprehensive telemetry, monitoring, and automated test coverage&#10;Contribute to production deployments using Docker and Kubernetes"
            value={responsibilities}
            onChange={(e) => {
              setResponsibilities(e.target.value);
              if (errors.responsibilities) setErrors((prev) => ({ ...prev, responsibilities: '' }));
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.responsibilities
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-200 dark:border-white/10'
            } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed`}
          />
          {errors.responsibilities && (
            <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.responsibilities}</span>
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Required Skills * (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, SQL, PostgreSQL, REST APIs, Git"
              value={requiredSkills}
              onChange={(e) => {
                setRequiredSkills(e.target.value);
                if (errors.requiredSkills) setErrors((prev) => ({ ...prev, requiredSkills: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.requiredSkills
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.requiredSkills && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.requiredSkills}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Preferred Skills (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. AWS, Redis, GraphQL, Docker, Terraform"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Work Mode & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Work Mode *
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g. Bangalore / Hyderabad / Pune"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.location
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.location && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Experience, Qualification, Salary Range, Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Experience Level *
            </label>
            <input
              type="text"
              placeholder="e.g. 0-1 Years / Fresher"
              value={experience}
              onChange={(e) => {
                setExperience(e.target.value);
                if (errors.experience) setErrors((prev) => ({ ...prev, experience: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.experience
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.experience && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.experience}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Qualification *
            </label>
            <input
              type="text"
              placeholder="e.g. B.Tech / M.Tech in CS/IT"
              value={qualification}
              onChange={(e) => {
                setQualification(e.target.value);
                if (errors.qualification) setErrors((prev) => ({ ...prev, qualification: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.qualification
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.qualification && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.qualification}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Salary Range (CTC) *
            </label>
            <input
              type="text"
              placeholder="e.g. ₹12.0 - ₹18.0 LPA"
              value={salaryRange}
              onChange={(e) => {
                setSalaryRange(e.target.value);
                if (errors.salaryRange) setErrors((prev) => ({ ...prev, salaryRange: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.salaryRange
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.salaryRange && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.salaryRange}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Application Deadline *
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.deadline
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.deadline && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.deadline}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
          <button
            type="button"
            onClick={() => navigate('/industry/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/15 font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Job...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Gemini AI Job Specification Generation Modal */}
      {isAiModalOpen && (
        <AIGenerationModal
          type="job"
          initialTitle={title}
          onClose={() => setIsAiModalOpen(false)}
          onApply={(data) => {
            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.responsibilities && data.responsibilities.length > 0) {
              setResponsibilities(data.responsibilities.join('\n'));
            }
            if (data.requiredSkills && data.requiredSkills.length > 0) {
              setRequiredSkills(data.requiredSkills.join(', '));
            }
            if (data.preferredQualifications && data.preferredQualifications.length > 0) {
              setPreferredSkills(data.preferredQualifications.join(', '));
            }
            setIsAiModalOpen(false);
            showToast('AI-generated job specification applied to form!', 'success');
          }}
        />
      )}
    </div>
  );
};
