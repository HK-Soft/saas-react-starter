// bayaan-portal/src/pages/Blank/BlankPage
import React from 'react';
import {useAuth} from '@/hooks/useAuth';
import {useTenant} from '@/hooks/useTenant';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Lightbulb} from 'lucide-react';
import FeatureErrorBoundary from '@/components/FeatureErrorBoundary';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import {cn} from '@/lib/utils';

/**
 * BlankPage Component
 */

interface BlankPageProps {
    // Custom content
    children?: React.ReactNode;
    // Development helpers
    featureName?: string;
    showDevInfo?: boolean;
}

const BlankPage: React.FC<BlankPageProps> = ({
                                                 children,
                                                 featureName,
                                                 showDevInfo = process.env.NODE_ENV === 'development'
                                             }) => {
    const {user} = useAuth();
    const {currentTenant} = useTenant();
    const {t, formatDate} = useLocalizedContent({namespace: 'blankPage'});

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('common:greetings.goodMorning');
        if (hour < 18) return t('common:greetings.goodAfternoon');
        return t('common:greetings.goodEvening');
    };

    return (
        <FeatureErrorBoundary featureName={featureName || t('title')}>
            <div className="flex grow flex-col space-y-6">
                {/* Development Info Banner */}
                {showDevInfo && (
                    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                        <CardContent>
                            <div className={cn(
                                "flex items-center gap-2 text-amber-800 dark:text-amber-200",
                            )}>
                                <Lightbulb className="h-4 w-4"/>
                                <span className="text-sm font-medium">
                                    {t('devMode.title')}
                                </span>
                                {featureName && (
                                    <Badge variant="outline" className="text-xs">
                                        {featureName}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                {t('devMode.description')}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content */}
                {children ? (
                    children
                ) : (
                    <div className="flex grow items-center justify-center min-h-[400px]">
                        <div className="text-center max-w-md space-y-6">
                            {/* Content */}
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">
                                    {t('greeting', {
                                        greeting: getGreeting(),
                                        name: user?.name || t('common:greetings.welcome')
                                    })}
                                </h2>
                                <p className="text-muted-foreground">
                                    {t('subtitle')}
                                </p>
                            </div>

                            {/* Optional: Add current date/time */}
                            <div className="text-sm text-muted-foreground">
                                {formatDate(new Date(), 'full')}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                <Card className="border-dashed">
                    <CardContent className="pt-6">
                        <div className="text-center text-sm text-muted-foreground">
                            <p>
                                {t('footer.currentTenant', {
                                    tenantName: currentTenant?.name || t('footer.unknownTenant')
                                })}
                            </p>
                            <p className="mt-1">
                                {t('footer.readyMessage')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FeatureErrorBoundary>
    );
};

export default BlankPage;