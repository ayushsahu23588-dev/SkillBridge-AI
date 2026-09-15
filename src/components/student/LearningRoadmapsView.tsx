import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Award,
  RefreshCw,
  Layers,
  Plus,
  PlayCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LearningRoadmapsView: React.FC = () => {
  const { studentProfile, addLearningRoadmap, toggleMilestone, showToast } = useApp();
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(
    studentProfile.activeRoadmaps[0]?.id || ''
  );

  // New roadmap modal / creation state
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState('Senior Full-Stack & Generative AI Engineer');
  const [durationWeeks, setDurationWeeks] = useState(8);

  const currentRoadmap =
    studentProfile.activeRoadmaps.find((r) => r.id === activeRoadmapId) ||
    studentProfile.activeRoadmaps[0];

  const handleToggle = (phaseIndex: number) => {
    if (!currentRoadmap) return;
    toggleMilestone(currentRoadmap.id, phaseIndex);

    // If all are now completed or high milestone, trigger celebration confetti
    const nextCompletedCount = currentRoadmap.milestones.filter((m, i) =>
      i === phaseIndex ? !m.completed : m.completed
    ).length;

    if (nextCompletedCount === currentRoadmap.milestones.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast('🎉 Congratulations! You completed all milestones in this Career Track!');
    }
  };

  const handleCreateNewRoadmap = async () => {
    setCreating(true);
    try {
      showToast(`Generating ${durationWeeks}-week curriculum with AI...`, 'info');
      const skills = studentProfile.skills.map((s) => s.name);
      const rmData = await aiService.generateRoadmap(newRole, skills, durationWeeks);

      const newRm = {
        id: `rm_${Date.now()}`,
        title: rmData.title,
        role: rmData.role,
        totalWeeks: rmData.totalWeeks,
        progressPercentage: 0,
        milestones: rmData.milestones.map((m, idx) => ({
          ...m,
          completed: idx === 0,
        })),
        capstoneProject: rmData.capstoneProject,
      };

      addLearningRoadmap(newRm);
      setActiveRoadmapId(newRm.id);
      showToast(`Roadmap for "${newRole}" enrolled successfully!`, 'success');
    } catch (err: any) {
      showToast('Error generating roadmap: ' + err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-sky-900/30 to-indigo-900/40 border border-blue-200/60 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Dynamic Curriculum Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Personalized Career Learning Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Step-by-step milestones, vetted documentation, production-ready capstones, and self-assessment quizzes tailored to tier-1 enterprise hiring bars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {studentProfile.activeRoadmaps.map((rm) => (
            <button
              key={rm.id}
              onClick={() => setActiveRoadmapId(rm.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tabular-nums transition-all ${
                activeRoadmapId === rm.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {rm.role.split(' ')[0]} ({rm.progressPercentage}%)
            </button>
          ))}
        </div>
      </div>

      {currentRoadmap && (
        <div className="space-y-6">
          {/* Active Track Progress Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-xs shrink-0">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {currentRoadmap.totalWeeks}-Week Accelerated Track
                </span>
                <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mt-1">
                  {currentRoadmap.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Target Outcome: {currentRoadmap.role}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-56 space-y-1.5 shrink-0">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Track Progress</span>
                <span className="text-blue-600 dark:text-blue-400 tabular-nums">
                  {currentRoadmap.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentRoadmap.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Milestones List */}
          <div className="space-y-4">
            {currentRoadmap.milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  milestone.completed
                    ? 'bg-white dark:bg-gray-900 border-emerald-300 dark:border-emerald-900/60 shadow-xs'
                    : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      id={`toggle-milestone-${idx}`}
                      onClick={() => handleToggle(idx)}
                      className="mt-0.5 p-1 rounded-full text-gray-400 hover:text-emerald-500 transition-colors"
                      title={milestone.completed ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                      )}
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 tabular-nums">
                          {milestone.weekRange}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                          {milestone.phase}
                        </h3>
                      </div>

                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {milestone.theme}
                      </p>

                      {/* Objectives list */}
                      <div className="pt-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Core Objectives:
                        </p>
                        <ul className="mt-1 space-y-1 text-xs text-gray-600 dark:text-gray-400 font-normal">
                          {milestone.objectives.map((obj, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hands-on project task */}
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 text-xs">
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5 text-blue-500" /> Hands-On Deliverable:
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 mt-0.5 font-normal">
                          {milestone.handsOnProject}
                        </p>
                      </div>

                      {/* Resources pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {milestone.recommendedResources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <BookOpen className="w-3 h-3 text-gray-400" />
                            <span>{res.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold self-end sm:self-start transition-all shrink-0 ${
                      milestone.completed
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600'
                    }`}
                  >
                    {milestone.completed ? 'Milestone Completed ✓' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Capstone Project Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Track Capstone Specification
                </span>
                <h4 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
                  {currentRoadmap.capstoneProject.title}
                </h4>
              </div>
            </div>

            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
              Industry Relevance: {currentRoadmap.capstoneProject.industryRelevance}
            </p>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Target Deliverables:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentRoadmap.capstoneProject.deliverables.map((del, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs"
                  >
                    ✓ {del}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generator for Custom Tech Domain Roadmap */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-500" />
          Generate Custom AI Career Curriculum
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Custom Specialty / Target Role
            </label>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Distributed Systems Engineer with Go & Kubernetes"
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Duration
            </label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value={4}>4 Weeks (Intensive Sprint)</option>
              <option value={8}>8 Weeks (Comprehensive Track)</option>
              <option value={12}>12 Weeks (Semester Mastery)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            id="generate-custom-roadmap-btn"
            onClick={handleCreateNewRoadmap}
            disabled={creating}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {creating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Designing Curriculum with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Roadmap Track</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
