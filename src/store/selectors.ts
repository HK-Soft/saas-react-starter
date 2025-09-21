// bayaan-portal/src/store/selectors
import type {GlobalState, GlobalActions, User, Tenant, UserRole} from './types';

// Auth selectors
export const authSelectors = {
    user: (state: GlobalState & GlobalActions): User | null => state.user,
    isAuthenticated: (state: GlobalState & GlobalActions): boolean => state.isAuthenticated,
    authInitialized: (state: GlobalState & GlobalActions): boolean => state.authInitialized,

    hasRole: (role: UserRole) => (state: GlobalState): boolean => {
        const userRoles = state.user?.roles || [];
        return userRoles.includes(role);
    },

    hasAnyRole: (roles: UserRole[]) => (state: GlobalState): boolean => {
        const userRoles = state.user?.roles || [];
        return roles.some(role => userRoles.includes(role));
    },

    // Tenant-related user selectors
    userTenantId: (state: GlobalState): string | undefined => {
        return state.user?.tenantId;
    },

};

// Tenant selectors
export const tenantSelectors = {
    currentTenant: (state: GlobalState & GlobalActions): Tenant | null => state.currentTenant,
    availableTenants: (state: GlobalState & GlobalActions): Tenant[] => state.availableTenants,

    currentTenantId: (state: GlobalState & GlobalActions): string | undefined => {
        return state.currentTenant?.id;
    },
    currentTenantName: (state: GlobalState & GlobalActions): string => {
        return state.currentTenant?.name || 'No Tenant';
    },

    currentTenantPlan: (state: GlobalState & GlobalActions): string => {
        return state.currentTenant?.plan || 'Unknown';
    },

    isTenantActive: (state: GlobalState & GlobalActions) => {
        return state.currentTenant?.status === 'active';
    },

    isTenantOnTrial: (state: GlobalState & GlobalActions): boolean => {
        return state.currentTenant?.status === 'trial';
    },

    canSwitchTenant: (state: GlobalState & GlobalActions): boolean => {
        return state.availableTenants.length > 1;
    },

    getTenantById: (tenantId: string) => (state: GlobalState & GlobalActions): Tenant | undefined => {
        return state.availableTenants.find(tenant => tenant.id === tenantId);
    },
};

// UI selectors
export const uiSelectors = {
    theme: (state: GlobalState & GlobalActions): 'light' | 'dark' => state.theme,
    sidebarCollapsed: (state: GlobalState & GlobalActions): boolean => state.sidebarCollapsed,

    isDarkMode: (state: GlobalState & GlobalActions): boolean => state.theme === 'dark',
    isLightMode: (state: GlobalState & GlobalActions): boolean => state.theme === 'light',
};

// Notification selectors
export const notificationSelectors = {
    allNotifications: (state: GlobalState) => state.notifications,
    notificationCount: (state: GlobalState & GlobalActions): number => state.notifications.length,

    notifications: (state: GlobalState & GlobalActions) => state.notifications,

    errorNotifications: (state: GlobalState & GlobalActions) => {
        return state.notifications.filter(n => n.type === 'error');
    },

    successNotifications: (state: GlobalState & GlobalActions) => {
        return state.notifications.filter(n => n.type === 'success');
    },

    hasNotifications: (state: GlobalState & GlobalActions): boolean => {
        return state.notifications.length > 0;
    },
};

// Combined selectors
export const combinedSelectors = {
    isAppReady: (state: GlobalState & GlobalActions): boolean => {
        return state.authInitialized;
    },

    userPrimaryTenant: (state: GlobalState & GlobalActions): Tenant | null => {
        const userTenantId = state.user?.tenantId || state.user?.preferredTenant;
        if (!userTenantId) return state.currentTenant;

        return state.availableTenants.find(tenant => tenant.id === userTenantId) || state.currentTenant;
    },

    canAccessResource: (requiredRoles: UserRole[]) => (state: GlobalState): boolean => {
        if (!state.isAuthenticated || !state.user) return false;

        const userRoles = state.user.roles || [];
        return requiredRoles.some(role => userRoles.includes(role));
    },




};

// Type-safe selector hooks (if using with React)
export type AppState = GlobalState & GlobalActions;