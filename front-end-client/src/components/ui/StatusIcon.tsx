import React from 'react';
import { Clock, AlertCircle, FileArchive, CheckCircle2, MinusCircle, XCircle, PauseCircle, FileInput } from 'lucide-react';

export type StatusIconVariant = 'pending' | 'blocked' | 'archived' | 'none' | 'active' | 'inactive' | 'rejected' | 'suspended';

interface StatusIconProps {
  variant: StatusIconVariant;
  label: string;
  className?: string;
}

const STATUS_ICONS: Record<StatusIconVariant, { Icon: React.ElementType, color: string }> = {
  pending: { Icon: Clock, color: "text-amber-500" },
  active: { Icon: CheckCircle2, color: "text-emerald-500" },
  inactive: { Icon: MinusCircle, color: "text-gray-400" },
  rejected: { Icon: XCircle, color: "text-red-500" },
  blocked: { Icon: XCircle, color: "text-red-500" },
  suspended: { Icon: PauseCircle, color: "text-amber-600" },
  archived: { Icon: PauseCircle, color: "text-amber-600" },
  none: { Icon: FileInput, color: "text-[var(--color-content-tertiary)]" }
};

function StatusIcon({ variant, label, className = '' }: StatusIconProps) {
  const config = STATUS_ICONS[variant] || STATUS_ICONS.none;
  const IconComponent = config.Icon;

  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <IconComponent className={`w-3.5 h-3.5 ${config.color}`} />
      <span className="text-xs font-medium uppercase text-[var(--color-content-secondary)]">{label}</span>
    </div>
  );
}

const _StatusIcon = React.memo(StatusIcon);
export { _StatusIcon as StatusIcon };
