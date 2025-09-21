// bayaan-portal/src/store/utils
import {getAppState, subscribeToStore} from './index';
import {authSelectors, combinedSelectors, notificationSelectors, tenantSelectors, uiSelectors} from './selectors';

/**
 * Main debug function for the store
 */
export const debugStore = () => {
    if (process.env.NODE_ENV !== 'development') {
        console.warn('debugStore is only available in development mode');
        return;
    }

    const state = getAppState();

    console.group('🏪 Store Debug Information');
    console.debug('='.repeat(50));

    // Raw state
    console.group('📋 Raw State');
    console.debug('Full State:', state);
    console.groupEnd();

    // Auth debug
    console.group('🔐 Auth State');
    console.debug('User:', authSelectors.user(state));
    console.debug('Is Authenticated:', authSelectors.isAuthenticated(state));
    console.debug('Auth Initialized:', authSelectors.authInitialized(state));
    console.debug('User Tenant ID:', authSelectors.userTenantId(state));
    console.groupEnd();

    // Tenant debug
    console.group('🏢 Tenant State');
    console.debug('Current Tenant:', tenantSelectors.currentTenant(state));
    console.debug('Available Tenants:', tenantSelectors.availableTenants(state));
    console.debug('Current Tenant ID:', tenantSelectors.currentTenantId(state));
    console.debug('Current Tenant Name:', tenantSelectors.currentTenantName(state));
    console.debug('Current Tenant Plan:', tenantSelectors.currentTenantPlan(state));
    console.debug('Is Tenant Active:', tenantSelectors.isTenantActive(state));
    console.debug('Is Tenant On Trial:', tenantSelectors.isTenantOnTrial(state));
    console.debug('Can Switch Tenant:', tenantSelectors.canSwitchTenant(state));
    console.groupEnd();

    // UI debug
    console.group('🎨 UI State');
    console.debug('Theme:', uiSelectors.theme(state));
    console.debug('Is Dark Mode:', uiSelectors.isDarkMode(state));
    console.debug('Is Light Mode:', uiSelectors.isLightMode(state));
    console.debug('Sidebar Collapsed:', uiSelectors.sidebarCollapsed(state));
    console.groupEnd();

    // Notifications debug
    console.group('🔔 Notifications State');
    console.debug('All Notifications:', notificationSelectors.notifications(state));
    console.debug('Notification Count:', notificationSelectors.notificationCount(state));
    console.debug('Error Notifications:', notificationSelectors.errorNotifications(state));
    console.debug('Success Notifications:', notificationSelectors.successNotifications(state));
    console.debug('Has Notifications:', notificationSelectors.hasNotifications(state));
    console.groupEnd();

    // Combined selectors
    console.group('🔄 Combined Selectors');
    console.debug('Is App Ready:', combinedSelectors.isAppReady(state));
    console.debug('User Primary Tenant:', combinedSelectors.userPrimaryTenant(state));
    console.groupEnd();

    // Store metadata
    console.group('📊 Store Metadata');
    console.debug('Store Name:', 'app-store');
    console.debug('Persistence Active:', typeof localStorage !== 'undefined');
    console.debug('DevTools Enabled:', process.env.NODE_ENV === 'development');
    console.debug('Timestamp:', new Date().toISOString());
    console.groupEnd();

    console.debug('='.repeat(50));
    console.groupEnd();

    // Return useful debugging methods
    return {
        state,
        selectors: {
            auth: authSelectors,
            tenant: tenantSelectors,
            ui: uiSelectors,
            notifications: notificationSelectors,
            combined: combinedSelectors,
        },
        actions: {
            setUser: state.setUser,
            setAuthenticated: state.setAuthenticated,
            setCurrentTenant: state.setCurrentTenant,
            setTheme: state.setTheme,
            addNotification: state.addNotification,
            reset: state.reset,
            resetAuth: state.resetAuth,
            resetTenant: state.resetTenant,
        },
        utils: {
            subscribe: subscribeToStore,
            getState: getAppState,
        }
    };
};