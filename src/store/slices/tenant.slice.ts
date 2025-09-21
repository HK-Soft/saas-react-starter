// bayaan-portal/src/store/slices/tenant.slice
import type {StateCreator} from 'zustand';
import type {GlobalActions, GlobalState, Tenant} from '@/store/types';

export interface TenantState {
    currentTenant: Tenant | null;
    availableTenants: Tenant[];
}

export interface TenantActions {
    setCurrentTenant: (tenant: Tenant | null) => void;
    setAvailableTenants: (tenants: Tenant[]) => void;
    switchTenant: (tenantId: string) => void;
    resetTenant: () => void;
}

export type TenantSlice = TenantState & TenantActions;

const initialTenantState: TenantState = {
    currentTenant: null,
    availableTenants: [],
};

export const createTenantSlice: StateCreator<
    GlobalState & GlobalActions,
    [],
    [],
    TenantSlice
> = (set, get) => ({
    ...initialTenantState,

    setCurrentTenant: (currentTenant) => set({currentTenant}),

    setAvailableTenants: (availableTenants) => set({availableTenants}),

    switchTenant: (tenantId) => {
        const {availableTenants} = get();
        const tenant = availableTenants.find(t => t.id === tenantId);
        if (tenant) {
            set({currentTenant: tenant});
        }
    },

    resetTenant: () => set({
        currentTenant: null,
        availableTenants: [],
    }),
});