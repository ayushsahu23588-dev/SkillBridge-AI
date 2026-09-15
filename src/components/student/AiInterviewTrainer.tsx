import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService, InterviewEvalResult } from '../../services/aiService';
import {
  Bot,
  Sparkles,
  Play,
  Send,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Mic,
  MessageSquare,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface MockQuestion {
  question: string;
  category: string;
  difficulty: string;
  evalCriteria: string[];
}

export const AiInterviewTrainer: React.FC = () => {
  const { studentProfile, showToast } = useApp();
  const [role, setRole] = useState('Full-Stack Distributed Systems Engineer');
  const [roundType, setRoundType] = useState('Technical Coding & Systems');
  const [difficulty, setDifficulty] = useState('Intermediate');
  
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<MockQuestion | null>({
    question:
      'Explain how you would architect a distributed rate-limiter for high-throughput public REST endpoints using Redis. How would you handle race conditions during token refills across multiple server replicas?',
    category: 'System Design & Redis',
    difficulty: 'Intermediate',
    evalCriteria: [
      'Token Bucket / Sliding Window algorithm comprehension',
      'Redis Lua scripting or atomic Redis INCR/EXPIRE operations',
      'Distributed concurrency & latency trade-offs',
    ],
  });

  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvalResult | null>(null);
  const [sessionHistory, setSessionHistory] = useState<
    { q: string; a: string; eval: InterviewEvalResult }[]
  >([]);

  const handleGenerateQuestion = async () => {
    setGeneratingQuestion(true);
    setEvaluation(null);
    setStudentAnswer('');
    try {
      const skills = studentProfile.skills.map((s) => s.name);
      const res = await aiService.generateInterviewQuestions(role, skills, difficulty);
      if (res && res.questions && res.questions.length > 0) {
        const firstQ = res.questions[0];
        setCurrentQuestion({
          question: firstQ.question,
          category: firstQ.category || roundType,
          difficulty: difficulty,
          evalCriteria: firstQ.keyPointsExpected || [
            'Technical correctness',
            'Architecture scalability',
            'Code optimization',
          ],
        });
        showToast('Generated fresh interview question!', 'success');
      }
    } catch (err: any) {
      showToast('Error generating question: ' + err.message, 'error');
    } finally {
      setGeneratingQuestion(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!currentQuestion || !studentAnswer.trim()) {
      showToast('Please formulate your answer before submitting for evaluation.', 'error');
      return;
    }
    setEvaluating(true);
    try {
      const idealSummary = currentQuestion.evalCriteria.join('. ');
      const result = await aiService.evaluateInterviewAnswer(
        currentQuestion.question,
        studentAnswer,
        idealSummary
      );
      setEvaluation(result);
      setSessionHistory((prev) => [
        { q: currentQuestion.question, a: studentAnswer, eval: result },
        ...prev,
      ]);
      showToast(`Answer evaluated! Score: ${result.score}/100`, 'success');
    } catch (err: any) {
      showToast('Evaluation error: ' + err.message, 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleSpeakQuestion = () => {
    if (!currentQuestion || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-purple-900/40 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Conversational Evaluator
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            AI Mock Interview Simulator & Rubric Scorer
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Simulate realistic technical, system design, and behavioral interviews with real-time feedback and model answer walkthroughs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
              Practiced Questions
            </span>
            <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
              {sessionHistory.length}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration & Question Generation Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          Configure Mock Interview Session
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Target Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Round Focus
            </label>
            <select
              value={roundType}
              onChange={(e) => setRoundType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Technical Coding & Systems">Technical Systems & Coding</option>
              <option value="System Design & Architecture">System Design & Cloud Scale</option>
              <option value="Behavioral (STAR Method)">Behavioral (Leadership & Teamwork)</option>
              <option value="Core CS Fundamentals">Core CS (OS, DBMS, Networks)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Standard Graduate">Campus Placement (Standard)</option>
              <option value="Intermediate">Intermediate (Tier-1 Standard)</option>
              <option value="Hard / Staff Bar">Hard (FAANG / Unicorn Bar)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            id="generate-interview-question-btn"
            onClick={handleGenerateQuestion}
            disabled={generatingQuestion}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {generatingQuestion ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Formulating Technical Question...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Next AI Question</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Question & Answer Box */}
      {currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Question Prompt & Student Answer input */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs text-gray-400 font-normal">
                    Difficulty: {currentQuestion.difficulty}
                  </span>
                </div>

                <button
                  id="speak-question-btn"
                  onClick={handleSpeakQuestion}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Read question aloud"
                >
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span className="hidden sm:inline">Listen</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                <p className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Evaluation criteria preview */}
              {currentQuestion.evalCriteria?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Interviewer Key Competencies Evaluated:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.evalCriteria.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        • {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate Response Area */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Your Response
                  </label>
                  <span className="text-[11px] text-gray-400 font-normal tabular-nums">
                    {studentAnswer.split(' ').filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  id="student-answer-textarea"
                  rows={8}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Explain your approach, architectural trade-offs, edge cases, and code structure clearly..."
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed font-normal"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() =>
                    setStudentAnswer(
                      `I would implement the Sliding Window Counter algorithm in Redis using a Lua script to ensure atomicity. Each client request executes a Redis sorted set (ZADD) with the current timestamp as score and member, removes keys older than window (ZREMRANGEBYSCORE), and checks cardinality (ZCARD). If ZCARD < max_limit, the request passes; otherwise, return HTTP 429 Too Many Requests with a Retry-After header.`
                    )
                  }
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Insert Sample Engineering Answer
                </button>

                <button
                  id="evaluate-answer-btn"
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !studentAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Grading Response with AI...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit for AI Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: AI Feedback & Model Answer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-500" />
                AI Interview Rubric & Feedback
              </h3>

              {evaluation ? (
                <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                  {/* Score pill */}
                  <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                        Evaluated Score
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-normal">
                        Performance against hiring bar
                      </p>
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {evaluation.score}/100
                    </span>
                  </div>

                  {/* Strengths */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> What You Did Well
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 font-normal">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx}>• {str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Areas to Refine
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 font-normal">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx}>• {imp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Model Answer */}
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Ideal Model Answer
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-line font-normal">
                      {evaluation.modelAnswer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-gray-400 dark:text-gray-500">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">Ready for evaluation</p>
                  <p className="text-xs mt-1 max-w-xs mx-auto font-normal leading-relaxed text-gray-500 dark:text-gray-400">
                    Type your answer on the left and click "Submit for AI Evaluation" to receive scoring and model explanations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
