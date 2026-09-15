/**
 * Centralized Gemini AI Configuration for SkillBridge AI
 * Never hard-codes API keys in client-side source code.
 * Exposes AI mode status, model configuration, and connection health checkers.
 */

export interface AiConfig {
  defaultModel: string;
  fallbackModel: string;
  endpointPrefix: string;
  isDemoModeByDefault: boolean;
}

export const AI_CONFIG: AiConfig = {
  defaultModel: 'gemini-3.1-flash-lite',
  fallbackModel: 'gemini-flash-latest',
  endpointPrefix: '/api/ai',
  isDemoModeByDefault: false,
};

export type AiMode = 'gemini' | 'demo';

export interface AiHealthStatus {
  online: boolean;
  geminiConfigured: boolean;
  mode: AiMode;
  service: string;
  checkedAt: string;
}

let cachedHealth: AiHealthStatus | null = null;
let lastHealthCheck = 0;

/**
 * Checks server health and Gemini API availability.
 * Always resolves gracefully without throwing.
 */
export async function checkAiHealth(forceRefresh = false): Promise<AiHealthStatus> {
  const now = Date.now();
  if (!forceRefresh && cachedHealth && now - lastHealthCheck < 30000) {
    return cachedHealth;
  }

  try {
    const res = await fetch('/api/health', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      const geminiConfigured = Boolean(data.geminiConfigured);
      
      // Check user preferences override
      let userModePreference: AiMode | null = null;
      try {
        const storedPrefs = localStorage.getItem('skillbridge_ai_preferences');
        if (storedPrefs) {
          const parsed = JSON.parse(storedPrefs);
          if (parsed.aiMode) userModePreference = parsed.aiMode;
        }
      } catch {
        // ignore storage error
      }

      const activeMode: AiMode = userModePreference 
        ? userModePreference 
        : (geminiConfigured ? 'gemini' : 'demo');

      cachedHealth = {
        online: true,
        geminiConfigured,
        mode: activeMode,
        service: data.service || 'SkillBridge AI Intelligence Engine',
        checkedAt: new Date().toISOString(),
      };
      lastHealthCheck = now;
      return cachedHealth;
    }
  } catch {
    // Network or server offline -> fallback to local demo mode seamlessly
  }

  cachedHealth = {
    online: false,
    geminiConfigured: false,
    mode: 'demo',
    service: 'SkillBridge Local AI Engine',
    checkedAt: new Date().toISOString(),
  };
  lastHealthCheck = now;
  return cachedHealth;
}

/**
 * Returns whether Gemini AI Mode is currently active and supported.
 */
export function isGeminiConnected(): boolean {
  return cachedHealth?.mode === 'gemini' && cachedHealth?.geminiConfigured === true;
}
