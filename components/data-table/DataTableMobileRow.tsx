'use client';

import { type Cell, flexRender } from '@tanstack/react-table';

import { getColumnLabel } from '@/components/data-table/data-table-utils';

interface DataTableMobileRowProps<TData> {
    rowId: string;
    summaryCells: Cell<TData, unknown>[];
    detailCells: Cell<TData, unknown>[];
    columnLabels: Record<string, string>;
    isExpanded: boolean;
    showMoreLabel: string;
    showLessLabel: string;
    onToggle: (rowId: string) => void;
}

export function DataTableMobileRow<TData>({
    rowId,
    summaryCells,
    detailCells,
    columnLabels,
    isExpanded,
    showMoreLabel,
    showLessLabel,
    onToggle,
}: DataTableMobileRowProps<TData>) {
    return (
        <div className="rounded-md border border-slate-200 bg-white p-3">
            <dl className="space-y-2">
                {summaryCells.map((cell) => (
                    <div
                        key={cell.id}
                        className="flex items-start justify-between gap-3"
                    >
                        <dt className="pt-0.5 text-xs font-medium text-slate-500">
                            {getColumnLabel(cell.column, columnLabels)}
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

            {detailCells.length > 0 ? (
                <div className="mt-3 border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={() => onToggle(rowId)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        {isExpanded ? showLessLabel : showMoreLabel}
                    </button>

                    {isExpanded ? (
                        <dl className="mt-3 space-y-2">
                            {detailCells.map((cell) => (
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
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
