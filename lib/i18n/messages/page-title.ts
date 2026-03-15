import type { Locale } from '@/lib/i18n/config';

/** key ของข้อความ PageTitle ที่ใช้ซ้ำในหลายหน้า */
export interface PageTitleMessages {
    scmTitle: string;
    scmSubtitle: string;
    aboutTitle: string;
    profileTitle: string;
    settingsTitle: string;
    adminUserTitle: string;
    adminUserSubtitle: string;
}

/** ข้อความสำหรับ banner ชื่อหน้าของแต่ละภาษา */
export const pageTitleMessages: Record<Locale, PageTitleMessages> = {
    th: {
        scmTitle: `ระบบจัดการห่วงโซ่อุปทาน`,
        scmSubtitle: `ระบบจัดการห่วงโซ่อุปทานส่วนกลาง ออกแบบตามมาตรฐาน Mitsubishi Electric`,
        aboutTitle: `เกี่ยวกับเรา`,
        profileTitle: `โปรไฟล์ผู้ใช้`,
        settingsTitle: `ตั้งค่า`,
        adminUserTitle: `จัดการผู้ใช้`,
        adminUserSubtitle: `หน้าสำหรับจัดการผู้ใช้ในระบบ`,
    },
    en: {
        scmTitle: 'Supply Chain Management',
        scmSubtitle:
            'Centralized supply chain management platform designed to align with Mitsubishi Electric standards.',
        aboutTitle: 'About Us',
        profileTitle: 'User Profile',
        settingsTitle: 'Settings',
        adminUserTitle: `Manage Users`,
        adminUserSubtitle: `Page for managing users in the system`,
    },
};
