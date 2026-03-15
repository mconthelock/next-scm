import type { Locale } from '@/lib/i18n/config';

export const ticketsTable: Record<Locale, Record<string, string>> = {
    th: {
        'tickets.title': 'ชื่อเข้าใช้',
        'tickets.description': 'ประเภท',
        'tickets.status': 'IP Address',
        'tickets.priority': 'วัน-เวลา',
    },
    en: {
        'tickets.title': 'Login',
        'tickets.description': 'Type',
        'tickets.status': 'IP Address',
        'tickets.priority': 'Timestamp',
    },
};
