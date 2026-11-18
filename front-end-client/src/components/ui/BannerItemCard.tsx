import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Image as ImageIcon,
  GripVertical,
  Edit2,
  Trash2,
  User,
  Pin,
} from 'lucide-react';
import { BannerItem } from '../../store/bannersStore';
import { useIamStore } from '../../store/iamStore';

interface Props {
  item: BannerItem;
  onEdit: (item: BannerItem) => void;
  onDelete: (id: string) => void;
  canManageItem: boolean;
  canPinItem?: boolean;
  onTogglePin?: (item: BannerItem) => void;
}

const BannerItemCardComponent: React.FC<Props> = ({
  item,
  onEdit,
  onDelete,
  canManageItem,
  canPinItem,
  onTogglePin,
}) => {
  const iamUsers = useIamStore((state) => state.users);
  const creator = iamUsers.find((u) => u.uid === item.createdBy);
  const creatorAvatar = item.createdByAvatar || creator?.avatarUrl;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const todayDate = new Date();
  const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
  const isExpired = item.endDate && item.endDate < today;

  let statusColor = 'text-[var(--color-status-warning)]';
  let statusText = 'Oculto';

  if (isExpired) {
    statusColor = 'text-[var(--color-status-error)]';
    statusText = 'Expirado';
  } else if (item.isPublished) {
    statusColor = 'text-[var(--color-brand-main)]';
    statusText = 'Publicado';
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const TAG_STYLES: Record<string, string> = {
    'blue-dark':
      'border-[var(--color-brand-main)] text-white bg-[var(--color-brand-main)]/40 backdrop-blur-md',
    orange:
      'border-[var(--color-accent-dark)] text-white bg-[var(--color-accent-dark)]/40 backdrop-blur-md',
    'blue-light': 'border-cyan-400 text-white bg-cyan-400/30 backdrop-blur-md',
  };

  const getTagStyle = (color?: string) => {
    return TAG_STYLES[color || 'blue-light'] || TAG_STYLES['blue-light'];
  };

  return (
    <div ref={setNodeRef} style={style} className="relative hover:z-50">
      <div className="bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
        {canManageItem && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 z-10 p-1.5 bg-black/40 backdrop-blur-md rounded cursor-grab active:cursor-grabbing text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical size={16} />
          </div>
        )}

        {item.tag && (
          <div
            className={`absolute top-3 left-3 z-20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm group-hover:opacity-0 transition-opacity border ${getTagStyle(item.tagColor)}`}
          >
            {item.tag}
          </div>
        )}

        {(item.isPinned || canPinItem) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin?.(item);
            }}
            disabled={!canPinItem}
            className={`absolute top-2 right-2 z-20 p-1.5 rounded-full transition-all duration-200 shadow-sm
              ${
                item.isPinned
                  ? 'bg-[var(--color-brand-main)] text-white opacity-100'
                  : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 backdrop-blur-md'
              }
              ${canPinItem ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            `}
            title={item.isPinned ? 'Unpin' : 'Pin to top'}
          >
            <Pin size={14} className={item.isPinned ? 'fill-current' : ''} />
          </button>
        )}

        <div className="relative h-40 bg-[var(--color-border-default)] rounded-t-xl shrink-0 w-full group overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-content-tertiary)]">
              <ImageIcon size={32} />
            </div>
          )}

          {canManageItem && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-white text-[var(--color-brand-main)] rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Editar banner"
                title="Editar"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 bg-white text-[var(--color-status-error)] rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Excluir banner"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div
              className={`flex items-center gap-1.5 uppercase text-[10px] font-semibold tracking-wider ${statusColor}`}
            >
              <div className="w-2 h-2 rounded-full border border-current" />
              <span>{statusText}</span>
            </div>
          </div>

          <h3 className="font-semibold text-sm text-[var(--color-content-primary)] mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p
            className="text-xs text-[var(--color-content-secondary)] mb-3 line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </p>

          <div className="text-[11px] text-[var(--color-content-tertiary)] mt-auto pt-2 flex justify-between items-end min-h-[20px]">
            <div className="flex-1 truncate pr-2">
              {(item.startDate || item.endDate) && (
                <span>
                  <span className="font-medium text-[var(--color-content-secondary)]">
                    Período:{' '}
                  </span>
                  {item.startDate && item.endDate
                    ? `${formatDate(item.startDate)} a ${formatDate(item.endDate)}`
                    : item.startDate
                      ? `a partir de ${formatDate(item.startDate)}`
                      : `até ${formatDate(item.endDate!)}`}
                </span>
              )}
            </div>
            {(creatorAvatar || item.createdBy) && (
              <div className="flex items-center gap-2 shrink-0">
                {creatorAvatar ? (
                  <img
                    src={creatorAvatar}
                    alt=""
                    className="w-6 h-6 rounded-full border border-[var(--color-border-default)] object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-content-tertiary)]">
                    <User size={14} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BannerItemCard = React.memo(BannerItemCardComponent);
