import { httpService } from './api/http';

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

class SubscriptionService {
  async getCurrentSubscription(): Promise<Subscription> {
    return httpService.get('/billing/subscription');
  }

  async getMarketplaceApps(): Promise<MarketplaceApp[]> {
    return httpService.get('/billing/marketplace');
  }

  async installApp(appId: string, creditTier?: string): Promise<SubscribedApp> {
    return httpService.post('/billing/install', { appId, creditTier });
  }

  async uninstallApp(subscribedAppId: string): Promise<void> {
    return httpService.delete(`/billing/apps/${subscribedAppId}`);
  }

  async upgradeAppCredits(subscribedAppId: string, newCredits: Partial<AppCredit>): Promise<SubscribedApp> {
    return httpService.put(`/billing/apps/${subscribedAppId}/credits`, newCredits);
  }
}

export const subscriptionService = new SubscriptionService();
