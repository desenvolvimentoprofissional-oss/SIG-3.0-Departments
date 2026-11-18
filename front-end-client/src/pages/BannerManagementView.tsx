import React, { useState, useEffect } from 'react';
import { useBannersStore, BannerItem } from '../store/bannersStore';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
import { canManageBanner } from '../lib/permissions';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Plus, Loader2 } from 'lucide-react';
import { BannerSortableList } from '../components/ui/BannerSortableList';
import { CreateBannerModal } from './banners/components/CreateBannerModal';
import { EditBannerSlideover } from './banners/components/EditBannerSlideover';
import { useIamStore } from '../store/iamStore';
import { HeaderPortal } from '../components/layout/HeaderPortal';
import { HeaderButton } from '../components/layout/AppHeader';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
export const BannerManagementView: React.FC = () => {
  const { items, addItem, updateItem, removeItem, reorderItems } = useBannersStore();
  const { user } = useAuthStore();
  const { query, filterArea, filterDept, filterStatus } = useSearchStore();
  const initializeIamSync = useIamStore(state => state.initializeSync);

  useEffect(() => {
    const unsub = initializeIamSync();
    return () => unsub();
  }, [initializeIamSync]);
  const canManage = user?.role === 'MASTER' || user?.role === 'ADMIN';
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);

  const handleOpenModal = () => {
    setShowCreateModal(true);
  };
  const handleEdit = (item: BannerItem) => {
    setEditingItem(item);
  };

  const handleLoadDefaults = () => {
    addItem({
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
      title: 'Bem-vindo ao SIG 3.0',
      description: 'O novo sistema integrado de gestão para maior controle e observabilidade.',
      startDate: new Date().toLocaleDateString('en-CA'),
      endDate: '2027-12-31',
      isPublished: true
    });
    addItem({
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      title: 'Workshop de Governança',
      description: 'Participe do nosso próximo evento sobre conformidade e melhores práticas.',
      startDate: new Date().toLocaleDateString('en-CA'),
      endDate: '2027-12-31',
      isPublished: true
    });
  };
  useEffect(() => {
    const handleOpenModalEvent = () => {
      setShowCreateModal(true);
      setEditingItem(null);
    };
    window.addEventListener('open-novo-banner', handleOpenModalEvent);
    return () => {
      window.removeEventListener('open-novo-banner', handleOpenModalEvent);
    };
  }, []);
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
  const filteredItems = items.filter(item => {
    if (query) {
      const lowerQuery = query.toLowerCase();
      if (!((item.title && item.title.toLowerCase().includes(lowerQuery)) || 
             (item.description && item.description.toLowerCase().includes(lowerQuery)))) return false;
    }
    
    if (filterArea && item.createdByAreaId !== filterArea) return false;
    if (filterDept && item.createdByDepartmentId !== filterDept) return false;

    if (filterStatus) {
      if (filterStatus === 'ACTIVE' && item.isPublished === false) return false;
      if (filterStatus === 'INACTIVE' && item.isPublished !== false) return false;
    }
    return true;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = filteredItems.findIndex((i) => i.id === active.id);
      const newIndex = filteredItems.findIndex((i) => i.id === over?.id);
      const newArray = arrayMove(filteredItems, oldIndex, newIndex);
      reorderItems(newArray.map(i => i.id));
    }
  };
  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h2 className="text-xl font-bold text-[var(--color-content-primary)] mb-2">Acesso Negado</h2>
        <p className="text-[var(--color-content-secondary)]">Você não tem permissão para gerenciar o banners.</p>
      </div>
    );
  }
  return (
    <>
      {(user?.role === 'MASTER' || user?.role === 'ADMIN') && (
        <HeaderPortal>
          <HeaderButton
            icon={Plus}
            onClick={() => window.dispatchEvent(new Event('open-novo-banner'))}
            title="Novo Banner"
          />
        </HeaderPortal>
      )}
      <div className="flex flex-col h-full p-4 md:p-8 overflow-auto custom-scrollbar items-center">
        <div className="w-full max-w-7xl flex flex-col h-full">
      {filteredItems.length === 0 ? (
        <div className="text-center py-10 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm flex flex-col justify-center items-center">
          <p className="text-sm text-[var(--color-content-secondary)] font-medium mb-4">Nenhum banner cadastrado. Crie um novo banner ou gere dados de teste.</p>
          <Button variant="secondary" onClick={handleLoadDefaults}>Gerar Dados de Teste</Button>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <BannerSortableList 
            items={filteredItems} 
            canManage={(item) => canManageBanner(user!, item.createdBy)} 
            onEdit={handleEdit} 
            onDelete={removeItem} 
            canPinItem={user?.role === 'MASTER'}
            onTogglePin={(item) => updateItem(item.id, { isPinned: !item.isPinned })}
          />
        </DndContext>
      )}
      </div>
      {showCreateModal && (
        <CreateBannerModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
      {editingItem && (
        <EditBannerSlideover
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
    </>
  );
};