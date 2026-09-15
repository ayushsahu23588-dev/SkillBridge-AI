import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  LogOut,
  Shield,
  Smartphone,
  Laptop,
  Check,
  X,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';

interface SecuritySettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({ onDirtyChange }) => {
  const { user, logout } = useAuth();
  const { showToast } = useApp();

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);
  const [changeError, setChangeError] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Delete Account State
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Password rule checks
  const rules = {
    minLength: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
    matches: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isFormValid =
    currentPassword.length > 0 &&
    rules.minLength &&
    rules.hasUpper &&
    rules.hasLower &&
    rules.hasNumber &&
    rules.hasSpecial &&
    rules.matches;

  const isDirty = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;

  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!rules.matches) {
        setChangeError('New password and confirmation do not match.');
      } else {
        setChangeError('Please ensure all password complexity requirements are fulfilled.');
      }
      return;
    }

    setIsChangingPassword(true);
    setChangeError(null);
    setChangeSuccess(null);

    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      setChangeSuccess(response.message || 'Password changed successfully!');
      showToast('Password updated successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onDirtyChange?.(false);
    } catch (err: any) {
      const msg = err.message || 'Failed to update password. Please check your current password.';
      setChangeError(msg);
      showToast(msg, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // logout will redirect to /login and clear all sessions
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleConfirmDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError('Please enter your current password to confirm account deletion.');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      const res = await authService.deleteAccount(deletePassword);
      showToast(res.message || 'Your account and personal data have been permanently deleted.', 'success');
      setShowDeleteAccountModal(false);
      await logout();
      window.location.href = '/';
    } catch (err: any) {
      const msg = err.message || 'Failed to delete account. Please verify your current password.';
      setDeleteError(msg);
      showToast(msg, 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="security-settings-container">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Security & Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account credentials, password policies, active devices, and session authorization.
        </p>
      </div>

      {/* Change Password Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Change Account Password</h3>
            <p className="text-xs text-muted-foreground">
              Update your account password. Use at least 8 characters with letters, numbers, and symbols.
            </p>
          </div>
        </div>

        {changeSuccess && (
          <div
            className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
            id="password-success-alert"
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="font-medium">{changeSuccess}</p>
          </div>
        )}

        {changeError && (
          <div
            className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
            id="password-error-alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-medium">{changeError}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="current-password" className="text-xs font-semibold text-foreground">
                Current Password <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">Demo default: Password@123</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                id="toggle-current-pwd-btn"
                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-xs font-semibold text-foreground">
                New Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                  id="toggle-new-pwd-btn"
                  aria-label={showNew ? 'Hide new password' : 'Show new password'}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-xs font-semibold text-foreground">
                Confirm New Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                  id="toggle-confirm-pwd-btn"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Validation Checklist */}
          {newPassword.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2.5 animate-in fade-in duration-150">
              <p className="text-xs font-semibold text-foreground">Password Complexity Requirements:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <span className={`flex items-center gap-1.5 ${rules.minLength ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {rules.minLength ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  At least 8 characters
                </span>
                <span className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {rules.hasUpper ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  One uppercase letter (A-Z)
                </span>
                <span className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {rules.hasLower ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  One lowercase letter (a-z)
                </span>
                <span className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {rules.hasNumber ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  One numeric digit (0-9)
                </span>
                <span className={`flex items-center gap-1.5 ${rules.hasSpecial ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {rules.hasSpecial ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  One special symbol (@$!%*?&#)
                </span>
                <span className={`flex items-center gap-1.5 ${rules.matches ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {rules.matches ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  Passwords match
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword || !isFormValid}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              id="update-password-btn"
            >
              {isChangingPassword ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-muted-foreground">
                Enhance your account security with multi-factor authentication tokens.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !twoFactorEnabled;
              setTwoFactorEnabled(next);
              showToast(next ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.', 'info');
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              twoFactorEnabled ? 'bg-primary' : 'bg-muted'
            }`}
            id="toggle-2fa-btn"
            role="switch"
            aria-checked={twoFactorEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          Status:{' '}
          <strong className={twoFactorEnabled ? 'text-emerald-500' : 'text-muted-foreground'}>
            {twoFactorEnabled ? 'Enabled (Authenticator App configured)' : 'Disabled (Single password sign-in)'}
          </strong>
        </p>
      </div>

      {/* Active Sessions Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Active Sessions & Devices</h3>
            <p className="text-xs text-muted-foreground">
              Devices that are currently signed into your SkillBridge AI account.
            </p>
          </div>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border bg-muted/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Laptop className="h-5 w-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">Current Browser Session</p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                    This Device
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Chrome / Edge on macOS / Windows • IP: 192.168.1.104</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Active now</span>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Mobile App (PWA)</p>
                <p className="text-xs text-muted-foreground">Safari on iOS / Android Mobile • Last active 2 hours ago</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Session terminated.', 'info')}
              className="text-xs font-medium text-destructive hover:underline"
              id="revoke-mobile-session-btn"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>

      {/* ================= LOGOUT SECTION ================= */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-xs space-y-4" id="logout-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-destructive" />
              <h3 className="text-base font-semibold text-destructive">Sign Out of SkillBridge AI</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Terminating your session clears your authentication tokens, resets local credentials, and redirects to the sign-in portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs"
            id="open-logout-modal-btn"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          id="logout-confirmation-modal"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Confirm Sign Out</h3>
                <p className="text-xs text-muted-foreground">Are you sure you want to end your current session?</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">What happens when you sign out:</p>
              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Authentication session is invalidated</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Protected cached state is cleared</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>You will be redirected to the secure login page</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                id="cancel-logout-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs disabled:opacity-50"
                id="confirm-logout-btn"
              >
                {isLoggingOut ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Confirm Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DANGER ZONE: DELETE ACCOUNT SECTION ================= */}
      <div
        className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-xs space-y-4"
        id="security-delete-account-section"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h3 className="text-base font-semibold text-destructive">Delete Account</h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Permanently terminate your SkillBridge AI account and purge all your personal records, credentials, applications, and security sessions from the database. This action is irreversible.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeletePassword('');
              setDeleteError(null);
              setShowDeleteAccountModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive hover:bg-destructive/90 px-5 py-2.5 text-sm font-semibold text-destructive-foreground transition-colors shadow-xs shrink-0 cursor-pointer"
            id="security-delete-account-btn"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Password Confirmation Modal */}
      {showDeleteAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          id="security-delete-account-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingAccount) {
              setShowDeleteAccountModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl space-y-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="security-delete-modal-title"
            id="security-delete-account-modal"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="security-delete-modal-title" className="text-base font-semibold text-destructive">
                  Delete Account Permanently?
                </h3>
                <p className="text-xs text-muted-foreground">
                  This will immediately remove your credentials and data from the database.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs space-y-1.5 text-destructive dark:text-red-300">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Warning: Irreversible Account Deletion
              </p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                <li>All profile records, resume data, and skill assessments will be permanently purged.</li>
                <li>Your job and internship applications will be withdrawn.</li>
                <li>You will immediately be signed out of all devices and active sessions.</li>
              </ul>
            </div>

            {deleteError && (
              <div
                className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
                id="delete-account-error-alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="font-medium">{deleteError}</p>
              </div>
            )}

            <form onSubmit={handleConfirmDeleteAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="security-delete-account-password"
                  className="text-xs font-semibold text-foreground flex items-center justify-between"
                >
                  <span>Enter your current password to confirm:</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    (Demo: Password@123)
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="security-delete-account-password"
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      if (deleteError) setDeleteError(null);
                    }}
                    placeholder="Enter current password"
                    required
                    disabled={isDeletingAccount}
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-destructive focus:ring-1 focus:ring-destructive outline-hidden transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteAccountModal(false);
                    setDeletePassword('');
                    setDeleteError(null);
                  }}
                  disabled={isDeletingAccount}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
                  id="cancel-delete-account-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeletingAccount || !deletePassword.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                  id="confirm-security-delete-account-btn"
                >
                  {isDeletingAccount ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Permanently Delete</span>
                    </>
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
