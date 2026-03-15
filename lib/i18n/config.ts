/** locale ที่ระบบรองรับตอนนี้ */
export type Locale = 'th' | 'en';

/** ชื่อ cookie ที่ใช้จำภาษาที่ผู้ใช้เลือก */
export const LOCALE_COOKIE_NAME = 'scm-locale';

/** ภาษา default ของระบบ */
export const DEFAULT_LOCALE: Locale = 'th';

/** รายการภาษาที่อนุญาตให้ใช้งาน */
export const SUPPORTED_LOCALES: Locale[] = ['th', 'en'];

export function isLocale(value?: string | null): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

export function resolveLocale(value?: string | null): Locale {
    return isLocale(value) ? value : DEFAULT_LOCALE;
}
