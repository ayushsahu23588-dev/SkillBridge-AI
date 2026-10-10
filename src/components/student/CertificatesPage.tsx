import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Download,
  Share2,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Layers,
  GraduationCap,
  Building2,
  Calendar,
  Copy,
  Check,
  X,
  Upload,
} from 'lucide-react';
import { Certification } from '../../types';

export const CertificatesPage: React.FC = () => {
  const { studentProfile, updateStudentProfile, showToast, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Verified' | 'Pending'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCredentialId, setNewCredentialId] = useState('');
  const [newCredentialUrl, setNewCredentialUrl] = useState('');
  const [requestFacultyVerification, setRequestFacultyVerification] = useState(true);

  const certificates: Certification[] = studentProfile.certifications || [];

  const verifiedCount = certificates.filter((c) => c.verified).length;
  const pendingCount = certificates.filter((c) => !c.verified).length;

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.credentialId && cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterStatus === 'Verified') return matchesSearch && cert.verified;
    if (filterStatus === 'Pending') return matchesSearch && !cert.verified;
    return matchesSearch;
  });

  const handleCopyCredential = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Credential verification code copied!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIssuer.trim()) {
      showToast('Please fill in title and issuing organization', 'error');
      return;
    }

    const newCert: Certification = {
      id: `cert_${Date.now()}`,
      title: newTitle.trim(),
      issuer: newIssuer.trim(),
      issueDate: newDate,
      credentialId: newCredentialId.trim() || `SKILL-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      credentialUrl: newCredentialUrl.trim() || 'https://verify.skillbridge.ai/credentials/preview',
      verified: !requestFacultyVerification,
      verifiedByFacultyName: requestFacultyVerification ? undefined : 'SkillBridge Auto-Verified',
      verificationDate: requestFacultyVerification ? undefined : new Date().toISOString().split('T')[0],
    };

    updateStudentProfile({
      certifications: [newCert, ...certificates],
    });

    showToast(
      requestFacultyVerification
        ? 'Certificate submitted! Faculty endorsement requested.'
        : 'Certificate added to verified portfolio.',
      'success'
    );

    // Reset Form
    setNewTitle('');
    setNewIssuer('');
    setNewCredentialId('');
    setNewCredentialUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div id="certificates-page-root" className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-100 border border-white/20">
              <Award className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Verified Academic & Industry Credentials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Certificates & Achievements
            </h1>
            <p className="text-sm text-purple-100 max-w-xl">
              Showcase verified course certifications, proctored exam badges, and faculty endorsements directly to employers and university placement cells.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#D4F73C] text-[#111216] font-bold text-xs sm:text-sm hover:brightness-105 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certificate</span>
            </button>
            <button
              onClick={() => navigate('/student/portfolio')}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Public Portfolio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Credentials</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{certificates.length}</p>
            <p className="text-[11px] text-gray-400">Recorded on SkillBridge</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Faculty Verified</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{verifiedCount}</p>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
              Academic Seal & Recruiter Ready
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Under Review</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{pendingCount}</p>
            <p className="text-[11px] text-gray-400">Pending Department Approval</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#14151B] p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, organization or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {(['All', 'Verified', 'Pending'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Grid */}
      {filteredCertificates.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No certificates found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'Try a different keyword or reset filters to browse all credentials.'
                : 'Upload your verified certificates from Coursera, AWS, Google, or college workshops.'}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 hover:border-purple-500/40 transition-all shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800/40">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{cert.issuer}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      cert.verified
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {cert.verified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Issued Date:</span>
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{cert.issueDate}</span>
                  </div>

                  {cert.credentialId && (
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                      <span>Credential ID:</span>
                      <div className="flex items-center gap-1 font-mono font-medium text-[11px] text-gray-700 dark:text-gray-300">
                        <span>{cert.credentialId}</span>
                        <button
                          onClick={() => handleCopyCredential(cert.id, cert.credentialId || '')}
                          className="hover:text-purple-600 transition-colors cursor-pointer"
                          title="Copy credential ID"
                        >
                          {copiedId === cert.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {cert.verifiedByFacultyName && (
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200/40 dark:border-white/5">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Faculty Endorser:</span>
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                        {cert.verifiedByFacultyName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => {
                    showToast(`Downloading credential badge for ${cert.title}...`, 'info');
                  }}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Badge</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Certificate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Certificate</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Add an industry credential to your record</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services, Google"
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Credential ID / Serial Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS-PSA-92019481"
                  value={newCredentialId}
                  onChange={(e) => setNewCredentialId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Verification URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.credly.com/badges/..."
                  value={newCredentialUrl}
                  onChange={(e) => setNewCredentialUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/30">
                <input
                  type="checkbox"
                  id="req-faculty"
                  checked={requestFacultyVerification}
                  onChange={(e) => setRequestFacultyVerification(e.target.checked)}
                  className="w-4 h-4 rounded-md text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label htmlFor="req-faculty" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  Request faculty endorsement & seal for placement cell accreditation
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
