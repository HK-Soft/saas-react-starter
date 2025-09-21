// bayaan-portal/src/components/RouteLoading
import React from 'react';

interface RouteLoadingProps {
    message?: string;
    minimal?: boolean;
}

const RouteLoading: React.FC<RouteLoadingProps> = ({
                                                       message,
                                                       minimal = false,
                                                   }) => {

    const displayMessage = message || 'Loading...';

    if (minimal) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-[200px]">
            <div className="text-center space-y-3">
                <div
                    className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground text-sm">{displayMessage}</p>
            </div>
        </div>
    );
};

export default RouteLoading;
