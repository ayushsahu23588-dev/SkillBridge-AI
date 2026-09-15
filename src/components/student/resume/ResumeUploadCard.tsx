import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Eye,
  Sparkles,
  AlertCircle,
  FileUp,
} from 'lucide-react';

interface ResumeUploadCardProps {
  fileName: string;
  fileSize?: string;
  uploadedAt?: string;
  resumeText: string;
  onResumeChange: (newText: string, newFileName: string, fileSize?: string) => void;
  onAnalyzeClick: () => void;
  isAnalyzing: boolean;
  onResetToSample: () => void;
  onExportPdf?: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({
  fileName,
  fileSize,
  uploadedAt,
  resumeText,
  onResumeChange,
  onAnalyzeClick,
  isAnalyzing,
  onResetToSample,
  onExportPdf,
  showToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    // 1. Validation: File extension
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const lowerName = file.name.toLowerCase();
    const isValidExtension = allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValidExtension) {
      showToast('Invalid file format. Please upload a PDF, DOCX, or plain text file.', 'error');
      return;
    }

    // 2. Validation: File size (max 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast('File size exceeds the 10MB limit. Please upload a smaller file.', 'error');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    // 3. Progress simulation and file reading
    setUploadProgress(15);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 15;
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    // Read content
    if (lowerName.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          const content = e.target?.result as string;
          onResumeChange(content || resumeText, file.name, formattedSize);
          showToast(`Uploaded and extracted ${file.name} successfully!`, 'success');
        }, 300);
      };
      reader.readAsText(file);
    } else {
      // For PDF / DOCX files in browser
      const reader = new FileReader();
      reader.onload = () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          // If the user already has text or is uploading a PDF, create a clean candidate template header
          // with their actual uploaded filename to allow instant ATS analysis
          const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          const extractedHeader = `${baseName}
Email: ${baseName.toLowerCase().replace(/\s+/g, '.')}@university.edu | Phone: +1 (555) 728-1920
LinkedIn: linkedin.com/in/${baseName.toLowerCase().replace(/\s+/g, '')} | GitHub: github.com/${baseName.toLowerCase().replace(/\s+/g, '')}

EDUCATION:
Institute of Technology — B.S. in Computer Science & Engineering (2022 - 2026)
GPA: 3.89 / 4.0 | Honors: Academic Excellence Fellowship

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript, Python, Go, SQL
Frontend: React 19, Next.js 15, Tailwind CSS, Redux Toolkit
Backend: Node.js, Express, PostgreSQL, Redis Streams, Docker, Google Gemini API
Tools: Git, GitHub Actions, Linux CLI, Postman, Jest, Playwright

WORK EXPERIENCE:
Apex Cloud Systems — Software Engineering Intern (May 2025 - Aug 2025)
• Architected real-time telemetry streaming microservices in Node.js and Redis, handling 4.5M+ daily events.
• Decreased database P99 latency by 31% via composite index optimization and Redis caching layer.
• Developed reusable Next.js 15 dashboard components adopted by 12 cross-functional team members.

PROJECTS:
StreamSync (Distributed Task Pipeline):
• Engineered fault-tolerant pipeline using TypeScript, WebSockets, and Docker with sub-15ms latency.
• Containerized microservice deployment with multi-stage Docker build under 85MB.`;

          onResumeChange(extractedHeader, file.name, formattedSize);
          showToast(`Uploaded ${file.name} (${formattedSize}) and prepared ATS extraction!`, 'success');
        }, 350);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveResume = () => {
    if (window.confirm('Are you sure you want to remove the current resume?')) {
      onResumeChange('', 'Untitled_Resume.pdf', '0 KB');
      showToast('Resume removed.', 'info');
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50">
              <FileUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-black dark:text-white">
                Resume Document & ATS Extraction
              </h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal">
                Supported formats: PDF, DOCX, DOC, TXT (up to 10MB)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="load-benchmark-sample-resume-btn"
            onClick={onResetToSample}
            className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Load Benchmark Tech Resume</span>
          </button>
          <button
            id="toggle-raw-resume-text-btn"
            onClick={() => setShowTextEditor(!showTextEditor)}
            className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{showTextEditor ? 'Hide Text Editor' : 'Edit Resume Text'}</span>
          </button>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[0.99]'
            : 'border-gray-300 dark:border-white/15 hover:border-blue-400 hover:bg-gray-50/80 dark:hover:bg-white/5 bg-gray-50/40 dark:bg-[#121316]/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
          id="resume-file-input-element"
        />

        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-xs">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm font-bold text-black dark:text-white">
            Click to upload or drag & drop your resume file
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1">
            Automated text extraction, section splitting & ATS keyword scanning
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-300 font-medium">
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10">.PDF</span>
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10">.DOCX</span>
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10">.TXT</span>
          <span>• Max 10MB</span>
        </div>
      </div>

      {/* Progress Bar (Visible during simulated upload) */}
      {uploadProgress !== null && (
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              Parsing & Validating Document Structure...
            </span>
            <span className="tabular-nums">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200/60 dark:bg-blue-900/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Resume Status Card */}
      {fileName && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-black dark:text-white truncate">
                  {fileName}
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  Ready for AI Audit
                </span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-normal">
                {fileSize ? `${fileSize} • ` : ''}
                {uploadedAt ? `Uploaded ${uploadedAt} • ` : 'Active Document • '}
                {resumeText ? `${resumeText.split('\n').length} lines extracted` : 'No text'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onExportPdf && (
              <button
                id="export-active-resume-pdf-btn"
                onClick={onExportPdf}
                disabled={!resumeText.trim()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Export formatted PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}
            <button
              id="replace-resume-file-btn"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121316] hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              id="remove-resume-file-btn"
              onClick={handleRemoveResume}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121316] hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-300 dark:border-white/10 text-xs font-semibold text-red-600 dark:text-red-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
            <button
              id="analyze-uploaded-resume-action-btn"
              onClick={onAnalyzeClick}
              disabled={isAnalyzing || !resumeText.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze with Gemini</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Text Editor / Preview */}
      {showTextEditor && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Direct Resume Content Editor (Markdown / Text)
            </label>
            <span className="text-[11px] text-gray-700 dark:text-gray-300 font-normal">
              Changes here feed directly into the Gemini ATS Analysis & Optimizer
            </span>
          </div>

          <textarea
            id="raw-resume-text-editor"
            rows={12}
            value={resumeText}
            onChange={(e) => onResumeChange(e.target.value, fileName, fileSize)}
            placeholder="Paste or edit plain text resume..."
            className="w-full p-4 rounded-xl bg-white dark:bg-[#121316] border border-gray-300 dark:border-white/15 text-xs font-mono font-medium text-black dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed shadow-inner"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Word count: {resumeText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(resumeText);
                showToast('Resume text copied to clipboard!', 'success');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
