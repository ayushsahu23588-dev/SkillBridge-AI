import React, { useState, useEffect } from 'react';
import {
  Bell,
  Briefcase,
  GraduationCap,
  FileCheck,
  Calendar,
  BookOpen,
  Users,
  Building2,
  Cpu,
  CheckCircle,
  Save,
  Mail,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationSettingsState } from '../../types/settings';

interface NotificationSettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
  saveTrigger?: number;
  onSaveComplete?: (success: boolean) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationSettingsState = {
  internshipNotifications: true,
  jobNotifications: true,
  placementUpdates: true,
  applicationUpdates: true,
  workshopNotifications: false,
  trainingNotifications: true,
  mentorshipNotifications: true,
  collaborationNotifications: true,
  systemNotifications: true,
  emailDigest: true,
  pushNotifications: false,
};

export const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({
  onDirtyChange,
  saveTrigger,
  onSaveComplete,
}) => {
  const { currentUser, showToast } = useApp();
  const userId = currentUser?.id || 'demo_user';
  const storageKey = `edubridge_notification_settings_${userId}`;

  const [settings, setSettings] = useState<NotificationSettingsState>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [initialSettings, setInitialSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (saveTrigger && saveTrigger > 0 && isDirty) {
      handleSave();
    }
  }, [saveTrigger]);

  const toggleSetting = (key: keyof NotificationSettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setInitialSettings(settings);
      setSaveSuccess('Notification preferences saved successfully.');
      showToast('Notification preferences updated.', 'success');
      onSaveComplete?.(true);
    } catch {
      showToast('Failed to save notification settings.', 'error');
      onSaveComplete?.(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle item helper
  const renderToggleItem = (
    key: keyof NotificationSettingsState,
    title: string,
    description: string,
    icon: React.ReactNode
  ) => {
    const isChecked = settings[key];
    return (
      <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleSetting(key)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isChecked ? 'bg-primary' : 'bg-muted'
          }`}
          role="switch"
          aria-checked={isChecked}
          id={`toggle-${key}-btn`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="notification-settings-container">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Control when and how SkillBridge AI alerts you regarding opportunities, placements, and milestones.
        </p>
      </div>

      {saveSuccess && (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
          id="notif-save-success-alert"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveSuccess}</p>
        </div>
      )}

      {/* 9 Required Notification Toggle Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Event & Opportunity Triggers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderToggleItem(
            'internshipNotifications',
            'Internship Notifications',
            'Get notified about new matching internship opportunities and deadlines.',
            <Briefcase className="h-4 w-4" />
          )}

          {renderToggleItem(
            'jobNotifications',
            'Job Notifications',
            'Receive alerts for high-match graduate job openings from partner companies.',
            <Briefcase className="h-4 w-4" />
          )}

          {renderToggleItem(
            'placementUpdates',
            'Placement Updates',
            'Stay informed on campus drive schedules, test links, and offer rollouts.',
            <GraduationCap className="h-4 w-4" />
          )}

          {renderToggleItem(
            'applicationUpdates',
            'Application Updates',
            'Real-time updates when employers review, shortlist, or schedule interviews.',
            <FileCheck className="h-4 w-4" />
          )}

          {renderToggleItem(
            'workshopNotifications',
            'Workshop Notifications',
            'Announcements for upcoming technical workshops, hackathons, and webinars.',
            <Calendar className="h-4 w-4" />
          )}

          {renderToggleItem(
            'trainingNotifications',
            'Training Notifications',
            'Reminders for industrial training cohorts, module milestones, and labs.',
            <BookOpen className="h-4 w-4" />
          )}

          {renderToggleItem(
            'mentorshipNotifications',
            'Mentorship Notifications',
            'Notifications for scheduled mentor sessions, feedback, and 1:1 guidance.',
            <Users className="h-4 w-4" />
          )}

          {renderToggleItem(
            'collaborationNotifications',
            'Industry Collaboration Notifications',
            'Updates on joint R&D projects, faculty externships, and guest lectures.',
            <Building2 className="h-4 w-4" />
          )}

          <div className="md:col-span-2">
            {renderToggleItem(
              'systemNotifications',
              'System Notifications',
              'Crucial security alerts, scheduled maintenance, and platform updates.',
              <Cpu className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* Delivery Channels */}
      <div className="pt-4 border-t border-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Delivery Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderToggleItem(
            'emailDigest',
            'Weekly Email Digest',
            'A weekly summary of skill progress, trending jobs, and recommended webinars.',
            <Mail className="h-4 w-4" />
          )}

          {renderToggleItem(
            'pushNotifications',
            'Mobile Push Alerts',
            'Instant notifications delivered to your desktop or mobile browser.',
            <Smartphone className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {isDirty ? (
            <span className="font-medium text-amber-500">Unsaved notification preference changes</span>
          ) : (
            <span>All notification preferences saved</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isDirty && (
            <button
              type="button"
              onClick={() => setSettings(initialSettings)}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              id="reset-notifications-btn"
            >
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
            id="save-notifications-btn"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Notification Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
