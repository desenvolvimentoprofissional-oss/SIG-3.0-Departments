function sanitizeArray(arr: any[]): any[] {
  return arr.map(sanitizeForFirestore).filter(v => v !== undefined);
}

function sanitizeObject(obj: any): any {
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const sanitized = sanitizeForFirestore(obj[key]);
    if (sanitized !== undefined) {
      result[key] = sanitized;
    }
  }
  return result;
}

function isPrimitive(obj: any): boolean {
  return obj === null || typeof obj !== 'object' || obj instanceof Date;
}

export function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) return undefined;
  if (isPrimitive(obj)) return obj;
  if (Array.isArray(obj)) return sanitizeArray(obj);
  return sanitizeObject(obj);
}
