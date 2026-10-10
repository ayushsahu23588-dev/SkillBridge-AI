import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  skillBridgeEngine,
  StudentRiskAssessment,
  StudentRiskLevel,
} from '../../services/skillBridgeIntelligenceEngine';
import {
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Bot,
  FileText,
  UserCheck,
  ChevronRight,
  Send,
} from 'lucide-react';

export const AtRiskStudentDetectionPanel: React.FC = () => {
  const { institutionStudents, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | StudentRiskLevel>('ALL');
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<StudentRiskAssessment | null>(null);

  // Evaluate risk across all institution students
  const riskAssessments: StudentRiskAssessment[] = useMemo(() => {
    return institutionStudents.map((s) => skillBridgeEngine.evaluateStudentRisk(s));
  }, [institutionStudents]);

  const highRiskCount = riskAssessments.filter((r) => r.riskLevel === 'HIGH_RISK').length;
  const needsImpCount = riskAssessments.filter((r) => r.riskLevel === 'NEEDS_IMPROVEMENT').length;
  const readyCount = riskAssessments.filter((r) => r.riskLevel === 'PLACEMENT_READY').length;

  const filteredAssessments = riskAssessments.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterRisk === 'ALL') return matchesSearch;
    return matchesSearch && item.riskLevel === filterRisk;
  });

  const handleDispatchIntervention = (studentName: string, interventionTitle: string) => {
    showToast(`Remedial action assigned: "${interventionTitle}" for ${studentName}`, 'success');
    setSelectedStudentForIntervention(null);
  };

  return (
    <div id="ai-at-risk-detection-panel" className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Predictive Early Warning System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI At-Risk Student Detection & Interventions
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Detect students at risk of missing campus recruitment cutoffs due to skill gaps, backlogs, low aptitude speed, or unverified resumes before placement drives begin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast(`Triggered batch remedial notification to ${highRiskCount} high-risk candidates.`, 'info');
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Notify All At-Risk ({highRiskCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Severity Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* High Risk */}
        <div
          onClick={() => setFilterRisk('HIGH_RISK')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            filterRisk === 'HIGH_RISK'
              ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
              : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              High Placement Risk
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
              {highRiskCount}
            </span>
            <span className="text-xs font-semibold text-gray-400">Students</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Readiness &lt;55%, backlogs, or weak aptitude
          </p>
        </div>

        {/* Needs Improvement */}
        <div
          onClick={() => setFilterRisk('NEEDS_IMPROVEMENT')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            filterRisk === 'NEEDS_IMPROVEMENT'
              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Needs Improvement
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {needsImpCount}
            </span>
            <span className="text-xs font-semibold text-gray-400">Students</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Readiness 55-74%, missing 1 verified project
          </p>
        </div>

        {/* Placement Ready */}
        <div
          onClick={() => setFilterRisk('PLACEMENT_READY')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            filterRisk === 'PLACEMENT_READY'
              ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Placement Ready
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {readyCount}
            </span>
            <span className="text-xs font-semibold text-gray-400">Students</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Readiness &ge;75%, Tier-1 & Tier-2 eligible
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#14151B] p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {(['ALL', 'HIGH_RISK', 'NEEDS_IMPROVEMENT', 'PLACEMENT_READY'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterRisk === r
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-[#111216] shadow-xs'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {r === 'ALL'
                ? 'All Students'
                : r === 'HIGH_RISK'
                ? 'High Risk'
                : r === 'NEEDS_IMPROVEMENT'
                ? 'Needs Imp.'
                : 'Ready'}
            </button>
          ))}
        </div>
      </div>

      {/* Student Risk List Table */}
      <div className="space-y-3">
        {filteredAssessments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 text-gray-500">
            No students found matching your search or risk criteria.
          </div>
        ) : (
          filteredAssessments.map((student) => (
            <div
              key={student.studentId}
              className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-gray-300 dark:hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {student.studentName}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${student.riskBadge.bg} ${student.riskBadge.color}`}>
                    {student.riskBadge.label}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Readiness: <strong>{student.readinessScore}%</strong>
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {student.department}
                </p>

                {/* Primary Risk Factors */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {student.primaryRiskFactors.map((rf, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/5 text-[11px] font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{rf}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Placement Prob.
                  </p>
                  <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                    {student.predictedPlacementProbability}%
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStudentForIntervention(student)}
                  className="px-3.5 py-2 rounded-2xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#111216] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Recommend Intervention</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Intervention Recommendation Modal */}
      {selectedStudentForIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Targeted Placement Recovery
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Remedial Actions for {selectedStudentForIntervention.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForIntervention(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select an automated intervention to notify the student and assign departmental faculty oversight:
              </p>

              {selectedStudentForIntervention.recommendedInterventions.map((intv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {intv.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      {intv.urgency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/40 dark:border-white/5 text-[11px] text-gray-400">
                    <span>Assigned To: <strong>{intv.owner}</strong></span>
                    <button
                      onClick={() =>
                        handleDispatchIntervention(
                          selectedStudentForIntervention.studentName,
                          intv.title
                        )
                      }
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Assign Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
