import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AdminUserItem,
  AdminOpportunityItem,
  AdminApplicationItem,
  UserRole,
} from '../../types';
import {
  ShieldCheck,
  Users,
  Briefcase,
  TrendingUp,
  FileText,
  Building2,
  Award,
  Layers,
  Sparkles,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Settings,
  BarChart3,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  ChevronRight,
  Printer,
  FileCheck,
  Server,
  Activity,
  RotateCcw,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { AdminUserModal } from './AdminUserModal';
import { AdminOpportunityModal } from './AdminOpportunityModal';
import { AdminApplicationModal } from './AdminApplicationModal';

export const AdminPortalPage: React.FC = () => {
  const {
    adminUsers,
    updateAdminUser,
    deleteAdminUser,
    adminOpportunities,
    updateAdminOpportunity,
    adminApplications,
    updateAdminApplication,
    platformSettings,
    updatePlatformSettings,
    resetPlatformDemoData,
    showToast,
    isDarkMode,
    currentPath,
    navigate,
  } = useApp();

  // Tab routing
  const getInitialTab = () => {
    if (currentPath.includes('/admin/users')) return 'users';
    if (currentPath.includes('/admin/opportunities')) return 'opportunities';
    if (currentPath.includes('/admin/applications')) return 'applications';
    if (currentPath.includes('/admin/reports')) return 'reports';
    if (currentPath.includes('/admin/analytics')) return 'analytics';
    if (currentPath.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'opportunities' | 'applications' | 'reports' | 'analytics' | 'settings'
  >(getInitialTab);

  // Synchronize activeTab whenever currentPath changes from sidebar/navigation
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [currentPath]);

  // Modals state
  const [selectedUserForModal, setSelectedUserForModal] = useState<AdminUserItem | null>(null);
  const [selectedOppForModal, setSelectedOppForModal] = useState<AdminOpportunityItem | null>(null);
  const [selectedAppForModal, setSelectedAppForModal] = useState<AdminApplicationItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Users Tab Filters
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserRole>('All');
  const [userStatusFilter, setUserStatusFilter] = useState<'All' | AdminUserItem['status']>('All');
  const [userSearch, setUserSearch] = useState('');

  // Opportunities Tab Filters
  const [oppSearch, setOppSearch] = useState('');
  const [oppTypeFilter, setOppTypeFilter] = useState('All');
  const [oppStatusFilter, setOppStatusFilter] = useState('All');

  // Applications Tab Filters
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  // Reports state
  const [reportType, setReportType] = useState('Platform Activity');
  const [generatedReport, setGeneratedReport] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState(platformSettings);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return adminUsers.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.organization.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [adminUsers, userSearch, userRoleFilter, userStatusFilter]);

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    return adminOpportunities.filter((o) => {
      const matchSearch =
        o.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
        o.provider.toLowerCase().includes(oppSearch.toLowerCase());
      const matchType = oppTypeFilter === 'All' || o.type === oppTypeFilter;
      const matchStatus = oppStatusFilter === 'All' || o.status === oppStatusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [adminOpportunities, oppSearch, oppTypeFilter, oppStatusFilter]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return adminApplications.filter((a) => {
      const matchSearch =
        a.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.opportunityTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.company.toLowerCase().includes(appSearch.toLowerCase());
      const matchStatus = appStatusFilter === 'All' || a.status === appStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [adminApplications, appSearch, appStatusFilter]);

  // Chart Data
  const roleDistributionData = [
    { name: 'Students', value: 4200, color: '#3B82F6' },
    { name: 'Faculty & Mentors', value: 620, color: '#10B981' },
    { name: 'Industry Partners', value: 280, color: '#8B5CF6' },
    { name: 'Institutions', value: 100, color: '#F59E0B' },
  ];

  const oppTypeData = [
    { type: 'Internships', count: 180 },
    { type: 'Full-time Jobs', count: 110 },
    { type: 'Research Projects', count: 45 },
    { type: 'Industry Workshops', count: 30 },
    { type: 'Mentorship', count: 15 },
  ];

  const platformVolumeData = [
    { month: 'Sep', applications: 1800, matches: 1400 },
    { month: 'Oct', applications: 3400, matches: 2800 },
    { month: 'Nov', applications: 5600, matches: 4600 },
    { month: 'Dec', applications: 8200, matches: 6900 },
    { month: 'Jan', applications: 10400, matches: 8800 },
    { month: 'Feb', applications: 12400, matches: 10500 },
  ];

  const nationwideSkillsData = [
    { skill: 'Python / AI', demand: 94 },
    { skill: 'Java / Microservices', demand: 88 },
    { skill: 'Cloud & DevOps', demand: 82 },
    { skill: 'SQL & Data Warehousing', demand: 80 },
    { skill: 'Frontend & React', demand: 76 },
    { skill: 'Cybersecurity', demand: 68 },
  ];

  const operationsHealthData = [
    { metric: 'API Gateway', status: 99.99, fill: '#10B981' },
    { metric: 'AI Match Engine', status: 99.95, fill: '#3B82F6' },
    { metric: 'Storage / DB', status: 99.98, fill: '#8B5CF6' },
    { metric: 'Auth Services', status: 100, fill: '#10B981' },
  ];

  // Export JSON helper
  const handleExportPlatformData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      platformSettings,
      usersCount: adminUsers.length,
      users: adminUsers,
      opportunitiesCount: adminOpportunities.length,
      opportunities: adminOpportunities,
      applicationsCount: adminApplications.length,
      applications: adminApplications,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_Platform_Export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Platform database exported successfully as JSON.', 'success');
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-7xl mx-auto">
      {/* 9.1 Platform Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                SkillBridge AI Governance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Multi-Tenant Operational • 99.98% SLA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-1">
              Platform Administration & System Governance
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Super Administrator oversight for 5,200+ users, 100+ partner universities, and 280+ active corporate recruiters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            onClick={handleExportPlatformData}
            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Platform JSON</span>
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Audit Reports</span>
          </button>
        </div>
      </div>

      {/* 9.2 Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-thin">
        {[
          { id: 'dashboard', label: 'Admin Dashboard', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'users', label: 'User Management', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'opportunities', label: 'Opportunities Moderation', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'applications', label: 'Application Oversight', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { id: 'reports', label: 'Platform Reports', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'analytics', label: 'Advanced Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'settings', label: 'Platform Settings', icon: <Settings className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-[#14151B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 font-medium'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 9.1 ADMIN DASHBOARD TAB */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 8 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">TOTAL USERS</span>
              <div className="text-xl font-black text-gray-900 dark:text-white mt-1 tabular-nums">
                5,200
              </div>
              <span className="text-[9px] text-blue-600 font-bold block mt-0.5">Platform Wide</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">STUDENTS</span>
              <div className="text-xl font-black text-blue-600 mt-1 tabular-nums">4,200</div>
              <span className="text-[9px] text-gray-500 font-semibold block mt-0.5">80.7% Share</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">FACULTY</span>
              <div className="text-xl font-black text-emerald-600 mt-1 tabular-nums">620</div>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Mentors & HODs</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">INDUSTRY</span>
              <div className="text-xl font-black text-purple-600 mt-1 tabular-nums">280</div>
              <span className="text-[9px] text-purple-600 font-semibold block mt-0.5">Enterprise Accounts</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">INSTITUTIONS</span>
              <div className="text-xl font-black text-amber-600 mt-1 tabular-nums">100</div>
              <span className="text-[9px] text-amber-600 font-semibold block mt-0.5">Partner Colleges</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">OPPORTUNITIES</span>
              <div className="text-xl font-black text-rose-600 mt-1 tabular-nums">380</div>
              <span className="text-[9px] text-rose-600 font-semibold block mt-0.5">Active Listings</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">APPLICATIONS</span>
              <div className="text-xl font-black text-indigo-600 mt-1 tabular-nums">12,400</div>
              <span className="text-[9px] text-indigo-600 font-semibold block mt-0.5">Processed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold block">PLACEMENTS</span>
              <div className="text-xl font-black text-emerald-600 mt-1 tabular-nums">1,560</div>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Verified Hires</span>
            </div>
          </div>

          {/* 6 Recharts Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chart 1: User Distribution */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    User Distribution
                  </h3>
                  <p className="text-xs text-gray-900 dark:text-white font-semibold">
                    Multi-Tenant Persona Composition
                  </p>
                </div>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={40}>
                      {roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {roleDistributionData.map((r) => (
                  <div key={r.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-gray-600 dark:text-gray-300 truncate">{r.name}: {r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Opportunities Breakdown */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Opportunities Breakdown
                  </h3>
                  <p className="text-xs text-gray-900 dark:text-white font-semibold">
                    380 Live Postings by Category
                  </p>
                </div>
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oppTypeData} margin={{ left: -15, right: 5, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="type" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Applications Funnel Volume */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Platform Application Flow
                  </h3>
                  <p className="text-xs text-gray-900 dark:text-white font-semibold">
                    Submissions vs AI Matches
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformVolumeData} margin={{ left: -15, right: 5, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="matches" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Top Demanded Skills */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    National Skill Demand Index
                  </h3>
                  <p className="text-xs text-gray-900 dark:text-white font-semibold">
                    Aggregated Across 280 Companies
                  </p>
                </div>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nationwideSkillsData} layout="vertical" margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" tick={{ fontSize: 10 }} unit="%" />
                    <YAxis type="category" dataKey="skill" tick={{ fontSize: 9 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 5: System Operational Health */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Service Reliability (SLA)
                  </h3>
                  <p className="text-xs text-gray-900 dark:text-white font-semibold">
                    Core Microservices Uptime %
                  </p>
                </div>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={operationsHealthData} margin={{ left: -15, right: 5, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="metric" tick={{ fontSize: 9 }} />
                    <YAxis domain={[99.9, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip />
                    <Bar dataKey="status" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: Real-time Platform Operations */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Live Operational Metrics
                  </h3>
                  <p className="text-xs text-gray-900 dark:text-white font-semibold">
                    Platform Load & Transactions
                  </p>
                </div>
                <Activity className="w-4 h-4 text-rose-500" />
              </div>
              <div className="space-y-3 text-xs pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500">Active Concurrent Sessions</span>
                  <span className="font-bold text-gray-900 dark:text-white">1,420</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500">Avg AI Matching Latency</span>
                  <span className="font-bold text-emerald-600">42 ms</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500">Storage Consumption</span>
                  <span className="font-bold text-blue-600">18.4 GB / 100 GB</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500">Database Transactions / min</span>
                  <span className="font-bold text-purple-600">3,850 ops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                System Super-Admin Tools
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => handleTabChange('users')}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Manage User Roles & Access</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => handleTabChange('opportunities')}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Review Pending Opportunities</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => handleTabChange('reports')}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Export System Audit Log</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-300 flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Reset Platform Demo Data</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Live Platform Governance Audit Trail
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { time: '2m ago', title: 'Opportunity Moderated', desc: 'Google India SWE Internship approved for public matching', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
                  { time: '15m ago', title: 'Institution Registered', desc: 'National Institute of Technology verified under AISHE C-18492', icon: <Building2 className="w-4 h-4 text-blue-600" /> },
                  { time: '45m ago', title: 'AI Match Batch Finished', desc: '480 candidate recommendations generated across 18 companies', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
                  { time: '2h ago', title: 'Role Elevation Event', desc: 'Dr. Rajesh Sharma elevated to Lead Academic Coordinator', icon: <UserCheck className="w-4 h-4 text-amber-500" /> },
                ].map((act, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {act.icon}
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{act.title}</span>
                        <span className="text-gray-500 text-[11px]">{act.desc}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9.3 USER MANAGEMENT TAB */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user by name, email, or organization..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold outline-hidden"
                >
                  <option value="All">All Roles (5,200)</option>
                  <option value="student">Students (4,200)</option>
                  <option value="faculty">Faculty & Mentors (620)</option>
                  <option value="company">Industry Partners (280)</option>
                  <option value="college_admin">Institutions (100)</option>
                  <option value="super_admin">Super Admins</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-xl object-cover border border-gray-200 dark:border-gray-800"
                          />
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-gray-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.organization}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : user.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{user.joinedDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedUserForModal(user)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Manage User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9.4 OPPORTUNITY MODERATION TAB */}
      {/* ========================================================= */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={oppSearch}
                  onChange={(e) => setOppSearch(e.target.value)}
                  placeholder="Search opportunities by title or corporate provider..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={oppTypeFilter}
                  onChange={(e) => setOppTypeFilter(e.target.value)}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold outline-hidden"
                >
                  <option value="All">All Types</option>
                  <option value="Internship">Internship</option>
                  <option value="Job">Job</option>
                  <option value="Research Project">Research Project</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Mentorship">Mentorship</option>
                </select>

                <select
                  value={oppStatusFilter}
                  onChange={(e) => setOppStatusFilter(e.target.value)}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Opportunities Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Applications</th>
                    <th className="py-3 px-4">Posted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                  {filteredOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{opp.title}</td>
                      <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">
                        {opp.provider}
                      </td>
                      <td className="py-3 px-4">{opp.type}</td>
                      <td className="py-3 px-4 font-bold">{opp.applicationsCount}</td>
                      <td className="py-3 px-4 text-gray-500">{opp.postedDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            opp.status === 'Active' || opp.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : opp.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {opp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOppForModal(opp)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9.5 APPLICATION OVERSIGHT TAB */}
      {/* ========================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search by student name, role, or company..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium outline-hidden"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold outline-hidden"
              >
                <option value="All">All Application Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">AI Match</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {app.studentName}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{app.opportunityTitle}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">{app.company}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-600">{app.matchScore}%</span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{app.appliedDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Selected'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : app.status === 'Interview'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAppForModal(app)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9.6 PLATFORM REPORTS TAB */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Platform Master Audit & Governance Reports
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
                >
                  <option value="Platform Activity">Complete Platform Operational Activity</option>
                  <option value="User Demographics">Multi-Role Demographic Census</option>
                  <option value="Opportunity Conversion">Opportunity Yield & Placement Conversion</option>
                  <option value="Skill Analytics">National Skill Supply vs Industrial Demand</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setGeneratedReport(true);
                    showToast('Platform audit report compiled successfully.', 'success');
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  Compile Platform Audit Dossier
                </button>
              </div>
            </div>
          </div>

          {generatedReport && (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-lg space-y-6 text-xs animate-in fade-in duration-200">
              <div className="flex items-start justify-between border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                    SKILLBRIDGE AI PLATFORM AUDIT REPORT
                  </span>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                    {reportType} Master Audit
                  </h2>
                  <p className="text-gray-500">
                    Generated on {new Date().toLocaleDateString()} • Certified by System Super Administrator
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Report</span>
                  </button>
                  <button
                    onClick={() => showToast('Audit report downloaded as PDF.', 'success')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">TOTAL USERS</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white">5,200</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">OPPORTUNITIES</span>
                  <span className="text-xl font-black text-purple-600">380</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">APPLICATIONS</span>
                  <span className="text-xl font-black text-blue-600">12,400</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">PLACEMENTS</span>
                  <span className="text-xl font-black text-emerald-600">1,560</span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200/60 dark:border-white/5">
                This report confirms that SkillBridge AI operates strictly in compliance with data privacy, role-based access isolation, verified academic assessment tracking, and bilateral corporate partnership standards. All platform data records are cryptographically signed and persistently synchronized.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 9.7 ADVANCED ANALYTICS TAB */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Platform Conversion Funnel Architecture
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { step: '1. Opportunities Posted', count: '380 Listings', pct: '100%', color: 'bg-blue-600' },
                  { step: '2. Student Applications', count: '12,400 Applications', pct: '85%', color: 'bg-indigo-600' },
                  { step: '3. AI Candidate Matches', count: '10,500 Matches', pct: '70%', color: 'bg-purple-600' },
                  { step: '4. Corporate Shortlists', count: '3,800 Shortlisted', pct: '50%', color: 'bg-amber-500' },
                  { step: '5. Technical Interviews', count: '2,200 Conducted', pct: '35%', color: 'bg-rose-500' },
                  { step: '6. Verified Placements', count: '1,560 Placements', pct: '25%', color: 'bg-emerald-600' },
                ].map((f) => (
                  <div key={f.step} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                      <span>{f.step}</span>
                      <span>{f.count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${f.color} rounded-full`} style={{ width: f.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Top Hiring Sectors Across Platform
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { sector: 'AI & Cloud Infrastructure', share: 38, count: '106 Companies' },
                  { sector: 'FinTech & Algorithmic Trading', share: 24, count: '68 Companies' },
                  { sector: 'Semiconductor & Embedded IoT', share: 18, count: '50 Companies' },
                  { sector: 'Robotics & Autonomous Systems', share: 12, count: '34 Companies' },
                  { sector: 'Cybersecurity & Defense Tech', share: 8, count: '22 Companies' },
                ].map((sec) => (
                  <div key={sec.sector} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white block">{sec.sector}</span>
                      <span className="text-[11px] text-gray-500">{sec.count}</span>
                    </div>
                    <span className="text-base font-black text-rose-600">{sec.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9.8 PLATFORM SETTINGS TAB */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Global Platform Governance Configuration
            </h3>
            <p className="text-xs text-gray-500">
              Manage core tenant security, automated moderation policies, and demo data state.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePlatformSettings(settingsForm);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                required
                value={settingsForm.platformName}
                onChange={(e) => setSettingsForm({ ...settingsForm, platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  AI Matching Algorithm Sensitivity
                </label>
                <select
                  value={settingsForm.aiMatchingSensitivity}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      aiMatchingSensitivity: e.target.value as any,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
                >
                  <option value="Balanced">Balanced (Default 60% threshold)</option>
                  <option value="Strict">Strict (High rigor 75% threshold)</option>
                  <option value="Permissive">Permissive (Exploratory 50% threshold)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Default Student Assessment Cycle
                </label>
                <select
                  value={settingsForm.defaultAssessmentCycle}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      defaultAssessmentCycle: e.target.value as any,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
                >
                  <option value="Semester">Semester-based (Every 6 Months)</option>
                  <option value="Quarterly">Quarterly (Every 3 Months)</option>
                  <option value="Annual">Annual (Yearly)</option>
                </select>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Allow Public User Registration
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Enable self-service registration for students and academicians
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.allowNewRegistrations}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, allowNewRegistrations: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-white/5">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Automated Corporate Opportunity Moderation
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Auto-approve listings from verified Tier-1 corporate partners
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.autoModerateOpportunities}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      autoModerateOpportunities: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo State</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Save Platform Governance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      <AdminUserModal
        user={selectedUserForModal}
        onClose={() => setSelectedUserForModal(null)}
        onUpdateUser={updateAdminUser}
      />

      <AdminOpportunityModal
        opportunity={selectedOppForModal}
        onClose={() => setSelectedOppForModal(null)}
        onUpdateOpportunity={updateAdminOpportunity}
      />

      <AdminApplicationModal
        application={selectedAppForModal}
        onClose={() => setSelectedAppForModal(null)}
        onUpdateStatus={(id, newStatus) => updateAdminApplication(id, { status: newStatus })}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Reset Demo Platform Data?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This will restore all student directories, college placements, active MoUs, admin user records, and platform configuration back to the initial demo datasets.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetPlatformDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
