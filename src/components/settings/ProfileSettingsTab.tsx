import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  Save,
  Globe,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  MapPin,
  Building,
  Award,
  BookOpen,
  Camera,
  Upload,
  Crop,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { AvatarCropperModal } from './AvatarCropperModal';

interface ProfileSettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
  saveTrigger?: number;
  onSaveComplete?: (success: boolean) => void;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({
  onDirtyChange,
  saveTrigger,
  onSaveComplete,
}) => {
  const {
    currentUser,
    setCurrentUser,
    studentProfile,
    updateStudentProfile,
    collegeInfo,
    updateCollegeInfo,
    currentCompany,
    updateCompanyProfile,
    institutionSettings,
    updateInstitutionSettings,
    showToast,
  } = useApp();
  const { updateUser } = useAuth();

  const role = currentUser?.role || 'student';

  // --- Avatar State & Cropping ---
  const [currentAvatar, setCurrentAvatar] = useState<string>(
    currentUser?.avatar || studentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  );
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [avatarSaveSuccess, setAvatarSaveSuccess] = useState<string | null>(null);
  const [avatarSaveError, setAvatarSaveError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  ];

  const handleAvatarFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!tempAvatar) return;
    setIsSavingAvatar(true);
    setAvatarSaveError(null);
    setAvatarSaveSuccess(null);

    try {
      // 1. Update backend / secure storage
      await authService.updateAccount({ avatar: tempAvatar });

      // 2. Update App Context & Auth Context
      const updatedUser = { ...currentUser, avatar: tempAvatar };
      setCurrentUser(updatedUser);
      updateUser(updatedUser);

      // 3. Update student profile if applicable
      if (role === 'student') {
        updateStudentProfile({ avatar: tempAvatar });
      }

      setCurrentAvatar(tempAvatar);
      setTempAvatar(null);
      setAvatarSaveSuccess('Profile picture updated and saved successfully.');
      showToast('Profile picture saved successfully.', 'success');
    } catch (err: any) {
      const msg = err.message || 'Failed to save profile picture.';
      setAvatarSaveError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  // --- 1. Student Form State ---
  const [studentForm, setStudentForm] = useState({
    title: studentProfile.headline || 'Aspiring Full Stack & Cloud Engineer',
    bio: studentProfile.bio || 'Computer Science undergraduate passionate about distributed systems and cloud architecture.',
    college: studentProfile.college || 'Apex National Institute of Technology',
    department: studentProfile.department || 'Computer Science & Engineering',
    degree: studentProfile.degree || 'Bachelor of Technology (B.Tech)',
    batch: studentProfile.batch || '2022 - 2026',
    cgpa: studentProfile.cgpa ? String(studentProfile.cgpa) : '3.91',
    targetRole: studentProfile.targetRole || 'Full Stack Developer',
    location: studentProfile.location || 'San Francisco, CA / Hybrid',
    github: studentProfile.githubUrl || 'https://github.com/alexmorgan',
    linkedin: studentProfile.linkedinUrl || 'https://linkedin.com/in/alexmorgan',
    portfolio: studentProfile.portfolioUrl || 'https://alexmorgan.dev',
  });

  // --- 2. Faculty Form State ---
  const [facultyForm, setFacultyForm] = useState(() => {
    const saved = localStorage.getItem('edubridge_faculty_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      academicTitle: 'Professor & Head of Industry Collaboration Cell',
      department: currentUser?.department || 'Computer Science & AI',
      institution: currentUser?.organization || 'Apex National Institute of Technology',
      specializations: 'Distributed Systems, Applied Machine Learning, Cloud Architecture',
      officeLocation: 'Academic Complex Block B, Room 402',
      officeHours: 'Tuesdays & Thursdays: 14:00 - 17:00',
      googleScholar: 'https://scholar.google.com/citations?user=alex123',
      bio: 'Over 12 years of research and teaching in scalable distributed systems, high-performance computing, and applied AI.',
    };
  });

  // --- 3. Industry Form State ---
  const [industryForm, setIndustryForm] = useState(() => {
    return {
      companyName: currentCompany?.name || 'NovaCloud Systems',
      industrySector: currentCompany?.industry || 'Enterprise Cloud & AI Infrastructure',
      headquarters: currentCompany?.headquarters || 'San Jose, CA',
      website: currentCompany?.website || 'https://novacloud.example.io',
      companySize: currentCompany?.size || '2,500+ employees',
      recruiterTitle: 'Lead University Talent Partner',
      description: currentCompany?.description || 'Leading next-generation cloud hypervisor and AI developer infrastructure platform.',
    };
  });

  // --- 4. Institution Form State ---
  const [institutionForm, setInstitutionForm] = useState(() => {
    return {
      institutionName: collegeInfo?.name || institutionSettings?.name || 'Apex National Institute of Technology',
      establishedYear: String(collegeInfo?.establishedYear || 1984),
      campusLocation: collegeInfo?.location || institutionSettings?.location || 'Tech Valley Campus, California',
      website: institutionSettings?.website || 'https://anit.edu',
      aisheCode: institutionSettings?.aisheCode || 'C-29384',
      accreditation: institutionSettings?.accreditationTier || 'NAAC A++ / NBA Tier 1 Accredited',
      missionStatement: institutionSettings?.about || 'Empowering engineering excellence, ethical leadership, and high-impact industrial research collaborations.',
    };
  });

  // Initial states for dirty comparison
  const [initialStudentForm, setInitialStudentForm] = useState(studentForm);
  const [initialFacultyForm, setInitialFacultyForm] = useState(facultyForm);
  const [initialIndustryForm, setInitialIndustryForm] = useState(industryForm);
  const [initialInstitutionForm, setInitialInstitutionForm] = useState(institutionForm);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Determine dirty state based on current active role
  const isDirty =
    role === 'student'
      ? JSON.stringify(studentForm) !== JSON.stringify(initialStudentForm)
      : role === 'faculty'
      ? JSON.stringify(facultyForm) !== JSON.stringify(initialFacultyForm)
      : role === 'company'
      ? JSON.stringify(industryForm) !== JSON.stringify(initialIndustryForm)
      : JSON.stringify(institutionForm) !== JSON.stringify(initialInstitutionForm);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Handle parent save trigger
  useEffect(() => {
    if (saveTrigger && saveTrigger > 0 && isDirty) {
      handleSave();
    }
  }, [saveTrigger]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      if (role === 'student') {
        const parsedCgpa = parseFloat(studentForm.cgpa);
        updateStudentProfile({
          headline: studentForm.title.trim(),
          bio: studentForm.bio.trim(),
          college: studentForm.college.trim(),
          department: studentForm.department.trim(),
          degree: studentForm.degree.trim(),
          batch: studentForm.batch.trim(),
          cgpa: isNaN(parsedCgpa) ? studentProfile.cgpa : parsedCgpa,
          targetRole: studentForm.targetRole.trim(),
          location: studentForm.location.trim(),
          githubUrl: studentForm.github.trim(),
          linkedinUrl: studentForm.linkedin.trim(),
          portfolioUrl: studentForm.portfolio.trim(),
        });
        setInitialStudentForm(studentForm);
      } else if (role === 'faculty') {
        localStorage.setItem('edubridge_faculty_profile', JSON.stringify(facultyForm));
        setInitialFacultyForm(facultyForm);
      } else if (role === 'company') {
        if (currentCompany?.id) {
          updateCompanyProfile(currentCompany.id, {
            name: industryForm.companyName.trim(),
            industry: industryForm.industrySector.trim(),
            headquarters: industryForm.headquarters.trim(),
            website: industryForm.website.trim(),
            size: industryForm.companySize.trim(),
            description: industryForm.description.trim(),
          });
        }
        localStorage.setItem('edubridge_industry_profile', JSON.stringify(industryForm));
        setInitialIndustryForm(industryForm);
      } else {
        updateCollegeInfo({
          name: institutionForm.institutionName.trim(),
          location: institutionForm.campusLocation.trim(),
        });
        updateInstitutionSettings({
          name: institutionForm.institutionName.trim(),
          location: institutionForm.campusLocation.trim(),
          website: institutionForm.website.trim(),
          accreditationTier: institutionForm.accreditation.trim(),
          aisheCode: institutionForm.aisheCode.trim(),
          about: institutionForm.missionStatement.trim(),
        });
        setInitialInstitutionForm(institutionForm);
      }

      setSaveSuccess('Profile details updated and saved successfully.');
      showToast('Profile information updated successfully.', 'success');
      onSaveComplete?.(true);
    } catch (err: any) {
      const msg = err.message || 'Failed to save profile changes.';
      setSaveError(msg);
      showToast(msg, 'error');
      onSaveComplete?.(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="profile-settings-container">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Profile Information</h2>
        <p className="text-sm text-muted-foreground">
          Customize your role-specific credentials, academic background, and professional presence.
        </p>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
          id="profile-save-success-alert"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveSuccess}</p>
        </div>
      )}

      {saveError && (
        <div
          className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
          id="profile-save-error-alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{saveError}</p>
        </div>
      )}

      {/* ================= UPDATE PROFILE PICTURE SECTION ================= */}
      <div
        className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5"
        id="profile-picture-section"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Update Profile Picture</h3>
              <p className="text-xs text-muted-foreground">
                Upload a professional photo or avatar. Use our built-in cropping tool to frame your portrait.
              </p>
            </div>
          </div>
          {tempAvatar && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Picture
            </span>
          )}
        </div>

        {avatarSaveSuccess && (
          <div
            className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400"
            id="avatar-save-success-alert"
          >
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{avatarSaveSuccess}</p>
          </div>
        )}

        {avatarSaveError && (
          <div
            className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
            id="avatar-save-error-alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{avatarSaveError}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pt-1">
          {/* Avatar Display Frame with quick crop overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10 shadow-md bg-muted flex items-center justify-center">
              <img
                src={tempAvatar || currentAvatar}
                alt="Profile Avatar"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                id="profile-avatar-preview-img"
              />
            </div>

            {/* Quick Action Overlay on Avatar */}
            <button
              type="button"
              onClick={() => {
                setCropperImageSrc(tempAvatar || currentAvatar);
                setIsCropperOpen(true);
              }}
              className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 cursor-pointer"
              title="Crop and frame this avatar"
            >
              <Crop className="w-5 h-5" />
              <span>Crop</span>
            </button>
          </div>

          {/* Controls and File Uploader */}
          <div className="flex-1 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp, image/gif"
                className="hidden"
                id="avatar-file-upload-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAvatarFileSelect(file);
                    // Reset input so re-selecting same file triggers change
                    e.target.value = '';
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                id="upload-avatar-btn"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Photo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCropperImageSrc(tempAvatar || currentAvatar);
                  setIsCropperOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
                id="open-avatar-cropper-btn"
              >
                <Crop className="w-4 h-4" />
                <span>Crop & Frame</span>
              </button>

              {/* SAVE AVATAR BUTTON - Highlighted when cropped picture is waiting to be saved */}
              {tempAvatar && (
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={isSavingAvatar}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c3e630] text-[#121316] text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  id="save-profile-avatar-btn"
                >
                  {isSavingAvatar ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#121316] border-t-transparent rounded-full animate-spin" />
                      <span>Uploading & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Picture</span>
                    </>
                  )}
                </button>
              )}

              {tempAvatar && (
                <button
                  type="button"
                  onClick={() => setTempAvatar(null)}
                  disabled={isSavingAvatar}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground">
              Accepted formats: JPG, PNG, WEBP. Max file size: 5MB. Photo will be cropped to a high-definition portrait.
            </p>

            {/* Quick Preset Avatars */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Or pick a curated professional preset:
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {presetAvatars.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCropperImageSrc(presetUrl);
                      setIsCropperOpen(true);
                    }}
                    className="w-9 h-9 rounded-xl overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary transition-all ring-1 ring-border/50 hover:scale-105 cursor-pointer"
                    title={`Select preset avatar ${idx + 1}`}
                  >
                    <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Cropper Modal */}
      <AvatarCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropperImageSrc}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={(croppedDataUrl) => {
          setTempAvatar(croppedDataUrl);
          setIsCropperOpen(false);
          showToast('Image cropped. Click "Save Profile Picture" to update your profile.', 'info');
        }}
      />

      {/* Profile Form Based on Role */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ================= STUDENT PROFILE ================= */}
        {role === 'student' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="student-headline" className="text-xs font-semibold text-foreground">
                  Professional Headline / Target Specialty
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="student-headline"
                    type="text"
                    value={studentForm.title}
                    onChange={(e) => setStudentForm({ ...studentForm, title: e.target.value })}
                    placeholder="Aspiring Full Stack & Cloud Engineer"
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="student-bio" className="text-xs font-semibold text-foreground">
                  Bio / Professional Summary
                </label>
                <textarea
                  id="student-bio"
                  rows={3}
                  value={studentForm.bio}
                  onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                  placeholder="Share a brief overview of your technical interests and projects..."
                  className="w-full rounded-xl border border-input bg-background/50 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="student-college" className="text-xs font-semibold text-foreground">
                  College / Institution
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="student-college"
                    type="text"
                    value={studentForm.college}
                    onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="student-dept" className="text-xs font-semibold text-foreground">
                  Department / Branch
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="student-dept"
                    type="text"
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="student-degree" className="text-xs font-semibold text-foreground">
                  Degree Program
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="student-degree"
                    type="text"
                    value={studentForm.degree}
                    onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="student-batch" className="text-xs font-semibold text-foreground">
                  Graduation Batch
                </label>
                <input
                  id="student-batch"
                  type="text"
                  value={studentForm.batch}
                  onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })}
                  placeholder="2023 - 2027"
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="student-cgpa" className="text-xs font-semibold text-foreground">
                  Current CGPA
                </label>
                <input
                  id="student-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={studentForm.cgpa}
                  onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}
                  placeholder="8.85"
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="student-targetrole" className="text-xs font-semibold text-foreground">
                  Target Career Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="student-targetrole"
                    type="text"
                    value={studentForm.targetRole}
                    onChange={(e) => setStudentForm({ ...studentForm, targetRole: e.target.value })}
                    placeholder="Full Stack Developer"
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="student-location" className="text-xs font-semibold text-foreground">
                  Preferred Location / Residence
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="student-location"
                    type="text"
                    value={studentForm.location}
                    onChange={(e) => setStudentForm({ ...studentForm, location: e.target.value })}
                    placeholder="San Francisco, CA or Remote"
                    className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="pt-3 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio & Social Presence</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label htmlFor="student-github" className="text-xs font-medium text-muted-foreground">GitHub Profile</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="student-github"
                      type="url"
                      value={studentForm.github}
                      onChange={(e) => setStudentForm({ ...studentForm, github: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background/50 pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="student-linkedin" className="text-xs font-medium text-muted-foreground">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="student-linkedin"
                      type="url"
                      value={studentForm.linkedin}
                      onChange={(e) => setStudentForm({ ...studentForm, linkedin: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background/50 pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="student-portfolio" className="text-xs font-medium text-muted-foreground">Portfolio Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="student-portfolio"
                      type="url"
                      value={studentForm.portfolio}
                      onChange={(e) => setStudentForm({ ...studentForm, portfolio: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background/50 pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= FACULTY PROFILE ================= */}
        {role === 'faculty' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="faculty-title" className="text-xs font-semibold text-foreground">Academic Designation</label>
                <input
                  id="faculty-title"
                  type="text"
                  value={facultyForm.academicTitle}
                  onChange={(e) => setFacultyForm({ ...facultyForm, academicTitle: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="faculty-dept" className="text-xs font-semibold text-foreground">Department & Lab</label>
                <input
                  id="faculty-dept"
                  type="text"
                  value={facultyForm.department}
                  onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="faculty-specs" className="text-xs font-semibold text-foreground">Research Specializations</label>
                <input
                  id="faculty-specs"
                  type="text"
                  value={facultyForm.specializations}
                  onChange={(e) => setFacultyForm({ ...facultyForm, specializations: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="faculty-office" className="text-xs font-semibold text-foreground">Office Location</label>
                <input
                  id="faculty-office"
                  type="text"
                  value={facultyForm.officeLocation}
                  onChange={(e) => setFacultyForm({ ...facultyForm, officeLocation: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="faculty-hours" className="text-xs font-semibold text-foreground">Office / Mentorship Hours</label>
                <input
                  id="faculty-hours"
                  type="text"
                  value={facultyForm.officeHours}
                  onChange={(e) => setFacultyForm({ ...facultyForm, officeHours: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="faculty-scholar" className="text-xs font-semibold text-foreground">Google Scholar / Research Profile</label>
                <input
                  id="faculty-scholar"
                  type="url"
                  value={facultyForm.googleScholar}
                  onChange={(e) => setFacultyForm({ ...facultyForm, googleScholar: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="faculty-bio" className="text-xs font-semibold text-foreground">Faculty Biography</label>
                <textarea
                  id="faculty-bio"
                  rows={3}
                  value={facultyForm.bio}
                  onChange={(e) => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 p-3.5 text-sm text-foreground focus:border-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= INDUSTRY / COMPANY PROFILE ================= */}
        {role === 'company' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="company-name" className="text-xs font-semibold text-foreground">Organization Name</label>
                <input
                  id="company-name"
                  type="text"
                  value={industryForm.companyName}
                  onChange={(e) => setIndustryForm({ ...industryForm, companyName: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company-sector" className="text-xs font-semibold text-foreground">Industry Sector</label>
                <input
                  id="company-sector"
                  type="text"
                  value={industryForm.industrySector}
                  onChange={(e) => setIndustryForm({ ...industryForm, industrySector: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company-headquarters" className="text-xs font-semibold text-foreground">Global Headquarters</label>
                <input
                  id="company-headquarters"
                  type="text"
                  value={industryForm.headquarters}
                  onChange={(e) => setIndustryForm({ ...industryForm, headquarters: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company-website" className="text-xs font-semibold text-foreground">Corporate Website</label>
                <input
                  id="company-website"
                  type="url"
                  value={industryForm.website}
                  onChange={(e) => setIndustryForm({ ...industryForm, website: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company-size" className="text-xs font-semibold text-foreground">Company Size</label>
                <input
                  id="company-size"
                  type="text"
                  value={industryForm.companySize}
                  onChange={(e) => setIndustryForm({ ...industryForm, companySize: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company-title" className="text-xs font-semibold text-foreground">Recruiter Title</label>
                <input
                  id="company-title"
                  type="text"
                  value={industryForm.recruiterTitle}
                  onChange={(e) => setIndustryForm({ ...industryForm, recruiterTitle: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="company-desc" className="text-xs font-semibold text-foreground">Company Overview & Culture</label>
                <textarea
                  id="company-desc"
                  rows={3}
                  value={industryForm.description}
                  onChange={(e) => setIndustryForm({ ...industryForm, description: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 p-3.5 text-sm text-foreground focus:border-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= INSTITUTION / ADMIN PROFILE ================= */}
        {(role === 'college_admin' || role === 'super_admin') && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="inst-name" className="text-xs font-semibold text-foreground">Institution Name</label>
                <input
                  id="inst-name"
                  type="text"
                  value={institutionForm.institutionName}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, institutionName: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inst-established" className="text-xs font-semibold text-foreground">Established Year</label>
                <input
                  id="inst-established"
                  type="text"
                  value={institutionForm.establishedYear}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, establishedYear: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inst-location" className="text-xs font-semibold text-foreground">Campus Location</label>
                <input
                  id="inst-location"
                  type="text"
                  value={institutionForm.campusLocation}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, campusLocation: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inst-website" className="text-xs font-semibold text-foreground">Official Website</label>
                <input
                  id="inst-website"
                  type="url"
                  value={institutionForm.website}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, website: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inst-aishe" className="text-xs font-semibold text-foreground">AISHE / NIRF Code</label>
                <input
                  id="inst-aishe"
                  type="text"
                  value={institutionForm.aisheCode}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, aisheCode: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inst-accreditation" className="text-xs font-semibold text-foreground">Accreditation Tier</label>
                <input
                  id="inst-accreditation"
                  type="text"
                  value={institutionForm.accreditation}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, accreditation: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="inst-mission" className="text-xs font-semibold text-foreground">Institutional Mission</label>
                <textarea
                  id="inst-mission"
                  rows={3}
                  value={institutionForm.missionStatement}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, missionStatement: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background/50 p-3.5 text-sm text-foreground focus:border-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isDirty ? (
              <span className="font-medium text-amber-500">You have unsaved changes in profile</span>
            ) : (
              <span>Profile is up to date</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  if (role === 'student') setStudentForm(initialStudentForm);
                  else if (role === 'faculty') setFacultyForm(initialFacultyForm);
                  else if (role === 'company') setIndustryForm(initialIndustryForm);
                  else setInstitutionForm(initialInstitutionForm);
                }}
                disabled={isSaving}
                className="w-full sm:w-auto rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                id="profile-reset-btn"
              >
                Reset
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              id="profile-save-btn"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
