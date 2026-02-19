import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApis } from '@/services';
import type { AppCredit } from '@/services';

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionApis.getCurrentSubscription(),
  });
};

export const useMarketplaceApps = () => {
  return useQuery({
    queryKey: ['marketplace', 'apps'],
    queryFn: () => subscriptionApis.getMarketplaceApps(),
  });
};

export const useInstallApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, creditTier }: { appId: string; creditTier?: string }) =>
      subscriptionApis.installApp(appId, creditTier),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscription'] }); },
  });
};

export const useUninstallApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscribedAppId: string) => subscriptionApis.uninstallApp(subscribedAppId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscription'] }); },
  });
};

export const useUpgradeAppCredits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscribedAppId, newCredits }: { subscribedAppId: string; newCredits: Partial<AppCredit> }) =>
      subscriptionApis.upgradeAppCredits(subscribedAppId, newCredits),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscription'] }); },
  });
};
