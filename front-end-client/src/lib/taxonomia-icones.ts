import {
  Building2,
  Headphones,
  HandCoins,
  Landmark,
  UserPlus,
  Wrench,
  Scale,
  Users,
  BarChart3,
  Ear,
  MapIcon,
  Award,
  Inbox,
  ShoppingCart,
  Calculator,
  Search,
  Archive,
  GraduationCap,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Megaphone,
  Globe,
  Code2,
  Server,
  type LucideIcon
} from 'lucide-react';

export type AreaName = 
  | 'Administrativo-Financeira'
  | 'Presidência'
  | 'Controle'
  | 'Desenvolvimento'
  | 'Inovação e Desenvolvimento Profissional'
  | 'Relacionamento'
  | 'Tecnologia';

export interface DepartmentNode {
  id: string;
  name: string;
  icon: LucideIcon;
  area: AreaName;
}

const _DEPARTMENTS: DepartmentNode[] = [
  { id: 'dept_admin', name: 'Administrativo', icon: Building2, area: 'Administrativo-Financeira' },
  { id: 'dept_atendimento', name: 'Atendimento', icon: Headphones, area: 'Administrativo-Financeira' },
  { id: 'dept_cobranca', name: 'Cobrança', icon: HandCoins, area: 'Administrativo-Financeira' },
  { id: 'dept_financeiro', name: 'Financeiro', icon: Landmark, area: 'Administrativo-Financeira' },
  { id: 'dept_rh', name: 'Recursos Humanos', icon: UserPlus, area: 'Administrativo-Financeira' },
  { id: 'dept_apoio', name: 'Serviços de Apoio', icon: Wrench, area: 'Administrativo-Financeira' },

  { id: 'dept_juridico', name: 'Assessoria Jurídica', icon: Scale, area: 'Presidência' },
  { id: 'dept_conselheiros', name: 'Conselheiros', icon: Users, area: 'Presidência' },
  { id: 'dept_pmo', name: 'Escritório de Projetos', icon: BarChart3, area: 'Presidência' },
  { id: 'dept_ouvidoria', name: 'Ouvidoria', icon: Ear, area: 'Presidência' },
  { id: 'dept_planejamento', name: 'Planejamento Estratégico', icon: MapIcon, area: 'Presidência' },
  { id: 'dept_presidencia', name: 'Presidência', icon: Award, area: 'Presidência' },
  { id: 'dept_secretaria', name: 'Secretaria', icon: Inbox, area: 'Presidência' },

  { id: 'dept_compras', name: 'Compras e Contratos', icon: ShoppingCart, area: 'Controle' },
  { id: 'dept_contabilidade', name: 'Contabilidade', icon: Calculator, area: 'Controle' },

  { id: 'dept_fiscalizacao', name: 'Fiscalização', icon: Search, area: 'Desenvolvimento' },
  { id: 'dept_registro', name: 'Registro', icon: Archive, area: 'Desenvolvimento' },
  { id: 'dept_relacoes_academicas', name: 'Relações Acadêmicas', icon: GraduationCap, area: 'Desenvolvimento' },

  { id: 'dept_desenvolvimento_prof', name: 'Desenvolvimento Profissional', icon: BookOpen, area: 'Inovação e Desenvolvimento Profissional' },
  { id: 'dept_inovacao', name: 'Inovação', icon: Lightbulb, area: 'Inovação e Desenvolvimento Profissional' },

  { id: 'dept_comunicacao', name: 'Comunicação', icon: MessageSquare, area: 'Relacionamento' },
  { id: 'dept_marketing', name: 'Marketing', icon: Megaphone, area: 'Relacionamento' },
  { id: 'dept_relacoes_externas', name: 'Relações Externas', icon: Globe, area: 'Relacionamento' },

  { id: 'dept_sistemas', name: 'Desenvolvimento de Sistemas', icon: Code2, area: 'Tecnologia' },
  { id: 'dept_infraestrutura', name: 'Infraestrutura Computacional', icon: Server, area: 'Tecnologia' }
];

export const DEPARTMENT_TAXONOMY: readonly DepartmentNode[] = _DEPARTMENTS.sort((a, b) => a.name.localeCompare(b.name));

