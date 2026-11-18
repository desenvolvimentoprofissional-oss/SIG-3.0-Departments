import React from 'react';
import { PageMapping } from '../../types';
import { KanbanTemplate } from '../../templates/KanbanTemplate';
import { CalendarTemplate } from '../../templates/CalendarTemplate';
import { DataGridTemplate } from '../../templates/DataGridTemplate';
import { PriorityMatrixTemplate } from '../../templates/PriorityMatrixTemplate';
import { SlaTemplate } from '../../templates/SlaTemplate';
import { AuditoriaTemplate } from '../../templates/AuditoriaTemplate';
import { CadastroFormTemplate } from '../../templates/CadastroFormTemplate';
import { CadastroTemplate } from '../../templates/CadastroTemplate';

interface MappedPageTemplateRendererProps {
  mapping: PageMapping;
  data: any[];
  paginatedData: any[];
  viewMode: string;
  isCadastro: boolean;
  selectedCollectionFilter: string;
  getCardFields: (item: any) => any;
  handleCardClick: (id: string, item: any) => void;
  handleDateChange: (item: any, newDate: string) => void;
}

const cadastroTemplateMap: Record<string, React.FC<MappedPageTemplateRendererProps>> = {
  dashboard: (props) => <CadastroTemplate mapping={props.mapping} items={props.paginatedData} />,
  form: (props) => <CadastroFormTemplate mapping={props.mapping} items={props.paginatedData} />
};

const viewModeTemplateMap: Record<string, React.FC<MappedPageTemplateRendererProps>> = {
  kanban: (props) => (
    <KanbanTemplate 
      items={props.paginatedData}
      getCardFields={props.getCardFields}
      onCardClick={props.handleCardClick}
    />
  ),
  calendar: (props) => (
    <CalendarTemplate
      items={props.paginatedData}
      getCardFields={props.getCardFields}
      onCardClick={props.handleCardClick}
      onDateChange={props.handleDateChange}
    />
  ),
  table: (props) => (
    <DataGridTemplate 
      items={props.paginatedData}
      getCardFields={props.getCardFields}
      mapping={props.mapping}
      selectedCollectionFilter={props.selectedCollectionFilter}
      onRowClick={props.handleCardClick}
    />
  ),
  matrix: (props) => (
    <PriorityMatrixTemplate 
      items={props.paginatedData}
      getCardFields={props.getCardFields}
      onCardClick={props.handleCardClick}
    />
  ),
  sla: (props) => (
    <SlaTemplate 
      items={props.paginatedData}
      getCardFields={props.getCardFields}
      onCardClick={props.handleCardClick}
    />
  ),
  auditoria: (props) => (
    <AuditoriaTemplate 
      items={props.paginatedData}
      mapping={props.mapping}
      getCardFields={props.getCardFields}
      onCardClick={props.handleCardClick}
      selectedCollectionFilter={props.selectedCollectionFilter}
    />
  )
};

export const MappedPageTemplateRenderer: React.FC<MappedPageTemplateRendererProps> = (props) => {
  const activeMap = props.isCadastro ? cadastroTemplateMap : viewModeTemplateMap;
  const SelectedTemplate = activeMap[props.viewMode];
  return SelectedTemplate ? <SelectedTemplate {...props} /> : null;
};
