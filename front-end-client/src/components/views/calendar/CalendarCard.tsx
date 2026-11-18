import React, { useState } from 'react';
import { CalendarItem, CalendarCardFields } from '../../../templates/CalendarTemplate';
import { X, Copy, Check } from 'lucide-react';

interface CalendarCardProps {
  item: CalendarItem;
  fields: CalendarCardFields;
  formattedDate: string;
  realTodayStr: string;
  viewMode: 'month' | 'week' | 'day';
  handleDragStart: (e: React.DragEvent, item: any) => void;
  onCardClick?: (id: string, item: CalendarItem) => void;
  onClearDate?: (item: CalendarItem) => void;
}

const maskCpf = (clean: string) => `***.${clean.substring(3, 6)}.${clean.substring(6, 9)}-**`;
const maskCnpj = (clean: string) => `**.***.${clean.substring(5, 8)}/0001-**`;
const MASKS: Record<number, (s: string) => string> = {
  11: maskCpf,
  14: maskCnpj
};
const maskDocument = (doc?: string) => {
  if (!doc) return '';
  const clean = doc.replace(/\D/g, '');
  const applyMask = MASKS[clean.length];
  return applyMask ? applyMask(clean) : doc;
};

export const CalendarCard: React.FC<CalendarCardProps> = ({
  item, fields, formattedDate, realTodayStr, viewMode, handleDragStart, onCardClick, onClearDate
}) => {
  const isUncategorized = formattedDate === 'uncategorized';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processNumber = item[fields.processNumber];
  const itemName = fields.name ? item[fields.name] : null;
  const cpfCnpj = fields.cpfCnpj ? item[fields.cpfCnpj] : null;

  if (viewMode === 'month') {
    return (
      <button 
        type="button"
        draggable
        onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, item); }}
        onClick={(e) => { e.stopPropagation(); onCardClick?.(item._id || item.id, item); }}
        className="w-full text-left bg-white group px-2 py-1.5 mb-1 rounded-md shadow-sm border border-[var(--color-border-default)] hover:shadow-md hover:border-[var(--color-brand-main)]/40 cursor-pointer flex flex-col gap-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]/50 relative overflow-hidden"
      >
        <div 
           className="absolute left-0 top-0 bottom-0 w-1" 
           style={{ backgroundColor: isUncategorized ? 'var(--color-border-default)' : (formattedDate < realTodayStr ? 'var(--color-status-error)' : formattedDate === realTodayStr ? 'var(--color-status-warning)' : 'var(--color-status-success)') }}
        />
        <div className="flex items-center justify-between gap-1 overflow-hidden w-full pl-2">
          <div className="text-[10px] font-bold text-[var(--color-brand-main)] tracking-wide uppercase truncate flex-1" title={processNumber}>
            {processNumber || 'Sem Processo'}
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {processNumber && (
              <button
                className="text-gray-400 hover:text-[var(--color-brand-main)] opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                onClick={(e) => handleCopy(e, processNumber, `proc_${item.id}`)}
                title="Copiar Processo"
                type="button"
              >
                {copiedId === `proc_${item.id}` ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
              </button>
            )}
            {onClearDate && !isUncategorized && (
               <button
                 onClick={(e) => { e.stopPropagation(); onClearDate(item); }}
                 className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                 title="Redefinir Data"
                 type="button"
               >
                 <X size={10} />
               </button>
            )}
          </div>
        </div>
        {itemName && (
          <div className="text-[10px] text-[var(--color-content-secondary)] truncate w-full pl-2 font-medium" title={itemName}>
            {itemName}
          </div>
        )}
      </button>
    );
  }

  if (viewMode === 'week') {
    return (
      <button 
        type="button"
        draggable
        onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, item); }}
        onClick={(e) => { e.stopPropagation(); onCardClick?.(item._id || item.id, item); }}
        className="w-full text-left bg-white group p-3 mb-2 rounded-md shadow-sm border border-[var(--color-border-default)] hover:shadow-md hover:border-[var(--color-brand-main)]/40 cursor-pointer flex flex-col gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]/50 relative overflow-hidden"
      >
        <div 
           className="absolute left-0 top-0 bottom-0 w-1.5" 
           style={{ backgroundColor: isUncategorized ? 'var(--color-border-default)' : (formattedDate < realTodayStr ? 'var(--color-status-error)' : formattedDate === realTodayStr ? 'var(--color-status-warning)' : 'var(--color-status-success)') }}
        />
        <div className="flex items-center justify-between gap-1 overflow-hidden w-full pl-3">
          <div className="font-bold tracking-wide text-[11px] text-[var(--color-brand-main)] uppercase truncate flex-1" title={processNumber}>
            {processNumber || 'Sem Processo'}
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {processNumber && (
              <button
                className="text-gray-400 hover:text-[var(--color-brand-main)] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                onClick={(e) => handleCopy(e, processNumber, `proc_${item.id}`)}
                title="Copiar Processo"
                type="button"
              >
                {copiedId === `proc_${item.id}` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            )}
            {onClearDate && !isUncategorized && (
               <button
                 onClick={(e) => { e.stopPropagation(); onClearDate(item); }}
                 className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                 title="Redefinir Data"
                 type="button"
               >
                 <X size={12} />
               </button>
            )}
          </div>
        </div>
        {itemName && (
          <div className="text-xs text-[var(--color-content-primary)] font-medium leading-snug line-clamp-2 w-full pl-3" title={itemName}>
             {itemName} 
          </div>
        )}
        {cpfCnpj && (
          <div className="text-[10px] text-[var(--color-content-secondary)] truncate w-full pl-3 mt-1 opacity-80" title={cpfCnpj}>
             DOC: {maskDocument(cpfCnpj)}
          </div>
        )}
      </button>
    );
  }

  return (
    <button 
      type="button"
      draggable
      onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, item); }}
      onClick={(e) => { e.stopPropagation(); onCardClick?.(item._id || item.id, item); }}
      className="w-full text-left bg-[var(--color-content-inverse)] group p-3 rounded-lg shadow border border-r-[var(--color-border-default)] border-y-[var(--color-border-default)] hover:border-r-[var(--color-brand-main)]/50 hover:border-y-[var(--color-brand-main)]/50 cursor-pointer flex flex-col gap-1 transition-all border-l-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]"
      style={{ borderLeftColor: isUncategorized ? 'var(--color-border-default)' : (formattedDate < realTodayStr ? 'var(--color-status-error)' : formattedDate === realTodayStr ? 'var(--color-status-warning)' : 'var(--color-status-success)') }}
    >
      <div className="flex items-center justify-between gap-2 overflow-hidden w-full mb-1">
        <div className="font-semibold text-xs text-[var(--color-content-primary)] truncate flex-1" title={processNumber}>
          {processNumber || 'Sem Processo'}
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {processNumber && (
            <button
              className="text-gray-400 hover:text-[var(--color-brand-main)] opacity-0 group-hover:opacity-100 transition-opacity p-1"
              onClick={(e) => handleCopy(e, processNumber, `proc_${item.id}`)}
              title="Copiar Processo"
              type="button">
              {copiedId === `proc_${item.id}` ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            </button>
          )}
          {onClearDate && !isUncategorized && (
             <button
               onClick={(e) => { e.stopPropagation(); onClearDate(item); }}
               className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
               title="Redefinir Data"
               type="button">
               <X size={13} />
             </button>
          )}
        </div>
      </div>
      {itemName && (
        <div className="text-[11px] text-[var(--color-content-secondary)] truncate w-full" title={itemName}>
           {itemName} 
        </div>
      )}
      {cpfCnpj && (
        <div className="flex items-center justify-between gap-1 overflow-hidden w-full mt-1">
          <div className="text-[11px] text-gray-500 font-mono truncate flex-1 border border-gray-100 bg-gray-50 px-1.5 py-0.5 rounded" title={maskDocument(cpfCnpj)}>
             {maskDocument(cpfCnpj)}
          </div>
          <button
            className="text-gray-400 hover:text-[var(--color-brand-main)] opacity-0 group-hover:opacity-100 transition-opacity p-1"
            onClick={(e) => handleCopy(e, cpfCnpj, `doc_${item.id}`)}
            title="Copiar Documento"
            type="button">
            {copiedId === `doc_${item.id}` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          </button>
        </div>
      )}
    </button>
  );
};

