import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Briefcase,
  Award,
  GraduationCap,
  FlaskConical,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Search,
  Building2,
  Sparkles,
  FileText,
} from 'lucide-react';

export const FacultyPortalPage: React.FC = () => {
  const { facultyMembers, collegeInfo, showToast, currentPath, navigate } = useApp();

  const currentFaculty = facultyMembers[0] || {
    id: 'fac_1',
    name: 'Dr. Evelyn Vance',
    title: 'Professor & Dean of Research',
    department: 'Computer Science & Engineering',
    email: 'evelyn.vance@techuniv.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    college: 'Apex National Institute of Technology',
    designation: 'Senior Academician',
    specialization: 'Distributed Systems & Cloud Computing',
  };

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'internships'
    | 'training'
    | 'fdp'
    | 'consultancy'
    | 'research'
    | 'workshops'
    | 'projects'
    | 'profile'
  >('dashboard');

  useEffect(() => {
    if (currentPath.includes('/internships')) setActiveTab('internships');
    else if (currentPath.includes('/training') || currentPath.includes('/industrial-training')) setActiveTab('training');
    else if (currentPath.includes('/fdp')) setActiveTab('fdp');
    else if (currentPath.includes('/consultancy')) setActiveTab('consultancy');
    else if (currentPath.includes('/research')) setActiveTab('research');
    else if (currentPath.includes('/workshops') || currentPath.includes('/guest-lectures')) setActiveTab('workshops');
    else if (currentPath.includes('/projects') || currentPath.includes('/mentorship')) setActiveTab('projects');
    else if (currentPath.includes('/profile') || currentPath.includes('/settings')) setActiveTab('profile');
    else setActiveTab('dashboard');
  }, [currentPath]);

  const handleApplyOpportunity = (title: string) => {
    showToast(`Application / Registration submitted for: "${title}"`, 'success');
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={currentFaculty.avatar}
            alt={currentFaculty.name}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-white/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Faculty & Academician Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30">
                AICTE / UGC Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-1">
              {currentFaculty.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {currentFaculty.title} • {currentFaculty.department} ({collegeInfo.name})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('consultancy')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post Consultancy</span>
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className="px-4 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Joint Research Grants</span>
          </button>
        </div>
      </div>

      {/* Faculty Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'dashboard', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'internships', label: 'Faculty Internships', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'training', label: 'Industrial Training', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'fdp', label: 'FDP Programs', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'consultancy', label: 'Consultancy', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'research', label: 'Research & Patents', icon: <FlaskConical className="w-3.5 h-3.5" /> },
          { id: 'workshops', label: 'Workshops & Talks', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'projects', label: 'Student Mentoring', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'profile', label: 'Academic Profile', icon: <GraduationCap className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              navigate(`/faculty/${tab.id}`);
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#14151B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: 1. Overview Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Active Research Grants</span>
              <div className="text-3xl font-black text-gray-900 dark:text-white mt-1 tabular-nums">
                ₹34.5 L
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">TCS & DST Funded</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Joint Patents Filed</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                4 Patents
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">2 Approved, 2 In Review</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Students Mentored</span>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                38 Seniors
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">94% Placement Rate</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Corporate Consultancies</span>
              <div className="text-3xl font-black text-[#4D7C0F] dark:text-[#D4F73C] mt-1 tabular-nums">
                3 Projects
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">NovaCloud & Wipro</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>Featured Faculty Industry Immersion</span>
                </h2>
                <button
                  onClick={() => setActiveTab('internships')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">TCS Research Labs</span>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                      Summer Faculty Immersion: Cloud Scalability & Fault Tolerance
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">4 Weeks • Bangalore Campus • ₹75,000 Honorarium</p>
                  </div>
                  <button
                    onClick={() => handleApplyOpportunity('TCS Summer Faculty Immersion')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Infosys Campus Connect</span>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                      Industrial Training on GenAI Architecture & MLOps
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">2 Weeks • Hybrid • Industry Certificate</p>
                  </div>
                  <button
                    onClick={() => handleApplyOpportunity('Infosys GenAI Faculty Training')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Upcoming AICTE / NPTEL FDPs</span>
                </h2>
                <button
                  onClick={() => setActiveTab('fdp')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">AICTE ATAL Academy</span>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                      National FDP on High-Performance Cloud Computing & Microservices
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">May 12 - May 16, 2026 • Virtual Mode</p>
                  </div>
                  <button
                    onClick={() => handleApplyOpportunity('AICTE Cloud FDP')}
                    className="px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] text-[11px] font-bold cursor-pointer shrink-0"
                  >
                    Register
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">IIT Madras & NPTEL</span>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                      Advanced Systems Engineering & Verification Methodologies
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">Self-Paced • Verified Faculty Credit</p>
                  </div>
                  <button
                    onClick={() => handleApplyOpportunity('NPTEL Systems FDP')}
                    className="px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] text-[11px] font-bold cursor-pointer shrink-0"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: 2. Faculty Internships */}
      {activeTab === 'internships' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Industry Immersion & Faculty Internships
              </h2>
              <p className="text-xs text-gray-500">
                AICTE-mandated faculty internships with enterprise R&D departments to update classroom curriculum.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                company: 'TCS Research Labs',
                role: 'Distinguished Visiting Fellow — Cloud Systems',
                duration: '4 Weeks (Summer Term)',
                stipend: '₹75,000 Total Honorarium',
                location: 'Bangalore Innovation Hub',
                desc: 'Collaborate with enterprise cloud architects on distributed consensus algorithms and telemetry systems.',
              },
              {
                company: 'Wipro Technologies',
                role: 'Academic Consultant — Edge AI & Embedded Systems',
                duration: '6 Weeks',
                stipend: '₹90,000 Total Honorarium',
                location: 'Hyderabad Campus',
                desc: 'Work directly on industrial IoT telemetry, camera pipeline optimization, and AI inference latency.',
              },
              {
                company: 'NovaCloud Systems',
                role: 'Visiting Faculty — Distributed Databases',
                duration: '3 Weeks',
                stipend: '₹60,000 Total Honorarium',
                location: 'Remote / Bangalore',
                desc: 'Participate in architectural design reviews for zero-downtime database sharding and cross-region replication.',
              },
              {
                company: 'Accenture Technology Centers India',
                role: 'Research Fellow — Enterprise Security & Zero Trust',
                duration: '4 Weeks',
                stipend: '₹80,000 Total Honorarium',
                location: 'Pune Innovation Center',
                desc: 'Audit modern enterprise authentication protocols and design joint curriculum modules for university capstones.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    {item.company}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {item.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-2">
                    <span>{item.duration}</span>
                    <span>•</span>
                    <span className="font-bold text-gray-900 dark:text-white">{item.stipend}</span>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-end">
                  <button
                    onClick={() => handleApplyOpportunity(`${item.company} - ${item.role}`)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Apply for Faculty Fellowship
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 3. Industrial Training */}
      {activeTab === 'training' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Industrial Training Programs for Academicians
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Short-term hands-on industrial training with top IT & engineering centers.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Full-Stack Microservices Architecture Masterclass',
                provider: 'Infosys Campus Connect',
                dates: 'June 1 - June 10, 2026',
                mode: 'Hybrid (Online + 2 Days Hands-On at Mysore DC)',
                status: 'Open for Nominations',
              },
              {
                title: 'Modern DevOps & Kubernetes Cluster Administration for Professors',
                provider: 'NovaCloud Systems Academy',
                dates: 'July 5 - July 15, 2026',
                mode: 'Virtual Lab Environments',
                status: 'Open for Nominations',
              },
              {
                title: 'Data Science & Generative AI Workshop for Engineering Faculty',
                provider: 'Wipro TalentNext Program',
                dates: 'August 10 - August 20, 2026',
                mode: 'Bangalore Center',
                status: 'Nominations Closing Soon',
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">{p.provider}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{p.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.dates} • {p.mode}
                  </div>
                </div>
                <button
                  onClick={() => handleApplyOpportunity(p.title)}
                  className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-xs cursor-pointer shrink-0"
                >
                  Register Faculty Nomination
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 4. FDP Programs */}
      {activeTab === 'fdp' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Faculty Development Programs (FDPs)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              AICTE ATAL, NPTEL and industry co-certified programs to fulfill CAS and NBA/NAAC criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'AICTE ATAL: Next-Gen Autonomous Systems & Deep Reinforcement Learning',
                credits: '1 Faculty Credit',
                dates: 'July 2026',
                mode: 'Online',
              },
              {
                title: 'NPTEL: Cloud Computing & Virtualization Technologies',
                credits: '2 Faculty Credits',
                dates: '8-Week Course',
                mode: 'IIT Kharagpur Verified',
              },
              {
                title: 'Industry FDP: Modern Cyber Security Audits & Zero Trust Frameworks',
                credits: 'Industry Certificate',
                dates: 'August 2026',
                mode: 'Accenture India',
              },
              {
                title: 'AICTE: Quantum Computing Foundations for Computer Science Faculty',
                credits: '1.5 Faculty Credits',
                dates: 'September 2026',
                mode: 'IISc Bangalore Partnership',
              },
            ].map((fdp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                    {fdp.credits}
                  </span>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-2 leading-snug">
                    {fdp.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">{fdp.dates} • {fdp.mode}</p>
                </div>
                <button
                  onClick={() => handleApplyOpportunity(fdp.title)}
                  className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                >
                  Enroll in FDP
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 5. Consultancy */}
      {activeTab === 'consultancy' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Academic-Industry Consultancy Engagements
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Monetize institutional expertise by solving complex technical problems for corporate partners.
              </p>
            </div>
            <button
              onClick={() => showToast('Consultancy proposal submission modal opened.', 'info')}
              className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Offer New Consultancy Service</span>
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'High-Concurrency PostgreSQL Query Optimizer for NovaCloud',
                budget: '₹4,50,000',
                duration: '3 Months',
                status: 'Active Engagement',
                deliverables: 'Query profiling script, schema indexing redesign, live stress test report.',
              },
              {
                title: 'Zero-Trust Network Access (ZTNA) Architecture Audit for FinTech Partner',
                budget: '₹6,00,000',
                duration: '4 Months',
                status: 'Proposal Approved',
                deliverables: 'Threat modeling matrix, RBAC policy audit, compliance verification report.',
              },
            ].map((con, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{con.title}</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-extrabold text-[#4D7C0F] dark:text-[#D4F73C]">{con.budget}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30">
                      {con.status}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">Duration: {con.duration}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Deliverables:</span> {con.deliverables}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 6. Joint Research & Patents */}
      {activeTab === 'research' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Joint Research Grants & Corporate Patents
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Co-author high-impact IEEE/ACM publications and file shared intellectual property with industry leaders.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Indian Patent 2026110492: Adaptive Latency Minimization in Edge Micro-Clouds',
                coInventors: 'Dr. Evelyn Vance, Sophia Sterling (NovaCloud)',
                status: 'Patent Published (Indian Patent Office)',
                filedDate: 'January 2026',
              },
              {
                title: 'DST-SERB Grant: Energy-Efficient Tensor Processing for Micro-Robotics',
                coInventors: 'Dr. Evelyn Vance & Wipro Autonomous Systems Research',
                status: 'Active Grant (₹28,50,000 funded)',
                filedDate: 'Ongoing Term',
              },
            ].map((res, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{res.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-500/30">
                    {res.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">Co-Inventors / Investigators: {res.coInventors}</p>
                <p className="text-[11px] text-gray-400">Timeline: {res.filedDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 7. Workshops & Talks */}
      {activeTab === 'workshops' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Workshops & Expert Guest Lectures
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Invite industry CTOs and lead architects to address students or conduct technical workshops.
              </p>
            </div>
            <button
              onClick={() => showToast('Guest lecture scheduling form opened.', 'info')}
              className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs cursor-pointer"
            >
              Schedule New Expert Talk
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                topic: 'Scaling Distributed Microservices from 10k to 10M QPS',
                speaker: 'Chief Technology Architect, TCS Digital',
                date: 'May 18, 2026',
                attendees: '240 Registered Students',
              },
              {
                topic: 'Building Production Generative AI Applications with LangChain & Vector Databases',
                speaker: 'Lead AI Engineer, NovaCloud',
                date: 'May 28, 2026',
                attendees: '310 Registered Students',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{item.topic}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Speaker: {item.speaker}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Date: {item.date}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                  {item.attendees}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 8. Student Projects Guided */}
      {activeTab === 'projects' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Student Capstone Projects Guided
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Final-year engineering capstone batches under Dr. Evelyn Vance's technical mentorship.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                batch: 'Team Apex 01 (Aarav Patel, Riya Sharma, Rohan Gupta)',
                project: 'Automated Microservices Deployment & Canary Testing Pipeline',
                industryPartner: 'NovaCloud Systems (Mentored by Sophia Sterling)',
                status: 'Published on GitHub & Ready for Industry Review',
              },
              {
                batch: 'Team Apex 04 (Pooja Nair, Vikram Singh)',
                project: 'Zero-Copy Shared Memory IPC for Linux Containers',
                industryPartner: 'TCS Innovation Hub',
                status: 'Prototype Stage (Patent Drafting in Progress)',
              },
            ].map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{b.project}</h3>
                  <span className="text-[11px] font-bold text-emerald-600">{b.status}</span>
                </div>
                <p className="text-[11px] text-gray-500">Student Team: {b.batch}</p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                  Industry Co-Mentor: {b.industryPartner}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 9. Academic Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Academician Institutional Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Specialization</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                {currentFaculty.specialization}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Institutional ID / OrcID</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                0000-0002-1825-0097 (Verified)
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Total Publications</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                42 Scopus / SCI Indexed Papers (h-index: 18)
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 block text-[11px]">Institutional Affiliation</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm mt-0.5 block">
                {collegeInfo.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
