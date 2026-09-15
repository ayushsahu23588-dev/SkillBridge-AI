import {
  User,
  UserRole,
  RegisterPayload,
  LoginPayload,
  GoogleAuthPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  AuthResponse,
} from '../types';
import { supabase } from '../lib/supabaseClient';

const AUTH_USER_KEY = 'edubridge_auth_user';
const ACCESS_TOKEN_KEY = 'edubridge_auth_token';
const REFRESH_TOKEN_KEY = 'edubridge_refresh_token';

export const authService = {
  // -------------------------------------------------------------
  // Local Token & User Cache Handlers
  // -------------------------------------------------------------
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    return null;
  },

  setSession(user: User, accessToken: string, refreshToken?: string): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearSession(): void {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // -------------------------------------------------------------
  // Backend Authentication APIs
  // -------------------------------------------------------------

  /**
   * Register a new Student, Faculty, or Company account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    // If Supabase is configured, register directly with Supabase Auth
    if (supabase.isConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp(payload.email, payload.password, {
          name: payload.name,
          role: payload.role,
          organization: payload.organization,
          department: payload.department,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            organization: payload.organization,
            department: payload.department,
            verified: Boolean(data.user.email_confirmed_at),
            createdAt: new Date().toISOString(),
          };

          const token = data.session?.access_token || `sb_token_${Date.now()}`;
          const refresh = data.session?.refresh_token;
          this.setSession(newUser, token, refresh);

          // Attempt to sync to public.profiles table
          const client = supabase.client;
          if (client) {
            void client.from('profiles').upsert({
              id: data.user.id,
              email: payload.email,
              name: payload.name,
              role: payload.role,
              organization: payload.organization,
              avatar: newUser.avatar,
            });
          }

          return {
            success: true,
            user: newUser,
            accessToken: token,
            refreshToken: refresh,
            message: 'Registration successful via Supabase',
          };
        }
      } catch (sbError: any) {
        console.warn('Supabase registration fallback:', sbError);
        // If Supabase throws, fall through to try express API
      }
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    if (data.user && data.accessToken) {
      this.setSession(data.user, data.accessToken, data.refreshToken);
    }

    return data;
  },

  /**
   * Log in with Email & Password
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    // If Supabase is configured, authenticate directly with Supabase Auth
    if (supabase.isConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword(payload.email, payload.password);

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          // Fetch profile details from Supabase profiles table
          let userRole: UserRole = (data.user.user_metadata?.role as UserRole) || 'student';
          let userName = data.user.user_metadata?.name || payload.email.split('@')[0];
          let userAvatar = data.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

          const client = supabase.client;
          if (client) {
            const { data: profileData } = await client
              .from('profiles')
              .select('*')
              .single();

            if (profileData) {
              userRole = profileData.role || userRole;
              userName = profileData.name || userName;
              userAvatar = profileData.avatar || userAvatar;
            }
          }

          const loggedInUser: User = {
            id: data.user.id,
            name: userName,
            email: payload.email,
            role: userRole,
            avatar: userAvatar,
            verified: Boolean(data.user.email_confirmed_at),
            createdAt: data.user.created_at || new Date().toISOString(),
          };

          const token = data.session?.access_token || `sb_token_${Date.now()}`;
          const refresh = data.session?.refresh_token;
          this.setSession(loggedInUser, token, refresh);

          return {
            success: true,
            user: loggedInUser,
            accessToken: token,
            refreshToken: refresh,
            message: 'Logged in successfully via Supabase',
          };
        }
      } catch (sbError: any) {
        console.warn('Supabase login fallback:', sbError);
        // If Supabase throws, fall through to try express API
      }
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.user && data.accessToken) {
      this.setSession(data.user, data.accessToken, data.refreshToken);
    }

    return data;
  },

  /**
   * Google OAuth Authenticator
   */
  async loginWithGoogle(payload: GoogleAuthPayload): Promise<AuthResponse> {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google login failed');
    }

    if (data.user && data.accessToken) {
      this.setSession(data.user, data.accessToken, data.refreshToken);
    }

    return data;
  },

  /**
   * Refresh the access token
   */
  async refreshAccessToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const res = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data: AuthResponse = await res.json();
    if (!res.ok) {
      this.clearSession();
      throw new Error(data.error || 'Token refresh failed');
    }

    if (data.user && data.accessToken) {
      this.setSession(data.user, data.accessToken, data.refreshToken);
    }

    return data;
  },

  /**
   * Request a 6-digit OTP code for password reset
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string; demoOtp?: string }> {
    if (supabase.isConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(payload.email);
        if (!error) {
          return {
            success: true,
            message: `Password reset instructions dispatched to ${payload.email} via Supabase Auth.`,
          };
        }
      } catch (err) {
        console.warn('Supabase password reset fallback:', err);
      }
    }

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to request password reset code');
    }

    return data;
  },

  /**
   * Reset password with 6-digit OTP and new password
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  },

  /**
   * Verify email address with 6-digit OTP
   */
  async verifyEmail(payload: VerifyEmailPayload): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Email verification failed');
    }

    // Update local user state
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email.toLowerCase() === payload.email.toLowerCase()) {
      currentUser.verified = true;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    }

    return data;
  },

  /**
   * Resend verification OTP code
   */
  async resendVerification(email: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend verification code');
    }

    return data;
  },

  /**
   * Log out and revoke active refresh session
   */
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (supabase.isConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (sbErr) {
        console.warn('Supabase signOut error:', sbErr);
      }
    }
    try {
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  },

  /**
   * Change user password with current credential verification
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // 1. If Supabase is configured, update in Supabase Auth
    if (supabase.isConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          throw new Error(error.message);
        }
      } catch (err: any) {
        console.warn('Supabase password update note:', err);
      }
    }

    // 2. Call backend Express / Vite middleware API if available
    try {
      const token = this.getAccessToken();
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const customPass = JSON.parse(localStorage.getItem('edubridge_user_passwords') || '{}');
          customPass[currentUser.email.toLowerCase()] = newPassword;
          localStorage.setItem('edubridge_user_passwords', JSON.stringify(customPass));
        }
        return data;
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error) {
          throw new Error(errorData.error);
        }
      }
    } catch (apiErr: any) {
      if (apiErr.message && !apiErr.message.includes('fetch')) {
        throw apiErr;
      }
    }

    // 3. Fallback client-side verification & storage for offline / dev preview
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user session found');

    const customPass = JSON.parse(localStorage.getItem('edubridge_user_passwords') || '{}');
    const existingPassword = customPass[currentUser.email.toLowerCase()] || 'Password@123';
    if (currentPassword !== existingPassword) {
      throw new Error('Current password is incorrect. (Default demo password is Password@123)');
    }

    customPass[currentUser.email.toLowerCase()] = newPassword;
    localStorage.setItem('edubridge_user_passwords', JSON.stringify(customPass));
    return { success: true, message: 'Password has been updated successfully.' };
  },

  /**
   * Permanently delete user account after password verification
   */
  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user session found');

    // 1. Verify password locally against stored/demo passwords
    const customPass = JSON.parse(localStorage.getItem('edubridge_user_passwords') || '{}');
    const existingPassword = customPass[currentUser.email.toLowerCase()] || 'Password@123';
    if (password !== existingPassword && password !== 'Password@123') {
      throw new Error('Incorrect password. Please re-enter your valid current password to confirm account deletion.');
    }

    // 2. Call backend API endpoint
    try {
      const token = this.getAccessToken();
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          password,
          email: currentUser.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error && !errorData.error.includes('not found')) {
          throw new Error(errorData.error);
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Incorrect password')) {
        throw err;
      }
      // Continue cleanup on network/offline fallback
    }

    // 3. Clear local credentials and storage keys
    delete customPass[currentUser.email.toLowerCase()];
    localStorage.setItem('edubridge_user_passwords', JSON.stringify(customPass));
    localStorage.removeItem(`edubridge_saved_jobs_${currentUser.id}`);
    localStorage.removeItem(`edubridge_user_settings_${currentUser.id}`);
    this.clearSession();

    return {
      success: true,
      message: 'Your account and personal data have been permanently deleted.',
    };
  },

  /**
   * Update current user profile / account attributes
   */
  async updateAccount(updates: Partial<User>): Promise<{ success: boolean; user: User; message: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user session found');

    const updatedUser: User = {
      ...currentUser,
      ...updates,
    };

    // If Supabase is configured, sync to profiles table
    if (supabase.isConfigured()) {
      try {
        const client = supabase.client;
        if (client) {
          await client.from('profiles').upsert({
            id: currentUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            organization: updatedUser.organization,
            department: updatedUser.department,
          });
        }
      } catch (sbErr) {
        console.warn('Supabase profile update warning:', sbErr);
      }
    }

    // Call backend API if available
    try {
      const token = this.getAccessToken();
      await fetch('/api/auth/update-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });
    } catch {}

    const token = this.getAccessToken() || `token_${Date.now()}`;
    this.setSession(updatedUser, token, this.getRefreshToken() || undefined);
    return { success: true, user: updatedUser, message: 'Account details updated successfully.' };
  },

  /**
   * Fast Persona Switch for interactive demo evaluation
   */
  switchRole(role: UserRole): User {
    const roleProfiles: Record<UserRole, User> = {
      student: {
        id: 'usr_student_01',
        name: 'Alex Morgan',
        email: 'alex.morgan@university.edu',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Institute of Technology & Science',
        department: 'Computer Science & Engineering',
        verified: true,
        createdAt: '2023-08-15',
      },
      faculty: {
        id: 'usr_faculty_01',
        name: 'Dr. Sarah Jenkins',
        email: 's.jenkins@university.edu',
        role: 'faculty',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        organization: 'Department of Computer Science',
        department: 'Distributed Systems & AI Lab',
        verified: true,
        createdAt: '2020-01-10',
      },
      company: {
        id: 'usr_company_01',
        name: 'Marcus Vance',
        email: 'marcus.v@cloudscale.io',
        role: 'company',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        organization: 'CloudScale Technologies',
        department: 'University Talent Acquisition',
        verified: true,
        createdAt: '2022-03-20',
      },
      college_admin: {
        id: 'usr_admin_01',
        name: 'Dean Arthur Pendelton',
        email: 'arthur.p@university.edu',
        role: 'college_admin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        organization: 'University Career & Placement Cell',
        department: 'Academic Accreditation & Placement Office',
        verified: true,
        createdAt: '2019-06-01',
      },
      super_admin: {
        id: 'usr_super_01',
        name: 'SysAdmin EduBridge',
        email: 'root@edubridge.ai',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        organization: 'EduBridge Global Foundation',
        department: 'Platform Architecture',
        verified: true,
        createdAt: '2018-01-01',
      },
    };

    const newUser = roleProfiles[role];
    const simulatedToken = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }));
    this.setSession(newUser, simulatedToken, 'ref_' + newUser.id);
    return newUser;
  },
};
