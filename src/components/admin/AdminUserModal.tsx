import React, { useState } from 'react';
import { AdminUserItem, UserRole } from '../../types';
import { X, ShieldCheck, UserCheck, AlertTriangle, Mail, Building2, Calendar, CheckCircle2 } from 'lucide-react';

interface AdminUserModalProps {
  user: AdminUserItem | null;
  onClose: () => void;
  onUpdateUser: (id: string, updates: Partial<AdminUserItem>) => void;
}

export const AdminUserModal: React.FC<AdminUserModalProps> = ({
  user,
  onClose,
  onUpdateUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'student');
  const [selectedStatus, setSelectedStatus] = useState<AdminUserItem['status']>(
    user?.status || 'Active'
  );
  const [moderationNotes, setModerationNotes] = useState('');

  if (!user) return null;

  const handleSave = () => {
    onUpdateUser(user.id, {
      role: selectedRole,
      status: selectedStatus,
    });
    onClose();
  };

  return (
    <div
      id="admin-user-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="admin-user-modal-content"
        className="w-full max-w-lg bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                {user.verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                )}
              </div>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">ORGANIZATION</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{user.organization}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">DEPARTMENT</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {user.department || 'General'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">ACCOUNT JOINED</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{user.joinedDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">LAST ACTIVE</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{user.lastActive}</span>
            </div>
          </div>

          {/* Role Change */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Assign Platform Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty Member</option>
              <option value="company">Industry Partner / Recruiter</option>
              <option value="college_admin">Institution / College Admin</option>
              <option value="super_admin">Super Administrator</option>
            </select>
          </div>

          {/* Status Change */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Account Status & Access Control
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Active', 'Pending', 'Suspended'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`p-2 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                    selectedStatus === st
                      ? st === 'Active'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : st === 'Pending'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Admin Moderation Notes (Audit Trail)
            </label>
            <textarea
              rows={2}
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
              placeholder="e.g. Identity verified via institute portal ID check..."
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden resize-none"
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
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Save User Changes
          </button>
        </div>
      </div>
    </div>
  );
};
