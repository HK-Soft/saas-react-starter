// bayaan-portal/src/store/slices/auth.slice
import type {StateCreator} from 'zustand';
import type {GlobalActions, GlobalState, User} from '@/store/types';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    authInitialized: boolean;
    lastAuthCheck: number | null;
}

export interface AuthActions {
    setUser: (user: User | null) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setAuthInitialized: (initialized: boolean) => void;
    resetAuth: () => void;
    forceAuthRecheck: () => void;
}

export type AuthSlice = AuthState & AuthActions;

const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false,
    authInitialized: false,
    lastAuthCheck: null,
};

export const createAuthSlice: StateCreator<
    GlobalState & GlobalActions,
    [],
    [],
    AuthSlice
> = (set, get) => ({
    ...initialAuthState,

    setUser: (user) => {
        set({
            user,
            lastAuthCheck: Date.now(),
        });

        // If setting user data, mark auth as initialized and authenticated
        if (user && !get().authInitialized) {
            set({authInitialized: true, isAuthenticated: true});
        }
    },

    setAuthenticated: (isAuthenticated) => {
        set({
            isAuthenticated,
            lastAuthCheck: Date.now(),
        });

        // If setting to false, clear user data
        if (!isAuthenticated) {
            set({user: null});
        }

        // Mark auth as initialized when setting authentication status
        if (!get().authInitialized) {
            set({authInitialized: true});
        }
    },

    setAuthInitialized: (authInitialized) => {
        set({
            authInitialized,
            lastAuthCheck: authInitialized ? Date.now() : null,
        });
    },

    resetAuth: () => {
        console.log('Resetting auth state');
        set({
            user: null,
            isAuthenticated: false,
            authInitialized: false,
            lastAuthCheck: null,
        });
    },

    forceAuthRecheck: () => {
        console.log('Forcing auth recheck');
        set({
            authInitialized: false,
            lastAuthCheck: null,
        });
    },
});