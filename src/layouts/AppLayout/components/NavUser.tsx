// bayaan-portal/src/layouts/AppLayout/components/NavUser
import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Settings, Sparkles} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from '@/components/ui/sidebar';
import {useAuth} from '@/hooks/useAuth';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';
import {cn} from '@/lib/utils';
import {useLanguage} from "@/providers/LanguageProvider";

interface NavUserProps {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}

export function NavUser({user}: NavUserProps) {
    const {isMobile} = useSidebar();
    const {logout} = useAuth();
    const {direction} = useLanguage();
    const {t} = useLocalizedContent();
    const handleLogout = () => {
        logout();
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "grid flex-1 text-start text-sm leading-tight",
                            )}>
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        dir={direction !== 'rtl' ? 'ltr' : 'rtl'}
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className={cn(
                                "flex items-center gap-2 px-1 py-1.5 text-start text-sm",
                            )}>
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name}/>
                                    <AvatarFallback className="rounded-lg">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    "grid flex-1 text-start text-sm leading-tight",
                                )}>
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator/>

                        {/* Language Switcher */}
                        <div className="p-2">
                            <LanguageSwitcher variant="inline" size="sm"/>
                        </div>

                        <DropdownMenuSeparator/>

                        <DropdownMenuGroup>
                            <DropdownMenuItem className={cn(
                                "flex items-center gap-2",
                            )}>
                                <Sparkles className="h-4 w-4"/>
                                {t('navigation.upgrade', {defaultValue: 'Upgrade to Pro'})}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator/>

                        <DropdownMenuGroup>
                            <DropdownMenuItem className={cn(
                                "flex items-center gap-2",
                            )}>
                                <BadgeCheck className="h-4 w-4"/>
                                {t('navigation.profile')}
                            </DropdownMenuItem>

                            <DropdownMenuItem className={cn(
                                "flex items-center gap-2",
                            )}>
                                <CreditCard className="h-4 w-4"/>
                                {t('navigation.billing', {defaultValue: 'Billing'})}
                            </DropdownMenuItem>

                            <DropdownMenuItem className={cn(
                                "flex items-center gap-2",
                            )}>
                                <Bell className="h-4 w-4"/>
                                {t('navigation.notifications', {defaultValue: 'Notifications'})}
                            </DropdownMenuItem>

                            <DropdownMenuItem className={cn(
                                "flex items-center gap-2",
                            )}>
                                <Settings className="h-4 w-4"/>
                                {t('navigation.settings')}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className={cn(
                                "flex items-center gap-2",
                            )}
                        >
                            <LogOut className="h-4 w-4"/>
                            {t('navigation.logout')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}