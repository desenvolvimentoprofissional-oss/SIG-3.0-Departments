import React from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { BannerItemCard } from './BannerItemCard';
import { BannerItem } from '../../store/bannersStore';

interface SortableListProps {
  items: BannerItem[];
  canManage: (item: BannerItem) => boolean;
  onEdit: (item: BannerItem) => void;
  onDelete: (id: string) => void;
  canPinItem?: boolean;
  onTogglePin?: (item: BannerItem) => void;
}

const BannerSortableList: React.FC<SortableListProps> = ({ items, canManage, onEdit, onDelete, canPinItem, onTogglePin }) => {
  return (
    <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <BannerItemCard 
            key={item.id} 
            item={item} 
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
            canManageItem={canManage(item)}
            canPinItem={canPinItem}
            onTogglePin={onTogglePin}
          />
        ))}
      </div>
    </SortableContext>
  );
};

const _BannerSortableList = React.memo(BannerSortableList);
export { _BannerSortableList as BannerSortableList };
