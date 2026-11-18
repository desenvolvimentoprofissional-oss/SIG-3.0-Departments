import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, FileText, Archive } from 'lucide-react';

export const DataCardsSection: React.FC = () => {
  const [card2Expanded, setCard2Expanded] = useState(false);
  const [card3Expanded, setCard3Expanded] = useState(true);

  return (
    <section>
      <h2 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--color-border-default)]">
        Exibição de Dados & Cartões
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
        <div className="p-4 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="text-2xl font-bold text-[var(--color-content-primary)]">
              14
            </div>
            <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
              Aguardando Análise
            </div>
          </div>
          <div className="p-2 bg-[#fef3c7] text-[#b45309] rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-[var(--color-content-primary)]">
                1.204
              </div>
              <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
                Documentos Ativos
              </div>
            </div>
            <div className="p-2 bg-[#e0f2fe] text-[#0369a1] rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center text-[10px] mb-1.5">
              <span className="font-semibold text-[var(--color-content-secondary)]">
                Progresso da Meta
              </span>
              <span className="text-[var(--color-content-secondary)]">
                <span className="font-bold text-[var(--color-brand-main)] text-[11px]">
                  85%
                </span>{' '}
                <span className="font-medium text-[var(--color-content-tertiary)] ml-0.5 text-[9px]">
                  (1.023 / 1.204)
                </span>
              </span>
            </div>
            <div className="w-full bg-[var(--color-background-light)] rounded-full h-1">
              <div
                className="bg-[var(--color-status-success)] h-1 rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>

          {card2Expanded && (
            <div className="mt-4 pt-3 border-t border-[var(--color-border-default)] space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--color-content-secondary)] font-medium">
                  Arquivos
                </span>
                <span className="text-[var(--color-content-primary)] font-bold">
                  850
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--color-content-secondary)] font-medium">
                  Em andamento
                </span>
                <span className="text-[var(--color-content-primary)] font-bold">
                  173
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setCard2Expanded(!card2Expanded)}
            className="w-full mt-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] transition-colors flex items-center justify-center gap-1"
          >
            {card2Expanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
            {card2Expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="p-4 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-[var(--color-content-primary)]">
                89
              </div>
              <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
                Arquivados Recentes
              </div>
            </div>
            <div className="p-2 bg-[#f3f4f6] text-[#4b5563] rounded-lg">
              <Archive className="w-5 h-5" />
            </div>
          </div>

          {card3Expanded && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border-default)] space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-2 pb-1 border-b border-[var(--color-border-default)] border-dashed">
                  <span>Auditoria Interna</span>
                  <span>45 docs</span>
                </div>
                <div className="space-y-3 mt-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://ui-avatars.com/api/?name=Ana+Silva&background=0D8ABC&color=fff&size=64"
                          alt="Ana Silva"
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-[var(--color-content-primary)] font-medium text-[11px]">
                          Ana Silva
                        </span>
                      </div>
                      <span className="text-[var(--color-content-secondary)] font-mono text-[10px]">
                        22 docs
                      </span>
                    </div>
                    <div className="bg-[var(--color-background-light)] rounded-full h-1 ml-7 w-[calc(100%-28px)]">
                      <div
                        className="bg-[var(--color-brand-light)] h-1 rounded-full"
                        style={{ width: '48%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://ui-avatars.com/api/?name=Roberto+Gomes&background=059669&color=fff&size=64"
                          alt="Roberto Gomes"
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-[var(--color-content-primary)] font-medium text-[11px]">
                          Roberto Gomes
                        </span>
                      </div>
                      <span className="text-[var(--color-content-secondary)] font-mono text-[10px]">
                        15 docs
                      </span>
                    </div>
                    <div className="bg-[var(--color-background-light)] rounded-full h-1 ml-7 w-[calc(100%-28px)]">
                      <div
                        className="bg-[var(--color-status-success)] h-1 rounded-full"
                        style={{ width: '33%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://ui-avatars.com/api/?name=Paulo+Castro&background=F59E0B&color=fff&size=64"
                          alt="Paulo Castro"
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-[var(--color-content-primary)] font-medium text-[11px]">
                          Paulo Castro
                        </span>
                      </div>
                      <span className="text-[var(--color-content-secondary)] font-mono text-[10px]">
                        8 docs
                      </span>
                    </div>
                    <div className="bg-[var(--color-background-light)] rounded-full h-1 ml-7 w-[calc(100%-28px)]">
                      <div
                        className="bg-[var(--color-status-warning)] h-1 rounded-full"
                        style={{ width: '19%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setCard3Expanded(!card3Expanded)}
            className="w-full mt-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] transition-colors flex items-center justify-center gap-1"
          >
            {card3Expanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
            {card3Expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
