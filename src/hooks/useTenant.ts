// bayaan-portal/src/hooks/useTenant
import React from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useNotificationsStore, useTenantStore} from '@/store';

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    plan: string;
    status: 'active' | 'suspended' | 'trial';
}

// Mock API functions (replace with actual API calls)
const tenantApi = {
    getTenants: async (): Promise<Tenant[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            {
                id: 'tenant-1',
                name: 'Acme Corp',
                subdomain: 'acme',
                plan: 'pro',
                status: 'active',
            },
            {
                id: 'tenant-2',
                name: 'Tech Startup',
                subdomain: 'techstartup',
                plan: 'trial',
                status: 'trial',
            },
            {
                id: 'tenant-3',
                name: 'Enterprise Solutions',
                subdomain: 'enterprise',
                plan: 'enterprise',
                status: 'active',
            },
        ];
    },

    switchTenant: async (tenantId: string): Promise<void> => {
        console.debug('switchTenant called ' + tenantId);
        await new Promise(resolve => setTimeout(resolve, 300));
    },
};

export const useTenant = () => {
    const queryClient = useQueryClient();

    // Use the new sliced store hooks
    const {
        currentTenant,
        availableTenants,
        setCurrentTenant,
        setAvailableTenants,
        switchTenant: switchTenantStore,
    } = useTenantStore();

    const {addNotification} = useNotificationsStore();

    // Query for available tenants
    const tenantsQuery = useQuery({
        queryKey: ['tenants'],
        queryFn: tenantApi.getTenants,
        enabled: availableTenants.length === 0,
    });

    // Handle tenants query success
    React.useEffect(() => {
        if (tenantsQuery.isSuccess && tenantsQuery.data) {
            const tenants = tenantsQuery.data;
            if (availableTenants.length === 0) {
                setAvailableTenants(tenants);
            }

            if (!currentTenant && tenants.length > 0) {
                const savedTenantId = localStorage.getItem('current_tenant_id');
                const tenant = tenants.find(t => t.id === savedTenantId) || tenants[0];
                setCurrentTenant(tenant);
                localStorage.setItem('current_tenant_id', tenant.id);
            }
        }
    }, [tenantsQuery.isSuccess, tenantsQuery.data, availableTenants.length, currentTenant, setAvailableTenants, setCurrentTenant]);

    const {isLoading, error} = tenantsQuery;

    // Mutation for switching tenants
    const switchTenantMutation = useMutation({
        mutationFn: tenantApi.switchTenant,
    });

    // Handle switch tenant mutation success/error
    React.useEffect(() => {
        if (switchTenantMutation.isSuccess && switchTenantMutation.variables) {
            const tenantId = switchTenantMutation.variables;
            switchTenantStore(tenantId);
            localStorage.setItem('current_tenant_id', tenantId);

            queryClient.invalidateQueries();

            const tenant = availableTenants.find(t => t.id === tenantId);
            if (tenant) {
                addNotification({
                    type: 'success',
                    title: 'Workspace switched',
                    message: `Switched to ${tenant.name}`,
                });
            }
        }

        if (switchTenantMutation.isError) {
            addNotification({
                type: 'error',
                title: 'Switch failed',
                message: switchTenantMutation.error?.message || 'Failed to switch workspace',
            });
        }
    }, [switchTenantMutation.isSuccess, switchTenantMutation.isError, switchTenantMutation.variables, switchTenantMutation.error?.message, switchTenantStore, queryClient, availableTenants, addNotification]);

    // Utility functions using selectors
    const isTenantActive = React.useCallback((tenantId?: string) => {
        const tenant = tenantId
            ? availableTenants.find(t => t.id === tenantId)
            : currentTenant;
        return tenant?.status === 'active';
    }, [availableTenants, currentTenant]);

    const isTenantOnTrial = React.useCallback((tenantId?: string) => {
        const tenant = tenantId
            ? availableTenants.find(t => t.id === tenantId)
            : currentTenant;
        return tenant?.status === 'trial';
    }, [availableTenants, currentTenant]);

    const getTenantPlan = React.useCallback((tenantId?: string) => {
        const tenant = tenantId
            ? availableTenants.find(t => t.id === tenantId)
            : currentTenant;
        return tenant?.plan;
    }, [availableTenants, currentTenant]);

    return {
        // State
        currentTenant,
        availableTenants,
        isLoading,
        error,
        isInitialized: !isLoading && !error,

        // Actions
        switchTenant: switchTenantMutation.mutate,

        // Utility functions
        isTenantActive,
        isTenantOnTrial,
        getTenantPlan,
        canSwitchTenant: () => availableTenants.length > 1,
        getTenantById: (tenantId: string) => availableTenants.find(t => t.id === tenantId),

        // Status
        isSwitchingTenant: switchTenantMutation.isPending,
    };
};