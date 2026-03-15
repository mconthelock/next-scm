'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTablePaginationFooterProps {
    pageStatusLabel: string;
    previousLabel: string;
    nextLabel: string;
    morePagesLabel: string;
    currentPage: number;
    pageItems: readonly (number | string)[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onPageChange: (pageIndex: number) => void;
}

export function DataTablePaginationFooter({
    pageStatusLabel,
    previousLabel,
    nextLabel,
    morePagesLabel,
    currentPage,
    pageItems,
    canPreviousPage,
    canNextPage,
    onPreviousPage,
    onNextPage,
    onPageChange,
}: DataTablePaginationFooterProps) {
    return (
        <div className="flex flex-row gap-3 py-4 sm:items-center sm:justify-between">
            <div className="flex items-center text-sm text-slate-500">
                {pageStatusLabel}
            </div>

            <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                onPreviousPage();
                            }}
                            aria-label={previousLabel}
                            aria-disabled={!canPreviousPage}
                            className={
                                !canPreviousPage
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                            }
                        >
                            {previousLabel}
                        </PaginationPrevious>
                    </PaginationItem>

                    {pageItems.map((item, index) => {
                        if (typeof item === 'string') {
                            return (
                                <PaginationItem key={`${item}-${index}`}>
                                    <PaginationEllipsis>
                                        {morePagesLabel}
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
                                        onPageChange(item);
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
                                onNextPage();
                            }}
                            aria-label={nextLabel}
                            aria-disabled={!canNextPage}
                            className={
                                !canNextPage
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                            }
                        >
                            {nextLabel}
                        </PaginationNext>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
