// bayaan-portal/src/store/types
export interface User {
    id: string;                    // Keycloak subject (sub)
    username: string;              // Keycloak preferred_username or email fallback
    email: string;                 // Keycloak email
    firstName?: string;            // Keycloak given_name (optional)
    lastName?: string;             // Keycloak family_name (optional)
    name?: string;                 // Computed full name (firstName + lastName) or fallback
    roles: string[];               // Extracted from Keycloak realm_access and resource_access

    // Optional additional user properties that might come from Keycloak
    emailVerified?: boolean;       // Keycloak email_verified
    locale?: string;               // User's preferred locale
    picture?: string;              // User avatar/profile picture URL

    // Application-specific properties (might come from custom Keycloak attributes)
    tenantId?: string;             // Current tenant association
    preferredTenant?: string;      // User's preferred tenant
    lastLogin?: Date;              // Last login timestamp

    // Computed properties for convenience
    displayName?: string;          // firstName + lastName or username fallback
    initials?: string;             // First letters of firstName and lastName
}

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    plan: string;
    status: 'active' | 'suspended' | 'trial';
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
}

export interface GlobalState {
    // Auth state
    user: User | null;
    isAuthenticated: boolean;
    authInitialized: boolean;
    lastAuthCheck: number | null;  // Timestamp of last auth check

    // Tenant/Workspace state
    currentTenant: Tenant | null;
    availableTenants: Tenant[];

    // UI State
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;

    // Global notifications
    notifications: Notification[];
}

export interface GlobalActions {
    // Auth actions
    setUser: (user: User | null) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setAuthInitialized: (initialized: boolean) => void;
    forceAuthRecheck: () => void;   // New method for forcing auth recheck

    // Tenant actions
    setCurrentTenant: (tenant: Tenant | null) => void;
    setAvailableTenants: (tenants: Tenant[]) => void;
    switchTenant: (tenantId: string) => void;

    // UI actions
    setTheme: (theme: 'light' | 'dark') => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Notification actions
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    /*
    clearNotifications: () => void;
    markNotificationAsRead: (id: string) => void;  // New method
    clearReadNotifications: () => void;            // New method
     */

    // Reset actions
    reset: () => void;
    resetAuth: () => void;
    resetTenant: () => void;
}

export type UserRole = 'admin' | 'super_admin' | 'read_only' | 'user' | 'tenant_admin';