// bayaan-portal/src/router/LazyWrapper
import React, {Suspense} from "react";
import RouteLoading from "@/components/RouteLoading";

interface LazyWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    type?: 'route' | 'component';
    message?: string;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
                                                     children,
                                                     fallback,
                                                     message
                                                 }) => {
    const defaultFallback = (
        <RouteLoading message={message}/>
    );

    return (
        <Suspense fallback={fallback || defaultFallback}>
            {children}
        </Suspense>
    );
};

export default LazyWrapper;
