import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let bg = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 shadow-xl';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          bg = 'bg-white dark:bg-gray-900 border-rose-200 dark:border-rose-900/50 text-gray-900 dark:text-gray-100 shadow-xl';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          bg = 'bg-white dark:bg-gray-900 border-amber-200 dark:border-amber-900/50 text-gray-900 dark:text-gray-100 shadow-xl';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border transition-all duration-300 transform translate-y-0 opacity-100 ${bg}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              id={`close_${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-2"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
