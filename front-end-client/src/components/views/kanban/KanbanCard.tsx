import React, { useState } from 'react';
import {
  Copy,
  Check,
  Clock,
  User,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  ArrowUp,
  Minus,
  ArrowDown,
  Calendar,
} from 'lucide-react';
import {
  KanbanItem,
  KanbanCardFields,
} from '../../../templates/KanbanTemplate';

interface KanbanCardProps {
  item: KanbanItem;
  fields: KanbanCardFields;
  cardCustomCols: Record<string, string>;
  colName: string;
  onCardClick?: (id: string, item: KanbanItem) => void;
  setCardCustomCols: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  handleDragStart: (
    e: React.DragEvent,
    type: 'item' | 'column',
    id: string,
    sourceCol?: string,
  ) => void;
}

const MASKS:Record<number,(s:string)=>string>={11:c=>`***.${c.substring(3,6)}.${c.substring(6,9)}-**`,14:c=>`**.***.${c.substring(5,8)}/0001-**`};
const maskDocument=(doc?:string)=>{if(!doc)return'';const strDoc=String(doc);const clean=strDoc.replace(/\D/g,'');const applyMask=MASKS[clean.length];return applyMask?applyMask(clean):strDoc;};

const getInitials = (email?: string) => {
  if (!email) return 'UN';
  return email.substring(0, 2).toUpperCase();
};

