// bayaan-portal/src/router/index
import {lazy} from 'react';
import {createBrowserRouter, Navigate} from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import RootLayout from "@/router/RootLayout";
import LazyWrapper from "@/router/LazyWrapper";
import ProtectedLayout from "@/router/ProtectedLayout";

// Lazy load components for better performance
const BlankPage = lazy(() => import('@/pages/Blank/BlankPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const NotFound = lazy(() => import('@/pages/Error/NotFound'));

// Create the router configuration
export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        errorElement: <NotFound/>,
        children: [
            // Public routes
            {
                path: "auth",
                element: <AuthLayout/>,
                children: [
                    {
                        path: "login",
                        element: (
                            <LazyWrapper message="Loading login page...">
                                <Login/>
                            </LazyWrapper>
                        ),
                    },
                    {
                        index: true,
                        element: <Navigate to="/auth/login" replace/>,
                    },
                ],
            },
            // Protected routes
            {
                path: "/",
                element: <ProtectedLayout/>,
                children: [
                    {
                        path: "dashboard",
                        element: (
                            <LazyWrapper message="Loading dashboard...">
                                <Dashboard/>
                            </LazyWrapper>
                        ),
                    },
                    {
                        path: "blank",
                        element: (
                            <LazyWrapper message="Loading page...">
                                <BlankPage/>
                            </LazyWrapper>
                        )
                    },
                    {
                        index: true,
                        element: <Navigate to="/dashboard" replace/>,
                    },
                ]
            },
            // Catch-all route
            {
                path: "*",
                element: (
                    <LazyWrapper>
                        <NotFound/>
                    </LazyWrapper>
                ),
            },
        ],
    },
]);