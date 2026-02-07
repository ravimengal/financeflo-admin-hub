import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appService, App } from '@/services/app.service';

export const useApps = () => {
  return useQuery({
    queryKey: ['apps'],
    queryFn: () => appService.getApps(),
  });
};

export const useApp = (appId: string) => {
  return useQuery({
    queryKey: ['apps', appId],
    queryFn: () => appService.getApp(appId),
    enabled: !!appId,
  });
};

export const useCreateApp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<App, 'id'>) => appService.createApp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};

export const useUpdateApp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appId, data }: { appId: string; data: Partial<App> }) =>
      appService.updateApp(appId, data),
    onSuccess: (_, { appId }) => {
      queryClient.invalidateQueries({ queryKey: ['apps', appId] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};

export const useDeleteApp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appId: string) => appService.deleteApp(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};
