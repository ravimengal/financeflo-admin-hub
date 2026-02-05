 import { httpService } from './api/http';
 
 export interface Organization {
   id: string;
   name: string;
   description?: string;
   website?: string;
   email?: string;
   phone?: string;
   logo?: string;
 }
 
 class OrganizationService {
   // Get list of organizations
   async getMyOrgs(): Promise<Organization[]> {
     return httpService.get('/iam/organization/getMyOrgs');
   }
 
   // Get single organization
   async getOrg(orgId: string): Promise<Organization> {
     return httpService.get(`/iam/organization/${orgId}`);
   }
 
   // Update organization
   async updateOrg(orgId: string, data: Partial<Organization>): Promise<Organization> {
     return httpService.put(`/iam/organization/${orgId}`, data);
   }
 
   // Upload organization logo
   async uploadLogo(orgId: string, file: File): Promise<{ logoUrl: string }> {
     const formData = new FormData();
     formData.append('logo', file);
     // Note: For file uploads, you'd typically use a different endpoint
     return httpService.post(`/iam/organization/${orgId}/logo`, formData);
   }
 }
 
 export const organizationService = new OrganizationService();