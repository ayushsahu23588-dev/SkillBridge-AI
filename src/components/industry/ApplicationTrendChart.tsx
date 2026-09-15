import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Filter,
  Users,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';

export interface DayApplicationData {
  date: string; // e.g. "Aug 06"
  fullDate: string; // e.g. "Aug 06, 2026"
  dayOfWeek: string; // e.g. "Thu"
  applications: number;
  shortlisted: number;
  interviews: number;
  internships: number;
  jobs: number;
  capstones: number;
}

// 30 consecutive days of realistic campus recruitment inflow data
export const LAST_30_DAYS_APPLICATION_DATA: DayApplicationData[] = [
  { date: 'Aug 06', fullDate: 'Aug 06, 2026', dayOfWeek: 'Thu', applications: 12, shortlisted: 3, interviews: 1, internships: 7, jobs: 3, capstones: 2 },
  { date: 'Aug 07', fullDate: 'Aug 07, 2026', dayOfWeek: 'Fri', applications: 15, shortlisted: 4, interviews: 2, internships: 8, jobs: 5, capstones: 2 },
  { date: 'Aug 08', fullDate: 'Aug 08, 2026', dayOfWeek: 'Sat', applications: 9,  shortlisted: 2, interviews: 0, internships: 5, jobs: 3, capstones: 1 },
  { date: 'Aug 09', fullDate: 'Aug 09, 2026', dayOfWeek: 'Sun', applications: 8,  shortlisted: 2, interviews: 1, internships: 5, jobs: 2, capstones: 1 },
  { date: 'Aug 10', fullDate: 'Aug 10, 2026', dayOfWeek: 'Mon', applications: 18, shortlisted: 5, interviews: 2, internships: 10, jobs: 6, capstones: 2 },
  { date: 'Aug 11', fullDate: 'Aug 11, 2026', dayOfWeek: 'Tue', applications: 21, shortlisted: 6, interviews: 3, internships: 12, jobs: 6, capstones: 3 },
  { date: 'Aug 12', fullDate: 'Aug 12, 2026', dayOfWeek: 'Wed', applications: 19, shortlisted: 5, interviews: 2, internships: 11, jobs: 5, capstones: 3 },
  { date: 'Aug 13', fullDate: 'Aug 13, 2026', dayOfWeek: 'Thu', applications: 16, shortlisted: 4, interviews: 2, internships: 9, jobs: 5, capstones: 2 },
  { date: 'Aug 14', fullDate: 'Aug 14, 2026', dayOfWeek: 'Fri', applications: 17, shortlisted: 5, interviews: 2, internships: 10, jobs: 5, capstones: 2 },
  { date: 'Aug 15', fullDate: 'Aug 15, 2026', dayOfWeek: 'Sat', applications: 11, shortlisted: 3, interviews: 1, internships: 6, jobs: 3, capstones: 2 },
  { date: 'Aug 16', fullDate: 'Aug 16, 2026', dayOfWeek: 'Sun', applications: 10, shortlisted: 2, interviews: 1, internships: 6, jobs: 3, capstones: 1 },
  { date: 'Aug 17', fullDate: 'Aug 17, 2026', dayOfWeek: 'Mon', applications: 22, shortlisted: 7, interviews: 3, internships: 13, jobs: 6, capstones: 3 },
  { date: 'Aug 18', fullDate: 'Aug 18, 2026', dayOfWeek: 'Tue', applications: 25, shortlisted: 8, interviews: 4, internships: 14, jobs: 8, capstones: 3 },
  { date: 'Aug 19', fullDate: 'Aug 19, 2026', dayOfWeek: 'Wed', applications: 23, shortlisted: 7, interviews: 3, internships: 13, jobs: 7, capstones: 3 },
  { date: 'Aug 20', fullDate: 'Aug 20, 2026', dayOfWeek: 'Thu', applications: 18, shortlisted: 5, interviews: 3, internships: 10, jobs: 6, capstones: 2 },
  { date: 'Aug 21', fullDate: 'Aug 21, 2026', dayOfWeek: 'Fri', applications: 20, shortlisted: 6, interviews: 3, internships: 11, jobs: 6, capstones: 3 },
  { date: 'Aug 22', fullDate: 'Aug 22, 2026', dayOfWeek: 'Sat', applications: 13, shortlisted: 3, interviews: 1, internships: 7, jobs: 4, capstones: 2 },
  { date: 'Aug 23', fullDate: 'Aug 23, 2026', dayOfWeek: 'Sun', applications: 12, shortlisted: 3, interviews: 1, internships: 7, jobs: 3, capstones: 2 },
  { date: 'Aug 24', fullDate: 'Aug 24, 2026', dayOfWeek: 'Mon', applications: 24, shortlisted: 7, interviews: 4, internships: 14, jobs: 7, capstones: 3 },
  { date: 'Aug 25', fullDate: 'Aug 25, 2026', dayOfWeek: 'Tue', applications: 27, shortlisted: 9, interviews: 5, internships: 15, jobs: 8, capstones: 4 },
  { date: 'Aug 26', fullDate: 'Aug 26, 2026', dayOfWeek: 'Wed', applications: 29, shortlisted: 10, interviews: 5, internships: 17, jobs: 8, capstones: 4 },
  { date: 'Aug 27', fullDate: 'Aug 27, 2026', dayOfWeek: 'Thu', applications: 26, shortlisted: 8, interviews: 4, internships: 15, jobs: 8, capstones: 3 },
  { date: 'Aug 28', fullDate: 'Aug 28, 2026', dayOfWeek: 'Fri', applications: 24, shortlisted: 7, interviews: 4, internships: 13, jobs: 8, capstones: 3 },
  { date: 'Aug 29', fullDate: 'Aug 29, 2026', dayOfWeek: 'Sat', applications: 14, shortlisted: 4, interviews: 2, internships: 8, jobs: 4, capstones: 2 },
  { date: 'Aug 30', fullDate: 'Aug 30, 2026', dayOfWeek: 'Sun', applications: 13, shortlisted: 3, interviews: 1, internships: 8, jobs: 3, capstones: 2 },
  { date: 'Aug 31', fullDate: 'Aug 31, 2026', dayOfWeek: 'Mon', applications: 25, shortlisted: 8, interviews: 4, internships: 14, jobs: 8, capstones: 3 },
  { date: 'Sep 01', fullDate: 'Sep 01, 2026', dayOfWeek: 'Tue', applications: 28, shortlisted: 9, interviews: 5, internships: 16, jobs: 8, capstones: 4 },
  { date: 'Sep 02', fullDate: 'Sep 02, 2026', dayOfWeek: 'Wed', applications: 22, shortlisted: 7, interviews: 4, internships: 12, jobs: 7, capstones: 3 },
  { date: 'Sep 03', fullDate: 'Sep 03, 2026', dayOfWeek: 'Thu', applications: 21, shortlisted: 6, interviews: 3, internships: 12, jobs: 6, capstones: 3 },
  { date: 'Sep 04', fullDate: 'Sep 04, 2026', dayOfWeek: 'Fri', applications: 19, shortlisted: 6, interviews: 3, internships: 11, jobs: 6, capstones: 2 },
];

