import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentVerifiableDocument } from '../../types';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  UploadCloud,
  Eye,
  Check,
  RotateCcw,
  Search,
  Filter,
  X,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';

interface DocumentVerificationManagerProps {
  embeddedRole?: 'student' | 'placement_cell' | 'recruiter';
}

export const DocumentVerificationManager: React.FC<DocumentVerificationManagerProps> = ({
  embeddedRole,
}) => {
  const {
    verifiableDocuments,
    verifyDocument,
    requestDocumentRevision,
    currentUser,
    studentProfile,
    showToast,
  } = useApp();

  const isStaff =
    embeddedRole === 'placement_cell' ||
    currentUser.role === 'college_admin' ||
    currentUser.role === 'faculty' ||
    currentUser.role === 'super_admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<StudentVerifiableDocument | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Upload Form
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<StudentVerifiableDocument['documentType']>('Industry Certification');
  const [uploadIssuer, setUploadIssuer] = useState('');

  const filteredDocs = useMemo(() => {
    return verifiableDocuments.filter((doc) => {
      // If student view, filter to this student
      const matchOwner = isStaff ? true : doc.studentId === studentProfile.id || doc.studentName === studentProfile.name;
      const matchSearch =
        doc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || doc.status === statusFilter;
      return matchOwner && matchSearch && matchStatus;
    });
  }, [verifiableDocuments, isStaff, studentProfile, searchQuery, statusFilter]);

  const verifiedCount = filteredDocs.filter((d) => d.status === 'Verified').length;
  const pendingCount = filteredDocs.filter((d) => d.status === 'Pending Review').length;
  const revisionCount = filteredDocs.filter((d) => d.status === 'Revision Requested').length;

  const handleVerify = (doc: StudentVerifiableDocument) => {
    verifyDocument(doc.id, 'Official credentials confirmed and validated against academic records.');
  };

  const handleOpenRevision = (doc: StudentVerifiableDocument) => {
    setSelectedDoc(doc);
    setRevisionNotes('');
    setIsRevisionModalOpen(true);
  };

  const handleConfirmRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !revisionNotes.trim()) return;
    requestDocumentRevision(selectedDoc.id, revisionNotes.trim());
    setIsRevisionModalOpen(false);
    setSelectedDoc(null);
  };

  const handleMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showToast('Please enter document title.', 'warning');
      return;
    }

    showToast(`Uploaded "${uploadTitle}" for verification review.`, 'success');
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadIssuer('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Trust & Credentials Authentication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Document & Certificate Verification Queue
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Institutional vetting pipeline verifying student ATS resumes, university semester marksheets, external certifications (AWS, Meta, Google), and capstone project deliverables.
            </p>
          </div>

          {!isStaff && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document for Verification</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="soft-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Verified Credentials</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {verifiedCount}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Awarded verified badge seal</span>
        </div>

        <div className="soft-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {pendingCount}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Awaiting departmental verification</span>
        </div>

        <div className="soft-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Revision Requested</span>
            <RotateCcw className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {revisionCount}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Feedback sent to student</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search document title, student, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-xs font-semibold outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Verified', 'Pending Review', 'Revision Requested'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Document Records List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="soft-card p-5 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {doc.documentTitle}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : doc.status === 'Pending Review'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  <span>Student: <strong>{doc.studentName}</strong> ({doc.studentDepartment})</span> • 
                  <span> Type: {doc.documentType}</span> • 
                  <span> Size: {doc.fileSizeMb} MB</span>
                </p>

                {doc.remarks && (
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                    "{doc.remarks}"
                  </p>
                )}

                {doc.verifiedBy && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                    ✓ Verified by {doc.verifiedBy} on {doc.verifiedAt}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </a>

              {isStaff && doc.status !== 'Verified' && (
                <button
                  onClick={() => handleVerify(doc)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              )}

              {isStaff && doc.status !== 'Revision Requested' && (
                <button
                  onClick={() => handleOpenRevision(doc)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Revision</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="soft-card p-12 text-center text-gray-500">
          No documents matching the current search criteria.
        </div>
      )}

      {/* Request Revision Modal */}
      {isRevisionModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmRevision}
            className="bg-white dark:bg-[#181920] w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Request Document Revision
              </h3>
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-gray-500">
                Provide feedback to <strong>{selectedDoc.studentName}</strong> regarding required fixes for{' '}
                <strong>{selectedDoc.documentTitle}</strong>:
              </p>
              <textarea
                required
                rows={3}
                placeholder="e.g. Please upload official transcript with registrar seal or add credential verification link..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Send Revision Notice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Document Modal (Student) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleMockUpload}
            className="bg-white dark:bg-[#181920] w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-500" />
                <span>Upload Document for Verification</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-500 block mb-1 font-bold">Document Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                >
                  <option value="Resume ATS Version">Resume ATS Version</option>
                  <option value="Industry Certification">Industry Certification</option>
                  <option value="Semester Grade Sheet">Semester Grade Sheet</option>
                  <option value="Project Proof">Project Proof / Architecture</option>
                  <option value="Govt ID Proof">Govt ID Proof</option>
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Developer Associate.pdf"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Issuing Authority / University</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services / Coursera"
                  value={uploadIssuer}
                  onChange={(e) => setUploadIssuer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center">
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Drag and drop PDF or document here
                </span>
                <span className="text-[10px] text-gray-400">PDF, PNG or JPG up to 10MB</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
