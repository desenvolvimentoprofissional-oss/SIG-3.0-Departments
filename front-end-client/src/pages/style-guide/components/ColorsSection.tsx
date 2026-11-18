import React from 'react';

export const ColorsSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--color-border-default)]">
        Paleta de Cores e Estados
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-[11px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-3">
            Marca Primária
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-brand-light)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Light
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-brand-light
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-brand-main)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Main
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-brand-main
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-brand-dark)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Dark
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-brand-dark
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-3">
            Secundária
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-secondary-light)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Light
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-secondary-light
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-secondary-main)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Main
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-secondary-main
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-secondary-dark)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Dark
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-secondary-dark
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-3">
            Destaques
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-accent-light)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Light
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-accent-light
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-accent-main)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Main
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-accent-main
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-accent-dark)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Dark
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-accent-dark
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-3">
            Texto, Bordas e Contornos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-[var(--color-border-default)] p-3 rounded-lg bg-[var(--color-content-inverse)]">
              <p className="text-sm font-bold text-[var(--color-content-primary)]">
                --color-content-primary
              </p>
              <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
                H1, H2, Títulos de Tabela
              </p>
            </div>
            <div className="border border-[var(--color-border-default)] p-3 rounded-lg bg-[var(--color-content-inverse)]">
              <p className="text-sm font-medium text-[var(--color-content-secondary)]">
                --color-content-secondary
              </p>
              <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
                Parágrafos, Subtítulos
              </p>
            </div>
            <div className="border border-[var(--color-border-default)] p-3 rounded-lg bg-[var(--color-content-inverse)]">
              <p className="text-sm font-medium text-[var(--color-content-tertiary)]">
                --color-content-tertiary
              </p>
              <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
                Labels em branco, disabled
              </p>
            </div>
            <div className="border border-[var(--color-border-default)] p-3 rounded-lg bg-[var(--color-border-default)]">
              <p className="text-sm font-medium text-[var(--color-content-primary)]">
                --color-border-default
              </p>
              <p className="text-[10px] text-[var(--color-content-secondary)] mt-1">
                Divisores e Contornos
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider mb-3">
            Estado Semântico
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-status-success)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Sucesso
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-status-success
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-status-warning)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Atenção
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-status-warning
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-status-error)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Erro
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-status-error
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-12 rounded-lg bg-[var(--color-status-info)] border border-[var(--color-border-default)] shadow-sm"></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-content-primary)]">
                  Info
                </p>
                <p className="text-[10px] font-mono text-[var(--color-content-secondary)]">
                  --color-status-info
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
