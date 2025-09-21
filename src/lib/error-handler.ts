// bayaan-portal/src/lib/error-handler
import { getAppState } from '@/store';

export interface ErrorReport {
    error: Error;
    errorInfo?: any;
    context?: string;
    userId?: string;
    timestamp: string;
    url: string;
    userAgent: string;
}

class GlobalErrorHandler {
    private static instance: GlobalErrorHandler;

    private constructor() {
        this.setupGlobalHandlers();
    }

    public static getInstance(): GlobalErrorHandler {
        if (!GlobalErrorHandler.instance) {
            GlobalErrorHandler.instance = new GlobalErrorHandler();
        }
        return GlobalErrorHandler.instance;
    }

    private setupGlobalHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);

            this.reportError({
                error: new Error(`Unhandled Promise Rejection: ${event.reason}`),
                context: 'unhandledrejection',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
            });

            // Prevent the default console error
            event.preventDefault();
        });

        // Handle global JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);

            this.reportError({
                error: event.error || new Error(event.message),
                context: 'global',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
            });
        });
    }

    public reportError(errorReport: ErrorReport) {
        // Use the new store getter to access notifications
        const store = getAppState();

        // Add to global notifications
        store.addNotification({
            type: 'error',
            title: 'Application Error',
            message: 'An unexpected error occurred. Our team has been notified.',
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Global Error Report');
            console.error('Error Report:', errorReport);
            console.groupEnd();
        }

        // TODO: Send to external error tracking service
        // this.sendToErrorService(errorReport);
    }

    // private async sendToErrorService(errorReport: ErrorReport) {
    //   try {
    //     await fetch('/api/errors', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(errorReport),
    //     });
    //   } catch (error) {
    //     console.error('Failed to report error to service:', error);
    //   }
    // }
}

export default GlobalErrorHandler;