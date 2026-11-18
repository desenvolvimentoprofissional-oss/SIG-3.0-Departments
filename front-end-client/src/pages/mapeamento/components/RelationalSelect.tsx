import React, { useEffect, useState } from 'react';
import { Select } from '../../../components/ui/Select';
import { FieldConfig } from '../../../types/index';
import { useMappingStore } from '../../../store/mappingStore';
import { logger } from '../../../lib/logger.util';

interface RelationalSelectProps {
  tenant: any;
  field: FieldConfig | any;
  value: string;
  onChange: (value: string) => void;
  parentFormData?: any;
}

export const RelationalSelect: React.FC<RelationalSelectProps> = ({ tenant, field, value, onChange, parentFormData = {} }) => {
  const [options, setOptions] = useState<{label: string, value: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchRelationalOptions } = useMappingStore();

  useEffect(() => {
    const fetchOptions = async () => {
      if (!field.relationalCollection) {
        setLoading(false);
        return;
      }
      
      const dependentValue = field.dependsOnField ? parentFormData[field.dependsOnField] : undefined;
      if (field.dependsOnField && !dependentValue) {
        setOptions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const uniqueOptions = await fetchRelationalOptions(
           tenant, 
           field.relationalCollection,
           field.dependsOnField ? field.relationalFilterField : undefined,
           dependentValue,
           field.relationalDisplayField
        );
        setOptions(uniqueOptions);
      } catch (err) {
        logger.error('ERR_FETCH_REL_OPTS_500', { collection: field.relationalCollection });
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [tenant, field, field.dependsOnField ? parentFormData[field.dependsOnField] : undefined]);

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
      options={[{label: 'Selecione...', value: ''}, ...options]}
    />
  );
};
