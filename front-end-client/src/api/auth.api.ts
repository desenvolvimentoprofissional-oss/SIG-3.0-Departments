import { Firestore, doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { UserSessionProfile } from '../types/index';
import { z } from 'zod';

const AuthUrlResponseSchema = z.object({
  url: z.string().url(),
  redirectUri: z.string()
});

const CurrentUserResponseSchema = z.object({
  user: z.record(z.string(), z.any()),
  customToken: z.string().optional(),
  idToken: z.string().optional()
});

export const getCurrentUserAPI = async (): Promise<any> => {
  const response = await fetch('/api/auth/me');
  if (response.ok) {
    const data = await response.json();
    return CurrentUserResponseSchema.parse(data);
  }
  return null;
};

export const getAuthUrlAPI = async (): Promise<{ url: string; redirectUri: string }> => {
  const response = await fetch('/api/auth/url');
  if (!response.ok) {
    throw new Error('Failed to get auth URL');
  }
  const data = await response.json();
  return AuthUrlResponseSchema.parse(data);
};

const checkDomainAuth = (email: string): boolean => {
  return email.endsWith('@crasp.org.br');
};

const getPreApprovalDoc = async (db: Firestore, email: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : querySnapshot.docs[0];
};

const buildExistingUserProfile = (googleUser: UserSessionProfile, existingData: UserSessionProfile): UserSessionProfile => {
  return {
    ...existingData,
    name: googleUser.name || existingData.name,
    avatarUrl: googleUser.avatarUrl || existingData.avatarUrl,
  };
};

const getProfileName = (gName?: string, pName?: string): string => gName || pName || 'Sistema';
const getProfileAvatar = (gAvatar?: string, pAvatar?: string): string => gAvatar || pAvatar || '';

const mapUserProfile = (googleUser: UserSessionProfile, preProvData: UserSessionProfile) => {
  const name = getProfileName(googleUser.name, preProvData.name);
  const avatarUrl = getProfileAvatar(googleUser.avatarUrl, preProvData.avatarUrl);
  return {
    ...googleUser,
    ...preProvData,
    uid: googleUser.uid,
    name,
    avatarUrl
  };
};

const sanitizeUserPermissions = (preProvData: UserSessionProfile): Partial<UserSessionProfile> => {
  return {
    role: preProvData.role || 'COLABORADOR',
    status: preProvData.status || 'PENDING_APPROVAL',
    departmentId: preProvData.departmentId || null,
    assignedArea: preProvData.assignedArea || null,
    viewerDepartments: preProvData.viewerDepartments || [],
    viewerPages: preProvData.viewerPages || []
  };
};

const buildInitialHistoryLog = (name: string, existingLogs: any[] = []) => {
  return [
    {
      action: 'Primeiro Acesso',
      details: 'O usuário ativou a conta pré-aprovada.',
      performedBy: name,
      timestamp: Date.now()
    },
    ...existingLogs
  ];
};

const buildPreApprovedProfile = (googleUser: UserSessionProfile, preProvData: UserSessionProfile): UserSessionProfile => {
  const baseProfile = mapUserProfile(googleUser, preProvData);
  const sanitizedPerms = sanitizeUserPermissions(preProvData);
  const historyLog = buildInitialHistoryLog(baseProfile.name, preProvData.historyLog);
  return {
    ...baseProfile,
    ...sanitizedPerms,
    historyLog
  };
};

const buildNewUserProfile = (googleUser: UserSessionProfile): UserSessionProfile => {
  return {
    ...googleUser,
    historyLog: [{
      action: 'Solicitação de Acesso',
      details: 'O usuário realizou o primeiro login na plataforma solicitando acesso.',
      performedBy: googleUser.name || 'Sistema',
      timestamp: Date.now()
    }]
  };
};

type AuthStrategy = 'REJECT' | 'EXISTING' | 'PRE_APPROVED' | 'NEW';

const resolveNewOrReject = (isCraspDomain: boolean): AuthStrategy => {
  return isCraspDomain ? 'NEW' : 'REJECT';
};

const resolvePreProv = (isCraspDomain: boolean, hasPreProv: boolean): AuthStrategy => {
  return hasPreProv ? 'PRE_APPROVED' : resolveNewOrReject(isCraspDomain);
};

const evaluateAuthStrategy = (isCraspDomain: boolean, hasPreProv: boolean, hasExisting: boolean): AuthStrategy => {
  return hasExisting ? 'EXISTING' : resolvePreProv(isCraspDomain, hasPreProv);
};

const handleExistingUser = async (userRef: any, googleUser: UserSessionProfile, userSnap: any): Promise<UserSessionProfile> => {
  const userProfile = buildExistingUserProfile(googleUser, userSnap.data() as UserSessionProfile);
  await setDoc(userRef, userProfile);
  return userProfile;
};

const handlePreApprovedUser = async (userRef: any, googleUser: UserSessionProfile, preProvDoc: any): Promise<UserSessionProfile> => {
  const userProfile = buildPreApprovedProfile(googleUser, preProvDoc.data() as UserSessionProfile);
  await setDoc(userRef, userProfile);
  if (preProvDoc.id !== googleUser.uid) {
    await deleteDoc(preProvDoc.ref);
  }
  return userProfile;
};

const handleNewUser = async (userRef: any, googleUser: UserSessionProfile): Promise<UserSessionProfile> => {
  const userProfile = buildNewUserProfile(googleUser);
  await setDoc(userRef, userProfile);
  return userProfile;
};

const strategyHandlers: Record<AuthStrategy, Function> = {
  'REJECT': (userRef: any, googleUser: UserSessionProfile) => ({ ...googleUser, status: 'REJECTED_DOMAIN' }),
  'EXISTING': handleExistingUser,
  'PRE_APPROVED': (userRef: any, googleUser: UserSessionProfile, userSnap: any, preProvDoc: any) => handlePreApprovedUser(userRef, googleUser, preProvDoc),
  'NEW': handleNewUser
};

export const syncUserSessionAPI = async (db: Firestore, googleUser: UserSessionProfile): Promise<UserSessionProfile> => {
  const userRef = doc(db, 'users', googleUser.uid);
  const userSnap = await getDoc(userRef);
  const preProvDoc = await getPreApprovalDoc(db, googleUser.email);
  const isCraspDomain = checkDomainAuth(googleUser.email);
  const strategy = evaluateAuthStrategy(isCraspDomain, !!preProvDoc, userSnap.exists());
  return strategyHandlers[strategy](userRef, googleUser, userSnap, preProvDoc);
};
