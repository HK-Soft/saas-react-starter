// bayaan-portal/src/guards/TenantGuard
import React, {type ReactNode} from 'react';
import {useTenant} from '@/hooks/useTenant';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {AlertTriangle, RefreshCw} from 'lucide-react';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';

interface TenantGuardProps {
    children: ReactNode;
}

const TenantGuard: React.FC<TenantGuardProps> = ({children}) => {
    const {currentTenant, isLoading, isInitialized, error} = useTenant();
    const {t} = useLocalizedContent({namespace: 'errors'});

    // DEBUG: Log the values
    console.log('TenantGuard values:', {
        currentTenant: currentTenant?.id,
        isLoading,
        isInitialized,
        error: error?.message
    });

    // Show loading during tenant initialization
    if (isLoading && !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div
                        className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground text-sm">
                        {t('tenant.loading', {defaultValue: 'Loading workspace...'})}
                    </p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertDescription className="mt-2">
                            <div className="space-y-3">
                                <p>{error.message}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                    className="w-full"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2"/>
                                    {t('common:actions.retry')}
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    // Show no workspace state
    if (!currentTenant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground"/>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">
                            {t('tenant.noWorkspace.title', {defaultValue: 'No Workspace Available'})}
                        </h2>
                        <p className="text-muted-foreground">
                            {t('tenant.noWorkspace.message', {
                                defaultValue: 'You don\'t have access to any workspaces. Please contact your administrator.'
                            })}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        <RefreshCw className="h-4 w-4 mr-2"/>
                        {t('common:actions.refresh')}
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default TenantGuard;