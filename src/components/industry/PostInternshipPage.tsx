import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Banknote,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  RotateCcw,
  Building,
  Award,
  FileText,
  Check,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2,
} from 'lucide-react';
import { AIGenerationModal } from '../common/AIGenerationModal';

interface InternshipTemplate {
  name: string;
  badge: string;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration: string;
  stipend: string;
  eligibility: string;
  minQualification: string;
  deadlineDaysAhead: number;
  openings: number;
  perks: string[];
}

const PRESET_TEMPLATES: InternshipTemplate[] = [
  {
    name: 'Full-Stack Software Engineering Intern',
    badge: 'Popular',
    title: 'Full-Stack Web Platform Intern (React & Node.js)',
    department: 'Core Product Engineering',
    description:
      'Join our distributed engineering cohort to architect enterprise web services, responsive component frameworks, and resilient REST/GraphQL APIs. You will be paired 1-on-1 with a Staff Engineer to contribute production-ready code from week two.',
    responsibilities: [
      'Design modular, accessible UI interfaces using React, TypeScript, and Tailwind CSS.',
      'Construct high-throughput backend endpoints in Node.js and PostgreSQL with ORM schemas.',
      'Author automated unit, integration, and E2E tests using Vitest and Cypress.',
      'Participate in daily engineering standups, sprint planning, and bi-weekly architecture reviews.',
    ],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'],
    preferredSkills: ['Tailwind CSS', 'Docker', 'REST APIs', 'GraphQL'],
    location: 'Bangalore / Hybrid (2 Days Office)',
    workMode: 'Hybrid',
    duration: '6 Months (Summer / Fall Cohort)',
    stipend: '₹45,000 / month',
    eligibility: 'B.Tech / B.E. (3rd or 4th Year), Minimum 7.5 CGPA, No active backlogs',
    minQualification: 'B.Tech / B.E. in CSE / IT / ECE or equivalent',
    deadlineDaysAhead: 30,
    openings: 5,
    perks: ['Pre-Placement Offer (PPO) Conversion', '1:1 Staff Mentor', 'MacBook Pro Hardware Allowance', 'Flexible Working Hours'],
  },
  {
    name: 'AI / ML & GenAI Research Intern',
    badge: 'High Demand',
    title: 'Applied AI & GenAI Research Engineering Intern',
    department: 'Applied Machine Learning Labs',
    description:
      'Contribute directly to our proprietary conversational intelligence models and vector retrieval search engines. You will benchmark foundation models, fine-tune domain adapters, and optimize low-latency inferencing pipelines for real-time applications.',
    responsibilities: [
      'Implement data preprocessing and tokenization pipelines for domain-specific LLM evaluation.',
      'Experiment with RAG architectures using LangChain, pgvector, and FAISS embedding indexes.',
      'Benchmark model throughput, token latency, and hallucination reduction strategies.',
      'Document findings and present capstone benchmarks to the AI Leadership Guild.',
    ],
    requiredSkills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector Databases'],
    preferredSkills: ['Hugging Face', 'Docker', 'Prompt Engineering', 'MLflow'],
    location: 'Remote (Pan-India)',
    workMode: 'Remote',
    duration: '6 Months',
    stipend: '₹55,000 / month',
    eligibility: 'Pre-Final / Final Year B.Tech, M.Tech, or MS in AI / Data Science / CS',
    minQualification: 'B.Tech / M.Tech / M.S. in Computer Science, Data Science, or AI',
    deadlineDaysAhead: 45,
    openings: 3,
    perks: ['Pre-Placement Offer (PPO) Opportunity', 'GPU Cloud Credits Provided', 'Research Paper Publishing Support', 'Mentorship by AI Principal Scientists'],
  },
  {
    name: 'Cloud Infrastructure & DevOps Intern',
    badge: 'Infrastructure',
    title: 'Cloud Systems & Site Reliability Engineering Intern',
    department: 'Cloud Platform & Operations',
    description:
      'Partner with our infrastructure teams to modernize container orchestration clusters, zero-trust network boundaries, and telemetry monitors handling millions of daily events.',
    responsibilities: [
      'Maintain automated containerized deployments on Kubernetes and Docker clusters.',
      'Write Infrastructure as Code (IaC) modules using Terraform and Ansible.',
      'Configure Grafana dashboards and Prometheus alerts for system health monitoring.',
      'Participate in mock disaster recovery simulations and incident runbook automation.',
    ],
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Python / Bash'],
    preferredSkills: ['Terraform', 'Prometheus', 'Grafana', 'GitHub Actions'],
    location: 'Hyderabad, India (Tech Campus)',
    workMode: 'On-site',
    duration: '4 Months',
    stipend: '₹40,000 / month',
    eligibility: 'B.Tech / B.E. (Final Year), Minimum 7.0 CGPA',
    minQualification: 'B.Tech in CSE / IT / EEE or MCA',
    deadlineDaysAhead: 25,
    openings: 4,
    perks: ['Pre-Placement Offer (PPO) Consideration', 'AWS / CKA Certification Sponsorship', 'Campus Cafeteria & Cab Services', 'Live Production Access'],
  },
  {
    name: 'Cybersecurity & Application Security Intern',
    badge: 'Security',
    title: 'Application Security & Threat Modeling Intern',
    department: 'Information Security & Compliance',
    description:
      'Assist our Security Operations team in conducting static and dynamic application security tests (SAST/DAST), auditing API dependencies, and validating compliance across campus partner integrations.',
    responsibilities: [
      'Execute automated vulnerability scans across web applications and backend APIs.',
      'Analyze OWASP Top 10 risks and propose remediation patterns for development squads.',
      'Triage automated CVE reports and verify software supply chain bill-of-materials (SBOM).',
      'Create developer security awareness documentation and secure coding guidelines.',
    ],
    requiredSkills: ['Application Security', 'OWASP Top 10', 'Linux', 'Python', 'Networking'],
    preferredSkills: ['Burp Suite', 'SonarQube', 'Cryptography', 'SIEM Tools'],
    location: 'Bangalore / Hybrid',
    workMode: 'Hybrid',
    duration: '6 Months',
    stipend: '₹42,000 / month',
    eligibility: 'B.Tech / M.Tech in CSE / Cybersecurity / IT, 3rd or 4th Year',
    minQualification: 'B.Tech / M.Tech in CSE or Information Security',
    deadlineDaysAhead: 35,
    openings: 2,
    perks: ['PPO Consideration', 'Security Certification Support (CEH / Security+)', 'Direct Guidance from CISO Staff', 'Hybrid Flexibility'],
  },
];

