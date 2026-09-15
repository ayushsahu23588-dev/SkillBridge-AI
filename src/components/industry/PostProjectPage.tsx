import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from 'lucide-react';

export const PostProjectPage: React.FC = () => {
  const { addOpportunity, navigate, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [duration, setDuration] = useState('8-12 Weeks');
  const [teamSize, setTeamSize] = useState('3-4 Students');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [eligibility, setEligibility] = useState('Pre-final & Final Year B.Tech / M.Tech Students');
  const [deadline, setDeadline] = useState('2026-11-20');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Project title is required.';
    if (!description.trim()) errs.description = 'Project description is required.';
    if (!problemStatement.trim()) errs.problemStatement = 'Problem statement is required.';
    if (!requiredSkills.trim()) errs.requiredSkills = 'Required skills are required.';
    if (!duration.trim()) errs.duration = 'Project duration is required.';
    if (!teamSize.trim()) errs.teamSize = 'Team size is required.';
    if (!expectedOutcome.trim()) errs.expectedOutcome = 'Expected outcome is required.';
    if (!eligibility.trim()) errs.eligibility = 'Eligibility is required.';
    if (!deadline.trim()) errs.deadline = 'Deadline is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill in all mandatory project fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 650));

      const reqSkillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const prefSkillsArray = preferredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      addOpportunity({
        companyId: 'comp_1',
        companyName: 'TechNova Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title,
        type: 'Project',
        department: 'Applied R&D Lab',
        description,
        problemStatement,
        expectedOutcome,
        teamSize,
        responsibilities: [
          'Research and implement proof-of-concept software architecture',
          'Submit weekly sprint demos and code commits to review repository',
          'Document technical report and deliver final oral presentation',
        ],
        requiredSkills: reqSkillsArray,
        preferredSkills: prefSkillsArray,
        location: workMode === 'Remote' ? 'Virtual Collaboration' : 'Bangalore Campus / Hybrid',
        workMode,
        duration,
        stipendOrSalary: 'Project Grant & Certificate',
        eligibility,
        minQualification: 'B.Tech / M.Tech Student Teams',
        deadline,
        status: 'Active',
      });

      showToast(`Industry Project "${title}" published for student cohorts!`, 'success');
      navigate('/industry/opportunities');
    } catch (err) {
      showToast('Failed to publish project. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setErrors({ title: 'Provide a title to save a draft.' });
      showToast('Please enter a project title to save draft.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 450));

      const reqSkillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      addOpportunity({
        companyId: 'comp_1',
        companyName: 'TechNova Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title,
        type: 'Project',
        department: 'R&D',
        description: description || 'Draft industry capstone project.',
        problemStatement: problemStatement || 'Problem statement pending.',
        expectedOutcome: expectedOutcome || 'Prototype deliverable.',
        teamSize: teamSize || '2-4 Students',
        responsibilities: [],
        requiredSkills: reqSkillsArray.length > 0 ? reqSkillsArray : ['Computer Science'],
        preferredSkills: [],
        location: 'Virtual',
        workMode,
        duration: duration || '8 Weeks',
        stipendOrSalary: 'Grant / Certificate',
        eligibility: eligibility || 'Engineering Students',
        minQualification: 'B.Tech',
        deadline: deadline || '2026-12-31',
        status: 'Draft',
      });

      showToast(`Draft project "${title}" saved.`, 'info');
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <Target className="w-3.5 h-3.5" />
          <span>Industry-Sponsored Capstone Project</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Post Industry Project
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Publish real-world industry problem statements for student capstones, supervised student cohorts, and faculty co-mentors.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handlePublish} className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        {/* Project Title */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Project Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Real-Time Telemetry & Edge Computing Architecture for IoT Sensor Clusters"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.title
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-200 dark:border-white/10'
            } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.title && (
            <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Problem Statement *
          </label>
          <textarea
            rows={3}
            placeholder="Define the core industrial bottleneck or challenge the student team is expected to solve..."
            value={problemStatement}
            onChange={(e) => {
              setProblemStatement(e.target.value);
              if (errors.problemStatement) setErrors((prev) => ({ ...prev, problemStatement: '' }));
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.problemStatement
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-200 dark:border-white/10'
            } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed`}
          />
          {errors.problemStatement && (
            <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.problemStatement}</span>
            </p>
          )}
        </div>

        {/* Project Description */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Project Scope & Methodology *
          </label>
          <textarea
            rows={3}
            placeholder="Explain background context, suggested toolchains, dataset access, and support provided by company mentors..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.description
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-200 dark:border-white/10'
            } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed`}
          />
          {errors.description && (
            <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Expected Outcome */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Expected Deliverables & Outcome *
          </label>
          <input
            type="text"
            placeholder="e.g. Functional Dockerized prototype, API test suite, and technical whitepaper"
            value={expectedOutcome}
            onChange={(e) => {
              setExpectedOutcome(e.target.value);
              if (errors.expectedOutcome) setErrors((prev) => ({ ...prev, expectedOutcome: '' }));
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.expectedOutcome
                ? 'border-red-500 ring-1 ring-red-500'
                : 'border-gray-200 dark:border-white/10'
            } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.expectedOutcome && (
            <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.expectedOutcome}</span>
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
              placeholder="e.g. Python, Docker, MQTT, Edge Computing, C++"
              value={requiredSkills}
              onChange={(e) => {
                setRequiredSkills(e.target.value);
                if (errors.requiredSkills) setErrors((prev) => ({ ...prev, requiredSkills: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.requiredSkills
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
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
              placeholder="e.g. Kafka, InfluxDB, Prometheus, Linux Kernel"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Duration, Team Size, Work Mode, Eligibility, Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Project Duration *
            </label>
            <input
              type="text"
              placeholder="e.g. 10 Weeks"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.duration
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.duration && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.duration}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Team Size *
            </label>
            <input
              type="text"
              placeholder="e.g. 2-4 Students"
              value={teamSize}
              onChange={(e) => {
                setTeamSize(e.target.value);
                if (errors.teamSize) setErrors((prev) => ({ ...prev, teamSize: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.teamSize
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.teamSize && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.teamSize}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Work Mode *
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Eligibility *
            </label>
            <input
              type="text"
              placeholder="e.g. 3rd & 4th Year B.Tech"
              value={eligibility}
              onChange={(e) => {
                setEligibility(e.target.value);
                if (errors.eligibility) setErrors((prev) => ({ ...prev, eligibility: '' }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.eligibility
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-200 dark:border-white/10'
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.eligibility && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.eligibility}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Deadline *
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
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.deadline && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.deadline}</span>
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
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
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Project...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
