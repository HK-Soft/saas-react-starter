// bayaan-portal/src/guards/AuthGuard
import React, {type ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {AlertTriangle, RefreshCw} from 'lucide-react';

interface AuthGuardProps {
    children: ReactNode;
    requiredRoles?: string[];
    fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
                                                 children,
                                                 requiredRoles = [],
                                                 fallbackPath = '/auth/login'
                                             }) => {
    const {
        isAuthenticated,
        isInitializing,
        initError,
        user,
        hasAnyRole,
        retryAuth,
        authInitialized,
    } = useAuth();
    const location = useLocation();
    const {t} = useLocalizedContent();

    // If initializing, show loading
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div
                        className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground text-sm">
                        {t('actions.loading', {defaultValue: 'Loading...'})}
                    </p>
                </div>
            </div>
        );
    }

    // Show error if initialization failed
    if (initError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertDescription className="mt-2">
                            <div className="space-y-3">
                                <p>Authentication service failed to initialize.</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={retryAuth}
                                    className="w-full"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2"/>
                                    Retry
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    // Check role-based authorization if user is authenticated
    if (isAuthenticated && requiredRoles.length > 0) {
        if (!user || !hasAnyRole(requiredRoles)) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertDescription>
                                You don't have permission to access this page.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            );
        }
    }

    // If not authenticated, redirect to log-in
    if (!isAuthenticated && authInitialized) {
        return <Navigate to={fallbackPath} state={{from: location}} replace/>;
    }

    // If we're still here and auth is not initialized, something went wrong
    if (!authInitialized && !isInitializing && !initError) {
        console.warn('AuthGuard: Unexpected state - auth not initialized but not initializing');
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertDescription className="mt-2">
                            <div className="space-y-3">
                                <p>Authentication state is inconsistent.</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                    className="w-full"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2"/>
                                    Reload Page
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;