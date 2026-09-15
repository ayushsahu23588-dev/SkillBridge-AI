import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Award,
  Github,
  ExternalLink,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Mail,
  Copy,
  Layers,
  Code2,
  FileText,
} from 'lucide-react';

export const DigitalPortfolioPage: React.FC = () => {
  const { studentProfile, showToast, navigate } = useApp();
  const [copied, setCopied] = useState(false);

  const shareableUrl = `https://skillbridge.ai/portfolio/${studentProfile.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    showToast('Public portfolio URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadResume = () => {
    showToast('Downloading verified SkillBridge academic resume (PDF)...', 'success');
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      {/* Top Banner & Action Controls */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#84B000] dark:to-[#D4F73C] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-white/30 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {studentProfile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4F73C] text-[#111216]">
                  Verified Student
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                {studentProfile.department} • {studentProfile.college}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 mt-2">
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{studentProfile.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Batch of {studentProfile.batch} • CGPA {studentProfile.gpa}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <button
              id="portfolio-share-btn"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs shadow-sm hover:bg-gray-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
            </button>
            <button
              id="portfolio-download-resume-btn"
              onClick={handleDownloadResume}
              className="px-4 py-2.5 rounded-xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Scorecard Overview */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#84B000] dark:text-[#D4F73C]" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              AI Assessment Scorecard
            </h2>
          </div>
          <button
            onClick={() => navigate('/student/assessment')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Retake Diagnostic
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
            <span className="text-xs text-gray-400 font-semibold">Overall Readiness</span>
            <div className="text-3xl font-black text-[#4D7C0F] dark:text-[#D4F73C] mt-1 tabular-nums">
              88%
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
            <span className="text-xs text-gray-400 font-semibold">Technical Score</span>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
              84%
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
            <span className="text-xs text-gray-400 font-semibold">Aptitude & Logic</span>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
              90%
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
            <span className="text-xs text-gray-400 font-semibold">ATS Compatibility</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              93%
            </div>
          </div>
        </div>
      </div>

      {/* Verified Skill Badges */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Verified Skill Badges</span>
        </h2>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {studentProfile.skills.map((skill, idx) => (
            <div
              key={idx}
              className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{skill.name}</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C]">
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects with GitHub Links */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-500" />
            <span>Completed Projects & Code Repositories</span>
          </h2>
          <span className="text-xs text-gray-400 font-semibold">GitHub Sync Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {studentProfile.projects.map((proj, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {proj.title}
                  </h3>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {(proj.techStack || (proj as any).technologies || []).map((t: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 text-[10px] font-bold text-gray-600 dark:text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-500" />
          <span>Industry Certifications & Credentials</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {studentProfile.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  {cert.title}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {cert.issuer} • Issued {cert.issueDate}
                </p>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Credential ID: {cert.credentialId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
