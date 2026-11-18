export type UserRole =
  "MASTER" | "ADMIN" | "COLABORADOR" | "CONVIDADO";

export type UserStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "SUSPENDED"
  | "REJECTED"
  | "REJEITADO"
  | "INACTIVE"
  | "REJECTED_DOMAIN";

export interface UserSessionProfile {
  uid: string;
  email: string;
  name: string;
  avatarUrl: string;
  domain: string;
  role: UserRole;
  status: UserStatus;
  primaryTenantId: string;
  assignedArea: string | null;
  departmentId: string | null;
  viewerDepartments: string[];
  viewerPages?: string[];
  historyLog?: Array<{
    timestamp: number;
    action: string;
    details: string;
    performedBy: string;
  }>;
  createdAt?: number;
  updatedAt?: number;
}

export interface TenantConfig {
  id: string;
  name: string;
  area: string;
  iconId?: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  };
  isActive: boolean;
  createdAt: number;
}
