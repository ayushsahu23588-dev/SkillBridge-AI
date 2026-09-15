import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import {
  InterviewQuestionItem,
  InterviewAnswerFeedback,
  FinalInterviewReadiness,
} from '../../services/aiFallbackService';
import { AILoadingState } from '../common/AILoadingState';
import {
  Sparkles,
  Play,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Clock,
  Compass,
  Sliders,
  BarChart3,
  Bot,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AiInterviewPrepPage: React.FC = () => {
  const { studentProfile, navigate, showToast } = useApp();

  // Setup options
  const [selectedCareer, setSelectedCareer] = useState<string>('Software Developer');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [interviewType, setInterviewType] = useState<string>('Mixed');

  // Interactive interview session state
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<InterviewAnswerFeedback | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<InterviewAnswerFeedback[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalReadiness, setFinalReadiness] = useState<FinalInterviewReadiness | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const careerRoles = [
    'Software Developer',
    'Backend Developer',
    'Data Analyst',
    'AI/ML Developer',
    'Cloud & DevOps Engineer',
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const interviewTypes = ['Technical', 'Behavioral', 'Aptitude', 'Mixed'];

  const startInterview = async () => {
    setLoadingQuestions(true);
    setIsActive(true);
    setIsCompleted(false);
    setCurrentIndex(0);
    setFeedbackHistory([]);
    setCurrentFeedback(null);
    setCurrentAnswer('');

    try {
      const qList = await geminiService.generateInterviewQuestions(
        selectedCareer,
        difficulty,
        interviewType
      );
      setQuestions(qList);
      showToast(`AI Mock Interview started: 10 curated questions for ${selectedCareer}`, 'info');
    } catch {
      // handled
    } finally {
      setLoadingQuestions(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim() || evaluating) return;

    setEvaluating(true);
    const activeQuestion = questions[currentIndex];

    try {
      const feedback = await geminiService.generateInterviewFeedback(
        activeQuestion.question,
        currentAnswer.trim(),
        activeQuestion.idealKeyPoints
      );

      setCurrentFeedback(feedback);
      setFeedbackHistory((prev) => [...prev, feedback]);
    } catch {
      // fallback handled
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentFeedback(null);
    setCurrentAnswer('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete interview
      finishInterview();
    }
  };

  const finishInterview = () => {
    setIsCompleted(true);
    const result = geminiService.calculateFinalInterviewReadiness(
      selectedCareer,
      difficulty,
      interviewType,
      questions.length
    );
    setFinalReadiness(result);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
              <span>Real-Time AI Interview Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              AI Interview Preparation Studio
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Experience simulated real-world technical and behavioral interview rounds. Receive instant sentence-by-sentence evaluation, clarity scores, and placement readiness ratings.
            </p>
          </div>

          <button
            onClick={() => navigate('/student/roadmap')}
            className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer border border-gray-200 dark:border-white/10"
          >
            <Compass className="w-4 h-4" />
            <span>Career Roadmap</span>
          </button>
        </div>
      </div>

      {!isActive ? (
        /* Configuration Screen */
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Configure Your Interview Session
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Select Career */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Target Career Role
              </label>
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden"
              >
                {careerRoles.map((role) => (
                  <option key={role} value={role} className="dark:bg-[#14151B]">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Difficulty Tier
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden"
              >
                {difficultyLevels.map((lvl) => (
                  <option key={lvl} value={lvl} className="dark:bg-[#14151B]">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Interview Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Round Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden"
              >
                {interviewTypes.map((type) => (
                  <option key={type} value={type} className="dark:bg-[#14151B]">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#D4F73C]/10 border border-[#D4F73C]/20 text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
            <strong className="text-gray-900 dark:text-white">What to expect:</strong> AI will generate a rigorous 10-question sequence. For each question, submit your answer to receive detailed scores on correctness, clarity, and communication, ending with a comprehensive readiness verdict.
          </div>

          <button
            id="start-ai-interview-btn"
            onClick={startInterview}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-[#111216]" />
            <span>Start AI Interview</span>
          </button>
        </div>
      ) : loadingQuestions ? (
        <AILoadingState message={`Synthesizing 10 adaptive ${selectedCareer} questions with AI...`} />
      ) : isCompleted && finalReadiness ? (
        /* Final Interview Result Card */
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#4D7C0F] dark:text-[#D4F73C] tracking-wider">
                Interview Completed
              </span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                Evaluation & Readiness Scorecard
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                10 of 10 Questions Evaluated • {finalReadiness.careerRole} ({finalReadiness.difficulty})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#D4F73C]/10 border border-[#D4F73C]/30 text-center sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">
                Interview Readiness
              </span>
              <div className="text-4xl font-black text-[#4D7C0F] dark:text-[#D4F73C]">
                {finalReadiness.readinessScore}%
              </div>
            </div>
          </div>

          {/* Feedback breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {finalReadiness.summaryVerbalFeedback}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {finalReadiness.detailedBreakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">
                  {item.category}
                </span>
                <span className="text-xl font-black text-gray-900 dark:text-white">
                  {item.score}%
                </span>
              </div>
            ))}
          </div>

          {/* Top Improvements */}
          <div className="p-5 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-3">
            <h3 className="font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Top Areas for Improvement</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 pl-4 list-disc font-medium">
              {finalReadiness.topImprovements.map((imp, idx) => (
                <li key={idx} className="leading-relaxed">{imp}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsActive(false)}
              className="px-6 py-3 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Interview</span>
            </button>
            <button
              onClick={() => navigate('/student/internships')}
              className="px-6 py-3 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explore Matching Internships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        /* Active Question Screen (Question 1 of 10) */
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {currentQuestion.category}
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-gray-400">
              {selectedCareer} • {difficulty}
            </span>
          </div>

          {/* Question text */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentQuestion.context}
            </p>
          </div>

          {/* Answer Input */}
          {!currentFeedback ? (
            <div className="space-y-4">
              <textarea
                id="interview-answer-textarea"
                rows={5}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your structured answer here. Speak clearly to technical trade-offs, architecture, and edge cases..."
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-500 dark:focus:border-[#D4F73C] transition-all font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Word count: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words
                </span>

                <button
                  id="submit-interview-answer-btn"
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || evaluating}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    currentAnswer.trim() && !evaluating
                      ? 'bg-[#D4F73C] text-[#111216] hover:bg-[#c6ea31] shadow-md'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{evaluating ? 'AI is Evaluating...' : 'Submit Answer for AI Review'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Individual Question Evaluation Feedback */
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    AI Evaluation
                  </span>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    Question Feedback
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-bold">Answer Score:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {currentFeedback.score}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {currentFeedback.feedbackSummary}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/5">
                  <span className="text-[10px] text-gray-400 block font-bold">Technical</span>
                  <span className="font-black text-gray-900 dark:text-white">{currentFeedback.technicalUnderstanding}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/5">
                  <span className="text-[10px] text-gray-400 block font-bold">Clarity</span>
                  <span className="font-black text-gray-900 dark:text-white">{currentFeedback.clarity}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/5">
                  <span className="text-[10px] text-gray-400 block font-bold">Communication</span>
                  <span className="font-black text-gray-900 dark:text-white">{currentFeedback.communication}%</span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <h4 className="font-bold text-amber-600 dark:text-amber-400 text-xs">
                  Improvement Suggestions:
                </h4>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400 pl-4 list-disc">
                  {currentFeedback.improvementSuggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="next-interview-question-btn"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Complete & View Scorecard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
