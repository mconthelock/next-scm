'use client';

import { ColumnDef } from '@tanstack/react-table';

/** ข้อมูลที่ใช้แสดง badge ของแต่ละสถานะผู้ใช้ */
type UserStatusBadge = {
    label: string;
    className: string;
};

/** รหัสสถานะผู้ใช้ที่หน้า table รองรับการแสดงผล */
type UserStatusCode = 0 | 1 | 2 | 3;

export type Users = {
    USR_ID: number;
    USR_LOGIN: string;
    USR_NAME: string;
    USR_EMAIL: string;
    USR_POSITION: string;
    USER_STATUS: number;
    USR_RESETDATE?: Date;
    GROUPS?: {
        GRP_ID: number;
        GRP_CODE: string;
        GRP_NAME: string;
    }[];
};

const USER_STATUS_BADGES: Record<UserStatusCode, UserStatusBadge> = {
    0: {
        label: 'Inactive',
        className: 'bg-slate-100 text-slate-700',
    },
    1: {
        label: 'Active',
        className: 'bg-emerald-100 text-emerald-800',
    },
    2: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
    },
    3: {
        label: 'Locked',
        className: 'bg-red-100 text-red-800',
    },
};

const DEFAULT_USER_STATUS_BADGE: UserStatusBadge = {
    label: 'Unknown',
    className: 'bg-zinc-100 text-zinc-700',
};

function getUserStatusBadge(status: number): UserStatusBadge {
    return (
        USER_STATUS_BADGES[status as UserStatusCode] ??
        DEFAULT_USER_STATUS_BADGE
    );
}

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
        accessorKey: 'USER_STATUS',
        header: 'users.status',
        meta: { i18nLabelKey: 'users.status' },
        cell: ({ row }) => {
            const badge = getUserStatusBadge(row.original.USER_STATUS);

            return (
                <span
                    className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${badge.className}`}
                >
                    {badge.label}
                </span>
            );
        },
    },
    {
        accessorKey: 'USR_EMAIL',
        header: 'users.email',
        meta: { i18nLabelKey: 'users.email' },
    },
    {
        id: 'GROUPS',
        accessorFn: (row) =>
            row.GROUPS?.map((group) => group.GRP_NAME).join(', ') ?? '',
        header: 'users.groups',
        meta: {
            i18nLabelKey: 'users.groups',
            mobileHidden: true,
        },
        cell: ({ row }) => (
            <div>
                {row.original.GROUPS?.map((group) => (
                    <div key={group.GRP_ID}>{group.GRP_NAME}</div>
                ))}
            </div>
        ),
    },
];
