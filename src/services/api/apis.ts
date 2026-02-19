import { httpService } from './http';

// ─── Types ────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastActive?: string;
  joinedAt?: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  users: number;
  createdAt: string;
  icon?: string;
}

export interface AppCredit {
  invoices: { used: number; total: number };
  transactions: { used: number; total: number };
  requests: { used: number; total: number };
  users: { used: number; total: number };
}

export interface SubscribedApp {
  id: string;
  appId: string;
  appName: string;
  appIcon?: string;
  appDescription: string;
  status: 'active' | 'expired' | 'trial';
  credits: AppCredit;
  installedAt: string;
  expiresAt: string;
}

export interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: string;
  pricing: {
    basePrice: number;
    period: 'monthly' | 'yearly';
    includedCredits: AppCredit;
  };
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'expired';
  installedApps: SubscribedApp[];
  totalMonthlySpend: number;
}

// ─── Organization APIs ────────────────────────────────────────────

export const organizationApis = {
  getMyOrgs: () =>
    httpService.get<Organization[]>('/iam/organization/getMyOrgs'),

  getOrg: (orgId: string) =>
    httpService.get<Organization>(`/iam/organization/${orgId}`),

  updateOrg: (orgId: string, data: Partial<Organization>) =>
    httpService.put<Organization>(`/iam/organization/${orgId}`, data),

  uploadLogo: (orgId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return httpService.post<{ logoUrl: string }>(`/iam/organization/${orgId}/logo`, formData);
  },
};

// ─── User APIs ────────────────────────────────────────────────────

export const userApis = {
  getUsers: (params?: { status?: string; role?: string }) =>
    httpService.get<User[]>('/iam/users', { params }),

  getUser: (userId: string) =>
    httpService.get<User>(`/iam/users/${userId}`),

  createUser: (data: Omit<User, 'id'>) =>
    httpService.post<User>('/iam/users', data),

  updateUser: (userId: string, data: Partial<User>) =>
    httpService.put<User>(`/iam/users/${userId}`, data),

  deleteUser: (userId: string) =>
    httpService.delete<void>(`/iam/users/${userId}`),

  changeRole: (userId: string, role: User['role']) =>
    httpService.put<User>(`/iam/users/${userId}/role`, { role }),
};

// ─── App APIs ─────────────────────────────────────────────────────

export const appApis = {
  getApps: (params?: { status?: string }) =>
    httpService.get<App[]>('/apps', { params }),

  getApp: (appId: string) =>
    httpService.get<App>(`/apps/${appId}`),

  createApp: (data: Omit<App, 'id'>) =>
    httpService.post<App>('/apps', data),

  updateApp: (appId: string, data: Partial<App>) =>
    httpService.put<App>(`/apps/${appId}`, data),

  deleteApp: (appId: string) =>
    httpService.delete<void>(`/apps/${appId}`),
};

// ─── Subscription / Billing APIs ──────────────────────────────────

export const subscriptionApis = {
  getCurrentSubscription: () =>
    httpService.get<Subscription>('/billing/subscription'),

  getMarketplaceApps: (params?: { category?: string }) =>
    httpService.get<MarketplaceApp[]>('/billing/marketplace', { params }),

  installApp: (appId: string, creditTier?: string) =>
    httpService.post<SubscribedApp>('/billing/install', { appId, creditTier }),

  uninstallApp: (subscribedAppId: string) =>
    httpService.delete<void>(`/billing/apps/${subscribedAppId}`),

  upgradeAppCredits: (subscribedAppId: string, newCredits: Partial<AppCredit>) =>
    httpService.put<SubscribedApp>(`/billing/apps/${subscribedAppId}/credits`, newCredits),
};
