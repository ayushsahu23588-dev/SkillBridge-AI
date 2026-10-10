import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Users,
  Briefcase,
  Activity,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Building2,
  Award,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  PieChart as PieIcon,
  Layers,
  ChevronDown,
  Target,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type TimeRange = '6M' | '12M' | '3Y' | 'ALL';
type CategoryFilter = 'all' | 'growth' | 'activity' | 'placements';
type CampusTier = 'all' | 'tier1' | 'tier2' | 'autonomous';

interface MonthlyMetricPoint {
  period: string;
  month: string;
  totalUsers: number;
  students: number;
  faculty: number;
  companies: number;
  institutions: number;
  newSignups: number;
  applications: number;
  aiMatches: number;
  interviews: number;
  activeSessions: number;
  offersExtended: number;
  verifiedPlacements: number;
  placementRate: number; // percentage
  avgTimeToPlacementDays: number;
  avgStipend: number;
}

export const PerformanceMetrics: React.FC = () => {
  const { isDarkMode, showToast } = useApp();

  const [timeRange, setTimeRange] = useState<TimeRange>('12M');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [campusTier, setCampusTier] = useState<CampusTier>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [searchTableQuery, setSearchTableQuery] = useState('');

  // Primary dataset over time (18 months from Oct 2024 to Mar 2026)
  const masterTimeSeriesData: MonthlyMetricPoint[] = useMemo(
    () => [
      {
        period: '2024-Q4',
        month: 'Oct 2024',
        totalUsers: 2150,
        students: 1720,
        faculty: 260,
        companies: 120,
        institutions: 50,
        newSignups: 320,
        applications: 3400,
        aiMatches: 2600,
        interviews: 610,
        activeSessions: 14200,
        offersExtended: 430,
        verifiedPlacements: 380,
        placementRate: 78.4,
        avgTimeToPlacementDays: 28.5,
        avgStipend: 1100,
      },
      {
        period: '2024-Q4',
        month: 'Nov 2024',
        totalUsers: 2480,
        students: 1980,
        faculty: 300,
        companies: 142,
        institutions: 58,
        newSignups: 330,
        applications: 4100,
        aiMatches: 3300,
        interviews: 750,
        activeSessions: 17800,
        offersExtended: 540,
        verifiedPlacements: 475,
        placementRate: 80.2,
        avgTimeToPlacementDays: 26.2,
        avgStipend: 1180,
      },
      {
        period: '2024-Q4',
        month: 'Dec 2024',
        totalUsers: 2820,
        students: 2260,
        faculty: 340,
        companies: 160,
        institutions: 60,
        newSignups: 340,
        applications: 4900,
        aiMatches: 4100,
        interviews: 890,
        activeSessions: 21500,
        offersExtended: 620,
        verifiedPlacements: 550,
        placementRate: 82.5,
        avgTimeToPlacementDays: 24.0,
        avgStipend: 1250,
      },
      {
        period: '2025-Q1',
        month: 'Jan 2025',
        totalUsers: 3190,
        students: 2560,
        faculty: 380,
        companies: 180,
        institutions: 70,
        newSignups: 370,
        applications: 5900,
        aiMatches: 4900,
        interviews: 1040,
        activeSessions: 26400,
        offersExtended: 730,
        verifiedPlacements: 660,
        placementRate: 84.1,
        avgTimeToPlacementDays: 22.4,
        avgStipend: 1320,
      },
      {
        period: '2025-Q1',
        month: 'Feb 2025',
        totalUsers: 3540,
        students: 2840,
        faculty: 420,
        companies: 204,
        institutions: 76,
        newSignups: 350,
        applications: 6800,
        aiMatches: 5800,
        interviews: 1220,
        activeSessions: 30200,
        offersExtended: 880,
        verifiedPlacements: 790,
        placementRate: 85.8,
        avgTimeToPlacementDays: 20.8,
        avgStipend: 1380,
      },
      {
        period: '2025-Q1',
        month: 'Mar 2025',
        totalUsers: 3880,
        students: 3120,
        faculty: 450,
        companies: 228,
        institutions: 82,
        newSignups: 340,
        applications: 7700,
        aiMatches: 6600,
        interviews: 1410,
        activeSessions: 33800,
        offersExtended: 1020,
        verifiedPlacements: 920,
        placementRate: 87.2,
        avgTimeToPlacementDays: 19.5,
        avgStipend: 1420,
      },
      {
        period: '2025-Q2',
        month: 'Apr 2025',
        totalUsers: 4160,
        students: 3340,
        faculty: 490,
        companies: 242,
        institutions: 88,
        newSignups: 280,
        applications: 8300,
        aiMatches: 7200,
        interviews: 1560,
        activeSessions: 36500,
        offersExtended: 1140,
        verifiedPlacements: 1040,
        placementRate: 88.5,
        avgTimeToPlacementDays: 18.2,
        avgStipend: 1470,
      },
      {
        period: '2025-Q2',
        month: 'May 2025',
        totalUsers: 4420,
        students: 3550,
        faculty: 520,
        companies: 254,
        institutions: 96,
        newSignups: 260,
        applications: 9100,
        aiMatches: 7900,
        interviews: 1690,
        activeSessions: 39400,
        offersExtended: 1250,
        verifiedPlacements: 1150,
        placementRate: 89.9,
        avgTimeToPlacementDays: 17.0,
        avgStipend: 1510,
      },
      {
        period: '2025-Q2',
        month: 'Jun 2025',
        totalUsers: 4650,
        students: 3740,
        faculty: 550,
        companies: 262,
        institutions: 98,
        newSignups: 230,
        applications: 9800,
        aiMatches: 8600,
        interviews: 1800,
        activeSessions: 42100,
        offersExtended: 1340,
        verifiedPlacements: 1240,
        placementRate: 91.2,
        avgTimeToPlacementDays: 16.2,
        avgStipend: 1550,
      },
      {
        period: '2025-Q3',
        month: 'Jul 2025',
        totalUsers: 4810,
        students: 3880,
        faculty: 570,
        companies: 268,
        institutions: 92,
        newSignups: 160,
        applications: 10400,
        aiMatches: 9100,
        interviews: 1910,
        activeSessions: 44500,
        offersExtended: 1410,
        verifiedPlacements: 1320,
        placementRate: 92.0,
        avgTimeToPlacementDays: 15.6,
        avgStipend: 1590,
      },
      {
        period: '2025-Q3',
        month: 'Aug 2025',
        totalUsers: 4940,
        students: 3990,
        faculty: 585,
        companies: 272,
        institutions: 93,
        newSignups: 130,
        applications: 11100,
        aiMatches: 9700,
        interviews: 2020,
        activeSessions: 46200,
        offersExtended: 1480,
        verifiedPlacements: 1390,
        placementRate: 92.7,
        avgTimeToPlacementDays: 15.0,
        avgStipend: 1620,
      },
      {
        period: '2025-Q3',
        month: 'Sep 2025',
        totalUsers: 5040,
        students: 4070,
        faculty: 600,
        companies: 275,
        institutions: 95,
        newSignups: 100,
        applications: 11600,
        aiMatches: 10050,
        interviews: 2110,
        activeSessions: 47400,
        offersExtended: 1530,
        verifiedPlacements: 1440,
        placementRate: 93.3,
        avgTimeToPlacementDays: 14.8,
        avgStipend: 1640,
      },
      {
        period: '2025-Q4',
        month: 'Oct 2025',
        totalUsers: 5120,
        students: 4130,
        faculty: 610,
        companies: 278,
        institutions: 102,
        newSignups: 80,
        applications: 12000,
        aiMatches: 10300,
        interviews: 2180,
        activeSessions: 48100,
        offersExtended: 1580,
        verifiedPlacements: 1490,
        placementRate: 93.8,
        avgTimeToPlacementDays: 14.5,
        avgStipend: 1660,
      },
      {
        period: '2025-Q4',
        month: 'Nov 2025',
        totalUsers: 5170,
        students: 4170,
        faculty: 615,
        companies: 279,
        institutions: 106,
        newSignups: 50,
        applications: 12250,
        aiMatches: 10420,
        interviews: 2210,
        activeSessions: 48600,
        offersExtended: 1610,
        verifiedPlacements: 1520,
        placementRate: 94.0,
        avgTimeToPlacementDays: 14.3,
        avgStipend: 1670,
      },
      {
        period: '2025-Q4',
        month: 'Dec 2025',
        totalUsers: 5200,
        students: 4200,
        faculty: 620,
        companies: 280,
        institutions: 100,
        newSignups: 30,
        applications: 12400,
        aiMatches: 10500,
        interviews: 2250,
        activeSessions: 48920,
        offersExtended: 1640,
        verifiedPlacements: 1560,
        placementRate: 94.2,
        avgTimeToPlacementDays: 14.2,
        avgStipend: 1680,
      },
    ],
    []
  );

  // Filter time series data based on chosen TimeRange
  const displayedTimeSeries = useMemo(() => {
    let sliced = masterTimeSeriesData;
    if (timeRange === '6M') {
      sliced = masterTimeSeriesData.slice(-6);
    } else if (timeRange === '12M') {
      sliced = masterTimeSeriesData.slice(-12);
    } else if (timeRange === '3Y' || timeRange === 'ALL') {
      sliced = masterTimeSeriesData;
    }

    // Apply campus tier factor if selected (scaling simulation)
    if (campusTier === 'tier1') {
      return sliced.map((d) => ({
        ...d,
        placementRate: Math.min(99.4, Number((d.placementRate * 1.04).toFixed(1))),
        avgStipend: Math.round(d.avgStipend * 1.35),
        avgTimeToPlacementDays: Number((d.avgTimeToPlacementDays * 0.82).toFixed(1)),
      }));
    } else if (campusTier === 'tier2') {
      return sliced.map((d) => ({
        ...d,
        placementRate: Number((d.placementRate * 0.96).toFixed(1)),
        avgStipend: Math.round(d.avgStipend * 0.9),
      }));
    } else if (campusTier === 'autonomous') {
      return sliced.map((d) => ({
        ...d,
        placementRate: Number((d.placementRate * 1.01).toFixed(1)),
        avgStipend: Math.round(d.avgStipend * 1.08),
      }));
    }

    return sliced;
  }, [masterTimeSeriesData, timeRange, campusTier]);

  // Current latest values & comparisons
  const latestMetric = displayedTimeSeries[displayedTimeSeries.length - 1];
  const previousMetric = displayedTimeSeries[0];

  const userGrowthDelta = useMemo(() => {
    const change = latestMetric.totalUsers - previousMetric.totalUsers;
    const pct = ((change / previousMetric.totalUsers) * 100).toFixed(1);
    return { change, pct: Number(pct) };
  }, [latestMetric, previousMetric]);

  const activityGrowthDelta = useMemo(() => {
    const change = latestMetric.activeSessions - previousMetric.activeSessions;
    const pct = ((change / previousMetric.activeSessions) * 100).toFixed(1);
    return { change, pct: Number(pct) };
  }, [latestMetric, previousMetric]);

  const placementRateDelta = useMemo(() => {
    const diff = (latestMetric.placementRate - previousMetric.placementRate).toFixed(1);
    return { diff: Number(diff) };
  }, [latestMetric, previousMetric]);

  // Sector-wise placement distribution
  const sectorPlacementBreakdown = [
    { name: 'AI & Data Science', placements: 540, share: 34.6, color: '#3B82F6' },
    { name: 'Full-Stack & Cloud', placements: 420, share: 26.9, color: '#10B981' },
    { name: 'Semiconductors & Embedded', placements: 260, share: 16.7, color: '#8B5CF6' },
    { name: 'FinTech & Quant Systems', placements: 190, share: 12.2, color: '#F59E0B' },
    { name: 'Cybersecurity & Networks', placements: 150, share: 9.6, color: '#EC4899' },
  ];

  // Placement Conversion Funnel
  const placementFunnel = [
    { stage: '1. Applications Submitted', count: latestMetric.applications, conversion: '100%', fill: '#3B82F6' },
    { stage: '2. AI Match Validations', count: latestMetric.aiMatches, conversion: '84.7%', fill: '#6366F1' },
    { stage: '3. Recruiter Shortlists', count: 4850, conversion: '39.1%', fill: '#8B5CF6' },
    { stage: '4. Interviews Scheduled', count: latestMetric.interviews, conversion: '18.1%', fill: '#EC4899' },
    { stage: '5. Offers Extended', count: latestMetric.offersExtended, conversion: '13.2%', fill: '#F59E0B' },
    { stage: '6. Verified Placements', count: latestMetric.verifiedPlacements, conversion: '12.6%', fill: '#10B981' },
  ];

  // Filtered rows for the granular audit table
  const filteredAuditRows = useMemo(() => {
    return displayedTimeSeries.filter((item) => {
      const q = searchTableQuery.toLowerCase();
      return (
        item.month.toLowerCase().includes(q) ||
        item.period.toLowerCase().includes(q) ||
        item.placementRate.toString().includes(q)
      );
    });
  }, [displayedTimeSeries, searchTableQuery]);

  // Handler: Refresh data simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('Performance telemetry synchronized from multi-tenant data pipelines.', 'success');
    }, 700);
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Month',
      'Period',
      'Total Users',
      'Students',
      'Faculty',
      'Companies',
      'Institutions',
      'Applications',
      'AI Matches',
      'Interviews',
      'Active Sessions',
      'Verified Placements',
      'Placement Rate (%)',
      'Avg Time to Placement (Days)',
      'Avg Monthly Stipend ($)',
    ];

    const rows = displayedTimeSeries.map((d) => [
      `"${d.month}"`,
      `"${d.period}"`,
      d.totalUsers,
      d.students,
      d.faculty,
      d.companies,
      d.institutions,
      d.applications,
      d.aiMatches,
      d.interviews,
      d.activeSessions,
      d.verifiedPlacements,
      d.placementRate,
      d.avgTimeToPlacementDays,
      d.avgStipend,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillBridge_Performance_Metrics_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Performance Metrics exported as CSV successfully.', 'success');
  };

  // Handler: Export JSON
  const handleExportJSON = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      timeHorizon: timeRange,
      campusTier,
      latestSummary: {
        totalUsers: latestMetric.totalUsers,
        activeMonthlySessions: latestMetric.activeSessions,
        verifiedPlacements: latestMetric.verifiedPlacements,
        overallPlacementRatePct: latestMetric.placementRate,
        avgTimeToPlacementDays: latestMetric.avgTimeToPlacementDays,
        avgMonthlyStipendUSD: latestMetric.avgStipend,
      },
      sectorDistribution: sectorPlacementBreakdown,
      conversionFunnel: placementFunnel,
      timeSeries: displayedTimeSeries,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_Performance_Metrics_${timeRange}.json`;
    a.click();
    showToast('Platform telemetry exported as structured JSON.', 'success');
  };

  return (
    <div className="space-y-8 font-sans pb-10" id="performance-metrics-dashboard">
      {/* 1. Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-500/20">
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Executive Intelligence Suite
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Telemetry Synchronized • {lastUpdated}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Platform Performance Metrics & Conversion Analytics
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-3xl">
            Longitudinal telemetry tracking user onboarding velocity, multi-channel platform engagement, and validated internship placement conversion rates.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh Real-time Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Horizon & Segment Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs text-xs font-semibold">
        {/* Time Horizon Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mr-1 shrink-0">
            Timeframe:
          </span>
          {(['6M', '12M', '3Y', 'ALL'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {range === '6M' ? 'Last 6 Months' : range === '12M' ? 'Last 12 Months' : range === '3Y' ? '3-Year Trend' : 'All-Time'}
            </button>
          ))}
        </div>

        {/* View Focus Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Dimensions' },
              { id: 'growth', label: 'User Growth' },
              { id: 'activity', label: 'Activity' },
              { id: 'placements', label: 'Placements' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-white dark:bg-[#1C1E26] text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Campus Cohort Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={campusTier}
              onChange={(e) => setCampusTier(e.target.value as CampusTier)}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold outline-hidden cursor-pointer"
            >
              <option value="all">All Campuses (100+)</option>
              <option value="tier1">Tier-1 Tech Institutes</option>
              <option value="tier2">Affiliated State Colleges</option>
              <option value="autonomous">Autonomous Universities</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Top Executive KPI Cards (5 Strategic Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: User Growth */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Total Ecosystem Users
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2 tabular-nums">
              {latestMetric.totalUsers.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{userGrowthDelta.pct}%
            </span>
            <span className="text-gray-400 text-[10px]">vs start of period</span>
          </div>
        </div>

        {/* KPI 2: Platform Activity Volume */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Monthly Engagements
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2 tabular-nums">
              {latestMetric.activeSessions.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{activityGrowthDelta.pct}%
            </span>
            <span className="text-gray-400 text-[10px]">Session throughput</span>
          </div>
        </div>

        {/* KPI 3: Placement Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Placement Conversion
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
              {latestMetric.placementRate}%
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{placementRateDelta.diff}%
            </span>
            <span className="text-gray-400 text-[10px]">Target: 85.0%</span>
          </div>
        </div>

        {/* KPI 4: Verified Placements Hires */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Verified Hires
              </span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-2 tabular-nums">
              {latestMetric.verifiedPlacements.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-purple-600 font-bold">
              {latestMetric.offersExtended.toLocaleString()} Offers
            </span>
            <span className="text-gray-400 text-[10px]">95.1% Accepted</span>
          </div>
        </div>

        {/* KPI 5: Time-to-Placement Efficiency */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Avg Time-to-Hire
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2 tabular-nums">
              {latestMetric.avgTimeToPlacementDays} <span className="text-base font-bold text-gray-500">Days</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              -50.2%
            </span>
            <span className="text-gray-400 text-[10px]">vs 28.5d baseline</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. VISUALIZATION 1: USER GROWTH OVER TIME */}
      {/* ========================================================= */}
      {(categoryFilter === 'all' || categoryFilter === 'growth') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Multi-Role User Growth Dynamics Over Time
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Stacked trajectory of onboarded students, active faculty coordinators, corporate recruiters, and university administrators.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-600" />
                Students (4,200)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                Faculty (620)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-600" />
                Industry (280)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500" />
                Colleges (100)
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayedTimeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="growthStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="growthFaculty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="growthCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#14151B' : '#ffffff',
                    borderColor: isDarkMode ? '#333' : '#e5e7eb',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="students"
                  name="Students"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#growthStudents)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="faculty"
                  name="Faculty & Mentors"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#growthFaculty)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="companies"
                  name="Corporate Partners"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#growthCompanies)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="institutions"
                  name="Colleges"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="#F59E0B"
                  fillOpacity={0.1}
                  stackId="1"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Avg Monthly Net New</span>
              <span className="text-base font-extrabold text-blue-600 mt-0.5 block">+203 Users/Mo</span>
              <span className="text-[10px] text-gray-500">Consistent onboarding pace</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Student Retention Rate</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">94.8% Active</span>
              <span className="text-[10px] text-gray-500">30-day cohort active usage</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Corporate Expansion</span>
              <span className="text-base font-extrabold text-purple-600 mt-0.5 block">2.3x YoY Growth</span>
              <span className="text-[10px] text-gray-500">From 120 to 280 recruiters</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Institutional Reach</span>
              <span className="text-base font-extrabold text-amber-600 mt-0.5 block">100 Universities</span>
              <span className="text-[10px] text-gray-500">Across 18 tech clusters</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. VISUALIZATION 2: PLATFORM ACTIVITY OVER TIME */}
      {/* ========================================================= */}
      {(categoryFilter === 'all' || categoryFilter === 'activity') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Composed Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                    Platform Operational Activity & AI Engagement
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Comparison between total student applications, AI matching computation runs, and interview dispatches over time.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-bold shrink-0 self-start sm:self-auto">
                Peak: 12,400 Applications
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayedTimeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#14151B' : '#ffffff',
                      borderColor: isDarkMode ? '#333' : '#e5e7eb',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="applications"
                    name="Applications Filed"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="aiMatches"
                    name="AI Engine Matches"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="interviews"
                    name="Interviews Conducted"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-white/5">
              <span>AI Match-to-Application Efficiency: <strong className="text-gray-900 dark:text-white">84.7%</strong></span>
              <span>Interview Conversion: <strong className="text-gray-900 dark:text-white">18.1%</strong></span>
              <span>Platform Uptime: <strong className="text-emerald-600">99.98% SLA</strong></span>
            </div>
          </div>

          {/* Activity Breakdown / Operational Health */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Engagement Intensity
                </h3>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>

              <div className="space-y-3.5 mt-4 text-xs">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Daily Active Users (DAU)</span>
                    <span className="text-[11px] text-gray-500">2,840 concurrent learners</span>
                  </div>
                  <span className="text-sm font-extrabold text-blue-600">67.6% DAU/MAU</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">AI Resume Optimizations</span>
                    <span className="text-[11px] text-gray-500">Automated ATS scoring runs</span>
                  </div>
                  <span className="text-sm font-extrabold text-indigo-600">8,420 runs</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Direct Recruiter Messages</span>
                    <span className="text-[11px] text-gray-500">Bilateral message threads</span>
                  </div>
                  <span className="text-sm font-extrabold text-purple-600">14,200 msgs</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Skill Assessments Completed</span>
                    <span className="text-[11px] text-gray-500">Proctored faculty tests</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600">6,180 tests</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 block">AI Matching Automation</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Automated matching algorithms reduced recruiter sourcing latency by 72% across 280 corporate partners.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. VISUALIZATION 3: INTERNSHIP PLACEMENT RATES OVER TIME */}
      {/* ========================================================= */}
      {(categoryFilter === 'all' || categoryFilter === 'placements') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Internship Placement Conversion Rate & Hires Over Time
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Cohort placement rate progression reaching 94.2% against the 85.0% national benchmark, with average monthly stipend surges.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-500/20">
                Current Rate: {latestMetric.placementRate}%
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-500/20">
                1,560 Placements
              </span>
            </div>
          </div>

          {/* Primary Placement Rate Line Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayedTimeSeries} margin={{ top: 15, right: 20, left: -5, bottom: 5 }}>
                <defs>
                  <linearGradient id="placementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="rate"
                  domain={[70, 100]}
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Placement %', angle: -90, position: 'insideLeft', fontSize: 10, offset: 12 }}
                />
                <YAxis
                  yAxisId="stipend"
                  orientation="right"
                  unit="$"
                  domain={[800, 2000]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Avg Stipend / Mo', angle: 90, position: 'insideRight', fontSize: 10, offset: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#14151B' : '#ffffff',
                    borderColor: isDarkMode ? '#333' : '#e5e7eb',
                    borderRadius: '16px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <ReferenceLine
                  yAxisId="rate"
                  y={85}
                  label={{ value: 'National Target: 85%', fill: '#EF4444', fontSize: 10, position: 'top' }}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                />
                <Area
                  yAxisId="rate"
                  type="monotone"
                  dataKey="placementRate"
                  name="Internship Placement Rate (%)"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#placementGradient)"
                />
                <Line
                  yAxisId="stipend"
                  type="monotone"
                  dataKey="avgStipend"
                  name="Avg Monthly Stipend ($)"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Bar
                  yAxisId="rate"
                  dataKey="verifiedPlacements"
                  name="Verified Intern Hires"
                  fill="#3B82F6"
                  opacity={0.3}
                  barSize={12}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Secondary Placement Analytics: Funnel & Sector Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Sector Breakdown */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Department & Sector Placement Share
                  </h4>
                  <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                    1,560 Verified Interns Across Key Technology Industries
                  </p>
                </div>
                <PieIcon className="w-4 h-4 text-purple-600" />
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorPlacementBreakdown}
                      dataKey="placements"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={38}
                    >
                      {sectorPlacementBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {sectorPlacementBreakdown.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#14151B]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{s.name}</span>
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white tabular-nums shrink-0">{s.placements}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Conversion Funnel */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    End-to-End Placement Funnel Yield
                  </h4>
                  <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                    Conversion Velocity from Discovery to Final Acceptance
                  </p>
                </div>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="space-y-2 text-xs pt-1">
                {placementFunnel.map((item) => (
                  <div key={item.stage} className="p-2.5 rounded-xl bg-white dark:bg-[#14151B] space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{item.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[11px]">{item.count.toLocaleString()}</span>
                        <span className="font-extrabold text-emerald-600 tabular-nums">{item.conversion}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: item.conversion,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. GRANULAR AUDIT DATA TABLE & EXPORT INTERFACE */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
              Granular Longitudinal Performance Audit Log
            </h3>
            <p className="text-xs text-gray-500">
              Auditable monthly records synchronized with platform telemetry and placement certifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTableQuery}
              onChange={(e) => setSearchTableQuery(e.target.value)}
              placeholder="Search by month or cohort..."
              className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium outline-hidden w-48 sm:w-60"
            />
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Total Users</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Interviews</th>
                <th className="py-3 px-4">Verified Hires</th>
                <th className="py-3 px-4">Placement %</th>
                <th className="py-3 px-4">Avg Time-to-Hire</th>
                <th className="py-3 px-4">Avg Stipend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
              {filteredAuditRows.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {row.month}
                    <span className="text-[10px] text-gray-400 block font-normal">{row.period}</span>
                  </td>
                  <td className="py-3 px-4 tabular-nums font-semibold">{row.totalUsers.toLocaleString()}</td>
                  <td className="py-3 px-4 tabular-nums text-blue-600">{row.students.toLocaleString()}</td>
                  <td className="py-3 px-4 tabular-nums text-indigo-600">{row.applications.toLocaleString()}</td>
                  <td className="py-3 px-4 tabular-nums text-purple-600">{row.interviews.toLocaleString()}</td>
                  <td className="py-3 px-4 tabular-nums font-bold text-emerald-600">
                    {row.verifiedPlacements.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.placementRate >= 90
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : row.placementRate >= 80
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {row.placementRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 tabular-nums text-gray-600 dark:text-gray-400">
                    {row.avgTimeToPlacementDays} days
                  </td>
                  <td className="py-3 px-4 tabular-nums font-semibold text-gray-900 dark:text-white">
                    ${row.avgStipend}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
