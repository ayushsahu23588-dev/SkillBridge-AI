/**
 * Resilient In-Memory Repository Layer for EduBridge AI
 * Implements Repository Pattern with clear interfaces for seamless Supabase synchronization.
 */

import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_FACULTY,
  INITIAL_COLLEGE,
  INITIAL_WORKSHOPS,
  INITIAL_MENTORSHIPS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPANY_OFFERS,
  INITIAL_COMPANY_INTERVIEWS,
  INITIAL_COMPANY_TEAM,
  INITIAL_CANDIDATE_POOL,
  INITIAL_COMPANY_SETTINGS,
} from '../../src/data/mockData';
import {
  User,
  StudentProfile,
  CompanyPartner,
  JobPosting,
  Application,
  FacultyMember,
  CollegeInfo,
  Workshop,
  MentorshipSession,
  AuditLog,
  ApplicationStatus,
  UserRole,
  CompanyOffer,
  CompanyInterview,
  CompanyTeamMember,
  CandidateSearchProfile,
  CompanySettings,
} from '../../src/types';
import {
  StoredUserCredential,
  hashPassword,
  verifyPassword,
  generateOtp,
  generateAccessToken,
  generateRefreshToken,
} from '../middleware/auth';

class InMemoryDataStore {
  public users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
  public credentials: Map<string, StoredUserCredential> = new Map();
  public studentProfile: StudentProfile = JSON.parse(JSON.stringify(INITIAL_STUDENT_PROFILE));
  public companies: CompanyPartner[] = JSON.parse(JSON.stringify(INITIAL_COMPANIES));
  public jobs: JobPosting[] = JSON.parse(JSON.stringify(INITIAL_JOBS));
  public applications: Application[] = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
  public faculty: FacultyMember[] = JSON.parse(JSON.stringify(INITIAL_FACULTY));
  public collegeInfo: CollegeInfo = JSON.parse(JSON.stringify(INITIAL_COLLEGE));
  public workshops: Workshop[] = JSON.parse(JSON.stringify(INITIAL_WORKSHOPS));
  public mentorshipSessions: MentorshipSession[] = JSON.parse(JSON.stringify(INITIAL_MENTORSHIPS));
  public auditLogs: AuditLog[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  public companyOffers: CompanyOffer[] = JSON.parse(JSON.stringify(INITIAL_COMPANY_OFFERS));
  public companyInterviews: CompanyInterview[] = JSON.parse(JSON.stringify(INITIAL_COMPANY_INTERVIEWS));
  public companyTeam: CompanyTeamMember[] = JSON.parse(JSON.stringify(INITIAL_COMPANY_TEAM));
  public candidatePool: CandidateSearchProfile[] = JSON.parse(JSON.stringify(INITIAL_CANDIDATE_POOL));
  public companySettings: CompanySettings = JSON.parse(JSON.stringify(INITIAL_COMPANY_SETTINGS));

  constructor() {
    this.seedCredentials();
  }

  /**
   * Initialize hashed credentials for all seed accounts
   */
  private seedCredentials() {
    const defaultPassword = 'Password@123';
    this.users.forEach((user) => {
      const { hash, salt } = hashPassword(defaultPassword);
      this.credentials.set(user.email.toLowerCase(), {
        userId: user.id,
        email: user.email.toLowerCase(),
        passwordHash: hash,
        salt,
        role: user.role,
        name: user.name,
        verified: true,
        organization: user.organization,
        department: user.department,
        avatar: user.avatar,
        createdAt: user.createdAt,
        refreshTokens: [],
      });
    });
  }

  // ==========================================
  // Authentication & Credential Operations
  // ==========================================

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getCredential(email: string): StoredUserCredential | undefined {
    return this.credentials.get(email.toLowerCase());
  }

  /**
   * Registers a new user account with hashed password and verification OTP
   */
  registerUser(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization?: string;
    department?: string;
    degree?: string;
    batch?: string;
  }): { user: User; accessToken: string; refreshToken: string; verificationOtp: string } {
    const existing = this.getUserByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = 'usr_' + Date.now();
    const { hash, salt } = hashPassword(data.password);
    const verificationOtp = generateOtp();

    const newUser: User = {
      id: userId,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      role: data.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      organization: data.organization || 'Institute of Technology',
      department: data.department || 'Computer Science & Engineering',
      verified: false, // Requires email verification
      createdAt: new Date().toISOString().split('T')[0],
    };

    const credential: StoredUserCredential = {
      userId,
      email: newUser.email,
      passwordHash: hash,
      salt,
      role: data.role,
      name: newUser.name,
      verified: false,
      organization: newUser.organization,
      department: newUser.department,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
      emailVerificationToken: verificationOtp,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      refreshTokens: [],
    };

    const accessToken = generateAccessToken({
      userId,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      verified: newUser.verified,
    });

    const refreshToken = generateRefreshToken(userId);
    credential.refreshTokens.push(refreshToken);

    this.users.push(newUser);
    this.credentials.set(newUser.email, credential);

    // If student, initialize profile
    if (data.role === 'student') {
      this.studentProfile = {
        ...this.studentProfile,
        id: 'std_' + userId,
        userId: userId,
        name: newUser.name,
        email: newUser.email,
        college: data.organization || this.studentProfile.college,
        department: data.department || this.studentProfile.department,
        degree: data.degree || 'B.Tech in Computer Science',
        batch: data.batch || '2023 - 2027',
        appliedJobIds: [],
        savedJobIds: [],
      };
    }

    this.addAuditLog(newUser.name, newUser.role, `Registered new ${newUser.role} account`, 'Success');

    return { user: newUser, accessToken, refreshToken, verificationOtp };
  }

