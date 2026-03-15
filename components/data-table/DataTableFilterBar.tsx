'use client';

import type {
    DataTableFilterButtonItem,
    DataTableFilterDateItem,
    DataTableFilterDateRangeItem,
    DataTableFilterSelectItem,
} from '@/components/data-table/data-table-types';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DataTableFilterBarProps {
    showFilter: boolean;
    filterPlaceholder: string;
    globalFilter: string;
    onGlobalFilterChange: (nextValue: string) => void;
    selectFilters: DataTableFilterSelectItem[];
    buttonFilters: DataTableFilterButtonItem[];
    dateFilters: DataTableFilterDateItem[];
    dateRangeFilters: DataTableFilterDateRangeItem[];
}

const ALL_FILTER_OPTION_VALUE = '__all__';

export function DataTableFilterBar({
    showFilter,
    filterPlaceholder,
    globalFilter,
    onGlobalFilterChange,
    selectFilters,
    buttonFilters,
    dateFilters,
    dateRangeFilters,
}: DataTableFilterBarProps) {
    if (
        !showFilter &&
        selectFilters.length === 0 &&
        buttonFilters.length === 0 &&
        dateFilters.length === 0 &&
        dateRangeFilters.length === 0
    ) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 justify-start">
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
            </div>

            <div className="flex flex-col gap-3 lg:ml-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
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

                {dateFilters.map((filter) => (
                    <DatePicker
                        key={filter.columnId}
                        mode="single"
                        value={filter.selectedDate}
                        placeholder={filter.placeholder}
                        clearLabel={filter.clearLabel}
                        onChange={filter.onDateChange}
                        className="w-full sm:w-56"
                    />
                ))}

                {dateRangeFilters.map((filter) => (
                    <DatePicker
                        key={filter.columnId}
                        mode="range"
                        value={filter.selectedRange}
                        fromPlaceholder={filter.fromPlaceholder}
                        toPlaceholder={filter.toPlaceholder}
                        clearLabel={filter.clearLabel}
                        onChange={filter.onRangeChange}
                        className="w-full sm:w-72"
                    />
                ))}

                {buttonFilters.map((filter) => (
                    <div
                        key={filter.columnId}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/90 p-1"
                        aria-label={filter.allLabel}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                filter.onValueChange(ALL_FILTER_OPTION_VALUE)
                            }
                            className={cn(
                                'rounded-md px-2.5 py-1 text-xs font-bold transition-colors',
                                filter.selectedValue === ALL_FILTER_OPTION_VALUE
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                            )}
                        >
                            {filter.allLabel}
                        </button>
                        {filter.options.map((option) => (
                            <button
                                key={`${filter.columnId}-${option.value}`}
                                type="button"
                                onClick={() =>
                                    filter.onValueChange(option.value)
                                }
                                className={cn(
                                    'rounded-md px-2.5 py-1 text-xs font-bold transition-colors',
                                    filter.selectedValue === option.value
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export { ALL_FILTER_OPTION_VALUE };
