import type { SecondaryFieldConfig } from '../types/mapping.base.types';

export function isFieldVisible(
  field: { conditionalField?: string; conditionalValue?: string },
  fieldsData: Record<string, any>,
  selectedItem?: any
): boolean {
  if (!field.conditionalField) return true;
  
  const targetVal = fieldsData[field.conditionalField] !== undefined && fieldsData[field.conditionalField] !== ''
    ? fieldsData[field.conditionalField]
    : (selectedItem ? selectedItem[field.conditionalField] : undefined);

  if (targetVal === undefined || targetVal === null || targetVal === '') return false;

  const normalize = (val: any) => String(val).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const normTarget = normalize(targetVal);

  const expectedValues = String(field.conditionalValue || '').split(',').map(normalize);

  if (expectedValues.includes(normTarget)) return true;

  const isTargetTrue = normTarget === 'true' || normTarget === 'sim';
  const isTargetFalse = normTarget === 'false' || normTarget === 'nao';

  if (isTargetTrue && expectedValues.some(v => v === 'true' || v === 'sim')) return true;
  if (isTargetFalse && expectedValues.some(v => v === 'false' || v === 'nao')) return true;

  return false;
}

export function validateFieldValue(
  field: SecondaryFieldConfig,
  value: any
): { isValid: boolean; errorMessage?: string } {
  if (value === undefined || value === null || value === '') {
    return { isValid: true };
  }

  const strVal = String(value).trim();
  const type = field.validationType;
  if (!type || type === 'none') return { isValid: true };

  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(strVal)) return { isValid: false, errorMessage: 'E-mail em formato inválido.' };
  }

  if (type === 'phone') {
    const digits = strVal.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      return { isValid: false, errorMessage: 'Telefone inválido (informe DDD + 8 ou 9 dígitos).' };
    }
  }

  if (type === 'process_number') {
    const processRegex = /^\d{6}\/\d{4}$/;
    if (!processRegex.test(strVal)) {
      return { isValid: false, errorMessage: 'Número de processo inválido (padrão obrigatório: 000000/0000).' };
    }
  }

  if (type === 'cpf_cnpj') {
    const digits = strVal.replace(/\D/g, '');
    if (digits.length !== 11 && digits.length !== 14) {
      return { isValid: false, errorMessage: 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido.' };
    }
  }

  if (type === 'custom_regex' && field.validationRegex) {
    try {
      const regex = new RegExp(field.validationRegex);
      if (!regex.test(strVal)) {
        return { isValid: false, errorMessage: field.validationMessage || 'Valor fora do padrão exigido.' };
      }
    } catch {
      return { isValid: false, errorMessage: 'Expressão regular de validação malformada.' };
    }
  }

  return { isValid: true };
}

export function formatFieldValue(type?: string, val?: string): string {
  if (!val || typeof val !== 'string') return val || '';
  if (type === 'process_number') {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length > 6) {
      return `${digits.slice(0, 6)}/${digits.slice(6)}`;
    }
    return digits;
  }
  if (type === 'phone') {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 2) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return digits.length > 0 ? `(${digits}` : digits;
  }
  return val;
}
