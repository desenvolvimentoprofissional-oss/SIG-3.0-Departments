const fs = require('fs');
let code = fs.readFileSync('control-plane-server/src/index.ts', 'utf8');

const processRecordOld = `const processRecord = (record: any, serverSalt: string) => {
  if (!record || typeof record !== 'object') return record;
  const safeRecord: any = {};
  for (const key of Object.keys(record)) {
    safeRecord[key] = isSensitiveServer(key, record[key]) ? hashValueServer(record[key], serverSalt) : record[key];
  }
  return safeRecord;
};`;

const processRecordNew = `const sanitizeField = (key: string, value: any, serverSalt: string) => {
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
};`;

code = code.replace(processRecordOld, processRecordNew);

const authMeOld = `app.get('/api/auth/me', requireAuth, async (req, res) => {
  const token = req.cookies.auth_token;
  const user = (req as any).user;
  if (!token || !user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    let customToken = req.cookies.custom_token || '';
    if (!customToken) {
      try {
        if (admin.apps.length > 0) {
          const uid = user.sub || user.uid || user.id;
          if (uid) {
            customToken = await admin.auth().createCustomToken(uid);
            res.cookie('custom_token', customToken, {
              secure: true,
              sameSite: 'none',
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000
            });
          }
        }
      } catch (e) {
        console.warn('Failed to create custom token in /me:', e instanceof Error ? e.message : 'Unknown error');
      }
    }
    
    res.json({ user });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});`;

const authMeNew = `const extractUid = (user: any) => user?.sub || user?.uid || user?.id || null;

const createAndSetCustomToken = async (res: express.Response, uid: string) => {
  try {
    if (admin.apps.length === 0) return;
    const customToken = await admin.auth().createCustomToken(uid);
    res.cookie('custom_token', customToken, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
  } catch (e) {
    console.warn('Failed to create custom token in /me:', e instanceof Error ? e.message : 'Unknown error');
  }
};

const ensureCustomToken = async (req: express.Request, res: express.Response, user: any) => {
  const customToken = req.cookies.custom_token;
  if (customToken) return;
  
  const uid = extractUid(user);
  if (!uid) return;
  
  await createAndSetCustomToken(res, uid);
};

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const token = req.cookies.auth_token;
  const user = (req as any).user;
  
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  try {
    await ensureCustomToken(req, res, user);
    res.json({ user });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});`;

code = code.replace(authMeOld, authMeNew);

fs.writeFileSync('control-plane-server/src/index.ts', code);
