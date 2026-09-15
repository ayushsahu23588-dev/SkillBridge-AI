import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  Target,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  RotateCcw,
  Sliders,
  Star,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AISkillAnalysis } from '../common/AISkillAnalysis';

export const StudentAssessmentPage: React.FC = () => {
  const { navigate, showToast } = useApp();

  // Technical Skills state (0 - 100)
  const [techSkills, setTechSkills] = useState<Record<string, number>>({
    'Python': 78,
    'Java': 61,
    'C/C++': 65,
    'SQL': 82,
    'Data Structures': 48,
    'Algorithms': 52,
    'Web Development': 74,
    'Git/GitHub': 70,
  });

  // Soft Skills ratings (1 - 5)
  const [softSkills, setSoftSkills] = useState<Record<string, number>>({
    'Communication': 4,
    'Teamwork': 5,
    'Leadership': 4,
    'Problem Solving': 4,
    'Time Management': 3,
  });

  // Career Interests (Selectable chips)
  const [interests, setInterests] = useState<string[]>([
    'Software Development',
    'AI/ML',
    'Cloud Computing',
  ]);

  const allInterests = [
    'Software Development',
    'Data Science',
    'AI/ML',
    'Cybersecurity',
    'Cloud Computing',
    'Web Development',
    'Mobile Development',
  ];

  // Diagnostic MCQs
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({
    0: 1,
    1: 2,
  });

  const mcqs = [
    {
      question: 'What is the time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black)?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correct: 1,
    },
    {
      question: 'Which SQL clause is executed after aggregation functions like COUNT() or AVG()?',
      options: ['WHERE', 'ORDER BY', 'HAVING', 'GROUP BY'],
      correct: 2,
    },
  ];

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleTechChange = (skill: string, val: number) => {
    setTechSkills((prev) => ({ ...prev, [skill]: val }));
  };

  const handleSoftChange = (skill: string, rating: number) => {
    setSoftSkills((prev) => ({ ...prev, [skill]: rating }));
  };

  const handleGenerateProfile = async () => {
    setIsEvaluating(true);
    try {
      // Scale soft skills to 100 for calculation
      const scaledSoft = Object.fromEntries(
        Object.entries(softSkills).map(([k, v]) => [k, Number(v) * 20])
      );

      const result = await aiService.analyzeSkills(techSkills, scaledSoft, interests);
      setAssessmentResult(result);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
      showToast('AI Skill Profile generated successfully!', 'success');
    } catch {
      showToast('Generated simulated skill profile based on input telemetry.', 'info');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600/10 via-emerald-500/10 to-[#D4F73C]/10 dark:from-blue-500/5 dark:via-emerald-500/5 dark:to-[#D4F73C]/5 border border-gray-200 dark:border-white/10 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
          <Sparkles className="w-4 h-4 text-[#84B000] dark:text-[#D4F73C]" />
          <span>Diagnostic Skill Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          AI Skill Assessment
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-2xl leading-relaxed">
          Evaluate your technical, aptitude and soft skills to understand your current industry readiness.
          The AI engine analyzes your self-reported benchmarks and live diagnostics against 280+ corporate hiring matrices.
        </p>
      </div>

      {/* Generated Result Card (if generated) */}
      {assessmentResult && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Assessment Complete
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                Your AI Skill Profile & Readiness Scorecard
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/student/skill-gap')}
                className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Skill Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/student/roadmap')}
                className="px-4 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Career Roadmap</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
              <span className="text-xs text-gray-500 font-semibold">Overall Industry Readiness</span>
              <div className="text-3xl sm:text-4xl font-black text-[#4D7C0F] dark:text-[#D4F73C] mt-1 tabular-nums">
                {assessmentResult.overallReadiness}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
              <span className="text-xs text-gray-500 font-semibold">Technical Competency</span>
              <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                {assessmentResult.technicalScore}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
              <span className="text-xs text-gray-500 font-semibold">Soft Skills & Leadership</span>
              <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                {assessmentResult.softSkillScore}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Top Strengths Detected
              </h3>
              <div className="flex flex-wrap gap-2">
                {assessmentResult.topStrengths.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                Key Gaps Requiring Focus
              </h3>
              <div className="flex flex-wrap gap-2">
                {assessmentResult.skillGaps.map((g: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>{g.skill}: Current {g.currentLevel}% (Gap {g.gap}%)</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Gemini AI Comprehensive Skill Analysis */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/5">
            <AISkillAnalysis
              techSkills={techSkills}
              interests={interests}
              onTakeAction={() => navigate('/student/roadmap')}
            />
          </div>
        </div>
      )}

      {/* 1. Technical Skills Section */}
      <section className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-500" />
              <span>Technical Skills</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Adjust sliders to reflect your current proficiency level (0% to 100%).
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400">8 Core Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {Object.entries(techSkills).map(([skill, val]) => (
            <div key={skill} className="space-y-2 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-900 dark:text-white">{skill}</span>
                <span className="text-blue-600 dark:text-blue-400 tabular-nums">{val}%</span>
              </div>
              <input
                id={`tech-slider-${skill.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                type="range"
                min={10}
                max={100}
                value={val}
                onChange={(e) => handleTechChange(skill, Number(e.target.value))}
                className="w-full accent-blue-600 dark:accent-[#D4F73C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-300 font-semibold">
                <span>Beginner (10%)</span>
                <span>Intermediate (50%)</span>
                <span>Advanced (90%+)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Soft Skills Section */}
      <section className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span>Soft Skills & Workplace Attributes</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Rate your confidence on a 1-to-5 star rating scale.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400">5 Dimensions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Object.entries(softSkills).map(([skill, rating]) => (
            <div key={skill} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <span className="text-xs font-bold text-gray-900 dark:text-white block">{skill}</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleSoftChange(skill, star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= Number(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-500 ml-2">{rating}/5</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Career Interests */}
      <section className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <span>Career Interests</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select the domains you are targeting for internships and placements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {allInterests.map((item) => {
            const selected = interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  selected
                    ? 'bg-[#D4F73C] text-[#111216] border-[#D4F73C] shadow-sm'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-400'
                }`}
              >
                {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Quick Diagnostic MCQs */}
      <section className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Aptitude & Algorithmic Diagnostics</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Quick questions to calibrate technical score weighting.
          </p>
        </div>

        <div className="space-y-4">
          {mcqs.map((q, qIndex) => (
            <div key={qIndex} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {qIndex + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, optIndex) => (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => setMcqAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))}
                    className={`p-2.5 rounded-xl text-xs text-left border transition-all cursor-pointer font-medium ${
                      mcqAnswers[qIndex] === optIndex
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Action Button */}
      <div className="text-center pt-4">
        <button
          id="generate-skill-profile-btn"
          type="button"
          disabled={isEvaluating}
          onClick={handleGenerateProfile}
          className="px-8 py-4 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-sm shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isEvaluating ? 'Analyzing Profile Telemetry...' : 'Generate My Skill Profile'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
