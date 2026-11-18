import React, { useMemo, useState } from 'react';
import { KanbanCardFields } from './KanbanTemplate';
import { Maximize2, Minimize2, Check, Copy } from 'lucide-react';

export interface PriorityMatrixTemplateProps {
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

export const PriorityMatrixTemplate: React.FC<PriorityMatrixTemplateProps> = ({
  items,
  getCardFields,
  onCardClick,
  isLoading
}) => {
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(null);
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

  const quadrants = useMemo(() => {
    const q: Record<string, any[]> = {
      'Máxima': [],
      'Alta': [],
      'Média': [],
      'Baixa': [],
      'Não Classificado': []
    };

    items.forEach(item => {
      const fields = getCardFields(item);
      let classification = getNestedValue(item, fields.priorityQuadrantField);
      
      if (!classification || typeof classification !== 'string') {
        q['Não Classificado'].push({ item, fields });
      } else {
        const cLower = classification.toLowerCase().trim();
        if (cLower.includes('máxima') || cLower.includes('maxima')) q['Máxima'].push({ item, fields });
        else if (cLower.includes('alta')) q['Alta'].push({ item, fields });
        else if (cLower.includes('média') || cLower.includes('media')) q['Média'].push({ item, fields });
        else if (cLower.includes('baixa')) q['Baixa'].push({ item, fields });
        else q['Não Classificado'].push({ item, fields });
      }
    });

    return q;
  }, [items, getCardFields]);

  const hasConfiguration = items.length > 0 && getCardFields(items[0]).priorityQuadrantField;

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--color-content-tertiary)]">Carregando Matriz...</div>;
  }

  if (!hasConfiguration && items.length > 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-[var(--color-background-main)]">
        <div className="text-center bg-[var(--color-background-light)] p-8 rounded-lg border border-[var(--color-border-default)] shadow-sm max-w-md">
          <h3 className="font-semibold text-lg text-[var(--color-content-primary)] mb-2">Matriz não Configurada</h3>
          <p className="text-sm text-[var(--color-content-secondary)]">
            Para utilizar a visualização em Matriz, você precisa mapear o campo de classificação (Máxima, Alta, Média, Baixa) nas configurações desta coleção.
          </p>
        </div>
      </div>
    );
  }

  const renderCard = (cardData: any) => {
    const { item, fields } = cardData;
    const processNumber = getNestedValue(item, fields.processNumber);
    const name = getNestedValue(item, fields.name);
    const cpfCnpj = getNestedValue(item, fields.cpfCnpj);
    const description = getNestedValue(item, fields.priorityDescriptionField);

    return (
      <button 
        type="button"
        key={item.id || item._id}
        onClick={() => onCardClick?.(item.id || item._id, item)}
        className="w-full text-left bg-white p-3.5 rounded-lg border border-[var(--color-border-default)] shadow-sm hover:shadow-md hover:border-[var(--color-brand-main)]/30 transition-all cursor-pointer group flex flex-col space-y-2 mb-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]/50"
      >
        <div className="flex items-center justify-between w-full group/proc relative z-10">
          {processNumber ? (
             <>
               <h4 className="font-bold text-[10px] text-[var(--color-brand-main)] uppercase tracking-wider truncate">
                 {processNumber}
               </h4>
               <button type="button"
                 className="opacity-0 group-hover/proc:opacity-100 p-0.5 text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0 rounded"
                 onClick={(e) => handleCopy(e, processNumber, `proc_${item.id || item._id}`)}
                 title="Copiar número do processo"
               >
                 {copiedId === `proc_${item.id || item._id}` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
               </button>
             </>
          ) : (
             <span className="font-bold text-[10px] text-[var(--color-content-tertiary)] italic">S/ PROCESSO</span>
          )}
        </div>
        
        {name && (
          <h4 className="font-medium text-xs text-[var(--color-content-primary)] leading-snug line-clamp-2" title={name}>
            {name}
          </h4>
        )}
        
        {cpfCnpj && (
          <div className="text-[10px] text-[var(--color-content-secondary)] flex items-center group/copy hover:bg-[var(--color-background-light)] -mx-1.5 px-1.5 rounded transition-colors py-0.5 relative z-10 w-fit">
            <span className="font-medium mr-1">DOC:</span> {maskDocument(cpfCnpj)}
            <button type="button"
              className="opacity-0 group-hover/copy:opacity-100 ml-1 text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0"
              onClick={(e) => handleCopy(e, cpfCnpj, `doc_${item.id || item._id}`)}
              title="Copiar Documento"
            >
              {copiedId === `doc_${item.id || item._id}` ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
            </button>
          </div>
        )}
        
        {description && (
          <div className="text-[10px] text-[var(--color-content-secondary)] mt-1.5 bg-[var(--color-background-light)] px-2 py-1.5 rounded line-clamp-3">
            {description}
          </div>
        )}
      </button>
    );
  };

  const renderQuadrant = (title: string, data: any[], colorClass: string, bgClass: string, index: number) => {
    if (expandedQuadrant !== null && expandedQuadrant !== title) return null;

    const isExpanded = expandedQuadrant === title;
    const borderClass = isExpanded ? '' : 
      index === 0 ? 'border-r border-[var(--color-border-default)]' :
      index === 1 ? 'border-r border-[var(--color-border-default)]' :
      index === 2 ? 'border-r border-[var(--color-border-default)]' : '';

    return (
      <div className={`flex flex-col min-h-0 overflow-hidden bg-[var(--color-background-main)] ${borderClass} ${isExpanded ? 'col-span-full row-span-full rounded-xl border border-[var(--color-border-default)]' : ''}`}>
        <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${bgClass}`}>
          <div className="flex items-center space-x-3">
            <h3 className={`font-bold text-[11px] uppercase tracking-wider ${colorClass}`}>{title}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-sm text-gray-700">
              {data.length}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setExpandedQuadrant(isExpanded ? null : title); }}
            className={`p-1 rounded transition-colors ${colorClass} hover:bg-white/50`}
            title={isExpanded ? "Restaurar visão" : "Expandir"}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
        <div className="flex-1 p-3 overflow-y-auto hidden-scrollbar min-h-0 bg-transparent">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[var(--color-content-tertiary)] italic opacity-60">
              Nenhum registro
            </div>
          ) : (
            <>
              {data.slice(0, 50).map(renderCard)}
              {data.length > 50 && (
                <div className="text-center py-2 text-[10px] text-[var(--color-content-tertiary)] bg-black/5 rounded mt-2">
                  Exibindo 50 de {data.length} itens (Limite de exibição para performance)
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden min-h-0">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col h-full w-full min-h-0 overflow-x-auto custom-scrollbar">
        <div className={`grid grid-cols-[repeat(4,minmax(280px,1fr))] h-full flex-1 min-h-0`}>
          {renderQuadrant('Máxima', quadrants['Máxima'], 'text-red-800', 'bg-red-100 border-red-200', 0)}
          {renderQuadrant('Alta', quadrants['Alta'], 'text-orange-800', 'bg-orange-100 border-orange-200', 1)}
          {renderQuadrant('Média', quadrants['Média'], 'text-yellow-800', 'bg-yellow-100 border-yellow-200', 2)}
          {renderQuadrant('Baixa', quadrants['Baixa'], 'text-green-800', 'bg-green-100 border-green-200', 3)}
        </div>
      </div>
    </div>
  );
};
