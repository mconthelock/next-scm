import { PageTitle } from '@/components/layout/PageTitle';
import { columns, Users } from './columns';
import { DataTable } from '@/components/data-table/DataTable';

async function getData(): Promise<Users[]> {
    // Fetch data from your API here.
    const response = await fetch(`${process.env.APP_API_URL}/users`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const data = (await response.json()) as Users[];
    return data;
}

export default async function Page() {
    const data = await getData();
    return (
        <>
            <PageTitle
                titleKey="adminUserTitle"
                subtitleKey="adminUserSubtitle"
            />
            <div className="container mx-auto p-6 lg:px-10">
                <DataTable
                    columns={columns}
                    data={data}
                    filterColumnId="USR_EMAIL"
                    filterPlaceholder="Filter emails..."
                />
            </div>
        </>
    );
}
