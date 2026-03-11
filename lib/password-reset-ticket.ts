import { createHmac, timingSafeEqual } from 'node:crypto';

/** payload ที่เก็บใน reset ticket ชั่วคราว */
export interface PasswordResetTicketPayload {
    username: string;
    passwordHash: string;
    expiresAt: number;
}

const PASSWORD_RESET_TICKET_TTL_MS = 10 * 60 * 1000;

function getTicketSecret() {
    return process.env.AUTH_SECRET ?? 'dev-secret-change-this-in-production';
}

function signValue(value: string) {
    return createHmac('sha256', getTicketSecret())
        .update(value)
        .digest('base64url');
}

export function createPasswordResetTicket(
    username: string,
    passwordHash: string,
) {
    const payload: PasswordResetTicketPayload = {
        username,
        passwordHash,
        expiresAt: Date.now() + PASSWORD_RESET_TICKET_TTL_MS,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        'base64url',
    );
    const signature = signValue(encodedPayload);

    return `${encodedPayload}.${signature}`;
}

export function verifyPasswordResetTicket(ticket?: string) {
    if (!ticket) {
        return null;
    }

    const [encodedPayload, signature] = ticket.split('.');

    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = signValue(encodedPayload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
        return null;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(encodedPayload, 'base64url').toString('utf8'),
        ) as PasswordResetTicketPayload;

        if (payload.expiresAt <= Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}
