import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileText,
  AlertTriangle,
  X,
  Check,
  Sliders,
} from 'lucide-react';

interface PrivacyAndSecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyAndSecuritySettingsModal: React.FC<PrivacyAndSecuritySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { privacySecurityConfig, updatePrivacySecurityConfig, currentUser } = useApp();

  if (!isOpen) return null;

  const toggleStudentPrivacy = (key: keyof typeof privacySecurityConfig.studentPrivacy) => {
    updatePrivacySecurityConfig({
      studentPrivacy: {
        ...privacySecurityConfig.studentPrivacy,
        [key]: !privacySecurityConfig.studentPrivacy[key],
      },
    });
  };

  const toggleRecruiterSecurity = (key: keyof typeof privacySecurityConfig.recruiterSecurity) => {
    updatePrivacySecurityConfig({
      recruiterSecurity: {
        ...privacySecurityConfig.recruiterSecurity,
        [key]: !privacySecurityConfig.recruiterSecurity[key],
      },
    });
  };

  const togglePlacementAudit = (key: keyof typeof privacySecurityConfig.placementCellAudit) => {
    updatePrivacySecurityConfig({
      placementCellAudit: {
        ...privacySecurityConfig.placementCellAudit,
        [key]: !privacySecurityConfig.placementCellAudit[key],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-[#181920] w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Role-Based Privacy & Security Controls
              </h3>
              <p className="text-xs text-gray-500">
                Configure student identity privacy, recruiter PII redaction, and audit safeguards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Student Data Privacy Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Student Identity & Contact Privacy
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Mask Contact Info Until Shortlisted
                </span>
                <span className="text-[11px] text-gray-500">
                  Redacts student phone number and email address from general recruiter search; revealed only upon formal interview shortlisting.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.studentPrivacy.maskContactUntilShortlist}
                onChange={() => toggleStudentPrivacy('maskContactUntilShortlist')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Restrict Transcripts to Verified Recruiters Only
                </span>
                <span className="text-[11px] text-gray-500">
                  Academic marksheets and official transcripts remain gated until corporate partnership and MOU credentials are confirmed.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.studentPrivacy.restrictTranscriptsToVerifiedRecruiters}
                onChange={() => toggleStudentPrivacy('restrictTranscriptsToVerifiedRecruiters')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Anonymize Student Feedback Submissions
                </span>
                <span className="text-[11px] text-gray-500">
                  Omits personal names from company interview and placement feedback records to preserve candidate privacy.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.studentPrivacy.anonymizeFeedbackSubmissions}
                onChange={() => toggleStudentPrivacy('anonymizeFeedbackSubmissions')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Recruiter Access & Gating Controls */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Recruiter Access Safeguards
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Require Verified Status for Candidate Exports
                </span>
                <span className="text-[11px] text-gray-500">
                  Unverified recruiters cannot bulk download student resumes or export candidate phone registries.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.recruiterSecurity.requireVerifiedStatusForDownloads}
                onChange={() => toggleRecruiterSecurity('requireVerifiedStatusForDownloads')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Two-Factor Authentication (2FA) Mandatory
                </span>
                <span className="text-[11px] text-gray-500">
                  Requires TOTP authentication token for company hiring team logins.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.recruiterSecurity.twoFactorAuthenticationMandatory}
                onChange={() => toggleRecruiterSecurity('twoFactorAuthenticationMandatory')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Placement Cell Audit & Compliance */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Placement Cell Audit & Tamper Evident Logging
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Log All Eligibility Waivers & Overrides
                </span>
                <span className="text-[11px] text-gray-500">
                  Records officer ID, timestamp, and justification whenever an eligibility rule is waived.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.placementCellAudit.logAllEligibilityWaivers}
                onChange={() => togglePlacementAudit('logAllEligibilityWaivers')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Watermark Exported Placement Reports
                </span>
                <span className="text-[11px] text-gray-500">
                  Injects cryptographic reference ID and viewing officer credentials into all PDF and CSV exports.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacySecurityConfig.placementCellAudit.watermarkExportedReports}
                onChange={() => togglePlacementAudit('watermarkExportedReports')}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            Done & Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
