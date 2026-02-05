 import { getRequestHeaders, buildApiUrl } from './config';
 
 interface RequestOptions {
   orgId?: string;
   userId?: string;
   headers?: Record<string, string>;
 }
 
 class HttpService {
   private defaultOrgId = '';
   private defaultUserId = '';
 
   setDefaultContext(orgId: string, userId: string) {
     this.defaultOrgId = orgId;
     this.defaultUserId = userId;
   }
 
   private getHeaders(options?: RequestOptions): Record<string, string> {
     const orgId = options?.orgId || this.defaultOrgId;
     const userId = options?.userId || this.defaultUserId;
     return {
       ...getRequestHeaders(orgId, userId),
       ...options?.headers,
     };
   }
 
   async get<T>(path: string, options?: RequestOptions): Promise<T> {
     const response = await fetch(buildApiUrl(path), {
       method: 'GET',
       headers: this.getHeaders(options),
     });
     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     return response.json();
   }
 
   async post<T>(path: string, data: unknown, options?: RequestOptions): Promise<T> {
     const response = await fetch(buildApiUrl(path), {
       method: 'POST',
       headers: this.getHeaders(options),
       body: JSON.stringify(data),
     });
     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     return response.json();
   }
 
   async put<T>(path: string, data: unknown, options?: RequestOptions): Promise<T> {
     const response = await fetch(buildApiUrl(path), {
       method: 'PUT',
       headers: this.getHeaders(options),
       body: JSON.stringify(data),
     });
     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     return response.json();
   }
 
   async delete<T>(path: string, options?: RequestOptions): Promise<T> {
     const response = await fetch(buildApiUrl(path), {
       method: 'DELETE',
       headers: this.getHeaders(options),
     });
     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     return response.json();
   }
 }
 
 export const httpService = new HttpService();