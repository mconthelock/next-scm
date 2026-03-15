import type { Locale } from '@/lib/i18n/config';
import type { CommonMessages } from '@/lib/i18n/types';

/** ข้อความทั่วไปที่ใช้ร่วมกันในหลายหน้า */
export const commonMessages: Record<Locale, CommonMessages> = {
    th: {
        loading: 'กำลังโหลด...',
        signingIn: 'กำลังเข้าสู่ระบบ...',
        language: 'ภาษา',
        thai: 'ไทย',
        english: 'อังกฤษ',
    },
    en: {
        loading: 'Loading...',
        signingIn: 'Signing in...',
        language: 'Language',
        thai: 'Thai',
        english: 'English',
    },
};
