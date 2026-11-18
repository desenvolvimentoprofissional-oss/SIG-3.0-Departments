import React, { useState, useEffect, useMemo } from 'react';
import { useIamStore } from '../../store/iamStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slideover } from '../ui/Slideover';
import { Plus } from 'lucide-react';
import { DEPARTMENT_TAXONOMY } from '../../lib/taxonomia-icones';
import { useTenantStore } from '../../store/tenantStore';
import { UserRole } from '../../types/index';

import { useMappingStore } from '../../store/mappingStore';

interface CreateUserModalProps {
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  onClose,
}) => {
  const { addUser } = useIamStore();
  const { user: currentUser } = useAuthStore();
  const { mappings } = useMappingStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('CONVIDADO');
  const [departmentId, setDepartmentId] = useState('');
  const [viewerPages, setViewerPages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { tenants } = useTenantStore();

  const departmentOptions = useMemo(() => {
    const allDeptsMap = new Map();
    DEPARTMENT_TAXONOMY.forEach((d) => allDeptsMap.set(d.id, d.name));
    tenants.forEach((t) => allDeptsMap.set(t.id, t.name));

    let options = Array.from(allDeptsMap.entries())
      .map(([id, name]) => ({
        label: name,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (currentUser?.role !== 'MASTER') {
      options = options.filter((o) => o.value === currentUser?.primaryTenantId);
    }
    return options;
  }, [currentUser, tenants]);

  useEffect(() => {
    if (departmentOptions.length === 1) {
      setDepartmentId(departmentOptions[0].value);
    }
  }, [departmentOptions]);

  const availablePages = useMemo(() => {
    if (!departmentId) return [];
    return mappings.filter((m) => m.departmentId === departmentId);
  }, [mappings, departmentId]);

  useEffect(() => {
    setViewerPages([]);
  }, [departmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !departmentId) return;

    setIsSubmitting(true);
    try {
      await addUser({
        name,
        email,
        domain: email.split('@')[1] || '',
        avatarUrl: '',
        primaryTenantId: departmentId,
        departmentId,
        role,
        viewerDepartments: [],
        viewerPages: role === 'CONVIDADO' ? viewerPages : [],
        status: 'ACTIVE',
        historyLog: [
          {
            action: 'Criação de Usuário',
            details: `Usuário pré-aprovado criado como ${role}.`,
            performedBy: currentUser?.name || 'Sistema',
            timestamp: Date.now(),
          },
        ],
      });
      onClose();
    } catch (err) {
      console.error('[SIG3_ERROR]: User creation failure. Metadata suppressed due to LGPD/GRC policy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Slideover
      isOpen={true}
      onClose={onClose}
      title="Adicionar Novo Usuário"
      icon={Plus}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Nome Completo
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: João Silva"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            E-mail
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@exemplo.com"
          />
          <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
            Pode ser um e-mail fora do domínio corporativo.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Departamento
          </label>
          <Select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            options={[
              { label: 'Selecione...', value: '' },
              ...departmentOptions,
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Perfil
          </label>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            required
            disabled
            options={[{ label: 'Convidado', value: 'CONVIDADO' }]}
          />
          <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
            Novos usuários são criados inicialmente como Convidados.
          </p>
        </div>

        {role === 'CONVIDADO' && departmentId && availablePages.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
              Páginas Liberadas
            </label>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto p-3 border border-[var(--color-border-default)] rounded-md bg-[var(--color-background-soft)]">
              {availablePages.map((page) => (
                <label
                  key={page.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)] w-4 h-4"
                    checked={viewerPages.includes(page.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setViewerPages([...viewerPages, page.id]);
                      } else {
                        setViewerPages(
                          viewerPages.filter((id) => id !== page.id),
                        );
                      }
                    }}
                  />
                  <span className="text-sm text-[var(--color-content-primary)]">
                    {page.pageName}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
              Selecione as páginas específicas que o convidado poderá acessar.
              Se nenhuma for selecionada, o acesso ao conteúdo do departamento
              será negado.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--color-border-default)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Adicionar Usuário'}
          </Button>
        </div>
      </form>
    </Slideover>
  );
};
