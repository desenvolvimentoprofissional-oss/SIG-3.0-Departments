function extractTime(val: any): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object') {
    if (val.seconds) return val.seconds * 1000;
    if (val._seconds) return val._seconds * 1000;
    if (typeof val.toDate === 'function') return val.toDate().getTime();
    if (val instanceof Date) return val.getTime();
  }
  if (typeof val === 'number') return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (/^\d+$/.test(trimmed)) {
      return null;
    }
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        const d = new Date(`${parts[2].substring(0,4)}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00Z`);
        if (!isNaN(d.getTime())) return d.getTime();
      }
    }
    
    let isoString = trimmed.replace(' ', 'T');
    if (isoString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      isoString += 'T00:00:00Z';
    } else if (isoString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) && !isoString.endsWith('Z')) {
      isoString += 'Z';
    }
    
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) return d.getTime();
    
    const fallbackD = new Date(trimmed);
    if (!isNaN(fallbackD.getTime())) return fallbackD.getTime();
  }
  return null;
}

export function evaluateCondition(value: any, rawOperator: string, target: any): boolean {
  let operator = rawOperator;
  if (operator === 'EQUALS') operator = '==';
  if (operator === 'NOT_EQUALS') operator = '!=';
  if (operator === 'GREATER_THAN') operator = '>';
  if (operator === 'LESS_THAN') operator = '<';
  if (operator === 'GREATER_THAN_OR_EQUALS') operator = '>=';
  if (operator === 'LESS_THAN_OR_EQUALS') operator = '<=';

  if (value === null || value === undefined || value === '') {
    if (target === null || target === undefined || target === '') {
       if (operator === '==' || operator === '<=' || operator === '>=') return true;
       return false;
    }
    if (operator === '!=') return true;
    return false;
  }

  const timeVal = extractTime(value);
  const timeTarget = extractTime(target);

  if (timeVal !== null && timeTarget !== null) {
    switch (operator) {
      case '==':
        if (timeVal === timeTarget) return true;
        if (String(value).trim().startsWith(String(target).trim())) return true;
        return false;
      case '!=': 
        if (timeVal !== timeTarget) {
          return !String(value).trim().startsWith(String(target).trim());
        }
        return false;
      case '>': return timeVal > timeTarget;
      case '>=': return timeVal >= timeTarget;
      case '<': return timeVal < timeTarget;
      case '<=': return timeVal <= timeTarget;
      default: return false;
    }
  }

  const numVal = typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value;
  const numTarget = typeof target === 'string' && !isNaN(Number(target)) && target.trim() !== '' ? Number(target) : target;

  if (typeof numVal === 'number' && typeof numTarget === 'number') {
    switch (operator) {
      case '==': return numVal === numTarget;
      case '!=': return numVal !== numTarget;
      case '>': return numVal > numTarget;
      case '>=': return numVal >= numTarget;
      case '<': return numVal < numTarget;
      case '<=': return numVal <= numTarget;
      default: return false;
    }
  }

  const strVal = String(value || '').trim().toLowerCase();
  const strTarget = String(target || '').trim().toLowerCase();

  switch (operator) {
    case '==': return strVal === strTarget;
    case '!=': return strVal !== strTarget;
    case '>': return strVal > strTarget;
    case '>=': return strVal >= strTarget;
    case '<': return strVal < strTarget;
    case '<=': return strVal <= strTarget;
    case 'CONTAINS': return strVal.includes(strTarget);
    default: return false;
  }
}

export function extractDateByGranularity(value: any, granularity: 'YEAR' | 'MONTH' | 'DAY'): string {
  if (!value) return 'Nenhuma Data';
  
  const time = extractTime(value);
  if (time === null) return String(value);

  const d = new Date(time);

  if (granularity === 'YEAR') {
    return String(d.getUTCFullYear());
  } else if (granularity === 'MONTH') {
    return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
  } else if (granularity === 'DAY') {
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
  }
  return String(value);
}
