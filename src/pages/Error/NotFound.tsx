// bayaan-portal/src/pages/Error/NotFound
import React from 'react';
import {Link} from "react-router-dom";
import {ArrowLeft, ArrowRight, Home} from "lucide-react";
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import {useLanguage} from '@/providers/LanguageProvider';
import {cn} from '@/lib/utils';

const NotFound: React.FC = () => {
    const {t} = useLocalizedContent({namespace: 'errors'});
    const {direction} = useLanguage();

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
            <div className={cn(
                "text-center max-w-2xl w-full space-y-8"
            )}>
                {/* Animated 404 with gradient */}
                <div className="relative">
                    <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 bg-clip-text leading-none select-none animate-pulse">
                        404
                    </h1>
                    <div
                        className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-primary/5 leading-none animate-pulse delay-150">
                        404
                    </div>
                </div>

                {/* Error message with better typography */}
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                        {t('notFound.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                        {t('notFound.subtitle')}
                    </p>
                </div>

                {/* Action buttons */}
                <div className={cn(
                    "flex flex-col sm:flex-row gap-4 justify-center items-center"
                )}>
                    <Link
                        to="/dashboard"
                        className={cn(
                            "inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group",
                        )}
                    >
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                        {t('generic.goHome')}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className={cn(
                            "inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group",
                        )}
                    >
                        {(direction !== 'rtl') ?
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> :
                            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
                        }
                        {t('common:actions.back')}
                    </button>
                </div>

                {/* Floating elements for visual interest */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-ping"></div>
                    <div
                        className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-300"></div>
                    <div
                        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/10 rounded-full animate-bounce delay-500"></div>
                    <div
                        className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-primary/20 rounded-full animate-pulse delay-700"></div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;