import React from 'react';
import { CustomActionConfig } from '../../../../types/index';
import { CustomActionsSection } from '../CustomActionsSection';
import { CollapsibleCard } from '../../../../components/ui/CollapsibleCard';

interface ViewConfigActionsTabProps {
  pageType: 'PROCESSO' | 'CADASTRO' | 'INTEGRACAO';
  customActions: CustomActionConfig[];
  setCustomActions: any;
}

export const ViewConfigActionsTab: React.FC<ViewConfigActionsTabProps> = ({
  pageType,
  customActions,
  setCustomActions
}) => {
  if (pageType === 'CADASTRO') return null;

  return (
    <CollapsibleCard title="Ações Customizadas e Integrações" defaultOpen={false} compact={true} className="bg-[var(--color-background-light)]">
      <CustomActionsSection
        customActions={customActions}
        setCustomActions={setCustomActions}
      />
    </CollapsibleCard>
  );
};
