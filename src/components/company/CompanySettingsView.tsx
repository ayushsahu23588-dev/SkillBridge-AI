import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Sparkles,
  Shield,
  Sliders,
  Save,
  CheckCircle2,
  Key,
  Webhook,
  Mail,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompanySettingsView: React.FC = () => {
  const { companySettings, updateCompanySettings, showToast } = useApp();

  const [settings, setSettings] = useState(companySettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(settings);
    showToast('Recruitment preferences & AI screening parameters updated successfully!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            Recruitment Configuration
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Company & ATS Automation Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Configure automated AI resume filtering thresholds, campus drive eligibility rules, and synchronization alerts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* AI Screening Engine Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI Automated Screening Rules</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Automated Resume ATS Audit
                </span>
                <span className="text-[11px] text-gray-500">
                  Instantly compute match score upon student application
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoScreenResumes}
                onChange={(e) => setSettings({ ...settings, autoScreenResumes: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Minimum AI Match Score Threshold
                </span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {settings.minMatchScoreCutoff}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={settings.minMatchScoreCutoff}
                onChange={(e) => setSettings({ ...settings, minMatchScoreCutoff: Number(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Applicants below this score are tagged for manual recruiter review.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Default Academic GPA Cutoff
              </label>
              <input
                type="number"
                step="0.1"
                min="2.0"
                max="4.0"
                value={settings.minGpaCutoff}
                onChange={(e) => setSettings({ ...settings, minGpaCutoff: parseFloat(e.target.value) || 3.0 })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Preferred Virtual Meeting Provider
              </label>
              <select
                value={settings.defaultInterviewPlatform}
                onChange={(e) => setSettings({ ...settings, defaultInterviewPlatform: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Google Meet">Google Meet (Seamless Calendar Integration)</option>
                <option value="Zoom">Zoom Video Communications</option>
                <option value="MS Teams">Microsoft Teams</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Digest */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            <Bell className="w-4 h-4 text-purple-500" />
            <span>Recruitment Alerts & Notifications</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  New Applicant Instant Alerts
                </span>
                <span className="text-[11px] text-gray-500">
                  Notify hiring team immediately when a 90%+ fit student applies
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlertsOnNewApplicant}
                onChange={(e) => setSettings({ ...settings, emailAlertsOnNewApplicant: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Offer Status Webhook Notifications
                </span>
                <span className="text-[11px] text-gray-500">
                  Send immediate alert when student accepts or declines an offer
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlertsOnOfferStatus}
                onChange={(e) => setSettings({ ...settings, emailAlertsOnOfferStatus: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Daily Recruitment Digest
                </span>
                <span className="text-[11px] text-gray-500">
                  Receive a morning executive briefing of upcoming interviews & candidate volume
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.dailyDigestEmail}
                onChange={(e) => setSettings({ ...settings, dailyDigestEmail: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Recruiter Notification Dispatch Email
              </label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ATS Integrations & API Sync */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>External ATS & Slack Pipeline Sync</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Active Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-150 dark:border-gray-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Greenhouse ATS</span>
                <span className="text-[10px] text-emerald-600 font-bold">Connected</span>
              </div>
              <p className="text-[11px] text-gray-500">Auto-push accepted candidates into Greenhouse pipeline</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-150 dark:border-gray-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Slack Channel Bot</span>
                <span className="text-[10px] text-emerald-600 font-bold">#campus-hiring</span>
              </div>
              <p className="text-[11px] text-gray-500">Live interview alerts and celebratory offer acceptance pings</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-150 dark:border-gray-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Google Calendar</span>
                <span className="text-[10px] text-emerald-600 font-bold">Synchronized</span>
              </div>
              <p className="text-[11px] text-gray-500">Real-time room booking and multi-interviewer schedule holds</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
