import React from 'react';
import { Search, Settings, ShieldCheck, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import { Button } from '../../../components/ui/Button';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';

interface FormControlsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleState: boolean;
  setToggleState: (state: boolean) => void;
}

export const FormControlsSection: React.FC<FormControlsSectionProps> = ({
  activeTab,
  setActiveTab,
  toggleState,
  setToggleState,
}) => {
  return (
    <section>
      <h2 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--color-border-default)] flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Controles, Buscas e Formulários
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-[var(--color-background-light)] p-5 border border-[var(--color-border-default)] rounded-xl">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
              Campo de Busca Global
            </label>
            <Input
              placeholder="Pesquisar por nome, e-mail ou ID..."
              icon={<Search />}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Seleção Restrita</span>
              <span className="text-[9px] text-[var(--color-status-error)]">
                Obrigatório
              </span>
            </label>
            <Select
              options={[
                { label: 'Filtrar por Departamento', value: '' },
                { label: 'Administrativo', value: 'admin' },
                { label: 'Assessoria Jurídica', value: 'juridico' },
                { label: 'Atendimento', value: 'atendimento' },
                { label: 'Cobrança', value: 'cobranca' },
                { label: 'Conselheiros', value: 'conselheiros' },
                { label: 'Financeiro', value: 'financeiro' },
                { label: 'Recursos Humanos', value: 'rh' },
                { label: 'Serviços de Apoio', value: 'apoio' },
              ]}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
              Área de Texto
            </label>
            <Textarea placeholder="Descreva a justificativa para a auditoria..." />
          </div>
        </div>

        <div className="space-y-8 bg-[var(--color-background-light)] p-5 border border-[var(--color-border-default)] rounded-xl">
          <div>
            <h3 className="text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-3">
              Segmentação de Filtro
            </h3>
            <SegmentedControl
              options={[
                { label: 'Arquivado', value: 'all' },
                { label: 'Bloqueado', value: 'pending' },
                { label: 'Em andamento', value: 'active' },
                { label: 'Sem Status', value: 'none' },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-3">
              Liga / Desliga
            </h3>
            <div className="flex items-center justify-between p-3 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--color-brand-main)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-content-primary)]">
                    Modo Auditoria Rigorosa
                  </p>
                  <p className="text-[10px] text-[var(--color-content-secondary)]">
                    Ativa verificação dupla no IAM
                  </p>
                </div>
              </div>
              <Toggle checked={toggleState} onChange={setToggleState} />
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-3">
              Família de Botões de Ação
            </h3>
            <div className="grid grid-cols-4 gap-2 w-full">
              <Button variant="primary">Criar</Button>
              <Button
                variant="secondary"
                icon={<Filter className="w-3.5 h-3.5 hidden sm:block" />}
              >
                Avançado
              </Button>
              <Button variant="danger">Excluir</Button>
              <Button variant="disabled">Aguarde</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
