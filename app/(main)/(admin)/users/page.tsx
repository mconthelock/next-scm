'use client';

import React, { useMemo } from 'react';
import { PageTitle } from '@/components/layout/PageTitle';
import { columns } from './columns';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { useUsers } from './use-users';
import { useLocale } from '@/components/providers/LocaleProvider';

function PageForm() {
    const { data, isLoading, loadError, retryLoadUsers } = useUsers();
    const { locale } = useLocale();
    const groupOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    data
                        .map((user) => user.GROUPS?.GRP_NAME)
                        .filter((groupName): groupName is string =>
                            Boolean(groupName),
                        ),
                ),
            )
                .sort((left, right) => left.localeCompare(right, locale))
                .map((groupName) => ({
                    label: groupName,
                    value: groupName,
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
                            void retryLoadUsers();
                        }}
                    >
                        Retry
                    </Button>
                </div>
            ) : null}

            <DataTable
                columns={columns}
                data={data}
                filterColumnIds={[
                    'USR_LOGIN',
                    'USR_NAME',
                    'USR_EMAIL',
                    'VENDORS',
                ]}
                selectFilters={[
                    {
                        columnId: 'GROUPS',
                        placeholder:
                            locale === 'th' ? 'ทุกกลุ่มผู้ใช้' : 'All groups',
                        options: groupOptions,
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
                titleKey="adminUserTitle"
                subtitleKey="adminUserSubtitle"
                imageSrc="/bg_pagetitle_01_lg.jpg"
            />
            <div className="container mx-auto p-6 lg:px-10">
                <PageForm />
            </div>
        </div>
    );
}
