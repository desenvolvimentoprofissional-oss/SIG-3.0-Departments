import SHA256 from 'crypto-js/sha256';

const SAFE_FIELDS = ['id', 'status', 'code', 'type', 'timestamp', 'tenantId', 'departmentId', 'action', 'pageName', 'collection', 'name', 'message', 'error', 'details', 'reason'];

function hashValue(val: any): string {
  const rawValue = String(val);
  const salt = import.meta.env.VITE_LOG_SALT || import.meta.env.VITE_DB_SALT;
  if (!salt) {
    throw new Error("INFRASTRUCTURE_ERROR: VITE_LOG_SALT or VITE_DB_SALT environment variable is required for PII anonymization (LGPD Art. 13).");
  }
  return `[REDACTED:${SHA256(rawValue + salt).toString().substring(0, 8)}]`;
}

function isSafeKey(key: string): boolean {
  return SAFE_FIELDS.includes(key);
}

function processPrimitive(key: string, value: any): any {
  if (typeof value === 'string' && value.includes('@')) {
    return value.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match) => hashValue(match));
  }
  if (isSafeKey(key)) return value;
  return hashValue(value);
}

function processNode(key: string, value: any): any {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'object') return processPrimitive(key, value);
  return processObject(value);
}

function processObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(item => processNode('array_item', item));
  const result: any = {};
  for (const k of Object.keys(obj)) {
    result[k] = processNode(k, obj[k]);
  }
  return result;
}

function obfuscatePII(obj: any): any {
  if (obj === undefined || obj === null) return obj;
  if (typeof obj !== 'object') return hashValue(obj);
  return processObject(obj);
}

const safeStringify = (metadata: Record<string, any>) => JSON.stringify(obfuscatePII(metadata));

export const sanitizeErrorForTelemetry = (err: unknown): { name: string; message: string; code: string } => {
  if (err instanceof Error) {
    let msg = err.message || "";
    if (msg.includes("@")) {
      msg = msg.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match) => hashValue(match));
      if (msg.includes("@")) msg = hashValue(msg);
    }
    return {
      name: err.name,
      message: msg,
      code: (err as any).code || "UNKNOWN_ERR"
    };
  }
  if (typeof err === "object" && err !== null) {
    const e = err as any;
    let msg = String(e.message || "Unknown error object");
    if (msg.includes("@")) {
      msg = msg.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match) => hashValue(match));
      if (msg.includes("@")) msg = hashValue(msg);
    }
    return {
      name: String(e.name || "Error"),
      message: msg,
      code: String(e.code || "UNKNOWN_ERR")
    };
  }
  let str = String(err || "Unknown string error");
  if (str.includes("@")) str = hashValue(str);
  return { name: "Error", message: str, code: "GENERIC" };
};

export const logger = {
  error: (errorCode: string, metadata: Record<string, any> = {}) => {
    console.error(`[ERROR] ${errorCode}`, safeStringify(metadata));
  },
  warn: (warnCode: string, metadata: Record<string, any> = {}) => {
    console.warn(`[WARN] ${warnCode}`, safeStringify(metadata));
  },
  info: (infoCode: string, metadata: Record<string, any> = {}) => {
    console.info(`[INFO] ${infoCode}`, safeStringify(metadata));
  }
};
