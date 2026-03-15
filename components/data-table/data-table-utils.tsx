'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
    type Column,
    type ColumnDef,
    type Header,
    flexRender,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

/** meta เพิ่มเติมของคอลัมน์ที่ DataTable ใช้จัดการ UX บน mobile และ i18n */
export type DataTableColumnMeta = {
    /** key สำหรับ map label ด้วย messages.table.columnLabels */
    i18nLabelKey?: string;
    /** ซ่อนฟิลด์นี้จาก desktop table */
    desktopHidden?: boolean;
    /** ซ่อนฟิลด์นี้จาก mobile card view */
    mobileHidden?: boolean;
};

export function isDesktopVisibleColumn<TData>(column: Column<TData, unknown>) {
    return !getColumnMeta(column).desktopHidden;
}

export function isMobileSummaryColumn<TData>(column: Column<TData, unknown>) {
    const meta = getColumnMeta(column);
    return !meta.desktopHidden && !meta.mobileHidden;
}

export function isMobileDetailColumn<TData>(column: Column<TData, unknown>) {
    return getColumnMeta(column).mobileHidden;
}

export function buildPaginationItems(currentPage: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index);
    }

    if (currentPage <= 2) {
        return [0, 1, 2, 'ellipsis-right', totalPages - 1] as const;
    }

    if (currentPage >= totalPages - 3) {
        return [
            0,
            'ellipsis-left',
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
        ] as const;
    }

    return [
        0,
        'ellipsis-left',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis-right',
        totalPages - 1,
    ] as const;
}

export function formatPageStatus(
    template: string,
    current: number,
    total: number,
) {
    return template
        .replace('{current}', String(current))
        .replace('{total}', String(total));
}

export function getColumnMeta<TData>(
    column: Column<TData, unknown>,
): DataTableColumnMeta {
    return (column.columnDef.meta as DataTableColumnMeta | undefined) ?? {};
}

export function getLocalizedLabel(
    labels: Record<string, string>,
    key: string,
    fallback: string,
) {
    return labels[key] ?? fallback;
}

export function renderTableHeader<TData>(
    header: Header<TData, unknown>,
    labels: Record<string, string>,
) {
    const headerContent = header.column.columnDef.header;
    const meta = getColumnMeta(header.column);
    const translatedLabel =
        typeof headerContent === 'string'
            ? getLocalizedLabel(
                  labels,
                  meta.i18nLabelKey ?? headerContent,
                  headerContent,
              )
            : null;

    if (typeof headerContent === 'string' && header.column.getCanSort()) {
        return (
            <Button
                variant="ghost"
                className="-ml-3 h-8"
                onClick={() =>
                    header.column.toggleSorting(
                        header.column.getIsSorted() === 'asc',
                    )
                }
            >
                {translatedLabel}
                {header.column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : header.column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
        );
    }

    return flexRender(headerContent, header.getContext());
}

export function humanizeColumnId(id: string) {
    return id
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getColumnLabel<TData>(
    column: Column<TData, unknown>,
    labels: Record<string, string>,
) {
    const headerContent = column.columnDef.header;
    const meta = getColumnMeta(column);

    if (typeof headerContent === 'string') {
        return getLocalizedLabel(
            labels,
            meta.i18nLabelKey ?? headerContent,
            headerContent,
        );
    }

    if (meta.i18nLabelKey) {
        return getLocalizedLabel(
            labels,
            meta.i18nLabelKey,
            humanizeColumnId(column.id),
        );
    }

    return humanizeColumnId(column.id);
}

export function getColumnDefinitionId<TData, TValue>(
    column: ColumnDef<TData, TValue>,
): string | undefined {
    if ('id' in column && typeof column.id === 'string') {
        return column.id;
    }

    if ('accessorKey' in column && typeof column.accessorKey === 'string') {
        return column.accessorKey;
    }

    return undefined;
}
