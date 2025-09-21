// bayaan-portal/src/providers/LanguageProvider
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    changeLanguage,
    getCurrentLanguage,
    getLanguageDirection,
    isRTL,
    SUPPORTED_LANGUAGES,
    type SupportedLanguage
} from '@/lib/i18n';

interface LanguageContextType {
    currentLanguage: SupportedLanguage;
    isRTL: boolean;
    direction: 'ltr' | 'rtl';
    availableLanguages: typeof SUPPORTED_LANGUAGES;
    changeLanguage: (language: SupportedLanguage) => Promise<void>;
    isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
    const {i18n} = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getCurrentLanguage());
    const [isChanging, setIsChanging] = useState(false);

    const direction = getLanguageDirection(currentLanguage);
    const isCurrentRTL = isRTL(currentLanguage);

    const handleLanguageChange = async (language: SupportedLanguage) => {
        if (language === currentLanguage) return;

        setIsChanging(true);
        try {
            await changeLanguage(language);
            setCurrentLanguage(language);
        } catch (error) {
            console.error('Failed to change language:', error);
        } finally {
            setIsChanging(false);
        }
    };

    // Listen for language changes from i18n
    useEffect(() => {
        const handleI18nLanguageChange = (lng: string) => {
            setCurrentLanguage(lng as SupportedLanguage);
        };

        i18n.on('languageChanged', handleI18nLanguageChange);

        return () => {
            i18n.off('languageChanged', handleI18nLanguageChange);
        };
    }, [i18n]);

    // Listen for custom language change events
    useEffect(() => {
        const handleCustomLanguageChange = (event: CustomEvent) => {
            const {language} = event.detail;
            setCurrentLanguage(language);
        };

        window.addEventListener('languageChanged', handleCustomLanguageChange as EventListener);

        return () => {
            window.removeEventListener('languageChanged', handleCustomLanguageChange as EventListener);
        };
    }, []);

    const value: LanguageContextType = {
        currentLanguage,
        isRTL: isCurrentRTL,
        direction,
        availableLanguages: SUPPORTED_LANGUAGES,
        changeLanguage: handleLanguageChange,
        isChanging
    };

    return (
        <LanguageContext.Provider value={value}>
            <div dir={direction} className={direction === 'rtl' ? 'rtl' : 'ltr'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};