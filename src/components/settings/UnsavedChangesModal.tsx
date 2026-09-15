import React from 'react';
import { AlertTriangle, X, Save, ArrowRight } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  onSaveAndContinue: () => void;
  isSaving?: boolean;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onCancel,
  onDiscard,
  onSaveAndContinue,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      id="unsaved-changes-modal"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-changes-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 id="unsaved-changes-title" className="text-lg font-semibold text-foreground">
                Unsaved Changes
              </h3>
              <p className="text-xs text-muted-foreground">You have modifications that haven't been saved yet.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close dialog"
            id="close-unsaved-modal-btn"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-sm text-amber-600 dark:text-amber-400">
          <p className="font-medium">You have unsaved changes. Are you sure you want to leave?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Leaving this section now will discard any unsaved modifications you have made to this form.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            id="discard-changes-btn"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            id="keep-editing-btn"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onSaveAndContinue}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
            id="save-continue-btn"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save & Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
