import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import { PortfolioReviewData, ResumeGuidanceData } from '../../services/aiFallbackService';
import { AILoadingState } from './AILoadingState';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Download,
  BookOpen,
} from 'lucide-react';

interface AIPortfolioReviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPortfolioReview: React.FC<AIPortfolioReviewProps> = ({ isOpen, onClose }) => {
  const { studentProfile, updateStudentProfile, showToast } = useApp();
  const [data, setData] = useState<PortfolioReviewData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeGuidanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'resume'>('portfolio');

  React.useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [p, r] = await Promise.all([
          geminiService.improvePortfolio(studentProfile),
          geminiService.generateResumeGuidance(studentProfile),
        ]);
        if (mounted) {
          setData(p);
          setResumeData(r);
        }
      } catch {
        // handled via fallback
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isOpen, studentProfile]);

  if (!isOpen) return null;

  const handleApplySuggestion = (sug: NonNullable<PortfolioReviewData['sectionSuggestions']>[0]) => {
    if (!data) return;

    if (sug.section === 'about') {
      updateStudentProfile({ headline: sug.suggestedContent });
    } else if (sug.section === 'projects' && studentProfile.projects?.length) {
      const updatedProjects = [...studentProfile.projects];
      updatedProjects[0] = { ...updatedProjects[0], description: sug.suggestedContent };
      updateStudentProfile({ projects: updatedProjects });
    }

    // Mark suggestion applied
    setData({
      ...data,
      sectionSuggestions: data.sectionSuggestions.map((s) =>
        s.id === sug.id ? { ...s, applied: true } : s
      ),
    });
    showToast(`Applied suggestion for ${sug.title}`, 'success');
  };

  const handleDismissSuggestion = (id: string) => {
    if (!data) return;
    setData({
      ...data,
      sectionSuggestions: data.sectionSuggestions.filter((s) => s.id !== id),
    });
    showToast('Suggestion dismissed', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#121319] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  SkillBridge AI Portfolio & Resume Assistant
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Actionable improvements grounded in recruiter scanning algorithms and verified achievements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 dark:border-white/5 px-6 pt-3 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'portfolio'
                ? 'border-[#4D7C0F] dark:border-[#D4F73C] text-[#4D7C0F] dark:text-[#D4F73C]'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            Portfolio Improvement Suggestions
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'resume'
                ? 'border-[#4D7C0F] dark:border-[#D4F73C] text-[#4D7C0F] dark:text-[#D4F73C]'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            AI Resume Guidance & ATS Optimization
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {loading ? (
            <AILoadingState message="SkillBridge AI is evaluating your portfolio sections against recruiter standards..." />
          ) : activeTab === 'portfolio' && data ? (
            <div className="space-y-6">
              {/* Strength Banner */}
              <div className="p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    Recruiter Audit
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      Overall Portfolio Strength
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Strong: {data.strongAreas.length} categories • Actionable suggestions: {data.sectionSuggestions.length}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-3xl font-black text-[#4D7C0F] dark:text-[#D4F73C]">
                    {data.strengthScore}%
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    High Competitive Tier
                  </span>
                </div>
              </div>

              {/* Suggestions list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                    Section-by-Section AI Recommendations
                  </h4>
                  <span className="text-[11px] text-gray-400 font-semibold">
                    Review and choose whether to apply
                  </span>
                </div>

                {data.sectionSuggestions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    All suggestions applied or reviewed! Your portfolio is primed for recruiter discovery.
                  </div>
                ) : (
                  data.sectionSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        sug.applied
                          ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {sug.section}
                            </span>
                            <h5 className="font-bold text-gray-900 dark:text-white">
                              {sug.title}
                            </h5>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            {sug.rationale}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!sug.applied ? (
                            <>
                              <button
                                onClick={() => handleDismissSuggestion(sug.id)}
                                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 font-bold text-xs transition-all cursor-pointer"
                              >
                                Dismiss
                              </button>
                              <button
                                onClick={() => handleApplySuggestion(sug)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#D4F73C] hover:bg-[#c4e82b] text-[#111216] font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                              >
                                Apply Suggestion
                              </button>
                            </>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              Applied
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Suggested Content Preview */}
                      <div className="mt-3.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Recommended Wording:
                        </span>
                        "{sug.suggestedContent}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'resume' && resumeData ? (
            <div className="space-y-5">
              {/* ATS Health Scorecard */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex items-center justify-between">
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase">
                    ATS Audit
                  </span>
                  <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                    Resume Parsing Health Score
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Evaluated against automated applicant tracking systems (ATS) formatting criteria.
                  </p>
                </div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {resumeData.overallHealth}%
                </div>
              </div>

              {/* Missing Sections */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h4 className="font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Resume Sections</span>
                </h4>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 font-medium list-disc pl-4">
                  {resumeData.missingSections.map((sec, idx) => (
                    <li key={idx}>{sec}</li>
                  ))}
                </ul>
              </div>

              {/* Professional Wording Tips */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                <h4 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Google XYZ Professional Bullet Wording Tips</span>
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 pl-4 list-disc">
                  {resumeData.professionalWordingTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Tailoring Keywords */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                <h4 className="font-extrabold text-gray-900 dark:text-white">
                  Target Recruiter Keywords to Incorporate
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeData.tailoringKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold border border-gray-200 dark:border-white/10">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
