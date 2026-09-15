import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationTrendChart } from './ApplicationTrendChart';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  Target,
  FileText,
  Award,
  Video,
  X,
  Search,
  Filter,
  ExternalLink,
  GraduationCap,
  Eye,
  Check,
  Mail,
  Download,
  ChevronRight,
  Star,
  UserCheck,
  SlidersHorizontal,
} from 'lucide-react';

interface RecentAppItem {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  opportunityType: 'Internship' | 'Full-Time Job' | 'Capstone Project';
  matchPercentage: number;
  appliedDate: string;
  appliedTimeAgo: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  college: string;
  department: string;
  cgpa: number;
  graduationYear: number;
  skills: string[];
  topProject: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverNote: string;
  facultyEndorsement?: string;
}

export const IndustryDashboardPage: React.FC = () => {
  const {
    industryOpportunities,
    shortlistedCandidates,
    industryMentorship,
    navigate,
    showToast,
    shortlistCandidate,
    scheduleInterview,
    isDarkMode,
  } = useApp();

  // Comprehensive Demo Applications Dataset
  const [applications, setApplications] = useState<RecentAppItem[]>([
    {
      id: 'app_demo_1',
      studentId: 'cand_1',
      studentName: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      email: 'aarav.sharma@anit.ac.in',
      phone: '+91 98451 23091',
      role: 'Python Backend Intern',
      opportunityType: 'Internship',
      matchPercentage: 94,
      appliedDate: '2026-09-03',
      appliedTimeAgo: '1 day ago',
      status: 'Under Review',
      college: 'Apex National Institute of Technology',
      department: 'Computer Science & Engineering',
      cgpa: 9.15,
      graduationYear: 2027,
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'AWS'],
      topProject: 'Distributed Microservices Event Bus with Kafka & FastAPI',
      portfolioUrl: 'https://aarav-dev.portfolio.io',
      githubUrl: 'https://github.com/aarav-sharma-dev',
      coverNote: 'Passionate backend engineer with 2 production microservices built during collegiate hackathons. Excited to contribute to TechNova’s low-latency data pipelines.',
      facultyEndorsement: 'Endorsed by Prof. R. K. Iyer (Head of Cloud Systems Lab) for stellar database indexing architecture.',
    },
    {
      id: 'app_demo_2',
      studentId: 'cand_2',
      studentName: 'Riya Das',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'riya.das@iiit.ac.in',
      phone: '+91 97112 44390',
      role: 'Data Analyst & BI Intern',
      opportunityType: 'Internship',
      matchPercentage: 91,
      appliedDate: '2026-09-02',
      appliedTimeAgo: '2 days ago',
      status: 'Shortlisted',
      college: 'Indian Institute of Information Technology',
      department: 'AI & Data Science',
      cgpa: 8.92,
      graduationYear: 2026,
      skills: ['Python', 'SQL', 'Tableau', 'PowerBI', 'Pandas', 'Snowflake'],
      topProject: 'E-commerce Churn Prediction & Multi-Touch Attribution Engine',
      portfolioUrl: 'https://riyadas.analytics.dev',
      githubUrl: 'https://github.com/riya-das-analytics',
      coverNote: 'Extensive hands-on experience in cohort retention modeling and automated ETL pipelines connecting Postgres and BigQuery.',
      facultyEndorsement: 'Verified by Dr. M. Sen for Top Paper in Regional Data Science Colloquium.',
    },
    {
      id: 'app_demo_3',
      studentId: 'cand_3',
      studentName: 'Rahul Patnaik',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      email: 'rahul.patnaik@anit.ac.in',
      phone: '+91 99201 88712',
      role: 'Java Cloud Systems Engineer',
      opportunityType: 'Full-Time Job',
      matchPercentage: 88,
      appliedDate: '2026-08-31',
      appliedTimeAgo: '4 days ago',
      status: 'Interview',
      college: 'Apex National Institute of Technology',
      department: 'Information Technology',
      cgpa: 8.78,
      graduationYear: 2026,
      skills: ['Java 21', 'Spring Boot', 'Kubernetes', 'AWS EKS', 'Kafka', 'GraphQL'],
      topProject: 'High-Concurrency Banking Transaction Switch with Spring Cloud',
      githubUrl: 'https://github.com/rahul-patnaik-cloud',
      coverNote: 'Focused on enterprise-grade distributed systems and zero-downtime Canary deployments.',
      facultyEndorsement: 'AWS Certified Solutions Architect Associate (Verified by NPTEL / SkillBridge).',
    },
    {
      id: 'app_demo_4',
      studentId: 'cand_4',
      studentName: 'Ananya Singh',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      email: 'ananya.singh@delhitechnological.ac.in',
      phone: '+91 98103 55420',
      role: 'Frontend Systems Architect Intern',
      opportunityType: 'Internship',
      matchPercentage: 96,
      appliedDate: '2026-08-30',
      appliedTimeAgo: '5 days ago',
      status: 'Shortlisted',
      college: 'Delhi Technological University',
      department: 'Computer Science & Engineering',
      cgpa: 9.42,
      graduationYear: 2027,
      skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js', 'WebSockets', 'Jest'],
      topProject: 'Collaborative Real-Time Whiteboard with CRDTs and WebAssembly',
      portfolioUrl: 'https://ananyasingh.dev',
      githubUrl: 'https://github.com/ananya-singh-dev',
      coverNote: 'Winner of Smart India Hackathon 2025. Deeply interested in performance profiling, accessibility (a11y), and frontend component libraries.',
      facultyEndorsement: 'Department gold medalist in Advanced Web Architecture.',
    },
    {
      id: 'app_demo_5',
      studentId: 'cand_5',
      studentName: 'Vikramaditya Rao',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      email: 'vikram.rao@bits-pilani.ac.in',
      phone: '+91 94480 32187',
      role: 'Edge AI & Embedded IoT Engineer',
      opportunityType: 'Capstone Project',
      matchPercentage: 86,
      appliedDate: '2026-08-28',
      appliedTimeAgo: '1 week ago',
      status: 'Under Review',
      college: 'Birla Institute of Technology and Science',
      department: 'Electronics & Communication',
      cgpa: 8.65,
      graduationYear: 2026,
      skills: ['C++', 'Rust', 'TensorFlow Lite', 'RTOS', 'ESP32', 'MQTT'],
      topProject: 'Autonomous Agri-Drone Edge Vision with On-Device Pruned MobileNet',
      githubUrl: 'https://github.com/vikram-edge-ai',
      coverNote: 'Keen to collaborate on TechNova’s industrial vibration sensor monitoring system for smart factory predictive maintenance.',
      facultyEndorsement: 'Project sponsored under Industry-Academia R&D Grant 2025.',
    },
    {
      id: 'app_demo_6',
      studentId: 'cand_6',
      studentName: 'Neha Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      email: 'neha.deshmukh@coep.ac.in',
      phone: '+91 98220 19340',
      role: 'DevOps & Site Reliability Intern',
      opportunityType: 'Internship',
      matchPercentage: 89,
      appliedDate: '2026-08-27',
      appliedTimeAgo: '1 week ago',
      status: 'Selected',
      college: 'College of Engineering Pune',
      department: 'Computer Engineering',
      cgpa: 9.08,
      graduationYear: 2026,
      skills: ['Terraform', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana', 'Go'],
      topProject: 'Automated GitOps Infrastructure Provisioning for Multi-Region Clusters',
      portfolioUrl: 'https://nehadevops.cloud',
      githubUrl: 'https://github.com/neha-cloudops',
      coverNote: 'Completed Linux Foundation Certified Kubernetes Administrator (CKA). Eager to work with TechNova SRE squad.',
      facultyEndorsement: 'Certified by Red Hat University Partnership Academy.',
    },
  ]);

  // Filtering and Searching States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RecentAppItem['status']>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'cgpa'>('match');

  // Modal States
  const [inspectApp, setInspectApp] = useState<RecentAppItem | null>(null);
  const [interviewApp, setInterviewApp] = useState<RecentAppItem | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-09-15');
  const [interviewTime, setInterviewTime] = useState('11:00');
  const [interviewType, setInterviewType] = useState<'Online' | 'In-person'>('Online');
  const [meetingLocation, setMeetingLocation] = useState('https://meet.google.com/edubridge-tech-interview');
  const [interviewerName, setInterviewerName] = useState('Dr. Priya Menon (VP of Engineering)');
  const [interviewNotes, setInterviewNotes] = useState('Technical live pair programming + architecture review.');

  // Quick Action: Shortlist Candidate
  const handleShortlist = (app: RecentAppItem) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'Shortlisted' } : a))
    );
    const opp = industryOpportunities[0];
    if (opp) {
      shortlistCandidate(app.studentId, opp.id, `Shortlisted ${app.studentName} for ${app.role}`);
    }
    showToast(`Applicant ${app.studentName} has been shortlisted for ${app.role}!`, 'success');
  };

  // Quick Action: Open Interview Modal
  const handleOpenInterview = (app: RecentAppItem) => {
    setInterviewApp(app);
  };

  // Quick Action: Confirm Interview
  const handleConfirmInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewApp) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === interviewApp.id ? { ...a, status: 'Interview' } : a))
    );

    scheduleInterview(interviewApp.studentId, {
      date: interviewDate,
      time: `${interviewTime} IST`,
      type: interviewType,
      locationOrLink: meetingLocation,
      notes: `${interviewNotes} (Interviewer: ${interviewerName})`,
    });

    showToast(
      `Interview scheduled with ${interviewApp.studentName} on ${interviewDate} at ${interviewTime} IST!`,
      'success'
    );
    setInterviewApp(null);
  };

  // Quick Action: Update Status from Inspector
  const handleUpdateStatus = (appId: string, newStatus: RecentAppItem['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    showToast(`Application status updated to "${newStatus}"`, 'info');
    if (inspectApp && inspectApp.id === appId) {
      setInspectApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Filtered & Sorted Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        const matchesRole = roleFilter === 'All' || app.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
        if (sortBy === 'cgpa') return b.cgpa - a.cgpa;
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      });
  }, [applications, searchQuery, statusFilter, roleFilter, sortBy]);

  // Unique list of roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(applications.map((a) => a.role)));
  }, [applications]);

  // Quick Action: Export Current Application List as CSV
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) {
      showToast('No application records to export based on current filters.', 'warning');
      return;
    }

    const headers = [
      'Applicant ID',
      'Student Name',
      'Email',
      'Phone',
      'College / University',
      'Department',
      'CGPA',
      'Graduation Year',
      'Applied Role',
      'Opportunity Type',
      'AI Match Score (%)',
      'Application Status',
      'Applied Date',
      'Verified Skills',
      'Top Project',
      'Faculty Endorsement',
      'Portfolio URL',
      'GitHub URL',
    ];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredApplications.map((app) => [
      escapeCSV(app.studentId),
      escapeCSV(app.studentName),
      escapeCSV(app.email),
      escapeCSV(app.phone),
      escapeCSV(app.college),
      escapeCSV(app.department),
      escapeCSV(app.cgpa),
      escapeCSV(app.graduationYear),
      escapeCSV(app.role),
      escapeCSV(app.opportunityType),
      escapeCSV(app.matchPercentage),
      escapeCSV(app.status),
      escapeCSV(app.appliedDate),
      escapeCSV(app.skills.join(', ')),
      escapeCSV(app.topProject),
      escapeCSV(app.facultyEndorsement || 'N/A'),
      escapeCSV(app.portfolioUrl || 'N/A'),
      escapeCSV(app.githubUrl || 'N/A'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `recent_student_applications_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Successfully exported ${filteredApplications.length} applicants to CSV!`, 'success');
  };

  const activeOppCount = industryOpportunities.filter((o) => o.status === 'Active').length || 12;
  const projectsCount = industryOpportunities.filter((o) => o.type === 'Project').length || 5;

  return (
    <div id="industry-dashboard-container" className="space-y-8 pb-14 font-sans max-w-7xl mx-auto">
      {/* Demo Mode Notice */}
      <div
        id="industry-dash-demo-banner"
        className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-purple-700 dark:text-purple-300"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse shrink-0" />
          <span className="font-semibold">Industry Recruitment & R&D Portal:</span>
          <span>Active demo environment with simulated academic pipeline & verified student matching.</span>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-200/60 dark:bg-purple-900/60 px-2.5 py-0.5 rounded-md text-purple-900 dark:text-purple-100">
            TechNova Solutions Inc.
          </span>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
            Tier-1 Partner
          </span>
        </div>
      </div>

      {/* Header & Quick Action Buttons */}
      <div id="industry-dash-header" className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Industry Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Autumn 2026 Drive
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Discover verified student talent, track incoming candidate submissions, schedule technical rounds, and sponsor university capstone R&D initiatives.
          </p>
        </div>

        {/* Action Buttons */}
        <div id="industry-dash-action-toolbar" className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-post-internship-dash"
            onClick={() => navigate('/industry/post-internship')}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Internship</span>
          </button>
          <button
            id="btn-post-job-dash"
            onClick={() => navigate('/industry/post-job')}
            className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post Job</span>
          </button>
          <button
            id="btn-post-project-dash"
            onClick={() => navigate('/industry/post-project')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Post Project</span>
          </button>
          <button
            id="btn-ai-match-dash"
            onClick={() => navigate('/industry/candidates')}
            className="px-3.5 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c4e630] text-gray-900 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-gray-900" />
            <span>AI Candidate Match</span>
          </button>
        </div>
      </div>

      {/* 6 Key Summary Metric Cards */}
      <div id="industry-dash-summary-cards" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Active Opportunities */}
        <div
          id="stat-card-active-opps"
          onClick={() => navigate('/industry/manage-opportunities')}
          className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-400 group-hover:text-purple-600 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Opps</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-2 tabular-nums">
            {activeOppCount}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
            <TrendingUp className="w-3 h-3" />
            <span>3 new this week</span>
          </div>
        </div>

        {/* 2. Total Applications */}
        <div
          id="stat-card-applications"
          onClick={() => navigate('/industry/applications')}
          className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-400 group-hover:text-blue-600 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider">Applications</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 tabular-nums">
            86
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 block">
            Across 14 Colleges
          </span>
        </div>

        {/* 3. Shortlisted */}
        <div
          id="stat-card-shortlisted"
          onClick={() => navigate('/industry/shortlisted')}
          className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-400 group-hover:text-emerald-600 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shortlisted</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            {shortlistedCandidates.length || 18}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 block">
            Ready for Rounds
          </span>
        </div>

        {/* 4. Interviews */}
        <div
          id="stat-card-interviews"
          onClick={() => navigate('/industry/shortlisted')}
          className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-400 group-hover:text-amber-600 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
            7
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1.5 block">
            4 scheduled today
          </span>
        </div>

        {/* 5. Projects */}
        <div
          id="stat-card-projects"
          onClick={() => navigate('/industry/manage-opportunities')}
          className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-400 group-hover:text-indigo-600 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider">Capstones</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2 tabular-nums">
            {projectsCount}
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 block">
            Faculty Sponsored
          </span>
        </div>

        {/* 6. Mentorship */}
        <div
          id="stat-card-mentorship"
          onClick={() => navigate('/industry/mentorship')}
          className="p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-400 group-hover:text-purple-600 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mentorship</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 tabular-nums">
            {industryMentorship.length || 3}
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1.5 block">
            38 Active Mentees
          </span>
        </div>
      </div>

      {/* 30-Day Incoming Student Applications Trend Chart */}
      <ApplicationTrendChart isDarkMode={isDarkMode} />

      {/* Main Section: Recent Applications Table with Demo Data & Interactive Actions */}
      <div
        id="section-recent-applications"
        className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-6"
      >
        {/* Table Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Student Applications
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pre-verified profiles with multi-dimensional AI skill match, college academic records, and GitHub portfolios.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-gray-400 font-medium mr-1">
              Showing {filteredApplications.length} of {applications.length} applicants
            </span>
            <button
              id="btn-export-data-csv"
              onClick={handleExportCSV}
              className="text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1A1C24] hover:bg-gray-50 dark:hover:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 transition-all shadow-2xs"
              title="Download the current list of applications as a CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Export Data</span>
            </button>
            <button
              id="btn-view-all-apps"
              onClick={() => navigate('/industry/applications')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/40"
            >
              <span>Full Applications Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          id="recent-apps-filter-bar"
          className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        >
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="input-search-recent-apps"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, skill, role, or institute..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1C24] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'Under Review', 'Shortlisted', 'Interview', 'Selected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1A1C24] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Role Filter & Sort Options */}
          <div className="flex items-center gap-2">
            <select
              id="select-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by Role"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#1A1C24] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort applicants"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#1A1C24] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="match">Sort by Match %</option>
              <option value="date">Sort by Date</option>
              <option value="cgpa">Sort by CGPA</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5">
          <table id="table-recent-applications" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Candidate & College</th>
                <th className="py-3.5 px-3">Role & Type</th>
                <th className="py-3.5 px-3">AI Match Score</th>
                <th className="py-3.5 px-3">Verified Skills</th>
                <th className="py-3.5 px-3">Applied</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Recruiter Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      <span className="font-bold text-sm">No applications match the selected criteria.</span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('All');
                          setRoleFilter('All');
                        }}
                        className="text-purple-600 font-semibold text-xs hover:underline cursor-pointer mt-1"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    id={`app-row-${app.id}`}
                    className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Candidate Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={app.avatar}
                            alt={app.studentName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10 shrink-0"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#14151B] flex items-center justify-center text-white" title="Verified SkillBridge Student">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span>{app.studentName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              CGPA {app.cgpa}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                            {app.college}
                          </div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500">
                            {app.department} • Batch &apos;{app.graduationYear.toString().slice(2)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Applied */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {app.role}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                            app.opportunityType === 'Internship'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : app.opportunityType === 'Full-Time Job'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {app.opportunityType}
                        </span>
                      </div>
                    </td>

                    {/* AI Match Score */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 via-[#D4F73C] to-emerald-400 rounded-full transition-all"
                              style={{ width: `${app.matchPercentage}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs tabular-nums">
                            {app.matchPercentage}%
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block font-medium">
                          {app.matchPercentage >= 90 ? 'Exceptional Fit' : 'High Competency'}
                        </span>
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {app.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-white/5"
                          >
                            {sk}
                          </span>
                        ))}
                        {app.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400">
                            +{app.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {app.appliedDate}
                      </div>
                      <span className="text-[10px] text-gray-400 block">
                        {app.appliedTimeAgo}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          app.status === 'Shortlisted'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/30'
                            : app.status === 'Interview'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-500/30'
                            : app.status === 'Selected'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-500/30'
                            : app.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-500/30'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{app.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Candidate Details Modal */}
                        <button
                          id={`btn-view-app-${app.id}`}
                          onClick={() => setInspectApp(app)}
                          className="px-2.5 py-1.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-[11px] flex items-center gap-1 cursor-pointer border border-gray-200 dark:border-white/10"
                          title="View student profile & resume"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>

                        {/* Shortlist Button (if not already shortlisted or later) */}
                        {app.status === 'Under Review' && (
                          <button
                            id={`btn-shortlist-app-${app.id}`}
                            onClick={() => handleShortlist(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Shortlist</span>
                          </button>
                        )}

                        {/* Interview Button */}
                        <button
                          id={`btn-interview-app-${app.id}`}
                          onClick={() => handleOpenInterview(app)}
                          className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Video className="w-3 h-3" />
                          <span>Interview</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Action Strip */}
        {filteredApplications.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="text-[11px]">
              Showing {filteredApplications.length} of {applications.length} applications matching current filters.
            </span>
            <button
              id="btn-export-data-csv-footer"
              onClick={handleExportCSV}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer bg-purple-50 dark:bg-purple-950/30 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/30"
              title="Download the current list of applications as CSV"
            >
              <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Export {filteredApplications.length} Records as CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Two-Column Quick Access Section: Published Opportunities & AI Candidate Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Published Postings */}
        <div
          id="industry-published-opps-widget"
          className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Published Recruitment Requisitions</span>
            </h2>
            <button
              onClick={() => navigate('/industry/manage-opportunities')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Manage ({industryOpportunities.length})
            </button>
          </div>

          <div className="space-y-3">
            {industryOpportunities.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                      {opp.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {opp.location} • {opp.stipendOrSalary} • {opp.applicationsCount} Applicants
                  </div>
                </div>
                <button
                  onClick={() => navigate('/industry/candidates')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#D4F73C]" />
                  <span>Match</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Talent Spotlight */}
        <div
          id="industry-ai-talent-spotlight-widget"
          className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Campus Talent Matching Spotlight</span>
            </h2>
            <button
              onClick={() => navigate('/industry/candidates')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Explore All Talent
            </button>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Our multi-parameter engine compares verified student code on GitHub, collegiate capstones, and faculty verifications directly with your active role criteria.
          </p>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-emerald-500/5 to-transparent border border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                Top Recommendation: Ananya Singh (96% Match)
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#D4F73C] text-black">
                96% Match
              </span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-300">
              Expert in React 19, TypeScript, WebSockets, and UI Systems. Gold Medalist in Web Systems at DTU with verified production code.
            </p>
            <button
              onClick={() => navigate('/industry/candidates')}
              className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Run Automated AI Match on Shortlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Candidate Application Detail Modal */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-inspect-candidate"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={inspectApp.avatar}
                  alt={inspectApp.studentName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {inspectApp.studentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20">
                      {inspectApp.matchPercentage}% AI Fit
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {inspectApp.department} • {inspectApp.college}
                  </p>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                    Applying for: {inspectApp.role} ({inspectApp.opportunityType})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectApp(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & Contact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Academic CGPA</span>
                <span className="text-gray-900 dark:text-white font-extrabold text-sm">{inspectApp.cgpa} / 10.0</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Graduation Year</span>
                <span className="text-gray-900 dark:text-white font-extrabold text-sm">Class of {inspectApp.graduationYear}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Application Date</span>
                <span className="text-gray-900 dark:text-white font-extrabold text-sm">{inspectApp.appliedDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Current Status</span>
                <span className="font-extrabold text-sm text-purple-600 dark:text-purple-400">{inspectApp.status}</span>
              </div>
            </div>

            {/* Cover Note */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Candidate Statement
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                &ldquo;{inspectApp.coverNote}&rdquo;
              </p>
            </div>

            {/* Top Project Showcase */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Featured Capstone Project
              </h4>
              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-200 block">
                  {inspectApp.topProject}
                </span>
                <div className="flex items-center gap-3 mt-2">
                  {inspectApp.githubUrl && (
                    <a
                      href={inspectApp.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {inspectApp.portfolioUrl && (
                    <a
                      href={inspectApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Verified Skill Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {inspectApp.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-semibold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Faculty Endorsement */}
            {inspectApp.facultyEndorsement && (
              <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <Award className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Faculty Endorsement:</span>
                  <span>{inspectApp.facultyEndorsement}</span>
                </div>
              </div>
            )}

            {/* Recruiter Stage Updater */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-gray-600 dark:text-gray-300">Advance Stage:</span>
                {(['Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(inspectApp.id, st)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      inspectApp.status === st
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectApp(null);
                    handleOpenInterview(inspectApp);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Schedule Technical Round</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Schedule Interview Modal */}
      {interviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-schedule-interview"
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Schedule Candidate Interview
                </h3>
                <p className="text-xs text-gray-500">
                  {interviewApp.studentName} • {interviewApp.role}
                </p>
              </div>
              <button
                onClick={() => setInterviewApp(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmInterview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Interview Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Lead Interviewer
                </label>
                <input
                  type="text"
                  required
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  placeholder="e.g. Dr. Priya Menon (VP of Engineering)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Interview Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Online', 'In-person'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterviewType(type)}
                      className={`py-2 rounded-xl border font-bold cursor-pointer transition-all ${
                        interviewType === type
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {interviewType === 'Online' ? 'Meeting Link *' : 'Campus / Office Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder={interviewType === 'Online' ? 'https://meet.google.com/...' : 'TechNova Campus, Innovation Block B'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Notes / Agenda for Candidate
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Provide guidance on topics or coding environment..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setInterviewApp(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Send Calendar Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
