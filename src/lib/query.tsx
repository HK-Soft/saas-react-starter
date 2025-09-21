// bayaan-portal/src/lib/query.ts
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React from 'react';
import QueryErrorBoundary from '@/components/QueryErrorBoundary';

// Create query client with optimal configuration
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
                // Don't retry on 4xx errors
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false;
                }
                return failureCount < 3;
            },
        },
        mutations: {
            retry: false,
            onError: (error) => {
                console.error('Mutation Error:', error);
            }
        },
    },
});

// Query provider wrapper
export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <QueryClientProvider client={queryClient}>
        <QueryErrorBoundary>
            {children}
        </QueryErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
);