import React, { useState, useEffect } from 'react';
import {
  User,
  CheckCircle,
  AlertCircle,
  Save,
  Mail,
  Phone,
  Building,
  Briefcase,
  ShieldCheck,
  Calendar,
  Hash,
  Trash2,
  AlertTriangle,
  X,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

interface AccountSettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
  saveTrigger?: number; // Prop incremented by parent to trigger save
  onSaveComplete?: (success: boolean) => void;
}

export const AccountSettingsTab: React.FC<AccountSettingsTabProps> = ({
  onDirtyChange,
  saveTrigger,
  onSaveComplete,
}) => {
  const { currentUser, setCurrentUser, updateStudentProfile, showToast } = useApp();
  const { user: authUser, logout } = useAuth();

  const activeUser = currentUser || authUser;

  // Form state
  const [formData, setFormData] = useState({
    name: activeUser?.name || '',
    email: activeUser?.email || '',
    phone: (activeUser as any)?.phone || '+1 (555) 234-8901',
    organization: activeUser?.organization || '',
    department: activeUser?.department || '',
  });

  const [initialData, setInitialData] = useState(formData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete Account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleOpenDeleteModal = () => {
    setDeletePassword('');
    setDeleteError(null);
    setShowDeletePassword(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeletePassword('');
    setDeleteError(null);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password to confirm account termination.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await authService.deleteAccount(deletePassword.trim());
      showToast('Your account has been deleted. Logging out...', 'success');
      setIsDeleteModalOpen(false);
      await logout();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account. Please verify your password.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sync if activeUser changes
  useEffect(() => {
    if (activeUser) {
      const data = {
        name: activeUser.name || '',
        email: activeUser.email || '',
        phone: (activeUser as any).phone || '+1 (555) 234-8901',
        organization: activeUser.organization || '',
        department: activeUser.department || '',
      };
      setFormData(data);
      setInitialData(data);
    }
  }, [activeUser?.id]);

  // Dirty check
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Listen for parent save trigger (e.g. from unsaved changes modal)
  useEffect(() => {
    if (saveTrigger && saveTrigger > 0 && isDirty) {
      handleSave();
    }
  }, [saveTrigger]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(null);
    setSaveError(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      setSaveError('Full Name cannot be left blank.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setSaveError('A valid email address is required.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      // 1. Call authService updateAccount
      const response = await authService.updateAccount({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        department: formData.department.trim(),
      });

      // 2. Update React context
      if (response.user) {
        setCurrentUser(response.user);
      } else {
        setCurrentUser({
          ...activeUser,
          ...formData,
        });
      }

      // If student role, also update student profile name & contact
      if (activeUser?.role === 'student') {
        updateStudentProfile({
          name: formData.name.trim(),
          email: formData.email.trim(),
          college: formData.organization.trim(),
          department: formData.department.trim(),
        });
      }

      setInitialData(formData);
      setSaveSuccess('Account information updated and saved successfully.');
      showToast('Account changes saved successfully.', 'success');
      onSaveComplete?.(true);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to update account information. Please try again.';
      setSaveError(errMsg);
      showToast(errMsg, 'error');
      onSaveComplete?.(false);
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabel =
    activeUser?.role === 'student'
      ? 'Student Learner'
      : activeUser?.role === 'faculty'
      ? 'Faculty & Mentor'
      : activeUser?.role === 'company'
      ? 'Industry Partner / Recruiter'
      : activeUser?.role === 'college_admin'
      ? 'College Administration'
      : 'Super Administrator';

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="account-settings-container">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Account Information</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal credentials, contact details, and organization affiliation.
        </p>
      </div>

      {/* Notifications / Alerts */}
      {saveSuccess && (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
          id="account-save-success-alert"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveSuccess}</p>
        </div>
      )}

      {saveError && (
        <div
          className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
          id="account-save-error-alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveError}</p>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={activeUser?.name || 'User Avatar'}
                className="h-16 w-16 rounded-2xl object-cover border border-border shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card">
                <ShieldCheck className="h-3 w-3 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">{formData.name || 'User'}</h3>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {roleLabel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{formData.email}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" /> ID: {activeUser?.id || 'usr_demo'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Member since {activeUser?.createdAt || '2023-08-15'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="account-name" className="text-xs font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="account-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Alex Morgan"
                required
                className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="account-email" className="text-xs font-semibold text-foreground">
              Primary Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="account-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="alex.morgan@university.edu"
                required
                className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="account-phone" className="text-xs font-semibold text-foreground">
              Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="account-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Organization / College */}
          <div className="space-y-1.5">
            <label htmlFor="account-org" className="text-xs font-semibold text-foreground">
              {activeUser?.role === 'company' ? 'Company / Corporation' : 'College / University'}
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="account-org"
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="Institute of Technology & Science"
                className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Department / Division */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="account-dept" className="text-xs font-semibold text-foreground">
              Department / Functional Division
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="account-dept"
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Computer Science & Engineering"
                className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isDirty ? (
              <span className="font-medium text-amber-500">You have unsaved changes in this tab</span>
            ) : (
              <span>All changes saved to your account</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isDirty && (
              <button
                type="button"
                onClick={() => setFormData(initialData)}
                disabled={isSaving}
                className="w-full sm:w-auto rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                id="account-reset-btn"
              >
                Reset
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              id="account-save-btn"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone: Delete Account */}
      <div
        className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5 md:p-6 transition-colors mt-8"
        id="danger-zone-container"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Permanently terminate your SkillBridge AI account, profile credentials, applications, and all associated personal records. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenDeleteModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shrink-0 cursor-pointer shadow-xs"
            id="open-delete-account-modal-btn"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal with Password Re-entry */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          id="delete-account-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) handleCloseDeleteModal();
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-modal-title"
            id="delete-account-modal"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="delete-account-modal-title" className="text-lg font-semibold text-foreground">
                    Delete Account Permanently
                  </h3>
                  <p className="text-xs text-muted-foreground">Confirm account termination</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Close dialog"
                id="close-delete-modal-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Warning Description */}
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs text-destructive leading-relaxed">
              <p className="font-semibold text-sm mb-1">Warning: Irreversible Account Termination</p>
              <p>
                You are about to permanently delete the account for{' '}
                <span className="font-bold underline">{activeUser?.email}</span> ({activeUser?.name}).
                All your submitted job applications, portfolio achievements, mentorship logs, and session tokens will be permanently purged.
              </p>
            </div>

            {/* Error Banner */}
            {deleteError && (
              <div
                className="mt-3 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
                id="delete-account-error-alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{deleteError}</p>
              </div>
            )}

            {/* Password Re-entry Form */}
            <form onSubmit={handleConfirmDelete} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="delete-confirm-password"
                  className="block text-xs font-semibold text-foreground"
                >
                  Enter your current password to confirm:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="delete-confirm-password"
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      setDeleteError(null);
                    }}
                    placeholder="Enter your current password"
                    disabled={isDeleting}
                    autoFocus
                    required
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-destructive focus:outline-hidden focus:ring-2 focus:ring-destructive/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showDeletePassword ? 'Hide password' : 'Show password'}
                  >
                    {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default password for demo accounts is <span className="font-mono font-medium text-foreground">Password@123</span>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                  id="cancel-delete-account-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !deletePassword.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                  id="confirm-delete-account-btn"
                >
                  {isDeleting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Confirm Deletion</span>
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
