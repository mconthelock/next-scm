'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
    type Column,
    type ColumnDef,
    type Header,
    flexRender,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

/** props ของตารางกลางที่ใช้ซ้ำได้หลายหน้า */
export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    /** id ของคอลัมน์ที่อนุญาตให้ search/filter จาก input ด้านบน */
    filterColumnId?: string;
    /** รายชื่อคอลัมน์ที่อนุญาตให้ search/filter พร้อมกันหลายคอลัมน์ */
    filterColumnIds?: string[];
    /** placeholder สำหรับช่องค้นหา */
    filterPlaceholder?: string;
}

/** meta เพิ่มเติมของคอลัมน์ที่ DataTable ใช้จัดการ UX บน mobile และ i18n */
type DataTableColumnMeta = {
    /** key สำหรับ map label ด้วย messages.table.columnLabels */
    i18nLabelKey?: string;
    /** ซ่อนฟิลด์นี้จาก mobile card view */
    mobileHidden?: boolean;
};

function buildPaginationItems(currentPage: number, totalPages: number) {
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

function formatPageStatus(template: string, current: number, total: number) {
    return template
        .replace('{current}', String(current))
        .replace('{total}', String(total));
}

function getColumnMeta<TData>(
    column: Column<TData, unknown>,
): DataTableColumnMeta {
    return (column.columnDef.meta as DataTableColumnMeta | undefined) ?? {};
}

function getLocalizedLabel(
    labels: Record<string, string>,
    key: string,
    fallback: string,
) {
    return labels[key] ?? fallback;
}

function renderTableHeader<TData>(
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

function humanizeColumnId(id: string) {
    return id
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getColumnLabel<TData>(
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

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumnId,
    filterColumnIds,
    filterPlaceholder,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const { messages } = useLocale();
    const searchableColumnIds = React.useMemo(() => {
        if (filterColumnIds?.length) {
            return filterColumnIds;
        }

        return filterColumnId ? [filterColumnId] : [];
    }, [filterColumnId, filterColumnIds]);
    const columnLabels = messages.table.columnLabels;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',
        getColumnCanGlobalFilter: (column) =>
            searchableColumnIds.includes(column.id),
        state: {
            sorting,
            globalFilter,
        },
    });
    const showFilter = searchableColumnIds.length > 0;
    const sortableColumns = table
        .getAllLeafColumns()
        .filter((column) => column.getCanSort());
    const activeSort = sorting[0];
    const mobileSortColumnId = activeSort?.id ?? sortableColumns[0]?.id ?? '';

    const pagination = table.getState().pagination;
    const currentPage = pagination.pageIndex;
    const totalPages = table.getPageCount();
    const pageItems = buildPaginationItems(currentPage, totalPages);
    const currentPageLabel = totalPages === 0 ? 0 : currentPage + 1;

    return (
        <>
            {showFilter ? (
                <div className="flex items-center py-4">
                    <Input
                        placeholder={
                            filterPlaceholder ??
                            messages.table.filterPlaceholder
                        }
                        value={globalFilter}
                        onChange={(event) =>
                            setGlobalFilter(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            ) : null}
            {sortableColumns.length > 0 ? (
                <div className="mb-3 flex items-center gap-2 md:hidden">
                    <span className="text-xs font-medium text-slate-500">
                        {messages.table.sortColumnLabel}
                    </span>
                    <select
                        value={mobileSortColumnId}
                        onChange={(event) => {
                            const nextColumnId = event.target.value;
                            if (!nextColumnId) {
                                setSorting([]);
                                return;
                            }

                            setSorting([
                                {
                                    id: nextColumnId,
                                    desc: false,
                                },
                            ]);
                        }}
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        aria-label={messages.table.sortColumnLabel}
                    >
                        {sortableColumns.map((column) => (
                            <option key={column.id} value={column.id}>
                                {getColumnLabel(column, columnLabels)}
                            </option>
                        ))}
                    </select>

                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={() => {
                            if (!mobileSortColumnId) {
                                return;
                            }

                            setSorting([
                                {
                                    id: mobileSortColumnId,
                                    desc: !activeSort?.desc,
                                },
                            ]);
                        }}
                        disabled={!mobileSortColumnId}
                        aria-label={
                            activeSort?.desc
                                ? messages.table.sortDirectionDesc
                                : messages.table.sortDirectionAsc
                        }
                    >
                        {activeSort ? (
                            activeSort.desc ? (
                                <ArrowDown className="h-4 w-4" />
                            ) : (
                                <ArrowUp className="h-4 w-4" />
                            )
                        ) : (
                            <ArrowUpDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            ) : null}

            <div className="overflow-hidden rounded-md border md:block hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-3">
                                        {header.isPlaceholder
                                            ? null
                                            : renderTableHeader(
                                                  header,
                                                  columnLabels,
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-3"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {messages.table.noResults}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="space-y-3 md:hidden">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className="rounded-md border border-slate-200 bg-white p-3"
                        >
                            <dl className="space-y-2">
                                {row
                                    .getVisibleCells()
                                    .filter((cell) => {
                                        const meta = getColumnMeta(cell.column);
                                        return !meta.mobileHidden;
                                    })
                                    .map((cell) => (
                                        <div
                                            key={cell.id}
                                            className="flex items-start justify-between gap-3"
                                        >
                                            <dt className="pt-0.5 text-xs font-medium text-slate-500">
                                                {getColumnLabel(
                                                    cell.column,
                                                    columnLabels,
                                                )}
                                            </dt>
                                            <dd className="min-w-0 text-right text-sm text-slate-700">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </dd>
                                        </div>
                                    ))}
                            </dl>
                        </div>
                    ))
                ) : (
                    <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                        {messages.table.noResults}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                    {formatPageStatus(
                        messages.table.pageStatus,
                        currentPageLabel,
                        totalPages,
                    )}
                </p>

                <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    table.previousPage();
                                }}
                                aria-label={messages.table.previous}
                                aria-disabled={!table.getCanPreviousPage()}
                                className={
                                    !table.getCanPreviousPage()
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            >
                                {messages.table.previous}
                            </PaginationPrevious>
                        </PaginationItem>

                        {pageItems.map((item, index) => {
                            if (typeof item === 'string') {
                                return (
                                    <PaginationItem key={`${item}-${index}`}>
                                        <PaginationEllipsis>
                                            {messages.table.morePages}
                                        </PaginationEllipsis>
                                    </PaginationItem>
                                );
                            }

                            const pageNumber = item + 1;

                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === item}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            table.setPageIndex(item);
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    table.nextPage();
                                }}
                                aria-label={messages.table.next}
                                aria-disabled={!table.getCanNextPage()}
                                className={
                                    !table.getCanNextPage()
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            >
                                {messages.table.next}
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}
