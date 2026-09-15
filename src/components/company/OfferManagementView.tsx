import React, { useState } from 'react';
import {
  Gift,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Building,
  FileText,
  ExternalLink,
  ShieldCheck,
  Send,
  User,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyOffer } from '../../types';

export const OfferManagementView: React.FC = () => {
  const {
    companyOffers,
    extendCompanyOffer,
    updateOfferStatus,
    candidatePool,
    jobs,
    currentCompany,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Extended' | 'Accepted' | 'Declined' | 'Withdrawn'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedOfferForPreview, setSelectedOfferForPreview] = useState<CompanyOffer | null>(null);

  // Extend Offer Form
  const [offerForm, setOfferForm] = useState({
    studentId: candidatePool[0]?.id || 'cand_1',
    studentName: candidatePool[0]?.name || 'Aarav Patel',
    studentEmail: candidatePool[0]?.email || 'aarav.patel@student.apex.edu',
    jobId: jobs[0]?.id || 'job_1',
    jobTitle: jobs[0]?.title || 'Distributed Cloud Systems Engineer',
    offerType: 'Full-time' as 'Full-time' | 'Internship',
    ctcOrStipend: '$155,000 / year + $25,000 RSUs',
    joiningBonus: '$15,000',
    joiningDate: '2025-07-15',
    expiryDate: '2025-06-30',
    location: 'Hybrid • San Francisco, CA / Remote',
  });

  const filteredOffers = companyOffers.filter((offer) => {
    const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
    const matchesSearch =
      offer.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.ctcOrStipend.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalOffersCount = companyOffers.length;
  const acceptedCount = companyOffers.filter((o) => o.status === 'Accepted').length;
  const acceptanceRate = totalOffersCount > 0 ? Math.round((acceptedCount / totalOffersCount) * 100) : 100;

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    extendCompanyOffer({
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyLogo: currentCompany.logo,
      studentId: offerForm.studentId,
      studentName: offerForm.studentName,
      studentEmail: offerForm.studentEmail,
      jobId: offerForm.jobId,
      jobTitle: offerForm.jobTitle,
      offerType: offerForm.offerType,
      ctcOrStipend: offerForm.ctcOrStipend,
      joiningBonus: offerForm.joiningBonus,
      joiningDate: offerForm.joiningDate,
      expiryDate: offerForm.expiryDate,
      location: offerForm.location,
      status: 'Extended',
      offerLetterUrl: 'https://example.com/legal/official-offer-letter.pdf',
    });
    setIsExtendModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <Gift className="w-3.5 h-3.5" />
            Formal Digital Offer Letters & Placement Tracking
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Offer Management & Contract Issuance
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Issue formal campus offers, generate verified offer letter previews with institutional seals, and monitor student acceptances.
          </p>
        </div>

        <button
          onClick={() => setIsExtendModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Extend New Offer</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Extended</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalOffersCount} Offers</h3>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Accepted & Signed</span>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{acceptedCount} Hires</h3>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Offer Acceptance Rate</span>
            <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{acceptanceRate}%</h3>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student name, role, compensation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'Extended', 'Accepted', 'Declined', 'Withdrawn'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        offer.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : offer.status === 'Extended'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      }`}
                    >
                      {offer.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Extended on {offer.extendedAt}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {offer.studentName}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    {offer.jobTitle}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOfferForPreview(offer)}
                  className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
                  title="View Official Offer Letter"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Compensation:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {offer.ctcOrStipend}
                  </span>
                </div>
                {offer.joiningBonus && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Sign-on Bonus:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {offer.joiningBonus}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Start Joining Date:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {offer.joiningDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Acceptance Expiry:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {offer.expiryDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                    {offer.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Changer Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400 font-mono">
                Offer ID: #{offer.id}
              </span>

              <div className="flex items-center gap-1.5">
                {offer.status !== 'Accepted' && (
                  <button
                    onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Accepted</span>
                  </button>
                )}
                {offer.status === 'Extended' && (
                  <button
                    onClick={() => updateOfferStatus(offer.id, 'Withdrawn')}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-50 text-gray-700 dark:text-gray-300 hover:text-red-600 text-xs font-bold transition-all"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Offer Letter Preview Modal */}
      {selectedOfferForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-900/10 via-purple-900/10 to-transparent">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOfferForPreview.companyLogo}
                  alt={selectedOfferForPreview.companyName}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Official Appointment & Offer Letter
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedOfferForPreview.companyName} • Institutional Verification Sealed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfferForPreview(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 font-serif text-sm leading-relaxed text-gray-800 dark:text-gray-200 bg-gray-50/40 dark:bg-gray-950/40">
              <div className="text-right text-xs font-sans text-gray-500">
                Date: {selectedOfferForPreview.extendedAt}
              </div>

              <div>
                <p className="font-bold text-gray-900 dark:text-white">Dear {selectedOfferForPreview.studentName},</p>
                <p className="mt-2">
                  On behalf of <strong>{selectedOfferForPreview.companyName}</strong>, we are pleased to offer you the position of{' '}
                  <strong>{selectedOfferForPreview.jobTitle}</strong> ({selectedOfferForPreview.offerType}).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-sans text-xs space-y-2.5">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  <span className="text-gray-500">Annual Base Package (CTC):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedOfferForPreview.ctcOrStipend}</span>
                </div>
                {selectedOfferForPreview.joiningBonus && (
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    <span className="text-gray-500">Sign-on / Relocation Bonus:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedOfferForPreview.joiningBonus}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  <span className="text-gray-500">Expected Joining Date:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedOfferForPreview.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Work Location:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedOfferForPreview.location}</span>
                </div>
              </div>

              <p className="text-xs">
                This offer is contingent on successful background verification and completion of your degree curriculum with standard academic standing. Please sign and return your acceptance prior to <strong>{selectedOfferForPreview.expiryDate}</strong>.
              </p>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between font-sans text-xs">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Talent Acquisition Directorate</p>
                  <p className="text-gray-500">{selectedOfferForPreview.companyName}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Campus Placement Seal</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOfferForPreview(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Offer Modal */}
      {isExtendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-500" />
                  Extend Formal Campus Job Offer
                </h3>
                <p className="text-xs text-gray-500">
                  Direct digital issuance with cryptographic audit trail
                </p>
              </div>
              <button
                onClick={() => setIsExtendModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Recipient Candidate
                </label>
                <select
                  value={offerForm.studentId}
                  onChange={(e) => {
                    const c = candidatePool.find((cand) => cand.id === e.target.value);
                    if (c) {
                      setOfferForm({
                        ...offerForm,
                        studentId: c.id,
                        studentName: c.name,
                        studentEmail: c.email,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  {candidatePool.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.college})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Designated Role Title
                </label>
                <input
                  type="text"
                  value={offerForm.jobTitle}
                  onChange={(e) => setOfferForm({ ...offerForm, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Annual Package (CTC) / Stipend
                  </label>
                  <input
                    type="text"
                    value={offerForm.ctcOrStipend}
                    onChange={(e) => setOfferForm({ ...offerForm, ctcOrStipend: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Sign-on Bonus
                  </label>
                  <input
                    type="text"
                    value={offerForm.joiningBonus}
                    onChange={(e) => setOfferForm({ ...offerForm, joiningBonus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={offerForm.joiningDate}
                    onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Acceptance Deadline
                  </label>
                  <input
                    type="date"
                    value={offerForm.expiryDate}
                    onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location & Work Arrangement
                </label>
                <input
                  type="text"
                  value={offerForm.location}
                  onChange={(e) => setOfferForm({ ...offerForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsExtendModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  Issue Digital Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
