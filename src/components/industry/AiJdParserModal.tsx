import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Upload,
  Layers,
  Copy,
  Zap,
} from 'lucide-react';
import { skillBridgeEngine } from '../../services/skillBridgeIntelligenceEngine';
import { JdParsedResult } from '../../types';

interface AiJdParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedData: (data: JdParsedResult) => void;
}

const SAMPLE_RAW_JD = `NovaCloud Systems Campus Hiring 2026
Role: Associate Cloud & Distributed Systems Engineer
Location: Bangalore (Hybrid)
Compensation: ₹14.5 LPA - ₹18.0 LPA (with ₹1.5L Joining Bonus)

About the Role:
We are recruiting final year engineering talent for our core cloud infrastructure teams. You will design, develop, and operate high-scale REST and gRPC microservices, implement distributed event queues, and write robust automated test suites.

Eligibility Criteria:
- Degree: B.Tech / B.E. graduating class of 2026
- Eligible Disciplines: Computer Science & Engineering, Information Technology, Data Science
- Academic Cutoff: Minimum 7.5 CGPA throughout with 0 active backlogs
- Prior internship or verified GitHub capstones are highly desirable

Required Technical Skills:
- Hands-on coding in TypeScript, Node.js, Python, or Go
- Relational database design in PostgreSQL and caching with Redis
- Familiarity with containerization using Docker and Linux CLI
- Understanding of basic CI/CD workflows and Git

Selection Process:
1. Online Algorithmic & Aptitude Screening Test
2. Technical System Design & Live Coding Round
3. Engineering Leadership & Behavioral Interview`;

export const AiJdParserModal: React.FC<AiJdParserModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedData,
}) => {
  const [rawText, setRawText] = useState(SAMPLE_RAW_JD);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<JdParsedResult | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      const result = skillBridgeEngine.parseJobDescriptionWithAI(rawText);
      setParsedResult(result);
      setIsParsing(false);
    }, 450);
  };

  const handleApply = () => {
    if (parsedResult) {
      onApplyParsedData(parsedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                Recruiter Intelligence Tool
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                AI Job Description (JD) Parser
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Extract skills, CGPA cutoffs, eligible branches, and compensation parameters from any recruiter JD.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Raw Text Input */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Paste Raw Job Description</span>
              </label>
              <button
                onClick={() => setRawText(SAMPLE_RAW_JD)}
                className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Load Sample Enterprise JD
              </button>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={14}
              placeholder="Paste raw JD text from email, PDF or document..."
              className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed resize-none"
            />

            <button
              onClick={handleParse}
              disabled={isParsing || !rawText.trim()}
              className="w-full py-3 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isParsing ? 'Analyzing & Extracting...' : 'Extract Parameters with AI'}</span>
            </button>
          </div>

          {/* Right Column: Extracted Entities Preview */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Extracted Parameters Preview
            </h3>

            {parsedResult ? (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3.5 text-xs">
                {/* Title & Drive Type */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-200 dark:border-white/5 pb-2.5">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Role Title</span>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                      {parsedResult.title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-[11px]">
                    {parsedResult.driveType}
                  </span>
                </div>

                {/* Required Skills */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                    Extracted Required Skills ({parsedResult.requiredSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedResult.requiredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium">Min CGPA</span>
                    <p className="font-black text-gray-900 dark:text-white">{parsedResult.minCgpa} Cutoff</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium">Max Backlogs</span>
                    <p className="font-black text-gray-900 dark:text-white">{parsedResult.allowedBacklogs} Backlog</p>
                  </div>
                </div>

                {/* Target Branches */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                    Eligible Branches
                  </span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {parsedResult.eligibleBranches.join(', ')}
                  </p>
                </div>

                {/* Compensation & Workplace */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-gray-400">Package / Stipend:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{parsedResult.salaryOrStipend}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Workplace & City:</span>
                    <p className="font-bold">{parsedResult.workplaceType} • {parsedResult.location}</p>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full mt-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply to Drive Creation Form</span>
                </button>
              </div>
            ) : (
              <div className="h-64 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                <FileText className="w-8 h-8 mb-2 opacity-40 text-purple-500" />
                <p className="text-xs font-semibold">Ready to parse recruiter JD</p>
                <p className="text-[11px] mt-1 max-w-xs">
                  Click 'Extract Parameters with AI' to automatically parse skills, eligibility, CGPA, and branch requirements.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
