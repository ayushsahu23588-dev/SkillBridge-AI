import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Target, Award, AlertCircle, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import { AiSkillAnalysisData } from '../../services/aiFallbackService';
import { AILoadingState } from './AILoadingState';

interface AIInsightCardProps {
  className?: string;
  onViewAnalysis?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  className = '',
  onViewAnalysis,
}) => {
  const { studentProfile, navigate } = useApp();
  const [data, setData] = useState<AiSkillAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      setLoading(true);
      try {
        const result = await geminiService.generateSkillAnalysis(
          studentProfile,
          undefined,
          ['Backend Developer', 'Software Developer']
        );
        if (mounted) setData(result);
      } catch {
        // fallback handles it
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInsight();
    return () => {
      mounted = false;
    };
  }, [studentProfile]);

  const handleNavigate = () => {
    if (onViewAnalysis) {
      onViewAnalysis();
    } else {
      navigate('/student/skill-gap');
    }
  };

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#121319] via-[#1A1C24] to-[#121319] text-white p-6 sm:p-7 border border-white/10 shadow-xl relative overflow-hidden font-sans ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4F73C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Title */}
      <div className="relative flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4F73C] block">
              SkillBridge AI Intelligence
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              AI Career Insight
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/10 border border-white/15 text-white/90">
          Placement Benchmark
        </span>
      </div>

      {loading ? (
        <AILoadingState message="SkillBridge AI is synthesizing career trends..." variant="card" className="bg-white/5 border-white/5 py-4" />
      ) : data ? (
        <div className="relative space-y-4 text-xs">
          <p className="text-gray-200 leading-relaxed font-medium">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Strongest Areas</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                SQL ({studentProfile.skills.find(s => s.name.includes('SQL'))?.verifiedScore || 82}%) and Python ({studentProfile.skills.find(s => s.name.includes('Python'))?.verifiedScore || 78}%)
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Priority Gap</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                Data Structures & Algorithms (Current 48%, Target 75%)
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#D4F73C]/10 border border-[#D4F73C]/20 text-white">
            <span className="text-[10px] uppercase font-black text-[#D4F73C] tracking-wide block mb-1">
              Recommended Next Action
            </span>
            <p className="text-[12px] font-semibold text-gray-100">
              {data.recommendedAction}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400">
              Career Alignment: <strong className="text-white">{data.careerFit.role} ({data.careerFit.fitScore}%)</strong>
            </span>

            <button
              id="view-ai-analysis-btn"
              onClick={handleNavigate}
              className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea2f] text-[#111216] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View AI Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
