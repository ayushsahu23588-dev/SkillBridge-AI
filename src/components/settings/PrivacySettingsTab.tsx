import React, { useState, useEffect } from 'react';
import {
  Shield,
  Eye,
  Lock,
  Users,
  CheckCircle,
  Save,
  FileCheck,
  Building,
  Sparkles,
  BarChart2,
  Mail,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrivacySettingsState } from '../../types/settings';

interface PrivacySettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
  saveTrigger?: number;
  onSaveComplete?: (success: boolean) => void;
}

const DEFAULT_PRIVACY: PrivacySettingsState = {
  profileVisibility: 'campus_only',
  recruiterVisibility: true,
  skillVisibility: true,
  portfolioVisibility: true,
  internshipRecommendation: true,

  facultyProfileVisibility: 'all',
  showContactEmail: true,
  showResearchInterests: true,
  showOfficeHours: true,

  companyProfileVisibility: 'public',
  showRecruiterContact: true,
  allowDirectCandidateInquiries: true,
  showHiringStatistics: true,

  institutionVisibility: 'public',
  showPlacementStatistics: true,
  showAccreditationData: true,
  allowCorporateOutreach: true,
};

export const PrivacySettingsTab: React.FC<PrivacySettingsTabProps> = ({
  onDirtyChange,
  saveTrigger,
  onSaveComplete,
}) => {
  const { currentUser, showToast } = useApp();
  const role = currentUser?.role || 'student';
  const storageKey = `edubridge_privacy_settings_${currentUser?.id || 'demo'}`;

  const [settings, setSettings] = useState<PrivacySettingsState>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return { ...DEFAULT_PRIVACY, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_PRIVACY;
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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setInitialSettings(settings);
      setSaveSuccess('Privacy preferences saved successfully.');
      showToast('Privacy settings updated.', 'success');
      onSaveComplete?.(true);
    } catch {
      showToast('Failed to save privacy settings.', 'error');
      onSaveComplete?.(false);
    } finally {
      setIsSaving(false);
    }
  };

  const renderToggle = (
    checked: boolean,
    onChange: () => void,
    title: string,
    description: string,
    icon: React.ReactNode,
    id: string
  ) => (
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
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
        role="switch"
        aria-checked={checked}
        id={id}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="privacy-settings-container">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Privacy & Data Sharing</h2>
        <p className="text-sm text-muted-foreground">
          Control your profile visibility, recruiter discovery options, and AI recommendation permissions.
        </p>
      </div>

      {saveSuccess && (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
          id="privacy-save-success-alert"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveSuccess}</p>
        </div>
      )}

      {/* ================= STUDENT PRIVACY ================= */}
      {role === 'student' && (
        <div className="space-y-5">
          {/* Profile Visibility Tier */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Profile Visibility Scope</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'public',
                  title: 'Public',
                  desc: 'Visible to all verified companies and recruiting partners on SkillBridge.',
                },
                {
                  id: 'campus_only',
                  title: 'Campus Only',
                  desc: 'Visible to your institution faculty, peers, and campus drive recruiters.',
                },
                {
                  id: 'private',
                  title: 'Private',
                  desc: 'Only visible to companies where you explicitly submit job applications.',
                },
              ].map((tier) => {
                const isSelected = settings.profileVisibility === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setSettings((prev) => ({
                        ...prev,
                        profileVisibility: tier.id as any,
                      }));
                      setSaveSuccess(null);
                    }}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-background/50 hover:bg-muted/30'
                    }`}
                    id={`visibility-tier-${tier.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{tier.title}</span>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tier.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Discovery & Information Controls
            </h3>
            <div className="space-y-3">
              {renderToggle(
                settings.recruiterVisibility,
                () => setSettings((p) => ({ ...p, recruiterVisibility: !p.recruiterVisibility })),
                'Recruiter Talent Pool Discovery',
                'Allow verified recruiters to discover your profile through talent search and filter queries.',
                <Users className="h-4 w-4" />,
                'toggle-recruiter-visibility'
              )}

              {renderToggle(
                settings.skillVisibility,
                () => setSettings((p) => ({ ...p, skillVisibility: !p.skillVisibility })),
                'Verified Skill Scores Visibility',
                'Display your AI-assessed skill benchmark badges and coding assessment results to companies.',
                <FileCheck className="h-4 w-4" />,
                'toggle-skill-visibility'
              )}

              {renderToggle(
                settings.portfolioVisibility,
                () => setSettings((p) => ({ ...p, portfolioVisibility: !p.portfolioVisibility })),
                'Digital Portfolio & Project Links',
                'Allow companies to view your GitHub repositories, live demo URLs, and project writeups.',
                <Eye className="h-4 w-4" />,
                'toggle-portfolio-visibility'
              )}

              {renderToggle(
                settings.internshipRecommendation,
                () => setSettings((p) => ({ ...p, internshipRecommendation: !p.internshipRecommendation })),
                'AI Internship Recommendation Engine',
                'Permit our neural matching engine to benchmark your profile and recommend you directly to partnering enterprises.',
                <Sparkles className="h-4 w-4" />,
                'toggle-ai-recommendation'
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= FACULTY PRIVACY ================= */}
      {role === 'faculty' && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Faculty Privacy Preferences
          </h3>
          <div className="space-y-3">
            {renderToggle(
              settings.showContactEmail,
              () => setSettings((p) => ({ ...p, showContactEmail: !p.showContactEmail })),
              'Public Contact Email',
              'Display institutional email address on faculty directory and student mentorship listings.',
              <Mail className="h-4 w-4" />,
              'toggle-faculty-email'
            )}

            {renderToggle(
              settings.showResearchInterests,
              () => setSettings((p) => ({ ...p, showResearchInterests: !p.showResearchInterests })),
              'Show Research & Consultancy Interests',
              'Expose areas of expertise to industry partners looking for academic consultancy.',
              <Award className="h-4 w-4" />,
              'toggle-faculty-research'
            )}

            {renderToggle(
              settings.showOfficeHours,
              () => setSettings((p) => ({ ...p, showOfficeHours: !p.showOfficeHours })),
              'Office Hours Availability',
              'Allow students and mentee cohorts to view weekly scheduled office hours.',
              <Users className="h-4 w-4" />,
              'toggle-faculty-hours'
            )}
          </div>
        </div>
      )}

      {/* ================= INDUSTRY PRIVACY ================= */}
      {role === 'company' && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            Corporate Privacy & Recruiter Visibility
          </h3>
          <div className="space-y-3">
            {renderToggle(
              settings.showRecruiterContact,
              () => setSettings((p) => ({ ...p, showRecruiterContact: !p.showRecruiterContact })),
              'Display Recruiter Contact Info',
              'Show recruiter contact details to shortlisted candidates and university placement directors.',
              <Mail className="h-4 w-4" />,
              'toggle-industry-contact'
            )}

            {renderToggle(
              settings.allowDirectCandidateInquiries,
              () =>
                setSettings((p) => ({
                  ...p,
                  allowDirectCandidateInquiries: !p.allowDirectCandidateInquiries,
                })),
              'Allow Candidate Inquiries',
              'Permit applicants with 85%+ AI match score to send direct questions regarding job openings.',
              <Users className="h-4 w-4" />,
              'toggle-industry-inquiries'
            )}

            {renderToggle(
              settings.showHiringStatistics,
              () => setSettings((p) => ({ ...p, showHiringStatistics: !p.showHiringStatistics })),
              'Publish Hiring & Acceptance Metrics',
              'Display university hiring track record and internship conversion rates on your company profile.',
              <BarChart2 className="h-4 w-4" />,
              'toggle-industry-stats'
            )}
          </div>
        </div>
      )}

      {/* ================= INSTITUTION PRIVACY ================= */}
      {(role === 'college_admin' || role === 'super_admin') && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            Institutional Visibility & Accreditation Controls
          </h3>
          <div className="space-y-3">
            {renderToggle(
              settings.showPlacementStatistics,
              () =>
                setSettings((p) => ({
                  ...p,
                  showPlacementStatistics: !p.showPlacementStatistics,
                })),
              'Public Placement Statistics',
              'Make verified batch placement statistics and CTC packages visible on the university public portal.',
              <BarChart2 className="h-4 w-4" />,
              'toggle-inst-stats'
            )}

            {renderToggle(
              settings.showAccreditationData,
              () =>
                setSettings((p) => ({
                  ...p,
                  showAccreditationData: !p.showAccreditationData,
                })),
              'NAAC / NIRF Accreditation Badges',
              'Display verified institutional accreditation scores to visiting corporate recruiters.',
              <Award className="h-4 w-4" />,
              'toggle-inst-accreditation'
            )}

            {renderToggle(
              settings.allowCorporateOutreach,
              () =>
                setSettings((p) => ({
                  ...p,
                  allowCorporateOutreach: !p.allowCorporateOutreach,
                })),
              'Allow Verified Corporate Outreach',
              'Permit new verified enterprises to initiate campus recruitment drives and MoU partnerships.',
              <Users className="h-4 w-4" />,
              'toggle-inst-outreach'
            )}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {isDirty ? (
            <span className="font-medium text-amber-500">You have unsaved privacy changes</span>
          ) : (
            <span>Privacy controls up to date</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isDirty && (
            <button
              type="button"
              onClick={() => setSettings(initialSettings)}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              id="reset-privacy-btn"
            >
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
            id="save-privacy-btn"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Privacy Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
