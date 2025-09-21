// bayaan-portal/src/components/GlobalLoadingBar
import React, {useEffect, useState} from 'react';
import {useApiLoading} from '@/hooks/useApiLoading';

export const GlobalLoadingBar: React.FC = () => {
    const {isApiLoading} = useApiLoading();
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    const shouldShow = isApiLoading;

    // Handle visibility with smooth transitions
    useEffect(() => {
        if (shouldShow) {
            setIsVisible(true);
            setProgress(0);

            // Animate progress
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev; // Stop at 90% until completion
                    return prev + Math.random() * 15;
                });
            }, 100);

            return () => clearInterval(interval);
        } else {
            // Complete the progress bar
            setProgress(100);

            // Hide after completion animation
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
            }, 200);

            return () => clearTimeout(hideTimer);
        }
    }, [shouldShow]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
            <div
                className={`h-full transition-all duration-200 ease-out bg-primary`}
                style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                }}
            />
        </div>
    );
};