// bayaan-portal/src/hooks/useAuth
import {useCallback, useEffect, useState, useRef} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {useAuthStore, useNotificationsStore, useSharedStore} from '@/store';
import {keycloakService} from '@/lib/auth/keycloak.service';

interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

const getKeycloakConfig = (): KeycloakConfig => ({
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'bayaan',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bayaan-frontend',
});

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isInitializing, setIsInitializing] = useState(true);
    const [initError, setInitError] = useState<Error | null>(null);
    const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        user,
        isAuthenticated,
        authInitialized,
        setUser,
        setAuthenticated,
        setAuthInitialized,
        forceAuthRecheck,
    } = useAuthStore();

    const {
        addNotification,
    } = useNotificationsStore();

    const {
        reset
    } = useSharedStore();

    // Initialize Keycloak with timeout handling
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setIsInitializing(true);
                setInitError(null);

                // Set a timeout for initialization
                initializationTimeoutRef.current = setTimeout(() => {
                    console.error('Auth initialization timeout');
                    setInitError(new Error('Authentication initialization timed out'));
                    setIsInitializing(false);
                    setAuthInitialized(true);
                }, 8000);

                const config = getKeycloakConfig();
                const authenticated = await keycloakService.initialize(config);

                // Clear timeout immediately on success
                if (initializationTimeoutRef.current) {
                    clearTimeout(initializationTimeoutRef.current);
                    initializationTimeoutRef.current = null;
                }

                if (authenticated) {
                    const userInfo = keycloakService.getUser();
                    if (userInfo) {
                        setUser(userInfo);
                        setAuthenticated(true);
                    } else {
                        setAuthenticated(false);
                        setUser(null);
                    }
                } else {
                    setAuthenticated(false);
                    setUser(null);
                }

                setAuthInitialized(true);

            } catch (error) {
                console.error('Auth initialization failed:', error);

                if (initializationTimeoutRef.current) {
                    clearTimeout(initializationTimeoutRef.current);
                    initializationTimeoutRef.current = null;
                }

                setInitError(error as Error);
                setAuthenticated(false);
                setUser(null);
                setAuthInitialized(true);

            } finally {
                setIsInitializing(false);
            }
        };

        if (!authInitialized) {
            initializeAuth();
        } else {
            setIsInitializing(false);
        }

        return () => {
            if (initializationTimeoutRef.current) {
                clearTimeout(initializationTimeoutRef.current);
                initializationTimeoutRef.current = null;
            }
        };
    }, [authInitialized, setUser, setAuthenticated, setAuthInitialized, addNotification]);
    // **FIX: Add an effect to sync local isInitializing with store state**
    useEffect(() => {
        if (authInitialized) {
            setIsInitializing(false);
        }
    }, [authInitialized]);

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async () => {
            console.log('Initiating login...');
            await keycloakService.login({
                redirectUri: window.location.origin + '/dashboard',
            });
        },
        onError: (error) => {
            console.error('Login failed:', error);
            addNotification({
                type: 'error',
                title: 'Login Failed',
                message: 'Unable to start login process. Please try again.',
            });
        },
    });

    // Enhanced logout mutation with cross-tab cleanup
    const logoutMutation = useMutation({
        mutationFn: async () => {
            console.log('Initiating logout...');

            // Clear all application state first
            reset();
            queryClient.clear();

            // Then perform Keycloak logout
            await keycloakService.logout({
                redirectUri: window.location.origin + '/auth/login',
            });
        },
        onSuccess: () => {
            addNotification({
                type: 'success',
                title: 'Logged out',
                message: 'You have been successfully logged out.',
            });

            navigate('/auth/login', {replace: true});
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            addNotification({
                type: 'error',
                title: 'Logout Failed',
                message: 'There was an issue logging out. Please try again.',
            });

            // Fallback: clear local state and redirect anyway
            reset();
            navigate('/auth/login', {replace: true});
        },
    });

    const login = useCallback(() => {
        loginMutation.mutate();
    }, [loginMutation]);

    const logout = useCallback(() => {
        logoutMutation.mutate();
    }, [logoutMutation]);

    const retryAuth = useCallback(async () => {
        console.log('Retrying auth initialization');

        // Clear any existing timeouts
        if (initializationTimeoutRef.current) {
            clearTimeout(initializationTimeoutRef.current);
            initializationTimeoutRef.current = null;
        }

        // **FIX: Reset both local and store state for clean retry**
        keycloakService.reset();
        setAuthInitialized(false);
        setInitError(null);
        setIsInitializing(true);

        // Force a recheck
        forceAuthRecheck();
    }, [setAuthInitialized, forceAuthRecheck]);

    // Role checking functions
    const hasRole = useCallback((role: string): boolean => {
        return keycloakService.hasRole(role);
    }, []);

    const hasAnyRole = useCallback((roles: string[]): boolean => {
        return keycloakService.hasAnyRole(roles);
    }, []);

    // Token management
    const getAccessToken = useCallback((): string | null => {
        return keycloakService.getAccessToken();
    }, []);

    const refreshToken = useCallback(async (): Promise<boolean> => {
        try {
            const refreshed = await keycloakService.refreshToken();
            if (refreshed) {
                const userInfo = keycloakService.getUser();
                if (userInfo) {
                    setUser(userInfo);
                }
            }
            return refreshed;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }, [setUser]);

    // Session info for debugging
    const getSessionInfo = useCallback(() => {
        return keycloakService.getSessionInfo();
    }, []);

    return {
        // State
        user,
        isAuthenticated: isAuthenticated && keycloakService.isAuthenticated(),
        isInitializing,
        initError,
        authInitialized,

        // Actions
        login,
        logout,
        refreshToken,
        retryAuth,

        // Authorization helpers
        hasRole,
        hasAnyRole,
        getAccessToken,

        // Session management
        getSessionInfo,

        // Status
        isLoginPending: loginMutation.isPending,
        isLogoutPending: logoutMutation.isPending,
        loginError: loginMutation.error,
    };
};