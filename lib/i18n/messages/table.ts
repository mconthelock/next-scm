import type { Locale } from '@/lib/i18n/config';
import type { TableMessages } from '@/lib/i18n/types';

/** ข้อความของตารางสำหรับแต่ละภาษา */
export const tableMessages: Record<Locale, TableMessages> = {
    th: {
        noResults: 'ไม่พบข้อมูล',
        previous: 'ก่อนหน้า',
        next: 'ถัดไป',
        pageStatus: 'หน้า {current} จาก {total}',
        morePages: 'มีหน้าเพิ่มเติม',
        filterPlaceholder: 'ค้นหาข้อมูล...',
        sortColumnLabel: 'เรียงตาม',
        sortDirectionAsc: 'น้อยไปมาก',
        sortDirectionDesc: 'มากไปน้อย',
        columnLabels: {
            'users.login': 'ชื่อเข้าใช้',
            'users.name': 'ชื่อ',
            'users.status': 'สถานะ',
            'users.email': 'อีเมล',
            'users.groups': 'กลุ่มผู้ใช้',
            Login: 'ชื่อเข้าใช้',
            Name: 'ชื่อ',
            Status: 'สถานะ',
            Email: 'อีเมล',
            Groups: 'กลุ่มผู้ใช้',
        },
    },
    en: {
        noResults: 'No results.',
        previous: 'Previous',
        next: 'Next',
        pageStatus: 'Page {current} of {total}',
        morePages: 'More pages',
        filterPlaceholder: 'Search records...',
        sortColumnLabel: 'Sort by',
        sortDirectionAsc: 'Ascending',
        sortDirectionDesc: 'Descending',
        columnLabels: {
            'users.login': 'Login',
            'users.name': 'Name',
            'users.status': 'Status',
            'users.email': 'Email',
            'users.groups': 'Groups',
            Login: 'Login',
            Name: 'Name',
            Status: 'Status',
            Email: 'Email',
            Groups: 'Groups',
        },
    },
};
