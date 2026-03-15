import type { Locale } from '@/lib/i18n/config';

/** label คอลัมน์ของตาราง users */
export const userTable: Record<Locale, Record<string, string>> = {
    th: {
        'users.login': 'ชื่อเข้าใช้',
        'users.name': 'ชื่อ',
        'users.status': 'สถานะ',
        'users.email': 'อีเมล',
        'users.groups': 'กลุ่มผู้ใช้',
        'users.vendor': 'ผู้ขาย',
        Login: 'ชื่อเข้าใช้',
        Name: 'ชื่อ',
        Status: 'สถานะ',
        Email: 'อีเมล',
        Groups: 'กลุ่มผู้ใช้',
        Vendors: 'ผู้ขาย',
    },
    en: {
        'users.login': 'Login',
        'users.name': 'Name',
        'users.status': 'Status',
        'users.email': 'Email',
        'users.groups': 'Groups',
        'users.vendor': 'Vendor',
        Login: 'Login',
        Name: 'Name',
        Status: 'Status',
        Email: 'Email',
        Groups: 'Groups',
        Vendors: 'Vendor',
    },
};
