// bayaan-portal/src/router/ProtectedLayout
import React from "react";
import AuthGuard from "@/guards/AuthGuard";
import TenantGuard from "@/guards/TenantGuard";
import AppLayout from "@/layouts/AppLayout/AppLayout";
import FeatureErrorBoundary from "@/components/FeatureErrorBoundary";

const ProtectedLayout: React.FC = () => {
    return (
        <FeatureErrorBoundary featureName="Protected App">
            <AuthGuard>
                <TenantGuard>
                    <AppLayout/>
                </TenantGuard>
            </AuthGuard>
        </FeatureErrorBoundary>
    );
};

export default ProtectedLayout;