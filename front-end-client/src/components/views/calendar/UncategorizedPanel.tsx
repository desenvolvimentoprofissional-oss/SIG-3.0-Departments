import React from 'react';
import { CalendarItem, CalendarCardFields } from '../../../templates/CalendarTemplate';

interface UncategorizedPanelProps {
  uncategorizedItems: any[];
  handleDragStart: (e: React.DragEvent, item: any) => void;
  onCardClick?: (id: string, item: CalendarItem) => void;
  getCardFields: (item: CalendarItem) => CalendarCardFields;
}

export const UncategorizedPanel: React.FC<UncategorizedPanelProps> = ({
  uncategorizedItems, handleDragStart, onCardClick, getCardFields
}) => {
  if (!uncategorizedItems || uncategorizedItems.length === 0) return null;

  return (
     <div className="p-4 border-t border-[var(--color-border-default)] bg-[var(--color-background-light)]/50">
       <h3 className="text-xs font-bold uppercase text-[var(--color-content-secondary)] mb-3">Sem Data Definida</h3>
       <div className="flex overflow-x-auto space-x-3 pb-2 custom-scrollbar">
         {uncategorizedItems.map(item => {
           const fields = getCardFields(item);
           return (
             <button
               key={item._id || item.id}
               type="button"
               draggable
               onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, item); }}
               onClick={(e) => { e.stopPropagation(); onCardClick?.(item._id || item.id, item); }}
               className="flex-shrink-0 w-48 bg-[var(--color-content-inverse)] p-2 rounded shadow-sm border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)]/50 cursor-pointer text-xs font-semibold text-[var(--color-content-primary)] truncate text-center"
             >
               {item[fields.processNumber] || 'Sem Processo'}
             </button>
           );
         })}
       </div>
     </div>
  );
};
