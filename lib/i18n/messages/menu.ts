import type { Locale } from '@/lib/i18n/config';
import type { MenuLabelMessages } from '@/lib/i18n/types';

/** ข้อความแปลชื่อเมนูที่มาจาก API หรือ config */
export const menuLabelMessages: Record<Locale, MenuLabelMessages> = {
    th: {
        Home: 'หน้าแรก',
        About: 'เกี่ยวกับ',
        Profile: 'โปรไฟล์',
        Settings: 'ตั้งค่า',
    },
    en: {
        Home: 'Home',
        About: 'About',
        Profile: 'Profile',
        Settings: 'Settings',
    },
};
