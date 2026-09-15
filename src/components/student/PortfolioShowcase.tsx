import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderGit2,
  Award,
  ExternalLink,
  Github,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export const PortfolioShowcase: React.FC = () => {
  const { studentProfile, addProject, addCertification, showToast } = useApp();

  // Tab filter: 'all' | 'projects' | 'certifications'
  const [filterTab, setFilterTab] = useState<'all' | 'projects' | 'certifications'>('all');

  // Add project modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');

  // Add cert modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certUrl, setCertUrl] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    const stack = projTech.split(',').map((s) => s.trim()).filter(Boolean);
    addProject({
      title: projTitle,
      description: projDesc,
      techStack: stack.length > 0 ? stack : ['TypeScript', 'React', 'Node.js'],
      githubUrl: projGithub || 'https://github.com/aaravpatel-tech',
      liveUrl: projLive || 'https://demo.edubridge.ai',
      featured: false,
    });
    setProjTitle('');
    setProjDesc('');
    setProjTech('');
    setProjGithub('');
    setProjLive('');
    setProjectModalOpen(false);
  };

  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certIssuer) {
      showToast('Please provide certificate title and issuing organization.', 'error');
      return;
    }
    addCertification({
      title: certTitle,
      issuer: certIssuer,
      issueDate: new Date().toISOString().slice(0, 10),
      credentialUrl: certUrl || 'https://verify.edubridge.ai/credential',
    });
    setCertTitle('');
    setCertIssuer('');
    setCertUrl('');
    setCertModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-blue-900/30 to-indigo-900/40 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Academic & Industry Portfolio
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Project Showcase & Endorsed Credentials
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Immutable showcase of peer-reviewed GitHub repositories, verified industry micro-credentials, and faculty skill endorsements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-project-open-modal-btn"
            onClick={() => setProjectModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
          <button
            id="submit-cert-open-modal-btn"
            onClick={() => setCertModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Submit Cert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 w-fit">
        <button
          id="portfolio-filter-all"
          onClick={() => setFilterTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-white dark:bg-[#181920] text-gray-900 dark:text-white shadow-xs font-semibold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Showcase ({studentProfile.projects.length + studentProfile.certifications.length})
        </button>
        <button
          id="portfolio-filter-projects"
          onClick={() => setFilterTab('projects')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterTab === 'projects'
              ? 'bg-blue-600 text-white shadow-xs font-semibold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Engineering Projects ({studentProfile.projects.length})
        </button>
        <button
          id="portfolio-filter-certifications"
          onClick={() => setFilterTab('certifications')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterTab === 'certifications'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Certificates & Achievements ({studentProfile.certifications.length})
        </button>
      </div>

      {/* Projects Section */}
      {(filterTab === 'all' || filterTab === 'projects') && (
        <div id="portfolio-projects-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-500" />
              Engineering Projects ({studentProfile.projects.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studentProfile.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal tabular-nums">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{proj.likesCount || 1}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Repo</span>
                  </a>

                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Live Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section with Faculty Endorsement Badges */}
      {(filterTab === 'all' || filterTab === 'certifications') && (
        <div id="portfolio-certs-section" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Verified Micro-Credentials & Faculty Seals ({studentProfile.certifications.length})
            </h2>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {studentProfile.certifications.map((cert) => (
            <div
              key={cert.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                cert.verified
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60 shadow-xs'
                  : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                      cert.verified
                        ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {cert.verified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Faculty Endorsed
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending Faculty Review
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono tabular-nums font-normal">{cert.issueDate}</span>
                </div>

                <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-normal">{cert.issuer}</p>

                {cert.verified && cert.verifiedByFacultyName && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-900/60 text-[11px] space-y-0.5">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Institutional Stamp:
                    </span>
                    <p className="text-gray-600 dark:text-gray-300 font-normal">
                      Verified by {cert.verifiedByFacultyName} ({cert.verificationDate})
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400 truncate max-w-[120px] font-normal">
                  ID: #{cert.id.slice(-6)}
                </span>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Verify URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Add Project Modal */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setProjectModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                Add Showcase Project
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine with Raft"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description & Impact *
                </label>
                <textarea
                  rows={3}
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Describe the problem, architectural choices, scale handled, and outcomes..."
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  placeholder="e.g. Go, Docker, Redis, gRPC, Prometheus"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={projLive}
                    onChange={(e) => setProjLive(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Cert Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setCertModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                Submit Certificate for Faculty Endorsement
              </h3>
              <button
                onClick={() => setCertModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCert} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services (AWS) or DeepLearning.AI"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Credential URL
                </label>
                <input
                  type="text"
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
                  placeholder="https://credly.com/badges/..."
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
