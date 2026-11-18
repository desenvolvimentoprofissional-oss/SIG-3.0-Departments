import React from 'react';
import { Plus, X } from 'lucide-react';

interface AddColumnCardProps {
  isAddingCol: boolean;
  setIsAddingCol: (val: boolean) => void;
  newColName: string;
  setNewColName: (val: string) => void;
  customColumns: string[];
  setCustomColumns: (cols: string[]) => void;
  handleDragStart: (e: React.DragEvent, type: 'item' | 'column', id: string) => void;
  handleDrop: (e: React.DragEvent, targetCol: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
}

export const AddColumnCard: React.FC<AddColumnCardProps> = ({
  isAddingCol, setIsAddingCol, newColName, setNewColName,
  customColumns, setCustomColumns,
  handleDragStart, handleDrop, handleDragOver
}) => {
  const handleAddCol = () => {
    if (newColName.trim()) {
      const col = newColName.trim().toUpperCase();
      if (!customColumns.includes(col)) {
        setCustomColumns([...customColumns, col]);
      }
    }
    setNewColName('');
    setIsAddingCol(false);
  };

  return (
    <div 
      draggable
      onDragStart={(e) => handleDragStart(e, 'column', '__ADD_COLUMN__')}
      onDrop={(e) => handleDrop(e, '__ADD_COLUMN__')}
      onDragOver={handleDragOver}
      className={`flex-shrink-0 flex flex-col h-full border-r border-[var(--color-border-default)] transition-all duration-300 ease-in-out ${isAddingCol ? 'w-[320px] bg-gray-50/50' : 'w-14 bg-transparent'}`}
    >
       {!isAddingCol ? (
          <button type="button" className="hover:bg-[var(--color-brand-main)]/5 p-3 flex flex-col items-center justify-start cursor-pointer w-full h-full group" onClick={() => setIsAddingCol(true)} title="Adicionar Coluna Customizada">
             <Plus size={16} className="text-[var(--color-content-tertiary)] group-hover:text-[var(--color-brand-main)] mb-4 mt-2 transition-colors" />
             <span className="font-bold text-[11px] tracking-widest text-[var(--color-content-tertiary)] group-hover:text-[var(--color-brand-main)] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Nova Coluna
             </span>
          </button>
       ) : (
          <div className="flex-1 overflow-y-auto p-4 hidden-scrollbar w-[320px]">
             <div className="bg-white border border-[var(--color-border-default)] rounded-xl p-4 flex flex-col shadow-sm border-b-2 border-b-[var(--color-secondary-main)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-[11px] tracking-wider text-[var(--color-content-primary)] uppercase">Nova Coluna</span>
                  <button onClick={() => setIsAddingCol(false)} className="text-[var(--color-content-tertiary)] p-1 rounded-full hover:bg-black/5 hover:text-[var(--color-content-primary)]">
                    <X size={14} />
                  </button>
                </div>
                <input 
                  type="text"
                  value={newColName}
                  onChange={e => setNewColName(e.target.value.toUpperCase())}
                  placeholder="NOME DA COLUNA"
                  className="px-3 py-1.5 text-xs border border-[var(--color-border-default)] rounded outline-none focus:border-[var(--color-brand-main)]  mb-3 bg-white w-full uppercase"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newColName.trim()) {
                      handleAddCol();
                    } else if (e.key === 'Escape') {
                      setIsAddingCol(false);
                    }
                  }}
                />
                <button 
                  onClick={handleAddCol}
                  disabled={!newColName.trim()}
                  className="w-full py-1.5 bg-[var(--color-brand-main)] text-white text-[11px] font-bold tracking-wider uppercase rounded hover:bg-[var(--color-brand-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
             </div>
          </div>
       )}
    </div>
  );
};
