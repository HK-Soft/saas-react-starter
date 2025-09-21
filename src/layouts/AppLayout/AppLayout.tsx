// bayaan-portal/src/layouts/AppLayout/AppLayout
import React, {Suspense} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {AppSidebar} from '@/layouts/AppLayout/components/AppSidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Separator} from '@/components/ui/separator';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import RouteLoading from '@/components/RouteLoading';

interface AppLayoutProps {
    children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = () => {
    const location = useLocation();

    // Generate breadcrumb items based on current path
    const generateBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        // Add root if not on dashboard
        if (pathSegments[0] !== 'dashboard') {
            breadcrumbs.push({
                label: 'Dashboard',
                href: '/dashboard',
                isLast: false
            });
        }

        // Transform path segments to readable labels
        const segmentLabels: Record<string, string> = {
            dashboard: 'Dashboard',
            projects: 'Projects',
            tasks: 'Tasks',
            team: 'Team',
            reports: 'Reports',
            settings: 'Settings',
            analytics: 'Analytics',
            blank: 'Blank Page',
        };

        pathSegments.forEach((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            const href = '/' + pathSegments.slice(0, index + 1).join('/');

            breadcrumbs.push({
                label,
                href,
                isLast
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 flex-1">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <React.Fragment key={breadcrumb.href}>
                                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                            {breadcrumb.isLast ? (
                                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={breadcrumb.href}>
                                                    {breadcrumb.label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!breadcrumb.isLast && (
                                            <BreadcrumbSeparator className="hidden md:block"/>
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Suspense fallback={<RouteLoading message="Loading page..."/>}>
                        <Outlet/>
                    </Suspense>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AppLayout;