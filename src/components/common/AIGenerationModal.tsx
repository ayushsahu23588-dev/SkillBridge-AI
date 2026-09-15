import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import { AILoadingState } from './AILoadingState';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

interface AIGenerationModalProps {
  type: 'job' | 'internship';
  isOpen?: boolean;
  onClose: () => void;
  onApplyGenerated?: (data: {
    description: string;
    responsibilities: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    qualificationOrEligibility?: string;
  }) => void;
  onApply?: (data: any) => void;
  initialTitle?: string;
  initialDepartment?: string;
}

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  type,
  isOpen = true,
  onClose,
  onApplyGenerated,
  onApply,
  initialTitle = '',
  initialDepartment = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [department, setDepartment] = useState(initialDepartment);
  const [basicRequirements, setBasicRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any | null>(null);

  React.useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialDepartment) setDepartment(initialDepartment);
  }, [initialTitle, initialDepartment]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      if (type === 'job') {
        const res = await geminiService.generateJobDescriptionWithAI({
          title,
          department,
          basicRequirements,
        });
        setGeneratedData(res);
      } else {
        const res = await geminiService.generateInternshipDescriptionWithAI({
          title,
          department,
          basicRequirements,
        });
        setGeneratedData(res);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedData) return;
    onApplyGenerated({
      description: generatedData.description,
      responsibilities: generatedData.responsibilities,
      requiredSkills: generatedData.requiredSkills,
      preferredSkills: generatedData.preferredSkills,
      qualificationOrEligibility: generatedData.qualification || generatedData.suggestedEligibility,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121319] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Generate {type === 'job' ? 'Job' : 'Internship'} Description with AI
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can edit and review all fields before publishing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {!generatedData ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-800 dark:text-gray-200">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Backend Software Engineer, Cloud Intern"
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-800 dark:text-gray-200">
                  Department / Team
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Platform Engineering, Data Services"
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-800 dark:text-gray-200">
                  Basic Requirements / Focus Technologies
                </label>
                <input
                  type="text"
                  value={basicRequirements}
                  onChange={(e) => setBasicRequirements(e.target.value)}
                  placeholder="e.g. Python, SQL, REST APIs, Docker basics"
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {loading && (
                <AILoadingState message={`Synthesizing comprehensive ${type} specifications with AI...`} />
              )}

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full py-3 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Structure with AI</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-gray-400">Generated Description</span>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {generatedData.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-gray-400">Responsibilities</span>
                <ul className="list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                  {generatedData.responsibilities.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <span className="font-bold text-[10px] uppercase text-gray-400 block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedData.requiredSkills.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <span className="font-bold text-[10px] uppercase text-gray-400 block mb-1">Preferred Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedData.preferredSkills.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedData && (
          <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 flex items-center justify-between">
            <button
              onClick={() => setGeneratedData(null)}
              className="px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-xs"
            >
              Modify Parameters
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Insert Into Form</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
