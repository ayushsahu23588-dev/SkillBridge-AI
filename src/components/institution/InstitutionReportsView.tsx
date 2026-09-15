import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Filter,
  Layers,
  Award,
  TrendingUp,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const InstitutionReportsView: React.FC = () => {
  const {
    institutionStudents,
    institutionPlacements,
    institutionCollaborations,
    facultyMembers,
    isDarkMode,
    showToast,
  } = useApp();

  const [selectedReportId, setSelectedReportId] = useState('rep_1');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('Class of 2026');

  const reportCategories = [
    {
      id: 'rep_1',
      title: 'Student Skill & Readiness Report',
      standard: 'NAAC Criteria 1 & 2 • NBA Outcome Benchmark',
      description: 'Comprehensive evaluation of student competency masteries, technical assessment scores, and program outcome attainments.',
    },
    {
      id: 'rep_2',
      title: 'Campus Placement & CTC Analytics',
      standard: 'NIRF Ranking Metric 3 (Graduation Outcomes)',
      description: 'Audited record of student campus placements, median & highest CTC packages, dream offers, and top recruiters.',
    },
    {
      id: 'rep_3',
      title: 'Internship & Industrial Exposure Audit',
      standard: 'AICTE Mandatory Internship Policy',
      description: 'Compliance verification of experiential student internships, industry credit hours, and corporate host evaluations.',
    },
    {
      id: 'rep_4',
      title: 'Curriculum Gap & Skill Demand Matrix',
      standard: 'Industry 4.0 Syllabus Alignment',
      description: 'Divergence analysis between industry technology requirements and university departmental curricula.',
    },
    {
      id: 'rep_5',
      title: 'Corporate MoUs & Industry Engagement',
      standard: 'NAAC Criteria 3.5 (Collaborations)',
      description: 'Active institutional Memorandums of Understanding, joint laboratory grants, and corporate consultancy engagements.',
    },
  ];

  const currentReport = reportCategories.find((r) => r.id === selectedReportId) || reportCategories[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csvData = `Report: ${currentReport.title}\nStandard: ${currentReport.standard}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    if (selectedReportId === 'rep_2') {
      csvData += 'Student,Company,Role,Department,CTC Package,Date\n';
      institutionPlacements.forEach((p) => {
        csvData += `"${p.studentName}","${p.company}","${p.role}","${p.department}","${p.packageRange}","${p.date}"\n`;
      });
    } else {
      csvData += 'Roll Number,Name,Department,Year,Skill Readiness,Internship,Placement\n';
      institutionStudents.forEach((s) => {
        csvData += `"${s.rollNumber || s.id}","${s.name}","${s.department}","${s.year}","${s.skillReadiness || 75}%","${s.internshipStatus || 'N/A'}","${s.placementStatus || 'Eligible'}"\n`;
      });
    }

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Downloaded ${currentReport.title} CSV`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>Accreditation & Institutional Reports</span>
          </h2>
          <p className="text-xs text-gray-400">
            Generate audited reports for NAAC, NBA, and NIRF institutional evaluations and internal academic audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Categories Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reportCategories.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setSelectedReportId(rep.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedReportId === rep.id
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 bg-white dark:bg-[#18191E]'
            }`}
          >
            <span className="text-[10px] font-bold text-blue-500 block mb-1 uppercase tracking-wider">
              {rep.standard}
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
              {rep.title}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {rep.description}
            </p>
          </div>
        ))}
      </div>

      {/* Report Document Preview */}
      <div
        className={`rounded-2xl p-6 border transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="pb-4 border-b border-gray-100 dark:border-white/5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block">
              Official Institutional Report
            </span>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              {currentReport.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Apex National Institute of Technology • AISHE: C-18492 • Generated {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Accreditation Verified
            </span>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 mb-6 text-xs">
          <div>
            <span className="text-gray-400 block mb-0.5 font-semibold">Total Evaluated Cohort</span>
            <span className="text-base font-black">{institutionStudents.length} Students</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5 font-semibold">Verified Placement Offers</span>
            <span className="text-base font-black text-emerald-500">{institutionPlacements.length}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5 font-semibold">Corporate MoUs Signed</span>
            <span className="text-base font-black text-purple-500">{institutionCollaborations.length}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5 font-semibold">Attainment Rating</span>
            <span className="text-base font-black text-blue-500">94.2% (Grade A++)</span>
          </div>
        </div>

        {/* Dynamic Table Preview */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-gray-400 font-semibold">
                <th className="py-2.5 px-3">Metric Identifier</th>
                <th className="py-2.5 px-3">Accreditation Target</th>
                <th className="py-2.5 px-3">Achieved Benchmark</th>
                <th className="py-2.5 px-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <tr>
                <td className="py-2.5 px-3 font-semibold">Core Student Skill Readiness Index</td>
                <td className="py-2.5 px-3 text-gray-400">&ge; 70% Across All Branches</td>
                <td className="py-2.5 px-3 font-bold text-emerald-500">79.4% Institutional Avg</td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-500 font-bold">Compliant (Exceeded)</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Undergraduate Placement Conversion</td>
                <td className="py-2.5 px-3 text-gray-400">&ge; 75% of Eligible Cohort</td>
                <td className="py-2.5 px-3 font-bold text-emerald-500">82.1% Secured Offers</td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-500 font-bold">Compliant</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Mandatory Industrial Internship Completion</td>
                <td className="py-2.5 px-3 text-gray-400">100% of Final Year Students</td>
                <td className="py-2.5 px-3 font-bold text-blue-500">96.8% In Progress / Done</td>
                <td className="py-2.5 px-3">
                  <span className="text-blue-500 font-bold">In Progress</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Industry Collaborative MoUs</td>
                <td className="py-2.5 px-3 text-gray-400">Min. 5 Active per Department</td>
                <td className="py-2.5 px-3 font-bold text-emerald-500">6.2 Avg MoUs per Dept</td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-500 font-bold">Compliant</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2">
          <span>Official seal and registrar sign-off embedded in downloaded audit archive.</span>
          <span className="font-mono">Verification Hash: 8F2A9-APEX-2026-ACCRED</span>
        </div>
      </div>
    </div>
  );
};
