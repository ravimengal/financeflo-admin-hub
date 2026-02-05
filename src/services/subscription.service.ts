 import { httpService } from './api/http';
 
 export interface Plan {
   id: string;
   name: string;
   price: number;
   period: 'monthly' | 'yearly';
   features: string[];
 }
 
 export interface Subscription {
   id: string;
   planId: string;
   status: 'active' | 'cancelled' | 'expired';
   currentPeriodEnd: string;
   usage: {
     storage: { used: number; total: number };
     users: { used: number; total: number };
     apiCalls: { used: number; total: number };
   };
 }
 
 class SubscriptionService {
   // Get current subscription
   async getCurrentSubscription(): Promise<Subscription> {
     return httpService.get('/billing/subscription');
   }
 
   // Get available plans
   async getPlans(): Promise<Plan[]> {
     return httpService.get('/billing/plans');
   }
 
   // Upgrade plan
   async upgradePlan(planId: string): Promise<Subscription> {
     return httpService.post('/billing/upgrade', { planId });
   }
 
   // Cancel subscription
   async cancelSubscription(): Promise<void> {
     return httpService.delete('/billing/subscription');
   }
 }
 
 export const subscriptionService = new SubscriptionService();