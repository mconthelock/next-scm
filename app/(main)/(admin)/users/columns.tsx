'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
    StatusBadge,
    type StatusBadgeTone,
} from '@/components/ui/status-badge';

export type Users = {
    USR_ID: number;
    USR_LOGIN: string;
    USR_NAME: string;
    USR_EMAIL: string;
    USR_POSITION: string;
    USR_RESETDATE?: Date;
    USER_STATUS: {
        STATUS_ID: number;
        STATUS_DESC: string;
        ICON?: string;
        TONE?: string;
    };
    GROUPS?: {
        GRP_ID: number;
        GRP_CODE: string;
        GRP_NAME: string;
    };
    VENDORS?: {
        VND_ID: number;
        VND_NAME: string;
    };
};

export const columns: ColumnDef<Users>[] = [
    {
        accessorKey: 'USR_LOGIN',
        header: 'users.login',
        meta: { i18nLabelKey: 'users.login' },
    },
    {
        accessorKey: 'USR_NAME',
        header: 'users.name',
        meta: { i18nLabelKey: 'users.name' },
    },

    {
        accessorKey: 'USR_EMAIL',
        header: 'users.email',
        meta: { i18nLabelKey: 'users.email' },
    },
    {
        id: 'GROUPS',
        accessorFn: (row) => row.GROUPS?.GRP_NAME ?? '',
        header: 'users.groups',
        meta: {
            i18nLabelKey: 'users.groups',
            mobileHidden: true,
        },
        cell: ({ row }) => (
            <div>
                <div key={row.original.GROUPS?.GRP_ID}>
                    {row.original.GROUPS?.GRP_NAME}
                </div>
            </div>
        ),
    },
    {
        id: 'VENDORS',
        accessorFn: (row) => row.VENDORS?.VND_NAME ?? '',
        header: 'users.vendor',
        meta: { i18nLabelKey: 'users.vendor', mobileHidden: true },
    },
    {
        accessorKey: 'USER_STATUS',
        accessorFn: (row) => row.USER_STATUS.STATUS_DESC ?? '',
        header: 'users.status',
        meta: { i18nLabelKey: 'users.status' },
        cell: ({ row }) => {
            return (
                <StatusBadge
                    label={row.original.USER_STATUS.STATUS_DESC}
                    tone={row.original.USER_STATUS.TONE as StatusBadgeTone}
                    showIcon={true}
                />
            );
        },
    },
];
