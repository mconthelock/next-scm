import type { Locale } from '@/lib/i18n/config';

/** key ของข้อความ PageTitle ที่ใช้ซ้ำในหลายหน้า */
export interface PageTitleMessages {
    scmTitle: string;
    scmSubtitle: string;
    homeGreetingFallbackTitle: string;
    homeGreetingMorningTitle: string;
    homeGreetingAfternoonTitle: string;
    homeGreetingEveningTitle: string;
    aboutTitle: string;
    profileTitle: string;
    settingsTitle: string;
    // admin pages
    adminUserTitle: string;
    adminUserSubtitle: string;
    adminLogTitle: string;
    adminLogSubtitle: string;
    adminTicketTitle: string;
    adminTicketSubtitle: string;
}

/** ข้อความสำหรับ banner ชื่อหน้าของแต่ละภาษา */
export const pageTitleMessages: Record<Locale, PageTitleMessages> = {
    th: {
        scmTitle: `ระบบจัดการห่วงโซ่อุปทาน`,
        scmSubtitle: `ระบบจัดการห่วงโซ่อุปทานส่วนกลาง ออกแบบตามมาตรฐาน Mitsubishi Electric`,
        homeGreetingFallbackTitle: 'สวัสดี {name}',
        homeGreetingMorningTitle: 'อรุณสวัสดิ์ {name}',
        homeGreetingAfternoonTitle: 'สวัสดีตอนบ่าย {name}',
        homeGreetingEveningTitle: 'สวัสดีตอนเย็น {name}',
        aboutTitle: `เกี่ยวกับเรา`,
        profileTitle: `โปรไฟล์ผู้ใช้`,
        settingsTitle: `ตั้งค่า`,
        adminUserTitle: `จัดการผู้ใช้`,
        adminUserSubtitle: `หน้าสำหรับจัดการผู้ใช้ในระบบ`,
        adminLogTitle: `บันทึกการเข้าใช้ระบบ`,
        adminLogSubtitle: `หน้าสำหรับจัดการบันทึกในระบบ`,
        adminTicketTitle: `จัดการคำขอความช่วยเหลือ`,
        adminTicketSubtitle: ``,
    },
    en: {
        scmTitle: 'Supply Chain Management',
        scmSubtitle:
            'Centralized supply chain management platform designed to align with Mitsubishi Electric standards.',
        homeGreetingFallbackTitle: 'Hello {name}',
        homeGreetingMorningTitle: 'Good morning, {name}',
        homeGreetingAfternoonTitle: 'Good afternoon, {name}',
        homeGreetingEveningTitle: 'Good evening, {name}',
        aboutTitle: 'About Us',
        profileTitle: 'User Profile',
        settingsTitle: 'Settings',
        adminUserTitle: `Manage Users`,
        adminUserSubtitle: `Page for managing users in the system`,
        adminLogTitle: `Manage Logs`,
        adminLogSubtitle: `Page for managing logs in the system`,
        adminTicketTitle: `Supplier Ticket Management`,
        adminTicketSubtitle: ``,
    },
};
