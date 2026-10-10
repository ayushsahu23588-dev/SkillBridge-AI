import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { skillBridgeEngine } from '../../services/skillBridgeIntelligenceEngine';
import { OfferJoiningItem } from '../../types';
import {
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  FileCheck,
  ShieldCheck,
  Clock,
  MapPin,
  Banknote,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Upload,
} from 'lucide-react';

interface OfferJoiningTrackerProps {
  compact?: boolean;
}

export const OfferJoiningTracker: React.FC<OfferJoiningTrackerProps> = ({ compact = false }) => {
  const { showToast } = useApp();

  const [offers, setOffers] = useState<OfferJoiningItem[]>(() =>
    skillBridgeEngine.getOfferJoiningRecords()
  );
  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id || 'off_1');

  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: 'Accepted' as const } : o
      )
    );
    showToast('Congratulations! Offer accepted and registered with Campus Placement Cell.', 'success');
  };

  const handleToggleDoc = (offerId: string, docName: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        return {
          ...o,
          documentsSubmitted: o.documentsSubmitted.map((d) =>
            d.name === docName ? { ...d, verified: !d.verified } : d
          ),
        };
      })
    );
    showToast(`Updated verification status for: ${docName}`, 'info');
  };

  const handleDownloadOfferLetter = (offer: OfferJoiningItem) => {
    showToast(`Downloading official offer letter package from ${offer.companyName}...`, 'info');
  };

  return (
    <div id="offer-joining-tracker-root" className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Award className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Verified Corporate Offers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Offer & Joining Tracker
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Track job offer letters, compensation packages, required compliance paperwork, and formal joining milestones across campus recruitment drives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl bg-white/10 text-white font-extrabold text-xs border border-white/20">
              {offers.filter((o) => o.status === 'Accepted').length} Accepted Offer(s)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Offers List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block px-1">
            Registered Offers ({offers.length})
          </span>

          {offers.map((offer) => {
            const isSelected = offer.id === selectedOfferId;
            const isAccepted = offer.status === 'Accepted';

            return (
              <div
                key={offer.id}
                id={`offer-card-${offer.id}`}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-white dark:bg-[#14151B] border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={offer.companyLogo}
                      alt={offer.companyName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-white/10 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {offer.companyName}
                      </span>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug">
                        {offer.roleTitle}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase shrink-0 ${
                      isAccepted
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>₹{offer.packageLpa} LPA CTC</span>
                  </div>

                  <span className="text-[11px] text-gray-400">
                    Joining: {offer.joiningDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Offer Details & Document Checklist */}
        {selectedOffer && (
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 pb-5">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {selectedOffer.companyName} Official Campus Offer
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {selectedOffer.roleTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedOffer.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Joining: {selectedOffer.joiningDate}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadOfferLetter(selectedOffer)}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Offer Letter</span>
                  </button>
                </div>
              </div>

              {/* Package Breakdown Cards */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Compensation Package Breakdown (CTC: ₹{selectedOffer.packageLpa} LPA)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] text-gray-400 font-medium">Base Salary</span>
                    <p className="font-extrabold text-xs text-gray-900 dark:text-white mt-0.5">
                      {selectedOffer.packageBreakdown.baseSalary}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] text-gray-400 font-medium">Performance Bonus</span>
                    <p className="font-extrabold text-xs text-gray-900 dark:text-white mt-0.5">
                      {selectedOffer.packageBreakdown.performanceBonus || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] text-gray-400 font-medium">Joining Bonus</span>
                    <p className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {selectedOffer.packageBreakdown.joiningBonus || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] text-gray-400 font-medium">Stock / RSUs</span>
                    <p className="font-extrabold text-xs text-purple-600 dark:text-purple-400 mt-0.5 truncate">
                      {selectedOffer.packageBreakdown.esopsOrStock || 'None'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Onboarding Document Compliance Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Onboarding Document Verification Checklist
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedOffer.documentsSubmitted.filter((d) => d.verified).length} / {selectedOffer.documentsSubmitted.length} Verified
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedOffer.documentsSubmitted.map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleDoc(selectedOffer.id, doc.name)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        doc.verified
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs ${
                            doc.verified
                              ? 'bg-emerald-500 text-white'
                              : 'border border-gray-300 dark:border-white/20'
                          }`}
                        >
                          {doc.verified && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {doc.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase ${
                          doc.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                        }`}
                      >
                        {doc.verified ? 'Verified ✓' : 'Upload Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceptance Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-500">
                  Status: <strong className="text-gray-900 dark:text-white">{selectedOffer.status}</strong>
                </span>

                {selectedOffer.status !== 'Accepted' ? (
                  <button
                    onClick={() => handleAcceptOffer(selectedOffer.id)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Offer & Confirm Joining</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Formal Joining Confirmed (Class of 2026)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
