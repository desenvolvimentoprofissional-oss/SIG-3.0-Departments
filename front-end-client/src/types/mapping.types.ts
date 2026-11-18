
export * from './mapping.base.types';
export * from './mapping.resultados.types';

import { 
  UniversalFilter, 
  FieldMappingConfig, 
  SecondaryFieldConfig, 
  ComponentConfig, 
  DataSourceConfig,
  FieldConfig,
  PageType,
  AuditConfig,
  CustomActionConfig
} from './mapping.base.types';
import { ResultadosConfig } from './mapping.resultados.types';

export interface ViewMappingConfig {
  universalFilters?: UniversalFilter[];
  universalFilter?: UniversalFilter;
  primaryFields: FieldMappingConfig;
  secondaryFieldsReadOnly: SecondaryFieldConfig[];
  secondaryFieldsEditable: SecondaryFieldConfig[];
  kanbanColumnField?: string;
  calendarDateField?: string;
  priorityQuadrantField?: string;
  priorityDescriptionField?: string;
  slaStartDateField?: string;
  slaDurationDays?: number;
  components: ComponentConfig;
}

export interface CollectionMapping {
  collectionName: string;
  documentNamePrefix?: string;
  universalFilters?: UniversalFilter[];
  universalFilterColumn?: string;
  universalFilterValue?: string;
  primaryFields: {
    status: string;
    processNumber: string;
    createdAt: string;
    cpfCnpj: string;
    name: string;
    responsibleEmail: string;
    tagField?: string;
    priorityField?: string;
    avatarField?: string;
  };
  secondaryFieldsReadOnly: SecondaryFieldConfig[];
  secondaryFieldsEditable: SecondaryFieldConfig[];
  kanbanColumnField?: string;
  calendarDateField?: string;
  priorityQuadrantField?: string;
  priorityDescriptionField?: string;
  slaStartDateField?: string;
  slaDurationDays?: number;
  allowCreateProcess?: boolean;
  createProcessFields?: FieldConfig[];
  createProcessSequenceStart?: number;
  searchFields?: string[];
  filterFields?: string[];
  groupingFields?: string[];
  enableDispatchSystem?: boolean;
  dispatchToOptions?: string;
  dispatchStatus?: string;
  returnStatus?: string;
  enableObservations?: boolean;
  observationGoogleSheetUrl?: string;
  observationGoogleSheetTab?: string;
  observationFields?: SecondaryFieldConfig[];
  enableVoting?: boolean;
  votingOptions?: string;
  enabledViews?: {
    kanban: boolean;
    list: boolean;
    calendar: boolean;
    table: boolean;
    matrix: boolean;
    sla?: boolean;
    auditoria?: boolean;
  };
  auditConfig?: AuditConfig;
  customActions?: CustomActionConfig[];
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  result?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  date?: string;
  order?: number;
  scope?: "INTERNO" | "EXTERNO" | "NAO_PUBLICADO";
}

export interface PageMapping {
  id: string;
  departmentId: string;
  pageName: string;
  pageType?: PageType;
  status?: "RASCUNHO" | "PUBLICADO";
  iframeUrl?: string;
  passUserInfo?: boolean;
  contentItems?: ContentItem[];
  dataSources?: DataSourceConfig[];
  viewConfig?: ViewMappingConfig;
  collections: CollectionMapping[];
  resultadosConfig?: ResultadosConfig;
  createdAt: number;
  updatedAt: number;
  order?: number;
}

export interface EmbeddedApp {
  id: string;
  departmentId: string;
  name: string;
  url: string;
  createdAt: number;
  updatedAt: number;
}
