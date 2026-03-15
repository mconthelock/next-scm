import { PageTitle } from '@/components/layout/PageTitle';

export default function Page() {
    return (
        <div>
            <PageTitle
                titleKey="adminLogTitle"
                subtitleKey="adminLogSubtitle"
                imageSrc="/bg_pagetitle_01_lg.jpg"
            />
            <div className="container mx-auto p-6 lg:px-10"></div>
        </div>
    );
}
