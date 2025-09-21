// bayaan-portal/src/layouts/AppLayout/components/TenantSwitcher
import React from 'react';
import {ChevronsUpDown, Plus} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from '@/components/ui/sidebar';
import {useTenant} from '@/hooks/useTenant';
import {useLanguage} from "@/providers/LanguageProvider";
import {useLocalizedContent} from "@/hooks/useLocalizedContent.ts";

interface TenantSwitcherProps {
    tenants: {
        id: string;
        name: string;
        logo: React.ElementType;
        plan: string;
    }[];
}

export function TenantSwitcher({tenants}: TenantSwitcherProps) {
    const {isMobile} = useSidebar();
    const {direction} = useLanguage();
    const {currentTenant, switchTenant} = useTenant();
    const {t} = useLocalizedContent();

    // Find the active tenant based on current tenant
    const activeTenant = tenants.find(tenant => tenant.id === currentTenant?.id) || tenants[0];

    if (!activeTenant) {
        return null;
    }

    const handleTenantSwitch = (tenantId: string) => {
        switchTenant(tenantId);
    };


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div
                                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <activeTenant.logo className="size-4"/>
                            </div>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-medium">{activeTenant.name}</span>
                                <span className="truncate text-xs">{activeTenant.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        dir={direction !== 'rtl' ? 'ltr' : 'rtl'}
                        side={isMobile ? "bottom" : (direction !== 'rtl') ? "right" : "left"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            {t('navigation.workspaces', {defaultValue: 'Workspaces'})}
                        </DropdownMenuLabel>
                        {tenants.map((tenant, index) => (
                            <DropdownMenuItem
                                key={tenant.id}
                                onClick={() => handleTenantSwitch(tenant.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <tenant.logo className="size-3.5 shrink-0"/>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{tenant.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {t(`subscriptions.${tenant.plan.toLowerCase()}`, {defaultValue: tenant.plan})}
                                    </span>
                                </div>
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4"/>
                            </div>
                            <div
                                className="text-muted-foreground font-medium">
                                {t('actions.createWorkspaces', {defaultValue: 'Create workspace'})}
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}