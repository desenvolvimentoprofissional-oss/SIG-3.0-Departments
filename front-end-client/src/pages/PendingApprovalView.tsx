import React from 'react';
import { UserSessionProfile } from '../types/index';
import { Button } from '../components/ui/Button';
import { Clock, AlertTriangle, XOctagon, Ban, LogOut } from 'lucide-react';

interface Props {
  user: UserSessionProfile;
  onLogout: () => void;
}

export const PendingApprovalView: React.FC<Props> = ({ user, onLogout }) => {
  const isSuspended = user.status === 'SUSPENDED';
  const isRejected = user.status === 'REJECTED' || user.status === 'REJEITADO';
  const isRejectedDomain = user.status === 'REJECTED_DOMAIN';
  const isInactive = user.status === 'INACTIVE';
  const isPending = user.status === 'PENDING_APPROVAL';

  const config: Record<string, any> = {
    PENDING_APPROVAL: {
      title: 'Acesso em Análise',
      message: (
        <>
          Olá, <strong>{user.name}</strong>. Sua solicitação de acesso
          institucional ao SIG 3.0 via <strong>{user.email}</strong> foi
          registrada e encaminhada para a análise. Se tiver urgência, entre em
          contato com o administrador da sua área.
        </>
      ),
      status: 'Aguardando Análise',
      color: 'var(--color-accent-dark)',
      bgSoft: 'rgba(254, 154, 0, 0.1)',
      icon: <Clock className="w-8 h-8 text-[var(--color-accent-dark)]" />,
    },
    SUSPENDED: {
      title: 'Acesso Suspenso',
      message: (
        <>
          Olá, <strong>{user.name}</strong>. O seu acesso institucional ao SIG
          3.0 via <strong>{user.email}</strong> encontra-se suspenso no momento.
          Entre em contato com o administrador para regularização.
        </>
      ),
      status: 'Suspenso',
      color: 'var(--color-accent-dark)',
      bgSoft: 'rgba(254, 154, 0, 0.1)',
      icon: (
        <AlertTriangle className="w-8 h-8 text-[var(--color-accent-dark)]" />
      ),
    },
    REJECTED: {
      title: 'Acesso Recusado',
      message: (
        <>
          Olá, <strong>{user.name}</strong>. Sua solicitação de acesso
          institucional ao SIG 3.0 via <strong>{user.email}</strong> foi
          recusada pelo administrador da sua área.
        </>
      ),
      status: 'Recusado',
      color: 'var(--color-status-error)',
      bgSoft: 'rgba(225, 29, 72, 0.1)',
      icon: <XOctagon className="w-8 h-8 text-[var(--color-status-error)]" />,
    },
    REJECTED_DOMAIN: {
      title: 'Acesso Negado',
      message: (
        <>
          Seu e-mail <strong>({user.email})</strong> não pertence ao domínio
          corporativo e não possui convite pré-aprovado.
        </>
      ),
      status: 'Negado',
      color: 'var(--color-status-error)',
      bgSoft: 'rgba(225, 29, 72, 0.1)',
      icon: <Ban className="w-8 h-8 text-[var(--color-status-error)]" />,
    },
    INACTIVE: {
      title: 'Cadastro Inativo',
      message: (
        <>
          Olá, <strong>{user.name}</strong>. O seu cadastro no SIG 3.0 via{' '}
          <strong>{user.email}</strong> foi inativado. Entre em contato com o
          administrador da sua área se julgar que isso é um erro.
        </>
      ),
      status: 'Inativo',
      color: 'var(--color-status-error)',
      bgSoft: 'rgba(225, 29, 72, 0.1)',
      icon: <Ban className="w-8 h-8 text-[var(--color-status-error)]" />,
    },
  };

    const normalizeStatus = (status: string) => {
    if (status === 'REJEITADO') return 'REJECTED';
    return status;
  };
  const currentConfigKey = normalizeStatus(user.status);
  const currentConfig = config[currentConfigKey] || config['PENDING_APPROVAL'];

  return (
    <div className="min-h-screen w-full bg-[var(--color-background-light)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[var(--color-content-inverse)] rounded-2xl border border-[var(--color-border-default)] shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1.5"
          style={{ backgroundColor: currentConfig.color }}
        ></div>

        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center ring-8 ring-[var(--color-background-light)]"
            style={{ backgroundColor: currentConfig.bgSoft }}
          >
            {currentConfig.icon}
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-content-primary)] mb-3">
          {currentConfig.title}
        </h1>

        <p className="text-[15px] text-[var(--color-content-secondary)] mb-8 leading-relaxed">
          {currentConfig.message}
        </p>

        <div className="bg-[var(--color-background-main)] rounded-lg p-4 mb-8 border border-[var(--color-border-default)] flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-content-tertiary)] uppercase tracking-wider">
            Status da Conta
          </span>
          <div className="flex items-center space-x-2">
            {(isPending || isSuspended) && (
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: currentConfig.color }}
                ></span>
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: currentConfig.color }}
                ></span>
              </span>
            )}
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: currentConfig.color }}
            >
              {currentConfig.status}
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={onLogout}
          className="w-full py-3 shadow-sm text-sm font-medium flex items-center justify-center transition-all hover:bg-[var(--color-background-main)]"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Retornar ao Login
        </Button>
      </div>
    </div>
  );
};
