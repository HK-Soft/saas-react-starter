// bayaan-portal/src/components/LanguageSwitcher
import React from 'react';
import {Check, Globe, Loader2} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/providers/LanguageProvider';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import {cn} from '@/lib/utils';
import {useSidebar} from "@/components/ui/sidebar";
import type {SupportedLanguage} from "@/lib/i18n";

interface LanguageSwitcherProps {
    variant?: 'dropdown' | 'inline';
    size?: 'sm' | 'md' | 'lg';
    showFlag?: boolean;
    showNativeName?: boolean;
    className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
                                                                      variant = 'dropdown',
                                                                      size = 'md',
                                                                      showFlag = true,
                                                                      showNativeName = true,
                                                                      className
                                                                  }) => {
    const {
        currentLanguage,
        availableLanguages,
        changeLanguage,
        isChanging,
        direction
    } = useLanguage();
    const {isMobile} = useSidebar();
    const {t} = useLocalizedContent();

    const currentLangConfig = availableLanguages[currentLanguage];

    const handleLanguageChange = async (languageCode: string) => {
        if (languageCode !== currentLanguage && !isChanging) {
            await changeLanguage(languageCode as SupportedLanguage);
        }
    };

    if (variant === 'inline') {
        return (
            <div className={cn(
                "flex flex-wrap gap-2 ",
                className
            )}>
                {Object.entries(availableLanguages).map(([code, config]) => (
                    <Button
                        key={code}
                        variant={currentLanguage === code ? 'default' : 'outline'}
                        size={size === 'sm' ? 'sm' : 'default'}
                        onClick={() => handleLanguageChange(code)}
                        disabled={isChanging}
                        className={cn(
                            "flex items-center gap-2 flex-row",
                        )}
                    >
                        {isChanging && currentLanguage === code && (
                            <Loader2 className="h-3 w-3 animate-spin"/>
                        )}
                        {showFlag && <span className="text-sm">{config.flag}</span>}
                        <span className="text-xs font-medium">
                            {showNativeName ? config.nativeName : config.name}
                        </span>
                        {currentLanguage === code && !isChanging && (
                            <Check className="h-3 w-3"/>
                        )}
                    </Button>
                ))}
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={size === 'sm' ? 'sm' : 'default'}
                    dir={direction === 'rtl' ? 'rtl' : 'rtl'}
                    className={cn(
                        "flex items-center gap-2",
                        className
                    )}
                    disabled={isChanging}
                >
                    {isChanging ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        <Globe className="h-4 w-4"/>
                    )}
                    {showFlag && (
                        <span className="text-sm">{currentLangConfig.flag}</span>
                    )}
                    <span className="hidden sm:inline-block">
                        {
                            showNativeName ? currentLangConfig.nativeName : currentLangConfig.name
                        }
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56"
                align="start"
                dir={direction !== 'rtl' ? 'ltr' : 'rtl'}
                side={isMobile ? "bottom" : (direction !== 'rtl') ? "right" : "left"}
            >
                <DropdownMenuLabel>
                    {t('language.selectLanguage')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>

                {Object.entries(availableLanguages).map(([code, config]) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={cn(
                            "flex items-center gap-3 cursor-pointer",
                            currentLanguage === code && "bg-accent"
                        )}
                        disabled={isChanging}
                    >
                        <div className={cn(
                            "flex items-center gap-2 flex-1",
                        )}>
                            <span className="text-lg">{config.flag}</span>
                            <div className={cn("flex flex-col")}>
                                <span className="font-medium">{config.nativeName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {config.name}
                                </span>
                            </div>
                        </div>

                        {currentLanguage === code && (
                            <Check className="h-4 w-4 text-primary"/>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
