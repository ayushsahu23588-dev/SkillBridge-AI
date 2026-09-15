import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Bug,
  CheckCircle,
  AlertCircle,
  Send,
  LifeBuoy,
  FileText,
  Clock,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, BugReport } from '../../types/settings';

export const HelpSupportTab: React.FC = () => {
  const { currentUser, showToast } = useApp();

  // Mode: 'faq' | 'contact' | 'report_bug' | 'history'
  const [subTab, setSubTab] = useState<'faq' | 'contact' | 'report_bug' | 'history'>('faq');

  // Search & FAQ
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Tickets History
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('edubridge_support_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'TICK-849102',
        category: 'Skill Assessments',
        priority: 'Medium',
        subject: 'TypeScript assessment score synchronization delay',
        message: 'Completed the Level 3 TypeScript benchmark assessment but verified badge took 20 minutes to populate.',
        userEmail: currentUser?.email || 'alex.morgan@university.edu',
        userName: currentUser?.name || 'Alex Morgan',
        userRole: currentUser?.role || 'student',
        status: 'Resolved',
        createdAt: '2025-02-28T14:32:00Z',
      },
    ];
  });

  // Bug Reports History
  const [bugReports, setBugReports] = useState<BugReport[]>(() => {
    const saved = localStorage.getItem('edubridge_bug_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Support Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    category: 'Assessments & Skills',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
    subject: '',
    message: '',
  });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  // Bug Report Form State
  const [bugForm, setBugForm] = useState({
    issueType: 'UI Glitch' as 'UI Glitch' | 'Performance Issue' | 'Broken Feature' | 'Data Not Saving' | 'Other',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    title: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
  });
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);
  const [bugSuccess, setBugSuccess] = useState<string | null>(null);

  // FAQs Data
  const faqs = [
    {
      category: 'General',
      question: 'What is SkillBridge AI and how does the matching engine work?',
      answer:
        'SkillBridge AI connects academic talent directly to industry opportunities through AI-verified skill assessments, dynamic curriculum roadmaps, and automated credential matching for internships, jobs, and faculty research collaborations.',
    },
    {
      category: 'Authentication',
      question: 'How do I update my primary email or password?',
      answer:
        'You can update your display name and email under the Account tab. To change your password, go to the Security tab, enter your current password, and configure your new credential adhering to the 8+ character complexity policy.',
    },
    {
      category: 'Assessments & Skills',
      question: 'How are verified skill scores and badges calculated?',
      answer:
        'Skill scores are calculated using adaptive AI diagnostic quizzes, real-world coding sandboxes, and project assessments. Badges with 80%+ scores receive automated verification badges that are visible to participating companies.',
    },
    {
      category: 'Internships & Jobs',
      question: 'When do recruiters see my job or internship applications?',
      answer:
        'When you submit an application, recruiters receive an instant notification with your AI Match Score, verified skill breakdown, digital portfolio links, and resume. You can track status changes under your Applications portal.',
    },
    {
      category: 'Certifications',
      question: 'Can I import certificates from AWS, Coursera, or Microsoft?',
      answer:
        'Yes! You can add external credentials with verification IDs and credential URLs under your Digital Portfolio or Student Skills section. Verified issuer credentials automatically boost your role matching quotient.',
    },
    {
      category: 'General',
      question: 'Is my personal data visible to other students or unauthorized third parties?',
      answer:
        'No. Your data is protected by strict role-based access control. You can precisely control whether your profile is Public, Campus Only, or Private through the Privacy tab in Settings.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = faqCategory === 'all' || faq.category.toLowerCase() === faqCategory.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Ticket Submission
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      showToast('Please provide both a subject and detailed description.', 'error');
      return;
    }

    setIsSubmittingTicket(true);
    setTicketSuccess(null);

    try {
      // Send to backend API
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ticketForm,
          userEmail: currentUser?.email || 'user@edubridge.ai',
          userName: currentUser?.name || 'User',
          userRole: currentUser?.role || 'student',
        }),
      });

      const data = await res.json();
      const newTicket: SupportTicket = data.ticket || {
        id: 'TICK-' + Date.now().toString().slice(-6),
        ...ticketForm,
        userEmail: currentUser?.email || 'user@edubridge.ai',
        userName: currentUser?.name || 'User',
        userRole: currentUser?.role || 'student',
        status: 'Open',
        createdAt: new Date().toISOString(),
      };

      const updated = [newTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem('edubridge_support_tickets', JSON.stringify(updated));

      setTicketSuccess(`Support ticket #${newTicket.id} created successfully! Our engineering team will follow up.`);
      showToast(`Support Ticket #${newTicket.id} registered.`, 'success');
      setTicketForm({
        category: 'Assessments & Skills',
        priority: 'Medium',
        subject: '',
        message: '',
      });
    } catch {
      // Local fallback
      const newTicket: SupportTicket = {
        id: 'TICK-' + Date.now().toString().slice(-6),
        ...ticketForm,
        userEmail: currentUser?.email || 'user@edubridge.ai',
        userName: currentUser?.name || 'User',
        userRole: currentUser?.role || 'student',
        status: 'Open',
        createdAt: new Date().toISOString(),
      };
      const updated = [newTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem('edubridge_support_tickets', JSON.stringify(updated));
      setTicketSuccess(`Support ticket #${newTicket.id} created successfully!`);
      showToast(`Support Ticket #${newTicket.id} registered.`, 'success');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Handle Bug Report Submission
  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title.trim() || !bugForm.stepsToReproduce.trim()) {
      showToast('Please provide a title and steps to reproduce the issue.', 'error');
      return;
    }

    setIsSubmittingBug(true);
    setBugSuccess(null);

    try {
      const res = await fetch('/api/support/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bugForm,
          userEmail: currentUser?.email || 'user@edubridge.ai',
        }),
      });

      const data = await res.json();
      const newBug: BugReport = data.report || {
        id: 'BUG-' + Date.now().toString().slice(-6),
        ...bugForm,
        userEmail: currentUser?.email || 'user@edubridge.ai',
        status: 'Investigating',
        createdAt: new Date().toISOString(),
      };

      const updated = [newBug, ...bugReports];
      setBugReports(updated);
      localStorage.setItem('edubridge_bug_reports', JSON.stringify(updated));

      setBugSuccess(`Bug report #${newBug.id} submitted successfully. Thank you for reporting!`);
      showToast(`Bug report #${newBug.id} recorded.`, 'success');
      setBugForm({
        issueType: 'UI Glitch',
        severity: 'Medium',
        title: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
      });
    } catch {
      const newBug: BugReport = {
        id: 'BUG-' + Date.now().toString().slice(-6),
        ...bugForm,
        userEmail: currentUser?.email || 'user@edubridge.ai',
        status: 'Investigating',
        createdAt: new Date().toISOString(),
      };
      const updated = [newBug, ...bugReports];
      setBugReports(updated);
      localStorage.setItem('edubridge_bug_reports', JSON.stringify(updated));
      setBugSuccess(`Bug report #${newBug.id} recorded successfully.`);
      showToast(`Bug report #${newBug.id} recorded.`, 'success');
    } finally {
      setIsSubmittingBug(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="help-support-container">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Help & Support Center</h2>
        <p className="text-sm text-muted-foreground">
          Browse knowledge base guides, submit support tickets, or report technical anomalies.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { id: 'faq', label: 'Frequently Asked Questions', icon: <HelpCircle className="h-4 w-4" /> },
          { id: 'contact', label: 'Contact Support', icon: <MessageSquare className="h-4 w-4" /> },
          { id: 'report_bug', label: 'Report a Problem', icon: <Bug className="h-4 w-4" /> },
          {
            id: 'history',
            label: `My Tickets (${tickets.length + bugReports.length})`,
            icon: <Clock className="h-4 w-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id as any)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              subTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            id={`help-subtab-${tab.id}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= 1. FAQ & KNOWLEDGE BASE ================= */}
      {subTab === 'faq' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search help articles (e.g. assessments, password, internships)..."
              className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
              id="faq-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'General', 'Authentication', 'Assessments & Skills', 'Internships & Jobs', 'Certifications'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqCategory(cat)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    faqCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'All Questions' : cat}
                </button>
              )
            )}
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-dashed border-border p-6 text-muted-foreground text-sm">
                No matching help articles found for "{faqSearch}". Try adjusting your search keywords.
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-card overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-foreground hover:bg-muted/30 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-2 pr-4">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {faq.category}
                        </span>
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/50 bg-muted/10">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Help Footer Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Need specialized assistance?</h4>
                <p className="text-xs text-muted-foreground">Our support engineers typically respond within 24 hours.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubTab('contact')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Open Support Ticket
            </button>
          </div>
        </div>
      )}

      {/* ================= 2. CONTACT SUPPORT TICKET ================= */}
      {subTab === 'contact' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Submit a Support Ticket
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Have a question about your account, skill score verification, or placements? Fill out the details below.
            </p>
          </div>

          {ticketSuccess && (
            <div
              className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
              id="ticket-success-alert"
            >
              <CheckCircle className="h-5 w-5 shrink-0" />
              <p className="font-medium">{ticketSuccess}</p>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Inquiry Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="Assessments & Skills">Assessments & Skills</option>
                  <option value="Internship & Job Applications">Internship & Job Applications</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="Resume Studio & Interview Prep">Resume Studio & Interview Prep</option>
                  <option value="Accreditation & Institutional Sync">Accreditation & Institutional Sync</option>
                  <option value="Billing & Corporate Partnership">Billing & Corporate Partnership</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority Level</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Medium">Medium - Standard Request</option>
                  <option value="High">High - Impeding Application or Drive</option>
                  <option value="Urgent">Urgent - Blocking Deadline</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Subject / Summary <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Verified badge not showing after passing Level 3 assessment"
                  required
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Detailed Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="Please describe your question or issue in detail..."
                  required
                  className="w-full rounded-xl border border-input bg-background p-3.5 text-sm text-foreground focus:border-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
                id="submit-ticket-btn"
              >
                {isSubmittingTicket ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Support Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= 3. REPORT A PROBLEM / BUG ================= */}
      {subTab === 'report_bug' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Bug className="h-5 w-5 text-rose-500" />
              Report a Technical Problem
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Found a bug or unexpected behavior? Help us improve SkillBridge AI by providing reproduction steps.
            </p>
          </div>

          {bugSuccess && (
            <div
              className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
              id="bug-success-alert"
            >
              <CheckCircle className="h-5 w-5 shrink-0" />
              <p className="font-medium">{bugSuccess}</p>
            </div>
          )}

          <form onSubmit={handleBugSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Issue Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Issue Classification</label>
                <select
                  value={bugForm.issueType}
                  onChange={(e) => setBugForm({ ...bugForm, issueType: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="UI Glitch">UI Glitch / Visual Bug</option>
                  <option value="Performance Issue">Slow Loading / Performance Lag</option>
                  <option value="Broken Feature">Feature Button / Function Not Responding</option>
                  <option value="Data Not Saving">Data Loss / Changes Not Saving</option>
                  <option value="Other">Other Unclassified Issue</option>
                </select>
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Severity Level</label>
                <select
                  value={bugForm.severity}
                  onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="Low">Low - Minor cosmetic flaw</option>
                  <option value="Medium">Medium - Function works but with workaround</option>
                  <option value="High">High - Major feature broken</option>
                  <option value="Critical">Critical - App crash / data loss</option>
                </select>
              </div>

              {/* Bug Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Problem Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={bugForm.title}
                  onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                  placeholder="e.g. Filter dropdown freezes when selecting Cloud Architecture role"
                  required
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Steps to Reproduce */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Steps to Reproduce <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  value={bugForm.stepsToReproduce}
                  onChange={(e) => setBugForm({ ...bugForm, stepsToReproduce: e.target.value })}
                  placeholder="1. Navigate to Internships&#10;2. Click on 'Filter by Role'&#10;3. Select Cloud Engineer"
                  required
                  className="w-full rounded-xl border border-input bg-background p-3.5 text-sm text-foreground focus:border-primary focus:outline-hidden resize-none font-mono text-xs"
                />
              </div>

              {/* Expected vs Actual */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Expected Behavior</label>
                <input
                  type="text"
                  value={bugForm.expectedBehavior}
                  onChange={(e) => setBugForm({ ...bugForm, expectedBehavior: e.target.value })}
                  placeholder="Internship listings should filter to Cloud Engineer"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Actual Behavior</label>
                <input
                  type="text"
                  value={bugForm.actualBehavior}
                  onChange={(e) => setBugForm({ ...bugForm, actualBehavior: e.target.value })}
                  placeholder="The dropdown stays open and nothing happens"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="submit"
                disabled={isSubmittingBug}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 shadow-sm"
                id="submit-bug-btn"
              >
                {isSubmittingBug ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                    <span>Logging Bug Report...</span>
                  </>
                ) : (
                  <>
                    <Bug className="h-4 w-4" />
                    <span>Submit Problem Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= 4. TICKETS & REPORTS HISTORY ================= */}
      {subTab === 'history' && (
        <div className="space-y-6">
          {/* Active Support Tickets */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Submitted Support Tickets ({tickets.length})
            </h3>

            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No support tickets filed yet.</p>
            ) : (
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">{t.id}</span>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {t.category}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            t.status === 'Resolved'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{t.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{t.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submitted Bug Reports */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bug className="h-4 w-4 text-rose-500" />
              Bug Reports ({bugReports.length})
            </h3>

            {bugReports.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No bug reports submitted yet.</p>
            ) : (
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {bugReports.map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">{b.id}</span>
                        <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
                          {b.issueType}
                        </span>
                        <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{b.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">Expected: {b.expectedBehavior}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