const POPULAR_SKILL_TAGS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'SQL',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'PyTorch',
  'Git',
  'REST APIs',
  'Tailwind CSS',
  'Java',
  'C++',
];

export const PostInternshipPage: React.FC = () => {
  const { addOpportunity, navigate, showToast, currentCompany } = useApp();

  // Active View Mode: 'form' vs 'preview'
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [preferredSkillsText, setPreferredSkillsText] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [duration, setDuration] = useState('6 Months');
  const [stipend, setStipend] = useState('₹45,000 / month');
  const [eligibility, setEligibility] = useState('');
  const [minQualification, setMinQualification] = useState('B.Tech / B.E. (Pre-Final or Final Year)');
  const [openings, setOpenings] = useState('4');

  // Calculate default future date (+30 days)
  const getDefaultDeadline = (daysAhead: number = 30) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().slice(0, 10);
  };

  const [deadline, setDeadline] = useState(getDefaultDeadline(30));
  const [requiresNoc, setRequiresNoc] = useState(true);
  const [offersPpo, setOffersPpo] = useState(true);
  const [perks, setPerks] = useState<string[]>([
    'Pre-Placement Offer (PPO) Opportunity',
    'Certificate of Completion',
    '1:1 Industry Mentorship',
  ]);

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedModalOpen, setPublishedModalOpen] = useState(false);
  const [lastPublishedTitle, setLastPublishedTitle] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Apply quick preset template
  const handleApplyTemplate = (tmpl: InternshipTemplate) => {
    setTitle(tmpl.title);
    setDepartment(tmpl.department);
    setDescription(tmpl.description);
    setResponsibilitiesText(tmpl.responsibilities.join('\n'));
    setRequiredSkills([...tmpl.requiredSkills]);
    setPreferredSkillsText(tmpl.preferredSkills.join(', '));
    setLocation(tmpl.location);
    setWorkMode(tmpl.workMode);
    setDuration(tmpl.duration);
    setStipend(tmpl.stipend);
    setEligibility(tmpl.eligibility);
    setMinQualification(tmpl.minQualification);
    setDeadline(getDefaultDeadline(tmpl.deadlineDaysAhead));
    setOpenings(String(tmpl.openings));
    setPerks([...tmpl.perks]);
    setErrors({});

    showToast(`Loaded demo template: "${tmpl.name}"`, 'success');
  };

  // Reset form to clean state
  const handleResetForm = () => {
    setTitle('');
    setDepartment('');
    setDescription('');
    setResponsibilitiesText('');
    setRequiredSkills([]);
    setCustomSkillInput('');
    setPreferredSkillsText('');
    setLocation('');
    setWorkMode('Hybrid');
    setDuration('6 Months');
    setStipend('');
    setEligibility('');
    setMinQualification('B.Tech / B.E. (Pre-Final or Final Year)');
    setOpenings('2');
    setDeadline(getDefaultDeadline(30));
    setRequiresNoc(true);
    setOffersPpo(true);
    setPerks(['Pre-Placement Offer (PPO) Opportunity', 'Certificate of Completion']);
    setErrors({});
    showToast('Form fields cleared.', 'info');
  };

  // Add / Remove required skill tag
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!requiredSkills.includes(trimmed)) {
      setRequiredSkills((prev) => [...prev, trimmed]);
      if (errors.requiredSkills) {
        setErrors((prev) => ({ ...prev, requiredSkills: '' }));
      }
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Toggle perk
  const handleTogglePerk = (perk: string) => {
    setPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    // Title validation
    if (!title.trim()) {
      errs.title = 'Internship title is required.';
    } else if (title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters long.';
    }

    // Department validation
    if (!department.trim()) {
      errs.department = 'Department or business unit is required.';
    }

    // Description validation
    if (!description.trim()) {
      errs.description = 'Internship overview and description is required.';
    } else if (description.trim().length < 25) {
      errs.description = 'Please provide a more detailed overview (minimum 25 characters).';
    }

    // Responsibilities validation
    const respList = responsibilitiesText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    if (respList.length === 0) {
      errs.responsibilities = 'Please specify at least one key responsibility.';
    }

    // Required skills validation
    if (requiredSkills.length === 0) {
      errs.requiredSkills = 'At least one required skill is required for AI matching.';
    }

    // Location validation
    if (!location.trim()) {
      errs.location = 'Location or primary office hub is required.';
    }

    // Duration validation
    if (!duration.trim()) {
      errs.duration = 'Internship duration is required.';
    }

    // Stipend validation
    if (!stipend.trim()) {
      errs.stipend = 'Monthly stipend or compensation details are required.';
    }

    // Eligibility validation
    if (!eligibility.trim()) {
      errs.eligibility = 'Eligibility criteria (e.g. graduating year or CGPA) is required.';
    }

    // Qualification validation
    if (!minQualification.trim()) {
      errs.minQualification = 'Minimum academic qualification is required.';
    }

    // Deadline validation
    if (!deadline.trim()) {
      errs.deadline = 'Application deadline date is required.';
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errs.deadline = 'Application deadline cannot be in the past.';
      }
    }

    // Openings validation
    const openingsNum = parseInt(openings, 10);
    if (isNaN(openingsNum) || openingsNum < 1) {
      errs.openings = 'Openings must be at least 1 position.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Publish Handler
  const handlePublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      setActiveTab('form');
      showToast('Please correct the highlighted validation errors before publishing.', 'error');
      // Scroll to top of form
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate/await asynchronous database persistence
      await new Promise((r) => setTimeout(r, 650));

      const respArray = responsibilitiesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const prefSkillsArray = preferredSkillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const companyName = currentCompany?.name || 'TechNova Solutions';
      const companyLogo =
        currentCompany?.logo ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';

      // Dispatch to AppContext demo state
      addOpportunity({
        companyId: currentCompany?.id || 'comp_1',
        companyName,
        companyLogo,
        title: title.trim(),
        type: 'Internship',
        department: department.trim(),
        description: description.trim(),
        responsibilities: respArray,
        requiredSkills,
        preferredSkills: prefSkillsArray,
        location: location.trim(),
        workMode,
        duration: duration.trim(),
        stipendOrSalary: stipend.trim(),
        eligibility: eligibility.trim(),
        minQualification: minQualification.trim(),
        teamSize: `${openings} positions`,
        expectedOutcome: offersPpo
          ? 'High performers are eligible for Pre-Placement Full-time Offers (PPO).'
          : 'Certificate of Industrial Training Completion and project recommendation.',
        deadline,
        status: 'Active',
      });

      setLastPublishedTitle(title.trim());
      setPublishedModalOpen(true);
      showToast(`Internship "${title.trim()}" published successfully!`, 'success');
    } catch (err) {
      showToast('Failed to publish internship. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save as Draft Handler
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setErrors({ title: 'Provide at least a title to save a draft.' });
      showToast('Please enter an internship title to save a draft.', 'error');
      setActiveTab('form');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 450));

      const respArray = responsibilitiesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const prefSkillsArray = preferredSkillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      addOpportunity({
        companyId: currentCompany?.id || 'comp_1',
        companyName: currentCompany?.name || 'TechNova Solutions',
        companyLogo:
          currentCompany?.logo ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title: title.trim(),
        type: 'Internship',
        department: department.trim() || 'Engineering Department',
        description: description.trim() || 'Draft internship listing.',
        responsibilities: respArray.length > 0 ? respArray : ['To be updated.'],
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['General Engineering'],
        preferredSkills: prefSkillsArray,
        location: location.trim() || 'Flexible / TBD',
        workMode,
        duration: duration.trim() || '3-6 Months',
        stipendOrSalary: stipend.trim() || 'Stipend TBD',
        eligibility: eligibility.trim() || 'Undergraduate Cohort',
        minQualification: minQualification.trim() || 'B.Tech / B.E.',
        deadline: deadline || getDefaultDeadline(60),
        status: 'Draft',
      });

      showToast(`Draft "${title}" saved in your opportunities list.`, 'info');
      navigate('/industry/opportunities');
    } catch (err) {
      showToast('Failed to save draft. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="page-post-internship" className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="btn-back-to-industry-dashboard"
          onClick={() => navigate('/industry/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Industry Dashboard</span>
        </button>

        {/* View Mode Switcher: Form Editor vs Live Preview */}
        <div className="p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-1 text-xs">
          <button
            id="tab-switch-form"
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-white dark:bg-[#1E2029] text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Form Editor</span>
            {Object.keys(errors).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            )}
          </button>
          <button
            id="tab-switch-preview"
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-[#1E2029] text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Student Preview</span>
          </button>
        </div>
      </div>

      {/* Header Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-800/40">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Campus Talent Inflow</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/30">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Employer Portal</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Post Internship Opportunity
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                Create structured technical internships for university engineering cohorts with automated skill gap matching, faculty endorsements, and Pre-Placement Offer (PPO) tracks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-[#D4F73C]" />
              <span>Generate with AI</span>
            </button>
          </div>

          {/* Quick Preset Templates Strip */}
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Quick-Fill Demo Templates:</span>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Form</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="text-left p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-700/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-purple-600 dark:text-purple-400 mb-1">
                    <span>{tmpl.badge}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {tmpl.name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {tmpl.stipend} • {tmpl.workMode}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary Alert if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-bold">Please complete the required fields before submitting:</p>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-red-600 dark:text-red-400">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* MAIN TAB CONTENT: FORM EDITOR */}
      {activeTab === 'form' && (
        <form
          onSubmit={handlePublish}
          className="space-y-6"
          noValidate
        >
          {/* Card 1: Role Overview & Basic Details */}
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Role Overview & Core Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Internship Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-internship-title"
                  type="text"
                  placeholder="e.g. Full-Stack Web Platform Engineering Intern"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.title
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.title && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Department / Business Unit <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-internship-department"
                  type="text"
                  placeholder="e.g. Core Product Engineering / AI Labs"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.department
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.department && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              {/* Openings / Cohort Size */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Number of Open Positions <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-internship-openings"
                  type="number"
                  min="1"
                  max="50"
                  value={openings}
                  onChange={(e) => {
                    setOpenings(e.target.value);
                    if (errors.openings) setErrors((prev) => ({ ...prev, openings: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.openings
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.openings && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.openings}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Internship Overview & Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400">
                  {description.length} characters (min 25)
                </span>
              </div>
              <textarea
                id="input-internship-description"
                rows={4}
                placeholder="Detail the mission of the team, what tech stacks the intern will touch, mentorship models, and the day-to-day impact..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  errors.description
                    ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                    : 'border-gray-200 dark:border-white/10'
                } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
              />
              {errors.description && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Key Responsibilities & Deliverables <span className="text-red-500">*</span>
                <span className="text-[11px] font-normal text-gray-400 ml-1.5">
                  (Enter each responsibility on a separate line)
                </span>
              </label>
              <textarea
                id="input-internship-responsibilities"
                rows={4}
                placeholder="Architect scalable REST endpoints using TypeScript and Express&#10;Write unit and integration tests with 80%+ code coverage&#10;Collaborate with mentors during bi-weekly sprint reviews"
                value={responsibilitiesText}
                onChange={(e) => {
                  setResponsibilitiesText(e.target.value);
                  if (errors.responsibilities) setErrors((prev) => ({ ...prev, responsibilities: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  errors.responsibilities
                    ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                    : 'border-gray-200 dark:border-white/10'
                } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
              />
              {errors.responsibilities && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.responsibilities}</span>
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Required & Preferred Skills */}
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Technical Skills & AI Matching Prerequisites
              </h2>
            </div>

            {/* Required Skills Chip Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Required Technical Skills <span className="text-red-500">*</span>
              </label>

              {/* Selected Skills Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5 min-h-[36px] p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                {requiredSkills.length === 0 ? (
                  <span className="text-xs text-gray-400 italic px-1">
                    No skills added yet. Select popular skills below or type and press Enter.
                  </span>
                ) : (
                  requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800/50"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-0.5 hover:text-red-500 cursor-pointer"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Custom skill input */}
              <div className="flex gap-2">
                <input
                  id="input-custom-skill"
                  type="text"
                  placeholder="Type a skill and click Add (e.g. Next.js, Redis, PyTorch)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(customSkillInput);
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(customSkillInput)}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-purple-600 hover:text-white text-gray-700 dark:text-gray-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick-add popular skills */}
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">
                  Popular suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SKILL_TAGS.map((s) => {
                    const isSelected = requiredSkills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => (isSelected ? handleRemoveSkill(s) : handleAddSkill(s))}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-purple-400'
                        }`}
                      >
                        {isSelected ? `✓ ${s}` : `+ ${s}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {errors.requiredSkills && (
                <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.requiredSkills}</span>
                </p>
              )}
            </div>

            {/* Preferred / Good-to-have Skills */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Preferred / Nice-to-Have Skills
                <span className="text-[11px] font-normal text-gray-400 ml-1.5">
                  (Comma-separated)
                </span>
              </label>
              <input
                id="input-preferred-skills"
                type="text"
                placeholder="e.g. Docker, Redis, Kubernetes, CI/CD, Figma"
                value={preferredSkillsText}
                onChange={(e) => setPreferredSkillsText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Minimum Academic Qualification & Eligibility Criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Minimum Academic Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-min-qualification"
                  type="text"
                  placeholder="e.g. B.Tech / B.E. in CSE / IT or MCA"
                  value={minQualification}
                  onChange={(e) => {
                    setMinQualification(e.target.value);
                    if (errors.minQualification) setErrors((prev) => ({ ...prev, minQualification: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.minQualification
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.minQualification && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.minQualification}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Eligibility & Cohort Criteria <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-eligibility"
                  type="text"
                  placeholder="e.g. 2026/2027 Graduating Batches, Min 7.0 CGPA"
                  value={eligibility}
                  onChange={(e) => {
                    setEligibility(e.target.value);
                    if (errors.eligibility) setErrors((prev) => ({ ...prev, eligibility: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.eligibility
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.eligibility && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.eligibility}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Logistics, Work Mode & Compensation */}
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Logistics, Compensation & Timelines
              </h2>
            </div>

            {/* Work Mode Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Work Arrangement <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Remote', 'Hybrid', 'On-site'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWorkMode(mode)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      workMode === mode
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-600'
                        : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Office Location / Hub <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-location"
                  type="text"
                  placeholder="e.g. Bangalore, India (Electronic City)"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.location
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.location && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-duration"
                  type="text"
                  placeholder="e.g. 6 Months"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.duration
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.duration}</span>
                  </p>
                )}
              </div>

              {/* Monthly Stipend */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Monthly Stipend <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-stipend"
                  type="text"
                  placeholder="e.g. ₹45,000 / month"
                  value={stipend}
                  onChange={(e) => {
                    setStipend(e.target.value);
                    if (errors.stipend) setErrors((prev) => ({ ...prev, stipend: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.stipend
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.stipend && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.stipend}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Application Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    errors.deadline
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-gray-200 dark:border-white/10'
                  } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500`}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.deadline}</span>
                  </p>
                )}
              </div>

              {/* Institutional Compliance Toggles */}
              <div className="flex flex-col justify-center gap-2 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={offersPpo}
                    onChange={(e) => setOffersPpo(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Pre-Placement Offer (PPO) Potential upon completion</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={requiresNoc}
                    onChange={(e) => setRequiresNoc(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Requires College No-Objection Certificate (NOC)</span>
                </label>
              </div>
            </div>

            {/* Perks & Benefits Selection */}
            <div>
              <span className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Intern Perks & Offer Benefits:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Pre-Placement Offer (PPO) Opportunity',
                  'Certificate of Completion',
                  '1:1 Industry Mentorship',
                  'MacBook / Hardware Allowance',
                  'Flexible Working Hours',
                  'AWS / Cloud Credits',
                  'Healthcare / Insurance Coverage',
                ].map((perk) => {
                  const isChecked = perks.includes(perk);
                  return (
                    <button
                      key={perk}
                      type="button"
                      onClick={() => handleTogglePerk(perk)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-bold'
                          : 'bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{perk}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/industry/dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-xs cursor-pointer"
            >
              Cancel & Discard
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="btn-save-internship-draft"
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveDraft}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/15 font-bold text-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as Draft
              </button>
              <button
                id="btn-publish-internship"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Internship Opportunity...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Internship Opportunity</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* LIVE STUDENT PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                <strong>Live Candidate Preview:</strong> This preview shows exactly how enrolled students will view and apply for this internship in the Student Marketplace.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className="font-bold text-purple-700 dark:text-purple-300 hover:underline shrink-0 cursor-pointer"
            >
              Edit in Form
            </button>
          </div>

          {/* Student Card Preview */}
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-md space-y-6">
            {/* Header with Company Logo & Status */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={
                    currentCompany?.logo ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'
                  }
                  alt={currentCompany?.name || 'Company'}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200 dark:border-white/10 shadow-2xs"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {currentCompany?.name || 'TechNova Solutions'}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      Verified
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                    {title || 'Internship Title (e.g. Full-Stack Web Platform Intern)'}
                  </h2>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                    {department || 'Department / Business Unit'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-col items-end gap-1.5">
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {stipend || '₹45,000 / month'}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  {openings} open {parseInt(openings, 10) === 1 ? 'seat' : 'seats'}
                </span>
              </div>
            </div>

            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-white/5">
                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                <span>{location || 'Location TBD'}</span> ({workMode})
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-white/5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{duration || '6 Months'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-white/5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Deadline: {deadline}</span>
              </span>
              {offersPpo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800/40">
                  <Award className="w-3.5 h-3.5" />
                  <span>PPO Opportunity</span>
                </span>
              )}
            </div>

            {/* Description Narrative */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                About the Opportunity
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {description ||
                  'Internship description will appear here. Provide an engaging description of team missions, technical challenges, and learning models.'}
              </p>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Key Responsibilities
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {(responsibilitiesText
                  ? responsibilitiesText.split('\n').filter(Boolean)
                  : [
                      'Architect modular and testable production code',
                      'Collaborate with mentors in daily scrums',
                    ]
                ).map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills Badges */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Required Technical Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.length > 0 ? (
                  requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800/50"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No skills specified yet.</span>
                )}
              </div>
            </div>

            {/* Eligibility & Qualifications Box */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Eligible Cohort:
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                  {eligibility || 'All engineering cohorts'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Academic Prerequisite:
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                  {minQualification || 'B.Tech / B.E.'}
                </span>
              </div>
            </div>

            {/* Candidate Simulated Action */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Simulated Candidate Action Preview
              </div>
              <button
                type="button"
                onClick={() => handlePublish()}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Publish Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {publishedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Internship Successfully Published!
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <strong>"{lastPublishedTitle}"</strong> has been indexed and broadcasted across campus partner universities.
              </p>
            </div>

            {/* Quick stats / confirmation bullets */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active & Accepting Applications
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>AI Candidate Matching:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  Auto-indexing enabled
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>Student Marketplace:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  Visible to eligible students
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPublishedModalOpen(false);
                  navigate('/industry/opportunities');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>View in Manage Opportunities</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublishedModalOpen(false);
                  navigate('/industry/candidates');
                }}
                className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Find AI Matching Candidates</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublishedModalOpen(false);
                  handleResetForm();
                  setActiveTab('form');
                }}
                className="w-full py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium text-xs transition-colors cursor-pointer text-center"
              >
                Post Another Internship
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Gemini AI Job/Internship Generation Modal */}
      {isAiModalOpen && (
        <AIGenerationModal
          type="internship"
          initialTitle={title}
          onClose={() => setIsAiModalOpen(false)}
          onApply={(data) => {
            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.responsibilities && data.responsibilities.length > 0) {
              setResponsibilitiesText(data.responsibilities.join('\n'));
            }
            if (data.requiredSkills && data.requiredSkills.length > 0) {
              setRequiredSkills(data.requiredSkills);
            }
            if (data.preferredQualifications && data.preferredQualifications.length > 0) {
              setPreferredSkillsText(data.preferredQualifications.join('\n'));
            }
            setIsAiModalOpen(false);
            showToast('AI-generated internship specification applied to form!', 'success');
          }}
        />
      )}
    </div>
  );
};
