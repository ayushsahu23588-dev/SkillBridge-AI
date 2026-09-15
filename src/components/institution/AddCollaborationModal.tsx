import React, { useState } from 'react';
import { InstitutionCollaborationItem } from '../../types';
import { X, Building2, Calendar, FileText, Users, Award } from 'lucide-react';

interface AddCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCollaboration: (collab: Omit<InstitutionCollaborationItem, 'id'>) => void;
}

export const AddCollaborationModal: React.FC<AddCollaborationModalProps> = ({
  isOpen,
  onClose,
  onAddCollaboration,
}) => {
  const [industry, setIndustry] = useState('');
  const [industryLogo, setIndustryLogo] = useState(
    'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80'
  );
  const [collaborationType, setCollaborationType] = useState<
    InstitutionCollaborationItem['collaborationType']
  >('Internship Program');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [leadFaculty, setLeadFaculty] = useState('Dr. Rajesh Sharma, Professor (CSE)');
  const [studentsBenefited, setStudentsBenefited] = useState(45);
  const [description, setDescription] = useState(
    'Formal partnership for talent development, technical curriculum immersion, and co-mentored industrial capstones.'
  );
  const [mouDocumentUrl, setMouDocumentUrl] = useState(
    'https://skillbridge.example.com/mous/nit_signed_mou.pdf'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry.trim()) return;

    onAddCollaboration({
      industry,
      industryLogo,
      collaborationType,
      department,
      leadFaculty,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'Active',
      studentsBenefited: Number(studentsBenefited),
      mouSigned: true,
      description,
      mouDocumentUrl,
    });
    onClose();
  };

  return (
    <div
      id="add-collaboration-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="add-collaboration-modal-content"
        className="w-full max-w-lg bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Register Industry MoU / Collaboration
              </h3>
              <p className="text-xs text-gray-500">
                Formalize bilateral academia-industry strategic initiative
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Industry / Corporate Partner Name
            </label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Cisco Systems India"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Collaboration Type
              </label>
              <select
                value={collaborationType}
                onChange={(e) =>
                  setCollaborationType(
                    e.target.value as InstitutionCollaborationItem['collaborationType']
                  )
                }
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
              >
                <option value="Internship Program">Internship Program</option>
                <option value="Research Project">Research Project</option>
                <option value="Industrial Training">Industrial Training</option>
                <option value="Consultancy Project">Consultancy Project</option>
                <option value="Faculty Workshop">Faculty Workshop</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Student Industry Project">Student Industry Project</option>
                <option value="Faculty Mentorship">Faculty Mentorship</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
              >
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics & Communication">ECE</option>
                <option value="Electrical Engineering">EEE</option>
                <option value="Mechanical Engineering">Mechanical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Institutional Faculty Lead
              </label>
              <input
                type="text"
                required
                value={leadFaculty}
                onChange={(e) => setLeadFaculty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Target Students / Faculty Benefited
              </label>
              <input
                type="number"
                min="1"
                required
                value={studentsBenefited}
                onChange={(e) => setStudentsBenefited(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Objectives & Scope Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Sign & Register Collaboration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
