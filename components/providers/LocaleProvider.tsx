'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import {
    LOCALE_COOKIE_NAME,
    messagesByLocale,
    type AppMessages,
    type Locale,
} from '@/lib/i18n';

/** ค่าที่แชร์ให้ component ต่าง ๆ ใช้งานภาษาเดียวกันได้ */
interface LocaleContextValue {
    locale: Locale;
    messages: AppMessages;
    setLocale: (nextLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** provider กลางสำหรับเก็บ locale ปัจจุบันและข้อความของภาษานั้น */
export function LocaleProvider({
    initialLocale,
    children,
}: {
    initialLocale: Locale;
    children: ReactNode;
}) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    useEffect(() => {
        document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = locale;
    }, [locale]);

    const value = useMemo(
        () => ({
            locale,
            messages: messagesByLocale[locale],
            setLocale: setLocaleState,
        }),
        [locale],
    );

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider');
    }

    return context;
}
