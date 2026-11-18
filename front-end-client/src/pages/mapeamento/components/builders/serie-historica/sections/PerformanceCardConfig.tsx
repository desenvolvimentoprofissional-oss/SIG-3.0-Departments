import React from 'react';
import { Select } from '../../../../../../components/ui/Select';
import { FilterBuilder } from '../../../FilterBuilder';

export const PerformanceCardConfig = ({ selectedWidget, handleUpdateWidget, getExtractedFields }: any) => {
  return (
    <>
      <div className="border-t border-[var(--color-border-default)] pt-4">
        <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">Configuração do Colaborador</h4>
        
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de E-mail</label>
          <Select 
            value={selectedWidget.binding.responsibleEmailField || ''}
            onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
              binding: { ...selectedWidget.binding, responsibleEmailField: e.target.value } 
            })}
            options={[
              { label: 'Selecione um campo...', value: '' },
              ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">E-mail do Responsável</label>
          <input 
            type="email"
            value={selectedWidget.binding.responsibleEmailValue || ''}
            onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
              binding: { ...selectedWidget.binding, responsibleEmailValue: e.target.value } 
            })}
            className="w-full text-sm p-2 border border-[var(--color-border-default)] rounded-md outline-none focus:border-[var(--color-brand-main)]"
            placeholder="example@email.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Nome (Opcional)</label>
          <Select 
            value={selectedWidget.binding.responsibleNameField || ''}
            onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
              binding: { ...selectedWidget.binding, responsibleNameField: e.target.value } 
            })}
            options={[
              { label: 'Selecione um campo...', value: '' },
              ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Avatar (Opcional)</label>
          <Select 
            value={selectedWidget.binding.avatarField || ''}
            onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
              binding: { ...selectedWidget.binding, avatarField: e.target.value } 
            })}
            options={[
              { label: 'Selecione um campo...', value: '' },
              ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Função/Carteira (Opcional)</label>
          <Select 
            value={selectedWidget.binding.roleField || ''}
            onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
              binding: { ...selectedWidget.binding, roleField: e.target.value } 
            })}
            options={[
              { label: 'Selecione um campo...', value: '' },
              ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>
      </div>
      <div className="border-t border-[var(--color-border-default)] pt-4">
        <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">Filtros Locais (Opcional)</h4>
        <FilterBuilder 
          filters={selectedWidget.binding.filters || []}
          onChange={(newFilters: any) => handleUpdateWidget(selectedWidget.id, {
            binding: { ...selectedWidget.binding, filters: newFilters }
          })}
          availableFields={getExtractedFields(selectedWidget.binding.collection)}
        />
      </div>
    </>
  );
};
