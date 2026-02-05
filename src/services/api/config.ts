 // API Configuration
 export const API_CONFIG = {
   APP_ID: '145',
   GATEWAY_ROUTER: '/api',
 };
 
 // Request headers builder
 export const getRequestHeaders = (orgId: string, userId: string) => ({
   'Accept': '*/*',
   'Content-Type': 'application/json',
   'X-orgID': orgId,
   'X-UserID': userId,
 });
 
 // Base API URL builder
 export const buildApiUrl = (path: string) => `${API_CONFIG.GATEWAY_ROUTER}${path}`;