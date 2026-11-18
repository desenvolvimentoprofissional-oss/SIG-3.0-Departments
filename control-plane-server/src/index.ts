import express from 'express';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { requireAuth } from './middlewares/auth.middleware.js';
import { webhookRouter } from './routes/webhooks.js';
import { DEFAULT_GEMINI_CONFIG, getGeminiClient } from './services/gemini-client.service.js';
import { handleSanitize } from './services/pii-sanitization.service.js';
import admin from 'firebase-admin';

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      });
    } else {
      admin.initializeApp();
    }
  }
} catch (e) {
  console.error("Firebase Admin initialization error:", e instanceof Error ? e.message : "Unknown Error");
}

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("FAIL-FAST: GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are not defined. Aborting execution.");
  process.exit(1);
}

app.get('/api/auth/url', (req, res) => {

  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const redirectUri = `${protocol}://${host}/api/auth/callback`;

  const oauth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });

  res.json({ url: authUrl, redirectUri });
});

const extrairGoogleUserInfo = async (code: string, redirectUri: string) => {
  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, redirectUri);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const response = await oauth2Client.request({ url: 'https://www.googleapis.com/oauth2/v1/userinfo' });
  return { user: response.data as any, tokens };
};

const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  return 'Unknown error';
};

const canCreateToken = (): boolean => admin.apps.length > 0;

const resolveOrCreateFirebaseUser = async (user: any): Promise<string> => {
  if (!canCreateToken()) return '';
  try {
    return await admin.auth().createCustomToken(user.id);
  } catch (e) {
    console.warn('Failed to create custom token:', getErrorMessage(e));
    return '';
  }
};

const emitirCookiesAutenticacao = (res: express.Response, tokens: any, customToken: string) => {
  const cookieOptions = {
    secure: true,
    sameSite: 'none' as const,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  };
  res.cookie('auth_token', tokens.id_token, cookieOptions);
  res.cookie('google_access_token', tokens.access_token, cookieOptions);
  if (customToken) {
    res.cookie('custom_token', customToken, cookieOptions);
  }
};

const getProtocol = (req: express.Request): string => {
  const forwarded = req.headers['x-forwarded-proto'];
  if (forwarded) return String(forwarded);
  return req.protocol;
};

const getRedirectUri = (req: express.Request): string => {
  const protocol = getProtocol(req);
  const host = req.get('host');
  return `${protocol}://${host}/api/auth/callback`;
};

const getErrorCode = (error: unknown): string | undefined => {
  if (!error) return undefined;
  if (typeof error !== 'object') return undefined;
  return (error as any).code;
};

const logCallbackError = (error: unknown): void => {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);
  console.error('Error exchanging code:', { message, code });
};

app.get('/api/auth/callback', async (req, res) => {
  const code = req.query.code as string;
  const redirectUri = getRedirectUri(req);

  try {
    const { user, tokens } = await extrairGoogleUserInfo(code, redirectUri);
    const customToken = await resolveOrCreateFirebaseUser(user);
    emitirCookiesAutenticacao(res, tokens, customToken);

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS'
              }, window.location.origin);
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Autenticação concluída. Esta janela fechará automaticamente.</p>
        </body>
      </html>
    `);
  } catch (error) {
    logCallbackError(error);
    res.status(500).send('Authentication failed');
  }
});

const isUserObject = (user: unknown): user is Record<string, any> => {
  if (!user) return false;
  return typeof user === 'object';
};

const getCandidateKeys = (user: Record<string, any>): (string | number | undefined)[] => [user.sub, user.uid, user.id];

const extractUid = (user: unknown): string | null => {
  if (!isUserObject(user)) return null;
  const found = getCandidateKeys(user).find(Boolean);
  if (!found) return null;
  return String(found);
};

const createAndSetCustomToken = async (res: express.Response, uid: string): Promise<void> => {
  if (!canCreateToken()) return;
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    res.cookie('custom_token', customToken, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
  } catch (e) {
    console.warn('Failed to create custom token in /me:', getErrorMessage(e));
  }
};


const ensureCustomToken = async (req: express.Request, res: express.Response, user: any) => {
  const customToken = req.cookies.custom_token;
  if (customToken) return;
  
  const uid = extractUid(user);
  if (!uid) return;
  
  await createAndSetCustomToken(res, uid);
};

const handleAuthMe = async (req: any, res: any) => {
  try {
    await ensureCustomToken(req, res, req.user);
    res.json({ user: req.user });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
app.get('/api/auth/me', requireAuth, handleAuthMe);

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  res.clearCookie('google_access_token', {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  res.clearCookie('custom_token', {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  res.json({ success: true });
});

app.post('/api/security/sanitize-pii', requireAuth, handleSanitize);

app.use('/api', webhookRouter);

app.get('/api/gemini/config', requireAuth, (req, res) => {
  res.json({
    success: true,
    engine: 'Gemini 3.1 Pro Service',
    deterministicConfig: DEFAULT_GEMINI_CONFIG,
    clientInitialized: !!process.env.GEMINI_API_KEY
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.join(process.cwd(), 'front-end-client'),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
