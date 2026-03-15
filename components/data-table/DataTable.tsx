'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import {
    type ColumnFiltersState,
    type ColumnDef,
    flexRender,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    ALL_FILTER_OPTION_VALUE,
    DataTableFilterBar,
} from '@/components/data-table/DataTableFilterBar';
import { DataTableMobileRow } from '@/components/data-table/DataTableMobileRow';
import { DataTableMobileSort } from '@/components/data-table/DataTableMobileSort';
import { DataTablePaginationFooter } from '@/components/data-table/DataTablePaginationFooter';
import {
    type DataTableFilterSelectItem,
    type DataTableFilterButtonItem,
    type DataTableFilterDateItem,
    type DataTableFilterDateRangeItem,
    type DataTableProps,
} from '@/components/data-table/data-table-types';
import {
    buildPaginationItems,
    formatPageStatus,
    getColumnDefinitionId,
    getColumnLabel,
    isDesktopVisibleColumn,
    isMobileDetailColumn,
    isMobileSummaryColumn,
    renderTableHeader,
} from '@/components/data-table/data-table-utils';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumnId,
    filterColumnIds,
    filterPlaceholder,
    pageSize = 10,
    selectFilters = [],
    buttonFilters = [],
    dateFilters = [],
    dateRangeFilters = [],
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [expandedMobileRows, setExpandedMobileRows] = React.useState<
        Record<string, boolean>
    >({});
    const [paginationState, setPaginationState] = React.useState({
        pageIndex: 0,
        pageSize,
    });
    const { messages } = useLocale();
    const searchableColumnIds = React.useMemo(() => {
        if (filterColumnIds?.length) {
            return filterColumnIds;
        }

        return filterColumnId ? [filterColumnId] : [];
    }, [filterColumnId, filterColumnIds]);
    const columnLabels = messages.table.columnLabels;
    const exactMatchFilterColumnIds = React.useMemo(
        () =>
            new Set([
                ...selectFilters.map((filter) => filter.columnId),
                ...buttonFilters.map((filter) => filter.columnId),
            ]),
        [buttonFilters, selectFilters],
    );
    const selectFilterColumnIds = React.useMemo(
        () => new Set(selectFilters.map((filter) => filter.columnId)),
        [selectFilters],
    );
    const dateFilterColumnIds = React.useMemo(
        () => new Set(dateFilters.map((filter) => filter.columnId)),
        [dateFilters],
    );
    const dateRangeFilterColumnIds = React.useMemo(
        () => new Set(dateRangeFilters.map((filter) => filter.columnId)),
        [dateRangeFilters],
    );

    function toDateFilterKey(value: unknown) {
        const parsedDate =
            value instanceof Date
                ? value
                : typeof value === 'string' || typeof value === 'number'
                  ? new Date(value)
                  : null;

        if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function fromDateFilterKey(value: string) {
        const [year, month, day] = value.split('-').map(Number);

        if (!year || !month || !day) {
            return undefined;
        }

        const parsedDate = new Date(year, month - 1, day);

        return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }

    function isDateWithinRange(
        value: unknown,
        filterValue: { from?: string; to?: string },
    ) {
        const rowDateKey = toDateFilterKey(value);

        if (!rowDateKey) {
            return false;
        }

        if (filterValue.from && rowDateKey < filterValue.from) {
            return false;
        }

        if (filterValue.to && rowDateKey > filterValue.to) {
            return false;
        }

        return true;
    }

    const enhancedColumns = React.useMemo(
        () =>
            columns.map((column) => {
                const columnId = getColumnDefinitionId(column);

                if (!columnId) {
                    return column;
                }

                if (dateRangeFilterColumnIds.has(columnId)) {
                    if ('filterFn' in column && column.filterFn) {
                        return column;
                    }

                    return {
                        ...column,
                        filterFn: (row, id, filterValue) => {
                            if (
                                !filterValue ||
                                typeof filterValue !== 'object' ||
                                (!('from' in filterValue) &&
                                    !('to' in filterValue))
                            ) {
                                return true;
                            }

                            return isDateWithinRange(
                                row.getValue(id),
                                filterValue as { from?: string; to?: string },
                            );
                        },
                    } satisfies ColumnDef<TData, TValue>;
                }

                if (dateFilterColumnIds.has(columnId)) {
                    if ('filterFn' in column && column.filterFn) {
                        return column;
                    }

                    return {
                        ...column,
                        filterFn: (row, id, filterValue) => {
                            if (
                                typeof filterValue !== 'string' ||
                                filterValue.length === 0
                            ) {
                                return true;
                            }

                            return (
                                toDateFilterKey(row.getValue(id)) ===
                                filterValue
                            );
                        },
                    } satisfies ColumnDef<TData, TValue>;
                }

                if (!exactMatchFilterColumnIds.has(columnId)) {
                    return column;
                }

                if ('filterFn' in column && column.filterFn) {
                    return column;
                }

                return {
                    ...column,
                    filterFn: 'equalsString',
                } satisfies ColumnDef<TData, TValue>;
            }),
        [
            columns,
            dateFilterColumnIds,
            dateRangeFilterColumnIds,
            exactMatchFilterColumnIds,
        ],
    );

    const table = useReactTable({
        data,
        columns: enhancedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPaginationState,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',
        getColumnCanGlobalFilter: (column) =>
            searchableColumnIds.includes(column.id),
        state: {
            columnFilters,
            pagination: paginationState,
            sorting,
            globalFilter,
        },
    });

    React.useEffect(() => {
        setPaginationState((currentPagination) => {
            if (currentPagination.pageSize === pageSize) {
                return currentPagination;
            }

            return {
                pageIndex: 0,
                pageSize,
            };
        });
    }, [pageSize]);

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
    const desktopLeafColumnCount = table
        .getAllLeafColumns()
        .filter(isDesktopVisibleColumn).length;
    const availableColumnIds = React.useMemo(
        () => new Set(table.getAllLeafColumns().map((column) => column.id)),
        [table],
    );
    const mobileRowCellGroups = React.useMemo(
        () =>
            table.getRowModel().rows.map((row) => ({
                row,
                summaryCells: row
                    .getVisibleCells()
                    .filter((cell) => isMobileSummaryColumn(cell.column)),
                detailCells: row
                    .getVisibleCells()
                    .filter((cell) => isMobileDetailColumn(cell.column)),
            })),
        [table],
    );

    function getSelectedFilterValue(columnId: string) {
        const activeFilter = columnFilters.find(
            (filter) => filter.id === columnId,
        );

        return typeof activeFilter?.value === 'string'
            ? activeFilter.value
            : ALL_FILTER_OPTION_VALUE;
    }

    function setSelectedFilterValue(columnId: string, nextValue: string) {
        setColumnFilters((currentFilters) => {
            const nextFilters = currentFilters.filter(
                (filter) => filter.id !== columnId,
            );

            if (nextValue === ALL_FILTER_OPTION_VALUE) {
                return nextFilters;
            }

            return [...nextFilters, { id: columnId, value: nextValue }];
        });
    }

    function getSelectedDateFilterValue(columnId: string) {
        const activeFilter = columnFilters.find(
            (filter) => filter.id === columnId,
        );

        return typeof activeFilter?.value === 'string'
            ? fromDateFilterKey(activeFilter.value)
            : undefined;
    }

    function setSelectedDateFilterValue(columnId: string, nextDate?: Date) {
        setColumnFilters((currentFilters) => {
            const nextFilters = currentFilters.filter(
                (filter) => filter.id !== columnId,
            );
            const nextValue = nextDate ? toDateFilterKey(nextDate) : null;

            if (!nextValue) {
                return nextFilters;
            }

            return [...nextFilters, { id: columnId, value: nextValue }];
        });
    }

    function getSelectedDateRangeFilterValue(
        columnId: string,
    ): DateRange | undefined {
        const activeFilter = columnFilters.find(
            (filter) => filter.id === columnId,
        );

        if (!activeFilter || typeof activeFilter.value !== 'object') {
            return undefined;
        }

        const filterValue = activeFilter.value as {
            from?: string;
            to?: string;
        };

        const fromDate = filterValue.from
            ? fromDateFilterKey(filterValue.from)
            : undefined;
        const toDate = filterValue.to
            ? fromDateFilterKey(filterValue.to)
            : undefined;

        if (!fromDate && !toDate) {
            return undefined;
        }

        return {
            from: fromDate ?? toDate,
            ...(toDate ? { to: toDate } : {}),
        };
    }

    function setSelectedDateRangeFilterValue(
        columnId: string,
        nextRange?: DateRange,
    ) {
        setColumnFilters((currentFilters) => {
            const nextFilters = currentFilters.filter(
                (filter) => filter.id !== columnId,
            );
            const fromValue = nextRange?.from
                ? toDateFilterKey(nextRange.from)
                : null;
            const toValue = nextRange?.to
                ? toDateFilterKey(nextRange.to)
                : null;

            if (!fromValue && !toValue) {
                return nextFilters;
            }

            return [
                ...nextFilters,
                {
                    id: columnId,
                    value: {
                        ...(fromValue ? { from: fromValue } : {}),
                        ...(toValue ? { to: toValue } : {}),
                    },
                },
            ];
        });
    }

    const filterBarSelectItems = React.useMemo<DataTableFilterSelectItem[]>(
        () =>
            selectFilters
                .map((filter) => {
                    if (!availableColumnIds.has(filter.columnId)) {
                        return null;
                    }

                    return {
                        columnId: filter.columnId,
                        placeholder: filter.placeholder,
                        options: filter.options,
                        selectedValue: getSelectedFilterValue(filter.columnId),
                        onValueChange: (nextValue: string) => {
                            setSelectedFilterValue(filter.columnId, nextValue);
                        },
                    } satisfies DataTableFilterSelectItem;
                })
                .filter(
                    (filter): filter is DataTableFilterSelectItem =>
                        filter !== null,
                ),
        [availableColumnIds, columnFilters, selectFilters],
    );
    const filterBarButtonItems = React.useMemo<DataTableFilterButtonItem[]>(
        () =>
            buttonFilters
                .map((filter) => {
                    if (!availableColumnIds.has(filter.columnId)) {
                        return null;
                    }

                    return {
                        columnId: filter.columnId,
                        allLabel: filter.allLabel,
                        options: filter.options,
                        selectedValue: getSelectedFilterValue(filter.columnId),
                        onValueChange: (nextValue: string) => {
                            setSelectedFilterValue(filter.columnId, nextValue);
                        },
                    } satisfies DataTableFilterButtonItem;
                })
                .filter(
                    (filter): filter is DataTableFilterButtonItem =>
                        filter !== null,
                ),
        [availableColumnIds, buttonFilters, columnFilters],
    );
    const filterBarDateItems = React.useMemo<DataTableFilterDateItem[]>(
        () =>
            dateFilters
                .map((filter) => {
                    if (!availableColumnIds.has(filter.columnId)) {
                        return null;
                    }

                    return {
                        columnId: filter.columnId,
                        placeholder: filter.placeholder,
                        clearLabel: filter.clearLabel,
                        selectedDate: getSelectedDateFilterValue(
                            filter.columnId,
                        ),
                        onDateChange: (nextDate?: Date) => {
                            setSelectedDateFilterValue(
                                filter.columnId,
                                nextDate,
                            );
                        },
                    } satisfies DataTableFilterDateItem;
                })
                .filter(
                    (filter): filter is DataTableFilterDateItem =>
                        filter !== null,
                ),
        [availableColumnIds, columnFilters, dateFilters],
    );
    const filterBarDateRangeItems = React.useMemo<
        DataTableFilterDateRangeItem[]
    >(
        () =>
            dateRangeFilters
                .map((filter) => {
                    if (!availableColumnIds.has(filter.columnId)) {
                        return null;
                    }

                    const selectedRange = getSelectedDateRangeFilterValue(
                        filter.columnId,
                    );

                    return {
                        columnId: filter.columnId,
                        fromPlaceholder: filter.fromPlaceholder,
                        toPlaceholder: filter.toPlaceholder,
                        clearLabel: filter.clearLabel,
                        selectedRange: selectedRange,
                        onRangeChange: (nextRange?: DateRange) => {
                            setSelectedDateRangeFilterValue(
                                filter.columnId,
                                nextRange,
                            );
                        },
                    } satisfies DataTableFilterDateRangeItem;
                })
                .filter(
                    (filter): filter is DataTableFilterDateRangeItem =>
                        filter !== null,
                ),
        [availableColumnIds, columnFilters, dateRangeFilters],
    );

    function toggleMobileRow(rowId: string) {
        setExpandedMobileRows((currentRows) => ({
            ...currentRows,
            [rowId]: !currentRows[rowId],
        }));
    }

    return (
        <>
            <DataTableFilterBar
                showFilter={showFilter}
                filterPlaceholder={
                    filterPlaceholder ?? messages.table.filterPlaceholder
                }
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                selectFilters={filterBarSelectItems}
                buttonFilters={filterBarButtonItems}
                dateFilters={filterBarDateItems}
                dateRangeFilters={filterBarDateRangeItems}
            />

            <DataTableMobileSort
                sortableColumns={sortableColumns}
                mobileSortColumnId={mobileSortColumnId}
                activeSort={activeSort}
                sortColumnLabel={messages.table.sortColumnLabel}
                sortDirectionAsc={messages.table.sortDirectionAsc}
                sortDirectionDesc={messages.table.sortDirectionDesc}
                getColumnLabel={(column) =>
                    getColumnLabel(column, columnLabels)
                }
                onColumnChange={(nextColumnId) => {
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
                onDirectionToggle={() => {
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
            />

            <div className="overflow-hidden rounded-md border md:block hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers
                                    .filter((header) =>
                                        isDesktopVisibleColumn(header.column),
                                    )
                                    .map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="px-3"
                                        >
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
                                    {row
                                        .getVisibleCells()
                                        .filter((cell) =>
                                            isDesktopVisibleColumn(cell.column),
                                        )
                                        .map((cell) => (
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
                                    colSpan={desktopLeafColumnCount}
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
                {mobileRowCellGroups.length ? (
                    mobileRowCellGroups.map(
                        ({ row, summaryCells, detailCells }) => (
                            <DataTableMobileRow
                                key={row.id}
                                rowId={row.id}
                                summaryCells={summaryCells}
                                detailCells={detailCells}
                                columnLabels={columnLabels}
                                isExpanded={expandedMobileRows[row.id] ?? false}
                                showMoreLabel={messages.table.showMore}
                                showLessLabel={messages.table.showLess}
                                onToggle={toggleMobileRow}
                            />
                        ),
                    )
                ) : (
                    <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                        {messages.table.noResults}
                    </div>
                )}
            </div>

            <DataTablePaginationFooter
                pageStatusLabel={formatPageStatus(
                    messages.table.pageStatus,
                    currentPageLabel,
                    totalPages,
                )}
                previousLabel={messages.table.previous}
                nextLabel={messages.table.next}
                morePagesLabel={messages.table.morePages}
                currentPage={currentPage}
                pageItems={pageItems}
                canPreviousPage={table.getCanPreviousPage()}
                canNextPage={table.getCanNextPage()}
                onPreviousPage={() => {
                    table.previousPage();
                }}
                onNextPage={() => {
                    table.nextPage();
                }}
                onPageChange={(pageIndex) => {
                    table.setPageIndex(pageIndex);
                }}
            />
        </>
    );
}
