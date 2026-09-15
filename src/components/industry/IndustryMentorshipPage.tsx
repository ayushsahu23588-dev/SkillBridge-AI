import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  Plus,
  Award,
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  X,
  ArrowRight,
  UserCheck,
  Edit2,
  Briefcase,
  Layers,
  Inbox,
  Loader2,
} from 'lucide-react';

export interface MentorshipProgram {
  id: string;
  programTitle: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  domain: string;
  description: string;
  skillsCovered: string[];
  duration: string;
  maxMentees: number;
  enrolledCount: number;
  deadline: string;
  status: 'Active' | 'Open' | 'Completed' | 'Closed';
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  domain: string;
  skills: string[];
  menteesCount: number;
  availability: string;
}

export interface MentorshipRequest {
  id: string;
  studentName: string;
  studentAvatar: string;
  college: string;
  programTitle: string;
  statement: string;
  requestDate: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

const STORAGE_KEY_PROGRAMS = 'skillbridge_industry_mentorship_programs_v1';
const STORAGE_KEY_REQUESTS = 'skillbridge_industry_mentorship_requests_v1';

export const IndustryMentorshipPage: React.FC = () => {
  const { industryMentorship, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'active' | 'mentors' | 'requests' | 'completed'
  >('active');

  const [programs, setPrograms] = useState<MentorshipProgram[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRAMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ment_1',
        programTitle: 'Advanced Cloud Architecture & Telemetry Cohort',
        mentorName: 'Vikram Malhotra',
        mentorRole: 'Senior Principal Cloud Architect',
        mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        domain: 'Cloud & Distributed Systems',
        description: 'Guided 8-week immersion into building high-throughput microservices, telemetry ingestion, and Linux networking for cloud native platforms.',
        skillsCovered: ['Kubernetes', 'Go', 'Distributed Tracing', 'Docker', 'gRPC'],
        duration: '8 Weeks',
        maxMentees: 20,
        enrolledCount: 18,
        deadline: '2026-09-30',
        status: 'Active',
      },
      {
        id: 'ment_2',
        programTitle: 'Full-Stack Modern React & TypeScript Engineering',
        mentorName: 'Sneha Ranganathan',
        mentorRole: 'Staff Frontend Engineer',
        mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        domain: 'Web Engineering & Frontend',
        description: 'Hands-on architectural mentorship covering high-performance React design patterns, state management, and accessibility standards.',
        skillsCovered: ['React', 'TypeScript', 'Tailwind CSS', 'Web Performance', 'REST APIs'],
        duration: '6 Weeks',
        maxMentees: 15,
        enrolledCount: 12,
        deadline: '2026-10-15',
        status: 'Active',
      },
      {
        id: 'ment_3',
        programTitle: 'Production Applied Machine Learning & Vector Search',
        mentorName: 'Dr. Alok Sen',
        mentorRole: 'AI Research Scientist',
        mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        domain: 'Artificial Intelligence & Data',
        description: 'Deep dive into model quantization, fine-tuning, embedding spaces, and retrieval augmented generation pipelines.',
        skillsCovered: ['PyTorch', 'Vector DBs', 'Transformers', 'Python', 'MLOps'],
        duration: '10 Weeks',
        maxMentees: 12,
        enrolledCount: 12,
        deadline: '2026-06-15',
        status: 'Completed',
      },
    ];
  });

  const [mentors] = useState<MentorProfile[]>([
    {
      id: 'm_1',
      name: 'Vikram Malhotra',
      role: 'Senior Principal Cloud Architect',
      company: 'TechNova Solutions',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      domain: 'Cloud Architecture & Linux Systems',
      skills: ['Kubernetes', 'Go', 'AWS', 'Distributed Systems'],
      menteesCount: 24,
      availability: '4 hrs / week (Weekends)',
    },
    {
      id: 'm_2',
      name: 'Sneha Ranganathan',
      role: 'Staff Frontend Engineer',
      company: 'TechNova Solutions',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      domain: 'Frontend & Design Systems',
      skills: ['React', 'TypeScript', 'GraphQL', 'Next.js'],
      menteesCount: 18,
      availability: '3 hrs / week (Evenings)',
    },
    {
      id: 'm_3',
      name: 'Rohit Verma',
      role: 'Head of Engineering',
      company: 'TechNova Solutions',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      domain: 'Engineering Leadership & Backend',
      skills: ['Java', 'Spring Boot', 'System Design', 'Kafka'],
      menteesCount: 30,
      availability: '2 hrs / week (Bi-weekly)',
    },
  ]);

  const [requests, setRequests] = useState<MentorshipRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'req_1',
        studentName: 'Aarav Sharma',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        college: 'Apex National Institute of Technology',
        programTitle: 'Advanced Cloud Architecture & Telemetry Cohort',
        statement: 'I am currently designing a distributed telemetry collector and would benefit immensely from guidance on edge buffer pooling.',
        requestDate: '2026-09-03',
        status: 'Pending',
      },
      {
        id: 'req_2',
        studentName: 'Riya Das',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        college: 'Apex National Institute of Technology',
        programTitle: 'Production Applied Machine Learning & Vector Search',
        statement: 'Seeking research mentorship on model pruning and latency benchmarks in clinical imaging workloads.',
        requestDate: '2026-09-02',
        status: 'Pending',
      },
    ];
  });

  // Persist programs & requests
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRAMS, JSON.stringify(programs));
    } catch (e) {
      console.error(e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<MentorshipProgram | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formMentorName, setFormMentorName] = useState('');
  const [formDomain, setFormDomain] = useState('Cloud & Distributed Systems');
  const [formDescription, setFormDescription] = useState('');
  const [formSkills, setFormSkills] = useState('Kubernetes, Docker, Go, System Design');
  const [formDuration, setFormDuration] = useState('8 Weeks');
  const [formMaxMentees, setFormMaxMentees] = useState('20');
  const [formDeadline, setFormDeadline] = useState('2026-10-30');

  const openCreateModal = () => {
    setEditingProgram(null);
    setFormTitle('');
    setFormMentorName('Vikram Malhotra');
    setFormDomain('Cloud & Distributed Systems');
    setFormDescription('');
    setFormSkills('Kubernetes, Docker, Go, System Design');
    setFormDuration('8 Weeks');
    setFormMaxMentees('20');
    setFormDeadline('2026-10-30');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (prog: MentorshipProgram) => {
    setEditingProgram(prog);
    setFormTitle(prog.programTitle);
    setFormMentorName(prog.mentorName);
    setFormDomain(prog.domain);
    setFormDescription(prog.description);
    setFormSkills(prog.skillsCovered.join(', '));
    setFormDuration(prog.duration);
    setFormMaxMentees(String(prog.maxMentees));
    setFormDeadline(prog.deadline);
    setIsCreateModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMentorName.trim()) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const skillsArray = formSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingProgram) {
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === editingProgram.id
              ? {
                  ...p,
                  programTitle: formTitle,
                  mentorName: formMentorName,
                  domain: formDomain,
                  description: formDescription,
                  skillsCovered: skillsArray,
                  duration: formDuration,
                  maxMentees: parseInt(formMaxMentees, 10) || 20,
                  deadline: formDeadline,
                }
              : p
          )
        );
        showToast(`Program "${formTitle}" updated successfully!`, 'success');
      } else {
        const newProgram: MentorshipProgram = {
          id: `ment_${Date.now()}`,
          programTitle: formTitle,
          mentorName: formMentorName,
          mentorRole: 'Senior Principal Engineer',
          mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          domain: formDomain,
          description: formDescription,
          skillsCovered: skillsArray,
          duration: formDuration,
          maxMentees: parseInt(formMaxMentees, 10) || 20,
          enrolledCount: 0,
          deadline: formDeadline,
          status: 'Active',
        };
        setPrograms([newProgram, ...programs]);
        showToast(`Mentorship program "${formTitle}" created!`, 'success');
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      showToast('Failed to save mentorship program.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseProgram = (progId: string) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === progId ? { ...p, status: 'Completed' } : p))
    );
    showToast('Program marked as Completed/Closed.', 'info');
  };

  const handleRequestAction = (reqId: string, action: 'Accepted' | 'Declined') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: action } : r))
    );
    showToast(`Mentorship request marked as ${action}.`, 'success');
  };

  const activePrograms = programs.filter((p) => p.status === 'Active' || p.status === 'Open');
  const completedPrograms = programs.filter((p) => p.status === 'Completed' || p.status === 'Closed');
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Industry Mentorship
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Offer mentorship cohorts, manage mentors, review student mentorship requests, and track program outcomes.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Program</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'active'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Active Programs ({activePrograms.length})
        </button>

        <button
          onClick={() => setActiveTab('mentors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'mentors'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Available Mentors ({mentors.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'requests'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Mentorship Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'completed'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Completed Mentorships ({completedPrograms.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activePrograms.map((prog) => (
            <div
              key={prog.id}
              className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20">
                    {prog.status}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{prog.duration}</span>
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {prog.programTitle}
                </h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block mt-0.5">
                  {prog.domain}
                </span>

                <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <img
                    src={prog.mentorAvatar}
                    alt={prog.mentorName}
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/20 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">
                      {prog.mentorName}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {prog.mentorRole}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>

                <div className="mt-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Skills Covered
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {prog.skillsCovered.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/10 text-[10px] font-medium text-gray-700 dark:text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-400">Enrolled: </span>
                    <strong className="text-gray-800 dark:text-gray-200">
                      {prog.enrolledCount} / {prog.maxMentees}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Deadline: </span>
                    <strong className="text-gray-800 dark:text-gray-200">{prog.deadline}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => openEditModal(prog)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleCloseProgram(prog.id)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                >
                  Close Program
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/20 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{m.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.role}</p>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                      {m.company}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Domain</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{m.domain}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-gray-500">
                    <span>Mentees Guided:</span>
                    <strong className="text-gray-900 dark:text-white">{m.menteesCount}+</strong>
                  </div>

                  <div className="flex items-center justify-between text-gray-500">
                    <span>Availability:</span>
                    <strong className="text-gray-900 dark:text-white">{m.availability}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={openCreateModal}
                className="w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs border border-purple-200 dark:border-purple-800 cursor-pointer"
              >
                Assign to New Program
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Inbox className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <div className="font-bold text-base text-gray-800 dark:text-gray-200">
                No mentorship requests
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Student applications for active mentorship cohorts will show up here for company mentor review.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {requests.map((req) => (
                <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={req.studentAvatar}
                      alt={req.studentName}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                          {req.studentName}
                        </h4>
                        <span className="text-[11px] text-gray-400">({req.college})</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700'
                              : req.status === 'Declined'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                        Applied for: {req.programTitle}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                        "{req.statement}"
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        Requested on {req.requestDate}
                      </span>
                    </div>
                  </div>

                  {req.status === 'Pending' ? (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleRequestAction(req.id, 'Accepted')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRequestAction(req.id, 'Declined')}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-red-50 hover:text-red-600 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 italic">
                      Decision Recorded
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {completedPrograms.map((prog) => (
            <div
              key={prog.id}
              className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between space-y-4 opacity-80"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    Completed
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{prog.duration}</span>
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {prog.programTitle}
                </h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block mt-0.5">
                  {prog.domain}
                </span>

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                  {prog.description}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500">
                  <span>Graduated Students:</span>
                  <strong className="text-gray-800 dark:text-gray-200">
                    {prog.enrolledCount} Mentees
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-bold">Cohort Concluded</span>
                <button
                  onClick={() => openEditModal(prog)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Program Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  {editingProgram ? 'Edit Mentorship Program' : 'Create Mentorship Program'}
                </h3>
                <p className="text-gray-500">
                  Specify details, domain curriculum, and mentor assignments.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Telemetry & Go Concurrency Cohort"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Mentor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMentorName}
                    onChange={(e) => setFormMentorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    required
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline syllabus, weekly commitments, and expected student outcomes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Skills Covered (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kubernetes, Go, Docker, gRPC"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formMaxMentees}
                    onChange={(e) => setFormMaxMentees(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{editingProgram ? 'Saving Changes...' : 'Creating Program...'}</span>
                    </>
                  ) : (
                    <span>{editingProgram ? 'Save Changes' : 'Create Program'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
