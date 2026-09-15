import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  ExternalLink,
  ChevronDown,
  Server,
  KeyRound,
} from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export type SupabaseConnectionStatus = 'checking' | 'connected' | 'unconfigured' | 'error';

export interface SupabaseStatusIndicatorProps {
  className?: string;
  variant?: 'pill' | 'badge' | 'minimal' | 'card';
  showDropdownOnClick?: boolean;
  onStatusChange?: (status: SupabaseConnectionStatus) => void;
}

export const SupabaseStatusIndicator: React.FC<SupabaseStatusIndicatorProps> = ({
  className = '',
  variant = 'pill',
  showDropdownOnClick = true,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<SupabaseConnectionStatus>('checking');
  const [message, setMessage] = useState<string>('Checking Supabase connection...');
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [projectUrl, setProjectUrl] = useState<string>('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const checkConnection = useCallback(async () => {
    setStatus('checking');
    setMessage('Verifying Supabase connection...');

    const configured = isSupabaseConfigured();
    const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';

    if (envUrl) {
      try {
        const parsed = new URL(envUrl);
        setProjectUrl(parsed.hostname);
      } catch {
        setProjectUrl(envUrl);
      }
    }

    if (!configured) {
      setStatus('unconfigured');
      setMessage('Supabase credentials not configured in environment.');
      setLatency(null);
      setLastChecked(new Date());
      onStatusChange?.('unconfigured');
      return;
    }

    const client = getSupabase();
    if (!client) {
      setStatus('unconfigured');
      setMessage('Supabase client failed to initialize.');
      setLatency(null);
      setLastChecked(new Date());
      onStatusChange?.('unconfigured');
      return;
    }

    const start = performance.now();
    try {
      // Execute health checks against Supabase Auth session & REST API
      const authSessionPromise = client.auth.getSession();
      const dbPingPromise = client.from('opportunities').select('id').limit(1);

      const [authResult, dbResult] = await Promise.allSettled([
        authSessionPromise,
        dbPingPromise,
      ]);

      const roundTripMs = Math.round(performance.now() - start);
      setLatency(roundTripMs);
      setLastChecked(new Date());

      const authSuccess = authResult.status === 'fulfilled' && !authResult.value.error;
      const dbSuccess =
        dbResult.status === 'fulfilled' &&
        (!dbResult.value.error ||
          dbResult.value.error.code === 'PGRST116' ||
          dbResult.value.error.message.includes('permission'));

      if (authSuccess || dbSuccess) {
        setStatus('connected');
        setMessage(`Connected to Supabase successfully (${roundTripMs}ms).`);
        onStatusChange?.('connected');
      } else {
        const errorDetails =
          (authResult.status === 'fulfilled' && authResult.value.error?.message) ||
          (dbResult.status === 'fulfilled' && dbResult.value.error?.message) ||
          'Connection refused or project paused';

        setStatus('error');
        setMessage(`Supabase connection issue: ${errorDetails}`);
        onStatusChange?.('error');
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Network error';
      setStatus('error');
      setMessage(`Unable to reach Supabase: ${errMessage}`);
      setLastChecked(new Date());
      onStatusChange?.('error');
    }
  }, [onStatusChange]);

  useEffect(() => {
    void checkConnection();

    // Re-verify periodically every 60 seconds
    const interval = setInterval(() => {
      void checkConnection();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkConnection]);

  // Click outside handler for dropdown popover
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return {
          dot: 'bg-emerald-500',
          ping: 'bg-emerald-400',
          pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/15',
          text: 'text-emerald-700 dark:text-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
        };
      case 'checking':
        return {
          dot: 'bg-blue-500',
          ping: 'bg-blue-400',
          pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25 hover:bg-blue-500/15',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
        };
      case 'error':
        return {
          dot: 'bg-rose-500',
          ping: 'bg-rose-400',
          pill: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25 hover:bg-rose-500/15',
          text: 'text-rose-700 dark:text-rose-400',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
        };
      case 'unconfigured':
      default:
        return {
          dot: 'bg-amber-500',
          ping: 'bg-amber-400',
          pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25 hover:bg-amber-500/15',
          text: 'text-amber-700 dark:text-amber-400',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
        };
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connected':
        return 'Supabase Connected';
      case 'checking':
        return 'Connecting...';
      case 'error':
        return 'Supabase Offline';
      case 'unconfigured':
        return 'Supabase Unconfigured';
    }
  };

  const colors = getStatusColor();

  // Minimal variant (just icon & pulsing dot)
  if (variant === 'minimal') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          id="supabase-status-minimal-btn"
          type="button"
          onClick={() => showDropdownOnClick && setIsOpen(!isOpen)}
          title={`Supabase: ${getStatusLabel()}`}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer relative"
          aria-label={getStatusLabel()}
        >
          <Database className={`w-4 h-4 ${colors.text}`} />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            {status === 'checking' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.ping}`} />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`} />
          </span>
        </button>

        {isOpen && renderPopover()}
      </div>
    );
  }

  // Badge variant
  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          id="supabase-status-badge-btn"
          type="button"
          onClick={() => showDropdownOnClick && setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colors.badge} transition-all cursor-pointer`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {status === 'checking' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.ping}`} />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${colors.dot}`} />
          </span>
          <span>{getStatusLabel()}</span>
        </button>
        {isOpen && renderPopover()}
      </div>
    );
  }

  // Card variant (for Settings / System Health dashboards)
  if (variant === 'card') {
    return (
      <div
        id="supabase-status-card"
        className={`p-4 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 ${className}`}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                Supabase Backend Engine
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PostgreSQL, Row Level Security & Auth
              </p>
            </div>
          </div>
          <button
            id="supabase-refresh-btn-card"
            type="button"
            onClick={() => void checkConnection()}
            disabled={status === 'checking'}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Re-check connection"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === 'checking' ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {status === 'checking' && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.ping}`} />
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors.dot}`} />
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-200">{getStatusLabel()}</span>
          </div>
          {latency !== null && (
            <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
              {latency}ms latency
            </span>
          )}
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{message}</p>

        {projectUrl && (
          <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">
            Host: <span className="text-gray-800 dark:text-gray-200 font-semibold">{projectUrl}</span>
          </div>
        )}
      </div>
    );
  }

  // Default: Pill variant (fits right into navigation headers)
  return (
    <div ref={popoverRef} className={`relative inline-flex items-center ${className}`}>
      <button
        id="supabase-status-pill-btn"
        type="button"
        onClick={() => showDropdownOnClick && setIsOpen(!isOpen)}
        title={`${getStatusLabel()} - Click for connection details`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs select-none ${colors.pill}`}
      >
        <span className="relative flex h-2 w-2">
          {status === 'checking' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.ping}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`} />
        </span>

        <Database className="w-3.5 h-3.5 opacity-80 shrink-0" />
        <span className="hidden sm:inline font-bold">
          {status === 'connected' ? 'Supabase' : status === 'checking' ? 'Connecting...' : 'Supabase'}
        </span>

        {status === 'connected' && latency !== null && (
          <span className="hidden md:inline text-[10px] font-mono opacity-70">
            {latency}ms
          </span>
        )}

        {status === 'unconfigured' && (
          <span className="hidden md:inline text-[10px] opacity-75 font-normal">
            (Local)
          </span>
        )}

        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && renderPopover()}
    </div>
  );

  function renderPopover() {
    return (
      <div
        id="supabase-status-popover"
        className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Supabase Connection
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Live Client Health Check
              </p>
            </div>
          </div>
          <button
            id="supabase-popover-refresh-btn"
            type="button"
            onClick={() => void checkConnection()}
            disabled={status === 'checking'}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${status === 'checking' ? 'animate-spin text-blue-500' : ''}`} />
            <span>Test</span>
          </button>
        </div>

        {/* Current State Badge */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {status === 'checking' && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.ping}`} />
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors.dot}`} />
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {getStatusLabel()}
              </span>
            </div>
            {status === 'connected' ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            ) : status === 'checking' ? (
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                Pinging...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pending</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Client Diagnostics & Details */}
        <div className="space-y-2 mb-3 text-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              <span>Project Host</span>
            </span>
            <span className="font-mono text-gray-900 dark:text-gray-200 font-medium truncate max-w-[150px]">
              {projectUrl || 'Not configured'}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              {status === 'connected' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span>Round-Trip Latency</span>
            </span>
            <span className="font-mono text-gray-900 dark:text-gray-200 font-medium">
              {latency !== null ? `${latency} ms` : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Auth Service</span>
            </span>
            <span className="text-gray-900 dark:text-gray-200 font-medium">
              {status === 'connected' ? 'Supabase GoTrue (Active)' : 'Local Fallback'}
            </span>
          </div>
        </div>

        {/* Setup hint if unconfigured */}
        {status === 'unconfigured' && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 mb-3 leading-relaxed">
            <p className="font-bold mb-0.5">Configuration Required</p>
            <p className="text-amber-700 dark:text-amber-400">
              Provide <code className="px-1 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50 font-mono text-[10px]">VITE_SUPABASE_URL</code> and <code className="px-1 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50 font-mono text-[10px]">VITE_SUPABASE_ANON_KEY</code> in project environment variables.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 text-[10px] text-gray-500 dark:text-gray-400">
          <span>
            {lastChecked
              ? `Checked ${lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'Not checked yet'}
          </span>
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    );
  }
};
