// bayaan-portal/src/components/FeatureErrorBoundary
import React, {type ReactNode} from 'react';
import ErrorBoundary from './ErrorBoundary';

interface FeatureErrorBoundaryProps {
    children: ReactNode;
    featureName: string;
    fallback?: ReactNode;
}

/**
 * Specialized Error Boundary for feature modules
 * Provides feature-specific error handling and reporting
 */
const FeatureErrorBoundary: React.FC<FeatureErrorBoundaryProps> = ({
                                                                       children,
                                                                       featureName,
                                                                       fallback,
                                                                   }) => {
    const handleFeatureError = (error: Error, errorInfo: any) => {
        // Feature-specific error handling
        console.error(`Error in ${featureName} ${errorInfo} feature:`, error);

        // Could implement feature-specific error reporting here
        // e.g., different endpoints, different error categorization
    };

    return (
        <ErrorBoundary
            level="feature"
            featureName={featureName}
            onError={handleFeatureError}
            fallback={fallback}
        >
            {children}
        </ErrorBoundary>
    );
};

export default FeatureErrorBoundary;