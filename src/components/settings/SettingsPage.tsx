import React, { useState, useEffect } from 'react';
import {
  User,
  UserCheck,
  Shield,
  Bell,
  Palette,
  Eye,
  Sliders,
  HelpCircle,
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { SettingsTabType } from '../../types/settings';
import { AccountSettingsTab } from './AccountSettingsTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { SecuritySettingsTab } from './SecuritySettingsTab';
import { NotificationSettingsTab } from './NotificationSettingsTab';
import { AppearanceSettingsTab } from './AppearanceSettingsTab';
import { PrivacySettingsTab } from './PrivacySettingsTab';
import { PreferencesSettingsTab } from './PreferencesSettingsTab';
import { HelpSupportTab } from './HelpSupportTab';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface SettingsPageProps {
  initialTab?: SettingsTabType;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ initialTab = 'account' }) => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>(initialTab);
  const [activeTabDirty, setActiveTabDirty] = useState<boolean>(false);

  // Unsaved changes modal state
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false);
  const [pendingTargetTab, setPendingTargetTab] = useState<SettingsTabType | null>(null);
  const [saveTrigger, setSaveTrigger] = useState<number>(0);
  const [isSavingAndContinuing, setIsSavingAndContinuing] = useState<boolean>(false);

  const { logout } = useAuth();
  const { currentUser } = useApp();

  // Settings menu item definitions
  const menuItems: {
    id: SettingsTabType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'account',
      label: 'Account',
      description: 'Personal info, email, phone & organization',
      icon: <User className="h-4 w-4" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Role-specific bio, academic credentials & links',
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Password update, 2FA & active sessions',
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Alert toggles, internship pings & email digests',
      icon: <Bell className="h-4 w-4" />,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      description: 'Light, dark & system operating display modes',
      icon: <Palette className="h-4 w-4" />,
    },
    {
      id: 'privacy',
      label: 'Privacy',
      description: 'Profile visibility & recruiter discovery permissions',
      icon: <Eye className="h-4 w-4" />,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Matchmaking benchmarks, stipends & work modes',
      icon: <Sliders className="h-4 w-4" />,
    },
    {
      id: 'help',
      label: 'Help & Support',
      description: 'FAQs, ticket inquiries & bug reporter',
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ];

  // Tab switch handler with unsaved guard
  const handleTabClick = (targetTab: SettingsTabType) => {
    if (targetTab === activeTab) return;

    if (activeTabDirty) {
      setPendingTargetTab(targetTab);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(targetTab);
    }
  };

  // Discard changes and proceed
  const handleDiscardAndContinue = () => {
    setActiveTabDirty(false);
    setShowUnsavedModal(false);
    if (pendingTargetTab) {
      setActiveTab(pendingTargetTab);
      setPendingTargetTab(null);
    }
  };

  // Save changes then switch
  const handleSaveAndContinue = () => {
    setIsSavingAndContinuing(true);
    setSaveTrigger((prev) => prev + 1);
  };

  // Callback from child tab when save completes
  const handleSaveComplete = (success: boolean) => {
    setIsSavingAndContinuing(false);
    if (success) {
      setActiveTabDirty(false);
      setShowUnsavedModal(false);
      if (pendingTargetTab) {
        setActiveTab(pendingTargetTab);
        setPendingTargetTab(null);
      }
    }
  };

  return (
    <div className="min-h-full pb-16 pt-2" id="settings-page-wrapper">
      {/* Top Banner / Breadcrumb */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>SkillBridge AI</span>
            <ChevronRight className="h-3 w-3" />
            <span className="capitalize">{currentUser?.role?.replace('_', ' ') || 'User'}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Settings</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Platform & Account Settings
          </h1>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT SIDEBAR NAVIGATION ================= */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <nav
            className="rounded-2xl border border-border bg-card p-3 shadow-xs space-y-1"
            aria-label="Settings navigation menu"
            id="settings-menu-nav"
          >
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Preferences & Configuration
            </div>

            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                  id={`settings-nav-btn-${item.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={isActive ? 'text-primary-foreground' : 'text-primary'}>{item.icon}</span>
                    <span className="text-sm truncate">{item.label}</span>
                  </div>

                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Quick Logout Button in Nav */}
            <div className="pt-3 mt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleTabClick('security')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                id="nav-quick-security-btn"
              >
                <LogOut className="h-4 w-4" />
                <span>Security & Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* ================= RIGHT MAIN CONTENT AREA ================= */}
        <main className="lg:col-span-8 xl:col-span-9 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs min-h-[600px]">
          {activeTab === 'account' && (
            <AccountSettingsTab
              onDirtyChange={setActiveTabDirty}
              saveTrigger={saveTrigger}
              onSaveComplete={handleSaveComplete}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSettingsTab
              onDirtyChange={setActiveTabDirty}
              saveTrigger={saveTrigger}
              onSaveComplete={handleSaveComplete}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettingsTab onDirtyChange={setActiveTabDirty} />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettingsTab
              onDirtyChange={setActiveTabDirty}
              saveTrigger={saveTrigger}
              onSaveComplete={handleSaveComplete}
            />
          )}

          {activeTab === 'appearance' && <AppearanceSettingsTab />}

          {activeTab === 'privacy' && (
            <PrivacySettingsTab
              onDirtyChange={setActiveTabDirty}
              saveTrigger={saveTrigger}
              onSaveComplete={handleSaveComplete}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesSettingsTab
              onDirtyChange={setActiveTabDirty}
              saveTrigger={saveTrigger}
              onSaveComplete={handleSaveComplete}
            />
          )}

          {activeTab === 'help' && <HelpSupportTab />}
        </main>
      </div>

      {/* Unsaved Changes Warning Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onCancel={() => {
          setShowUnsavedModal(false);
          setPendingTargetTab(null);
        }}
        onDiscard={handleDiscardAndContinue}
        onSaveAndContinue={handleSaveAndContinue}
        isSaving={isSavingAndContinuing}
      />
    </div>
  );
};
