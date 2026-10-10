import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Building2,
  Award,
  X,
  Share2,
} from 'lucide-react';

interface DownloadablePlacementReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadablePlacementReportsModal: React.FC<DownloadablePlacementReportsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { departmentMetrics, institutionPlacements, showToast } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'annual' | 'branch' | 'recruiter' | 'diversity'>('annual');

  if (!isOpen) return null;

  const totalStudents = departmentMetrics.reduce((sum, d) => sum + d.totalStudents, 0);
  const totalPlaced = departmentMetrics.reduce((sum, d) => sum + d.placedStudents, 0);
  const totalOffers = departmentMetrics.reduce((sum, d) => sum + d.totalOffers, 0);
  const overallRate = ((totalPlaced / totalStudents) * 100).toFixed(1);
  const avgPackage = (
    departmentMetrics.reduce((sum, d) => sum + d.averagePackageLpa * d.placedStudents, 0) / totalPlaced
  ).toFixed(1);
  const highestPackage = Math.max(...departmentMetrics.map((d) => d.highestPackageLpa));

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let content = '';
    let filename = '';

    if (activeReportTab === 'annual' || activeReportTab === 'branch') {
      filename = `SkillBridge_Institutional_Placement_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      content = 'Department,Total,Eligible,Placed,Placed %,Total Offers,Avg CTC (LPA),Median CTC (LPA),Highest CTC (LPA),Dream Offers\n';
      departmentMetrics.forEach((d) => {
        content += `"${d.departmentName}",${d.totalStudents},${d.eligibleStudents},${d.placedStudents},${d.placementPercentage}%,${d.totalOffers},${d.averagePackageLpa},${d.medianPackageLpa},${d.highestPackageLpa},${d.dreamOffersCount}\n`;
      });
    } else if (activeReportTab === 'recruiter') {
      filename = `SkillBridge_Recruiter_Offers_Registry_${new Date().toISOString().slice(0, 10)}.csv`;
      content = 'Student Name,Company,Role,Department,Package,Status,Date\n';
      institutionPlacements.forEach((p) => {
        content += `"${p.studentName}","${p.company}","${p.role}","${p.department}","${p.packageRange}","${p.status}","${p.date}"\n`;
      });
    } else {
      filename = `SkillBridge_Diversity_Equity_Placement_${new Date().toISOString().slice(0, 10)}.csv`;
      content = 'Department,Female Placement %,Male Placement %\n';
      departmentMetrics.forEach((d) => {
        content += `"${d.departmentName}",${d.femalePlacementPercentage || 92}%,${(100 - (d.femalePlacementPercentage || 92) * 0.1).toFixed(1)}%\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    showToast(`Downloaded ${filename} successfully!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-[#181920] w-full max-w-4xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>Institutional Placement Reports</span>
            </h3>
            <p className="text-xs text-gray-500">
              Verified annual and departmental placement statements and offer telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-2 overflow-x-auto">
          {[
            { id: 'annual', label: 'Annual Executive Summary' },
            { id: 'branch', label: 'Department Comparative Sheet' },
            { id: 'recruiter', label: 'Company Recruitment Registry' },
            { id: 'diversity', label: 'Diversity & Gender Equity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeReportTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Printable Official Letterhead Preview */}
        <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 bg-gray-50/50 dark:bg-[#121316] space-y-6">
          {/* Institutional Top Heading */}
          <div className="text-center border-b border-gray-200 dark:border-white/10 pb-5">
            <h2 className="text-lg font-black tracking-wider text-gray-900 dark:text-white uppercase">
              Apex National Institute of Technology
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-0.5">
              Directorate of Training & Campus Placements • Academic Year 2025–2026
            </p>
            <span className="text-[10px] text-gray-400 block mt-1">
              Document Ref: NIT/TPO/REP/2026-FINAL • Certified by Dean Arthur Pendelton
            </span>
          </div>

          {/* Report Body */}
          {activeReportTab === 'annual' && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">Total Cohort</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white">{totalStudents}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">Unique Placed</span>
                  <span className="text-lg font-black text-emerald-600">{totalPlaced} ({overallRate}%)</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">Average Package</span>
                  <span className="text-lg font-black text-indigo-600">₹{avgPackage} LPA</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">Highest Package</span>
                  <span className="text-lg font-black text-purple-600">₹{highestPackage} LPA</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white">Accreditation Executive Summary</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  During the 2025–2026 recruitment cycle, Apex National Institute of Technology hosted 142 technology corporations across on-campus, virtual, and hybrid formats. A total of {totalOffers} offers were rolled out to {totalPlaced} unique students, achieving an overall placement rate of {overallRate}%. Dream tier compensation packages (≥20 LPA) increased by 28% year-over-year, anchored by premier hirers Google, Microsoft, Amazon, and Goldman Sachs.
                </p>
              </div>
            </div>
          )}

          {activeReportTab === 'branch' && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-white/5 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Eligible</th>
                    <th className="p-2.5">Placed %</th>
                    <th className="p-2.5">Avg CTC</th>
                    <th className="p-2.5">Peak CTC</th>
                    <th className="p-2.5">Dream Offers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                  {departmentMetrics.map((d) => (
                    <tr key={d.id}>
                      <td className="p-2.5 font-bold">{d.departmentName}</td>
                      <td className="p-2.5">{d.eligibleStudents}</td>
                      <td className="p-2.5 font-bold text-emerald-600">{d.placementPercentage}%</td>
                      <td className="p-2.5">₹{d.averagePackageLpa} LPA</td>
                      <td className="p-2.5 font-black text-purple-600">₹{d.highestPackageLpa} LPA</td>
                      <td className="p-2.5">{d.dreamOffersCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReportTab === 'recruiter' && (
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-500 block">Recent Verified Offer Declarations</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-white/5 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Student</th>
                      <th className="p-2">Recruiter</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Dept</th>
                      <th className="p-2">CTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {institutionPlacements.slice(0, 6).map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-bold">{p.studentName}</td>
                        <td className="p-2">{p.company}</td>
                        <td className="p-2">{p.role}</td>
                        <td className="p-2">{p.department}</td>
                        <td className="p-2 font-bold text-indigo-600">{p.packageRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeReportTab === 'diversity' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">Female Engineers Placed</span>
                  <span className="text-xl font-black text-emerald-600">94.8%</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Exceeding national parity benchmark</span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">Male Engineers Placed</span>
                  <span className="text-xl font-black text-indigo-600">93.2%</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Consistent cross-faculty conversion</span>
                </div>
              </div>
            </div>
          )}

          {/* Signature Stamp Footer */}
          <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-400">
            <div>
              <span>Official Verification Stamp: #SB-NIT-VERIFIED-2026</span>
              <span className="block text-[10px]">Digitally signed via SkillBridge AI Directorate</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-700 dark:text-gray-300 block">Dean Arthur Pendelton</span>
              <span className="text-[10px]">Dean of Academic & Placement Affairs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
