'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

/** props ของ date picker แบบวันเดียว */
interface SingleDatePickerProps {
    mode?: 'single';
    value?: Date;
    placeholder: string;
    clearLabel: string;
    onChange: (nextDate?: Date) => void;
    className?: string;
}

/** props ของ date picker แบบช่วงวันที่ */
interface RangeDatePickerProps {
    mode: 'range';
    value?: DateRange;
    fromPlaceholder: string;
    toPlaceholder: string;
    clearLabel: string;
    onChange: (nextRange?: DateRange) => void;
    className?: string;
}

/** props กลางของ date picker ที่รองรับทั้ง single และ range */
type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 640px)');

        const updateMatch = (event?: MediaQueryListEvent) => {
            setIsDesktop(event ? event.matches : mediaQuery.matches);
        };

        updateMatch();
        mediaQuery.addEventListener('change', updateMatch);

        return () => {
            mediaQuery.removeEventListener('change', updateMatch);
        };
    }, []);

    return isDesktop;
}

export function DatePicker(props: DatePickerProps) {
    if (props.mode === 'range') {
        return <RangeDatePicker {...props} />;
    }

    return <SingleDatePicker {...props} />;
}

function SingleDatePicker({
    value,
    placeholder,
    clearLabel,
    onChange,
    className,
}: SingleDatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const currentYear = new Date().getFullYear();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className={cn(
                        'justify-start text-left font-normal data-[empty=true]:text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon />
                    <span className="truncate">
                        {value ? format(value, 'PPP') : placeholder}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    fromYear={currentYear - 100}
                    toYear={currentYear + 10}
                    selected={value}
                    onSelect={(nextDate) => {
                        onChange(nextDate);
                        setOpen(false);
                    }}
                />
                {value ? (
                    <div className="border-t p-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-center"
                            onClick={() => {
                                onChange(undefined);
                                setOpen(false);
                            }}
                        >
                            {clearLabel}
                        </Button>
                    </div>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}

function RangeDatePicker({
    value,
    fromPlaceholder,
    toPlaceholder,
    clearLabel,
    onChange,
    className,
}: RangeDatePickerProps) {
    const isDesktop = useIsDesktop();
    const currentYear = new Date().getFullYear();

    function getLabel() {
        if (value?.from && value?.to) {
            return `${format(value.from, 'LLL dd, y')} - ${format(value.to, 'LLL dd, y')}`;
        }

        if (value?.from) {
            return format(value.from, 'LLL dd, y');
        }

        return `${fromPlaceholder} - ${toPlaceholder}`;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value?.from && !value?.to}
                    className={cn(
                        'justify-start text-left font-normal data-[empty=true]:text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon />
                    <span className="truncate">{getLabel()}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto max-w-[calc(100vw-2rem)] p-0"
                align={isDesktop ? 'end' : 'center'}
            >
                <Calendar
                    initialFocus
                    mode="range"
                    captionLayout="dropdown"
                    fromYear={currentYear - 20}
                    toYear={currentYear + 10}
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={isDesktop ? 2 : 1}
                />
                {value?.from || value?.to ? (
                    <div className="border-t p-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-center"
                            onClick={() => {
                                onChange(undefined);
                            }}
                        >
                            {clearLabel}
                        </Button>
                    </div>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}
