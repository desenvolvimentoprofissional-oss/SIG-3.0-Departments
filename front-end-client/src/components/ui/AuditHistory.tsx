import React from 'react';

interface AuditHistoryProps {
  createdByName?: string | null;
  createdAt?: number;
  updatedByName?: string | null;
  updatedAt?: number;
  historyLog?: Array<{ timestamp: number; action: string; details: string; performedBy: string; }>;
}

const AuditHistory: React.FC<AuditHistoryProps> = ({
  createdByName, createdAt,
  updatedByName, updatedAt,
  historyLog
}) => {
  return (
    <div className="pt-6 mt-6 border-t border-[var(--color-border-default)]">
      <h3 className="text-sm font-semibold text-[var(--color-content-primary)] mb-3">Histórico</h3>
      <div className="bg-[var(--color-background-light)] rounded-lg p-4 space-y-4 text-xs border border-[var(--color-border-default)]">
        <div className="flex flex-col gap-1 text-[var(--color-content-secondary)]">
          <span className="font-semibold text-[var(--color-content-primary)]">Criado por</span>
          <span>
             {createdByName || 'Desconhecido'} {createdAt ? `em ${new Date(createdAt).toLocaleString('pt-BR')}` : ''}
          </span>
        </div>
        {updatedAt && (
          <div className="flex flex-col gap-1 text-[var(--color-content-secondary)] pt-3 border-t border-[var(--color-border-default)]">
            <span className="font-semibold text-[var(--color-content-primary)]">Última modificação</span>
            <span>
               {updatedByName || 'Desconhecido'} {updatedAt ? `em ${new Date(updatedAt).toLocaleString('pt-BR')}` : ''}
            </span>
          </div>
        )}
      </div>

      {historyLog && historyLog.length > 0 && (
        <div className="mt-4 space-y-2">
          {[...historyLog].reverse().map((log, index) => (
            <div key={index} className="bg-[var(--color-background-light)] rounded-lg p-3 text-xs border border-[var(--color-border-default)]">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-[var(--color-content-primary)]">{log.action}</span>
                <span className="text-[10px] text-[var(--color-content-tertiary)]">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="text-[var(--color-content-secondary)] mb-1">
                {log.details}
              </div>
              <div className="text-[10px] text-[var(--color-content-tertiary)]">
                Por: {log.performedBy}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const _AuditHistory = React.memo(AuditHistory);
export { _AuditHistory as AuditHistory };
