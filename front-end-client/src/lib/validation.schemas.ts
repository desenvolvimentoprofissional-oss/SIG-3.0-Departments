import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'MASTER',
  'ADMIN',
  'COLABORADOR',
  'CONVIDADO'
]);

export const UserStatusSchema = z.enum([
  'PENDING_APPROVAL',
  'ACTIVE',
  'SUSPENDED',
  'REJECTED',
  'REJEITADO',
  'INACTIVE',
  'REJECTED_DOMAIN'
]);

export const UserSessionProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().or(z.literal('')),
  domain: z.string().min(1).max(100),
  role: UserRoleSchema,
  status: UserStatusSchema,
  primaryTenantId: z.string().min(1),
  assignedArea: z.string().nullable(),
  departmentId: z.string().nullable(),
  viewerDepartments: z.array(z.string()),
  viewerPages: z.array(z.string()).optional(),
  historyLog: z.array(z.object({
    timestamp: z.number(),
    action: z.string(),
    details: z.string(),
    performedBy: z.string()
  })).optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional()
});

export const TenantFirebaseConfigSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().optional(),
  messagingSenderId: z.string().optional(),
  appId: z.string().optional(),
  measurementId: z.string().optional()
});

export const TenantConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  area: z.string().min(1).max(100),
  iconId: z.string().optional(),
  firebaseConfig: TenantFirebaseConfigSchema.optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.number()
});

