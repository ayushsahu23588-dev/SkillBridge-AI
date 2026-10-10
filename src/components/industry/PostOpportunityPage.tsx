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
  GraduationCap,
  Users,
  Target,
  FileCheck,
} from 'lucide-react';
import { AiJdParserModal } from './AiJdParserModal';
import { JdParsedResult } from '../../types';

export const PostOpportunityPage: React.FC = () => {
  const { publishNewOpportunity, navigate, showToast } = useApp();

  const [isJdParserOpen, setIsJdParserOpen] = useState(false);
  const [driveType, setDriveType] = useState<'Internship' | 'Full-time' | 'Placement-Drive' | 'Project'>('Placement-Drive');
  const [title, setTitle] = useState('');
  const [departmentTarget, setDepartmentTarget] = useState('Computer Science, Information Technology, Electronics');
  const [requiredSkills, setRequiredSkills] = useState('Python, React, SQL, Cloud & REST APIs');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹45,000 / month (PPO CTC: ₹16 LPA)');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'On-site' | 'Hybrid'>('Hybrid');
  const [duration, setDuration] = useState('6 Months + Full-time Absorption');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [allowedBacklogs, setAllowedBacklogs] = useState('0');
  const [driveDate, setDriveDate] = useState('2026-05-15');
  const [description, setDescription] = useState(
    'Seeking passionate engineering candidates for our flagship campus hiring program. Selected candidates will build and optimize production cloud services, distributed pipelines, and AI-enabled workflows.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset loader based on type
  const handleTypeChange = (newType: typeof driveType) => {
    setDriveType(newType);
    if (newType === 'Placement-Drive') {
      setTitle('Campus Placement Drive 2026 — Associate Software Engineer');
      setStipendOrSalary('₹12.0 - ₹18.0 LPA');
      setDuration('Full-Time Immediate Joining');
      setDescription(
        'Annual campus recruitment drive for final-year engineering students. Includes Online Technical Assessment, System Design round, and Leadership interview.'
      );
    } else if (newType === 'Internship') {
      setTitle('Summer Software Engineering Intern (6 Months)');
      setStipendOrSalary('₹40,000 / month + Performance Bonus');
      setDuration('6 Months (Jan - June)');
      setDescription(
        'Hands-on internship working closely with senior staff engineers. Potential Pre-Placement Offer (PPO) based on midterm project review.'
      );
    } else if (newType === 'Full-time') {
      setTitle('Graduate Engineer Trainee (GET) — Backend Systems');
      setStipendOrSalary('₹10.5 LPA + Relocation Allowance');
      setDuration('Full-Time Permanent');
      setDescription(
        'Entry-level graduate engineer position. Rotation across distributed infrastructure, API services, and telemetry processing.'
      );
    } else if (newType === 'Project') {
      setTitle('Industry Capstone: Edge AI & Distributed Telemetry');
      setStipendOrSalary('₹25,000 Stipend + Research Grant');
      setDuration('4 Months Academic Semester');
      setDescription(
        'Joint university capstone project with industry engineering mentors. Real-world dataset, cloud infrastructure credits provided.'
      );
    }
  };

  const handleAiAutoFill = () => {
    setTitle('Full-Stack Cloud & AI Software Engineer');
    setRequiredSkills('React, TypeScript, Node.js, Python, PostgreSQL, Docker, AWS');
    setDepartmentTarget('Computer Science, Information Technology, AI/Data Science');
    setStipendOrSalary('₹50,000/mo (Internship) → ₹15.5 LPA (Full-time)');
    setDescription(
      'We are looking for proactive engineers who thrive on shipping reliable, well-tested code. You will build user-facing experiences, design REST/GraphQL services, and integrate LLM microservices with real-time analytics.'
    );
    showToast('AI-assisted job parameters populated!', 'success');
  };

  const handleApplyParsedJd = (parsed: JdParsedResult) => {
    setTitle(parsed.title);
    setDriveType(parsed.driveType);
    setRequiredSkills(parsed.requiredSkills.join(', '));
    setDepartmentTarget(parsed.eligibleBranches.join(', '));
    setMinCgpa(String(parsed.minCgpa));
    setAllowedBacklogs(String(parsed.allowedBacklogs));
    setStipendOrSalary(parsed.salaryOrStipend);
    setLocation(parsed.location);
    setWorkplaceType(parsed.workplaceType);
    if (parsed.duration) setDuration(parsed.duration);
    setDescription(
      `${parsed.responsibilities.join('\n')}\n\nQualifications:\n${parsed.qualifications.join('\n')}`
    );
    showToast(`AI JD Parser applied for "${parsed.title}"! All parameters populated.`, 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an opportunity or drive title.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
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
        type: driveType === 'Placement-Drive' ? 'Full-time' : driveType === 'Project' ? 'Co-op' : driveType,
        workplaceType,
        location,
        stipendOrSalary,
        departmentTarget: deptsArray,
        requiredSkills: skillsArray,
        description: `${description}\n\n[Eligibility Criteria: Min CGPA ${minCgpa}, Max Backlogs: ${allowedBacklogs}, Drive Date: ${driveDate}]`,
        deadline,
      });

      showToast(`Drive & Opportunity "${title}" published successfully!`, 'success');
      navigate('/industry/candidates');
    } catch {
      showToast('Failed to publish opportunity. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/industry/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recruiter Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsJdParserOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            id="ai-jd-parser-open-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4F73C]" />
            <span>AI JD Parser</span>
          </button>
          <button
            type="button"
            onClick={handleAiAutoFill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Quick Fill</span>
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Campus Recruitment Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Create Placement Drive / Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Launch campus placement drives, internships, full-time openings, or capstone projects with direct AI candidate compatibility matching.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unified Opportunity Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Select Opportunity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Placement-Drive', label: 'Campus Placement Drive', icon: <Building2 className="w-4 h-4" /> },
                { id: 'Internship', label: 'Student Internship', icon: <GraduationCap className="w-4 h-4" /> },
                { id: 'Full-time', label: 'Full-Time Job', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'Project', label: 'Industry Capstone', icon: <Target className="w-4 h-4" /> },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleTypeChange(opt.id as any)}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 text-center ${
                    driveType === opt.id
                      ? 'bg-[#181920] text-white dark:bg-purple-600 border-[#181920] dark:border-purple-600 shadow-md ring-2 ring-[#D4F73C]'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300'
                  }`}
                >
                  <span className={driveType === opt.id ? 'text-[#D4F73C]' : 'text-gray-500'}>
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Drive / Opportunity Title *
            </label>
            <input
              id="opportunity-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Campus Placement Drive 2026 — Associate Software Engineer"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
            />
          </div>

          {/* Academic Eligibility Controls */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
              <FileCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Campus Placement Eligibility & Criteria</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Minimum CGPA / Cutoff
                </label>
                <input
                  type="text"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  placeholder="e.g. 7.0 or 65%"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Max Active Backlogs
                </label>
                <input
                  type="text"
                  value={allowedBacklogs}
                  onChange={(e) => setAllowedBacklogs(e.target.value)}
                  placeholder="0 (No standing arrears)"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Drive Assessment Date
                </label>
                <input
                  type="date"
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Department */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Eligible Departments / Branches
              </label>
              <input
                type="text"
                value={departmentTarget}
                onChange={(e) => setDepartmentTarget(e.target.value)}
                placeholder="e.g. Computer Science, IT, ECE"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Required Technical Skills (Comma-separated)
              </label>
              <input
                id="opportunity-skills-input"
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="e.g. Python, Docker, SQL, React"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stipend / Salary */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Compensation / CTC Package
              </label>
              <input
                type="text"
                value={stipendOrSalary}
                onChange={(e) => setStipendOrSalary(e.target.value)}
                placeholder="e.g. ₹14.0 LPA or ₹40,000 / month"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Posting Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, Hyderabad, Remote"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
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
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
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
                Tenure / Commitment
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. Full-Time Permanent or 6 Months"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
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
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Role Details & Responsibilities
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
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
                  <span>Publishing Drive & Running AI Matchmaking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Drive & Match Candidates</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <AiJdParserModal
        isOpen={isJdParserOpen}
        onClose={() => setIsJdParserOpen(false)}
        onApplyParsedData={handleApplyParsedJd}
      />
    </div>
  );
};
