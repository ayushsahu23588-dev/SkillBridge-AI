/**
 * AI Cache & Local Storage Management Service
 * Manages caching of AI responses, multi-role chat history, and AI user preferences.
 * Adheres strictly to the key names:
 * - skillbridge_ai_history
 * - skillbridge_ai_cache
 * - skillbridge_ai_preferences
 */

export interface CachedItem<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  userRole: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    path: string;
  };
}

export interface AiPreferences {
  aiAssistanceEnabled: boolean;
  personalizedRecommendations: boolean;
  chatHistoryEnabled: boolean;
  aiMode: 'gemini' | 'demo';
}

const DEFAULT_PREFERENCES: AiPreferences = {
  aiAssistanceEnabled: true,
  personalizedRecommendations: true,
  chatHistoryEnabled: true,
  aiMode: 'gemini',
};

const STORAGE_CACHE_KEY = 'skillbridge_ai_cache';
const STORAGE_HISTORY_KEY = 'skillbridge_ai_history';
const STORAGE_PREFS_KEY = 'skillbridge_ai_preferences';

export const aiCacheService = {
  // -------------------------------------------------------------
  // Response Caching
  // -------------------------------------------------------------
  getCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (!raw) return null;
      const store: Record<string, CachedItem<T>> = JSON.parse(raw);
      const item = store[key];
      if (!item) return null;

      if (Date.now() - item.timestamp > item.ttlMs) {
        // Expired
        delete store[key];
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(store));
        return null;
      }
      return item.data;
    } catch {
      return null;
    }
  },

  setCache<T>(key: string, data: T, ttlMinutes = 60): void {
    try {
      const raw = localStorage.getItem(STORAGE_CACHE_KEY);
      const store: Record<string, CachedItem<T>> = raw ? JSON.parse(raw) : {};
      store[key] = {
        data,
        timestamp: Date.now(),
        ttlMs: ttlMinutes * 60 * 1000,
      };
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(store));
    } catch {
      // Storage quota or parsing error -> silent fail
    }
  },

  invalidateCache(prefix?: string): void {
    try {
      if (!prefix) {
        localStorage.removeItem(STORAGE_CACHE_KEY);
        return;
      }
      const raw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (!raw) return;
      const store: Record<string, any> = JSON.parse(raw);
      Object.keys(store).forEach((k) => {
        if (k.startsWith(prefix)) {
          delete store[k];
        }
      });
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(store));
    } catch {
      // ignore
    }
  },

  // -------------------------------------------------------------
  // AI Chat History
  // -------------------------------------------------------------
  getChatHistory(userRole?: string): AiChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (!raw) return [];
      const list: AiChatMessage[] = JSON.parse(raw);
      if (!userRole) return list;
      return list.filter((m) => m.userRole === userRole);
    } catch {
      return [];
    }
  },

  saveChatMessage(message: Omit<AiChatMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): AiChatMessage {
    const fullMsg: AiChatMessage = {
      id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: message.timestamp || new Date().toISOString(),
      role: message.role,
      content: message.content,
      userRole: message.userRole,
      suggestedAction: message.suggestedAction,
    };

    try {
      const prefs = this.getPreferences();
      if (!prefs.chatHistoryEnabled) return fullMsg;

      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      const list: AiChatMessage[] = raw ? JSON.parse(raw) : [];
      list.push(fullMsg);
      // Keep up to 60 recent messages
      const trimmed = list.slice(-60);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
    return fullMsg;
  },

  clearChatHistory(userRole?: string): void {
    try {
      if (!userRole) {
        localStorage.removeItem(STORAGE_HISTORY_KEY);
        return;
      }
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (!raw) return;
      const list: AiChatMessage[] = JSON.parse(raw);
      const filtered = list.filter((m) => m.userRole !== userRole);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  // -------------------------------------------------------------
  // AI Preferences
  // -------------------------------------------------------------
  getPreferences(): AiPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_PREFS_KEY);
      if (!raw) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  updatePreferences(updates: Partial<AiPreferences>): AiPreferences {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },
};
