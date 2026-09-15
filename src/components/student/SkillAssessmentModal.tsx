import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_QUIZ_QUESTIONS } from '../../data/mockData';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  HelpCircle,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillAssessmentModalProps {
  initialSkill?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  initialSkill = 'TypeScript & JavaScript',
  isOpen,
  onClose,
}) => {
  const { studentProfile, recordSkillAssessment, showToast } = useApp();

  const availableSkills = Object.keys(INITIAL_QUIZ_QUESTIONS);
  const [selectedSkill, setSelectedSkill] = useState(
    availableSkills.includes(initialSkill) ? initialSkill : availableSkills[0]
  );

  const questions = INITIAL_QUIZ_QUESTIONS[selectedSkill] || INITIAL_QUIZ_QUESTIONS['TypeScript & JavaScript'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (availableSkills.includes(initialSkill)) {
      setSelectedSkill(initialSkill);
    }
  }, [initialSkill]);

  useEffect(() => {
    let interval: any = null;
    if (hasStarted && !isSubmitted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && !isSubmitted && hasStarted) {
      handleFinalSubmit();
    }
    return () => clearInterval(interval);
  }, [hasStarted, isSubmitted, timerSeconds]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted || isSubmitting) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleStartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setTimerSeconds(questions.length * 45);
    setHasStarted(true);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Simulate/await asynchronous database grading & badge synchronization
      await new Promise((r) => setTimeout(r, 650));

      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const finalScore = Math.round((correctCount / questions.length) * 100);
      recordSkillAssessment(selectedSkill, finalScore);
      setIsSubmitted(true);

      if (finalScore >= 70) {
        showToast(`Congratulations! You passed the ${selectedSkill} assessment with ${finalScore}%!`, 'success');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      } else {
        showToast(`Assessment completed. Your score is ${finalScore}%. Review the explanations below.`, 'info');
      }
    } catch (err) {
      showToast('Failed to record assessment score. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const scoreData = isSubmitted ? calculateScore() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  Skill Proficiency Assessment
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  Adaptive Level
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                Verified skill credentials badge for recruitment visibility
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!hasStarted ? (
            /* Intro Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Verify Your Competency in {selectedSkill}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-md mx-auto leading-relaxed font-normal">
                  Take this fast {questions.length}-question benchmark to validate your technical mastery.
                  Scoring 70%+ awards a verified institutional endorsement.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2 text-left">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Select Technical Domain:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setSelectedSkill(skill)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                        selectedSkill === skill
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs font-semibold'
                          : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-around font-medium">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <span>{questions.length} Scenario Questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{questions.length * 45} Seconds Time Limit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>70% Passing Threshold</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartQuiz}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : isSubmitted && scoreData ? (
            /* Results Screen */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold tabular-nums shadow-lg ${
                    scoreData.percentage >= 70
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-900/30'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 ring-8 ring-amber-50 dark:ring-amber-900/30'
                  }`}
                >
                  {scoreData.percentage}%
                </div>

                <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {scoreData.percentage >= 70
                    ? `🎉 Verified Mastery in ${selectedSkill}!`
                    : `Keep Practicing ${selectedSkill}`}
                </h4>

                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto font-normal">
                  {scoreData.percentage >= 70
                    ? `Outstanding! You answered ${scoreData.correct} of ${scoreData.total} questions correctly. Your verified badge is updated on your student profile.`
                    : `You answered ${scoreData.correct} of ${scoreData.total} questions correctly. Review the explanations below and re-attempt to earn your verified badge.`}
                </p>
              </div>

              {/* Question Breakdown List */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Detailed Answer Key & Explanations:
                </p>
                {questions.map((q, idx) => {
                  const userChoice = selectedAnswers[idx];
                  const isCorrect = userChoice === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white flex-1">
                          Q{idx + 1}: {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold shrink-0">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-normal">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Correct Answer:
                        </span>{' '}
                        {q.options[q.correctIndex]}
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-800 font-normal">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Explanation:
                        </span>{' '}
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Test</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Close & View Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Quiz Interface */
            <div className="space-y-6">
              {/* Progress & Timer */}
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500 dark:text-gray-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 font-mono tabular-nums font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(timerSeconds / 60)}:
                    {(timerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 space-y-2">
                <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {currentQ.difficulty} Difficulty
                </div>
                <h4 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl text-left text-xs font-normal border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 shadow-xs'
                          : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 dark:border-gray-700 text-gray-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Grading & Recording Scorecard...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Assessment</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
