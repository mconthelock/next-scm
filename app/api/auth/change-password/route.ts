import { NextResponse } from 'next/server';

import { verifyPasswordResetTicket } from '@/lib/password-reset-ticket';
import {
    getNextPasswordResetDate,
    hashPassword,
    validatePasswordPolicy,
} from '@/lib/password-utils';
import {
    getUserRecordByUsername,
    updateUserPasswordRecord,
} from '@/lib/user-store';

/** query string ที่ใช้ validate reset ticket */
interface ChangePasswordQuery {
    token?: string;
}

/** body ที่ client ส่งมาเมื่อกดเปลี่ยนรหัสผ่าน */
interface ChangePasswordRequest {
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = (Object.fromEntries(searchParams) as ChangePasswordQuery)
        .token;
    const ticket = verifyPasswordResetTicket(token);

    if (!ticket) {
        return NextResponse.json(
            { message: 'Reset ticket is invalid or expired' },
            { status: 401 },
        );
    }

    const user = await getUserRecordByUsername(ticket.username);

    if (!user || user.USR_PASSWORD !== ticket.passwordHash) {
        return NextResponse.json(
            { message: 'Reset ticket is invalid or expired' },
            { status: 401 },
        );
    }

    return NextResponse.json({
        username: user.USR_LOGIN,
        displayName: user.USR_NAME,
    });
}

export async function POST(request: Request) {
    const body = (await request.json()) as ChangePasswordRequest;
    const token = body.token;
    const newPassword = body.newPassword ?? '';
    const confirmPassword = body.confirmPassword ?? '';

    const ticket = verifyPasswordResetTicket(token);

    if (!ticket) {
        return NextResponse.json(
            { message: 'Reset ticket is invalid or expired' },
            { status: 401 },
        );
    }

    const user = await getUserRecordByUsername(ticket.username);

    if (!user || user.USR_PASSWORD !== ticket.passwordHash) {
        return NextResponse.json(
            { message: 'Reset ticket is invalid or expired' },
            { status: 401 },
        );
    }

    if (!newPassword || !confirmPassword) {
        return NextResponse.json(
            { message: 'New password and confirmation are required' },
            { status: 400 },
        );
    }

    if (newPassword !== confirmPassword) {
        return NextResponse.json(
            { message: 'Password confirmation does not match' },
            { status: 400 },
        );
    }

    const policyResult = validatePasswordPolicy({
        password: newPassword,
        username: user.USR_LOGIN,
        passwordHistoryHashes: [
            user.USR_PASSWORD,
            user.USR_PASSWORD1,
            user.USR_PASSWORD2,
            user.USR_PASSWORD3,
        ].filter(Boolean) as string[],
    });

    if (!policyResult.isValid) {
        return NextResponse.json(
            {
                message: 'Password policy validation failed',
                errors: policyResult.errors,
            },
            { status: 400 },
        );
    }

    const updatedUser = await updateUserPasswordRecord({
        username: user.USR_LOGIN,
        newPasswordHash: hashPassword(newPassword),
        nextResetDate: getNextPasswordResetDate(),
    });

    if (!updatedUser) {
        return NextResponse.json(
            { message: 'Unable to update password' },
            { status: 500 },
        );
    }

    return NextResponse.json({
        message: 'Password changed successfully',
        username: updatedUser.USR_LOGIN,
    });
}
