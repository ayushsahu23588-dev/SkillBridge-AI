import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyPartner } from '../../types';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  MapPin,
  Globe,
  Mail,
  CheckCircle2,
  ExternalLink,
  Award,
  Users,
  Plus,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';

export const InstitutionIndustriesView: React.FC = () => {
  const {
    companies,
    verifyCompany,
    jobs,
    institutionCollaborations,
    isDarkMode,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Verified' | 'Pending'>('All');
  const [selectedCompany, setSelectedCompany] = useState<CompanyPartner | null>(null);

  // Compute metrics
  const totalCompaniesCount = companies.length;
  const verifiedCount = companies.filter((c) => c.verified).length;
  const pendingCount = totalCompaniesCount - verifiedCount;
  const activeMoUs = institutionCollaborations.length;

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.headquarters && c.headquarters.toLowerCase().includes(q));

      const matchVerif =
        verificationFilter === 'All' ||
        (verificationFilter === 'Verified' && c.verified) ||
        (verificationFilter === 'Pending' && !c.verified);

      return matchSearch && matchVerif;
    });
  }, [companies, searchQuery, verificationFilter]);

  const handleToggleVerify = (company: CompanyPartner, e?: React.MouseEvent) => {
    e?.stopPropagation();
    verifyCompany(company.id);
    showToast(
      company.verified
        ? `Industry partner status updated for ${company.name}`
        : `Verified ${company.name} as an accredited Campus Industry Partner!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <span>Corporate & Industry Partner Directory</span>
          </h2>
          <p className="text-xs text-gray-400">
            Authorize recruiting companies, track corporate MoUs, and review active internship & campus job drives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Showing <strong className="text-white dark:text-white font-bold">{filteredCompanies.length}</strong> of {totalCompaniesCount} Corporate Partners
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Registered Companies</span>
          <div className="text-2xl font-black">{totalCompaniesCount}</div>
          <span className="text-[11px] text-gray-400">Campus Recruiters</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Verified Partners</span>
          <div className="text-2xl font-black text-emerald-500">{verifiedCount}</div>
          <span className="text-[11px] text-emerald-400">Authorized for Campus</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Pending Verification</span>
          <div className="text-2xl font-black text-amber-500">{pendingCount}</div>
          <span className="text-[11px] text-gray-400">Requires Admin Sign-off</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Institutional MoUs</span>
          <div className="text-2xl font-black text-purple-500">{activeMoUs}</div>
          <span className="text-[11px] text-gray-400">Formal Partnerships</span>
        </div>
      </div>

      {/* Search & Verification Filter */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search industry partner by company name, sector, or location..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl text-xs">
          <button
            onClick={() => setVerificationFilter('All')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              verificationFilter === 'All'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({companies.length})
          </button>
          <button
            onClick={() => setVerificationFilter('Verified')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              verificationFilter === 'Verified'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setVerificationFilter('Pending')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              verificationFilter === 'Pending'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => {
          const companyOpportunities = jobs.filter((j) => j.companyId === company.id || j.companyName === company.name);
          const hasMoU = institutionCollaborations.some((c) => c.industry.toLowerCase().includes(company.name.toLowerCase()));

          return (
            <div
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-emerald-400/50 hover:scale-[1.01] flex flex-col justify-between ${
                isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        company.logo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
                      }
                      alt={company.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20 bg-white"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                        {company.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        {company.industry || 'Technology & Software'}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="truncate">{company.headquarters || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  {company.verified ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 flex items-center gap-1 shrink-0">
                      <ShieldAlert className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                  {company.description || 'Enterprise recruiting partner offering high-impact engineering opportunities.'}
                </p>

                {/* Badges / Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Campus Drives</span>
                    <span className="font-bold text-emerald-500">{companyOpportunities.length} Active</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">MoU Status</span>
                    <span className={`font-bold ${hasMoU ? 'text-purple-400' : 'text-gray-400'}`}>
                      {hasMoU ? 'Signed & Active' : 'Standard Partner'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
                <button
                  onClick={(e) => handleToggleVerify(company, e)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                    company.verified
                      ? 'bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {company.verified ? 'Revoke Verification' : 'Verify Partner'}
                </button>

                <span className="text-blue-500 font-semibold flex items-center gap-0.5">
                  <span>Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Company Profile Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`max-w-xl w-full rounded-2xl p-6 border shadow-2xl max-h-[90vh] overflow-y-auto transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedCompany.logo ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={selectedCompany.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 bg-white"
                />
                <div>
                  <h3 className="text-lg font-bold">{selectedCompany.name}</h3>
                  <p className="text-xs text-emerald-500 font-semibold">{selectedCompany.industry}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedCompany.headquarters}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  About Company
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedCompany.description ||
                    'Leading industry technology innovator recruiting top graduating engineering talent across departments.'}
                </p>
              </div>

              {/* Verification Toggle */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs block">Accreditation Verification Status</span>
                  <span className="text-[11px] text-gray-400">
                    {selectedCompany.verified
                      ? 'Authorized to conduct on-campus placement drives and offer internships.'
                      : 'Pending institutional review. Verification enables direct campus posting.'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleVerify(selectedCompany)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    selectedCompany.verified
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {selectedCompany.verified ? 'Revoke Verification' : 'Verify Company'}
                </button>
              </div>

              {/* Opportunities list */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Campus Opportunities Listed ({jobs.filter((j) => j.companyId === selectedCompany.id || j.companyName === selectedCompany.name).length})
                </span>
                <div className="space-y-2">
                  {jobs
                    .filter((j) => j.companyId === selectedCompany.id || j.companyName === selectedCompany.name)
                    .map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold block">{opp.title}</span>
                          <span className="text-gray-400 text-[11px]">
                            {opp.type} • {opp.stipendOrSalary || 'Competitive CTC'}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold">
                          {opp.status || 'Active'}
                        </span>
                      </div>
                    ))}
                  {jobs.filter((j) => j.companyId === selectedCompany.id || j.companyName === selectedCompany.name).length === 0 && (
                    <div className="text-xs text-gray-400 italic py-2">
                      No active opportunities currently listed for this partner.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
