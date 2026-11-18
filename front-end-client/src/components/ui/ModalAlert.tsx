import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';

interface ModalAlertProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-content-inverse)] rounded-xl shadow-xl w-full max-w-md border border-[var(--color-border-default)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-5 border-b border-[var(--color-border-default)] bg-[var(--color-background-light)]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[var(--color-status-error)]/10 text-[var(--color-status-error)] rounded-full">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-content-primary)]">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-[var(--color-content-tertiary)] hover:text-[var(--color-content-primary)] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-[var(--color-content-secondary)]">{description}</p>
        </div>
        <div className="flex justify-end p-5 pt-0 space-x-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm} className="bg-[var(--color-status-error)] hover:bg-red-700 text-white border-0">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

const _ModalAlert = React.memo(ModalAlert);
export { _ModalAlert as ModalAlert };
