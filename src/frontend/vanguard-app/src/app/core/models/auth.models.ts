export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
}

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
}

export interface RegisterTenantRequest {
  organizationName: string;
  organizationSlug: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
  adminRole?: string;
  workflowVolume?: string;
  cloudRegion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  traceId?: string;
}
