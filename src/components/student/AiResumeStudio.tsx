import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  aiService,
  FullResumeAnalysisResult,
  FullResumeOptimizeResult,
  JobMatchResult,
} from '../../services/aiService';
import { ResumeScorecards } from './resume/ResumeScorecards';
import { ResumeUploadCard } from './resume/ResumeUploadCard';
import { ResumeAnalysisView } from './resume/ResumeAnalysisView';
import { ResumeSuggestionsView } from './resume/ResumeSuggestionsView';
import { ResumeOptimizerView } from './resume/ResumeOptimizerView';
import { JobMatchView } from './resume/JobMatchView';
import { ResumePdfExportModal } from './resume/ResumePdfExportModal';
import { exportResumeAsPdf, ResumePdfOptions } from '../../utils/resumePdfExporter';
import {
  Sparkles,
  Upload,
  Download,
  Save,
  CheckCircle2,
  RefreshCw,
  FileText,
  Target,
  Sliders,
  Briefcase,
  Layers,
  ArrowRight,
  Settings2,
  Printer,
} from 'lucide-react';

const BENCHMARK_SAMPLE_RESUME = `Aarav Patel
Email: aarav.patel@techuniv.edu | Phone: +1 (555) 849-2910 | Location: San Jose, CA
GitHub: github.com/aaravpatel-tech | LinkedIn: linkedin.com/in/aaravpatel-cs | Portfolio: aaravpatel.dev

SUMMARY:
Results-driven Full-Stack Software Engineer with proven expertise building distributed event-driven systems and microservices in TypeScript, Next.js, and Node.js. Passionate about system latency optimization, cloud infrastructure, and integrating LLMs to deliver scalable enterprise products.

EDUCATION:
Apex National Institute of Technology — B.S. in Computer Science & Engineering (2022 - 2026)
GPA: 3.91 / 4.0 | Honors: Academic Excellence Fellowship, Dean's Honors List (All Semesters)
Coursework: Distributed Systems, Cloud Architecture, Database Engineering, Algorithms, Operating Systems

TECHNICAL SKILLS:
• Languages: TypeScript, JavaScript, Python, Go, C++, SQL
• Frontend: React 19, Next.js 15, Tailwind CSS, Redux Toolkit, Framer Motion
• Backend & Cloud: Node.js, Express, Docker, PostgreSQL, Redis Streams, GenAI APIs, GraphQL, REST APIs
• Infrastructure & DevOps: Git, GitHub Actions, Linux CLI, Postman, Jest, Playwright, Docker Compose
• Methodologies: System Design, CI/CD, Agile/Scrum, Test-Driven Development (TDD)

WORK EXPERIENCE:
NovaCloud Systems — Software Engineering Intern (May 2025 – Aug 2025)
• Architected and deployed a real-time telemetry streaming pipeline in Node.js and Redis, processing 5.2M+ daily event metrics with 99.95% system uptime.
• Decreased database P99 latency by 32% across PostgreSQL clusters by creating composite indexes and implementing connection pooling.
• Built 14 reusable frontend analytics dashboard components in Next.js 15 and Tailwind CSS, accelerating feature shipping speed by 25% for a 12-engineer team.
• Authored comprehensive end-to-end integration test suites with Playwright, elevating code coverage from 68% to 94%.

PROJECTS:
StreamPulse (Distributed Observability Engine | Live: streampulse.tech)
• Engineered a high-throughput event processing platform using TypeScript, WebSockets, and Redis Streams with sub-10ms browser update latency.
• Implemented sliding-window anomaly detection algorithms flagging latency spikes with 98.4% precision.
• Containerized the 3-tier microservice architecture using multi-stage Docker builds, trimming artifact footprint to under 88MB.

EduScribe (AI Lecture Transcriber & Note Synthesizer | Live: eduscribe.ai)
• Integrated Generative AI APIs with streaming responses to transcribe and structure audio lectures into interactive flashcards and quiz questions.
• Developed a vector similarity search engine using PostgreSQL pgvector to support semantic note retrieval in under 45ms.
• Successfully onboarded 3,400+ active student users across 8 university campus study circles.

HONORS & LEADERSHIP:
• Winner (1st of 120 teams) — National Innovation Challenge 2024: Engineered an automated cloud incident triage agent.
• Lead Technical Mentor — Google Developer Student Club (GDSC): Mentored 85+ junior engineers in TypeScript and full-stack development.`;

