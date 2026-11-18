import { Request, Response, NextFunction } from 'express';
import { AuthPayloadSchema } from '../schemas/auth.schema.js';
import admin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';

interface TokenValidationResult {
  token?: string;
  status: number;
  error?: string;
}

const validateTokenInput = (token?: string): TokenValidationResult => {
  if (!token) {
    return { status: 401, error: 'UNAUTHORIZED: Missing token' };
  }
  const parseResult = AuthPayloadSchema.safeParse({ id_token: token });
  if (!parseResult.success) {
    return { status: 403, error: 'FORBIDDEN: Invalid token structure. Access denied.' };
  }
  return { token: parseResult.data.id_token, status: 200 };
};

const verifyGoogleToken = async (token: string, clientId?: string): Promise<any> => {
  if (!clientId) return null;
  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: token, audience: clientId });
    return ticket.getPayload();
  } catch {
    return null;
  }
};

const verifyFirebaseToken = async (token: string): Promise<any> => {
  if (admin.apps.length === 0) return null;
  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    return null;
  }
};

const resolveTokenPayload = async (token: string): Promise<any> => {
  const googlePayload = await verifyGoogleToken(token, process.env.GOOGLE_OAUTH_CLIENT_ID);
  if (googlePayload) return googlePayload;
  return await verifyFirebaseToken(token);
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const tokenCheck = validateTokenInput(req.cookies?.auth_token);
  if (!tokenCheck.token) {
    return res.status(tokenCheck.status).json({ error: tokenCheck.error });
  }

  const verifiedUser = await resolveTokenPayload(tokenCheck.token);
  if (!verifiedUser) {
    return res.status(401).json({ error: 'UNAUTHORIZED: Cryptographic token signature verification failed.' });
  }

  (req as any).user = verifiedUser;
  req.body.sanitizedToken = tokenCheck.token;
  next();
};