interface ApplicationTrendChartProps {
  isDarkMode?: boolean;
}

export const ApplicationTrendChart: React.FC<ApplicationTrendChartProps> = ({ isDarkMode = false }) => {
  const [timeframe, setTimeframe] = useState<'7D' | '14D' | '30D'>('30D');
  const [viewMode, setViewMode] = useState<'funnel' | 'byType'>('funnel');
  const [activeLines, setActiveLines] = useState({
    applications: true,
    shortlisted: true,
    interviews: true,
    internships: true,
    jobs: true,
    capstones: true,
  });

  // Filtered trend points according to the selected timeframe
  const displayedData = useMemo(() => {
    if (timeframe === '7D') {
      return LAST_30_DAYS_APPLICATION_DATA.slice(-7);
    }
    if (timeframe === '14D') {
      return LAST_30_DAYS_APPLICATION_DATA.slice(-14);
    }
    return LAST_30_DAYS_APPLICATION_DATA;
  }, [timeframe]);

  // Aggregate metrics calculation for the active window
  const stats = useMemo(() => {
    const totalApps = displayedData.reduce((sum, d) => sum + d.applications, 0);
    const totalShortlisted = displayedData.reduce((sum, d) => sum + d.shortlisted, 0);
    const totalInterviews = displayedData.reduce((sum, d) => sum + d.interviews, 0);
    const avgDaily = (totalApps / displayedData.length).toFixed(1);

    // Peak day calculation
    const peakPoint = displayedData.reduce((max, d) => (d.applications > max.applications ? d : max), displayedData[0]);
    const conversionRate = totalApps > 0 ? ((totalShortlisted / totalApps) * 100).toFixed(1) : '0';

    return {
      totalApps,
      totalShortlisted,
      totalInterviews,
      avgDaily,
      peakDay: `${peakPoint.date} (${peakPoint.applications} apps)`,
      conversionRate: `${conversionRate}%`,
    };
  }, [displayedData]);

  const toggleLine = (key: keyof typeof activeLines) => {
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Custom polished Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as DayApplicationData;
      return (
        <div className="rounded-xl bg-white/95 dark:bg-[#1A1C24]/95 backdrop-blur-md p-3.5 border border-gray-200 dark:border-white/10 shadow-xl text-xs space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-1.5">
            <span className="font-bold text-gray-900 dark:text-white">
              {dataPoint.fullDate} ({dataPoint.dayOfWeek})
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              {dataPoint.applications} Total Influx
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {payload.map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-300 capitalize font-medium">
                    {entry.name}:
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white tabular-nums">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>

          {viewMode === 'funnel' && (
            <div className="pt-1.5 border-t border-gray-100 dark:border-white/10 text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Shortlist Rate:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((dataPoint.shortlisted / dataPoint.applications) * 100)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="chart-incoming-applications-trend"
      className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-6"
    >
      {/* Header with Title, Trend Indicator, and View Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Incoming Student Applications Trend
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <ArrowUpRight className="w-3 h-3" />
                  +24.8% vs last month
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Daily candidate volume, shortlist velocity, and interview conversions across campus requisitions.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode and Timeframe Selectors */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* View Mode Toggle: Funnel vs By Opportunity Type */}
          <div
            id="trend-view-mode-toggle"
            className="p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-1 text-xs"
          >
            <button
              id="btn-view-funnel"
              type="button"
              onClick={() => setViewMode('funnel')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'funnel'
                  ? 'bg-white dark:bg-[#1E2029] text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Recruitment Funnel
            </button>
            <button
              id="btn-view-by-type"
              type="button"
              onClick={() => setViewMode('byType')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'byType'
                  ? 'bg-white dark:bg-[#1E2029] text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              By Opportunity
            </button>
          </div>

          {/* Timeframe Buttons: 7D, 14D, 30D */}
          <div
            id="trend-timeframe-selector"
            className="p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-1 text-xs"
          >
            {(['7D', '14D', '30D'] as const).map((tf) => (
              <button
                key={tf}
                id={`btn-timeframe-${tf.toLowerCase()}`}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tf === '30D' ? 'Last 30 Days' : tf === '14D' ? '14 Days' : '7 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Mini Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Window Influx
          </span>
          <div className="text-xl font-black text-gray-900 dark:text-white mt-1 tabular-nums">
            {stats.totalApps}{' '}
            <span className="text-xs font-medium text-gray-400">apps</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5 block">
            Avg {stats.avgDaily} per day
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Shortlisted Candidates
          </span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {stats.totalShortlisted}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
            {stats.conversionRate} qualification rate
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Interviews Initiated
          </span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {stats.totalInterviews}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 block">
            Round 1 technical & HR
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Peak Application Day
          </span>
          <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1 truncate">
            {stats.peakDay}
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">
            Post campus webinar drive
          </span>
        </div>
      </div>

      {/* Line Toggle Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100 dark:border-white/5 text-xs">
        <div className="flex items-center gap-1.5 text-gray-400 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Toggle Series:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === 'funnel' ? (
            <>
              <button
                type="button"
                onClick={() => toggleLine('applications')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeLines.applications
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Total Applications</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLine('shortlisted')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeLines.shortlisted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Shortlisted</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLine('interviews')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeLines.interviews
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Interviews Scheduled</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => toggleLine('internships')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeLines.internships
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Internships</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLine('jobs')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeLines.jobs
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Full-Time Jobs</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLine('capstones')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeLines.capstones
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Capstone Projects</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Recharts Line Chart Canvas */}
      <div className="w-full h-72 sm:h-80 -ml-2 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayedData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              interval={timeframe === '30D' ? 3 : 0}
            />
            <YAxis
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
              iconType="circle"
            />

            {viewMode === 'funnel' ? (
              <>
                {activeLines.applications && (
                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Incoming Applications"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#8B5CF6', strokeWidth: 1 }}
                    activeDot={{ r: 6, fill: '#7C3AED', stroke: '#DDD6FE', strokeWidth: 2 }}
                  />
                )}
                {activeLines.shortlisted && (
                  <Line
                    type="monotone"
                    dataKey="shortlisted"
                    name="Shortlisted Candidates"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#10B981', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#059669', stroke: '#A7F3D0', strokeWidth: 2 }}
                  />
                )}
                {activeLines.interviews && (
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    name="Interviews Scheduled"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2.5, fill: '#F59E0B', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#D97706', stroke: '#FDE68A', strokeWidth: 2 }}
                  />
                )}
              </>
            ) : (
              <>
                {activeLines.internships && (
                  <Line
                    type="monotone"
                    dataKey="internships"
                    name="Internships"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#3B82F6', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#2563EB', stroke: '#BFDBFE', strokeWidth: 2 }}
                  />
                )}
                {activeLines.jobs && (
                  <Line
                    type="monotone"
                    dataKey="jobs"
                    name="Full-Time Jobs"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#10B981', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#059669', stroke: '#A7F3D0', strokeWidth: 2 }}
                  />
                )}
                {activeLines.capstones && (
                  <Line
                    type="monotone"
                    dataKey="capstones"
                    name="Capstone Projects"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ r: 2, fill: '#6366F1', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#4F46E5', stroke: '#C7D2FE', strokeWidth: 2 }}
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
