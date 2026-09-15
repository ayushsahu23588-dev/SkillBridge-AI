import React from 'react';
import { Sun, Moon, Laptop, Check, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppearanceSettingsTab: React.FC = () => {
  const { themeMode, setThemeMode, isDarkMode } = useApp();

  const themes: {
    id: 'light' | 'dark' | 'system';
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'light',
      title: 'Light Theme',
      description: 'Clean, high-contrast light presentation with crisp slate borders.',
      icon: <Sun className="h-5 w-5" />,
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      description: 'Sophisticated dark slate palette with reduced glare for long work sessions.',
      icon: <Moon className="h-5 w-5" />,
    },
    {
      id: 'system',
      title: 'System Default',
      description: 'Automatically synchronizes with your device operating system appearance.',
      icon: <Laptop className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="appearance-settings-container">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Appearance & Theme</h2>
        <p className="text-sm text-muted-foreground">
          Customize how SkillBridge AI looks on your device. Themes are applied immediately.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          Color Theme Mode
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const isSelected = themeMode === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeMode(theme.id)}
                className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                }`}
                id={`theme-card-${theme.id}`}
              >
                {/* Visual Preview Window Mock */}
                <div
                  className={`w-full h-24 rounded-xl border mb-4 p-2.5 flex flex-col justify-between overflow-hidden ${
                    theme.id === 'light'
                      ? 'bg-white border-slate-200 text-slate-900'
                      : theme.id === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-gradient-to-r from-white to-slate-900 border-slate-400 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <div className="h-2 w-2 rounded-full bg-amber-400" />
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <div
                      className={`h-2.5 w-12 rounded-sm ${
                        theme.id === 'light'
                          ? 'bg-slate-200'
                          : theme.id === 'dark'
                          ? 'bg-slate-700'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`h-2 w-24 rounded-sm ${
                        theme.id === 'light'
                          ? 'bg-blue-600'
                          : theme.id === 'dark'
                          ? 'bg-blue-400'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div
                      className={`h-1.5 w-16 rounded-sm ${
                        theme.id === 'light'
                          ? 'bg-slate-200'
                          : theme.id === 'dark'
                          ? 'bg-slate-700'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {theme.icon}
                    </div>
                    <span className="font-semibold text-sm text-foreground">{theme.title}</span>
                  </div>

                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Active Status Indicator */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Current Active Rendering Mode</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Effective display mode: <strong className="text-primary">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</strong>
              {themeMode === 'system' && ' (Inherited dynamically from Operating System)'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Applied Live
          </span>
        </div>
      </div>
    </div>
  );
};
