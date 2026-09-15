import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  Plus,
  Video,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  X,
  CheckCircle2,
  Building,
  Edit2,
  XCircle,
  Lock,
  Loader2,
} from 'lucide-react';

export interface IndustryWorkshop {
  id: string;
  title: string;
  trainer: string;
  trainerRole?: string;
  domain: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  skillsCovered: string[];
  maxParticipants: number;
  registeredCount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Registration Closed';
  venueOrLink?: string;
}

const STORAGE_KEY = 'skillbridge_industry_workshops_v1';

const DEFAULT_WORKSHOPS: IndustryWorkshop[] = [
  {
    id: 'ws_1',
    title: 'Distributed Microservices & Cloud Native Architectures Masterclass',
    trainer: 'Vikram Malhotra',
    trainerRole: 'Principal Cloud Architect, TechNova',
    domain: 'Cloud & Distributed Systems',
    description: 'Deep dive into production Kubernetes orchestration, gRPC streaming, and low-latency distributed telemetry under extreme concurrency.',
    date: '2026-09-26',
    time: '14:00 - 17:30 IST',
    duration: '3.5 Hours',
    mode: 'Online',
    skillsCovered: ['Kubernetes', 'gRPC', 'Go', 'Telemetry', 'Docker'],
    maxParticipants: 500,
    registeredCount: 342,
    status: 'Upcoming',
    venueOrLink: 'https://stream.skillbridge.ai/technova-masterclass',
  },
  {
    id: 'ws_2',
    title: 'Full-Stack Performance Engineering & System Observability Sprint',
    trainer: 'Sneha Ranganathan',
    trainerRole: 'Staff Frontend Engineer, TechNova',
    domain: 'Web Engineering & Performance',
    description: 'Hands-on laboratory analyzing high-traffic database bottlenecks, browser profiling, and real-time caching layer tuning.',
    date: '2026-10-04',
    time: '10:00 - 16:00 IST',
    duration: '6 Hours',
    mode: 'Hybrid',
    skillsCovered: ['React', 'TypeScript', 'Redis', 'Web Vitals', 'Node.js'],
    maxParticipants: 200,
    registeredCount: 180,
    status: 'Upcoming',
    venueOrLink: 'Main Auditorium, Apex National Institute & Virtual Stream',
  },
  {
    id: 'ws_3',
    title: 'Frontier AI in Production: Model Quantization & Small LLMs',
    trainer: 'Dr. Alok Sen',
    trainerRole: 'Head of Applied AI, TechNova',
    domain: 'Artificial Intelligence & Machine Learning',
    description: 'Exploration of quantized transformers, speculative decoding, and lightweight small language model deployments on edge devices.',
    date: '2026-08-15',
    time: '15:00 - 18:00 IST',
    duration: '3 Hours',
    mode: 'Online',
    skillsCovered: ['PyTorch', 'Transformers', 'Quantization', 'Python'],
    maxParticipants: 450,
    registeredCount: 420,
    status: 'Completed',
    venueOrLink: 'Recorded Session Archive',
  },
];

