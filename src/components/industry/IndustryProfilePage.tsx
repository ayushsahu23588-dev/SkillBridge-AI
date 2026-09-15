import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  MapPin,
  Globe,
  Mail,
  Users,
  Edit2,
  Check,
  Sparkles,
  Layers,
  Save,
  ShieldCheck,
  Eye,
  ExternalLink,
  Code2,
  Briefcase,
  HeartHandshake,
  X,
  Loader2,
} from 'lucide-react';

export interface ExtendedCompanyProfile {
  companyName: string;
  tagline: string;
  industry: string;
  companySize: string;
  website: string;
  headquarters: string;
  description: string;
  cultureAndWorkEnvironment: string;
  keyTechnologies: string[];
  hiringDomains: string[];
  contactEmail: string;
  logo: string;
}

const DEFAULT_PROFILE: ExtendedCompanyProfile = {
  companyName: 'TechNova Solutions',
  tagline: 'Engineering Resilient Distributed Platforms & Frontier Intelligent Systems',
  industry: 'Enterprise Software & Cloud Platforms',
  companySize: '1,000 - 5,000 employees',
  website: 'https://technova.example.io',
  headquarters: 'Bengaluru, Karnataka, India (Tech Corridor)',
  description:
    'TechNova Solutions powers mission-critical cloud platform telemetry, high-throughput microservices, and multimodal enterprise AI models for Fortune 500 partners across the globe. Our engineering culture values radical transparency, architectural rigor, continuous experimentation, and deep university collaboration.',
  cultureAndWorkEnvironment:
    'We foster a high-autonomy, blameless engineering culture where interns and senior architects work side-by-side. We emphasize 20% innovation sprints, open-source contributions, peer design critiques, and structured mentorship programs.',
  keyTechnologies: [
    'Go',
    'Kubernetes',
    'React 19',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'gRPC',
    'Kafka',
    'Python',
    'PyTorch',
  ],
  hiringDomains: [
    'Cloud Platform & SRE',
    'Full-Stack Web Engineering',
    'Distributed Systems',
    'Applied Machine Learning',
    'Product Design & UX',
  ],
  contactEmail: 'campus.talent@technova.example.io',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
};

const STORAGE_KEY = 'skillbridge_company_profile_v1';

export const IndustryProfilePage: React.FC = () => {
  const { showToast } = useApp();

  const [profile, setProfile] = useState<ExtendedCompanyProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [tagline, setTagline] = useState(profile.tagline);
  const [industry, setIndustry] = useState(profile.industry);
  const [companySize, setCompanySize] = useState(profile.companySize);
  const [website, setWebsite] = useState(profile.website);
  const [headquarters, setHeadquarters] = useState(profile.headquarters);
  const [description, setDescription] = useState(profile.description);
  const [culture, setCulture] = useState(profile.cultureAndWorkEnvironment);
  const [techInput, setTechInput] = useState(profile.keyTechnologies.join(', '));
  const [hiringInput, setHiringInput] = useState(profile.hiringDomains.join(', '));
  const [contactEmail, setContactEmail] = useState(profile.contactEmail);
  const [logo, setLogo] = useState(profile.logo);

  const handleStartEdit = () => {
    setCompanyName(profile.companyName);
    setTagline(profile.tagline);
    setIndustry(profile.industry);
    setCompanySize(profile.companySize);
    setWebsite(profile.website);
    setHeadquarters(profile.headquarters);
    setDescription(profile.description);
    setCulture(profile.cultureAndWorkEnvironment);
    setTechInput(profile.keyTechnologies.join(', '));
    setHiringInput(profile.hiringDomains.join(', '));
    setContactEmail(profile.contactEmail);
    setLogo(profile.logo);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showToast('Company name is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const updated: ExtendedCompanyProfile = {
        companyName,
        tagline,
        industry,
        companySize,
        website,
        headquarters,
        description,
        cultureAndWorkEnvironment: culture,
        keyTechnologies: techInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        hiringDomains: hiringInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        contactEmail,
        logo,
      };

      setProfile(updated);
      setIsEditing(false);
      showToast('Company profile saved successfully and updated across campus portals!', 'success');
    } catch (err) {
      showToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Company Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your verified organization profile, work culture, technology stack, and student-facing showcase.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Preview Public Profile</span>
          </button>

          <button
            onClick={() => (isEditing ? setIsEditing(false) : handleStartEdit())}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isEditing
                ? 'bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-5 text-xs"
        >
          <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
            <img
              src={logo}
              alt={companyName}
              className="w-16 h-16 rounded-2xl object-cover border border-purple-500/20"
            />
            <div className="flex-1">
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Company Logo URL
              </label>
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Tagline *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Industry / Sector *
              </label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Company Size
              </label>
              <input
                type="text"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Recruitment Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Culture & Work Environment *
            </label>
            <textarea
              rows={3}
              required
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Key Technologies Used (comma-separated)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Hiring Domains (comma-separated)
              </label>
              <input
                type="text"
                value={hiringInput}
                onChange={(e) => setHiringInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Profile Display View */
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={profile.logo}
                alt={profile.companyName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/20 shrink-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                    {profile.companyName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Enterprise Partner</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-semibold mt-1">
                  {profile.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                    <span>{profile.industry}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{profile.headquarters}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{profile.companySize}</span>
                  </span>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{profile.website.replace('https://', '')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>About the Organization</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Culture & Work Environment */}
            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Culture & Work Environment</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.cultureAndWorkEnvironment}
              </p>
            </div>

            {/* Key Technologies Used */}
            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Key Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.keyTechnologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Domains */}
            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Active Hiring Domains</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.hiringDomains.map((dom, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/40"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Profile Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px]">
                  Student & Campus Partner View
                </span>
                <span className="text-gray-400">• Public Preview</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <img
                src={profile.logo}
                alt={profile.companyName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/20 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                    {profile.companyName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                    Verified
                  </span>
                </div>
                <p className="text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                  {profile.tagline}
                </p>
                <p className="text-gray-500 text-[11px] mt-1">
                  {profile.industry} • {profile.headquarters}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 space-y-1">
              <div className="font-bold text-gray-800 dark:text-gray-200">About Us</div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Culture */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 space-y-1">
              <div className="font-bold text-gray-800 dark:text-gray-200">
                Work Culture & Development
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.cultureAndWorkEnvironment}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <div className="font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Technologies We Work With
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.keyTechnologies.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Domains */}
            <div>
              <div className="font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Current Hiring Tracks
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.hiringDomains.map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-gray-400 text-[11px]">
                Inquiries: {profile.contactEmail}
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
