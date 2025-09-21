// sbayaan-portal/rc/store/index
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import type {GlobalActions, GlobalState} from './types';
import {storeConfig} from './config';
import {createAuthSlice} from './slices/auth.slice';
import {createTenantSlice} from './slices/tenant.slice';
import {createUISlice} from './slices/ui.slice';
import {createNotificationSlice} from './slices/notifications.slice';

// Create the main store by combining all slices
export const useAppStore = create<GlobalState & GlobalActions>()(
    devtools(
        persist(
            (set, get, api) => {
                return {
                    // Combine all slices
                    ...createAuthSlice(set, get, api),
                    ...createTenantSlice(set, get, api),
                    ...createUISlice(set, get, api),
                    ...createNotificationSlice(set, get, api),

                    // Global reset action
                    reset: () => {
                        const {theme, sidebarCollapsed} = get();
                        set({
                            ...storeConfig.initialState,
                            // Keep UI preferences
                            theme,
                            sidebarCollapsed,
                        });
                    },
                };
            },
            {
                name: storeConfig.name,
                storage: createJSONStorage(() => localStorage),
                partialize: storeConfig.persistConfig.partialize,
                onRehydrateStorage: storeConfig.persistConfig.onRehydrateStorage,
            }
        ),
        {
            name: storeConfig.name,
            enabled: storeConfig.devtools,
        }
    )
);

export * from './selectors';
export * from './types';

// FIXED: Use individual selectors instead of creating new objects
export const useAuthStore = () => ({
    user: useAppStore(state => state.user),
    isAuthenticated: useAppStore(state => state.isAuthenticated),
    authInitialized: useAppStore(state => state.authInitialized),
    setUser: useAppStore(state => state.setUser),
    setAuthenticated: useAppStore(state => state.setAuthenticated),
    setAuthInitialized: useAppStore(state => state.setAuthInitialized),
    resetAuth: useAppStore(state => state.resetAuth),
    forceAuthRecheck: useAppStore(state => state.forceAuthRecheck),
});

export const useTenantStore = () => ({
    currentTenant: useAppStore(state => state.currentTenant),
    availableTenants: useAppStore(state => state.availableTenants),
    setCurrentTenant: useAppStore(state => state.setCurrentTenant),
    setAvailableTenants: useAppStore(state => state.setAvailableTenants),
    switchTenant: useAppStore(state => state.switchTenant),
    resetTenant: useAppStore(state => state.resetTenant),
});

export const useUIStore = () => ({
    theme: useAppStore(state => state.theme),
    sidebarCollapsed: useAppStore(state => state.sidebarCollapsed),
    setTheme: useAppStore(state => state.setTheme),
    setSidebarCollapsed: useAppStore(state => state.setSidebarCollapsed),
});

export const useNotificationsStore = () => ({
    notifications: useAppStore(state => state.notifications),
    addNotification: useAppStore(state => state.addNotification),
    removeNotification: useAppStore(state => state.removeNotification),
    clearNotifications: useAppStore(state => state.clearNotifications),
});

export const useSharedStore = () => ({
    reset: useAppStore(state => state.reset),
});

// Store utilities for external use
export const getAppState = () => useAppStore.getState();
export const subscribeToStore = useAppStore.subscribe;

export {debugStore} from './utils';