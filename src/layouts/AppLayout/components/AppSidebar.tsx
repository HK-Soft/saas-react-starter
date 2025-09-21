// bayaan-portal/src/layouts/AppLayout/components/AppSidebar
import React from 'react';
import {GalleryVerticalEnd, SquareTerminal,} from 'lucide-react';
import {NavMain} from '@/layouts/AppLayout/components/NavMain';
import {NavUser} from '@/layouts/AppLayout/components/NavUser';
import {TenantSwitcher} from '@/layouts/AppLayout/components/TenantSwitcher';
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from '@/components/ui/sidebar';
import {useAuth} from '@/hooks/useAuth';
import {useTenant} from '@/hooks/useTenant';
import {useLanguage} from "@/providers/LanguageProvider";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {user} = useAuth();
    const {direction} = useLanguage();
    const {availableTenants} = useTenant();

    // Transform tenant data to match the expected format
    const tenants = availableTenants.map(tenant => ({
        name: tenant.name,
        logo: GalleryVerticalEnd, // You can map different logos based on tenant
        plan: tenant.plan,
        id: tenant.id,
    }));

    // Main navigation items
    const navMain = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                },
                {
                    title: "blankPage",
                    url: "/blank",
                },
            ],
        },

    ];

    // User data for the footer
    const userData = {
        name: user?.name || 'Unknown User',
        email: user?.email || 'user@example.com',
        avatar: '', // You can add avatar URL here
    };

    return (
        <Sidebar collapsible="icon" {...props} side={(direction !== 'rtl') ? "left" : "right"}>
            <SidebarHeader>
                <TenantSwitcher tenants={tenants}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}