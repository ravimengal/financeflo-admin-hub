 import { httpService } from './api/http';
 
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
 
 class UserService {
   // Get list of users
   async getUsers(): Promise<User[]> {
     return httpService.get('/iam/users');
   }
 
   // Get single user
   async getUser(userId: string): Promise<User> {
     return httpService.get(`/iam/users/${userId}`);
   }
 
   // Create user
   async createUser(data: Omit<User, 'id'>): Promise<User> {
     return httpService.post('/iam/users', data);
   }
 
   // Update user
   async updateUser(userId: string, data: Partial<User>): Promise<User> {
     return httpService.put(`/iam/users/${userId}`, data);
   }
 
   // Delete user
   async deleteUser(userId: string): Promise<void> {
     return httpService.delete(`/iam/users/${userId}`);
   }
 
   // Change user role
   async changeRole(userId: string, role: User['role']): Promise<User> {
     return httpService.put(`/iam/users/${userId}/role`, { role });
   }
 }
 
 export const userService = new UserService();