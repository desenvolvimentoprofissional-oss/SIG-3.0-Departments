import React, { useRef } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import { KanbanItem, KanbanCardFields } from '../../../templates/KanbanTemplate';
import { useVirtualizer } from '@tanstack/react-virtual';

interface KanbanColumnProps {
  colName: string;
  colItems: KanbanItem[];
  isCollapsed: boolean;
  isCustom: boolean;
  cardCustomCols: Record<string, string>;
  toggleCollapse: (colName: string) => void;
  handleDragStart: (e: React.DragEvent, type: 'item' | 'column', id: string, sourceCol?: string) => void;
  handleDrop: (e: React.DragEvent, targetCol: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDeleteCustomCol: (e: React.MouseEvent, colName: string) => void;
  getCardFields: (item: KanbanItem) => KanbanCardFields;
  setCardCustomCols: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onCardClick?: (id: string, item: KanbanItem) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  colName, colItems, isCollapsed, isCustom, cardCustomCols,
  toggleCollapse, handleDragStart, handleDrop, handleDragOver,
  handleDeleteCustomCol, getCardFields, setCardCustomCols, onCardClick
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: colItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 3,
  });

  return (
    <div
      className={`flex-shrink-0 flex flex-col h-full transition-all duration-300 ease-in-out w-[280px] min-w-[280px] max-w-[280px] ${isCollapsed ? '!w-[60px] !min-w-[60px] !max-w-[60px]' : ''} bg-transparent`}
      draggable
      onDragStart={(e) => handleDragStart(e, 'column', colName)}
      onDrop={(e) => handleDrop(e, colName)}
      onDragOver={handleDragOver}
    >
      <button 
        type="button" 
        className={`px-3 py-2.5 mx-1 flex items-center justify-between bg-transparent hover:bg-[var(--color-border-default)]/50 transition-colors shrink-0 group cursor-pointer text-left rounded-md mb-2`} 
        onClick={() => toggleCollapse(colName)} 
        title={isCollapsed ? "Expandir coluna" : "Recolher coluna"}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center w-full mt-2">
            <span className="bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] text-[10px] px-2 py-0.5 rounded-full font-bold mb-3">{colItems.length}</span>
            <span className="font-bold text-[11px] tracking-widest text-[var(--color-content-tertiary)] uppercase whitespace-nowrap mb-3" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              {colName}
            </span>
            <ChevronRight size={14} className="text-[var(--color-content-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 truncate">
              <h3 className="font-semibold text-xs text-[var(--color-content-primary)] truncate" title={colName}>{colName}</h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] text-[var(--color-content-secondary)] shrink-0">{colItems.length}</span>
              {isCustom && <span className="text-[9px] bg-[var(--color-secondary-main)]/10 text-[var(--color-secondary-main)] px-1.5 py-0.5 rounded font-medium uppercase shrink-0">Custom</span>}
            </div>
            <div className="flex items-center shrink-0">
               {isCustom && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomCol(e, colName); }} className="opacity-0 group-hover:opacity-100 text-[var(--color-content-tertiary)] hover:text-red-500 transition-opacity ml-2 mr-1" title="Excluir Coluna Customizada">
                     <Trash2 size={13} />
                  </button>
               )}
               <ChevronLeft size={14} className="text-[var(--color-content-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </>
        )}
      </button>

      {!isCollapsed && (
        <div 
           className="flex-1 px-2 overflow-y-auto hidden-scrollbar min-h-0 bg-transparent flex flex-col"
           ref={parentRef}
        >
           <div
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
              className="relative w-full"
           >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const item = colItems[virtualRow.index];
                return (
                  <div
                    key={item.id || virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       width: '100%',
                       transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <div className="pb-2 w-full">
                      <KanbanCard
                         item={item}
                         fields={getCardFields(item)}
                         cardCustomCols={cardCustomCols}
                         colName={colName}
                         setCardCustomCols={setCardCustomCols}
                         handleDragStart={handleDragStart}
                         onCardClick={onCardClick}
                      />
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}
    </div>
  );
};
