import React, { useState, useEffect, useMemo } from 'react';
import { useNoticeStore, Notice, NoticeType } from '../store/noticeStore';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
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
  horizontalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { DEPARTMENT_TAXONOMY } from '../lib/taxonomia-icones';
import { NoticeItemCard } from '../components/ui/NoticeItemCard';
import { CreateNoticeModal } from './avisos/components/CreateNoticeModal';
import { EditNoticeSlideover } from './avisos/components/EditNoticeSlideover';
import { canManageNotice } from '../lib/permissions';
import { useIamStore } from '../store/iamStore';
import { HeaderPortal } from '../components/layout/HeaderPortal';
import { HeaderButton } from '../components/layout/AppHeader';
import { Plus } from 'lucide-react';
import { filterNotices } from '../lib/filters.util';

export const NoticeManagementView: React.FC = () => {
  const { user } = useAuthStore();
  const { notices, removeNotice, updateNoticesOrder } = useNoticeStore();
  const { query, filterArea, filterDept, filterStatus } = useSearchStore();
  const initializeIamSync = useIamStore(state => state.initializeSync);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = initializeIamSync();
    return () => unsub();
  }, [initializeIamSync]);

  if (!user) return null;

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

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.id);
  };

  const myVisibleNotices = useMemo(() => {
    return filterNotices(notices, user, query, filterArea, filterDept, filterStatus);
  }, [notices, user, query, filterArea, filterDept, filterStatus]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const sortedVisibleNotices = [...myVisibleNotices].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedVisibleNotices.findIndex((item) => item.id === active.id);
      const newIndex = sortedVisibleNotices.findIndex((item) => item.id === over.id);
      
      const newArray = arrayMove(sortedVisibleNotices, oldIndex, newIndex);
      const orderedIds = newArray.map(item => item.id);
      updateNoticesOrder(orderedIds);
    }
  };

  return (
    <>
      {(user?.role === 'MASTER' || user?.role === 'ADMIN') && (
        <HeaderPortal>
          <HeaderButton
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            title="Novo Aviso"
          />
        </HeaderPortal>
      )}
      <div className="flex flex-col h-full p-4 md:p-8 overflow-auto custom-scrollbar items-center">
        <div className="w-full max-w-7xl flex flex-col h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 auto-rows-max">
         {sortedVisibleNotices.length === 0 ? (
           <div className="col-span-full text-center py-10 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm">
             <p className="text-sm text-[var(--color-content-secondary)] font-medium">Você ainda não criou nenhum aviso.</p>
           </div>
         ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sortedVisibleNotices.map(n => n.id)}
              strategy={rectSortingStrategy}
            >
              {sortedVisibleNotices.map((notice) => (
                 <NoticeItemCard 
                    key={notice.id} 
                    notice={notice} 
                    onEdit={handleEdit} 
                    onDelete={(id) => removeNotice(id)} 
                    formatDate={formatDate}
                    canManage={canManageNotice(user, notice)}
                 />
              ))}
            </SortableContext>
          </DndContext>
         )}
      </div>
      </div>
      <CreateNoticeModal showModal={showCreateModal} setShowModal={setShowCreateModal} />

      <EditNoticeSlideover editingId={editingId} setEditingId={setEditingId} />
    </div>
    </>
  );
};
