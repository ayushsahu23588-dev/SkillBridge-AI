import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Plus,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Award,
} from 'lucide-react';

export const CompanyPartnershipsView: React.FC = () => {
  const { showToast } = useApp();

  const [partners, setPartners] = useState([
    {
      id: 'part_1',
      name: 'NovaCloud Systems Inc.',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      sector: 'Cloud Infrastructure & High-Performance Compute',
      mouSignedDate: '2024-03-15',
      mouStatus: 'Active (Tier-1 Partner)',
      activeHires: 28,
      annualRecruitmentBudget: '$450,000',
      jointLabs: ['Distributed Cloud Research Lab'],
      contactPerson: 'David Vance (VP Campus Talent)',
    },
    {
      id: 'part_2',
      name: 'QuantumAI Labs',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      sector: 'Generative AI & LLM Infrastructure',
      mouSignedDate: '2024-06-20',
      mouStatus: 'Active (Research & Placement Partner)',
      activeHires: 19,
      annualRecruitmentBudget: '$380,000',
      jointLabs: ['Applied Multimodal Intelligence Center'],
      contactPerson: 'Elena Rostova (Head of AI Partnerships)',
    },
    {
      id: 'part_3',
      name: 'Apex Robotics Dynamics',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
      sector: 'Autonomous Systems & Edge IoT',
      mouSignedDate: '2023-11-10',
      mouStatus: 'Active (Hardware & Firmware Partner)',
      activeHires: 15,
      annualRecruitmentBudget: '$290,000',
      jointLabs: ['Embedded Robotics Hardware Center'],
      contactPerson: 'Marcus Thorne (Director of Hardware)',
    },
  ]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerSector, setPartnerSector] = useState('');
  const [partnerContact, setPartnerContact] = useState('');

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerSector) {
      showToast('Please fill required fields.', 'error');
      return;
    }
    const newP = {
      id: 'part_' + Date.now(),
      name: partnerName,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
      sector: partnerSector,
      mouSignedDate: new Date().toISOString().slice(0, 10),
      mouStatus: 'Active (Institutional Partner)',
      activeHires: 0,
      annualRecruitmentBudget: '$200,000',
      jointLabs: ['Joint Innovation Center'],
      contactPerson: partnerContact || 'Campus Recruitment Lead',
    };
    setPartners([newP, ...partners]);
    showToast(`Registered corporate MOU for ${partnerName}!`);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-purple-950/50 border border-blue-200/60 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Corporate MOUs & Industrial Consortia
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Industry Partnerships & Co-Funded Laboratories
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Administer institutional Memorandums of Understanding (MOUs), joint academic research labs, and dedicated on-campus hiring drives.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Corporate MOU</span>
        </button>
      </div>

      {/* Partners List */}
      <div className="space-y-5">
        {partners.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              <img
                src={p.logo}
                alt={p.name}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {p.mouStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{p.sector}</p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">Contact:</span> {p.contactPerson} • Signed: {p.mouSignedDate}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.jointLabs.map((lab, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 flex items-center gap-1"
                    >
                      <Building2 className="w-3 h-3 text-blue-500" />
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-400 block font-semibold">Campus Placements</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {p.activeHires} Hired
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-400 block font-semibold">Annual CTC Allocation</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {p.annualRecruitmentBudget}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add MOU Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Register Institutional Corporate MOU
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Partner Enterprise Name *
                </label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Google Cloud Enterprise"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Sector & Domain Focus *
                </label>
                <input
                  type="text"
                  required
                  value={partnerSector}
                  onChange={(e) => setPartnerSector(e.target.value)}
                  placeholder="e.g. Distributed Cloud, AI Hardware & Security"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lead Industry Representative Contact
                </label>
                <input
                  type="text"
                  value={partnerContact}
                  onChange={(e) => setPartnerContact(e.target.value)}
                  placeholder="e.g. Sarah Jenkins (Global University Relations)"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Ratify MOU Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
