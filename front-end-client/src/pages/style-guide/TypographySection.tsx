import React from 'react';

export const TypographySection: React.FC = () => {
  return (
    <section>
      <h2 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--color-border-default)]">
        Tipografia
      </h2>
      <div className="bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl p-6 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[var(--color-border-default)] pb-6 items-center">
          <span className="font-mono text-[11px] text-[var(--color-content-tertiary)] uppercase font-semibold">
            Títulos Base
          </span>
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-[var(--color-brand-dark)] tracking-tight">
              H1 - Sistema Integrado SIG3.0
            </h1>
            <h2 className="text-xl font-bold text-[var(--color-content-primary)] tracking-tight">
              H2 - Painel Departamental Analítico
            </h2>
            <h3 className="text-sm font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
              H3 - Subtítulos & Agrupamentos
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <span className="font-mono text-[11px] text-[var(--color-content-tertiary)] uppercase font-semibold">
            Corpo & Microtexto
          </span>
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[var(--color-content-tertiary)] uppercase mb-1 block">
                Corpo (text-sm)
              </span>
              <p className="text-sm text-[var(--color-content-secondary)] leading-relaxed">
                Este é o corpo de texto padrão...
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--color-content-tertiary)] uppercase mb-1 block">
                Micro-Legenda (text-xs)
              </span>
              <p className="text-xs text-[var(--color-content-tertiary)]">
                Legenda auxiliar, rótulos de status menores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
