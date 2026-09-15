import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Briefcase,
  Bell,
  Sliders,
  Award,
} from 'lucide-react';

export const InstitutionSettingsView: React.FC = () => {
  const { institutionSettings, updateInstitutionSettings, isDarkMode, showToast } = useApp();

  // Placement Policy State
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [minReadiness, setMinReadiness] = useState('70');
  const [maxOffers, setMaxOffers] = useState('2');
  const [dreamThreshold, setDreamThreshold] = useState('20.0');

  // Internship Policy State
  const [requireTpoSignoff, setRequireTpoSignoff] = useState(true);
  const [minInternshipWeeks, setMinInternshipWeeks] = useState('8');

  // Notifications State
  const [notifyPlacementDrives, setNotifyPlacementDrives] = useState(true);
  const [notifySkillDeficits, setNotifySkillDeficits] = useState(true);
  const [notifyMouRenewals, setNotifyMouRenewals] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitutionSettings({
      ...institutionSettings,
    });
    showToast('Institutional governance and placement policies updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Institutional Governance & Policy Settings</span>
          </h2>
          <p className="text-xs text-gray-400">
            Configure campus placement eligibility rules, internship accreditation policies, and administrative alerts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Campus Placement Policy */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="pb-4 border-b border-gray-100 dark:border-white/5 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Campus Placement Eligibility Policy</h3>
              <p className="text-xs text-gray-400">Governs student shortlisting rules for on-campus corporate drives</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Minimum Qualifying CGPA</label>
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="10.0"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Students below this threshold cannot view Tier-1 recruitment drives.
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1">Minimum Verified Skill Readiness Score (%)</label>
              <input
                type="number"
                min="40"
                max="100"
                value={minReadiness}
                onChange={(e) => setMinReadiness(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Benchmarked from AI assessments and technical coding tests.
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1">Maximum Regular Offers per Student</label>
              <input
                type="number"
                min="1"
                max="5"
                value={maxOffers}
                onChange={(e) => setMaxOffers(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Once reached, candidate is locked from general recruiting drives.
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1">Dream Company CTC Threshold (₹ LPA)</label>
              <input
                type="number"
                step="0.5"
                value={dreamThreshold}
                onChange={(e) => setDreamThreshold(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none font-bold text-emerald-500 ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Packages above this threshold bypass the single-offer lock.
              </span>
            </div>
          </div>
        </div>

        {/* Internship Accreditation Policy */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="pb-4 border-b border-gray-100 dark:border-white/5 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Experiential Internship Policy</h3>
              <p className="text-xs text-gray-400">Academic guidelines for industrial internship credits</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={requireTpoSignoff}
                onChange={(e) => setRequireTpoSignoff(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <span className="font-bold block text-gray-900 dark:text-white">
                  Mandate Institutional TPO Approval for External Internships
                </span>
                <span className="text-gray-400 text-[11px]">
                  Students must submit corporate offer letters for vetting prior to joining.
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold mb-1">Minimum Internship Duration (Weeks)</label>
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={minInternshipWeeks}
                  onChange={(e) => setMinInternshipWeeks(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Notification Preferences */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="pb-4 border-b border-gray-100 dark:border-white/5 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Automated Administrative Alerts</h3>
              <p className="text-xs text-gray-400">System triggers for institutional officers</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold block text-gray-900 dark:text-white">
                  Campus Recruitment Drive Updates
                </span>
                <span className="text-gray-400 text-[11px]">
                  Receive notifications when partner companies submit campus drive schedules.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyPlacementDrives}
                onChange={(e) => setNotifyPlacementDrives(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold block text-gray-900 dark:text-white">
                  Skill Deficit Threshold Warnings
                </span>
                <span className="text-gray-400 text-[11px]">
                  Alert when an academic branch shows &gt;25% gap in core industry competencies.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifySkillDeficits}
                onChange={(e) => setNotifySkillDeficits(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold block text-gray-900 dark:text-white">
                  Corporate MoU Expiration & Renewal Alerts
                </span>
                <span className="text-gray-400 text-[11px]">
                  Trigger renewal review 60 days before institutional partnership expiry.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyMouRenewals}
                onChange={(e) => setNotifyMouRenewals(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Governance Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
