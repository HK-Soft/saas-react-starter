// bayaan-portal/src/store/config
import type {GlobalState, GlobalActions} from './types';

export const storeConfig = {
    name: 'app-store',

    // Only persist UI preferences (exclude auth-sensitive data)
    persistConfig: {
        partialize: (state: GlobalState & GlobalActions) => ({
            theme: state.theme,
            sidebarCollapsed: state.sidebarCollapsed,
        }),

        // Handle hydration after persistence
        onRehydrateStorage: () => (state?: Partial<GlobalState & GlobalActions>) => {
            if (state) {
                // Mark auth as not initialized on app start
                // This will trigger the auth validation process
                if ('authInitialized' in state) {
                    state.authInitialized = false;
                }
            }
        },
    },

    // Devtools configuration
    devtools: process.env.NODE_ENV === 'development',

    // Initial state values
    initialState: {
        // Auth state
        user: null,
        isAuthenticated: false,
        authInitialized: false,

        // Tenant state
        currentTenant: null,
        availableTenants: [],

        // UI state
        theme: 'light' as const,
        sidebarCollapsed: false,

        // Notifications
        notifications: [],
    } as Partial<GlobalState & GlobalActions>,
} as const;