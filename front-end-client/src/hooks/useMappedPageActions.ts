import { useState, useMemo, useCallback } from 'react';
import { TenantConfig } from '../types/index';
import { logger } from '../lib/logger.util';

interface UseMappedPageActionsProps {
  data: any[];
  viewConfig: any;
  activeGrouping: string;
  tenant: TenantConfig;
  updateMappedDate: (tenant: TenantConfig, item: any, newDate: string, dateField?: string) => Promise<any>;
}

export const useMappedPageActions = ({
  data,
  viewConfig,
  activeGrouping,
  tenant,
  updateMappedDate
}: UseMappedPageActionsProps) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardClick = useCallback((id: string, item: any) => {
    setSelectedCardId(`${item._collection}::${item._id || id}`);
  }, []);

  const selectedItem = useMemo(() => {
    if (!selectedCardId) return null;
    const [collectionName, itemId] = selectedCardId.split('::');
    return data.find(d => d._collection === collectionName && d._id === itemId);
  }, [selectedCardId, data]);

  const getCardFields = useCallback((item: any) => {
    const currentViewConfig = item._colConfig || item._mapping || viewConfig;
    const pf = currentViewConfig?.primaryFields || item._mapping?.primaryFields || viewConfig?.primaryFields;
    if (!pf) return { status: 'N/A', name: 'N/A', processNumber: 'N/A' };
    return {
      status: activeGrouping ? activeGrouping : (currentViewConfig?.kanbanColumnField || pf.status),
      name: pf.name,
      nameField: pf.name,
      processNumber: pf.processNumber,
      cpfCnpj: pf.cpfCnpj,
      createdAt: pf.createdAt,
      dateField: currentViewConfig?.calendarDateField,
      responsibleEmail: pf.responsibleEmail,
      tagField: pf.tagField,
      priorityField: pf.priorityField,
      avatarField: pf.avatarField,
      priorityQuadrantField: currentViewConfig?.priorityQuadrantField,
      priorityDescriptionField: currentViewConfig?.priorityDescriptionField,
      slaStartDateField: currentViewConfig?.slaStartDateField,
      slaDurationDays: currentViewConfig?.slaDurationDays,
      tramiteTimeField: pf.tramiteTimeField
    };
  }, [activeGrouping, viewConfig]);

  const handleDateChange = useCallback((item: any, newDate: string) => {
    const { dateField } = getCardFields(item);
    if (!dateField) {
       alert('Erro: não há campo de data configurado para arrastar.');
       return;
    }
    updateMappedDate(tenant, item, newDate, dateField).catch(() => {
      logger.error('MAPPED_PAGE_VIEW_DATE_CHANGE_FAILED');
      alert('Erro ao atualizar a data: falha de comunicação ou resposta de infraestrutura.');
    });
  }, [tenant, updateMappedDate, getCardFields]);

  return {
    selectedCardId,
    setSelectedCardId,
    handleCardClick,
    selectedItem,
    getCardFields,
    handleDateChange
  };
};
