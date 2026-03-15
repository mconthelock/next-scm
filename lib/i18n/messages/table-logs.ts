import type { Locale } from '@/lib/i18n/config';

/** label คอลัมน์ของตาราง logs */
export const logsTable: Record<Locale, Record<string, string>> = {
    th: {
        'logs.login': 'ชื่อเข้าใช้',
        'logs.type': 'ประเภท',
        'logs.ip': 'IP Address',
        'logs.times': 'วัน-เวลา',
    },
    en: {
        'logs.login': 'Login',
        'logs.type': 'Type',
        'logs.ip': 'IP Address',
        'logs.times': 'Timestamp',
    },
};
