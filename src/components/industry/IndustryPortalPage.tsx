import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Briefcase,
  Users,
  Sparkles,
  Calendar,
  Layers,
  Award,
  Plus,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const IndustryPortalPage: React.FC = () => {
  const { jobs, applications, navigate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'manage-opportunities'
    | 'candidates'
    | 'shortlisted'
    | 'applications'
    | 'mentorship'
    | 'challenges'
    | 'collaboration'
    | 'profile'
  >('dashboard');

  const companyProfile = {
    name: 'NovaCloud Systems India',
    industry: 'Enterprise Cloud Infrastructure & Distributed AI',
    headquarters: 'Bangalore Innovation Corridor, Karnataka',
    employees: '1,200+ Global Engineers',
    website: 'https://novacloud.io',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=80',
    partnerColleges: 14,
    activeHires2026: 42,
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={companyProfile.logo}
            alt={companyProfile.name}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-white/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Industry Partner Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-500/30">
                Verified Recruiter Tier
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-1">
              {companyProfile.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {companyProfile.industry} • {companyProfile.headquarters}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => navigate('/industry/post-opportunity')}
            className="px-4 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </button>
          <button
            onClick={() => navigate('/industry/candidates')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#84B000] dark:text-[#D4F73C]" />
            <span>AI Candidate Matcher</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'dashboard', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'manage-opportunities', label: 'Manage Roles', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'shortlisted', label: 'Shortlisted Pool', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'applications', label: 'Application Desk', icon: <Clock className="w-3.5 h-3.5" /> },
          { id: 'mentorship', label: 'Mentorship', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'challenges', label: 'Engineering Challenges', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'collaboration', label: 'Academic Labs', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'profile', label: 'Company Profile', icon: <Building2 className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#14151B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Live Job Postings</span>
              <div className="text-3xl font-black text-gray-900 dark:text-white mt-1 tabular-nums">
                {jobs.length} Active
              </div>
              <span className="text-[11px] text-purple-600 font-bold mt-1 block">Campus & Remote</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Total Applicants</span>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                {applications.length + 180}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Across 14 Colleges</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">High AI Match (90%+)</span>
              <div className="text-3xl font-black text-[#4D7C0F] dark:text-[#D4F73C] mt-1 tabular-nums">
                48 Candidates
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Ready for Interviews</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Campus Offers Released</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                12 Selected
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">100% Acceptance</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span>Your Active Postings</span>
                </h2>
                <button
                  onClick={() => setActiveTab('manage-opportunities')}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Manage All ({jobs.length})
                </button>
              </div>

              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">{job.title}</h3>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {job.type} • {job.location} • {job.stipendOrSalary}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/industry/candidates')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4F73C]" />
                      <span>View Matches</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#84B000] dark:text-[#D4F73C]" />
                  <span>Campus AI Talent Radar</span>
                </h2>
                <button
                  onClick={() => navigate('/industry/candidates')}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Explore Pool
                </button>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                SkillBridge AI has indexed 48 high-affinity students whose verified code and diagnostic scores match NovaCloud’s Docker & PostgreSQL stack.
              </p>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-300">
                    Aarav Patel (94% Match)
                  </div>
                  <div className="text-[11px] text-purple-700 dark:text-purple-400">
                    B.Tech CS • Apex NIT • Docker, FastAPI, SQL Verified
                  </div>
                </div>
                <button
                  onClick={() => navigate('/industry/candidates')}
                  className="px-3 py-1.5 rounded-xl bg-[#D4F73C] text-[#111216] text-[11px] font-bold cursor-pointer shrink-0"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Manage Opportunities */}
      {activeTab === 'manage-opportunities' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Manage Published Campus Opportunities
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Toggle listings, track live student applications, and inspect candidate rankings.
              </p>
            </div>
            <button
              onClick={() => navigate('/industry/post-opportunity')}
              className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Opportunity</span>
            </button>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30">
                      Active Listing
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">Deadline: {job.deadline}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{job.title}</h3>
                  <div className="text-xs text-gray-500">
                    {job.type} • {job.location} • {job.stipendOrSalary} • {job.applicantCount} Applicants
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/industry/candidates')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4F73C]" />
                    <span>AI Matches</span>
                  </button>
                  <button
                    onClick={() => showToast(`Status updated for ${job.title}`, 'info')}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Pause Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Shortlisted Pool */}
      {activeTab === 'shortlisted' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Shortlisted Candidates Pool
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              High-priority engineering seniors selected for upcoming technical interviews and coding rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Aarav Patel',
                college: 'Apex NIT',
                dept: 'B.Tech CS 2026',
                score: '94% Match',
                role: 'Cloud Systems Intern',
              },
              {
                name: 'Riya Sharma',
                college: 'Apex NIT',
                dept: 'B.Tech IT 2026',
                score: '91% Match',
                role: 'Data Analyst & BI Specialist',
              },
            ].map((cand, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{cand.name}</h3>
                  <p className="text-[11px] text-gray-500">{cand.dept} • {cand.college}</p>
                  <p className="text-[11px] text-purple-600 font-bold mt-1">Shortlisted for: {cand.role}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                    {cand.score}
                  </span>
                  <button
                    onClick={() => showToast(`Technical interview slot dispatched to ${cand.name}!`, 'success')}
                    className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 cursor-pointer"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Applications Review */}
      {activeTab === 'applications' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Student Applications Review Desk
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review submissions directly from student portfolios and schedule interview panels.
            </p>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Application #{app.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Submitted: {app.appliedDate} • AI Candidate Score: {app.aiMatchScore}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Student portfolio preview loaded.', 'info')}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    View Resume
                  </button>
                  <button
                    onClick={() => showToast(`Status advanced to Technical Interview.`, 'success')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer"
                  >
                    Advance Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Mentorship */}
      {activeTab === 'mentorship' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Industry Mentorship & 1-on-1 Office Hours
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Connect senior engineers and architects with campus students for mock interviews and architectural guidance.
              </p>
            </div>
            <button
              onClick={() => showToast('New mentor slot opened for scheduling.', 'success')}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
            >
              Open Mentorship Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-purple-600 uppercase">Weekly Office Hours</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                Distributed Cloud Architecture & Docker Best Practices
              </h3>
              <p className="text-[11px] text-gray-500">Every Thursday 5:00 PM IST • 45 Min Sessions</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                4 Students Booked This Week
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase">Mock Technical Screening</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                System Design & PostgreSQL Query Tuning Interviews
              </h3>
              <p className="text-[11px] text-gray-500">Bi-Weekly Saturdays • 1-on-1 Feedback</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                Conducted by Senior Architects
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Challenges */}
      {activeTab === 'challenges' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Campus Engineering Challenges & Innovation Sprints
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Host problem-statement challenges to identify standout engineering talent early.
              </p>
            </div>
            <button
              onClick={() => showToast('New campus engineering challenge creator launched.', 'info')}
              className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs cursor-pointer"
            >
              Launch Campus Challenge
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4F73C] text-[#111216]">
                LIVE CHALLENGE
              </span>
              <span className="text-xs text-purple-200 font-bold">₹2,50,000 Prize Pool</span>
            </div>
            <h3 className="text-base font-bold text-white">
              NovaCloud National Scalability Sprint
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Design and containerize a resilient distributed logging microservice capable of processing 50,000 JSON payloads per second.
            </p>
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-gray-400">128 University Teams Submitted</span>
              <span className="font-bold text-[#D4F73C]">Final Submissions: June 15, 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Academic Collaboration */}
      {activeTab === 'collaboration' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Academic Collaboration & Center of Excellence (CoE)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Establish co-branded research labs and modernize academic syllabi to fit industry demands.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  Apex NIT — NovaCloud Center of Excellence in Cloud Computing
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  Active CoE
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Equipped 60 workstation terminals with cloud credits, containerization testbeds, and direct CI/CD sandbox environments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  B.Tech Curriculum Advisory Board (Board of Studies)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  Next Review: July 2026
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Recommended incorporation of Docker, Kubernetes, and FastAPI into third-year core systems engineering lab electives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Company Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Corporate Partner Profile & Accreditation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Company Legal Entity</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                NovaCloud Systems Private Limited (CIN: U72200KA2021PTC148921)
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Primary Tech Stack</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                Python, Go, PostgreSQL, Docker, AWS, Kubernetes
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">University Partnerships</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                14 Tier-1 & Tier-2 Engineering Institutions
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Hiring Point of Contact</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                Sophia Sterling (Lead University Talent Scout)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
