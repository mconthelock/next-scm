'use client';

import * as React from 'react';
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
    const selectFilterColumnIds = React.useMemo(
        () => new Set(selectFilters.map((filter) => filter.columnId)),
        [selectFilters],
    );

    const enhancedColumns = React.useMemo(
        () =>
            columns.map((column) => {
                const columnId = getColumnDefinitionId(column);

                if (!columnId || !selectFilterColumnIds.has(columnId)) {
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
        [columns, selectFilterColumnIds],
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
    const filterBarSelectItems = React.useMemo<DataTableFilterSelectItem[]>(
        () =>
            selectFilters
                .map((filter) => {
                    const column = table.getColumn(filter.columnId);

                    if (!column) {
                        return null;
                    }

                    return {
                        columnId: filter.columnId,
                        placeholder: filter.placeholder,
                        options: filter.options,
                        selectedValue:
                            (column.getFilterValue() as string | undefined) ??
                            ALL_FILTER_OPTION_VALUE,
                        onValueChange: (nextValue: string) => {
                            column.setFilterValue(
                                nextValue === ALL_FILTER_OPTION_VALUE
                                    ? undefined
                                    : nextValue,
                            );
                        },
                    } satisfies DataTableFilterSelectItem;
                })
                .filter(
                    (filter): filter is DataTableFilterSelectItem =>
                        filter !== null,
                ),
        [selectFilters, table],
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
