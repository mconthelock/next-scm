import type { Locale } from '@/lib/i18n/config';

/** ข้อความที่ใช้ใน pagination และสถานะของตาราง */
export interface TableMessages {
    noResults: string;
    previous: string;
    next: string;
    pageStatus: string;
    morePages: string;
}

/** ข้อความของตารางสำหรับแต่ละภาษา */
export const tableMessages: Record<Locale, TableMessages> = {
    th: {
        noResults: 'ไม่พบข้อมูล',
        previous: 'ก่อนหน้า',
        next: 'ถัดไป',
        pageStatus: 'หน้า {current} จาก {total}',
        morePages: 'มีหน้าเพิ่มเติม',
    },
    en: {
        noResults: 'No results.',
        previous: 'Previous',
        next: 'Next',
        pageStatus: 'Page {current} of {total}',
        morePages: 'More pages',
    },
};
