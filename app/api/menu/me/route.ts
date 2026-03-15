import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { auth } from '@/lib/auth';
import { LOCALE_COOKIE_NAME, resolveLocale, type Locale } from '@/lib/i18n';
import type {
    AuthenMenuRecord,
    MenuChildItem,
    MenuItem,
    MenuResponse,
    RawMenuChildItem,
    RawMenuItem,
} from '@/lib/menu';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:3002';

function getLocalizedTitle(
    item: Pick<RawMenuItem | RawMenuChildItem, 'en_title' | 'th_title'>,
    locale: Locale,
) {
    return locale === 'en' ? item.en_title : item.th_title;
}

function mapMenuChildItem(
    item: RawMenuChildItem,
    locale: Locale,
): MenuChildItem {
    return {
        title: getLocalizedTitle(item, locale),
        href: item.href,
        requireAuth: item.requireAuth,
    };
}

function mapMenuItem(item: RawMenuItem, locale: Locale): MenuItem {
    return {
        title: getLocalizedTitle(item, locale),
        href: item.href,
        requireAuth: item.requireAuth,
        children: item.children?.map((child) =>
            mapMenuChildItem(child, locale),
        ),
    };
}

export async function GET(request: Request) {
    const session = await auth();
    const cookieStore = await cookies();
    const requestLocale = new URL(request.url).searchParams.get('locale');
    const locale = resolveLocale(
        requestLocale ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    );

    if (!session?.user?.groupId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(
        `${API_BASE_URL}/authen?USER_GROUP=${session.user.groupId}`,
        {
            cache: 'no-store',
        },
    );

    if (!response.ok) {
        return NextResponse.json(
            { message: 'Unable to fetch menu' },
            { status: 502 },
        );
    }

    const menuRecords = (await response.json()) as AuthenMenuRecord[];

    return NextResponse.json(
        {
            menu: (menuRecords[0]?.MENU ?? []).map((item) =>
                mapMenuItem(item, locale),
            ),
        } satisfies MenuResponse,
        {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        },
    );
}
