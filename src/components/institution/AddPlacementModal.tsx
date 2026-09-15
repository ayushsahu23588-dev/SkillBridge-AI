import React, { useState } from 'react';
import { InstitutionPlacementItem, InstitutionStudentItem } from '../../types';
import { X, Building2, Briefcase, Award, Calendar, DollarSign } from 'lucide-react';

interface AddPlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlacement: (placement: Omit<InstitutionPlacementItem, 'id'>) => void;
  students: InstitutionStudentItem[];
}

export const AddPlacementModal: React.FC<AddPlacementModalProps> = ({
  isOpen,
  onClose,
  onAddPlacement,
  students,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0] ? students[0].id : ''
  );
  const [company, setCompany] = useState<string>('Google India');
  const [role, setRole] = useState<string>('Associate Software Engineer');
  const [packageRange, setPackageRange] = useState<string>('₹24.0 LPA');
  const [offerLetterUrl, setOfferLetterUrl] = useState<string>('https://skillbridge.example.com/offers/nit_rec_2026.pdf');

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    onAddPlacement({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNumber: currentStudent.rollNumber,
      department: currentStudent.department,
      company,
      role,
      packageRange,
      date: new Date().toISOString().slice(0, 10),
      status: 'Placed',
      offerLetterUrl,
    });
    onClose();
  };

  return (
    <div
      id="add-placement-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="add-placement-modal-content"
        className="w-full max-w-lg bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Record Campus Placement Offer
              </h3>
              <p className="text-xs text-gray-500">
                Log verified institutional placement offer into college records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Select Candidate / Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="dark:bg-[#14151B]">
                  {s.name} ({s.rollNumber}) • {s.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Recruiting Company
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Microsoft India"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Role / Job Title
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Cloud Engineer"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Compensation / CTC (LPA)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={packageRange}
                  onChange={(e) => setPackageRange(e.target.value)}
                  placeholder="e.g. ₹18.5 LPA"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Offer Letter / Verification URL
              </label>
              <input
                type="text"
                value={offerLetterUrl}
                onChange={(e) => setOfferLetterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Save Placement Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
