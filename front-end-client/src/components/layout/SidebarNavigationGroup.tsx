import React, { useState, useEffect } from 'react';
import { Database, Network, Webhook, BarChart3, Folders, FileText, ChevronDown, Image as ImageIcon, History, GripVertical, TableProperties } from 'lucide-react';
import { DepartmentNode } from '../../lib/taxonomia-icones';
import { PageMapping } from '../../types/index';
import { useAuthStore } from '../../store/authStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSortedMappings, saveSortedMappings } from '../../lib/order.util';
import { formatPageName } from '../../lib/title.util';

interface SidebarNavigationGroupProps {
  areaName: string;
  depts: DepartmentNode[];
  isSidebarOpen: boolean;
  currentView: string;
  setCurrentView: (v: string) => void;
  handleMouseEnter: (e: React.MouseEvent, text: string) => void;
  handleMouseLeave: () => void;
  mappings: PageMapping[];
  isPrimary?: boolean;
}

const SortablePageItem = ({ m, isPageActive, isSidebarOpen, setCurrentView, handleMouseEnter, handleMouseLeave, deptId, getPageIcon }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const DisplayIcon = getPageIcon(m.pageType);

  return (
    <div ref={setNodeRef} style={style} className={`relative flex items-center group/item ${isDragging ? 'opacity-50' : ''}`}>
      {isSidebarOpen && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute left-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity z-10 p-1"
          title="Arraste para reordenar"
        >
          <GripVertical size={14} />
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); setCurrentView(`page_${deptId}_${m.id}`); }}
        onMouseEnter={!isSidebarOpen ? (e) => handleMouseEnter(e, formatPageName(m.pageName)) : undefined}
        onMouseLeave={!isSidebarOpen ? handleMouseLeave : undefined}
        className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none w-full ${
          isSidebarOpen ? 'mx-4 pl-8 pr-3' : 'ml-4 w-8 px-0 justify-center'
        } ${
          isPageActive 
             ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
             : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
        }`}
        title={!isSidebarOpen ? formatPageName(m.pageName) : undefined}
      >
        <DisplayIcon className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isPageActive ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'} ${isSidebarOpen ? 'w-[14px] h-[14px] mr-2' : 'w-4 h-4'}`} strokeWidth={1.625} />
        {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap truncate">{formatPageName(m.pageName)}</span>}
      </button>
    </div>
  );
};

export const SidebarNavigationGroup: React.FC<SidebarNavigationGroupProps> = ({
  areaName,
  depts,
  isSidebarOpen,
  currentView,
  setCurrentView,
  handleMouseEnter,
  handleMouseLeave,
  mappings,
  isPrimary = false
}) => {
  const { user } = useAuthStore();
  
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(
    depts.reduce((acc, d) => ({ ...acc, [d.id]: true }), {})
  );

  const [localMappingsState, setLocalMappingsState] = useState<Record<string, PageMapping[]>>({});

  useEffect(() => {
    const refreshState = () => {
      const newState: Record<string, PageMapping[]> = {};
      depts.forEach(dept => {
        const deptMappings = mappings.filter(m => m.departmentId === dept.id);
        newState[dept.id] = getSortedMappings(deptMappings, dept.id, user?.uid);
      });
      setLocalMappingsState(newState);
    };

    refreshState();

    const handleOrderChanged = (e: Event) => {
      refreshState();
    };

    window.addEventListener('mappings-order-changed', handleOrderChanged);
    return () => {
      window.removeEventListener('mappings-order-changed', handleOrderChanged);
    };
  }, [mappings, depts, user?.uid]);

  const toggleDept = (deptId: string) => {
    setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  };

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

  return (
    <>
      {areaName && (
        <div className={`mb-2 pt-4 first:pt-2 flex items-center min-h-[20px] ${isSidebarOpen ? 'px-7' : 'px-0 justify-center'}`}>
          {isSidebarOpen && <span className="text-[10px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider leading-none">{areaName}</span>}
        </div>
      )}
      
      {depts.map(dept => {
         const IconComponent = dept.icon;
         const isActive = currentView.startsWith(`page_${dept.id}_`) || (!currentView.startsWith('page_') && isPrimary);
         const deptMappings = localMappingsState[dept.id] || [];
         const isExpanded = expandedDepts[dept.id];
         
         return (
            <div key={dept.id} className="flex flex-col mb-1">
              <button 
                onClick={() => toggleDept(dept.id)}
                className={`flex items-center text-left h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
                  isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
                } ${
                  isActive
                    ? 'text-[var(--color-brand-main)] bg-transparent' 
                    : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
                }`}
                title={!isSidebarOpen ? dept.name : undefined}
                onMouseEnter={!isSidebarOpen ? (e) => handleMouseEnter(e, dept.name) : undefined}
                onMouseLeave={!isSidebarOpen ? handleMouseLeave : undefined}
              >
                <IconComponent className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
                {isSidebarOpen && <span className="flex-1 text-[13px] font-normal whitespace-nowrap ml-3 overflow-hidden text-ellipsis">{dept.name}</span>}
                {isSidebarOpen && deptMappings.length > 0 && (
                  <ChevronDown className={`shrink-0 transition-transform duration-300 opacity-40 ml-1 ${isExpanded ? 'rotate-180' : ''}`} size={14} strokeWidth={1.5} />
                )}
              </button>
              
              {isExpanded && deptMappings.length > 0 && (
                <div className="flex flex-col space-y-1 mt-1">
                  <DndContext 
                    id={`dnd-sidebar-${dept.id}`}
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => handleDragEnd(e, dept.id)}
                  >
                    <SortableContext 
                      items={deptMappings.map(m => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {deptMappings.map(m => {
                        const isPageActive = currentView === `page_${dept.id}_${m.id}`;
                        return (
                          <SortablePageItem 
                            key={`map_${m.id}`}
                            m={m}
                            isPageActive={isPageActive}
                            isSidebarOpen={isSidebarOpen}
                            setCurrentView={setCurrentView}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseLeave={handleMouseLeave}
                            deptId={dept.id}
                            getPageIcon={getPageIcon}
                          />
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
         );
      })}
    </>
  );
};
