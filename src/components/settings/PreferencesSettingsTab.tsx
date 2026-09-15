import React, { useState, useEffect } from 'react';
import {
  Compass,
  Briefcase,
  Building,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Save,
  Plus,
  X,
  MapPin,
  DollarSign,
  Award,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  StudentPreferencesState,
  FacultyPreferencesState,
  IndustryPreferencesState,
  InstitutionPreferencesState,
} from '../../types/settings';

interface PreferencesSettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
  saveTrigger?: number;
  onSaveComplete?: (success: boolean) => void;
}

const DEFAULT_STUDENT_PREFS: StudentPreferencesState = {
  careerInterests: ['Artificial Intelligence / ML', 'Full-Stack Development', 'Cloud Architecture', 'DevOps & CI/CD'],
  preferredRoles: ['Full Stack Developer', 'Cloud Platform Engineer', 'AI Solutions Engineer'],
  preferredIndustries: ['Enterprise SaaS', 'FinTech', 'HealthTech', 'Developer Tools'],
  workMode: 'Hybrid',
  expectedStipend: '$1,500 - $2,500 / month (or ₹25,000 - ₹45,000)',
  openToRelocation: true,
};

const DEFAULT_FACULTY_PREFS: FacultyPreferencesState = {
  mentorshipInterests: ['Distributed Systems', 'Applied Machine Learning', 'Cloud Native Architectures', 'Career Mentorship'],
  researchAreas: ['High Performance Computing', 'Federated Learning', 'Decentralized Data Protocols'],
  collaborationInterests: ['Sponsored R&D Projects', 'Faculty Summer Externships', 'Student Capstone Co-Mentorship'],
  maxMenteeCapacity: 15,
  availableHoursPerWeek: 6,
};

const DEFAULT_INDUSTRY_PREFS: IndustryPreferencesState = {
  targetBatches: ['2025', '2026'],
  minCgpa: 7.5,
  targetDegrees: ['B.Tech / B.E.', 'M.Tech', 'MCA'],
  minAiMatchScore: 80,
  requireSkillVerification: true,
  fastTrackInterviews: true,
};

const DEFAULT_INSTITUTION_PREFS: InstitutionPreferencesState = {
  placementRateGoal: 95,
  minCtcThresholdLpa: 8.5,
  prioritizeTier1Partners: true,
  mandatoryInternshipSemester: '6th Semester (Summer)',
  minMoUValidityYears: 3,
  requirePrePlacementOffers: true,
};

