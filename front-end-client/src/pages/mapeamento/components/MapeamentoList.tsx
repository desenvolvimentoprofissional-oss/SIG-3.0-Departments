import { useMappingStore } from "../../../store/mappingStore";
import React, { useMemo, useState, useEffect } from 'react';
import { PageMapping } from '../../../types/index';
import { DEPARTMENT_TAXONOMY } from '../../../lib/taxonomia-icones';
import { SummaryCard } from '../../../components/ui/SummaryCard';
import { Button } from '../../../components/ui/Button';
import { Database, ChevronDown, ChevronUp, Folders, BarChart3, Webhook, FileText, Image as ImageIcon, History, GripVertical, Trash2, TableProperties } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSortedMappings, saveSortedMappings } from '../../../lib/order.util';
import { formatPageName } from '../../../lib/title.util';

interface MapeamentoListProps {
  mappings: PageMapping[];
  onAddNew: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (departmentId: string, mappings: PageMapping[]) => void;
}

const getPageIcon = (pageType?: string) => {
    switch (pageType) {
      case 'CADASTRO': return Folders;
      case 'GALERIA': return ImageIcon;
      case 'INTEGRACAO': return Webhook;
      case 'LINHA_DO_TEMPO': return History;
      case 'METRICA': return TableProperties;
      case 'PROCESSO': return FileText;
      case 'RESULTADOS': return BarChart3;
      default: return Database;
    }
};

const getCollectionCount = (mapping: PageMapping) => {
  if (mapping.dataSources && mapping.dataSources.length > 0) {
    return mapping.dataSources.reduce((acc, ds) => {
      let count = ds.mainCollection ? 1 : 0;
      count += ds.relationalCollections?.length || 0;
      return acc + count;
    }, 0);
  }
  return mapping.collections?.length || 0;
};

const SortableMappingCard = ({ mapping, dept, onView, onDelete }: { mapping: PageMapping, dept: any, onView: (id: string) => void, onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: mapping.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const PageIcon = getPageIcon(mapping.pageType);

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(mapping.id);
          }}
          className="text-[var(--color-content-tertiary)] hover:text-[var(--color-status-error)] p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm transition-colors"
          title="Excluir mapeamento"
        >
          <Trash2 size={16} />
        </button>
        <div 
          {...attributes} 
          {...listeners}
          className="text-[var(--color-content-tertiary)] hover:text-[var(--color-content-primary)] cursor-grab active:cursor-grabbing p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>
      </div>
      <SummaryCard
        id={mapping.id}
        title={formatPageName(mapping.pageName)}
        subtitle={dept.name}
        icon={PageIcon}
        tags={[mapping.status === 'RASCUNHO' ? 'RASCUNHO' : 'PUBLICADO']}
        metrics={[
          {
            icon: Database,
            value: getCollectionCount(mapping),
            tooltip: 'Coleções Mapeadas'
          }
        ]}
        actionLabel="Configurar"
        onClick={() => onView(mapping.id)}
      />
    </div>
  );
};

const MappingGroup = ({ deptId, mappings, onView, onDelete, sensors, onDragEnd }: { deptId: string, mappings: PageMapping[], onView: (id: string) => void, onDelete: (id: string) => void, sensors: any, onDragEnd: (e: DragEndEvent, deptId: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dept = DEPARTMENT_TAXONOMY.find(d => d.id === deptId);
  if (!dept) return null;

  return (
    <div className="bg-white/50 rounded-2xl border border-[var(--color-border-default)] overflow-hidden">
      <button
        className="flex items-center justify-between w-full px-5 py-4 cursor-pointer text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] rounded-lg shrink-0">
             <dept.icon size={20} />
           </div>
           <div className="text-left flex-1">
             <h2 className="text-lg font-semibold text-[var(--color-content-primary)]">{dept.name}</h2>
             <p className="text-sm text-[var(--color-content-secondary)]">{mappings.length} mapeamentos</p>
           </div>
        </div>
        <div className="text-[var(--color-content-secondary)] shrink-0 ml-4">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      {isExpanded && (
        <div className="p-5 pt-0 border-t border-[var(--color-border-default)]">
          <DndContext 
            id={`dnd-mapeamento-${dept.id}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => onDragEnd(e, dept.id)}
          >
            <SortableContext 
              items={mappings.map(m => m.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch w-full mt-5">
                {mappings.map(mapping => (
                  <SortableMappingCard
                    key={mapping.id}
                    mapping={mapping}
                    dept={dept}
                    onView={onView}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export const MapeamentoList: React.FC<MapeamentoListProps> = ({ mappings, onAddNew, onView, onDelete }) => {
  const { user } = useAuthStore();
  const [localMappingsState, setLocalMappingsState] = useState<Record<string, PageMapping[]>>({});
  const mappingsOrderTimestamp = useMappingStore(state => state.mappingsOrderTimestamp);

  useEffect(() => {
    const refreshState = () => {
      const groups: Record<string, PageMapping[]> = {};
      mappings.forEach(m => {
        if (!groups[m.departmentId]) {
          groups[m.departmentId] = [];
        }
        groups[m.departmentId].push(m);
      });
      
      const newState: Record<string, PageMapping[]> = {};
      Object.keys(groups).forEach(key => {
        newState[key] = getSortedMappings(groups[key], key, user?.uid);
      });
      setLocalMappingsState(newState);
    };

    refreshState();
  }, [mappings, user?.uid, mappingsOrderTimestamp]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent, deptId: string) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLocalMappingsState(prev => {
        const items = prev[deptId] || [];
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        saveSortedMappings(reorderedItems, deptId, user?.uid);
        
        return {
          ...prev,
          [deptId]: reorderedItems
        };
      });
    }
  };

  if (mappings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-[var(--color-border-default)] rounded-xl mt-10">
        <Database size={48} className="text-[var(--color-content-tertiary)] mb-4" />
        <h3 className="text-lg font-semibold text-[var(--color-content-primary)]">Nenhum mapeamento criado</h3>
        <p className="text-sm text-[var(--color-content-secondary)] mt-1 text-center max-w-lg mb-6">
          Os mapeamentos definem quais coleções e campos do Firebase isolado de cada departamento serão sincronizados e exibidos no painel central.
        </p>
        <Button variant="secondary" onClick={onAddNew}>Criar o primeiro mapeamento</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {Object.entries(localMappingsState).sort(([deptIdA], [deptIdB]) => {
        const nameA = (DEPARTMENT_TAXONOMY.find(d => d.id === deptIdA)?.name || '').trim().toLowerCase();
        const nameB = (DEPARTMENT_TAXONOMY.find(d => d.id === deptIdB)?.name || '').trim().toLowerCase();
        return nameA.localeCompare(nameB, 'pt-BR', { numeric: true, sensitivity: 'base' });
      }).map(([deptId, deptMappings]) => (
        <MappingGroup 
          key={deptId} 
          deptId={deptId} 
          mappings={deptMappings} 
          onView={onView} 
          onDelete={onDelete}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};
