import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService, AppCredit } from '@/services/subscription.service';

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrentSubscription(),
  });
};

export const useMarketplaceApps = () => {
  return useQuery({
    queryKey: ['marketplace', 'apps'],
    queryFn: () => subscriptionService.getMarketplaceApps(),
  });
};

export const useInstallApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, creditTier }: { appId: string; creditTier?: string }) =>
      subscriptionService.installApp(appId, creditTier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};

export const useUninstallApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscribedAppId: string) => subscriptionService.uninstallApp(subscribedAppId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};

export const useUpgradeAppCredits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscribedAppId, newCredits }: { subscribedAppId: string; newCredits: Partial<AppCredit> }) =>
      subscriptionService.upgradeAppCredits(subscribedAppId, newCredits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};
