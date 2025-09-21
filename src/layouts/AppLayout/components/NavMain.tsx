// bayaan-portal/src/layouts/AppLayout/components/NavMain
import {ChevronRight, LoaderIcon, type LucideIcon} from 'lucide-react';
import {Link, useLocation, useNavigation} from 'react-router-dom';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import {cn} from '@/lib/utils';

interface NavMainProps {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}

export function NavMain({items}: NavMainProps) {
    const location = useLocation();
    const navigation = useNavigation();
    const {t} = useLocalizedContent();

    const isNavigating = navigation.state === 'loading';
    const navigatingTo = navigation.location?.pathname;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{t('navigation.platform', {defaultValue: 'Platform'})}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isCurrentPath = location.pathname === item.url ||
                        location.pathname.startsWith(item.url + '/');

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive || isCurrentPath}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={t(`navigation.${item.title.toLowerCase()}`, {defaultValue: item.title})}
                                        className={cn(
                                            "flex items-center gap-2"
                                        )}
                                    >
                                        {item.icon && <item.icon className="h-4 w-4"/>}
                                        <span>{t(`navigation.${item.title.toLowerCase()}`, {defaultValue: item.title})}</span>
                                        <ChevronRight
                                            name="ChevronRight"
                                            className={cn(
                                                "ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                            )}
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            const isActive = location.pathname === subItem.url;
                                            const isLoadingTarget = isNavigating && navigatingTo === subItem.url;

                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={isActive}
                                                        className={cn(
                                                            "relative flex items-center gap-2",
                                                        )}
                                                    >
                                                        <Link to={subItem.url}>
                                                            {isLoadingTarget ? (
                                                                <LoaderIcon className="size-4 animate-spin"/>
                                                            ) : (
                                                                item.icon && <item.icon className="size-4"/>
                                                            )}
                                                            <span>
                                                                {t(`navigation.${subItem.title.toLowerCase()}`, {
                                                                    defaultValue: subItem.title
                                                                })}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}