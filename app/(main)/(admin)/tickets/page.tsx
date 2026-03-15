'use client';

import { PageTitle } from '@/components/layout/PageTitle';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/providers/LocaleProvider';
import { columns } from './columns';
import { useTickets } from './use-tickets';
import { useMemo } from 'react';

function PageForm() {
    const { data, isLoading, loadError, retryLoadTickets } = useTickets();
    const { locale, messages } = useLocale();

    const priorityOptions = useMemo(
        () =>
            Array.from(new Set(data.map((ticket) => ticket.TICKET_PRIORITY)))
                .sort((left, right) => left.localeCompare(right, locale))
                .map((TICKET_PRIORITY) => ({
                    label: TICKET_PRIORITY,
                    value: TICKET_PRIORITY,
                })),
        [data, locale],
    );

    return (
        <div>
            {loadError ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p>{loadError}</p>
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => {
                            void retryLoadTickets();
                        }}
                    >
                        Retry
                    </Button>
                </div>
            ) : null}

            <DataTable
                columns={columns}
                data={data}
                filterColumnIds={['USR_LOGIN', 'LOG_IP']}
                buttonFilters={[
                    {
                        columnId: 'TICKET_PRIORITY',
                        allLabel: messages.table.filterLabels.allPriority,
                        options: priorityOptions,
                    },
                ]}
                dateRangeFilters={[
                    {
                        columnId: 'TICKET_CREATED_AT',
                        fromPlaceholder: messages.table.filterLabels.fromDate,
                        toPlaceholder: messages.table.filterLabels.toDate,
                        clearLabel: messages.table.filterLabels.clearDate,
                    },
                ]}
                pageSize={20}
            />
            <Button className="mt-4" variant="outline" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Export Excel'}
            </Button>
        </div>
    );
}

export default function Page() {
    return (
        <div>
            <PageTitle
                titleKey="adminTicketTitle"
                subtitleKey="adminTicketSubtitle"
                imageSrc="/bg_pagetitle_01_lg.jpg"
            />
            <div className="container mx-auto p-6 lg:px-10">
                <PageForm />
            </div>
        </div>
    );
}
