import { logger } from "../../../lib/logger.util";
import React, { useState } from 'react';
import { ContentItem } from '../../../types/mapping.types';
import { Button } from '../../../components/ui/Button';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { uploadImageAPI } from '../../../api/storage.api';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableContentItem } from './SortableContentItem';

interface ContentItemsManagerProps {
  items: ContentItem[];
  onChange: (items: ContentItem[]) => void;
  pageType: 'GALERIA' | 'LINHA_DO_TEMPO';
}

export const ContentItemsManager: React.FC<ContentItemsManagerProps> = ({ items, onChange, pageType }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

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

  const addItem = () => {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    onChange([
      ...items,
      {
        id: newId,
        title: '',
        description: '',
        order: items.length
      }
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems.map((item, idx) => ({ ...item, order: idx })));
  };

  const updateItem = (index: number, updates: Partial<ContentItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const url = await uploadImageAPI(file, 'page_contents');
      updateItem(index, { imageUrl: url });
    } catch (error) {
      logger.error("IMAGE_UPLOAD_FAILED");
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      const updatedOrderItems = reorderedItems.map((item, index) => ({
        ...item,
        order: index
      }));
      
      onChange(updatedOrderItems);
    }
  };

  return (
    <CollapsibleCard 
      title={`Configuração da ${pageType === 'GALERIA' ? 'Galeria' : 'Linha do Tempo'}`} 
      subtitle={pageType === 'GALERIA' ? 'Gerencie imagens, títulos e legendas exibidas na galeria visual' : 'Adicione marcos históricos, datas e eventos cronológicos na linha do tempo'}
      defaultOpen={true}
    >
      <div className="flex justify-end mb-4 pt-2">
        <Button variant="secondary" onClick={addItem}>
          <Plus size={16} className="mr-2" /> Adicionar Item
        </Button>
      </div>

      <div className="space-y-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <SortableContentItem 
                key={item.id} 
                item={item} 
                index={index} 
                pageType={pageType}
                updateItem={updateItem}
                removeItem={removeItem}
                handleFileUpload={handleFileUpload}
                uploadingIndex={uploadingIndex}
              />
            ))}
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="text-center p-8 border border-dashed border-[var(--color-border-default)] rounded-xl bg-[var(--color-background-light)] text-[var(--color-content-secondary)]">
            <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Nenhum item adicionado.</p>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};
