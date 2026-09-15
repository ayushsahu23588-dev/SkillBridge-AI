import React, { useState } from 'react';
import { PersonalizedRoadmapItem } from '../../services/aiFallbackService';
import {
  Compass,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  Code2,
  Bookmark,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AIRoadmapProps {
  careerGoal?: string;
  initialGoal?: string;
  items?: PersonalizedRoadmapItem[];
  onRegenerate?: () => void;
  onSaveRoadmap?: () => void;
  onMilestoneComplete?: (milestone: string) => void;
  isGenerating?: boolean;
}

const DEFAULT_ROADMAP_ITEMS: PersonalizedRoadmapItem[] = [
  {
    id: 'rd-1',
    month: 'Month 1',
    phase: 'Phase 1: Architecture & Foundations',
    skill: 'Core Algorithms & Data Structures',
    whyItMatters: 'Forms the backbone of technical interviews and complex system problem solving.',
    learningObjective: 'Master graph algorithms, trees, dynamic programming, and concurrency primitives.',
    practiceTask: 'Solve 25 medium-to-hard LeetCode/HackerRank algorithm challenges.',
    projectTask: 'Implement custom concurrent LRU Cache with TTL support.',
    estimatedDuration: '4 Weeks',
    priority: 'Critical',
    completed: true,
  },
  {
    id: 'rd-2',
    month: 'Month 2',
    phase: 'Phase 2: Microservices & Cloud Infrastructure',
    skill: 'Docker, Kubernetes & Distributed Caching',
    whyItMatters: 'Essential for enterprise-scale deployments and multi-tenant cloud ecosystems.',
    learningObjective: 'Deploy containerized services with automated health checks, ingress controllers, and Redis caching.',
    practiceTask: 'Configure multi-node Kubernetes cluster with horizontal pod autoscaling.',
    projectTask: 'Architect an asynchronous event-driven notifications service using Redis Pub/Sub.',
    estimatedDuration: '4 Weeks',
    priority: 'High',
    completed: false,
  },
  {
    id: 'rd-3',
    month: 'Month 3',
    phase: 'Phase 3: Production Engineering & Capstone',
    skill: 'CI/CD, Monitoring & Enterprise Readiness',
    whyItMatters: 'Ensures real-world software maintainability, low latency, and zero-downtime releases.',
    learningObjective: 'Set up GitHub Actions CI/CD pipelines, Prometheus metrics, and Grafana dashboards.',
    practiceTask: 'Simulate high-throughput load tests using k6 and analyze latency percentiles.',
    projectTask: 'Publish verified end-to-end full-stack capstone repository with automated tests and live demo URL.',
    estimatedDuration: '4 Weeks',
    priority: 'Critical',
    completed: false,
  },
];

export const AIRoadmap: React.FC<AIRoadmapProps> = ({
  careerGoal,
  initialGoal,
  items: initialItems,
  onRegenerate,
  onSaveRoadmap,
  onMilestoneComplete,
  isGenerating = false,
}) => {
  const effectiveGoal = careerGoal || initialGoal || 'Software Engineer';
  const { showToast } = useApp();
  const [items, setItems] = useState<PersonalizedRoadmapItem[]>(initialItems && initialItems.length > 0 ? initialItems : DEFAULT_ROADMAP_ITEMS);

  // Sync state when props update
  React.useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const toggleItemCompletion = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState && onMilestoneComplete) {
            onMilestoneComplete(item.skill);
          }
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  return (
    <div className="space-y-6 font-sans">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Personalized AI Roadmap: {careerGoal}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4F73C] text-[#111216]">
              5-Month Sprint
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Progress: {completedCount} of {items.length} milestones achieved ({progressPercent}%)
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="regenerate-ai-roadmap-btn"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Roadmap</span>
          </button>

          <button
            id="save-ai-roadmap-btn"
            onClick={onSaveRoadmap}
            className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c4e82b] text-[#111216] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Roadmap</span>
          </button>
        </div>
      </div>

      {/* Roadmap Phase Timeline */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-5 sm:p-6 rounded-3xl border transition-all ${
              item.completed
                ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleItemCompletion(item.id)}
                  className={`mt-1 p-1 rounded-full transition-all cursor-pointer ${
                    item.completed
                      ? 'text-emerald-500 hover:text-emerald-600'
                      : 'text-gray-300 dark:text-gray-600 hover:text-gray-500'
                  }`}
                  aria-label="Toggle milestone status"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white dark:text-[#121319]" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                      {item.month} • {item.phase}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.priority === 'Critical'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : item.priority === 'High'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.estimatedDuration}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    {item.skill}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                    <strong className="text-gray-800 dark:text-gray-200">Why it matters:</strong> {item.whyItMatters}
                  </p>
                </div>
              </div>

              <div className="text-right sm:self-center shrink-0">
                <span className={`text-xs font-bold ${item.completed ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {item.completed ? 'Completed ✓' : 'Pending Milestone'}
                </span>
              </div>
            </div>

            {/* Sub tasks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-white/5 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                <span className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1 text-[11px]">
                  <BookOpen className="w-3.5 h-3.5" />
                  Learning Objective
                </span>
                <p className="text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed">
                  {item.learningObjective}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                <span className="font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-1 text-[11px]">
                  <Code2 className="w-3.5 h-3.5" />
                  Practice Task
                </span>
                <p className="text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed">
                  {item.practiceTask}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1 text-[11px]">
                  <Layers className="w-3.5 h-3.5" />
                  Project Task
                </span>
                <p className="text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed">
                  {item.projectTask}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
