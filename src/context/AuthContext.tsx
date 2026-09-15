import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  AuthMode,
  RegisterPayload,
  LoginPayload,
  GoogleAuthPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../types';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabaseClient';

const AUTH_USER_KEY = 'edubridge_auth_user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  currentRole: UserRole;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  targetRoleForModal?: UserRole;
  
  // UI Modal Handlers
  openAuthModal: (mode?: AuthMode, role?: UserRole) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthMode) => void;
  
  // Authentication Actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string | undefined>; // Returns OTP if generated
  loginWithGoogle: (payload: GoogleAuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUser: (user: User) => void;
  
  // Account Recovery & Verification
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<string | undefined>; // Returns demo OTP
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;
  resendVerification: (email: string) => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('signin');
  const [targetRoleForModal, setTargetRoleForModal] = useState<UserRole | undefined>(undefined);

  const isAuthenticated = Boolean(user && user.id);
  const currentRole = user ? user.role : 'student';

  const openAuthModal = useCallback((mode: AuthMode = 'signin', role?: UserRole) => {
    setAuthModalMode(mode);
    if (role) {
      setTargetRoleForModal(role);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      if (res.user) {
        setUser(res.user);
        closeAuthModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<string | undefined> => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.user) {
        setUser(res.user);
      }
      return res.verificationOtp;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (payload: GoogleAuthPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithGoogle(payload);
      if (res.user) {
        setUser(res.user);
        closeAuthModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Guard against navigating back to protected routes when logged out / unauthenticated
  useEffect(() => {
    const handlePopStateGuard = () => {
      const publicRoutes = ['/', '', '/login', '/register', '/role-selection'];
      const path = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';

      // If user is not authenticated and attempts to navigate back into a protected route
      if (!user && !publicRoutes.includes(path) && !path.startsWith('/login') && !path.startsWith('/register')) {
        window.history.replaceState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    };

    window.addEventListener('popstate', handlePopStateGuard);
    return () => {
      window.removeEventListener('popstate', handlePopStateGuard);
    };
  }, [user]);

  // Handle bfcache (browser back-forward cache) to prevent viewing cached protected pages post-logout
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !authService.getCurrentUser()) {
        setUser(null);
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', '/login');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const logout = async () => {
    // 1. Trigger UI loading state immediately
    setIsLoading(true);
    setIsLoggingOut(true);

    try {
      // 2. Perform Supabase authentication sign-out
      try {
        await supabase.auth.signOut();
      } catch (sbError) {
        console.warn('Supabase auth.signOut warning:', sbError);
      }

      // 3. Clear backend session if active
      try {
        await authService.logout();
      } catch (apiError) {
        console.warn('Backend logout API warning:', apiError);
      }

      // 4. Clear all user and auth state in React Context
      setUser(null);
      setTargetRoleForModal(undefined);
      closeAuthModal();

      // 5. Clear all local storage and session storage authentication tokens and caches
      try {
        authService.clearSession();
        const authKeys = [
          'edubridge_auth_user',
          'edubridge_auth_token',
          'edubridge_refresh_token',
          'sb-access-token',
          'sb-refresh-token',
          'supabase.auth.token',
        ];
        authKeys.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        // Comprehensive sweep of any Supabase-prefixed tokens
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase.auth'))) {
            localStorage.removeItem(key);
          }
        }
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase.auth'))) {
            sessionStorage.removeItem(key);
          }
        }
      } catch (storageErr) {
        console.warn('Error clearing storage auth keys:', storageErr);
      }

      // 6. Smooth UI transition pause for visual confirmation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 7. Replace history state and redirect to /login (prevents back-navigation to protected routes)
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/login');
        // Push a state on top to neutralize browser back button re-entry
        window.history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
      setIsLoggingOut(false);
    }
  };

  const switchRole = (role: UserRole) => {
    const newUser = authService.switchRole(role);
    setUser(newUser);
  };

  const forgotPassword = async (payload: ForgotPasswordPayload): Promise<string | undefined> => {
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(payload);
      return res.demoOtp;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(payload);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (payload: VerifyEmailPayload) => {
    setIsLoading(true);
    try {
      await authService.verifyEmail(payload);
      if (user && user.email.toLowerCase() === payload.email.toLowerCase()) {
        setUser({ ...user, verified: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string): Promise<string | undefined> => {
    setIsLoading(true);
    try {
      const res = await authService.resendVerification(email);
      return res.demoOtp;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isLoggingOut,
        currentRole,
        isAuthModalOpen,
        authModalMode,
        targetRoleForModal,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        loginWithGoogle,
        logout,
        switchRole,
        updateUser,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
