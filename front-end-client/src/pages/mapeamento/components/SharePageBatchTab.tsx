import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const SharePageBatchTab = ({
  batchType, setBatchType, batchRole, setBatchRole, batchDept, setBatchDept, batchArea, setBatchArea,
  tenants, departmentId, departmentArea, areas, isProcessingBatch, handleBatchGrantAccess
}: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">
          Tipo de Compartilhamento em Lote
        </label>
        <select value={batchType} onChange={(e) => setBatchType(e.target.value as any)} className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg pl-3 pr-9 py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm">
          <option value="">Selecione o tipo...</option>
          <option value="role">Por Perfil</option>
          <option value="department">Por Departamento</option>
          <option value="area">Por Área</option>
        </select>
      </div>
      
      {batchType === 'role' && (
        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">
            Selecione o Perfil
          </label>
          <select value={batchRole} onChange={(e) => setBatchRole(e.target.value)} className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg pl-3 pr-9 py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm">
            <option value="">Selecione o perfil...</option>
            <option value="ADMIN">Administradores</option>
            <option value="COLABORADOR">Colaboradores</option>
            <option value="CONVIDADO">Convidados</option>
          </select>
          <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
            Isso compartilhará com todos os usuários ativos desse perfil (exceto os que já possuem acesso).
          </p>
        </div>
      )}

      {batchType === 'department' && (
        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">
            Selecione o Departamento
          </label>
          <select value={batchDept} onChange={(e) => setBatchDept(e.target.value)} className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg pl-3 pr-9 py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm">
            <option value="">Selecione o departamento...</option>
            {tenants.filter((t: any) => t.id !== departmentId).map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
            Isso compartilhará com todos os usuários do departamento selecionado (exceto convidados).
          </p>
        </div>
      )}

      {batchType === 'area' && (
        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">
            Selecione a Área
          </label>
          <select value={batchArea} onChange={(e) => setBatchArea(e.target.value)} className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg pl-3 pr-9 py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm">
            <option value="">Selecione a área...</option>
            {areas.filter((a: any) => a !== departmentArea).map((a: any) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
            Isso compartilhará com todos os usuários da área selecionada (exceto convidados).
          </p>
        </div>
      )}
      
      {batchType && ((batchType === 'role' && batchRole) || (batchType === 'department' && batchDept) || (batchType === 'area' && batchArea)) && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleBatchGrantAccess} 
            className="flex items-center"
            disabled={isProcessingBatch}
          >
            <Users size={16} className="mr-2" />
            {isProcessingBatch ? 'Processando...' : 'Aplicar em Lote'}
          </Button>
        </div>
      )}
    </div>
  );
};