const KanbanCardComponent: React.FC<KanbanCardProps> = ({
  item,
  fields,
  cardCustomCols,
  colName,
  onCardClick,
  setCardCustomCols,
  handleDragStart,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const daysProcess =
    fields.tramiteTimeField && item[fields.tramiteTimeField] !== undefined
      ? item[fields.tramiteTimeField]
      : null;
  const tagValue =
    fields.tagField && item[fields.tagField] ? item[fields.tagField] : null;
  const priorityValue = fields.priorityField
    ? item[fields.priorityField]
    : null;

  const renderPriority = (priority: string | null) => {
    if (!priority) return <div />;
    const p = priority.toUpperCase();
    if (p === 'MÁXIMA' || p === 'ALTA')
      return (
        <span className="flex items-center text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
          <ArrowUp size={9} className="mr-0.5" /> {priority}
        </span>
      );
    if (p === 'MÉDIA')
      return (
        <span className="flex items-center text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
          <Minus size={9} className="mr-0.5" /> {priority}
        </span>
      );
    if (p === 'BAIXA')
      return (
        <span className="flex items-center text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
          <ArrowDown size={9} className="mr-0.5" /> {priority}
        </span>
      );
    return (
      <span className="flex items-center text-[9px] font-bold text-[var(--color-content-tertiary)] bg-gray-50 px-1.5 py-0.5 rounded">
        {priority}
      </span>
    );
  };

  return (
    <button
      className="w-full text-left bg-white p-3 rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)]/40 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]/50 relative overflow-hidden"
      draggable
      onDragStart={(e) => handleDragStart(e, 'item', item.id, colName)}
      onClick={() => onCardClick?.(item.id, item)}
      type="button"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between gap-2 w-full mb-1.5">
          <div className="flex items-center group/proc relative z-10 min-w-0">
            {fields.processNumber && item[fields.processNumber] ? (
              <>
                <h4
                  className="font-semibold text-[11px] text-[var(--color-content-secondary)] uppercase truncate tracking-wider"
                  title={item[fields.processNumber]}
                >
                  {item[fields.processNumber]}
                </h4>
                <button
                  type="button"
                  className="opacity-0 group-hover/proc:opacity-100 ml-1 p-0.5 text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0 rounded"
                  onClick={(e) =>
                    handleCopy(
                      e,
                      item[fields.processNumber!],
                      `proc_${item.id}`,
                    )
                  }
                  title="Copiar número do processo"
                >
                  {copiedId === `proc_${item.id}` ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </>
            ) : (
              <span className="font-semibold text-[11px] text-[var(--color-content-tertiary)] italic">
                S/ PROCESSO
              </span>
            )}
          </div>

          <div className="flex items-center shrink-0 space-x-1.5">
            {renderPriority(priorityValue)}
            {(tagValue || item[fields.status]) && (
              <span
                className="text-[9px] uppercase font-bold tracking-widest text-[var(--color-content-tertiary)] truncate max-w-[80px]"
                title={tagValue || item[fields.status]}
              >
                {tagValue || item[fields.status]}
              </span>
            )}
          </div>
        </div>

        {fields.name && (
          <div
            className="text-[13px] text-[var(--color-content-primary)] font-medium leading-snug truncate mb-1.5"
            title={item[fields.name] || ''}
          >
            {item[fields.name] || '\u00A0'}
          </div>
        )}

        {fields.cpfCnpj && (
          <div className="text-[10px] text-[var(--color-content-secondary)] flex items-center group/copy w-fit mb-3 min-h-[15px]">
            {item[fields.cpfCnpj] && (
              <>
                <span>{maskDocument(item[fields.cpfCnpj])}</span>
                <button
                  type="button"
                  className="opacity-0 group-hover/copy:opacity-100 ml-1.5 text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0"
                  onClick={(e) =>
                    handleCopy(e, item[fields.cpfCnpj!], `doc_${item.id}`)
                  }
                  title="Copiar documento"
                >
                  {copiedId === `doc_${item.id}` ? (
                    <Check size={10} className="text-green-500" />
                  ) : (
                    <Copy size={10} />
                  )}
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto w-full">
          <div className="flex items-center space-x-3">
            {fields.createdAt && item[fields.createdAt] && (
              <span
                className="text-[10px] font-medium text-[var(--color-content-secondary)] shrink-0 flex items-center"
                title="Data de criação"
              >
                <Calendar
                  size={11}
                  className="mr-1 text-[var(--color-content-tertiary)]"
                />
                {new Date(item[fields.createdAt]).toLocaleDateString('pt-BR')}
              </span>
            )}

            {daysProcess !== null && (
              <span
                className="text-[10px] font-medium text-[var(--color-content-secondary)] flex items-center"
                title="Tempo de trâmite"
              >
                <Clock
                  size={11}
                  className="mr-1 text-[var(--color-content-tertiary)]"
                />
                {daysProcess} {daysProcess === 1 ? 'dia' : 'dias'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 relative z-10 shrink-0">
            {cardCustomCols[item.id] && (
              <button
                type="button"
                title="Retornar à coluna inicial"
                className="text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] p-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardCustomCols((prev) => {
                    const next = { ...prev };
                    delete next[item.id];
                    return next;
                  });
                }}
              >
                <RotateCcw size={12} strokeWidth={2.5} />
              </button>
            )}

            {fields.avatarField &&
            item[fields.avatarField] &&
            item[fields.avatarField].toUpperCase() !== 'NÃO INFORMADO' ? (
              <div className="h-5 w-5 rounded-full overflow-hidden border border-[var(--color-border-default)] shrink-0 bg-[var(--color-background-light)]">
                <img
                  src={item[fields.avatarField]}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const p = target.parentElement;
                    if (p) {
                      const hasEmail =
                        fields.responsibleEmail &&
                        item[fields.responsibleEmail] &&
                        item[fields.responsibleEmail].toUpperCase() !==
                          'NÃO INFORMADO';
                      if (hasEmail && fields.responsibleEmail) {
                        p.textContent = getInitials(
                          item[fields.responsibleEmail],
                        );
                        p.className='bg-[var(--color-brand-main)] text-white text-[8px] font-bold flex items-center justify-center';
                      } else {
                        p.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                        p.className='flex items-center justify-center text-[var(--color-content-tertiary)]';
                      }
                    }
                  }}
                />
              </div>
            ) : fields.responsibleEmail &&
              item[fields.responsibleEmail] &&
              item[fields.responsibleEmail].toUpperCase() !==
                'NÃO INFORMADO' ? (
              <div
                className="h-5 w-5 shrink-0 rounded-full bg-[var(--color-brand-main)] text-white text-[8px] font-bold flex items-center justify-center shadow-sm"
                title={item[fields.responsibleEmail]}
              >
                {getInitials(item[fields.responsibleEmail])}
              </div>
            ) : (
              <div
                className="h-5 w-5 shrink-0 rounded-full bg-[var(--color-background-light)] text-[var(--color-content-tertiary)] border border-[var(--color-border-default)] flex items-center justify-center shadow-sm"
                title="Responsável não informado"
              >
                <User size={10} />
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export const KanbanCard = React.memo(KanbanCardComponent);
