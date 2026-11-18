import type { ViewMappingConfig } from './mapping.types';
import type { ResultadosConfig } from './mapping.resultados.types';

export interface SecondaryFieldConfig {
  id: string;
  label: string;
  field: string;
  isRelational?: boolean;
  relationalCollection?: string;
  relationalDisplayField?: string;
  dependsOnField?: string;
  relationalFilterField?: string;
  section?: string;
  type?: "text" | "number" | "date" | "select" | "boolean" | "link";
  optionsList?: string;
  sheetColumn?: string;
  conditionalField?: string;
  conditionalValue?: string;
  validationType?: "none" | "email" | "phone" | "process_number" | "cpf_cnpj" | "custom_regex";
  validationRegex?: string;
  validationMessage?: string;
}

export interface CollectionSource {
  id: string;
  collectionName: string;
  docName?: string;
  docNameType?: "EXACT" | "PREFIX" | "";
  friendlyName?: string;
  sourceType: "FIREBASE" | "CSV";
  isRelational: boolean;
  joinLocalField?: string;
  joinForeignField?: string;
  extractedFields?: string[];
  metricaTabs?: { id: string; name: string; fields: string[] }[];
}

export interface DataSourceConfig {
  id?: string;
  isDefault?: boolean;
  mainCollection: CollectionSource | null;
  relationalCollections: CollectionSource[];
  viewConfig?: ViewMappingConfig;
  resultadosConfig?: ResultadosConfig;
}

export interface FieldMappingConfig {
  status?: string;
  processNumber?: string;
  createdAt?: string;
  cpfCnpj?: string;
  name?: string;
  responsibleEmail?: string;
  tagField?: string;
  priorityField?: string;
  avatarField?: string;
}

export interface AuditColumnConfig {
  id: string;
  field: string;
  label: string;
  nonCompliantValues: string[];
}

export interface AuditConfig {
  columns: AuditColumnConfig[];
}

export interface CustomActionConfig {
  id: string;
  label: string;
  scriptUrl: string;
  functionName?: string;
}

export interface ComponentConfig {
  searchFields: string[];
  filterFields: string[];
  filterLabels?: Record<string, string>;
  groupingFields?: string[];
  enabledViews: {
    kanban: boolean;
    list: boolean;
    calendar: boolean;
    table: boolean;
    matrix: boolean;
    sla?: boolean;
    auditoria?: boolean;
  };
  enableDispatchSystem: boolean;
  dispatchToOptions?: string;
  dispatchStatus?: string;
  returnStatus?: string;
  dispatchRelationalKey?: string;
  enableObservations?: boolean;
  observationRelationalKey?: string;
  observationGoogleSheetUrl?: string;
  observationGoogleSheetTab?: string;
  observationSheetColumnIdRelacional?: string;
  observationSheetColumnDate?: string;
  observationSheetColumnObservation?: string;
  observationSheetColumnStatus?: string;
  observationSheetColumnStatusText?: string;
  observationSheetColumnDetails?: string;
  observationSheetColumnDetailsText?: string;
  observationFields?: SecondaryFieldConfig[];
  enableVoting?: boolean;
  votingOptions?: string;
  auditConfig?: AuditConfig;
  customActions?: CustomActionConfig[];
}

export interface UniversalFilter {
  id?: string;
  column: string;
  value: string;
  operator?: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not-contains" | "starts-with" | "ends-with";
}

export interface FieldConfig {
  id: string;
  name: string;
  type: "STRING" | "NUMBER" | "DATE" | "BOOLEAN";
  isRelational?: boolean;
  relationalCollection?: string;
  relationalDisplayField?: string;
  dependsOnField?: string;
  relationalFilterField?: string;
}

export type PageType = "CADASTRO" | "RESULTADOS" | "GALERIA" | "INTEGRACAO" | "LINHA_DO_TEMPO" | "PROCESSO" | "METRICA";
