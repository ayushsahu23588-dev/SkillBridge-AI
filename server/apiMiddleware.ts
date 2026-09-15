import type { IncomingMessage, ServerResponse } from 'http';
import {
  parseResumeWithAI,
  analyzeFullResumeAI,
  optimizeResumeWithAI,
  matchResumeWithJobAI,
  analyzeSkillGapWithAI,
  generateLearningRoadmapWithAI,
  generateInterviewQuestionsWithAI,
  evaluateInterviewAnswerWithAI,
  calculateCandidateMatchAI,
  generateResumeSuggestionsAI,
  chatWithCareerAdvisorAI,
  getGeminiClient,
} from './gemini';
import { getDatabaseStatus } from './db/connection';
import {
  authenticateToken,
  authorizeRole,
  checkRateLimit,
  validateRegistrationPayload,
} from './middleware/auth';
import { inMemoryDb } from './db/inMemoryRepository';

function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (!body) {
          resolve({});
          return;
        }
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

export function createApiMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0] || '';

    if (!url.startsWith('/api/')) {
      return next();
    }

    const clientIp = getClientIp(req);

    try {
      // -------------------------------------------------------------
      // Health & Diagnostic Endpoints
      // -------------------------------------------------------------
      if (req.method === 'GET' && url === '/api/health') {
        const hasKey = Boolean(process.env.GEMINI_API_KEY);
        const dbStatus = getDatabaseStatus();
        return sendJson(res, 200, {
          status: 'online',
          service: 'EduBridge AI API Engine',
          geminiConfigured: hasKey,
          database: dbStatus,
          timestamp: new Date().toISOString(),
        });
      }

      // -------------------------------------------------------------
      // Authentication & Session Endpoints
      // -------------------------------------------------------------
      if (req.method === 'GET' && url === '/api/auth/me') {
        const authHeader = req.headers['authorization'] as string | undefined;
        const user = authenticateToken(authHeader);
        if (!user) {
          return sendJson(res, 401, { error: 'Unauthorized. Invalid or missing session token.' });
        }
        const fullUser = inMemoryDb.getUserById(user.userId) || {
          id: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: user.verified,
          createdAt: '2024-01-01',
        };
        return sendJson(res, 200, { success: true, user: fullUser });
      }

      if (req.method === 'GET' && url === '/api/auth/sessions') {
        const authHeader = req.headers['authorization'] as string | undefined;
        const user = authenticateToken(authHeader);
        if (!user) {
          return sendJson(res, 401, { error: 'Unauthorized' });
        }
        return sendJson(res, 200, {
          success: true,
          sessions: [
            {
              id: 'sess_curr',
              device: 'Chrome on Mac OS (Current Session)',
              ip: clientIp,
              lastActive: 'Just now',
              isCurrent: true,
            },
            {
              id: 'sess_prev',
              device: 'EduBridge Mobile App (Android 14)',
              ip: '10.0.4.12',
              lastActive: '2 days ago',
              isCurrent: false,
            },
          ],
        });
      }

      // -------------------------------------------------------------
      // Database & Resource GET Endpoints
      // -------------------------------------------------------------
      if (req.method === 'GET') {
        if (url === '/api/jobs') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllJobs() });
        }
        if (url.startsWith('/api/jobs/')) {
          const id = url.replace('/api/jobs/', '');
          const job = inMemoryDb.getJobById(id);
          if (!job) return sendJson(res, 404, { error: 'Job not found' });
          return sendJson(res, 200, { success: true, data: job });
        }
        if (url === '/api/applications') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllApplications() });
        }
        if (url === '/api/student/profile') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getStudentProfile() });
        }
        if (url === '/api/workshops') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllWorkshops() });
        }
        if (url === '/api/mentorship') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllMentorshipSessions() });
        }
        if (url === '/api/audit-logs') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllAuditLogs() });
        }

        // Company Module GETs
        if (url === '/api/company/profile') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getCompanyProfile() });
        }
        if (url === '/api/company/offers') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllOffers() });
        }
        if (url === '/api/company/interviews') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getAllInterviews() });
        }
        if (url === '/api/company/team') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getTeamMembers() });
        }
        if (url === '/api/company/candidates') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getCandidatePool() });
        }
        if (url === '/api/company/settings') {
          return sendJson(res, 200, { success: true, data: inMemoryDb.getCompanySettings() });
        }
        if (url === '/api/company/analytics') {
          const apps = inMemoryDb.getAllApplications();
          const offers = inMemoryDb.getAllOffers();
          const interviews = inMemoryDb.getAllInterviews();
          const jobs = inMemoryDb.getAllJobs();

          const totalApplicants = apps.length;
          const screened = apps.filter((a) => a.status !== 'Applied').length;
          const interviewed = apps.filter((a) => a.status === 'Interview Scheduled' || a.status === 'Technical Round' || a.status === 'Offer Extended' || a.status === 'Hired').length;
          const offered = offers.length;
          const hired = apps.filter((a) => a.status === 'Hired').length + offers.filter((o) => o.status === 'Accepted').length;

          const collegeBreakdown = [
            { college: 'Apex National Institute of Tech', applicants: 18, shortlisted: 8, hired: 4 },
            { college: 'Metro State University', applicants: 12, shortlisted: 4, hired: 2 },
            { college: 'Columbia Tech Institute', applicants: 9, shortlisted: 3, hired: 1 },
            { college: 'Stanford Collegiate Alliance', applicants: 7, shortlisted: 5, hired: 2 },
          ];

          return sendJson(res, 200, {
            success: true,
            data: {
              totalJobs: jobs.length,
              totalApplicants,
              screened,
              interviewed,
              offered,
              hired,
              avgMatchScore: 89,
              timeToHireDays: 14,
              acceptanceRate: 88,
              funnel: [
                { stage: 'Applied', count: totalApplicants },
                { stage: 'Screened', count: screened },
                { stage: 'Interviewed', count: interviewed },
                { stage: 'Offers Extended', count: offered },
                { stage: 'Hired', count: hired },
              ],
              collegeBreakdown,
            },
          });
        }
      }

      // -------------------------------------------------------------
      // Resource PUT Endpoints
      // -------------------------------------------------------------
      if (req.method === 'PUT') {
        const body = await getRequestBody(req);

        if (url.startsWith('/api/applications/') && url.endsWith('/status')) {
          const id = url.replace('/api/applications/', '').replace('/status', '');
          const { status, recruiterNotes } = body;
          const updated = inMemoryDb.updateApplicationStatus(id, status, recruiterNotes);
          if (!updated) return sendJson(res, 404, { error: 'Application not found' });
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url === '/api/student/profile') {
          const updated = inMemoryDb.updateStudentProfile(body);
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url.startsWith('/api/certifications/') && url.endsWith('/verify')) {
          const certId = url.replace('/api/certifications/', '').replace('/verify', '');
          const { facultyName = 'Faculty Evaluator' } = body;
          const verified = inMemoryDb.verifyCertification(certId, facultyName);
          return sendJson(res, 200, { success: verified });
        }

        // Company Module PUTs
        if (url === '/api/company/profile') {
          const updated = inMemoryDb.updateCompanyProfile(body.id || 'comp_1', body);
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url.startsWith('/api/company/jobs/')) {
          const id = url.replace('/api/company/jobs/', '');
          const updated = inMemoryDb.updateJob(id, body);
          if (!updated) return sendJson(res, 404, { error: 'Job not found' });
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url.startsWith('/api/company/offers/') && url.endsWith('/status')) {
          const id = url.replace('/api/company/offers/', '').replace('/status', '');
          const updated = inMemoryDb.updateOfferStatus(id, body.status);
          if (!updated) return sendJson(res, 404, { error: 'Offer not found' });
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url.startsWith('/api/company/interviews/')) {
          const id = url.replace('/api/company/interviews/', '');
          const updated = inMemoryDb.updateInterview(id, body);
          if (!updated) return sendJson(res, 404, { error: 'Interview not found' });
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url === '/api/company/settings') {
          const updated = inMemoryDb.updateCompanySettings(body);
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url === '/api/auth/update-account') {
          const authHeader = req.headers['authorization'] as string | undefined;
          const userSession = authenticateToken(authHeader);
          const targetId = userSession?.userId || body.id || body.email;
          if (!targetId) {
            return sendJson(res, 400, { error: 'Target user identifier required' });
          }
          try {
            const updated = inMemoryDb.updateUser(targetId, body);
            return sendJson(res, 200, { success: true, user: updated });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message });
          }
        }
      }

      // -------------------------------------------------------------
      // Resource DELETE Endpoints
      // -------------------------------------------------------------
      if (req.method === 'DELETE') {
        if (url.startsWith('/api/jobs/') || url.startsWith('/api/company/jobs/')) {
          const id = url.replace('/api/company/jobs/', '').replace('/api/jobs/', '');
          const deleted = inMemoryDb.deleteJob(id);
          return sendJson(res, 200, { success: deleted });
        }

        if (url.startsWith('/api/company/team/')) {
          const id = url.replace('/api/company/team/', '');
          const deleted = inMemoryDb.removeTeamMember(id);
          return sendJson(res, 200, { success: deleted });
        }
      }

      // -------------------------------------------------------------
      // Resource & AI POST Endpoints
      // -------------------------------------------------------------
      if (req.method === 'POST') {
        const body = await getRequestBody(req);

        // 1. User Registration (Student, Faculty, Company, Admin)
        if (url === '/api/auth/register') {
          if (!checkRateLimit(clientIp, 10, 60000)) {
            return sendJson(res, 429, { error: 'Too many registration attempts. Please try again in 1 minute.' });
          }

          const validation = validateRegistrationPayload(body);
          if (!validation.valid) {
            return sendJson(res, 400, { error: validation.error });
          }

          try {
            const result = inMemoryDb.registerUser(body);
            return sendJson(res, 201, {
              success: true,
              message: 'Account registered successfully. Verification code generated.',
              user: result.user,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              verificationOtp: result.verificationOtp,
            });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Registration failed' });
          }
        }

        // 2. User Login (Password + Role verification)
        if (url === '/api/auth/login') {
          if (!checkRateLimit(clientIp, 20, 60000)) {
            return sendJson(res, 429, { error: 'Too many login attempts. Please wait 1 minute before retrying.' });
          }

          const { email, password, role } = body;
          if (!email || !password) {
            return sendJson(res, 400, { error: 'Email and password are required.' });
          }

          try {
            const result = inMemoryDb.authenticateUser(email, password, role);
            return sendJson(res, 200, {
              success: true,
              message: `Welcome back, ${result.user.name}!`,
              user: result.user,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            });
          } catch (err: any) {
            return sendJson(res, 401, { error: err.message || 'Authentication failed' });
          }
        }

        // 3. Google OAuth Login
        if (url === '/api/auth/google') {
          const { email, name, avatar, role } = body;
          if (!email || !name) {
            return sendJson(res, 400, { error: 'Google authentication payload missing required fields.' });
          }

          try {
            const result = inMemoryDb.authenticateWithGoogle({ email, name, avatar, role });
            return sendJson(res, 200, {
              success: true,
              message: result.isNewUser ? 'Welcome to EduBridge AI!' : 'Signed in via Google successfully',
              user: result.user,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              isNewUser: result.isNewUser,
            });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Google sign-in failed' });
          }
        }

        // 4. Refresh Token Exchange
        if (url === '/api/auth/refresh-token') {
          const { refreshToken } = body;
          if (!refreshToken) {
            return sendJson(res, 400, { error: 'Refresh token is required.' });
          }

          try {
            const result = inMemoryDb.rotateRefreshToken(refreshToken);
            return sendJson(res, 200, {
              success: true,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              user: result.user,
            });
          } catch (err: any) {
            return sendJson(res, 401, { error: err.message || 'Invalid refresh token' });
          }
        }

        // 5. Forgot Password Request
        if (url === '/api/auth/forgot-password') {
          const { email } = body;
          if (!email) {
            return sendJson(res, 400, { error: 'Email address is required.' });
          }

          const result = inMemoryDb.createPasswordResetOtp(email);
          return sendJson(res, 200, {
            success: true,
            message: `A 6-digit password reset OTP has been sent to ${email}`,
            demoOtp: result.otp, // Displayed in preview for instant testing
            expiresInSeconds: 900,
          });
        }

        // 6. Reset Password with OTP
        if (url === '/api/auth/reset-password') {
          const { email, otp, newPassword } = body;
          if (!email || !otp || !newPassword) {
            return sendJson(res, 400, { error: 'Email, OTP, and new password are required.' });
          }

          if (newPassword.length < 6) {
            return sendJson(res, 400, { error: 'New password must be at least 6 characters long.' });
          }

          try {
            inMemoryDb.resetPasswordWithOtp(email, otp, newPassword);
            return sendJson(res, 200, {
              success: true,
              message: 'Your password has been successfully reset. You can now sign in with your new credentials.',
            });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Password reset failed' });
          }
        }

        // 7. Verify Email with OTP
        if (url === '/api/auth/verify-email') {
          const { email, otp } = body;
          if (!email || !otp) {
            return sendJson(res, 400, { error: 'Email and 6-digit OTP code are required.' });
          }

          try {
            inMemoryDb.verifyEmailWithOtp(email, otp);
            return sendJson(res, 200, {
              success: true,
              message: 'Email address has been successfully verified! Your verified badge is now active.',
            });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Email verification failed' });
          }
        }

        // 8. Resend Email Verification OTP
        if (url === '/api/auth/resend-verification') {
          const { email } = body;
          if (!email) {
            return sendJson(res, 400, { error: 'Email address is required.' });
          }

          try {
            const result = inMemoryDb.resendVerificationOtp(email);
            return sendJson(res, 200, {
              success: true,
              message: 'A new 6-digit verification code has been dispatched to your inbox.',
              demoOtp: result.otp,
            });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to resend code' });
          }
        }

        // 9. Logout / Invalidate Session
        if (url === '/api/auth/logout') {
          const { refreshToken } = body;
          if (refreshToken) {
            inMemoryDb.revokeRefreshToken(refreshToken);
          }
          return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
        }

        // 9b. Change Password
        if (url === '/api/auth/change-password') {
          const authHeader = req.headers['authorization'] as string | undefined;
          const userSession = authenticateToken(authHeader);
          const { currentPassword, newPassword } = body;
          if (!currentPassword || !newPassword) {
            return sendJson(res, 400, { error: 'Current password and new password are required.' });
          }
          if (newPassword.length < 8) {
            return sendJson(res, 400, { error: 'New password must be at least 8 characters.' });
          }
          const email = userSession ? userSession.email : body.email;
          if (!email) {
            return sendJson(res, 401, { error: 'User session or email required.' });
          }
          try {
            inMemoryDb.changePassword(email, currentPassword, newPassword);
            return sendJson(res, 200, { success: true, message: 'Password has been updated successfully.' });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update password.' });
          }
        }

        // 9b-2. Delete User Account (requires password confirmation)
        if (url === '/api/auth/delete-account') {
          const authHeader = req.headers['authorization'] as string | undefined;
          const userSession = authenticateToken(authHeader);
          const { password } = body;
          if (!password) {
            return sendJson(res, 400, { error: 'Current password is required to delete your account.' });
          }
          const email = userSession ? userSession.email : body.email;
          if (!email) {
            return sendJson(res, 401, { error: 'Authenticated user session or email required.' });
          }
          try {
            inMemoryDb.deleteAccount(email, password);
            return sendJson(res, 200, {
              success: true,
              message: 'Your account and all associated data have been permanently deleted.',
            });
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to delete account.' });
          }
        }

        // 9c. Support Ticket Submission
        if (url === '/api/support/ticket') {
          const ticketId = 'TICK-' + Date.now().toString().slice(-6);
          const ticket = {
            id: ticketId,
            ...body,
            status: 'Open',
            createdAt: new Date().toISOString(),
          };
          return sendJson(res, 200, {
            success: true,
            ticket,
            message: `Support ticket #${ticketId} created successfully. Our team will follow up within 24 hours.`,
          });
        }

        // 9d. Problem / Bug Reporting
        if (url === '/api/support/report-bug') {
          const bugId = 'BUG-' + Date.now().toString().slice(-6);
          const bugReport = {
            id: bugId,
            ...body,
            status: 'Investigating',
            createdAt: new Date().toISOString(),
          };
          return sendJson(res, 200, {
            success: true,
            report: bugReport,
            message: `Bug report #${bugId} submitted successfully. Our engineering team has been notified.`,
          });
        }

        // 10. Core App Resources
        if (url === '/api/jobs') {
          const newJob = inMemoryDb.createJob(body);
          return sendJson(res, 201, { success: true, data: newJob });
        }

        if (url === '/api/applications') {
          const newApp = inMemoryDb.createApplication(body);
          return sendJson(res, 201, { success: true, data: newApp });
        }

        if (url === '/api/workshops/register') {
          const { workshopId, studentId } = body;
          const registered = inMemoryDb.registerWorkshop(workshopId, studentId);
          return sendJson(res, 200, { success: registered });
        }

        if (url === '/api/mentorship/book') {
          const newSession = inMemoryDb.bookMentorshipSession(body);
          return sendJson(res, 201, { success: true, data: newSession });
        }

        // 11. Company Module POST Endpoints
        if (url === '/api/company/verify-request') {
          const { companyId = 'comp_1', title, type, fileUrl } = body;
          const updated = inMemoryDb.requestCompanyVerification(companyId, { title, type, fileUrl });
          return sendJson(res, 200, { success: true, data: updated });
        }

        if (url === '/api/company/jobs') {
          const newJob = inMemoryDb.createJob(body);
          return sendJson(res, 201, { success: true, data: newJob });
        }

        if (url === '/api/company/offers') {
          const newOffer = inMemoryDb.createOffer(body);
          return sendJson(res, 201, { success: true, data: newOffer });
        }

        if (url === '/api/company/interviews') {
          const newInterview = inMemoryDb.scheduleInterview(body);
          return sendJson(res, 201, { success: true, data: newInterview });
        }

        if (url === '/api/company/team') {
          const { companyId = 'comp_1', ...memberData } = body;
          const newMember = inMemoryDb.addTeamMember(companyId, memberData);
          return sendJson(res, 201, { success: true, data: newMember });
        }

        if (url === '/api/company/candidates/invite') {
          const { candidateId, candidateName, candidateEmail, jobId, jobTitle, customMessage } = body;
          inMemoryDb.addAuditLog(
            'Talent Sourcer',
            'company',
            `Dispatched targeted invitation to ${candidateName} (${candidateEmail}) for ${jobTitle}`,
            'Success'
          );
          return sendJson(res, 200, {
            success: true,
            message: `Invitation successfully sent to ${candidateName} for ${jobTitle}!`,
          });
        }

        if (url === '/api/audit-logs') {
          const { actor = 'System User', actorRole = 'student', action = 'User Action', status = 'Success' } = body;
          const log = inMemoryDb.addAuditLog(actor, actorRole, action, status);
          return sendJson(res, 201, { success: true, data: log });
        }

        // 11. AI Services
        if (url === '/api/ai/resume-analyze') {
          const { resumeText = '', fileName = '' } = body;
          const analysis = await analyzeFullResumeAI(resumeText, fileName);
          return sendJson(res, 200, { success: true, data: analysis });
        }

        if (url === '/api/ai/resume-optimize') {
          const { originalResumeText = '', targetRole = '' } = body;
          const optimized = await optimizeResumeWithAI(originalResumeText, targetRole);
          return sendJson(res, 200, { success: true, data: optimized });
        }

        if (url === '/api/ai/resume-job-match') {
          const { resumeText = '', jobDescription = '', jobTitle = '' } = body;
          const matchResult = await matchResumeWithJobAI(resumeText, jobDescription, jobTitle);
          return sendJson(res, 200, { success: true, data: matchResult });
        }

        if (url === '/api/ai/resume-parse') {
          const { resumeText } = body;
          const parsed = await parseResumeWithAI(resumeText || '');
          return sendJson(res, 200, { success: true, data: parsed });
        }

        if (url === '/api/ai/skill-gap') {
          const { currentSkills = [], targetRole = 'Full Stack Engineer', experienceLevel = 'Entry-Level / Graduate' } = body;
          const analysis = await analyzeSkillGapWithAI(currentSkills, targetRole, experienceLevel);
          return sendJson(res, 200, { success: true, data: analysis });
        }

        if (url === '/api/ai/learning-roadmaps') {
          const { targetRole = 'Full Stack Engineer', currentSkills = [], durationWeeks = 8 } = body;
          const roadmap = await generateLearningRoadmapWithAI(targetRole, currentSkills, durationWeeks);
          return sendJson(res, 200, { success: true, data: roadmap });
        }

        if (url === '/api/ai/interview-gen') {
          const { role = 'Software Engineer', topics = ['System Design', 'Algorithms'], difficulty = 'Intermediate' } = body;
          const questions = await generateInterviewQuestionsWithAI(role, topics, difficulty);
          return sendJson(res, 200, { success: true, data: questions });
        }

        if (url === '/api/ai/evaluate-answer') {
          const { question = '', answer = '', idealAnswer = '' } = body;
          const evaluation = await evaluateInterviewAnswerWithAI(question, answer, idealAnswer);
          return sendJson(res, 200, { success: true, data: evaluation });
        }

        if (url === '/api/ai/match-score') {
          const { candidateProfile = {}, jobPosting = {} } = body;
          const matchResult = await calculateCandidateMatchAI(candidateProfile, jobPosting);
          return sendJson(res, 200, { success: true, data: matchResult });
        }

        if (url === '/api/ai/resume-improve') {
          const { bulletPoints = [] } = body;
          const suggestions = await generateResumeSuggestionsAI(bulletPoints);
          return sendJson(res, 200, { success: true, data: suggestions });
        }

        if (url === '/api/ai/chat') {
          const { messages = [], studentContext = null } = body;
          const reply = await chatWithCareerAdvisorAI(messages, studentContext);
          return sendJson(res, 200, { success: true, message: reply });
        }
      }

      // Default not found
      return sendJson(res, 404, { error: `Endpoint ${url} not found` });
    } catch (err: any) {
      console.error(`API Error on ${url}:`, err);
      return sendJson(res, 500, { error: err?.message || 'Internal Server Error' });
    }
  };
}
