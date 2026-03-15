'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
    type ColumnDef,
    type Header,
    flexRender,
    ColumnFiltersState,
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
    /** placeholder สำหรับช่องค้นหา */
    filterPlaceholder?: string;
}

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

function renderTableHeader<TData>(header: Header<TData, unknown>) {
    const headerContent = header.column.columnDef.header;

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
                {headerContent}
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

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumnId,
    filterPlaceholder = 'Filter...',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const { messages } = useLocale();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });
    const filterColumn = filterColumnId
        ? table.getColumn(filterColumnId)
        : undefined;

    const pagination = table.getState().pagination;
    const currentPage = pagination.pageIndex;
    const totalPages = table.getPageCount();
    const pageItems = buildPaginationItems(currentPage, totalPages);
    const currentPageLabel = totalPages === 0 ? 0 : currentPage + 1;

    return (
        <>
            {filterColumn ? (
                <div className="flex items-center py-4">
                    <Input
                        placeholder={filterPlaceholder}
                        value={(filterColumn.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            filterColumn.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            ) : null}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-3">
                                        {header.isPlaceholder
                                            ? null
                                            : renderTableHeader(header)}
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
