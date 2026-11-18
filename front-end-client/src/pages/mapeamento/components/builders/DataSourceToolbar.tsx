import React from 'react';
import { Star, Loader2, CheckCircle2, Database, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface DataSourceToolbarProps {
  totalSources: number;
  pageType: string;
  index: number;
  isDefault?: boolean;
  onSetDefault?: () => void;
  onConnect: () => void;
  loadingCol: string | null;
  currentColName: string;
  hasMainFields?: boolean;
  isMainOpen: boolean;
  onToggleMainOpen: () => void;
  onAddRelational: () => void;
  onRemove?: () => void;
}

export const DataSourceToolbar: React.FC<DataSourceToolbarProps> = ({
  totalSources,
  pageType,
  index,
  isDefault = false,
  onSetDefault,
  onConnect,
  loadingCol,
  currentColName,
  hasMainFields = false,
  isMainOpen,
  onToggleMainOpen,
  onAddRelational,
  onRemove
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-default)]/60 gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-[var(--color-content-primary)] uppercase tracking-wider">
          {totalSources > 1 
            ? `${pageType === 'RESULTADOS' ? 'Fonte de Dados' : 'Coleção do Mapeamento'} ${index + 1}`
            : 'Coleção Principal'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        {totalSources > 1 && onSetDefault && (
          <div className="relative group/btn inline-flex items-center mr-1">
            <button
              type="button"
              onClick={onSetDefault}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] bg-white hover:bg-slate-50 hover:border-[var(--color-brand-main)] text-[var(--color-content-tertiary)] hover:text-amber-500"
            >
              <Star size={16} className={isDefault ? 'text-amber-500' : ''} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
              {isDefault ? 'Mapeamento Padrão' : 'Definir como Padrão'}
            </div>
          </div>
        )}

        <div className="relative group/btn inline-flex items-center">
          <button
            type="button"
            onClick={onConnect}
            disabled={loadingCol === currentColName || !currentColName}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] bg-white hover:bg-slate-50 hover:border-[var(--color-brand-main)] disabled:opacity-50"
          >
            {loadingCol === currentColName ? (
              <Loader2 size={16} className="animate-spin text-[var(--color-brand-main)]" />
            ) : hasMainFields ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <Database size={16} className="text-[var(--color-brand-main)]" />
            )}
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
            {hasMainFields ? 'Conectado — Clique para Atualizar' : 'Conectar ao Firebase'}
          </div>
        </div>

        {hasMainFields && (
          <div className="relative group/btn inline-flex items-center">
            <button
              type="button"
              onClick={onToggleMainOpen}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] bg-white hover:bg-slate-50 text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)]"
            >
              {isMainOpen ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
              {isMainOpen ? 'Ocultar Cabeçalhos' : 'Ver Cabeçalhos'}
            </div>
          </div>
        )}

        <div className="relative group/btn inline-flex items-center">
          <button
            type="button"
            onClick={onAddRelational}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)] bg-white hover:bg-slate-50 text-[var(--color-brand-main)]"
          >
            <Plus size={16} />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
            Adicionar Coleção Relacional
          </div>
        </div>

        {totalSources > 1 && onRemove && (
          <div className="relative group/btn inline-flex items-center">
            <button
              type="button"
              onClick={onRemove}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] hover:border-red-200 bg-white hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
              Remover Mapeamento
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
