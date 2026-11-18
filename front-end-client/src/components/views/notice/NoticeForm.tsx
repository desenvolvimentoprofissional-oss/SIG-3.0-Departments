import React from 'react';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Select } from '../../ui/Select';

interface NoticeFormProps {
  title: string;
  setTitle: (val: string) => void;
  text: string;
  setText: (val: string) => void;
  type: string;
  setType: (val: any) => void;
  targetDepartments: string[];
  setTargetDepartments: (val: string[]) => void;
  availableDepartments: {label: string, value: string}[];
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({
  title, setTitle,
  text, setText,
  type, setType,
  targetDepartments, setTargetDepartments,
  availableDepartments,
  startDate, setStartDate,
  endDate, setEndDate
}) => {
  const handleDepartmentToggle = (value: string) => {
    if (value === 'ALL' || value === 'ALL_AREA') {
      if (targetDepartments.includes(value)) {
        setTargetDepartments([]);
      } else {
        setTargetDepartments([value]);
      }
      return;
    }

    let newTargets = [...targetDepartments].filter(t => t !== 'ALL' && t !== 'ALL_AREA');
    if (newTargets.includes(value)) {
      newTargets = newTargets.filter(t => t !== value);
    } else {
      newTargets.push(value);
    }
    setTargetDepartments(newTargets);
  };

  return (
    <div className="space-y-4">
       <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Título do Aviso</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Aviso importante..." />
       </div>
       <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Mensagem</label>
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Detalhes do aviso..." rows={4} />
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Tipo do Aviso</label>
            <Select 
              value={type} 
              onChange={e => setType(e.target.value)}
              options={[
                { label: 'Informativo (Azul)', value: 'info' },
                { label: 'Alerta (Amarelo)', value: 'warning' },
                { label: 'Erro (Vermelho)', value: 'error' }
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Público Alvo</label>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto p-2 border border-[var(--color-border-default)] rounded-md">
              {availableDepartments.map(dept => (
                <label key={dept.value} className="flex items-center space-x-2 text-sm text-[var(--color-content-primary)] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={targetDepartments.includes(dept.value)}
                    onChange={() => handleDepartmentToggle(dept.value)}
                    className="rounded border-[var(--color-border-default)] text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)]"
                  />
                  <span>{dept.label}</span>
                </label>
              ))}
            </div>
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Data Início</label>
            <Input type="date" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Data Fim (Expiração)</label>
            <Input type="date" min={startDate || new Date().toISOString().split('T')[0]} value={endDate} onChange={e => {
              if (startDate && e.target.value < startDate) {
                setEndDate(startDate);
              } else {
                setEndDate(e.target.value);
              }
            }} />
          </div>
       </div>
    </div>
  );
};
