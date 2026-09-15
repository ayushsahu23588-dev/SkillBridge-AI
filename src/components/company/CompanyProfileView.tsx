import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  Upload,
  Layers,
  HeartHandshake,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyPartner, CompanyTeamMember } from '../../types';

export const CompanyProfileView: React.FC = () => {
  const { currentCompany, updateCompanyProfile, companyTeam, addCompanyTeamMember, removeCompanyTeamMember, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyPartner>>({
    name: currentCompany.name,
    industry: currentCompany.industry,
    headquarters: currentCompany.headquarters,
    size: currentCompany.size,
    website: currentCompany.website || 'https://novacloud.example.io',
    contactEmail: currentCompany.contactEmail || 'talent@novacloud.example.io',
    contactPhone: currentCompany.contactPhone || '+1 (408) 555-0199',
    description: currentCompany.description,
    aboutCulture: currentCompany.aboutCulture || 'At NovaCloud Systems, we believe high autonomy produces world-class software. We run on blameless post-mortems, open design RFCs, and a deep commitment to mentoring emerging college engineers into industry leaders.',
  });

  const [newTechTag, setNewTechTag] = useState('');
  const [techStack, setTechStack] = useState<string[]>(
    currentCompany.techStack || ['TypeScript', 'Go', 'Kubernetes', 'Redis', 'React 19', 'PostgreSQL', 'Docker', 'GraphQL']
  );

  const [newPerk, setNewPerk] = useState('');
  const [perks, setPerks] = useState<string[]>(
    currentCompany.culturePerks || [
      'Comprehensive Medical, Dental & Mental Health',
      '$3,000 Annual Learning & Conference Budget',
      'Flexible Hybrid & Remote Work Policies',
      '401(k) 6% Match with Immediate Vesting',
      'Generous Equity & Pre-IPO Stock Options',
      'Wellness & Home-Office Relocation Stipends',
    ]
  );

  // Invite Team Member Modal
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Primary Recruiter' as CompanyTeamMember['role'],
    department: 'Talent Acquisition',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active' as const,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(currentCompany.id, {
      ...formData,
      techStack,
      culturePerks: perks,
    });
    setIsEditing(false);
  };

  const handleAddTechTag = () => {
    if (newTechTag.trim() && !techStack.includes(newTechTag.trim())) {
      setTechStack([...techStack, newTechTag.trim()]);
      setNewTechTag('');
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const handleAddPerk = () => {
    if (newPerk.trim() && !perks.includes(newPerk.trim())) {
      setPerks([...perks, newPerk.trim()]);
      setNewPerk('');
    }
  };

  const handleRemovePerk = (perk: string) => {
    setPerks(perks.filter((p) => p !== perk));
  };

  const handleCreateTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    addCompanyTeamMember(newMember);
    setIsAddTeamModalOpen(false);
    setNewMember({
      name: '',
      email: '',
      role: 'Primary Recruiter',
      department: 'Talent Acquisition',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
        <div className="h-44 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 relative">
          <div className="absolute inset-0 bg-radial from-purple-500/10 to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Enterprise Profile
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img
              src={currentCompany.logo}
              alt={currentCompany.name}
              className="w-28 h-28 rounded-2xl object-cover bg-white dark:bg-gray-800 p-1 border-4 border-white dark:border-gray-900 shadow-xl"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentCompany.name}
              </h1>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {currentCompany.industry}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentCompany.headquarters}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {currentCompany.size}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isEditing
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
              }`}
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Cancel Edit</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Tech Stack */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information Form / View */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Corporate Overview & Background
                </h3>
                <p className="text-xs text-gray-500">Visible to college students and placement officers</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Industry Sector</label>
                    <input
                      type="text"
                      value={formData.industry || ''}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Headquarters</label>
                    <input
                      type="text"
                      value={formData.headquarters || ''}
                      onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Size</label>
                    <input
                      type="text"
                      value={formData.size || ''}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Official Website</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Mission & Overview</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Engineering Culture & Mentorship Philosophy</label>
                  <textarea
                    rows={3}
                    value={formData.aboutCulture || ''}
                    onChange={(e) => setFormData({ ...formData, aboutCulture: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">About the Organization</h4>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-sm">
                    {currentCompany.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Culture & Mentorship Philosophy</h4>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-sm">
                    {currentCompany.aboutCulture || 'We foster a collaborative, engineering-led environment with direct mentorship from senior architects and executives.'}
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span className="text-gray-400">Careers Website</span>
                    <a
                      href={currentCompany.website || 'https://novacloud.example.io'}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5 hover:underline"
                    >
                      {currentCompany.website || 'novacloud.example.io'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-400">Recruitment Inquiries</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {currentCompany.contactEmail || 'talent@novacloud.example.io'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Campus Partnership Hotline</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {currentCompany.contactPhone || '+1 (408) 555-0199'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tech Stack Tags Manager */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500" />
                  Target Engineering Tech Stack
                </h3>
                <p className="text-xs text-gray-500">
                  Used by our AI Candidate Match engine to evaluate student resumes and portfolio projects.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {techStack.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveTechTag(tag)}
                      className="text-purple-400 hover:text-red-500 transition-colors ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add technology (e.g. Next.js, Rust, Kafka)..."
                  value={newTechTag}
                  onChange={(e) => setNewTechTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechTag())}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTechTag}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Benefits & Culture Perks */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Student Perks & Benefits Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300"
                >
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {perk}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemovePerk(perk)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add custom benefit (e.g. Free Catered Meals, Return FTE Guarantee)..."
                  value={newPerk}
                  onChange={(e) => setNewPerk(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPerk())}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddPerk}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recruitment Team & MOUs */}
        <div className="space-y-8">
          {/* Recruitment Team Members */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Recruiting Team ({companyTeam.length})
                </h3>
                <p className="text-xs text-gray-500">Interviewers & hiring managers</p>
              </div>
              <button
                onClick={() => setIsAddTeamModalOpen(true)}
                className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
                title="Add Team Member"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {companyTeam.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{member.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{member.role}</p>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeCompanyTeamMember(member.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campus MOUs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-500" />
              Institutional MOUs
            </h3>
            <div className="space-y-3">
              {(currentCompany.mouDetails || [
                {
                  id: 'mou_1',
                  collegeName: 'Apex National Institute of Technology',
                  signedDate: '2025-02-10',
                  validUntil: '2028-02-10',
                  hiringQuota: 35,
                  partnershipLead: 'Dr. Evelyn Vance',
                },
                {
                  id: 'mou_2',
                  collegeName: 'Metro State University',
                  signedDate: '2025-05-18',
                  validUntil: '2027-05-18',
                  hiringQuota: 20,
                  partnershipLead: 'Prof. Rajesh K. Sharma',
                },
              ]).map((mou, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 space-y-1.5 text-xs"
                >
                  <span className="font-bold text-purple-900 dark:text-purple-200 block">
                    {mou.collegeName}
                  </span>
                  <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                    <span>Quota: {mou.hiringQuota} Hires</span>
                    <span>Valid to {mou.validUntil}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300">
                    Lead: <span className="font-medium text-gray-900 dark:text-white">{mou.partnershipLead}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Add Recruitment Team Member
            </h3>
            <form onSubmit={handleCreateTeamMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sophia Sterling"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Email</label>
                <input
                  type="email"
                  placeholder="sophia@company.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Role in Hiring</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Primary Recruiter">Primary Recruiter</option>
                  <option value="Technical Interviewer">Technical Interviewer</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                  <option value="Executive Approver">Executive Approver</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Core Systems"
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
