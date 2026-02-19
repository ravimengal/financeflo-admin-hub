import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApis } from '@/services';
import type { User } from '@/services';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApis.getUsers(),
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userApis.getUser(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<User, 'id'>) => userApis.createUser(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      userApis.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userApis.deleteUser(userId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: User['role'] }) =>
      userApis.changeRole(userId, role),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
