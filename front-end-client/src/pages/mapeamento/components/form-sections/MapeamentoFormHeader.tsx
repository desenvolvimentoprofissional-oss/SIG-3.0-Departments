import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../../components/ui/Button';
import { UserPlus } from 'lucide-react';

interface MapeamentoFormHeaderProps {
  selectedDeptId: string;
  pageName: string;
  onCancel: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const MapeamentoFormHeader: React.FC<MapeamentoFormHeaderProps> = ({
  selectedDeptId,
  pageName,
  onCancel,
  onSave,
  onShare
}) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('header-portal-target'));
  }, []);

  if (!portalTarget) return null;

  return createPortal(
    <div className="flex space-x-3 items-center">
      {selectedDeptId && (
        <button 
          onClick={onShare}
          className="flex items-center justify-center w-9 h-9 text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] hover:bg-[var(--color-brand-light)] rounded-md transition-colors border border-[var(--color-border-default)]"
          title="Compartilhar Página"
        >
          <UserPlus size={18} />
        </button>
      )}
      <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      <Button variant="primary" onClick={onSave} disabled={!pageName || !selectedDeptId}>
        Salvar Página
      </Button>
    </div>,
    portalTarget
  );
};
