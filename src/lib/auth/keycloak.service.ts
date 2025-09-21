// bayaan-portal/src/lib/auth/keycloak.service
import Keycloak, { type KeycloakInitOptions, type KeycloakTokenParsed } from 'keycloak-js';
import type { User } from '@/store/types';

export interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    idToken?: string;
}

class KeycloakService {
    private keycloak: Keycloak | null = null;
    private initialized = false;
    private config: KeycloakConfig | null = null;
    private initializationPromise: Promise<boolean> | null = null;

    async initialize(config: KeycloakConfig): Promise<boolean> {
        if (this.initialized && this.keycloak) {
            return this.keycloak.authenticated || false;
        }

        // Return existing initialization promise if already in progress
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.config = config;
        this.initializationPromise = this.performInitialization();
        return this.initializationPromise;
    }

    private async performInitialization(): Promise<boolean> {
        try {
            console.log('Initializing Keycloak...');

            // Initialize Keycloak instance
            this.keycloak = new Keycloak({
                url: this.config!.url,
                realm: this.config!.realm,
                clientId: this.config!.clientId,
            });

            const initOptions: KeycloakInitOptions = {
                onLoad: 'check-sso',

                // Disable all iframe-related features for modern browser compatibility
                checkLoginIframe: false,
                silentCheckSsoRedirectUri: undefined,
                silentCheckSsoFallback: false,

                // Modern security features
                enableLogging: import.meta.env.VITE_DEBUG_KEYCLOAK === 'true',
                pkceMethod: 'S256', // PKCE for enhanced security
                flow: 'standard',
                responseMode: 'fragment',

                // Token management
                checkLoginIframeInterval: 0, // Disable periodic iframe checks

                // Add timeout for faster failure
                messageReceiveTimeout: 3000, // 3 seconds instead of default 10s
            };

            const authenticated = await this.keycloak.init(initOptions);

            this.initialized = true;

            if (authenticated) {
                this.setupTokenRefresh();
                this.saveTokens();
                console.log('User authenticated successfully');
            } else {
                console.log('User not authenticated - will require login');
            }

            this.setupEventHandlers();
            return authenticated;

        } catch (error) {
            console.error('Keycloak initialization failed:', error);
            this.initialized = false;
            this.initializationPromise = null;
            this.keycloak = null;
            throw new Error(`Authentication service initialization failed: ${error}`);
        }
    }

    private setupTokenRefresh(): void {
        if (!this.keycloak) return;

        console.log('Setting up token refresh management...');

        // Handle token expiration
        this.keycloak.onTokenExpired = () => {
            console.log('Token expired, attempting refresh...');
            this.refreshToken().catch((error) => {
                console.error('Token refresh failed:', error);
                this.handleTokenRefreshFailure();
            });
        };

        // Proactive token refresh (check every 30 seconds)
        const refreshInterval = setInterval(() => {
            if (!this.keycloak || !this.keycloak.authenticated) {
                clearInterval(refreshInterval);
                return;
            }

            // Refresh if token expires in the next 5 minutes
            this.updateToken(300)
                .then((refreshed) => {
                    if (refreshed) {
                        console.log('Token proactively refreshed');
                    }
                })
                .catch((error) => {
                    console.error('Proactive token refresh failed:', error);
                });
        }, 30000); // Check every 30 seconds (more frequent than iframe-based)

        // Store interval ID for cleanup
        (window as any).__keycloak_refresh_interval = refreshInterval;
    }

    private setupEventHandlers(): void {
        if (!this.keycloak) return;

        this.keycloak.onAuthSuccess = () => {
            console.log('Authentication successful');
        };

        this.keycloak.onAuthError = (error) => {
            console.error('Authentication error:', error);
        };

        this.keycloak.onAuthRefreshSuccess = () => {
            console.log('Token refresh successful');
            this.saveTokens();
        };

        this.keycloak.onAuthRefreshError = () => {
            console.error('Token refresh failed');
            this.handleTokenRefreshFailure();
        };

        this.keycloak.onAuthLogout = () => {
            console.log('User logged out');
            this.clearTokens();
        };
    }

    private handleTokenRefreshFailure(): void {
        console.log('Handling token refresh failure - redirecting to login');
        this.clearTokens();
        // Force re-authentication
        this.login();
    }

    private saveTokens(): void {
        if (!this.keycloak || !this.keycloak.token) return;

        try {
            sessionStorage.setItem('kc_token', this.keycloak.token);
            if (this.keycloak.refreshToken) {
                sessionStorage.setItem('kc_refresh_token', this.keycloak.refreshToken);
            }
            if (this.keycloak.idToken) {
                sessionStorage.setItem('kc_id_token', this.keycloak.idToken);
            }
        } catch (error) {
            console.warn('Failed to save tokens to sessionStorage:', error);
        }
    }

    private clearTokens(): void {
        try {
            sessionStorage.removeItem('kc_token');
            sessionStorage.removeItem('kc_refresh_token');
            sessionStorage.removeItem('kc_id_token');
        } catch (error) {
            console.warn('Failed to clear tokens from sessionStorage:', error);
        }
    }

    // Public API methods
    async login(options?: { redirectUri?: string }): Promise<void> {
        if (!this.keycloak) {
            throw new Error('Keycloak not initialized');
        }

        const loginOptions = {
            redirectUri: options?.redirectUri || window.location.origin,
        };

        console.log('Redirecting to Keycloak login with options:', loginOptions);
        await this.keycloak.login(loginOptions);
    }

