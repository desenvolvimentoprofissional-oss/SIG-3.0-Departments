import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

export const SortableWidgetCard = ({ 
  widget, 
  selectedWidgetId, 
  setSelectedWidgetId, 
  handleRemoveWidget, 
  getWidgetIcon, 
  availableCollections 
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    gridColumn: `span ${widget.layout.w}`
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 bg-white transition-all duration-200 ${
        selectedWidgetId === widget.id 
          ? 'border-[var(--color-brand-main)] ring-2 ring-[var(--color-brand-light)] shadow-md' 
          : 'border-[var(--color-border-default)] hover:border-gray-400 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <button 
          type="button"
          aria-label={`Selecionar widget ${widget.title}`}
          className="flex items-center space-x-2 text-[var(--color-content-main)] cursor-grab active:cursor-grabbing flex-1 text-left bg-transparent border-none p-0 focus:outline-none"
          {...attributes} 
          {...listeners}
          onClick={() => setSelectedWidgetId(widget.id)}
        >
          {getWidgetIcon(widget.type)}
          <span className="font-medium text-sm select-none">{widget.title}</span>
        </button>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); handleRemoveWidget(widget.id); }}
          className="text-gray-400 hover:text-red-500 ml-2"
          title="Remover Widget"
          aria-label={`Remover widget ${widget.title}`}
        >
          <X size={14} />
        </button>
      </div>
      
      
      <button 
        type="button"
        aria-label={`Visualizar widget ${widget.title}`}
        onClick={() => setSelectedWidgetId(widget.id)}
        className="h-32 rounded border border-dashed flex flex-col items-center justify-center text-xs text-center p-2 cursor-pointer w-full focus:outline-none"
        style={{ 
          backgroundColor: widget.color ? `color-mix(in srgb, ${widget.color} 10%, white)` : '#F9FAFB',
          borderColor: widget.color || '#E5E7EB',
          color: widget.color || '#9CA3AF'
        }}
      >
        {widget.icon && <div className="mb-2 font-bold opacity-70">Ícone: {widget.icon}</div>}
        <div>[{widget.type}]</div>
        <div className="mt-1 opacity-70">
          {availableCollections.find((c: any) => c.collectionName === widget.binding.collection)?.collectionName || 'N/A'} ({widget.binding.aggregate})
        </div>
      </button>
    </div>
  );
};
