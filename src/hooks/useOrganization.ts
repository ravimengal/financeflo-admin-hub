import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationApis } from '@/services';
import type { Organization } from '@/services';

export const useMyOrganizations = () => {
  return useQuery({
    queryKey: ['organizations', 'my'],
    queryFn: () => organizationApis.getMyOrgs(),
  });
};

export const useOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => organizationApis.getOrg(orgId),
    enabled: !!orgId,
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: Partial<Organization> }) =>
      organizationApis.updateOrg(orgId, data),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', orgId] });
      queryClient.invalidateQueries({ queryKey: ['organizations', 'my'] });
    },
  });
};

export const useUploadOrgLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, file }: { orgId: string; file: File }) =>
      organizationApis.uploadLogo(orgId, file),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', orgId] });
    },
  });
};
