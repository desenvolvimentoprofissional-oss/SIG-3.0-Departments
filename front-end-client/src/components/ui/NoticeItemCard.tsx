import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical, User } from 'lucide-react';
import { Notice } from '../../store/noticeStore';
import { useIamStore } from '../../store/iamStore';

interface Props {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
  formatDate: (dateStr?: string) => string;
  canManage: boolean;
}

const NoticeItemCard: React.FC<Props> = ({
  notice,
  onEdit,
  onDelete,
  formatDate,
  canManage,
}) => {
  const iamUsers = useIamStore((state) => state.users);
  const creatorAvatar =
    notice.createdByAvatar ||
    iamUsers.find((u) => u.uid === notice.createdBy)?.avatarUrl;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: notice.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const todayDate = new Date();
  const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  const isExpired = notice.endDate && notice.endDate < today;
  const isPending = notice.startDate && notice.startDate > today;
  
  const getNoticeStatus = (isExp: any, isPend: any, isPub: any) => {
    const statusType = isExp ? 'expired' : isPend ? 'pending' : (isPub !== false) ? 'published' : 'hidden';
    const STATUS_DICT: Record<string, { color: string, text: string }> = {
      'expired': { color: 'text-[var(--color-status-error)]', text: 'Expirado' },
      'pending': { color: 'text-[var(--color-status-info)]', text: 'Programado' },
      'published': { color: 'text-[var(--color-brand-main)]', text: 'Publicado' },
      'hidden': { color: 'text-[var(--color-status-warning)]', text: 'Oculto' }
    };
    return STATUS_DICT[statusType];
  };

  const { color: statusColor, text: statusText } = getNoticeStatus(isExpired, isPending, notice.isPublished);

  const TYPE_COLORS: Record<string, string> = {
    error: 'bg-[var(--color-status-error)]',
    warning: 'bg-[var(--color-status-warning)]',
    info: 'bg-[var(--color-status-info)]'
  };
  const typeColor = TYPE_COLORS[notice.type] || TYPE_COLORS.info;

  const TYPE_ICONS: Record<string, React.ReactNode> = {
    error: <span className="text-3xl" role="img" aria-label="Erro">🚨</span>,
    warning: <span className="text-3xl" role="img" aria-label="Aviso">⚠️</span>,
    info: <span className="text-3xl" role="img" aria-label="Informação">💡</span>
  };
  const typeIcon = TYPE_ICONS[notice.type] || TYPE_ICONS.info;


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[var(--color-content-inverse)] rounded-xl shadow-sm border border-[var(--color-border-default)] w-full h-full overflow-hidden flex flex-col relative group hover:shadow-md transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 p-1.5 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-md cursor-grab active:cursor-grabbing text-[var(--color-content-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
        title="Arraste para reordenar"
      >
        <GripVertical size={16} />
      </div>

      <div className={`h-1.5 w-full shrink-0 ${typeColor}`} />

      <div className="p-5 relative h-[153px] flex flex-col shrink-0 overflow-hidden">
        <div className="flex items-center space-x-4 mb-3">
          <div className="shrink-0 flex items-center justify-center drop-shadow-sm">
            {typeIcon}
          </div>
          <h2 className="text-[16px] flex-1 font-bold tracking-tight text-[var(--color-content-primary)] line-clamp-1">
            {notice.title}
          </h2>
        </div>
        <p className="text-[14px] leading-relaxed text-[var(--color-content-secondary)] whitespace-pre-line line-clamp-3">
          {notice.text}
        </p>
      </div>

      <div className="p-5 border-t border-[var(--color-border-default)] bg-[var(--color-background-light)]/50 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`flex items-center gap-1.5 uppercase text-[10px] font-semibold tracking-wider ${statusColor}`}
          >
            <div className="w-2 h-2 rounded-full border border-current" />
            <span>{statusText}</span>
          </div>
        </div>
        <div className="text-[11px] text-[var(--color-content-tertiary)] mt-auto pt-2 flex justify-between items-end min-h-[20px]">
          <div className="flex-1 truncate pr-2">
            {(notice.startDate || notice.endDate) && (
              <span className="truncate">
                <span className="font-medium text-[var(--color-content-secondary)]">
                  Período:{' '}
                </span>
                {notice.startDate && notice.endDate
                  ? `${formatDate(notice.startDate)} a ${formatDate(notice.endDate)}`
                  : notice.startDate
                    ? `a partir de ${formatDate(notice.startDate)}`
                    : `até ${formatDate(notice.endDate!)}`}
              </span>
            )}
          </div>
          {(creatorAvatar || notice.createdBy) && (
            <div
              className="flex items-center gap-2 shrink-0"
              title="Criador do aviso"
            >
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

      {canManage && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-10">
          <button
            onClick={() => onEdit(notice)}
            className="p-2 bg-white text-[var(--color-brand-main)] rounded-full hover:bg-[var(--color-brand-light)] transition-colors border border-[var(--color-border-default)] shadow-sm"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(notice.id)}
            className="p-2 bg-white text-[var(--color-status-error)] rounded-full hover:bg-red-50 transition-colors border border-[var(--color-border-default)] shadow-sm"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const _NoticeItemCard = React.memo(NoticeItemCard);
export { _NoticeItemCard as NoticeItemCard };
