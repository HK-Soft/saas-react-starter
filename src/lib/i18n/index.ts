// bayaan-portal/src/lib/i18n/index
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enErrors from './locales/en/errors.json';
import enBlankPage from './locales/en/blankPage.json';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arDashboard from './locales/ar/dashboard.json';
import arErrors from './locales/ar/errors.json';
import arBlankPage from './locales/ar/blankPage.json';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frErrors from './locales/fr/errors.json';
import frBlankPage from './locales/fr/blankPage.json';

// Language configuration
export const SUPPORTED_LANGUAGES = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        dir: 'ltr' as const
    },
    ar: {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        dir: 'rtl' as const
    },
    fr: {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        dir: 'ltr' as const
    }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// RTL languages list
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

// Resources object
const resources = {
    en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        errors: enErrors,
        blankPage: enBlankPage
    },
    ar: {
        common: arCommon,
        auth: arAuth,
        dashboard: arDashboard,
        errors: arErrors,
        blankPage: arBlankPage
    },
    fr: {
        common: frCommon,
        auth: frAuth,
        dashboard: frDashboard,
        errors: frErrors,
        blankPage: frBlankPage
    }
};

// Language detector configuration
const detectionOptions = {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'preferred_language',
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'],
    checkWhitelist: true
};

// Initialize i18n
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        detection: detectionOptions,

        interpolation: {
            escapeValue: false, // React already escapes values
            format: (value, format) => {
                // Custom formatting for dates and numbers
                if (format === 'number') {
                    return new Intl.NumberFormat(i18n.language).format(value);
                }
                if (format === 'currency') {
                    return new Intl.NumberFormat(i18n.language, {
                        style: 'currency',
                        currency: 'USD'
                    }).format(value);
                }
                if (format === 'date') {
                    return new Intl.DateTimeFormat(i18n.language).format(new Date(value));
                }
                if (format === 'datetime') {
                    return new Intl.DateTimeFormat(i18n.language, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(new Date(value));
                }
                return value;
            }
        },

        keySeparator: '.',
        nsSeparator: ':',

        // Namespace configuration
        defaultNS: 'common',
        ns: ['common', 'auth', 'dashboard', 'errors', 'blankPage'],

        // React-specific options
        react: {
            useSuspense: false,
            bindI18n: 'languageChanged',
            bindI18nStore: '',
            transEmptyNodeValue: '',
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
        }
    });

// Helper functions
export const getCurrentLanguage = (): SupportedLanguage => {
    return i18n.language as SupportedLanguage;
};

export const isRTL = (language?: string): boolean => {
    const lang = (language || getCurrentLanguage()) as SupportedLanguage;
    return RTL_LANGUAGES.includes(lang);
};

export const getLanguageDirection = (language?: string): 'ltr' | 'rtl' => {
    return isRTL(language) ? 'rtl' : 'ltr';
};

export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
    await i18n.changeLanguage(language);

    // Update document direction and lang attributes
    const direction = getLanguageDirection(language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;

    // Update localStorage
    localStorage.setItem('preferred_language', language);

    // Emit custom event for other components to react
    window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: {language, direction}
    }));
};

// Set initial direction on load
document.documentElement.dir = getLanguageDirection();
document.documentElement.lang = getCurrentLanguage();

export default i18n;