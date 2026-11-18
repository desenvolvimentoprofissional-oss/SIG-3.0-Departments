import React from 'react';
import { AddColumnCard } from '../components/views/kanban/AddColumnCard';
import { KanbanColumn } from '../components/views/kanban/KanbanColumn';
import { useGenericKanban } from '../hooks/useGenericKanban';

export interface KanbanCardFields {
  status: string;
  createdAt?: string;
  name: string;
  processNumber?: string;
  cpfCnpj?: string;
  responsibleEmail?: string;
  kanbanColumnField?: string;
  tagField?: string;
  priorityField?: string;
  avatarField?: string | null;
  priorityQuadrantField?: string;
  priorityDescriptionField?: string;
  slaStartDateField?: string;
  slaDurationDays?: number;
  tramiteTimeField?: string;
}

export interface KanbanItem {
  id: string;
  [key: string]: any;
}

export interface KanbanTemplateProps {
  items: KanbanItem[];
  getCardFields: (item: KanbanItem) => KanbanCardFields;
  onCardClick?: (id: string, item: KanbanItem) => void;
  isLoading?: boolean;
  defaultColumns?: string[];
}

export const KanbanTemplate: React.FC<KanbanTemplateProps> = ({ 
  items, 
  getCardFields, 
  onCardClick,
  isLoading,
  defaultColumns = []
}) => {
  const {
    collapsedCols, customColumns, cardCustomCols, setCardCustomCols, setCustomColumns,
    isAddingCol, setIsAddingCol, newColName, setNewColName, columnOrder,
    kanbanColumns, toggleCollapse, handleDragStart, handleDrop,
    handleDragOver, handleDeleteCustomCol
  } = useGenericKanban(items, getCardFields, defaultColumns);

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--color-content-tertiary)]">Carregando Kanban...</div>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden min-h-0">
      <div className="bg-[var(--color-background-main)] rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col h-full w-full min-h-0">
        <div className="flex h-full flex-1 min-h-0 w-full overflow-x-auto custom-scrollbar divide-x divide-[var(--color-border-default)]">
             {columnOrder.map((colName, index) => {
               const isLast = index === columnOrder.length - 1;
               if (colName === '__ADD_COLUMN__') {
                  return (
                    <AddColumnCard
                      key="__ADD_COLUMN__"
                      isAddingCol={isAddingCol}
                      setIsAddingCol={setIsAddingCol}
                      newColName={newColName}
                      setNewColName={setNewColName}
                      customColumns={customColumns}
                      setCustomColumns={setCustomColumns}
                      handleDragStart={handleDragStart}
                      handleDrop={handleDrop}
                      handleDragOver={handleDragOver}
                    />
                  );
               }

               if (!kanbanColumns.has(colName)) return null;
               const colItems = kanbanColumns.get(colName)!;
               const isCollapsed = collapsedCols.has(colName);
               const isCustom = customColumns.includes(colName);

               return (
                 <KanbanColumn
                   key={colName}
                   colName={colName}
                   colItems={colItems}
                   isCollapsed={isCollapsed}
                   isCustom={isCustom}
                   cardCustomCols={cardCustomCols}
                   toggleCollapse={toggleCollapse}
                   handleDragStart={handleDragStart}
                   handleDrop={handleDrop}
                   handleDragOver={handleDragOver}
                   handleDeleteCustomCol={handleDeleteCustomCol}
                   getCardFields={getCardFields}
                   setCardCustomCols={setCardCustomCols}
                   onCardClick={onCardClick}
                 />
               );
            })}
         </div>
      </div>
    </div>
  );
};

