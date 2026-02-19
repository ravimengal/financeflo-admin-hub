import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appApis } from '@/services';
import type { App } from '@/services';

export const useApps = () => {
  return useQuery({
    queryKey: ['apps'],
    queryFn: () => appApis.getApps(),
  });
};

export const useApp = (appId: string) => {
  return useQuery({
    queryKey: ['apps', appId],
    queryFn: () => appApis.getApp(appId),
    enabled: !!appId,
  });
};

export const useCreateApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<App, 'id'>) => appApis.createApp(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['apps'] }); },
  });
};

export const useUpdateApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, data }: { appId: string; data: Partial<App> }) =>
      appApis.updateApp(appId, data),
    onSuccess: (_, { appId }) => {
      queryClient.invalidateQueries({ queryKey: ['apps', appId] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};

export const useDeleteApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appId: string) => appApis.deleteApp(appId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['apps'] }); },
  });
};
