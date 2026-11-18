import React, { useMemo, useState } from 'react';
import { KanbanCardFields } from './KanbanTemplate';
import { AlertCircle, Clock, ChevronLeft, ChevronRight, Check, Copy } from 'lucide-react';

export interface SlaTemplateProps {
  items: any[];
  getCardFields: (item: any) => KanbanCardFields;
  onCardClick?: (id: string, item: any) => void;
  isLoading?: boolean;
}

const getNestedValue = (obj: any, path: string | undefined): any => {
  if (!obj || !path) return undefined;
  if (path in obj) return obj[path];
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const parseDateValue = (val: any): Date | null => {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'object') {
    if (val.seconds !== undefined) return new Date(val.seconds * 1000);
    if (val instanceof Date) return val;
    if (typeof val.toDate === 'function') return val.toDate();
  }
  const str = String(val);
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return null;
};

export const SlaTemplate: React.FC<SlaTemplateProps> = ({
  items,
  getCardFields,
  onCardClick,
  isLoading
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskDocument = (doc?: string) => {
    if (!doc) return '';
    const strDoc = String(doc);
    const clean = strDoc.replace(/\D/g, '');
    if (clean.length === 11) {
      return `***.${clean.substring(3, 6)}.${clean.substring(6, 9)}-**`;
    }
    if (clean.length === 14) {
      return `**.***.${clean.substring(5, 8)}/0001-**`;
    }
    return strDoc;
  };

  const slaItems = useMemo(() => {
    return items.map(item => {
      const fields = getCardFields(item);
      const startDateVal = getNestedValue(item, fields.slaStartDateField);
      let startDate = null;
      let duration = fields.slaDurationDays || 0;
      let progress = 0;
      let elapsedDays = 0;

      if (fields.slaStartDateField && duration > 0 && startDateVal) {
        startDate = parseDateValue(startDateVal);
        if (startDate) {
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - startDate.getTime());
          elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          progress = Math.min(100, Math.floor((elapsedDays / duration) * 100));
        }
      }

      return {
        original: item,
        fields,
        startDate,
        duration,
        progress,
        elapsedDays,
        hasSlaConfig: !!(fields.slaStartDateField && duration > 0 && startDate)
      };
    }).sort((a, b) => b.progress - a.progress);
  }, [items, getCardFields]);

  const hasConfiguration = items.length > 0 && 
    (getCardFields(items[0]).slaStartDateField && getCardFields(items[0]).slaDurationDays);

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--color-content-tertiary)]">Carregando SLA...</div>;
  }

  if (!hasConfiguration && items.length > 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-[var(--color-background-main)]">
        <div className="text-center bg-[var(--color-background-light)] p-8 rounded-lg border border-[var(--color-border-default)] shadow-sm max-w-md">
          <h3 className="font-semibold text-lg text-[var(--color-content-primary)] mb-2">SLA não Configurado</h3>
          <p className="text-sm text-[var(--color-content-secondary)]">
            Para utilizar a visualização SLA, você precisa mapear o <strong>Campo Data de Início</strong> e a <strong>Duração Total (Dias)</strong> nas configurações desta coleção.
          </p>
        </div>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress > 90) return 'bg-red-500';
    if (progress > 50) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const filteredItems = useMemo(() => slaItems.filter(item => item.hasSlaConfig), [slaItems]);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col h-full w-full">
      <div className="flex-1 overflow-auto p-6 hidden-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          {currentItems.map((itemData, index) => {
            const { original, fields, progress, elapsedDays, duration, startDate } = itemData;
            const processNumber = getNestedValue(original, fields.processNumber);
            const name = getNestedValue(original, fields.name);

            return (
              <button 
                type="button"
                key={original.id || original._id || index}
                onClick={() => onCardClick?.(original.id || original._id, original)}
                className="w-full text-left bg-white p-4 rounded-lg border border-[var(--color-border-default)] shadow-sm hover:shadow-md hover:border-[var(--color-brand-main)]/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]/50 group"
              >
                <div className="md:w-1/3 flex flex-col space-y-1">
                   <div className="flex items-center justify-between w-full group/proc relative z-10">
                      {processNumber ? (
                         <>
                           <h4 className="font-bold text-[10px] text-[var(--color-brand-main)] uppercase tracking-wider truncate">
                             {processNumber}
                           </h4>
                           <button type="button"
                             className="opacity-0 group-hover/proc:opacity-100 p-0.5 text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0 rounded"
                             onClick={(e) => handleCopy(e, processNumber, `proc_${original.id || original._id}`)}
                             title="Copiar número do processo"
                           >
                             {copiedId === `proc_${original.id || original._id}` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                           </button>
                         </>
                      ) : (
                         <span className="font-bold text-[10px] text-[var(--color-content-tertiary)] italic">S/ PROCESSO</span>
                      )}
                   </div>
                   
                   {name && (
                     <h4 className="font-medium text-xs text-[var(--color-content-primary)] truncate" title={name}>
                       {name}
                     </h4>
                   )}
                   
                   {fields.cpfCnpj && original[fields.cpfCnpj] && (
                     <div className="text-[10px] text-[var(--color-content-secondary)] flex items-center group/copy hover:bg-[var(--color-background-light)] -mx-1.5 px-1.5 rounded transition-colors py-0.5 relative z-10 w-fit">
                       <span className="font-medium mr-1">DOC:</span> {maskDocument(original[fields.cpfCnpj])}
                       <button type="button"
                         className="opacity-0 group-hover/copy:opacity-100 ml-1 text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0"
                         onClick={(e) => handleCopy(e, original[fields.cpfCnpj!], `doc_${original.id || original._id}`)}
                         title="Copiar Documento"
                       >
                         {copiedId === `doc_${original.id || original._id}` ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                       </button>
                     </div>
                   )}
                </div>
                <div className="md:w-2/3 flex flex-col justify-center w-full relative">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-content-secondary)] mb-1.5">
                     <span>{elapsedDays} dias (Consumido)</span>
                     <span>Total: {duration} dias</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 border border-gray-200 relative">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                    <div className="absolute top-[-3px] bottom-[-3px] w-[1px] bg-[var(--color-border-default)]" style={{ left: '50%' }} title="50%"></div>
                    <div className="absolute top-[-3px] bottom-[-3px] w-[1px] bg-red-300" style={{ left: '90%' }} title="90%"></div>
                  </div>
                </div>
              </button>
            );
        })}
        
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border-default)] pt-4">
          <div className="text-xs text-[var(--color-content-secondary)]">
            Mostrando <span className="font-semibold text-[var(--color-content-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-semibold text-[var(--color-content-primary)]">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> de <span className="font-semibold text-[var(--color-content-primary)]">{filteredItems.length}</span> registros
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-[var(--color-border-default)] text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-xs font-semibold px-2 py-1 bg-[var(--color-background-light)] rounded-md border border-[var(--color-border-default)] text-[var(--color-content-primary)]">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-[var(--color-border-default)] text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
