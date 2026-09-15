/**
 * Unified API Client for EduBridge AI Full-Stack Platform
 */

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('edubridge_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  public async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  public async post<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  public async put<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  public async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  // Typed Resource Operations
  public async getJobs() {
    return this.get('/api/jobs');
  }

  public async createJob(job: any) {
    return this.post('/api/jobs', job);
  }

  public async deleteJob(id: string) {
    return this.delete(`/api/jobs/${id}`);
  }

  public async getApplications() {
    return this.get('/api/applications');
  }

  public async applyToJob(jobId: string, studentId: string, coverNote?: string) {
    return this.post('/api/applications', { jobId, studentId, coverNote });
  }

  public async updateApplicationStatus(id: string, status: string, recruiterNotes?: string) {
    return this.put(`/api/applications/${id}/status`, { status, recruiterNotes });
  }

  public async getStudentProfile() {
    return this.get('/api/student/profile');
  }

  public async updateStudentProfile(profile: any) {
    return this.put('/api/student/profile', profile);
  }

  public async verifyCertification(certId: string, facultyName: string) {
    return this.put(`/api/certifications/${certId}/verify`, { facultyName });
  }

  public async getWorkshops() {
    return this.get('/api/workshops');
  }

  public async registerWorkshop(workshopId: string, studentId: string) {
    return this.post('/api/workshops/register', { workshopId, studentId });
  }

  public async getMentorshipSessions() {
    return this.get('/api/mentorship');
  }

  public async bookMentorshipSession(sessionData: any) {
    return this.post('/api/mentorship/book', sessionData);
  }

  public async getAuditLogs() {
    return this.get('/api/audit-logs');
  }
}

export const apiClient = new ApiClient();
