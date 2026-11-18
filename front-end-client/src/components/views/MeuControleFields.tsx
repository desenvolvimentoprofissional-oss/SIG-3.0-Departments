import React from 'react';
import { isFieldVisible, validateFieldValue, formatFieldValue } from '../../lib/fieldValidation.util';

export const MeuControleFields = ({ fields, fieldsData, handleFieldChange, isSaving, isObservation, selectedItem }: any) => {
  return (
    <>
      {fields.map((f: any) => {
        if (!isFieldVisible(f, fieldsData, selectedItem)) return null;
        
        const validation = validateFieldValue(f, fieldsData[f.field]);
        const hasError = !validation.isValid && fieldsData[f.field] !== undefined && fieldsData[f.field] !== '';
        const borderClass = hasError ? "border-red-500 bg-red-50/10 focus:border-red-600" : "border-[var(--color-border-default)] focus:border-[var(--color-brand-main)]";
        const inputClassName = `w-full bg-[var(--color-content-inverse)] border ${borderClass} rounded px-3 py-2 text-sm text-[var(--color-content-primary)] focus:outline-none focus:ring-0 transition-colors`;

        return (
          <div key={f.id} className={isObservation ? "mb-3" : "mb-3"}>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">{f.label}</label>
            {f.type === 'select' ? (
              <select
                className={inputClassName}
                value={fieldsData[f.field] || ''}
                onChange={(e) => handleFieldChange(f.field, e.target.value, f.type)}
                disabled={isSaving}
              >
                 <option value="">Selecione...</option>
                 {f.optionsList ? f.optionsList.split(',').map((opt: string) => (
                    <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                 )) : (
                    !isObservation && <option value={fieldsData[f.field] || ''}>{fieldsData[f.field] || ''}</option>
                 )}
              </select>
             ) : f.type === 'date' ? (
              <input 
                 type="date"
                 className={inputClassName}
                 value={fieldsData[f.field] ? (fieldsData[f.field].includes('T') ? fieldsData[f.field].split('T')[0] : (fieldsData[f.field].includes(' ') ? fieldsData[f.field].split(' ')[0] : fieldsData[f.field])) : ''}
                 onChange={(e) => {
                   let val = e.target.value;
                   if (!isObservation && fieldsData[f.field]) {
                     if (fieldsData[f.field].includes('T')) {
                       val = `${val}T${fieldsData[f.field].split('T')[1] || '00:00:00'}`;
                     } else if (fieldsData[f.field].includes(' ')) {
                       val = `${val} ${fieldsData[f.field].split(' ')[1] || '00:00:00'}`;
                     }
                   }
                   handleFieldChange(f.field, val, f.type);
                 }}
                 disabled={isSaving}
              />
            ) : f.type === 'number' ? (
              <input 
                 type="number"
                 className={inputClassName}
                 value={fieldsData[f.field] || ''}
                 onChange={(e) => handleFieldChange(f.field, e.target.value, f.type)}
                 disabled={isSaving}
              />
            ) : f.type === 'boolean' ? (
              <select
                className={inputClassName}
                value={fieldsData[f.field] !== undefined ? String(fieldsData[f.field]) : ''}
                onChange={(e) => {
                   const val = e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined;
                   handleFieldChange(f.field, isObservation ? val : String(val), f.type);
                }}
                disabled={isSaving}
              >
                 <option value="">Selecione...</option>
                 <option value="true">Sim</option>
                 <option value="false">Não</option>
              </select>
            ) : (
              <input 
                 type="text"
                 className={inputClassName}
                 value={fieldsData[f.field] || ''}
                 onChange={(e) => {
                   const formatted = formatFieldValue(f.validationType, e.target.value);
                   handleFieldChange(f.field, formatted, 'text');
                 }}
                 disabled={isSaving}
              />
            )}
            {hasError && (
              <p className="text-[11px] text-red-600 font-medium mt-1">
                ⚠️ {validation.errorMessage}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
};
