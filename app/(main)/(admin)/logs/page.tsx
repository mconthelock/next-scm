'use client';

import { PageTitle } from '@/components/layout/PageTitle';
import { columns } from './columns';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { useLogs } from './use-logs';
import { useLocale } from '@/components/providers/LocaleProvider';

function PageForm() {
    const { data, isLoading, loadError, retryLoadLogs } = useLogs();
    const { messages } = useLocale();
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
                            void retryLoadLogs();
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
                dateRangeFilters={[
                    {
                        columnId: 'LOG_TIMESTAMP',
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
                titleKey="adminLogTitle"
                subtitleKey="adminLogSubtitle"
                imageSrc="/bg_pagetitle_01_lg.jpg"
            />
            <div className="container mx-auto p-6 lg:px-10">
                <PageForm />
            </div>
        </div>
    );
}