export const IndustryWorkshopsPage: React.FC = () => {
  const { showToast } = useApp();

  const [workshops, setWorkshops] = useState<IndustryWorkshop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_WORKSHOPS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
    } catch (e) {
      console.error(e);
    }
  }, [workshops]);

  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<IndustryWorkshop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formTrainer, setFormTrainer] = useState('');
  const [formDomain, setFormDomain] = useState('Cloud & Distributed Systems');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('2026-10-15');
  const [formTime, setFormTime] = useState('14:00 - 17:00 IST');
  const [formDuration, setFormDuration] = useState('3 Hours');
  const [formMode, setFormMode] = useState<'Online' | 'Offline' | 'Hybrid'>('Online');
  const [formSkills, setFormSkills] = useState('Kubernetes, Docker, Cloud Security');
  const [formMaxParticipants, setFormMaxParticipants] = useState('300');
  const [formVenue, setFormVenue] = useState('https://meet.google.com/technova-workshop');

  const openCreateModal = () => {
    setEditingWorkshop(null);
    setFormTitle('');
    setFormTrainer('Vikram Malhotra');
    setFormDomain('Cloud & Distributed Systems');
    setFormDescription('');
    setFormDate('2026-10-15');
    setFormTime('14:00 - 17:00 IST');
    setFormDuration('3 Hours');
    setFormMode('Online');
    setFormSkills('Kubernetes, Docker, Cloud Security');
    setFormMaxParticipants('300');
    setFormVenue('https://meet.google.com/technova-workshop');
    setIsModalOpen(true);
  };

  const openEditModal = (ws: IndustryWorkshop) => {
    setEditingWorkshop(ws);
    setFormTitle(ws.title);
    setFormTrainer(ws.trainer);
    setFormDomain(ws.domain);
    setFormDescription(ws.description);
    setFormDate(ws.date);
    setFormTime(ws.time);
    setFormDuration(ws.duration);
    setFormMode(ws.mode);
    setFormSkills(ws.skillsCovered.join(', '));
    setFormMaxParticipants(String(ws.maxParticipants));
    setFormVenue(ws.venueOrLink || '');
    setIsModalOpen(true);
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTrainer.trim()) {
      showToast('Please fill in workshop title and trainer.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const skillsArray = formSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingWorkshop) {
        setWorkshops((prev) =>
          prev.map((w) =>
            w.id === editingWorkshop.id
              ? {
                  ...w,
                  title: formTitle,
                  trainer: formTrainer,
                  domain: formDomain,
                  description: formDescription,
                  date: formDate,
                  time: formTime,
                  duration: formDuration,
                  mode: formMode,
                  skillsCovered: skillsArray,
                  maxParticipants: parseInt(formMaxParticipants, 10) || 250,
                  venueOrLink: formVenue,
                }
              : w
          )
        );
        showToast(`Workshop "${formTitle}" updated!`, 'success');
      } else {
        const newWs: IndustryWorkshop = {
          id: `ws_${Date.now()}`,
          title: formTitle,
          trainer: formTrainer,
          trainerRole: 'Industry Specialist, TechNova',
          domain: formDomain,
          description: formDescription,
          date: formDate,
          time: formTime,
          duration: formDuration,
          mode: formMode,
          skillsCovered: skillsArray,
          maxParticipants: parseInt(formMaxParticipants, 10) || 250,
          registeredCount: 0,
          status: 'Upcoming',
          venueOrLink: formVenue,
        };
        setWorkshops([newWs, ...workshops]);
        showToast(`Workshop "${formTitle}" created and broadcasted!`, 'success');
      }

      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to save workshop.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelWorkshop = (wsId: string) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === wsId ? { ...w, status: 'Cancelled' } : w))
    );
    showToast('Workshop marked as Cancelled.', 'info');
  };

  const handleCloseRegistration = (wsId: string) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === wsId ? { ...w, status: 'Registration Closed' } : w))
    );
    showToast('Registration closed for this workshop.', 'info');
  };

  const filteredWorkshops = workshops.filter((w) => {
    if (activeTab === 'Upcoming') return w.status === 'Upcoming' || w.status === 'Registration Closed';
    if (activeTab === 'Completed') return w.status === 'Completed' || w.status === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Workshops & Tech Talks
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Host technical workshops, industry masterclasses, and hands-on sprints for university students and faculty.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Host Workshop</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {(['All', 'Upcoming', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            {tab === 'All' ? 'All Workshops' : `${tab} Workshops`}
            <span className="ml-1.5 text-[10px] opacity-80">
              {tab === 'All'
                ? workshops.length
                : workshops.filter((w) =>
                    tab === 'Upcoming'
                      ? w.status === 'Upcoming' || w.status === 'Registration Closed'
                      : w.status === 'Completed' || w.status === 'Cancelled'
                  ).length}
            </span>
          </button>
        ))}
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkshops.map((ws) => (
          <div
            key={ws.id}
            className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ws.status === 'Upcoming'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20'
                      : ws.status === 'Registration Closed'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/20'
                      : ws.status === 'Cancelled'
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-500/20'
                      : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-500/20'
                  }`}
                >
                  {ws.status}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                  {ws.mode}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2">
                {ws.title}
              </h3>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold block mt-0.5">
                {ws.domain}
              </span>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {ws.date} • {ws.time} ({ws.duration})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>Trainer: <strong>{ws.trainer}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    Enrolled: <strong>{ws.registeredCount} / {ws.maxParticipants}</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                {ws.description}
              </p>

              <div className="mt-3">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Skills Covered
                </div>
                <div className="flex flex-wrap gap-1">
                  {ws.skillsCovered.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/10 text-[10px] font-medium text-gray-700 dark:text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => openEditModal(ws)}
                className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>

              {ws.status === 'Upcoming' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCloseRegistration(ws.id)}
                    title="Close Registration"
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold border border-amber-300 dark:border-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Close Reg</span>
                  </button>

                  <button
                    onClick={() => handleCancelWorkshop(ws.id)}
                    title="Cancel Workshop"
                    className="px-2.5 py-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-white/5 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Host / Edit Workshop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  {editingWorkshop ? 'Edit Workshop' : 'Host a Technical Workshop'}
                </h3>
                <p className="text-gray-500">
                  Broadcast technical training sessions to students across campus partners.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkshop} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Workshop Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Telemetry & System Observability"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Trainer / Expert *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTrainer}
                    onChange={(e) => setFormTrainer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    required
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe lab format, prerequisites, and learning outcomes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Mode
                  </label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formMaxParticipants}
                    onChange={(e) => setFormMaxParticipants(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Skills Covered (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Docker, Kubernetes, Linux, Go"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Location / Meeting Link
                </label>
                <input
                  type="text"
                  required
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{editingWorkshop ? 'Saving Changes...' : 'Creating Workshop...'}</span>
                    </>
                  ) : (
                    <span>{editingWorkshop ? 'Save Changes' : 'Create Workshop'}</span>
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
