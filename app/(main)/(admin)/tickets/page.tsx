import { PageTitle } from '@/components/layout/PageTitle';

function PageForm() {
    return <div>Tickets</div>;
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
