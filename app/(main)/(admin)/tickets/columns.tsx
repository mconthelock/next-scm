'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MessageCircle } from 'lucide-react';
import dayjs from 'dayjs';

export type Tickets = {
    TICKET_ID: string;
    TICKET_TITLE: string;
    TICKET_DESCRIPTION: string;
    TICKET_STATUS: string;
    TICKET_PRIORITY: string;
    TICKET_CREATED_AT: Date;
    TICKET_UPDATED_AT: Date;
};

export const columns: ColumnDef<Tickets>[] = [
    {
        accessorKey: 'TICKET_TITLE',
        header: 'tickets.title',
        meta: { i18nLabelKey: 'tickets.title' },
        cell: ({ row }) => {
            const title = row.original.TICKET_TITLE;
            const detail = row.original.TICKET_DESCRIPTION;
            return (
                <>
                    <div className="font-bold">{title}</div>
                    <div className="text-sm text-wrap line-clamp-2">
                        {detail}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: 'TICKET_STATUS',
        header: 'tickets.status',
        meta: { i18nLabelKey: 'tickets.status' },
    },
    {
        accessorKey: 'TICKET_PRIORITY',
        header: 'tickets.priority',
        meta: { i18nLabelKey: 'tickets.priority' },
    },
    {
        accessorKey: 'TICKET_CREATED_AT',
        header: 'tickets.createdAt',
        meta: { i18nLabelKey: 'tickets.createdAt' },
        cell: ({ row }) => {
            return dayjs(row.original.TICKET_CREATED_AT).format(
                'DD/MM/YYYY HH:mm:ss',
            );
        },
    },
    {
        accessorKey: 'TICKET_ID',
        cell: ({ row }) => {
            return (
                <>
                    <div className="flex items-center justify-center">
                        <a
                            href={`/tickets/${row.original.TICKET_ID}`}
                            className="text-blue-500 hover:underline"
                        >
                            <MessageCircle />
                        </a>
                    </div>
                </>
            );
        },
        header: 'tickets.id',
    },
];
