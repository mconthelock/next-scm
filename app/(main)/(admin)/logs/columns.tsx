'use client';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export type Logs = {
    LOG_ID: number;
    LOG_TYPE: string;
    LOG_IP?: string;
    LOG_TIMESTAMP?: string | Date;
    USR_LOGIN: string;
};

export const columns: ColumnDef<Logs>[] = [
    {
        accessorKey: 'USR_LOGIN',
        header: 'logs.login',
        meta: { i18nLabelKey: 'logs.login' },
    },
    {
        accessorKey: 'LOG_TYPE',
        header: 'logs.type',
        meta: { i18nLabelKey: 'logs.type' },
    },
    {
        accessorKey: 'LOG_IP',
        header: 'logs.ip',
        meta: { i18nLabelKey: 'logs.ip' },
    },
    {
        accessorKey: 'LOG_TIMESTAMP',
        header: 'logs.times',
        meta: { i18nLabelKey: 'logs.times' },
        cell: ({ row }) => {
            return dayjs(row.original.LOG_TIMESTAMP).format(
                'DD/MM/YYYY HH:mm:ss',
            );
        },
    },
];
