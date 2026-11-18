import { logger } from "../../../lib/logger.util";
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { CollectionMapping } from '../../../types/index';
import { RelationalSelect } from './RelationalSelect';
import { useMappingStore } from '../../../store/mappingStore';
import { Slideover } from '../../../components/ui/Slideover';

interface Props {
  tenant: any;
  mapping: CollectionMapping;
  onClose: () => void;
}

export const CreateMappedProcessModal: React.FC<Props> = ({ tenant, mapping, onClose }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createMappedProcess } = useMappingStore();

  if (!mapping.allowCreateProcess) {
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await createMappedProcess(tenant, mapping, formData);
      onClose();
    } catch (err: any) {
      logger.error("CREATE_MAPPED_PROCESS_FAILED");
      setError(err.message || 'Erro ao criar o processo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Slideover
      isOpen={true}
      onClose={onClose}
      title="Novo Processo"
      icon={Plus}
    >
      <div className="flex flex-col h-full space-y-6">
        {error && <div className="mb-4 text-xs bg-red-50 text-red-600 p-2 rounded">{error}</div>}
        
        <div className="mb-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
           <p className="text-sm text-[var(--color-content-primary)] font-medium">Numeração Sequencial</p>
           <p className="text-xs text-[var(--color-content-secondary)] mt-1">
              O sistema gerará automaticamente o número no padrão XXXXXX/Ano (ex: {String(mapping.createProcessSequenceStart || 0).padStart(6, '0')}/{new Date().getFullYear()}).
           </p>
        </div>

        <div className="space-y-4">
          {(!mapping.createProcessFields || mapping.createProcessFields.length === 0) && (
            <p className="text-sm text-[var(--color-content-secondary)]">Nenhum campo adicional configurado para a criação deste processo.</p>
          )}
          
          {mapping.createProcessFields?.map((field: any, idx: number) => {
             if (field.isRelational) {
               return (
                 <div key={idx}>
                   <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">
                     {field.name}
                   </label>
                   <RelationalSelect
                      tenant={tenant}
                      field={field}
                      value={formData[field.name] || ''} 
                      onChange={(val: string) => setFormData({...formData, [field.name]: val})}
                      parentFormData={formData} 
                   />
                 </div>
               );
             }
             
             if (field.type === 'BOOLEAN') {
               return (
                  <div key={idx} className="flex items-center space-x-2">
                     <input 
                        type="checkbox"
                        className="rounded border-[var(--color-brand-main)] text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                        checked={formData[field.name] || false}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.checked})}
                     />
                     <label className="block text-xs font-semibold text-[var(--color-content-secondary)]">{field.name}</label>
                  </div>
               );
             }
             
             if (field.type === 'DATE') {
               return (
                 <div key={idx}>
                   <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">{field.name}</label>
                   <Input 
                      type="date"
                      value={formData[field.name] || ''} 
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} 
                   />
                 </div>
               );
             }

             return (
                 <div key={idx}>
                   <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">{field.name}</label>
                   <Input 
                      type={field.type === 'NUMBER' ? 'number' : 'text'}
                      value={formData[field.name] || ''} 
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} 
                   />
                 </div>
             );
          })}
        </div>

        <div className="pt-4 border-t border-[var(--color-border-default)] flex justify-end gap-3 mt-auto">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading}>
             {loading ? 'Criando...' : 'Criar Processo'}
          </Button>
        </div>
      </div>
    </Slideover>
  );
};
