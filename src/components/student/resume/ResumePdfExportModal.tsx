import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  Sparkles,
  CheckCircle2,
  Settings2,
  RefreshCw,
  Palette,
  FileCheck,
} from 'lucide-react';
import {
  exportResumeAsPdf,
  parseResumeText,
  ResumePdfOptions,
} from '../../../utils/resumePdfExporter';

interface ResumePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  defaultCandidateName: string;
  defaultFileName: string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResumePdfExportModal: React.FC<ResumePdfExportModalProps> = ({
  isOpen,
  onClose,
  resumeText,
  defaultCandidateName,
  defaultFileName,
  showToast,
}) => {
  const [candidateName, setCandidateName] = useState(defaultCandidateName);
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
  const [accentTheme, setAccentTheme] = useState<'navy' | 'slate' | 'emerald' | 'indigo'>('navy');
  const [customFileName, setCustomFileName] = useState(
    defaultFileName.replace(/\.[^/.]+$/, '') + '_AI_Professional.pdf'
  );
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const parsed = parseResumeText(resumeText, candidateName);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const options: ResumePdfOptions = {
        candidateName: candidateName.trim() || defaultCandidateName,
        fileName: customFileName.trim() || defaultFileName,
        paperSize,
        accentTheme,
      };

      const result = exportResumeAsPdf(resumeText, options);

      if (result.success) {
        showToast(`Successfully generated and downloaded "${result.fileName}"!`, 'success');
        onClose();
      } else {
        showToast(`Failed to export PDF: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Export error: ${err.message || err}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
                Export Professional Resume PDF
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  ATS-Compliant
                </span>
              </h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal">
                Formatted vector PDF with structured sections, typography, and page numbers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Audit Box */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-black dark:text-white">
                  {parsed.sections.length} Detected Sections Ready for Formatting
                </p>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 font-normal mt-0.5">
                  {parsed.sections.map((s) => s.title).join(' • ')}
                </p>
              </div>
            </div>
          </div>

          {/* Form Options */}
          <div className="space-y-4">
            {/* Candidate Display Name */}
            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                Candidate Name on Header
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Aarav Patel"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:border-blue-500 font-medium"
              />
            </div>

            {/* Accent Theme Selection */}
            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>Header & Divider Accent Theme</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'navy', label: 'Tech Navy', color: 'bg-blue-800' },
                  { id: 'slate', label: 'Executive Slate', color: 'bg-slate-800' },
                  { id: 'emerald', label: 'Emerald Green', color: 'bg-emerald-700' },
                  { id: 'indigo', label: 'Modern Indigo', color: 'bg-indigo-700' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccentTheme(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      accentTheme === item.id
                        ? 'border-blue-600 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  Paper Standard
                </label>
                <div className="flex rounded-xl bg-gray-100 dark:bg-white/5 p-1 border border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setPaperSize('letter')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      paperSize === 'letter'
                        ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    US Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize('a4')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      paperSize === 'a4'
                        ? 'bg-white dark:bg-[#181920] text-black dark:text-white shadow-xs'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    A4 (International)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  File Name
                </label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Feature checklist */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-1.5 text-[11px] text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Vector typography (selectable & indexable by ATS parsers)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Standardized margins & automated multi-page headers/footers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Right-aligned employment dates and clean indented bullet points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="modal-confirm-export-pdf-btn"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Document...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Formatted PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
