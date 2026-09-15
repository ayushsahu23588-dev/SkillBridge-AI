import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Bell,
  Eye,
  Shield,
  Moon,
  Sun,
  Download,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Smartphone,
  Globe,
  Trash2,
} from 'lucide-react';

export const StudentSettingsView: React.FC = () => {
  const {
    studentProfile,
    updateStudentSettings,
    isDarkMode,
    toggleDarkMode,
    showToast,
  } = useApp();

  const [settings, setSettings] = useState(
    studentProfile.settings || {
      emailNotifications: true,
      jobAlerts: true,
      interviewReminders: true,
      publicPortfolio: true,
      shareProfileWithRecruiters: true,
    }
  );

  const [copiedLink, setCopiedLink] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    updateStudentSettings(updated);
  };

  const handleCopyPortfolioLink = () => {
    const link = `https://edubridge.ai/portfolio/${studentProfile.id}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast('Public portfolio link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(studentProfile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentProfile.name.replace(/\s+/g, '_')}_EduBridge_Profile.json`;
    link.click();
    showToast('Student profile data package exported!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Student Portal Settings
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
          Manage privacy, recruiter visibility, notification triggers, and data preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Recruiter Visibility & Public Showcase */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              Recruiter Visibility & Portfolio Sharing
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Allow Verified Corporate Recruiters to View Profile
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Featured on hiring partner dashboards for direct interview outreach
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.shareProfileWithRecruiters}
                onChange={() => handleToggle('shareProfileWithRecruiters')}
                className="w-5 h-5 text-blue-600 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Public Showcase Portfolio
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Enable a public shareable URL with verified projects and credentials
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.publicPortfolio}
                onChange={() => handleToggle('publicPortfolio')}
                className="w-5 h-5 text-blue-600 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>

            {settings.publicPortfolio && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200 font-mono truncate w-full sm:w-auto font-normal">
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">
                    https://edubridge.ai/portfolio/{studentProfile.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPortfolioLink}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Toggles */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Instant Email Notifications
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Receive email alerts for status changes and recruiter direct messages
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="w-5 h-5 text-blue-600 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  AI Job Match & Internship Alerts
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Weekly digest of high-match openings aligned with your skill profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.jobAlerts}
                onChange={() => handleToggle('jobAlerts')}
                className="w-5 h-5 text-blue-600 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Interview & Mentorship Reminders (SMS/Calendar)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  1-hour advance reminders before scheduled live meetings
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.interviewReminders}
                onChange={() => handleToggle('interviewReminders')}
                className="w-5 h-5 text-blue-600 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Data Export & Account Security */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              Data Management & Backup
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Export Complete Student Dossier
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                Download all verified projects, skill ratings, education records, and activity timeline as a structured JSON bundle
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
