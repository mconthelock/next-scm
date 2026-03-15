'use client';

import type { DataTableFilterSelectItem } from '@/components/data-table/data-table-types';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTableFilterBarProps {
    showFilter: boolean;
    filterPlaceholder: string;
    globalFilter: string;
    onGlobalFilterChange: (nextValue: string) => void;
    selectFilters: DataTableFilterSelectItem[];
}

const ALL_FILTER_OPTION_VALUE = '__all__';

export function DataTableFilterBar({
    showFilter,
    filterPlaceholder,
    globalFilter,
    onGlobalFilterChange,
    selectFilters,
}: DataTableFilterBarProps) {
    if (!showFilter && selectFilters.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            {showFilter ? (
                <Input
                    placeholder={filterPlaceholder}
                    value={globalFilter}
                    onChange={(event) =>
                        onGlobalFilterChange(event.target.value)
                    }
                    className="max-w-sm"
                />
            ) : null}

            {selectFilters.map((filter) => (
                <Select
                    key={filter.columnId}
                    value={filter.selectedValue}
                    onValueChange={filter.onValueChange}
                >
                    <SelectTrigger
                        className="w-full sm:w-56"
                        aria-label={filter.placeholder}
                    >
                        <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_FILTER_OPTION_VALUE}>
                            {filter.placeholder}
                        </SelectItem>
                        {filter.options.map((option) => (
                            <SelectItem
                                key={`${filter.columnId}-${option.value}`}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ))}
        </div>
    );
}

export { ALL_FILTER_OPTION_VALUE };
