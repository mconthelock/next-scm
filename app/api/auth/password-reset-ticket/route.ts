import { NextResponse } from 'next/server';

import { createPasswordResetTicket } from '@/lib/password-reset-ticket';
import { hashPassword, isPasswordResetRequired } from '@/lib/password-utils';
import { getUserRecordByUsername } from '@/lib/user-store';

/** ข้อมูลที่ client ส่งมาเพื่อขอ ticket สำหรับเปลี่ยนรหัสผ่าน */
interface PasswordResetTicketRequest {
    username?: string;
    password?: string;
}

export async function POST(request: Request) {
    const body = (await request.json()) as PasswordResetTicketRequest;
    const username = body.username?.trim();
    const password = body.password ?? '';

    if (!username || !password) {
        return NextResponse.json(
            { message: 'Username and password are required' },
            { status: 400 },
        );
    }

    const user = await getUserRecordByUsername(username);

    if (!user || user.USER_STATUS !== 1) {
        return NextResponse.json(
            { message: 'Invalid credentials' },
            { status: 401 },
        );
    }

    if (user.USR_PASSWORD !== hashPassword(password)) {
        return NextResponse.json(
            { message: 'Invalid credentials' },
            { status: 401 },
        );
    }

    if (!isPasswordResetRequired(user.USR_RESETDATE)) {
        return NextResponse.json(
            { message: 'Password reset is not required for this account' },
            { status: 400 },
        );
    }

    return NextResponse.json({
        resetTicket: createPasswordResetTicket(username, user.USR_PASSWORD),
        username: user.USR_LOGIN,
    });
}
