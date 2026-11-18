import React from 'react';
import { GripVertical, UserPlus } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { StatusIcon } from '../../../components/ui/StatusIcon';

export const TablesSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--color-border-default)]">
        Dados Compostos & Agrupamentos
      </h2>

      <div className="bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-background-light)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-brand-dark)] tracking-tight">
              Listagem Base de Processos
            </h3>
            <p className="text-[11px] text-[var(--color-content-tertiary)] mt-0.5">
              Tabela padrão (Datatable) com ações integradas e status
              semânticos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex flex-col items-center justify-center rounded border border-[var(--color-border-default)] bg-[var(--color-content-inverse)] text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] hover:border-[var(--color-brand-main)] transition-colors">
              <GripVertical className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 bg-[var(--color-brand-main)] text-white text-xs font-semibold rounded-md shadow flex items-center gap-1.5 hover:bg-[var(--color-brand-dark)]">
              <UserPlus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-background-light)] bg-opacity-50 text-[10px] uppercase font-bold text-[var(--color-content-tertiary)] tracking-widest border-b border-[var(--color-border-default)]">
                <th className="px-5 py-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                  />
                </th>
                <th className="px-5 py-3">Nome do Serviço</th>
                <th className="px-5 py-3">Tag Semântica</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)] text-sm">
              <tr className="hover:bg-[var(--color-background-light)] transition-colors group">
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-[var(--color-content-primary)]">
                    PROC-2026.0124-A
                  </p>
                  <p className="text-[11px] text-[var(--color-content-secondary)] font-mono">
                    v3.4.1
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="system">SISTEMA</Badge>
                </td>
                <td className="px-5 py-4">
                  <StatusIcon variant="pending" label="Em andamento" />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[var(--color-brand-main)] hover:text-[var(--color-brand-dark)] text-xs font-semibold px-2 py-1 rounded bg-[var(--color-background-light)] opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-[var(--color-brand-light)]">
                    Detalhes
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[var(--color-background-light)] transition-colors group relative">
                <td className="px-5 py-4 relative">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-[var(--color-content-primary)]">
                    PROC-2026.0118-B
                  </p>
                  <p className="text-[11px] text-[var(--color-content-secondary)] font-mono">
                    v1.2.0
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="audit">AUDITORIA</Badge>
                </td>
                <td className="px-5 py-4">
                  <StatusIcon variant="blocked" label="Bloqueado" />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[var(--color-status-error)] hover:text-red-800 text-xs font-semibold px-2 py-1 rounded bg-red-50 border border-[var(--color-status-error)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Revogar
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[var(--color-background-light)] transition-colors group">
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-[var(--color-content-primary)]">
                    PROC-2025.1099-C
                  </p>
                  <p className="text-[11px] text-[var(--color-content-secondary)] font-mono">
                    v1.0.0
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="legacy">LEGADO</Badge>
                </td>
                <td className="px-5 py-4">
                  <StatusIcon variant="archived" label="Arquivado" />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[var(--color-brand-main)] hover:text-[var(--color-brand-dark)] text-xs font-semibold px-2 py-1 rounded bg-[var(--color-background-light)] opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-[var(--color-brand-light)]">
                    Detalhes
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[var(--color-background-light)] transition-colors group">
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-[var(--color-content-primary)]">
                    PROC-2026.0130-A
                  </p>
                  <p className="text-[11px] text-[var(--color-content-secondary)] font-mono">
                    v0.1.0-beta
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="draft">RASCUNHO</Badge>
                </td>
                <td className="px-5 py-4">
                  <StatusIcon variant="none" label="Sem Status" />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[var(--color-brand-main)] hover:text-[var(--color-brand-dark)] text-xs font-semibold px-2 py-1 rounded bg-[var(--color-background-light)] opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-[var(--color-brand-light)]">
                    Detalhes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
