import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  Upload,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  Lock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompanyVerificationView: React.FC = () => {
  const { currentCompany, requestCompanyVerification, verifyCompany, currentUser, showToast } = useApp();

  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Certificate of Incorporation');
  const [isUploading, setIsUploading] = useState(false);

  const verificationStatus = currentCompany.verificationStatus || (currentCompany.verified ? 'Verified' : 'Pending');

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    setIsUploading(true);
    setTimeout(() => {
      requestCompanyVerification({
        title: docTitle.trim(),
        type: docType,
        fileUrl: 'https://example.com/legal/company-compliance.pdf',
      });
      setIsUploading(false);
      setDocTitle('');
    }, 600);
  };

  const defaultDocs = currentCompany.verificationDocs || [
    {
      id: 'vdoc_1',
      title: 'State Corporate Articles of Incorporation',
      type: 'Certificate of Incorporation',
      fileUrl: 'https://example.com/legal/articles-of-incorporation.pdf',
      uploadedAt: '2025-01-15',
      status: 'Approved' as const,
      notes: 'Verified against State Corporate Registry',
    },
    {
      id: 'vdoc_2',
      title: 'Enterprise EIN & Federal Tax Identification',
      type: 'Tax & Compliance ID',
      fileUrl: 'https://example.com/legal/tax-w9.pdf',
      uploadedAt: '2025-01-16',
      status: 'Approved' as const,
      notes: 'Federal EIN match confirmed',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                verificationStatus === 'Verified'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : verificationStatus === 'Under Review'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Status: {verificationStatus}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Enterprise Verification & Campus Accreditation
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
            Verified enterprise partners gain instant access to unredacted student candidate portfolios, direct campus drive scheduling, and institutional MOU signing.
          </p>
        </div>

        {verificationStatus !== 'Verified' && (
          <button
            onClick={() => verifyCompany(currentCompany.id)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Instant Admin Verify (Demo)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Upload Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-500" />
                Submit Verification Document
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload business registration proof or campus recruitment agreements.
              </p>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2025 Corporate Certificate of Good Standing"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Document Classification
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Certificate of Incorporation">Certificate of Incorporation</option>
                  <option value="Tax & Compliance ID">Tax & Compliance ID (EIN / GST)</option>
                  <option value="Institutional MOU Agreement">Institutional MOU Agreement</option>
                  <option value="Official Campus Recruitment Authorization">Campus Recruitment Authorization</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center space-y-2 hover:border-purple-500/60 transition-colors">
                <FileText className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Drag & drop PDF / scan or click to browse
                </p>
                <p className="text-[10px] text-gray-400">PDF, PNG or JPG up to 15MB</p>
              </div>

              <button
                type="submit"
                disabled={isUploading || !docTitle.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <span>Encrypting & Submitting...</span>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit for Institutional Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Submitted Verification Documents & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                Verification Records & Institutional Seals ({defaultDocs.length})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                All submitted documents are cryptographically hashed and verified by University Placement Councils.
              </p>
            </div>

            <div className="space-y-3">
              {defaultDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {doc.title}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            doc.status === 'Approved'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Type: {doc.type} • Uploaded on {doc.uploadedAt}
                      </p>
                      {doc.notes && (
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 italic">
                          Audit note: "{doc.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-gray-200 dark:border-gray-700 text-xs font-bold flex items-center gap-1 hover:bg-gray-50"
                    >
                      <span>View File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Privileges */}
          <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 space-y-4">
            <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
              Unlocked Verified Partner Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-purple-900 dark:text-purple-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Direct access to verified student GPA, resume PDF exports, and academic transcripts.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Placement cell priority batch invitations for on-campus and virtual hiring drives.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>AI Automated ATS Matching with customized corporate rubric scoring.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Institutional legally compliant digital offer extension with audit seals.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