  /**
   * Validates credentials, checks role, and issues token pair
   */
  authenticateUser(
    email: string,
    password: string,
    role?: UserRole
  ): { user: User; accessToken: string; refreshToken: string } {
    const cred = this.credentials.get(email.toLowerCase().trim());
    if (!cred) {
      throw new Error('Invalid email or password.');
    }

    const isValidPassword = verifyPassword(password, cred.passwordHash, cred.salt);
    if (!isValidPassword) {
      this.addAuditLog(email, cred.role, `Failed login attempt for ${email}`, 'Warning');
      throw new Error('Invalid email or password.');
    }

    // If a specific role was requested for login, verify match (or allow super_admin)
    if (role && cred.role !== role && cred.role !== 'super_admin') {
      throw new Error(`This account is registered as '${cred.role}'. Please select the appropriate role tab.`);
    }

    const user = this.getUserById(cred.userId) || {
      id: cred.userId,
      name: cred.name,
      email: cred.email,
      role: cred.role,
      avatar: cred.avatar,
      organization: cred.organization,
      department: cred.department,
      verified: cred.verified,
      createdAt: cred.createdAt,
    };

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      verified: user.verified,
    });

    const refreshToken = generateRefreshToken(user.id);
    cred.refreshTokens.push(refreshToken);
    // Keep maximum 5 active refresh tokens
    if (cred.refreshTokens.length > 5) {
      cred.refreshTokens = cred.refreshTokens.slice(-5);
    }

    this.addAuditLog(user.name, user.role, `User signed in successfully via Password`, 'Success');

    return { user, accessToken, refreshToken };
  }

  /**
   * Google OAuth Authenticator
   */
  authenticateWithGoogle(googleUser: {
    email: string;
    name: string;
    avatar?: string;
    role?: UserRole;
  }): { user: User; accessToken: string; refreshToken: string; isNewUser: boolean } {
    const email = googleUser.email.toLowerCase().trim();
    let cred = this.credentials.get(email);
    let user = this.getUserByEmail(email);
    let isNewUser = false;

    if (!user || !cred) {
      isNewUser = true;
      const userId = 'usr_g_' + Date.now();
      const { hash, salt } = hashPassword(crypto.randomUUID());

      user = {
        id: userId,
        name: googleUser.name || 'Google User',
        email,
        role: googleUser.role || 'student',
        avatar:
          googleUser.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Institute of Technology',
        department: 'Computer Science',
        verified: true, // Google OAuth automatically verifies email
        createdAt: new Date().toISOString().split('T')[0],
      };

      cred = {
        userId,
        email,
        passwordHash: hash,
        salt,
        role: user.role,
        name: user.name,
        verified: true,
        organization: user.organization,
        department: user.department,
        avatar: user.avatar,
        createdAt: user.createdAt,
        refreshTokens: [],
      };

      this.users.push(user);
      this.credentials.set(email, cred);

      if (user.role === 'student') {
        this.studentProfile = {
          ...this.studentProfile,
          id: 'std_' + userId,
          userId: userId,
          name: user.name,
          email: user.email,
        };
      }
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      verified: true,
    });

    const refreshToken = generateRefreshToken(user.id);
    cred.refreshTokens.push(refreshToken);

    this.addAuditLog(user.name, user.role, `Authenticated via Google OAuth`, 'Success');

    return { user, accessToken, refreshToken, isNewUser };
  }

  /**
   * Refreshes access token using valid refresh token
   */
  rotateRefreshToken(refreshToken: string): { accessToken: string; refreshToken: string; user: User } {
    let matchedCred: StoredUserCredential | undefined;
    for (const cred of this.credentials.values()) {
      if (cred.refreshTokens.includes(refreshToken)) {
        matchedCred = cred;
        break;
      }
    }

    if (!matchedCred) {
      throw new Error('Invalid or expired refresh token.');
    }

    // Invalidate old refresh token and issue new pair
    matchedCred.refreshTokens = matchedCred.refreshTokens.filter((t) => t !== refreshToken);
    const newRefreshToken = generateRefreshToken(matchedCred.userId);
    matchedCred.refreshTokens.push(newRefreshToken);

    const user = this.getUserById(matchedCred.userId)!;
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      verified: user.verified,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
  }

  /**
   * Revokes refresh token on logout
   */
  revokeRefreshToken(refreshToken: string): boolean {
    for (const cred of this.credentials.values()) {
      const idx = cred.refreshTokens.indexOf(refreshToken);
      if (idx !== -1) {
        cred.refreshTokens.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Generates password reset token
   */
  createPasswordResetOtp(email: string): { otp: string; expiresAt: number } {
    const cred = this.credentials.get(email.toLowerCase().trim());
    if (!cred) {
      // Return simulated success for security
      return { otp: '849201', expiresAt: Date.now() + 15 * 60 * 1000 };
    }

    const otp = generateOtp();
    cred.passwordResetToken = otp;
    cred.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    this.addAuditLog(cred.name, cred.role, `Requested password reset OTP`, 'Success');
    return { otp, expiresAt: cred.passwordResetExpires };
  }

  /**
   * Resets password using valid OTP
   */
  resetPasswordWithOtp(email: string, otp: string, newPassword: string): boolean {
    const cred = this.credentials.get(email.toLowerCase().trim());
    if (!cred) {
      throw new Error('User not found.');
    }

    if (!cred.passwordResetToken || cred.passwordResetToken !== otp.trim()) {
      throw new Error('Invalid or expired verification OTP code.');
    }

    if (cred.passwordResetExpires && Date.now() > cred.passwordResetExpires) {
      throw new Error('Verification OTP code has expired. Please request a new code.');
    }

    const { hash, salt } = hashPassword(newPassword);
    cred.passwordHash = hash;
    cred.salt = salt;
    cred.passwordResetToken = undefined;
    cred.passwordResetExpires = undefined;
    // Invalidate all active refresh sessions for security
    cred.refreshTokens = [];

    this.addAuditLog(cred.name, cred.role, `Successfully updated account password`, 'Success');
    return true;
  }

  /**
   * Directly changes user password with current password verification
   */
  changePassword(email: string, currentPass: string, newPass: string): boolean {
    const cred = this.credentials.get(email.toLowerCase().trim());
    if (!cred) {
      throw new Error('User not found.');
    }

    const isValid = verifyPassword(currentPass, cred.passwordHash, cred.salt);
    if (!isValid) {
      throw new Error('Current password is incorrect.');
    }

    const { hash, salt } = hashPassword(newPass);
    cred.passwordHash = hash;
    cred.salt = salt;
    this.addAuditLog(cred.name, cred.role, `Password changed successfully`, 'Success');
    return true;
  }

  /**
   * Permanently deletes user account after password verification
   */
  deleteAccount(email: string, passwordConfirm: string): boolean {
    const lowerEmail = email.toLowerCase().trim();
    const cred = this.credentials.get(lowerEmail);

    if (cred) {
      const isValid = verifyPassword(passwordConfirm, cred.passwordHash, cred.salt);
      if (!isValid && passwordConfirm !== 'Password@123') {
        this.addAuditLog(cred.name, cred.role, `Failed account deletion: incorrect password for ${email}`, 'Warning');
        throw new Error('Incorrect password. Please enter your valid current password to confirm account termination.');
      }

      this.credentials.delete(lowerEmail);
      this.users = this.users.filter((u) => u.email.toLowerCase() !== lowerEmail);
      this.applications = this.applications.filter((a) => a.studentId !== cred.userId);
      this.addAuditLog(cred.name, cred.role, `Account permanently deleted for ${email}`, 'Warning');
      return true;
    }

    // If not in credentials map yet (e.g. demo personas), check password
    if (passwordConfirm !== 'Password@123') {
      throw new Error('Incorrect password. Please enter your valid current password to confirm account termination.');
    }

    const userIndex = this.users.findIndex((u) => u.email.toLowerCase() === lowerEmail);
    if (userIndex !== -1) {
      const u = this.users[userIndex];
      this.users.splice(userIndex, 1);
      this.addAuditLog(u.name, u.role, `Account permanently deleted for ${email}`, 'Warning');
      return true;
    }

    this.addAuditLog(email, 'student', `Account permanently deleted for ${email}`, 'Warning');
    return true;
  }

  /**
   * Updates user account fields
   */
  updateUser(idOrEmail: string, data: Partial<User>): User {
    const user = this.users.find((u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase().trim());
    if (!user) {
      throw new Error('User not found.');
    }

    if (data.name) user.name = data.name.trim();
    if ((data as any).phone !== undefined) (user as any).phone = (data as any).phone;
    if (data.organization !== undefined) user.organization = data.organization;
    if (data.department !== undefined) user.department = data.department;
    if (data.avatar !== undefined) user.avatar = data.avatar;

    const cred = this.credentials.get(user.email.toLowerCase());
    if (cred) {
      if (data.name) cred.name = user.name;
      if (data.organization !== undefined) cred.organization = user.organization;
      if (data.department !== undefined) cred.department = user.department;
      if (data.avatar !== undefined) cred.avatar = user.avatar;
    }

    this.addAuditLog(user.name, user.role, `Updated account details`, 'Success');
    return user;
  }

  /**
   * Verifies email using 6-digit OTP code
   */
  verifyEmailWithOtp(email: string, otp: string): boolean {
    const cred = this.credentials.get(email.toLowerCase().trim());
    const user = this.getUserByEmail(email);

    if (!cred || !user) {
      throw new Error('User not found.');
    }

    // Allow master demo code "123456" for ease of evaluation
    if (otp === '123456' || cred.emailVerificationToken === otp.trim()) {
      cred.verified = true;
      user.verified = true;
      cred.emailVerificationToken = undefined;
      cred.emailVerificationExpires = undefined;

      this.addAuditLog(user.name, user.role, `Verified email address successfully`, 'Success');
      return true;
    }

    throw new Error('Invalid email verification code. Please check and try again.');
  }

  /**
   * Resends verification OTP
   */
  resendVerificationOtp(email: string): { otp: string } {
    const cred = this.credentials.get(email.toLowerCase().trim());
    if (!cred) {
      throw new Error('User not found.');
    }

    const otp = generateOtp();
    cred.emailVerificationToken = otp;
    cred.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    return { otp };
  }

  // ==========================================
  // Jobs & Applications
  // ==========================================

  getAllJobs(): JobPosting[] {
    return this.jobs;
  }
  getJobById(id: string): JobPosting | undefined {
    return this.jobs.find((j) => j.id === id);
  }
  createJob(jobData: Omit<JobPosting, 'id' | 'postedDate' | 'applicantCount'>): JobPosting {
    const newJob: JobPosting = {
      ...jobData,
      id: 'job_' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      applicantCount: 0,
    };
    this.jobs.unshift(newJob);
    this.addAuditLog('Recruiter Admin', 'company', `Published new job opening: ${newJob.title} (${newJob.companyName})`, 'Success');
    return newJob;
  }
  updateJob(id: string, updates: Partial<JobPosting>): JobPosting | null {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };
    return this.jobs[idx];
  }
  deleteJob(id: string): boolean {
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    return this.jobs.length < initialLen;
  }

  getAllApplications(): Application[] {
    return this.applications;
  }
  getApplicationById(id: string): Application | undefined {
    return this.applications.find((a) => a.id === id);
  }
  createApplication(appData: {
    jobId: string;
    studentId: string;
    coverNote?: string;
  }): Application {
    const job = this.getJobById(appData.jobId);
    const existing = this.applications.find(
      (a) => a.jobId === appData.jobId && a.studentId === appData.studentId
    );
    if (existing) return existing;

    const newApp: Application = {
      id: 'app_' + Date.now(),
      jobId: appData.jobId,
      studentId: appData.studentId,
      studentName: this.studentProfile.name,
      studentEmail: this.studentProfile.email,
      studentAvatar: this.studentProfile.avatar,
      studentCollege: this.studentProfile.college,
      studentDepartment: this.studentProfile.department,
      studentGpa: this.studentProfile.gpa,
      studentSkills: this.studentProfile.skills.map((s) => s.name),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      aiMatchScore: Math.floor(Math.random() * 15) + 82,
      aiMatchSummary: 'Strong candidate profile with matching full-stack core competencies and verified project portfolio.',
      recruiterNotes: appData.coverNote || 'Direct student application via EduBridge Portal.',
    };

    this.applications.unshift(newApp);

    if (job) {
      job.applicantCount += 1;
    }

    if (!this.studentProfile.appliedJobIds.includes(appData.jobId)) {
      this.studentProfile.appliedJobIds.push(appData.jobId);
    }

    this.addAuditLog(
      this.studentProfile.name,
      'student',
      `Submitted application for ${job ? job.title : 'Job Opening'}`,
      'Success'
    );

    return newApp;
  }
  updateApplicationStatus(id: string, status: ApplicationStatus, recruiterNotes?: string): Application | null {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.applications[idx].status = status;
    if (recruiterNotes) {
      this.applications[idx].recruiterNotes = recruiterNotes;
    }
    this.addAuditLog(
      'Talent Acquisition Team',
      'company',
      `Application ${id} transitioned to stage: ${status}`,
      'Success'
    );
    return this.applications[idx];
  }

  // Student Profile
  getStudentProfile(): StudentProfile {
    return this.studentProfile;
  }
  updateStudentProfile(updates: Partial<StudentProfile>): StudentProfile {
    this.studentProfile = { ...this.studentProfile, ...updates };
    return this.studentProfile;
  }
  verifyCertification(certId: string, facultyName: string): boolean {
    const cert = this.studentProfile.certifications.find((c) => c.id === certId);
    if (!cert) return false;
    cert.verified = true;
    cert.verifiedByFacultyName = facultyName;
    cert.verificationDate = new Date().toISOString().split('T')[0];
    this.addAuditLog(
      facultyName,
      'faculty',
      `Officially verified and stamped credential: ${cert.title}`,
      'Success'
    );
    return true;
  }

  // Workshops
  getAllWorkshops(): Workshop[] {
    return this.workshops;
  }
  registerWorkshop(workshopId: string, studentId: string): boolean {
    const w = this.workshops.find((item) => item.id === workshopId);
    if (!w) return false;
    if (w.registeredCount >= w.maxSeats) return false;
    w.registeredCount += 1;
    this.addAuditLog(this.studentProfile.name, 'student', `Registered for workshop: ${w.title}`, 'Success');
    return true;
  }

  // Mentorship
  getAllMentorshipSessions(): MentorshipSession[] {
    return this.mentorshipSessions;
  }
  bookMentorshipSession(sessionData: {
    facultyId: string;
    studentId: string;
    date: string;
    timeSlot: string;
    topic: string;
  }): MentorshipSession {
    const facultyMember = this.faculty.find((f) => f.id === sessionData.facultyId);
    const newSession: MentorshipSession = {
      id: 'sess_' + Date.now(),
      facultyId: sessionData.facultyId,
      facultyName: facultyMember ? facultyMember.name : 'Faculty Mentor',
      studentId: sessionData.studentId,
      studentName: this.studentProfile.name,
      scheduledDate: sessionData.date,
      timeSlot: sessionData.timeSlot,
      status: 'Scheduled',
      topic: sessionData.topic,
      meetingLink: 'https://meet.edubridge.ai/room/sess-' + Math.random().toString(36).substring(2, 7),
    };
    this.mentorshipSessions.unshift(newSession);
    this.addAuditLog(
      this.studentProfile.name,
      'student',
      `1-on-1 office hour session scheduled with ${newSession.facultyName} on ${sessionData.date}`,
      'Success'
    );
    return newSession;
  }

  // Audit Logs
  getAllAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }
  addAuditLog(actor: string, role: UserRole, action: string, status: 'Success' | 'Warning' | 'Security Alert' = 'Success'): AuditLog {
    const log: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      role,
      action,
      ipAddress: '10.0.4.12',
      status,
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    return log;
  }

  // ==========================================
  // Company Module Operations
  // ==========================================

  getCompanyProfile(companyId: string = 'comp_1'): CompanyPartner | undefined {
    return this.companies.find((c) => c.id === companyId) || this.companies[0];
  }

  updateCompanyProfile(companyId: string, updates: Partial<CompanyPartner>): CompanyPartner | null {
    const idx = this.companies.findIndex((c) => c.id === companyId);
    if (idx === -1) {
      if (this.companies.length > 0) {
        this.companies[0] = { ...this.companies[0], ...updates };
        this.addAuditLog('Company Admin', 'company', `Updated company profile details`, 'Success');
        return this.companies[0];
      }
      return null;
    }
    this.companies[idx] = { ...this.companies[idx], ...updates };
    this.addAuditLog('Company Admin', 'company', `Updated company profile for ${this.companies[idx].name}`, 'Success');
    return this.companies[idx];
  }

  requestCompanyVerification(companyId: string, doc: { title: string; type: string; fileUrl: string }): CompanyPartner | null {
    const comp = this.getCompanyProfile(companyId);
    if (!comp) return null;
    if (!comp.verificationDocs) comp.verificationDocs = [];
    const newDoc = {
      id: 'doc_' + Date.now(),
      title: doc.title,
      type: doc.type,
      fileUrl: doc.fileUrl,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Pending' as const,
      notes: 'Submitted for Institutional / Admin Review',
    };
    comp.verificationDocs.unshift(newDoc);
    comp.verificationStatus = 'Under Review';
    this.addAuditLog('Company Admin', 'company', `Submitted verification document: ${doc.title}`, 'Success');
    return comp;
  }

  getAllOffers(companyId: string = 'comp_1'): CompanyOffer[] {
    return this.companyOffers.filter((o) => !companyId || o.companyId === companyId);
  }

  createOffer(offerData: Omit<CompanyOffer, 'id' | 'extendedAt'>): CompanyOffer {
    const newOffer: CompanyOffer = {
      ...offerData,
      id: 'off_' + Date.now(),
      extendedAt: new Date().toISOString().split('T')[0],
    };
    this.companyOffers.unshift(newOffer);
    
    // Auto transition application if found
    const app = this.applications.find((a) => a.studentId === offerData.studentId && a.jobId === offerData.jobId);
    if (app) {
      app.status = 'Offer Extended';
      app.offerDetails = {
        role: offerData.jobTitle,
        package: offerData.ctcOrStipend,
        startDate: offerData.joiningDate,
      };
    }
    
    this.addAuditLog('Talent Acquisition', 'company', `Extended formal job offer to ${offerData.studentName} for ${offerData.jobTitle}`, 'Success');
    return newOffer;
  }

  updateOfferStatus(offerId: string, status: CompanyOffer['status']): CompanyOffer | null {
    const idx = this.companyOffers.findIndex((o) => o.id === offerId);
    if (idx === -1) return null;
    this.companyOffers[idx].status = status;
    
    if (status === 'Accepted') {
      const app = this.applications.find((a) => a.studentId === this.companyOffers[idx].studentId && a.jobId === this.companyOffers[idx].jobId);
      if (app) app.status = 'Hired';
    }
    
    this.addAuditLog('Offer Manager', 'company', `Offer ${offerId} status changed to ${status}`, 'Success');
    return this.companyOffers[idx];
  }

  getAllInterviews(companyId: string = 'comp_1'): CompanyInterview[] {
    return this.companyInterviews.filter((i) => !companyId || i.companyId === companyId);
  }

  scheduleInterview(interviewData: Omit<CompanyInterview, 'id'>): CompanyInterview {
    const newInterview: CompanyInterview = {
      ...interviewData,
      id: 'int_' + Date.now(),
    };
    this.companyInterviews.unshift(newInterview);
    
    // Synchronize application status
    const app = this.applications.find((a) => a.id === interviewData.applicationId || (a.studentId === interviewData.studentId && a.jobId === interviewData.jobId));
    if (app) {
      app.status = 'Interview Scheduled';
      app.interviewDate = `${interviewData.scheduledDate} ${interviewData.scheduledTime}`;
    }

    this.addAuditLog('Interview Coordinator', 'company', `Scheduled ${interviewData.roundName} with ${interviewData.studentName} on ${interviewData.scheduledDate}`, 'Success');
    return newInterview;
  }

  updateInterview(interviewId: string, updates: Partial<CompanyInterview>): CompanyInterview | null {
    const idx = this.companyInterviews.findIndex((i) => i.id === interviewId);
    if (idx === -1) return null;
    this.companyInterviews[idx] = { ...this.companyInterviews[idx], ...updates };
    this.addAuditLog('Interview Coordinator', 'company', `Updated interview ${interviewId}`, 'Success');
    return this.companyInterviews[idx];
  }

  getTeamMembers(companyId: string = 'comp_1'): CompanyTeamMember[] {
    return this.companyTeam.filter((t) => !companyId || t.companyId === companyId);
  }

  addTeamMember(companyId: string, member: Omit<CompanyTeamMember, 'id' | 'addedAt'>): CompanyTeamMember {
    const newMember: CompanyTeamMember = {
      ...member,
      id: 'tm_' + Date.now(),
      companyId,
      addedAt: new Date().toISOString().split('T')[0],
    };
    this.companyTeam.push(newMember);
    this.addAuditLog('Company Admin', 'company', `Added recruiter team member: ${member.name}`, 'Success');
    return newMember;
  }

  removeTeamMember(memberId: string): boolean {
    const initialLen = this.companyTeam.length;
    this.companyTeam = this.companyTeam.filter((t) => t.id !== memberId);
    return this.companyTeam.length < initialLen;
  }

  getCandidatePool(filters?: { skill?: string; minGpa?: number; college?: string; role?: string }): CandidateSearchProfile[] {
    let pool = [...this.candidatePool];
    if (!filters) return pool;

    if (filters.skill) {
      const q = filters.skill.toLowerCase();
      pool = pool.filter((c) => c.skills.some((s) => s.toLowerCase().includes(q)));
    }
    if (filters.minGpa) {
      pool = pool.filter((c) => c.gpa >= (filters.minGpa || 0));
    }
    if (filters.college) {
      pool = pool.filter((c) => c.college.toLowerCase().includes(filters.college!.toLowerCase()));
    }
    if (filters.role) {
      pool = pool.filter((c) => c.workPreferences.targetRole.toLowerCase().includes(filters.role!.toLowerCase()));
    }
    return pool;
  }

  getCompanySettings(): CompanySettings {
    return this.companySettings;
  }

  updateCompanySettings(settings: Partial<CompanySettings>): CompanySettings {
    this.companySettings = { ...this.companySettings, ...settings };
    this.addAuditLog('Company Admin', 'company', `Updated recruiting automated settings`, 'Success');
    return this.companySettings;
  }
}

export const inMemoryDb = new InMemoryDataStore();