export const AiResumeStudio: React.FC = () => {
  const { studentProfile, updateStudentProfile, showToast, addSkillToStudent } = useApp();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'suggestions' | 'optimizer' | 'job-match' | 'document'>('overview');

  // Resume Document State
  const [fileName, setFileName] = useState('Aarav_Patel_FullStack_Resume.pdf');
  const [fileSize, setFileSize] = useState('142 KB');
  const [uploadedAt, setUploadedAt] = useState('Today at 10:15 AM');
  const [resumeText, setResumeText] = useState(BENCHMARK_SAMPLE_RESUME);

  // PDF Export States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // AI Operation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FullResumeAnalysisResult | null>(null);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<FullResumeOptimizeResult | null>(null);

  const [isMatching, setIsMatching] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);

  // Scores
  const [atsScore, setAtsScore] = useState<number>(studentProfile.atsResumeScore || 92);
  const [skillMatchScore, setSkillMatchScore] = useState<number>(88);
  const [resumeQualityScore, setResumeQualityScore] = useState<number>(94);
  const [industryReadinessScore, setIndustryReadinessScore] = useState<number>(
    studentProfile.industryReadinessScore || 90
  );

  // Initial Auto-Analysis on Mount if not analyzed yet
  useEffect(() => {
    let isMounted = true;
    const initialRun = async () => {
      try {
        const result = await aiService.analyzeResumeFull(resumeText, fileName);
        if (isMounted && result) {
          setAnalysisResult(result);
          setAtsScore(result.atsCompatibilityScore);
          setSkillMatchScore(Math.min(100, Math.round(result.skillsDetected.length * 5.5)));
          setResumeQualityScore(result.resumeQualityScore);
          setIndustryReadinessScore(result.industryReadinessScore);
        }
      } catch (e) {
        // Fallback gracefully handled
      }
    };
    initialRun();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      showToast('Please upload or enter a resume first.', 'error');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeResumeFull(resumeText, fileName);
      setAnalysisResult(result);
      setAtsScore(result.atsCompatibilityScore);
      setSkillMatchScore(Math.min(100, Math.round(result.skillsDetected.length * 5.5)));
      setResumeQualityScore(result.resumeQualityScore);
      setIndustryReadinessScore(result.industryReadinessScore);
      setActiveTab('analysis');
      showToast('AI ATS Analysis completed successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to analyze resume: ' + err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeResume = async () => {
    if (!resumeText.trim()) {
      showToast('Please upload or enter a resume before optimizing.', 'error');
      return;
    }
    setIsOptimizing(true);
    try {
      const result = await aiService.optimizeResume(resumeText, studentProfile.targetRole || 'Full Stack Engineer');
      setOptimizedResult(result);
      setActiveTab('optimizer');
      showToast('Resume optimized with Google XYZ metrics format!', 'success');
    } catch (err: any) {
      showToast('Failed to optimize resume: ' + err.message, 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleJobMatch = async (jobDesc: string, jobTitle: string) => {
    setIsMatching(true);
    try {
      const result = await aiService.matchResumeWithJob(resumeText, jobDesc, jobTitle);
      setJobMatchResult(result);
      showToast(`Job ATS match calculated: ${result.jobMatchPercentage}% match!`, 'success');
    } catch (err: any) {
      showToast('Failed to calculate job match: ' + err.message, 'error');
    } finally {
      setIsMatching(false);
    }
  };

  const handleApplyOptimizedToActive = (optimizedText: string) => {
    setResumeText(optimizedText);
    setFileName('Optimized_AI_Resume.txt');
    setFileSize(`${Math.round(optimizedText.length / 1024) || 1} KB`);
    setUploadedAt('Just now (AI Optimized)');
    showToast('Applied AI optimized content as active resume!', 'success');
    // Also refresh the scorecard
    setAtsScore((prev) => Math.min(99, prev + 6));
    setResumeQualityScore((prev) => Math.min(100, prev + 5));
    setIndustryReadinessScore((prev) => Math.min(99, prev + 4));
  };

  const handleDownloadResume = (contentToDownload?: string) => {
    const text = contentToDownload || (optimizedResult ? optimizedResult.optimizedContent : resumeText);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '_AI_Optimized.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Resume downloaded successfully (plain text)!', 'success');
  };

  /**
   * Exports the generated AI resume as a formatted PDF for professional use
   */
  const handleExportPdf = (
    contentToExport?: string,
    options?: Partial<ResumePdfOptions>
  ) => {
    setIsExportingPdf(true);
    try {
      const text = contentToExport || (optimizedResult ? optimizedResult.optimizedContent : resumeText);
      if (!text.trim()) {
        showToast('Please enter or upload resume content before exporting.', 'error');
        setIsExportingPdf(false);
        return;
      }

      const defaultCandidateName = studentProfile.name || 'Candidate';
      const targetFileName = options?.fileName || (
        optimizedResult && !contentToExport
          ? 'Optimized_AI_Resume.pdf'
          : fileName.replace(/\.[^/.]+$/, '') + '_AI_Professional.pdf'
      );

      const result = exportResumeAsPdf(text, {
        candidateName: defaultCandidateName,
        fileName: targetFileName,
        paperSize: 'letter',
        accentTheme: 'navy',
        ...options,
      });

      if (result.success) {
        showToast(`Exported "${result.fileName}" formatted PDF successfully!`, 'success');
      } else {
        showToast(`Failed to export PDF: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Error exporting PDF: ${err.message || err}`, 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSyncToProfile = () => {
    if (!analysisResult) {
      showToast('Please run resume analysis first.', 'error');
      return;
    }

    updateStudentProfile({
      atsResumeScore: atsScore,
      industryReadinessScore: industryReadinessScore,
      bio: analysisResult.actionableSuggestions.summary,
      headline: analysisResult.actionableSuggestions.summary.slice(0, 110),
    });

    // Add detected skills to user profile
    let addedCount = 0;
    analysisResult.skillsDetected.forEach((s) => {
      const exists = studentProfile.skills.some(
        (existing) => existing.name.toLowerCase() === s.name.toLowerCase()
      );
      if (!exists) {
        addSkillToStudent({
          name: s.name,
          category: s.category || 'Technical',
          level: 'Advanced',
          verifiedScore: s.matchScore || 85,
        });
        addedCount++;
      }
    });

    showToast(
      `Saved! Synced ${atsScore}% ATS score, readiness rating, and ${addedCount} new skills to your official profile.`,
      'success'
    );
  };

  const handleResetToBenchmarkSample = () => {
    setResumeText(BENCHMARK_SAMPLE_RESUME);
    setFileName('Aarav_Patel_FullStack_Resume.pdf');
    setFileSize('142 KB');
    setUploadedAt('Just now');
    showToast('Loaded benchmark tech resume template!', 'info');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Action Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI ATS Intelligence
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white">
            AI Resume Studio
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Enterprise applicant tracking system (ATS) scanner, Google XYZ bullet optimizer, and job-tailoring engine for top-tier tech placements.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="top-upload-resume-btn"
            onClick={() => setActiveTab('document')}
            className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Resume</span>
          </button>

          <button
            id="top-analyze-resume-btn"
            onClick={handleAnalyzeResume}
            disabled={isAnalyzing}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Resume</span>
              </>
            )}
          </button>

          <button
            id="top-optimize-resume-btn"
            onClick={handleOptimizeResume}
            disabled={isOptimizing}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>Optimize My Resume</span>
              </>
            )}
          </button>

          {/* Export Formatted PDF Button Group */}
          <div className="inline-flex items-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all">
            <button
              id="top-export-pdf-resume-btn"
              onClick={() => handleExportPdf()}
              disabled={isExportingPdf || !resumeText.trim()}
              className="px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Export formatted ATS-compliant PDF for professional use"
            >
              {isExportingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </>
              )}
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              id="top-export-pdf-options-btn"
              onClick={() => setIsExportModalOpen(true)}
              className="px-2 py-2 text-white/80 hover:text-white cursor-pointer"
              title="Configure PDF format, paper size & styling"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="top-download-resume-btn"
            onClick={() => handleDownloadResume()}
            className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download plain text (.txt)"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>TXT</span>
          </button>

          <button
            id="top-save-changes-btn"
            onClick={handleSyncToProfile}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Scorecards: ATS Score, Skill Match, Resume Quality, Industry Readiness */}
      <ResumeScorecards
        atsScore={atsScore}
        skillMatch={skillMatchScore}
        resumeQuality={resumeQualityScore}
        industryReadiness={industryReadinessScore}
      />

      {/* Primary Studio Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100/90 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 overflow-x-auto">
        <button
          id="tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs border border-gray-200 dark:border-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-blue-600" />
          <span>Dashboard & Overview</span>
        </button>

        <button
          id="tab-analysis"
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'analysis'
              ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs border border-gray-200 dark:border-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Full ATS Analysis ({analysisResult?.overallScore || atsScore}%)</span>
        </button>

        <button
          id="tab-suggestions"
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'suggestions'
              ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs border border-gray-200 dark:border-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>8 AI Improvement Vectors</span>
        </button>

        <button
          id="tab-optimizer"
          onClick={() => setActiveTab('optimizer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'optimizer'
              ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs border border-gray-200 dark:border-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-600" />
          <span>Optimize & Before/After Diff</span>
        </button>

        <button
          id="tab-job-match"
          onClick={() => setActiveTab('job-match')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'job-match'
              ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs border border-gray-200 dark:border-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Job-Specific ATS Match</span>
        </button>

        <button
          id="tab-document"
          onClick={() => setActiveTab('document')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'document'
              ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs border border-gray-200 dark:border-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Resume Document & Upload</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Upload Card */}
          <ResumeUploadCard
            fileName={fileName}
            fileSize={fileSize}
            uploadedAt={uploadedAt}
            resumeText={resumeText}
            onResumeChange={(newText, newName, newSize) => {
              setResumeText(newText);
              setFileName(newName);
              if (newSize) setFileSize(newSize);
              setUploadedAt('Just now');
            }}
            onAnalyzeClick={handleAnalyzeResume}
            isAnalyzing={isAnalyzing}
            onResetToSample={handleResetToBenchmarkSample}
            showToast={showToast}
          />

          {/* Quick CTA to Full Analysis or Optimizer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('analysis')}
              className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  <Target className="w-4 h-4" />
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-black dark:text-white">
                Detailed ATS Scoring & Skills
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1 leading-relaxed">
                Review verified skill tags, missing competencies, and experience bullet ratings.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('suggestions')}
              className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-black dark:text-white">
                8 AI Improvement Dimensions
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1 leading-relaxed">
                Summary rewrite, project highlights, keyword frequency, and formatting recommendations.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('optimizer')}
              className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Sliders className="w-4 h-4" />
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-black dark:text-white">
                Google XYZ Resume Optimizer
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1 leading-relaxed">
                One-click rewrite producing quantified before/after diffs and direct resume download.
              </p>
            </div>
          </div>

          {/* Inline Analysis View Preview if ready */}
          {analysisResult && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Latest Resume Audit Snapshot
                </h3>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <ResumeAnalysisView
                analysis={analysisResult}
                onRunAnalysis={handleAnalyzeResume}
                isAnalyzing={isAnalyzing}
                onApplySkillsToProfile={handleSyncToProfile}
              />
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: FULL ATS ANALYSIS */}
      {activeTab === 'analysis' && (
        <ResumeAnalysisView
          analysis={analysisResult}
          onRunAnalysis={handleAnalyzeResume}
          isAnalyzing={isAnalyzing}
          onApplySkillsToProfile={handleSyncToProfile}
        />
      )}

      {/* TAB CONTENT 3: 8 AI IMPROVEMENT SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <ResumeSuggestionsView
          analysis={analysisResult}
          onRunAnalysis={handleAnalyzeResume}
          isAnalyzing={isAnalyzing}
          onApplySummary={(suggestedSummary) => {
            // Prepend or update summary in resume text
            setResumeText((prev) => {
              const lines = prev.split('\n');
              const summaryIdx = lines.findIndex((l) => l.trim().startsWith('SUMMARY:'));
              if (summaryIdx !== -1) {
                lines[summaryIdx + 1] = suggestedSummary;
                return lines.join('\n');
              }
              return `SUMMARY:\n${suggestedSummary}\n\n${prev}`;
            });
            showToast('Applied AI summary into your active resume document!', 'success');
          }}
          showToast={showToast}
        />
      )}

      {/* TAB CONTENT 4: RESUME OPTIMIZER & DIFF */}
      {activeTab === 'optimizer' && (
        <ResumeOptimizerView
          originalContent={resumeText}
          optimizedResult={optimizedResult}
          onOptimize={handleOptimizeResume}
          isOptimizing={isOptimizing}
          onApplyOptimized={handleApplyOptimizedToActive}
          onDownloadOptimized={(txt) => handleDownloadResume(txt)}
          onExportPdfOptimized={(optTxt) =>
            handleExportPdf(optTxt, { fileName: 'Optimized_AI_Resume.pdf' })
          }
          showToast={showToast}
        />
      )}

      {/* TAB CONTENT 5: JOB-SPECIFIC ATS MATCH */}
      {activeTab === 'job-match' && (
        <JobMatchView
          resumeText={resumeText}
          onRunJobMatch={handleJobMatch}
          isMatching={isMatching}
          matchResult={jobMatchResult}
          showToast={showToast}
        />
      )}

      {/* TAB CONTENT 6: DOCUMENT & LIVE EDITOR */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          <ResumeUploadCard
            fileName={fileName}
            fileSize={fileSize}
            uploadedAt={uploadedAt}
            resumeText={resumeText}
            onResumeChange={(newText, newName, newSize) => {
              setResumeText(newText);
              setFileName(newName);
              if (newSize) setFileSize(newSize);
              setUploadedAt('Just now');
            }}
            onAnalyzeClick={handleAnalyzeResume}
            isAnalyzing={isAnalyzing}
            onResetToSample={handleResetToBenchmarkSample}
            onExportPdf={() => handleExportPdf()}
            showToast={showToast}
          />
        </div>
      )}

      {/* Export Formatted PDF Modal */}
      <ResumePdfExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        resumeText={optimizedResult ? optimizedResult.optimizedContent : resumeText}
        defaultCandidateName={studentProfile.name || 'Aarav Patel'}
        defaultFileName={
          optimizedResult
            ? 'Optimized_AI_Resume.pdf'
            : fileName.replace(/\.[^/.]+$/, '') + '_AI_Professional.pdf'
        }
        showToast={showToast}
      />
    </div>
  );
};
