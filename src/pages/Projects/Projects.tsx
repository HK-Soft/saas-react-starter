// bayaan-portal/src/pages/Error/Projects
import React from 'react';
import {useAuth} from '@/hooks/useAuth';
import {useTenant} from '@/hooks/useTenant';
import {Button} from '@/components/ui/button';
import {Plus} from "lucide-react";


const Projects: React.FC = () => {
    const {user} = useAuth();
    const {currentTenant} = useTenant();


    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {getGreeting()}, {user?.name}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's happening in {currentTenant?.name || 'your workspace'} today.
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    New Project
                </Button>
            </div>
        </div>
    );
};

export default Projects;