import React, { useState } from 'react';
import { FullResumeAnalysisResult } from '../../../services/aiService';
import {
  FileText,
  Layers,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Key,
  Layout,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ResumeSuggestionsViewProps {
  analysis: FullResumeAnalysisResult | null;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onApplySummary: (suggestedSummary: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResumeSuggestionsView: React.FC<ResumeSuggestionsViewProps> = ({
  analysis,
  onRunAnalysis,
  isAnalyzing,
  onApplySummary,
  showToast,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="p-12 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-black dark:text-white">
            Actionable Suggestions Ready to Generate
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-md mx-auto font-normal">
            Analyze your resume to unlock 8 focused dimensions of AI feedback: Summary, Skills, Projects, Experience, Education, Keywords, Formatting, and Missing Information.
          </p>
        </div>
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Auditing Resume...' : 'Analyze Resume to Unlock Suggestions'}</span>
        </button>
      </div>
    );
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    showToast('Copied suggestion to clipboard!', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestions = analysis.actionableSuggestions;

  const suggestionCategories = [
    {
      id: 'summary',
      title: '1. Professional Summary',
      icon: <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      badge: 'High Impact',
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      description: 'Hook recruiters in the top 3 lines of your resume with measurable role targeting.',
      content: (
        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
          <p className="text-xs text-black dark:text-gray-200 font-medium leading-relaxed">
            "{suggestions.summary}"
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleCopy(suggestions.summary, 'summary-text')}
              className="px-3 py-1 rounded-lg bg-white dark:bg-[#121316] border border-gray-300 dark:border-white/10 text-xs font-semibold text-black dark:text-gray-200 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
            >
              {copiedIndex === 'summary-text' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
            <button
              onClick={() => onApplySummary(suggestions.summary)}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Apply to Resume</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'skills',
      title: '2. Skills Taxonomies',
      icon: <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      badge: 'ATS Essential',
      badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
      description: 'How to regroup, version, and highlight your technical competencies for automated parsers.',
      items: suggestions.skills,
    },
    {
      id: 'projects',
      title: '3. Technical Projects',
      icon: <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Portfolio Boost',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      description: 'Elevate projects from academic exercises into production-grade systems with live URLs.',
      items: suggestions.projects,
    },
    {
      id: 'experience',
      title: '4. Professional Experience',
      icon: <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      badge: 'XYZ Quantification',
      badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      description: 'Transform passive duties into quantified results (latency, scale, cost, user adoption).',
      items: suggestions.experience,
    },
    {
      id: 'education',
      title: '5. Education & Academics',
      icon: <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      badge: 'Academic Fit',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      description: 'Include competitive distinctions, GPA, and relevant distributed systems coursework.',
      items: suggestions.education,
    },
    {
      id: 'keywords',
      title: '6. ATS Keywords & Synonyms',
      icon: <Key className="w-4 h-4 text-pink-600 dark:text-pink-400" />,
      badge: 'Search Rank',
      badgeColor: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
      description: 'Algorithmic keywords recruiters search for when screening 1,000+ candidates.',
      items: suggestions.keywords,
    },
    {
      id: 'formatting',
      title: '7. Formatting & Layout',
      icon: <Layout className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      badge: 'Parsability',
      badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
      description: 'Single-column structure, standard fonts, and margins preventing parsing failures.',
      items: suggestions.formatting,
    },
    {
      id: 'missing-info',
      title: '8. Missing Crucial Information',
      icon: <HelpCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
      badge: 'Critical Gap',
      badgeColor: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      description: 'High-value data points recruiters expect that are currently absent from your resume.',
      items: suggestions.missingInformation,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            8 Actionable AI Improvement Vectors
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300 font-normal">
            Synthesized by Google Gemini from enterprise recruiter hiring standards.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
          8 of 8 Audited
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestionCategories.map((cat) => (
          <div
            key={cat.id}
            id={`suggestion-card-${cat.id}`}
            className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    {cat.icon}
                  </div>
                  <h4 className="text-sm font-bold text-black dark:text-white">{cat.title}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mb-3">
                {cat.description}
              </p>

              {cat.content ? (
                cat.content
              ) : (
                <ul className="space-y-2">
                  {cat.items?.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 text-xs text-black dark:text-gray-200 font-normal leading-relaxed flex items-start gap-2 group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => handleCopy(item, `${cat.id}-${idx}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 shrink-0"
                        title="Copy suggestion"
                      >
                        {copiedIndex === `${cat.id}-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
