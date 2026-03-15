'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { PageTitle } from '@/components/layout/PageTitle';
import { useLocale } from '@/components/providers/LocaleProvider';
import type { PageTitleMessages } from '@/lib/i18n/messages/page-title';

function getGreetingTitleKey(hour: number | null): keyof PageTitleMessages {
    if (hour === null) {
        return 'homeGreetingFallbackTitle';
    }

    if (hour < 12) {
        return 'homeGreetingMorningTitle';
    }

    if (hour < 18) {
        return 'homeGreetingAfternoonTitle';
    }

    return 'homeGreetingEveningTitle';
}

export function HomeGreeting() {
    const { data: session } = useSession();
    const { locale } = useLocale();
    const [currentHour, setCurrentHour] = useState<number | null>(null);

    useEffect(() => {
        function updateCurrentHour() {
            setCurrentHour(new Date().getHours());
        }

        updateCurrentHour();

        const intervalId = window.setInterval(updateCurrentHour, 60_000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    const userName =
        session?.user?.name?.trim() || (locale === 'th' ? 'ผู้ใช้' : 'User');
    const greetingTitleKey = getGreetingTitleKey(currentHour);

    return (
        <PageTitle
            titleKey={greetingTitleKey}
            titleParams={{ name: userName }}
            subtitleKey="scmSubtitle"
            imageSrc="/bg_pagetitle_01_lg.jpg"
            isHomepage={true}
        />
    );
}
