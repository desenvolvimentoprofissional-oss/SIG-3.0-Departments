import React from 'react';
import { Toggle } from '../../../components/ui/Toggle';
import { Input } from '../../../components/ui/Input';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

export const VotingConfiguration = ({
  enableVoting, setEnableVoting,
  votingOptions, setVotingOptions
}: any) => {
  return (
    <CollapsibleCard 
      title="Votação (Meu Controle)" 
      subtitle="Permite habilitar um formulário de votação nos detalhes do registro, com resultados em tempo real."
      defaultOpen={false}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-content-primary)]">Habilitar Votação</span>
        {setEnableVoting && (
          <Toggle checked={!!enableVoting} onChange={setEnableVoting} />
        )}
      </div>
      {enableVoting && setVotingOptions && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border-default)]">
          <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
            Opções de Votação (separadas por vírgula)
          </label>
          <Input 
            placeholder="Ex: Aprovado, Rejeitado, Revisão"
            value={votingOptions || ''}
            onChange={(e: any) => setVotingOptions(e.target.value)}
          />
        </div>
      )}
    </CollapsibleCard>
  );
};
