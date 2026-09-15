import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  Award,
  Sparkles,
  Lock,
  Clock,
  History,
} from 'lucide-react';

export const AuditAndAccreditation: React.FC = () => {
  const { studentProfile, mentorships, applications, showToast } = useApp();

  const handleExportDossier = () => {
    showToast('Exported ABET / NBA Compliance Dossier successfully (PDF/JSON)!');
  };

  const auditEvents = [
    {
      id: 'aud_1',
      action: 'Faculty Certificate Verification',
      actor: 'Dr. Evelyn Vance (Dept of Computer Science)',
      target: `Aarav Patel (AWS Solutions Architect Associate)`,
      timestamp: '2026-08-28 16:30 PST',
      status: 'Cryptographically Signed',
      standard: 'ABET Criterion 5: Curriculum & Credential Verification',
    },
    {
      id: 'aud_2',
      action: 'Skill Competency Endorsement',
      actor: 'Prof. Rajesh Nair (Dean of Academic Affairs)',
      target: 'Aarav Patel (Distributed Systems - 94/100)',
      timestamp: '2026-08-27 11:15 PST',
      status: 'Institutional Seal Attached',
      standard: 'NBA Outcome-Based Education (OBE) PO-1 & PO-3',
    },
    {
      id: 'aud_3',
      action: 'Corporate MOU Ratification',
      actor: 'Office of Industry Relations',
      target: 'NovaCloud Systems Inc. (Tier-1 Cloud Research Lab)',
      timestamp: '2026-08-20 09:45 PST',
      status: 'Active Bilateral MOU',
      standard: 'NAAC Metric 3.5.2 Industry Collaboration',
    },
    {
      id: 'aud_4',
      action: 'Campus Placement Offer Extended',
      actor: 'NovaCloud Systems Inc.',
      target: 'Aarav Patel (Cloud Systems Engineer)',
      timestamp: '2026-08-29 14:20 PST',
      status: 'Verified Placement',
      standard: 'NIRF Metric 4.2 Placement of Graduating Students',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/50 via-blue-950/40 to-indigo-950/50 border border-teal-200/60 dark:border-teal-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            ABET • NBA • NAAC Accreditation Compliance Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Institutional Audit Logs & Accreditation Readiness
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Automated tamper-evident audit logs verifying outcome-based education (OBE), faculty endorsements, and industry placement ratios.
          </p>
        </div>

        <button
          onClick={handleExportDossier}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Compliance Dossier</span>
        </button>
      </div>

      {/* Compliance Standards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              ABET Accreditation
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              100% Ready
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Meets Criterion 3 (Student Outcomes) and Criterion 5 (Continuous Curriculum Improvement).
          </p>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full rounded-full" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              NBA Tier-1 Compliance
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              98.6% Attainment
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Direct Programme Outcomes (PO/PSO) mappings with faculty competency stamps.
          </p>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 w-[98%] rounded-full" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              NAAC / NIRF Placement Metric
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              96.2% Rate
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Verified corporate offer letters and industry-sponsored research lab allocations.
          </p>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[96%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-teal-500" />
          Tamper-Evident Institutional Audit Stream
        </h2>

        <div className="space-y-4 pt-2">
          {auditEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {ev.action}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {ev.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">{ev.actor}</span> → {ev.target}
                </p>

                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                  Standard: {ev.standard}
                </p>
              </div>

              <div className="text-right text-xs text-gray-400 font-mono self-end sm:self-center">
                {ev.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
