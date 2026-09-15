import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Camera,
  Upload,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  Save,
  Clock,
  X,
  Target,
  Loader2,
} from 'lucide-react';
import { SkillAssessmentModal } from './SkillAssessmentModal';

export const StudentProfileView: React.FC = () => {
  const {
    studentProfile,
    updateStudentProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addAchievement,
    deleteAchievement,
    addSkillToStudent,
    deleteSkill,
    updateSkillLevel,
    uploadResumeFile,
    updateCareerPreferences,
    showToast,
    setActiveTab,
  } = useApp();

  // Basic Info Form State
  const [name, setName] = useState(studentProfile.name);
  const [headline, setHeadline] = useState(studentProfile.headline);
  const [bio, setBio] = useState(studentProfile.bio);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [location, setLocation] = useState(studentProfile.location);
  const [githubUrl, setGithubUrl] = useState(studentProfile.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(studentProfile.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(studentProfile.portfolioUrl || '');

  // Academic details
  const [college, setCollege] = useState(studentProfile.college);
  const [department, setDepartment] = useState(studentProfile.department);
  const [degree, setDegree] = useState(studentProfile.degree);
  const [batch, setBatch] = useState(studentProfile.batch);
  const [gpa, setGpa] = useState(studentProfile.gpa.toString());

  // Career Preferences
  const [targetRole, setTargetRole] = useState(
    studentProfile.careerPreferences?.targetRole || 'Full Stack Engineer'
  );
  const [expectedStipend, setExpectedStipend] = useState(
    studentProfile.careerPreferences?.expectedStipend || '$6,000 - $9,000 / mo'
  );
  const [workMode, setWorkMode] = useState<'Remote' | 'On-site' | 'Hybrid'>(
    studentProfile.careerPreferences?.workMode || 'Hybrid'
  );

  // Modals & UI States
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [selectedSkillForTest, setSelectedSkillForTest] = useState('TypeScript & JavaScript');

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');
  const [eduGpa, setEduGpa] = useState('');

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expType, setExpType] = useState<'Internship' | 'Full-time' | 'Research' | 'Contract'>('Internship');
  const [expLocation, setExpLocation] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Achievement Modal
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState<'Innovation Award' | 'Industry Recognition' | 'Publication' | 'Honor' | 'Open Source'>('Innovation Award');
  const [achIssuer, setAchIssuer] = useState('');
  const [achDate, setAchDate] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achLink, setAchLink] = useState('');

  // Skill Add Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'Frontend' | 'Backend' | 'AI / Data' | 'DevOps & Cloud' | 'Database' | 'Soft Skills'>('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  // Loading States for Asynchronous Operations
  const [isSavingBasicInfo, setIsSavingBasicInfo] = useState(false);
  const [isSubmittingEdu, setIsSubmittingEdu] = useState(false);
  const [isSubmittingExp, setIsSubmittingExp] = useState(false);
  const [isSubmittingAch, setIsSubmittingAch] = useState(false);
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);

  // File Upload Ref
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBasicInfo(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      updateStudentProfile({
        name,
        headline,
        bio,
        phone,
        location,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        college,
        department,
        degree,
        batch,
        gpa: parseFloat(gpa) || 3.8,
      });
      updateCareerPreferences({
        targetRole,
        expectedStipend,
        workMode,
        preferredLocations: ['San Francisco, CA', 'Seattle, WA', 'Remote'],
        openToRelocation: true,
      });
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to save profile changes. Please try again.', 'error');
    } finally {
      setIsSavingBasicInfo(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        updateStudentProfile({ avatar: event.target.result });
        showToast('Profile photo updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = typeof event.target?.result === 'string' ? event.target.result : '';
      uploadResumeFile(file.name, text || studentProfile.resumeText || '', URL.createObjectURL(file));
      showToast(`Uploaded ${file.name} to Student Profile!`);
    };
    reader.readAsText(file);
  };

  const handleCreateEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduInstitution || !eduDegree) {
      showToast('Please provide institution and degree name.', 'error');
      return;
    }
    setIsSubmittingEdu(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      addEducation({
        institution: eduInstitution,
        degree: eduDegree,
        fieldOfStudy: eduField || 'Computer Science',
        startDate: eduStart || '2022',
        endDate: eduEnd || '2026',
        gpa: eduGpa || '3.90',
        highlights: ['Academic Excellence Award', 'Relevant Coursework in Distributed Algorithms'],
      });
      setEduInstitution('');
      setEduDegree('');
      setEduField('');
      setEduStart('');
      setEduEnd('');
      setEduGpa('');
      setEduModalOpen(false);
      showToast('Education added successfully!', 'success');
    } catch (err) {
      showToast('Failed to add education.', 'error');
    } finally {
      setIsSubmittingEdu(false);
    }
  };

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole || !expCompany) {
      showToast('Please provide role and company name.', 'error');
      return;
    }
    setIsSubmittingExp(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      addExperience({
        role: expRole,
        company: expCompany,
        type: expType,
        location: expLocation || 'Remote / Hybrid',
        startDate: expStart || 'May 2025',
        endDate: expEnd || 'Aug 2025',
        isCurrent: !expEnd || expEnd.toLowerCase() === 'present',
        description: expDesc || 'Built scalable microservices and integrated AI models.',
        verifiedByCompany: true,
      });
      setExpRole('');
      setExpCompany('');
      setExpLocation('');
      setExpStart('');
      setExpEnd('');
      setExpDesc('');
      setExpModalOpen(false);
      showToast('Experience added successfully!', 'success');
    } catch (err) {
      showToast('Failed to add experience.', 'error');
    } finally {
      setIsSubmittingExp(false);
    }
  };

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle || !achIssuer) {
      showToast('Please provide title and issuer.', 'error');
      return;
    }
    setIsSubmittingAch(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      addAchievement({
        title: achTitle,
        category: achCategory,
        issuer: achIssuer,
        date: achDate || '2025',
        description: achDesc || 'Recognized for technical excellence.',
        link: achLink || 'https://edubridge.ai/award',
        badgeIcon: 'Award',
      });
      setAchTitle('');
      setAchIssuer('');
      setAchDate('');
      setAchDesc('');
      setAchLink('');
      setAchModalOpen(false);
      showToast('Achievement added successfully!', 'success');
    } catch (err) {
      showToast('Failed to add achievement.', 'error');
    } finally {
      setIsSubmittingAch(false);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      showToast('Please enter skill name.', 'error');
      return;
    }
    setIsSubmittingSkill(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      addSkillToStudent({
        name: newSkillName.trim(),
        category: newSkillCategory,
        level: newSkillLevel,
        verifiedScore: newSkillLevel === 'Expert' ? 95 : newSkillLevel === 'Advanced' ? 88 : 75,
        verifiedByFaculty: false,
      });
      setNewSkillName('');
      setSkillModalOpen(false);
      showToast('Skill added to profile!', 'success');
    } catch (err) {
      showToast('Failed to add skill.', 'error');
    } finally {
      setIsSubmittingSkill(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Banner & Photo Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white/30 shadow-2xl bg-gray-800"
            />
            <button
              id="upload-profile-photo-btn"
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="absolute inset-0 rounded-3xl bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
            >
              <Camera className="w-6 h-6 mb-1 text-white" />
              <span className="text-[11px] font-bold">Change Photo</span>
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Profile Header Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {studentProfile.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Student
              </span>
            </div>

            <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed max-w-2xl">
              {studentProfile.headline}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-blue-200 pt-1 font-normal">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                {studentProfile.college}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-300" />
                {studentProfile.location}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-lg tabular-nums">
                GPA: {studentProfile.gpa} / 4.0
              </span>
            </div>
          </div>

          {/* AI Metrics Badge */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1 shrink-0">
            <div className="text-xs font-medium text-blue-200">Readiness Score</div>
            <div className="text-3xl font-bold text-white tracking-tight tabular-nums">
              {studentProfile.industryReadinessScore}%
            </div>
            <div className="text-[10px] text-emerald-300 font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Top Tier Candidate
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Information Edit Form, Right = Credentials, Resume & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Comprehensive Personal & Academic Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Academic Details Card */}
          <form
            onSubmit={handleSaveBasicInfo}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                  Personal & Academic Details
                </h2>
              </div>
              <button
                type="submit"
                id="save-profile-btn"
                disabled={isSavingBasicInfo}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSavingBasicInfo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Executive Bio & Career Objective
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  University / College
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Department / Major
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Degree & Batch
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Cumulative GPA
                </label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" /> GitHub Profile
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-xs font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          </form>

          {/* Education Timeline Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                  Education Details
                </h3>
              </div>
              <button
                type="button"
                id="add-education-btn"
                onClick={() => setEduModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-xs transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-3">
              {(studentProfile.educations || []).map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 tabular-nums">
                        {edu.gpa}
                      </span>
                    </div>
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-300">
                      {edu.institution} • {edu.fieldOfStudy}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400">
                      {edu.startDate} – {edu.endDate}
                    </p>
                    {edu.highlights && edu.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-[11px] font-normal text-gray-500 dark:text-gray-400 pt-1 space-y-0.5">
                        {edu.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEducation(edu.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work & Internship History Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                  Experience & Internship History
                </h3>
              </div>
              <button
                type="button"
                id="add-experience-btn"
                onClick={() => setExpModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {studentProfile.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        {exp.type}
                      </span>
                      {exp.verifiedByCompany && (
                        <span className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Recruiter Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400">
                      {exp.startDate} – {exp.endDate}
                    </p>
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteExperience(exp.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Honors Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                  Achievements & Publications
                </h3>
              </div>
              <button
                type="button"
                id="add-achievement-btn"
                onClick={() => setAchModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-semibold text-xs transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Achievement
              </button>
            </div>

            <div className="space-y-3">
              {(studentProfile.achievements || []).map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {ach.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                        {ach.category}
                      </span>
                    </div>
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-300">
                      {ach.issuer} • {ach.date}
                    </p>
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAchievement(ach.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Resume Upload, Skills Manager & Career Goals */}
        <div className="space-y-6">
          {/* Resume Upload & ATS Score Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-sky-900/30 border border-indigo-200/70 dark:border-indigo-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                  Resume Document
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ATS Score: {studentProfile.atsResumeScore}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 text-xs space-y-2">
              <div className="flex items-center justify-between font-medium text-gray-900 dark:text-white truncate">
                <span className="truncate">{studentProfile.resumeFileName || 'Aarav_Patel_Resume.pdf'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
              </div>
              <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400">
                Uploaded: {studentProfile.resumeUploadedAt ? new Date(studentProfile.resumeUploadedAt).toLocaleDateString() : 'Active'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                id="upload-new-resume-btn"
                onClick={() => resumeInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleResumeUpload}
              />
              <button
                type="button"
                onClick={() => setActiveTab('ai_resume')}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 text-gray-700 dark:text-gray-200 font-semibold text-xs border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Analyze</span>
              </button>
            </div>
          </div>

          {/* Technical Skills & Verified Badges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                  Skills & Verified Badges
                </h3>
              </div>
              <button
                type="button"
                id="add-skill-modal-btn"
                onClick={() => setSkillModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Skill
              </button>
            </div>

            <div className="space-y-2.5">
              {studentProfile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {skill.verifiedScore && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 tabular-nums">
                          {skill.verifiedScore}% Verified
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id)}
                        className="p-1 text-gray-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    <span>{skill.category} • {skill.level}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkillForTest(skill.name);
                        setAssessmentModalOpen(true);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" /> Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Assessment Modal */}
      <SkillAssessmentModal
        initialSkill={selectedSkillForTest}
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
      />

      {/* Add Education Modal */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Add Education Entry</h3>
              <button onClick={() => setEduModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEducation} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Institution / College</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex National Institute of Technology"
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Degree</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science"
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Start Year</label>
                  <input
                    type="text"
                    placeholder="2022"
                    value={eduStart}
                    onChange={(e) => setEduStart(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">End Year</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={eduEnd}
                    onChange={(e) => setEduEnd(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">CGPA / Score</label>
                <input
                  type="text"
                  placeholder="3.91 / 4.00"
                  value={eduGpa}
                  onChange={(e) => setEduGpa(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingEdu}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingEdu ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Education...</span>
                  </>
                ) : (
                  <span>Save Education</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Add Work Experience</h3>
              <button onClick={() => setExpModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExperience} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Job Title / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering Intern"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NovaCloud Systems"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="text"
                    placeholder="May 2025"
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="text"
                    placeholder="Aug 2025 (or Present)"
                    value={expEnd}
                    onChange={(e) => setExpEnd(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Description & Impact</label>
                <textarea
                  rows={3}
                  placeholder="Key contributions and technical stack..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingExp}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingExp ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Experience...</span>
                  </>
                ) : (
                  <span>Save Experience</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Add Skill to Profile</h3>
              <button onClick={() => setSkillModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kubernetes, Python, Redis"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e: any) => setNewSkillCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI / Data">AI / Data</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Database">Database</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e: any) => setNewSkillLevel(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmittingSkill}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingSkill ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding Skill...</span>
                  </>
                ) : (
                  <span>Add Skill</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {achModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Add Achievement / Honor</h3>
              <button onClick={() => setAchModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAchievement} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place National Innovation Award"
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={achCategory}
                  onChange={(e: any) => setAchCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                >
                  <option value="Innovation Award">Innovation Award</option>
                  <option value="Industry Recognition">Industry Recognition</option>
                  <option value="Publication">Publication</option>
                  <option value="Honor">Honor</option>
                  <option value="Open Source">Open Source</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Issuing Body / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AICTE & Ministry of Education"
                  value={achIssuer}
                  onChange={(e) => setAchIssuer(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={2}
                  value={achDesc}
                  onChange={(e) => setAchDesc(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 font-normal"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingAch}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingAch ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Achievement...</span>
                  </>
                ) : (
                  <span>Save Achievement</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
