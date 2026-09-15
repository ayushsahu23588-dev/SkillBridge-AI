import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const CertificateApprovals: React.FC = () => {
  const { studentProfile, verifyStudentCertificate, showToast } = useApp();

  const certifications = studentProfile.certifications;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-blue-900/40 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Institutional Credential Verifier
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Certificate & Micro-Credential Approvals Queue
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Inspect student credential hashes, check issuing vendor credibility, and issue cryptographic institutional stamps for placement dossiers.
          </p>
        </div>
      </div>

      {/* Certifications Queue */}
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            id={`cert-approval-card-${cert.id}`}
            className={`p-6 rounded-3xl border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              cert.verified
                ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-900/60'
                : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  cert.verified
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cert.verified
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {cert.verified ? 'Verified & Endorsed' : 'Pending Verification'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Student: <span className="font-semibold text-gray-800 dark:text-gray-200">{studentProfile.name}</span> ({studentProfile.department}) • Issuer: {cert.issuer}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                  <span>Submitted: {cert.issueDate}</span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect Credential Hash</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {cert.verified && cert.verifiedByFacultyName && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    ✓ Endorsed by {cert.verifiedByFacultyName} on {cert.verificationDate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {!cert.verified ? (
                <button
                  id={`verify-cert-btn-${cert.id}`}
                  onClick={() => verifyStudentCertificate(cert.id, 'Dr. Evelyn Vance')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Stamp</span>
                </button>
              ) : (
                <span className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verified Stamped
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
