import type { Locale } from '@/lib/i18n/config';
import type { TableMessages } from '@/lib/i18n/types';

import { tableCommon } from '@/lib/i18n/messages/table-common';
import { logsTable } from '@/lib/i18n/messages/table-logs';
import { userTable } from '@/lib/i18n/messages/table-users';
import { ticketsTable } from '@/lib/i18n/messages/table-tickets';

/** ข้อความของตารางสำหรับแต่ละภาษา */
export const tableMessages: Record<Locale, TableMessages> = {
    th: {
        ...tableCommon.th,
        columnLabels: {
            ...logsTable.th,
            ...userTable.th,
            ...ticketsTable.th,
        },
    },
    en: {
        ...tableCommon.en,
        columnLabels: {
            ...logsTable.en,
            ...userTable.en,
            ...ticketsTable.en,
        },
    },
};
