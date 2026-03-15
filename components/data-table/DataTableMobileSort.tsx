'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { type Column, type SortingState } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTableMobileSortProps<TData> {
    sortableColumns: Column<TData, unknown>[];
    mobileSortColumnId: string;
    activeSort: SortingState[number] | undefined;
    sortColumnLabel: string;
    sortDirectionAsc: string;
    sortDirectionDesc: string;
    getColumnLabel: (column: Column<TData, unknown>) => string;
    onColumnChange: (nextColumnId: string) => void;
    onDirectionToggle: () => void;
}

export function DataTableMobileSort<TData>({
    sortableColumns,
    mobileSortColumnId,
    activeSort,
    sortColumnLabel,
    sortDirectionAsc,
    sortDirectionDesc,
    getColumnLabel,
    onColumnChange,
    onDirectionToggle,
}: DataTableMobileSortProps<TData>) {
    if (sortableColumns.length === 0) {
        return null;
    }

    return (
        <div className="mb-3 flex items-center gap-2 md:hidden">
            <span className="text-xs font-medium text-slate-500">
                {sortColumnLabel}
            </span>
            <Select value={mobileSortColumnId} onValueChange={onColumnChange}>
                <SelectTrigger
                    className="w-45"
                    size="sm"
                    aria-label={sortColumnLabel}
                >
                    <SelectValue placeholder={sortColumnLabel} />
                </SelectTrigger>
                <SelectContent>
                    {sortableColumns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                            {getColumnLabel(column)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                type="button"
                variant="outline"
                className="h-9 w-9 p-0"
                onClick={onDirectionToggle}
                disabled={!mobileSortColumnId}
                aria-label={
                    activeSort?.desc ? sortDirectionDesc : sortDirectionAsc
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
    );
}