export const PreferencesSettingsTab: React.FC<PreferencesSettingsTabProps> = ({
  onDirtyChange,
  saveTrigger,
  onSaveComplete,
}) => {
  const { currentUser, showToast } = useApp();
  const role = currentUser?.role || 'student';
  const userId = currentUser?.id || 'demo';
  const storageKey = `edubridge_preferences_${role}_${userId}`;

  // Student State
  const [studentPrefs, setStudentPrefs] = useState<StudentPreferencesState>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return { ...DEFAULT_STUDENT_PREFS, ...JSON.parse(saved) }; } catch {}
    }
    return DEFAULT_STUDENT_PREFS;
  });

  // Faculty State
  const [facultyPrefs, setFacultyPrefs] = useState<FacultyPreferencesState>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return { ...DEFAULT_FACULTY_PREFS, ...JSON.parse(saved) }; } catch {}
    }
    return DEFAULT_FACULTY_PREFS;
  });

  // Industry State
  const [industryPrefs, setIndustryPrefs] = useState<IndustryPreferencesState>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return { ...DEFAULT_INDUSTRY_PREFS, ...JSON.parse(saved) }; } catch {}
    }
    return DEFAULT_INDUSTRY_PREFS;
  });

  // Institution State
  const [institutionPrefs, setInstitutionPrefs] = useState<InstitutionPreferencesState>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return { ...DEFAULT_INSTITUTION_PREFS, ...JSON.parse(saved) }; } catch {}
    }
    return DEFAULT_INSTITUTION_PREFS;
  });

  // Initial States for dirty comparison
  const [initialStudent, setInitialStudent] = useState(studentPrefs);
  const [initialFaculty, setInitialFaculty] = useState(facultyPrefs);
  const [initialIndustry, setInitialIndustry] = useState(industryPrefs);
  const [initialInstitution, setInitialInstitution] = useState(institutionPrefs);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // New tag inputs
  const [newCareerInterest, setNewCareerInterest] = useState('');
  const [newRole, setNewRole] = useState('');

  const isDirty =
    role === 'student'
      ? JSON.stringify(studentPrefs) !== JSON.stringify(initialStudent)
      : role === 'faculty'
      ? JSON.stringify(facultyPrefs) !== JSON.stringify(initialFaculty)
      : role === 'company'
      ? JSON.stringify(industryPrefs) !== JSON.stringify(initialIndustry)
      : JSON.stringify(institutionPrefs) !== JSON.stringify(initialInstitution);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (saveTrigger && saveTrigger > 0 && isDirty) {
      handleSave();
    }
  }, [saveTrigger]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const dataToSave =
        role === 'student'
          ? studentPrefs
          : role === 'faculty'
          ? facultyPrefs
          : role === 'company'
          ? industryPrefs
          : institutionPrefs;

      localStorage.setItem(storageKey, JSON.stringify(dataToSave));

      if (role === 'student') setInitialStudent(studentPrefs);
      else if (role === 'faculty') setInitialFaculty(facultyPrefs);
      else if (role === 'company') setInitialIndustry(industryPrefs);
      else setInitialInstitution(institutionPrefs);

      setSaveSuccess('Career and operational preferences saved successfully.');
      showToast('Preferences updated successfully.', 'success');
      onSaveComplete?.(true);
    } catch {
      showToast('Failed to save preferences.', 'error');
      onSaveComplete?.(false);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (type: 'careerInterests' | 'preferredRoles', value: string) => {
    if (!value.trim()) return;
    setStudentPrefs((prev) => ({
      ...prev,
      [type]: prev[type].includes(value.trim()) ? prev[type] : [...prev[type], value.trim()],
    }));
    if (type === 'careerInterests') setNewCareerInterest('');
    if (type === 'preferredRoles') setNewRole('');
    setSaveSuccess(null);
  };

  const removeTag = (type: 'careerInterests' | 'preferredRoles', tag: string) => {
    setStudentPrefs((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t !== tag),
    }));
    setSaveSuccess(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="preferences-settings-container">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Operational & Career Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Configure matchmaking targets, compensation brackets, and collaboration rules tailored to your role.
        </p>
      </div>

      {saveSuccess && (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
          id="preferences-save-success-alert"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveSuccess}</p>
        </div>
      )}

      {/* ================= STUDENT PREFERENCES ================= */}
      {role === 'student' && (
        <div className="space-y-6">
          {/* Career Interests Tag Input */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Career & Technology Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentPrefs.careerInterests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeTag('careerInterests', interest)}
                    className="hover:text-destructive"
                    aria-label={`Remove ${interest}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCareerInterest}
                onChange={(e) => setNewCareerInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('careerInterests', newCareerInterest);
                  }
                }}
                placeholder="Add specialty (e.g. Cybersecurity, Blockchain, Robotics)..."
                className="flex-1 rounded-xl border border-input bg-background/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => addTag('careerInterests', newCareerInterest)}
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Preferred Roles */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Target Job & Internship Roles</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentPrefs.preferredRoles.map((roleTitle) => (
                <span
                  key={roleTitle}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  {roleTitle}
                  <button
                    type="button"
                    onClick={() => removeTag('preferredRoles', roleTitle)}
                    className="hover:text-destructive"
                    aria-label={`Remove ${roleTitle}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('preferredRoles', newRole);
                  }
                }}
                placeholder="Add role (e.g. DevOps Engineer, Site Reliability Engineer)..."
                className="flex-1 rounded-xl border border-input bg-background/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => addTag('preferredRoles', newRole)}
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Internship & Work Preferences */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Internship Working Parameters
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Work Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Preferred Work Mode</label>
                <select
                  value={studentPrefs.workMode}
                  onChange={(e) =>
                    setStudentPrefs((prev) => ({
                      ...prev,
                      workMode: e.target.value as any,
                    }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="Hybrid">Hybrid (Remote + Office)</option>
                  <option value="Remote">100% Remote</option>
                  <option value="On-site">On-site Campus / Headquarters</option>
                  <option value="Flexible">Flexible / Open to All</option>
                </select>
              </div>

              {/* Expected Stipend */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Expected Monthly Stipend</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={studentPrefs.expectedStipend}
                    onChange={(e) =>
                      setStudentPrefs((prev) => ({
                        ...prev,
                        expectedStipend: e.target.value,
                      }))
                    }
                    placeholder="e.g. ₹20,000 - ₹35,000 / month"
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Relocation Willingness */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Willingness to Relocate</p>
                      <p className="text-xs text-muted-foreground">
                        Indicate to out-of-state recruiters whether you are open to corporate relocation.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setStudentPrefs((prev) => ({
                        ...prev,
                        openToRelocation: !prev.openToRelocation,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      studentPrefs.openToRelocation ? 'bg-primary' : 'bg-muted'
                    }`}
                    role="switch"
                    aria-checked={studentPrefs.openToRelocation}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        studentPrefs.openToRelocation ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FACULTY PREFERENCES ================= */}
      {role === 'faculty' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Mentorship & Guidance Capacity</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Maximum Mentee Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={facultyPrefs.maxMenteeCapacity}
                  onChange={(e) =>
                    setFacultyPrefs({ ...facultyPrefs, maxMenteeCapacity: parseInt(e.target.value) || 10 })
                  }
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Weekly Mentorship Hours</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={facultyPrefs.availableHoursPerWeek}
                  onChange={(e) =>
                    setFacultyPrefs({ ...facultyPrefs, availableHoursPerWeek: parseInt(e.target.value) || 4 })
                  }
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= INDUSTRY PREFERENCES ================= */}
      {role === 'company' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Candidate Screening Benchmarks</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Minimum CGPA Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="10"
                  value={industryPrefs.minCgpa}
                  onChange={(e) => setIndustryPrefs({ ...industryPrefs, minCgpa: parseFloat(e.target.value) || 7.0 })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Minimum AI Match Score (%)</label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={industryPrefs.minAiMatchScore}
                  onChange={(e) => setIndustryPrefs({ ...industryPrefs, minAiMatchScore: parseInt(e.target.value) || 80 })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= INSTITUTION PREFERENCES ================= */}
      {(role === 'college_admin' || role === 'super_admin') && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Institutional Placement Goals</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Placement Rate Goal (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={institutionPrefs.placementRateGoal}
                  onChange={(e) =>
                    setInstitutionPrefs({ ...institutionPrefs, placementRateGoal: parseInt(e.target.value) || 90 })
                  }
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Minimum Target CTC Threshold (LPA)</label>
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="50"
                  value={institutionPrefs.minCtcThresholdLpa}
                  onChange={(e) =>
                    setInstitutionPrefs({
                      ...institutionPrefs,
                      minCtcThresholdLpa: parseFloat(e.target.value) || 8.0,
                    })
                  }
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {isDirty ? (
            <span className="font-medium text-amber-500">You have unsaved preference changes</span>
          ) : (
            <span>Preferences up to date</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isDirty && (
            <button
              type="button"
              onClick={() => {
                if (role === 'student') setStudentPrefs(initialStudent);
                else if (role === 'faculty') setFacultyPrefs(initialFaculty);
                else if (role === 'company') setIndustryPrefs(initialIndustry);
                else setInstitutionPrefs(initialInstitution);
              }}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              id="reset-preferences-btn"
            >
              Reset
            </button>
          )}

          <button
            type="submit"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
            id="save-preferences-btn"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