    async logout(options?: { redirectUri?: string }): Promise<void> {
        if (!this.keycloak) {
            throw new Error('Keycloak not initialized');
        }

        // Clear tokens and intervals
        this.clearTokens();
        const refreshInterval = (window as any).__keycloak_refresh_interval;
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        const logoutOptions = {
            redirectUri: options?.redirectUri || window.location.origin,
        };

        console.log('Logging out with options:', logoutOptions);
        await this.keycloak.logout(logoutOptions);
    }

    async refreshToken(): Promise<boolean> {
        if (!this.keycloak) {
            console.warn('Cannot refresh token - Keycloak not initialized');
            return false;
        }

        try {
            const refreshed = await this.keycloak.updateToken(30);
            if (refreshed) {
                this.saveTokens();
                console.log('Token successfully refreshed');
            }
            return refreshed;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    async updateToken(minValidity: number = 30): Promise<boolean> {
        if (!this.keycloak) return false;

        try {
            return await this.keycloak.updateToken(minValidity);
        } catch (error) {
            console.error('Update token failed:', error);
            return false;
        }
    }

    isAuthenticated(): boolean {
        return this.keycloak?.authenticated || false;
    }

    getUser(): User | null {
        if (!this.keycloak || !this.keycloak.authenticated || !this.keycloak.tokenParsed) {
            return null;
        }

        const token = this.keycloak.tokenParsed as KeycloakTokenParsed & {
            email?: string;
            email_verified?: boolean;
            given_name?: string;
            family_name?: string;
            preferred_username?: string;
            locale?: string;
            picture?: string;
            realm_access?: { roles?: string[] };
            resource_access?: Record<string, { roles?: string[] }>;
            // Custom attributes that might be set in Keycloak
            tenant_id?: string;
            preferred_tenant?: string;
            last_login?: string;
        };

        // Extract and structure user data according to our enhanced User type
        const roles = this.extractRoles(token);
        const firstName = token.given_name || '';
        const lastName = token.family_name || '';
        const username = token.preferred_username || token.email || '';
        const email = token.email || '';

        return {
            id: token.sub || '',
            username,
            email,
            firstName,
            lastName,
            roles,

            // Optional Keycloak properties
            emailVerified: token.email_verified,
            locale: token.locale,
            picture: token.picture,

            // Custom application properties from Keycloak attributes
            tenantId: token.tenant_id,
            preferredTenant: token.preferred_tenant,
            lastLogin: token.last_login ? new Date(token.last_login) : undefined,

            // Computed properties (will be enhanced further in the auth slice)
            name: firstName && lastName ? `${firstName} ${lastName}`.trim() : username,
            displayName: firstName && lastName ? `${firstName} ${lastName}`.trim() : username,
            initials: firstName && lastName
                ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                : username.substring(0, 2).toUpperCase(),
        };
    }

    private extractRoles(token: any): string[] {
        const roles: string[] = [];

        // Realm roles
        if (token.realm_access?.roles) {
            roles.push(...token.realm_access.roles);
        }

        // Client roles
        if (token.resource_access) {
            Object.values(token.resource_access).forEach((clientAccess: any) => {
                if (clientAccess.roles) {
                    roles.push(...clientAccess.roles);
                }
            });
        }

        return roles;
    }

    hasRole(role: string): boolean {
        if (!this.keycloak || !this.keycloak.authenticated) {
            return false;
        }

        return this.keycloak.hasRealmRole(role) || this.keycloak.hasResourceRole(role);
    }

    hasAnyRole(roles: string[]): boolean {
        return roles.some(role => this.hasRole(role));
    }

    getAccessToken(): string | null {
        return this.keycloak?.token || null;
    }

    getRefreshToken(): string | null {
        return this.keycloak?.refreshToken || null;
    }

    getIdToken(): string | null {
        return this.keycloak?.idToken || null;
    }

    getTokens(): AuthTokens | null {
        if (!this.keycloak?.token) return null;

        return {
            accessToken: this.keycloak.token,
            refreshToken: this.keycloak.refreshToken,
            idToken: this.keycloak.idToken,
        };
    }

    getSessionInfo(): any {
        if (!this.keycloak) return null;

        return {
            authenticated: this.keycloak.authenticated,
            token: this.keycloak.token ? '***' : null,
            refreshToken: this.keycloak.refreshToken ? '***' : null,
            idToken: this.keycloak.idToken ? '***' : null,
            tokenParsed: this.keycloak.tokenParsed,
            refreshTokenParsed: this.keycloak.refreshTokenParsed,
            idTokenParsed: this.keycloak.idTokenParsed,
            timeSkew: this.keycloak.timeSkew,
            loginRequired: this.keycloak.loginRequired,
            authServerUrl: this.keycloak.authServerUrl,
            realm: this.keycloak.realm,
            clientId: this.keycloak.clientId,
        };
    }

    reset(): void {
        console.log('Resetting Keycloak service state');

        // Clear intervals
        const refreshInterval = (window as any).__keycloak_refresh_interval;
        if (refreshInterval) {
            clearInterval(refreshInterval);
            delete (window as any).__keycloak_refresh_interval;
        }

        // Clear tokens
        this.clearTokens();

        // Reset state
        this.initialized = false;
        this.initializationPromise = null;
        this.keycloak = null;
        this.config = null;
    }
}

// Export singleton instance
export const keycloakService = new KeycloakService();