import type { Locale } from '@/lib/i18n/config';
import type { HeaderMessages } from '@/lib/i18n/types';

/** ข้อความในส่วน header และ account menu */
export const headerMessages: Record<Locale, HeaderMessages> = {
    th: {
        profile: 'โปรไฟล์',
        settings: 'ตั้งค่า',
        logout: 'ออกจากระบบ',
        login: 'เข้าสู่ระบบ',
        accountLogin: 'เข้าสู่ระบบบัญชี',
        noRoleAssigned: 'ยังไม่ได้กำหนดสิทธิ์',
        mobileTagline: 'Changes for the Better',
    },
    en: {
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        login: 'Login',
        accountLogin: 'Account Login',
        noRoleAssigned: 'No role assigned',
        mobileTagline: 'Changes for the Better',
    },
};
