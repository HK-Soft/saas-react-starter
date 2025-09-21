// bayaan-portal/src/components/QueryErrorBoundary
import React, {type ReactNode} from 'react';
import {QueryErrorResetBoundary} from '@tanstack/react-query';
import ErrorBoundary from './ErrorBoundary';
import {Button} from '@/components/ui/button';
import {RefreshCw} from 'lucide-react';

interface QueryErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Error boundary specifically for TanStack Query errors
 * Provides query-specific error handling and reset functionality
 */
const QueryErrorBoundary: React.FC<QueryErrorBoundaryProps> = ({
                                                                   children,
                                                                   fallback,
                                                               }) => {
    return (
        <QueryErrorResetBoundary>
            {({reset}) => (
                <ErrorBoundary
                    fallback={
                        fallback || (
                            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                                <p className="text-muted-foreground">Failed to load data</p>
                                <Button onClick={reset} variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2"/>
                                    Retry
                                </Button>
                            </div>
                        )
                    }
                    onError={(error) => {
                        console.error('Query Error Boundary:', error);
                        // Reset queries on error
                        reset();
                    }}
                >
                    {children}
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};

export default QueryErrorBoundary;