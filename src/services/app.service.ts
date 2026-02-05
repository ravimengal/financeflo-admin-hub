 import { httpService } from './api/http';
 
 export interface App {
   id: string;
   name: string;
   description: string;
   status: 'active' | 'inactive' | 'pending';
   users: number;
   createdAt: string;
   icon?: string;
 }
 
 class AppService {
   // Get list of apps
   async getApps(): Promise<App[]> {
     return httpService.get('/apps');
   }
 
   // Get single app
   async getApp(appId: string): Promise<App> {
     return httpService.get(`/apps/${appId}`);
   }
 
   // Create app
   async createApp(data: Omit<App, 'id'>): Promise<App> {
     return httpService.post('/apps', data);
   }
 
   // Update app
   async updateApp(appId: string, data: Partial<App>): Promise<App> {
     return httpService.put(`/apps/${appId}`, data);
   }
 
   // Delete app
   async deleteApp(appId: string): Promise<void> {
     return httpService.delete(`/apps/${appId}`);
   }
 }
 
 export const appService = new AppService();