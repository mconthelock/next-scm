import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import type { AuthenMenuRecord, MenuResponse } from '@/lib/menu';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:3002';

export async function GET() {
    const session = await auth();

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

    return NextResponse.json<MenuResponse>({
        menu: menuRecords[0]?.MENU ?? [],
    });
}
