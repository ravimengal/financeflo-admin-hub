import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService, Organization } from '@/services/organization.service';

export const useMyOrganizations = () => {
  return useQuery({
    queryKey: ['organizations', 'my'],
    queryFn: () => organizationService.getMyOrgs(),
  });
};

export const useOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => organizationService.getOrg(orgId),
    enabled: !!orgId,
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: Partial<Organization> }) =>
      organizationService.updateOrg(orgId, data),
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
      organizationService.uploadLogo(orgId, file),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', orgId] });
    },
  });
};
