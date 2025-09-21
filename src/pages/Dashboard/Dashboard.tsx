// bayaan-portal/src/pages/Dashboard/Dashboard
import React from 'react';
import {useAuth} from '@/hooks/useAuth';
import {useTenant} from '@/hooks/useTenant';
import {Button} from '@/components/ui/button';
import {Plus,} from 'lucide-react';
import {cn} from "@/lib/utils";
import FeatureErrorBoundary from "@/components/FeatureErrorBoundary";
import {useLocalizedContent} from '@/hooks/useLocalizedContent';

const Dashboard: React.FC = () => {
    const {user} = useAuth();
    const {currentTenant} = useTenant();
    const {t} = useLocalizedContent({namespace: 'dashboard'});

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('common:greetings.goodMorning');
        if (hour < 18) return t('common:greetings.goodAfternoon');
        return t('common:greetings.goodEvening');
    };

    return (
        <FeatureErrorBoundary featureName="Dashboard">
            <div className="flex grow flex-col space-y-6">
                {/* Welcome Header */}
                <div className={cn(
                    "flex items-center justify-between",
                )}>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('welcome', {
                                greeting: getGreeting(),
                                name: user?.name
                            })}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('subtitle', {
                                workspace: currentTenant?.name || t('common:app.name')
                            })}
                        </p>
                    </div>
                    <Button className={cn(
                        "flex items-center gap-2"
                    )}>
                        <Plus name="Plus" className="h-4 w-4"/>
                        {t('actions.newProject')}
                    </Button>
                </div>
            </div>
        </FeatureErrorBoundary>
    );
};

export default Dashboard;