import { useCallback } from 'react';
import { ResultadoWidget } from '../../../../types';

export const useWidgetBindingBuilder = (selectedWidget: ResultadoWidget, handleUpdateWidget: (id: string, updates: Partial<ResultadoWidget>) => void) => {
  
  const updateBinding = useCallback((updates: Partial<any>) => {
    handleUpdateWidget(selectedWidget.id, {
      binding: { ...selectedWidget.binding, ...updates }
    });
  }, [selectedWidget, handleUpdateWidget]);

  const updateFieldConfig = useCallback((field: string, index: number, configKey: string, value: any, configsKey: 'groupByFieldConfigs' | 'targetFieldConfigs' = 'groupByFieldConfigs') => {
    const configs = selectedWidget.binding[configsKey] ? [...selectedWidget.binding[configsKey]] : [];
    while (configs.length <= index) configs.push({ field, filters: [] });
    configs[index] = { ...configs[index], [configKey]: value, field };
    updateBinding({ [configsKey]: configs });
  }, [selectedWidget, updateBinding]);

  const addGroupByField = useCallback((field: string) => {
    const currentFields = selectedWidget.binding.groupByFields || [selectedWidget.binding.groupByField || ''];
    updateBinding({ groupByFields: [...currentFields, field] });
  }, [selectedWidget, updateBinding]);

  const updateGroupByField = useCallback((index: number, field: string) => {
    const newFields = [...(selectedWidget.binding.groupByFields || [selectedWidget.binding.groupByField || ''])];
    newFields[index] = field;
    updateBinding({ 
      groupByFields: newFields,
      ...(index === 0 ? { groupByField: field } : {})
    });
  }, [selectedWidget, updateBinding]);

  const removeGroupByField = useCallback((index: number) => {
    const newFields = [...(selectedWidget.binding.groupByFields || [selectedWidget.binding.groupByField || ''])];
    newFields.splice(index, 1);
    
    const newConfigs = [...(selectedWidget.binding.groupByFieldConfigs || [])];
    if (newConfigs.length > index) {
      newConfigs.splice(index, 1);
    }
    
    updateBinding({ 
      groupByFields: newFields.length <= 1 ? undefined : newFields,
      groupByFieldConfigs: newConfigs,
      groupByField: newFields[0] || ''
    });
  }, [selectedWidget, updateBinding]);

  const updateTargetFieldConfig = useCallback((index: number, field: string) => {
    const configs = selectedWidget.binding.targetFieldConfigs || (selectedWidget.binding.targetFields || []).map((tf: string) => ({ field: tf }));
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], field };
    updateBinding({ targetFieldConfigs: newConfigs });
  }, [selectedWidget, updateBinding]);
  
  const removeTargetFieldConfig = useCallback((index: number) => {
    const configs = selectedWidget.binding.targetFieldConfigs || (selectedWidget.binding.targetFields || []).map((tf: string) => ({ field: tf }));
    const newConfigs = [...configs];
    newConfigs.splice(index, 1);
    updateBinding({ targetFieldConfigs: newConfigs });
  }, [selectedWidget, updateBinding]);
  
  const addTargetFieldConfig = useCallback(() => {
    const configs = selectedWidget.binding.targetFieldConfigs || (selectedWidget.binding.targetFields || []).map((tf: string) => ({ field: tf }));
    updateBinding({ targetFieldConfigs: [...configs, { field: '', filters: [] }] });
  }, [selectedWidget, updateBinding]);

  const updateGranularityGoal = useCallback((index: number, key: 'value' | 'goal', val: any) => {
    const newGoals = [...(selectedWidget.binding.granularityGoals || [])];
    newGoals[index] = { ...newGoals[index], [key]: val };
    updateBinding({ granularityGoals: newGoals });
  }, [selectedWidget, updateBinding]);

  const removeGranularityGoal = useCallback((index: number) => {
    const newGoals = [...(selectedWidget.binding.granularityGoals || [])];
    newGoals.splice(index, 1);
    updateBinding({ granularityGoals: newGoals });
  }, [selectedWidget, updateBinding]);

  const addGranularityGoal = useCallback(() => {
    const newGoals = [...(selectedWidget.binding.granularityGoals || []), { value: '', goal: 0 }];
    updateBinding({ granularityGoals: newGoals });
  }, [selectedWidget, updateBinding]);

  return {
    updateBinding,
    updateFieldConfig,
    addGroupByField,
    updateGroupByField,
    removeGroupByField,
    updateTargetFieldConfig,
    removeTargetFieldConfig,
    addTargetFieldConfig,
    updateGranularityGoal,
    removeGranularityGoal,
    addGranularityGoal
  };
};
