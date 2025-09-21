// bayaan-portal/src/App.tsx
import React, {useEffect} from 'react';
import {RouterProvider} from 'react-router-dom';
import {QueryProvider} from '@/lib/query';
import {router} from '@/router';
import ErrorBoundary from '@/components/ErrorBoundary';
import GlobalErrorHandler from '@/lib/error-handler';
import {LanguageProvider} from '@/providers/LanguageProvider';
import {debugStore, useAppStore} from '@/store';
import '@/lib/i18n';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const storeReady = useAppStore(state => state !== null);

    useEffect(() => {
        GlobalErrorHandler.getInstance();

        // Initialize store debugging in development
        if (process.env.NODE_ENV === 'development') {
            if (storeReady) {
                console.log('Store ready');
            }
            debugStore();
            // Make store available globally for debugging
            (window as any).__APP_STORE__ = useAppStore;
        }
    }, []);

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <ErrorBoundary level="page" showErrorDetails={process.env.NODE_ENV === 'development'}>
            <QueryProvider>
                <LanguageProvider>
                    <AppInitializer>
                        {/* Main app router */}
                        <RouterProvider router={router}/>
                    </AppInitializer>
                </LanguageProvider>
            </QueryProvider>
        </ErrorBoundary>
    );
};

export default App;
