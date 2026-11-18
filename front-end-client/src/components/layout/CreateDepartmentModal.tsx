import React, { useState } from 'react';
import { useTenantStore } from '../../store/tenantStore';
import { DEPARTMENT_TAXONOMY, AreaName } from '../../lib/taxonomia-icones';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slideover } from '../ui/Slideover';
import { Plus, X, Building2, Headphones, HandCoins, Landmark, UserPlus, Wrench, Scale, Users, BarChart3, Ear, MapIcon, Award, Inbox, ShoppingCart, Calculator, Search, Archive, GraduationCap, BookOpen, Lightbulb, MessageSquare, Megaphone, Globe, Code2, Server } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CreateDepartmentModalProps {
  onClose: () => void;
}

const ICONS = [
  { id: 'Building2', icon: Building2 },
  { id: 'Headphones', icon: Headphones },
  { id: 'HandCoins', icon: HandCoins },
  { id: 'Landmark', icon: Landmark },
  { id: 'UserPlus', icon: UserPlus },
  { id: 'Wrench', icon: Wrench },
  { id: 'Scale', icon: Scale },
  { id: 'Users', icon: Users },
  { id: 'BarChart3', icon: BarChart3 },
  { id: 'Ear', icon: Ear },
  { id: 'MapIcon', icon: MapIcon },
  { id: 'Award', icon: Award },
  { id: 'Inbox', icon: Inbox },
  { id: 'ShoppingCart', icon: ShoppingCart },
  { id: 'Calculator', icon: Calculator },
  { id: 'Search', icon: Search },
  { id: 'Archive', icon: Archive },
  { id: 'GraduationCap', icon: GraduationCap },
  { id: 'BookOpen', icon: BookOpen },
  { id: 'Lightbulb', icon: Lightbulb },
  { id: 'MessageSquare', icon: MessageSquare },
  { id: 'Megaphone', icon: Megaphone },
  { id: 'Globe', icon: Globe },
  { id: 'Code2', icon: Code2 },
  { id: 'Server', icon: Server }
];

export const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({ onClose }) => {
  const { saveTenantConfig } = useTenantStore();
  const [name, setName] = useState('');
  const [area, setArea] = useState<AreaName | ''>('');
  const [selectedIcon, setSelectedIcon] = useState('Building2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const areas = Array.from(new Set(DEPARTMENT_TAXONOMY.map(d => d.area))).sort((a, b) => a.localeCompare(b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !area || !selectedIcon) return;
    
    setIsSubmitting(true);
    try {
      const newId = `dept_${uuidv4().split('-')[0]}`;
      await saveTenantConfig({
        id: newId,
        name,
        area: area as AreaName,
        iconId: selectedIcon,
        firebaseConfig: {
          apiKey: '',
          authDomain: '',
          projectId: '',
          storageBucket: '',
          messagingSenderId: '',
          appId: ''
        },
        isActive: true,
        createdAt: Date.now()
      });
      onClose();
    } catch (err) {
      console.error('[SIG3_ERROR]: Department creation failed. Metadata suppressed by LGPD/GRC policy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Slideover
      isOpen={true}
      onClose={onClose}
      title="Novo Departamento"
      icon={Plus}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Nome do Departamento</label>
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Ex: Departamento de TI" 
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Área Vinculada</label>
          <Select 
            value={area} 
            onChange={e => setArea(e.target.value as AreaName)}
            required
            options={[
              { label: 'Selecione uma área...', value: '' },
              ...areas.map(a => ({ label: a, value: a }))
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Ícone Alusivo</label>
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-[var(--color-border-default)] rounded-xl bg-gray-50 custom-scrollbar">
            {ICONS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedIcon(id)}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  selectedIcon === id 
                    ? 'bg-[var(--color-brand-main)] text-white shadow-md scale-110' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                }`}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-[var(--color-border-default)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || !name || !area || !selectedIcon}>
            {isSubmitting ? 'Salvando...' : 'Cadastrar Departamento'}
          </Button>
        </div>
      </form>
    </Slideover>
  );
};
