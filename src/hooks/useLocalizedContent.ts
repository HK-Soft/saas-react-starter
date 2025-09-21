// bayaan-portal/src/hooks/useLocalizedContent
import {useTranslation} from 'react-i18next';
import {useLanguage} from '@/providers/LanguageProvider';

interface LocalizedContentOptions {
    namespace?: string;
    keyPrefix?: string;
}

export const useLocalizedContent = (options: LocalizedContentOptions = {}) => {
    const {namespace = 'common', keyPrefix} = options;
    const {t} = useTranslation(namespace, {keyPrefix});
    const {currentLanguage, direction, isRTL} = useLanguage();

    // Helper function for pluralization
    const tPlural = (key: string, count: number, options?: any) => {
        return t(key, {count, ...options});
    };

    // Helper function for formatting dates
    const formatDate = (date: Date | string, format: 'short' | 'long' | 'full' = 'short') => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            },
            full: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            }
        };

        return new Intl.DateTimeFormat(currentLanguage, formatOptions[format]).format(dateObj);
    };

    // Helper function for formatting numbers
    const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
        return new Intl.NumberFormat(currentLanguage, options).format(number);
    };

    // Helper function for formatting currency
    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat(currentLanguage, {
            style: 'currency',
            currency
        }).format(amount);
    };

    // Helper function for relative time formatting
    const formatRelativeTime = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) {
            return t('time.timeAgo.justNow');
        } else if (diffInMinutes < 60) {
            return tPlural('time.timeAgo.minutesAgo', diffInMinutes);
        } else if (diffInMinutes < 1440) { // 24 hours
            const hours = Math.floor(diffInMinutes / 60);
            return tPlural('time.timeAgo.hoursAgo', hours);
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return tPlural('time.timeAgo.daysAgo', days);
        }
    };

    return {
        t,
        tPlural,
        currentLanguage,
        direction,
        isRTL,
        formatDate,
        formatNumber,
        formatCurrency,
        formatRelativeTime
    };
};