// bayaan-portal/src/layouts/AuthLayout/AuthLayout
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* The Outlet will render the Login component with its own full layout */}
            <Outlet />

            {/* Footer - positioned absolutely at the bottom */}
            <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
                <div className="container mx-auto px-4 py-3">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; 2025 Bayaan App. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;