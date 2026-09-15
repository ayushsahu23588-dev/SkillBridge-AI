import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  Banknote,
  Clock,
  Layers,
  Loader2,
} from 'lucide-react';

export const PostOpportunityPage: React.FC = () => {
  const { publishNewOpportunity, navigate, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Internship' | 'Full-time' | 'Co-op' | 'Apprenticeship'>('Internship');
  const [departmentTarget, setDepartmentTarget] = useState('Computer Science, Information Technology');
  const [requiredSkills, setRequiredSkills] = useState('Python, Docker, SQL, REST APIs');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹35,000 / month');
  const [location, setLocation] = useState('Bangalore, India');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'On-site' | 'Hybrid'>('Hybrid');
  const [duration, setDuration] = useState('6 Months');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [description, setDescription] = useState(
    'Seeking passionate software engineering students to contribute to high-scale backend microservices, real-time telemetry processing, and cloud deployment pipelines.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an opportunity title.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate/await asynchronous database persistence
      await new Promise((r) => setTimeout(r, 650));

      const skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const deptsArray = departmentTarget
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      publishNewOpportunity({
        title,
        type,
        workplaceType,
        location,
        stipendOrSalary,
        departmentTarget: deptsArray,
        requiredSkills: skillsArray,
        description,
        deadline,
      });

      showToast(`Opportunity "${title}" published and matching candidates!`, 'success');
      // Navigate to manage or candidate matching
      navigate('/industry/candidates');
    } catch (err) {
      showToast('Failed to publish opportunity. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-4xl mx-auto">
      {/* Top Bar */}
      <button
        onClick={() => navigate('/industry/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Industry Dashboard</span>
      </button>

      {/* Form Container */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Recruitment Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Post New Campus Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Publish internships, graduate roles, faculty fellowships, or industry capstones directly to 14,800+ verified engineering candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opportunity Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Opportunity Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Internship', label: 'Student Internship' },
                { id: 'Full-time', label: 'Full-Time Job' },
                { id: 'Co-op', label: 'Faculty Fellowship' },
                { id: 'Apprenticeship', label: 'Industry Capstone' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    type === opt.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Role / Opportunity Title
            </label>
            <input
              id="opportunity-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Cloud Systems & Microservices Intern"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Department */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Target Department / Branches
              </label>
              <input
                type="text"
                value={departmentTarget}
                onChange={(e) => setDepartmentTarget(e.target.value)}
                placeholder="e.g. Computer Science, IT, ECE"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Required Skills (Comma-separated)
              </label>
              <input
                id="opportunity-skills-input"
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="e.g. Python, Docker, SQL, React"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stipend / Salary */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Stipend / Salary Package
              </label>
              <input
                type="text"
                value={stipendOrSalary}
                onChange={(e) => setStipendOrSalary(e.target.value)}
                placeholder="e.g. ₹35,000 / month or ₹8.5 LPA"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore / Remote"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>

            {/* Workplace Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Work Mode
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Duration / Commitment
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 6 Months / Full-Time"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Description & Responsibilities
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4F73C]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              id="publish-opportunity-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Opportunity & Matching Candidates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Opportunity & Match Candidates</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
