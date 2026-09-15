import React, { useState } from 'react';
import { FullResumeOptimizeResult } from '../../../services/aiService';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  FileText,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  FileCheck,
  Split,
  Eye,
} from 'lucide-react';

interface ResumeOptimizerViewProps {
  originalContent: string;
  optimizedResult: FullResumeOptimizeResult | null;
  onOptimize: () => void;
  isOptimizing: boolean;
  onApplyOptimized: (optimizedText: string) => void;
  onDownloadOptimized: (text: string) => void;
  onExportPdfOptimized?: (text: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResumeOptimizerView: React.FC<ResumeOptimizerViewProps> = ({
  originalContent,
  optimizedResult,
  onOptimize,
  isOptimizing,
  onApplyOptimized,
  onDownloadOptimized,
  onExportPdfOptimized,
  showToast,
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'side-by-side' | 'full-improved'>('diff');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied optimized resume to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with "Optimize My Resume" Call-to-Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20 dark:border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Google XYZ Optimizer
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-black dark:text-white">
            AI Resume Content Optimization
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Rewrites passive statements into: "Accomplished [X] as measured by [Y], by doing [Z]". Enhances technical keywords, tightens spacing, and produces an interview-ready document.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="optimize-my-resume-action-btn"
            onClick={onOptimize}
            disabled={isOptimizing}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Optimizing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Optimize My Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {optimizedResult ? (
        <div className="space-y-6">
          {/* Summary of Improvements Row */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-black dark:text-white">
                  Enhancement Summary (+{optimizedResult.estimatedScoreIncrease}% Estimated ATS Increase)
                </h3>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setViewMode('diff')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'diff'
                      ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black'
                  }`}
                >
                  Before/After Highlights
                </button>
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'side-by-side'
                      ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black'
                  }`}
                >
                  Side-by-Side View
                </button>
                <button
                  onClick={() => setViewMode('full-improved')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'full-improved'
                      ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black'
                  }`}
                >
                  Full AI Content
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {optimizedResult.improvementsSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-medium text-black dark:text-gray-200 flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VIEW MODE 1: DIFF HIGHLIGHTS */}
          {viewMode === 'diff' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black dark:text-white">
                Granular Section Improvements
              </h3>

              <div className="space-y-4">
                {optimizedResult.diffHighlights.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                        {diff.section}
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        XYZ Pattern Upgrade
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before */}
                      <div className="p-3.5 rounded-xl bg-red-50/40 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 space-y-1">
                        <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                          Original Content (Passive)
                        </span>
                        <p className="text-xs text-gray-800 dark:text-gray-300 font-normal whitespace-pre-line leading-relaxed">
                          {diff.before}
                        </p>
                      </div>

                      {/* After */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                          AI Improved (XYZ Impact & Metrics)
                        </span>
                        <p className="text-xs text-black dark:text-white font-medium whitespace-pre-line leading-relaxed">
                          {diff.after}
                        </p>
                      </div>
                    </div>

                    {/* Rationale */}
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-normal italic pt-1 border-t border-gray-100 dark:border-white/5">
                      💡 Why this works: {diff.improvementRationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: SIDE BY SIDE */}
          {viewMode === 'side-by-side' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Content */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-bold text-black dark:text-white">
                    Original Resume Content
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">As Uploaded</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-mono text-xs text-black dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {originalContent || 'No original resume text available.'}
                </div>
              </div>

              {/* AI Improved Content */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-emerald-300/80 dark:border-emerald-800/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Optimized Resume Content
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ATS Calibrated
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/40 font-mono text-xs text-black dark:text-gray-100 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {optimizedResult.optimizedContent}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: FULL AI CONTENT */}
          {viewMode === 'full-improved' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-gray-200 dark:border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    Complete AI Rewritten Resume Document
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-0.5">
                    Ready for single-click copying, direct download, or application to profile.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(optimizedResult.optimizedContent)}
                    className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                  {onExportPdfOptimized && (
                    <button
                      id="export-pdf-optimized-btn"
                      onClick={() => onExportPdfOptimized(optimizedResult.optimizedContent)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Export AI-optimized resume as formatted PDF"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDownloadOptimized(optimizedResult.optimizedContent)}
                    className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download TXT</span>
                  </button>
                  <button
                    onClick={() => onApplyOptimized(optimizedResult.optimizedContent)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apply to Active Resume</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-mono text-xs text-black dark:text-gray-100 whitespace-pre-wrap leading-relaxed max-h-[550px] overflow-y-auto">
                {optimizedResult.optimizedContent}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-700 dark:text-gray-300 font-normal">
              Applying this optimized content updates your resume document and triggers an updated ATS scorecard.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(optimizedResult.optimizedContent)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#121316] hover:bg-gray-100 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              {onExportPdfOptimized && (
                <button
                  id="bottom-export-pdf-optimized-btn"
                  onClick={() => onExportPdfOptimized(optimizedResult.optimizedContent)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export AI-optimized resume as formatted PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              )}
              <button
                onClick={() => onDownloadOptimized(optimizedResult.optimizedContent)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#121316] hover:bg-gray-100 border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Download</span>
              </button>
              <button
                id="apply-optimized-resume-btn"
                onClick={() => onApplyOptimized(optimizedResult.optimizedContent)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply to Active Resume</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">
              Ready to Generate Your Optimized Resume
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-md mx-auto font-normal">
              Click "Optimize My Resume" above to let Gemini rewrite your resume with high-impact action verbs, quantifiable metrics, and verified ATS keywords.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
