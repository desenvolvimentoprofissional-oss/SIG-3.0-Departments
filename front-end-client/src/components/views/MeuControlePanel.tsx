import React from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { TenantConfig } from '../../types/index';
import { MeuControleVoting } from './MeuControleVoting';
import { MeuControleObservations } from './MeuControleObservations';
import { MeuControleFields } from './MeuControleFields';
import { useMeuControle } from './useMeuControle';

interface MeuControlePanelProps {
  tenant: TenantConfig;
  selectedItem: any;
}

export const MeuControlePanel: React.FC<MeuControlePanelProps> = ({ tenant, selectedItem }) => {
  const {
    editedFields,
    newObservation,
    setNewObservation,
    observationFieldsData,
    setObservationFieldsData,
    isSaving,
    isLoadingMc,
    hasEditableFields,
    hasObservations,
    observationFields,
    hasVoting,
    votingOptionsList,
    handleFieldChange,
    canSave,
    handleSave,
    handleVote,
    observations,
    votes,
    userHasVoted
  } = useMeuControle(tenant, selectedItem);

  if (!hasEditableFields && !hasObservations && !hasVoting) return null;

  return (
    <div className="space-y-6">
      {(hasEditableFields || hasObservations) && (
        <div className="bg-[var(--color-brand-main)]/5 p-4 rounded-xl border border-[var(--color-brand-main)]/20">
          <h4 className="text-xs uppercase font-bold text-[var(--color-brand-main)] mb-3 flex items-center">
            Meu Controle
          </h4>
          
          <div className="space-y-4">
        {hasEditableFields && (
          <MeuControleFields 
            fields={(selectedItem._colConfig || selectedItem._mapping).secondaryFieldsEditable}
            fieldsData={editedFields}
            selectedItem={{ ...selectedItem, ...editedFields, ...observationFieldsData }}
            handleFieldChange={handleFieldChange}
            isSaving={isSaving}
            isObservation={false}
          />
        )}

        {hasObservations && (
          <div className={hasEditableFields ? "mt-4 pt-4 border-t border-[var(--color-brand-main)]/10" : ""}>
             <MeuControleFields 
               fields={observationFields}
               fieldsData={observationFieldsData}
               selectedItem={{ ...selectedItem, ...editedFields, ...observationFieldsData }}
               handleFieldChange={(field: string, val: any) => setObservationFieldsData(prev => ({ ...prev, [field]: val }))}
               isSaving={isSaving}
               isObservation={true}
             />
             <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Nova Observação (Opcional)</label>
             <Textarea 
                placeholder="Adicione uma nova observação ao histórico..."
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                className="min-h-[80px]"
                disabled={isSaving}
             />
          </div>
        )}
        <Button 
          variant="primary" 
          className="w-full mt-2" 
          onClick={handleSave} 
          disabled={!canSave || isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
          </div>
        </div>
      )}

      <MeuControleObservations 
        hasObservations={hasObservations}
        isLoadingMc={isLoadingMc}
        observations={observations}
        observationFields={observationFields}
        selectedItem={{ ...selectedItem, ...editedFields, ...observationFieldsData }}
      />

      <MeuControleVoting
        hasVoting={hasVoting}
        userHasVoted={userHasVoted}
        isLoadingMc={isLoadingMc}
        isSaving={isSaving}
        votingOptionsList={votingOptionsList}
        votes={votes}
        handleVote={handleVote}
      />
    </div>
  );
};
