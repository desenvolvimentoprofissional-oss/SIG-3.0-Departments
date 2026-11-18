import crypto from 'crypto';

const ALLOWED_PUBLIC_KEYS = new Set([
  'id', 'name', 'title', 'label', 'type', 'status', 'departmentId', 'tenantId', 'departmentName',
  'description', 'category', 'date', 'timestamp', 'createdAt', 'updatedAt', 'priority', 'order', 'url', 'link',
  'icon', 'color', 'version', 'active', 'public', 'readOnly', 'collection', 'pageName', 'functionName', 'recordId',
  'role', 'permissions', 'assignedArea', 'createdBy', 'updatedBy', 'author', 'year', 'month', 'day', 'value',
  'amount', 'quantity', 'total', 'count', 'summary', 'details', 'observations', 'notes', 'tags', 'options', 'data'
]);

const isSensitiveServer = (key: string, value: any): boolean => {
  const isKeyUnlisted = !ALLOWED_PUBLIC_KEYS.has(key);
  const isValueSensitive = typeof value === "string" ? value.includes("@") : false;
  return isKeyUnlisted || isValueSensitive;
};

const hashValueServer = (val: any, serverSalt: string): string => {
  return crypto.createHash('sha256').update(String(val) + serverSalt).digest('hex');
};

const sanitizeField = (key: string, value: any, serverSalt: string) => {
  if (isSensitiveServer(key, value)) return hashValueServer(value, serverSalt);
  return value;
};

const buildSafeRecord = (record: any, serverSalt: string) => {
  const safeRecord: any = {};
  for (const key of Object.keys(record)) {
    safeRecord[key] = sanitizeField(key, record[key], serverSalt);
  }
  return safeRecord;
};

const processRecord = (record: any, serverSalt: string) => {
  if (!record) return record;
  if (typeof record !== 'object') return record;
  return buildSafeRecord(record, serverSalt);
};

const getSystemSalt = (): string | undefined => {
  if (process.env.SERVER_PII_SALT) return process.env.SERVER_PII_SALT;
  return process.env.LOG_SALT;
};

const validateSanitizeRequest = (req: any) => {
  if (!Array.isArray(req.body.records)) throw new Error('Payload must contain an array of records');
  const salt = getSystemSalt();
  if (!salt) throw new Error('SERVER_PII_SALT or LOG_SALT environment variable is required');
  return { records: req.body.records, salt };
};

export const handleSanitize = (req: any, res: any) => {
  try {
    const { records, salt } = validateSanitizeRequest(req);
    res.json({ success: true, sanitizedRecords: records.map((r: any) => processRecord(r, salt)) });
  } catch (error: any) {
    console.error('Error sanitizing PII:', error.message);
    res.status(500).json({ error: 'Failed to sanitize PII on backend' });
  }
};
