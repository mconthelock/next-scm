import NextAuth, { type DefaultSession } from 'next-auth';
import { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { hashPassword, isPasswordResetRequired } from '@/lib/password-utils';

declare module 'next-auth' {
    interface User {
        role?: string;
        department?: string;
        groupId?: number;
        groupCode?: string;
    }

    interface Session {
        user: {
            role?: string;
            department?: string;
            groupId?: number;
            groupCode?: string;
        } & DefaultSession['user'];
    }
}

/** โครงสร้าง user ที่ได้กลับมาจาก json-server */
interface ApiUser {
    USR_ID: number;
    USR_LOGIN: string;
    USR_PASSWORD: string;
    USR_NAME: string;
    USR_EMAIL: string;
    USR_POSITION: string;
    USER_STATUS: number;
    USR_RESETDATE?: string;
    GROUPS?: Array<{
        GRP_ID: number;
        GRP_CODE: string;
        GRP_NAME: string;
    }>;
}

class PasswordResetRequiredError extends CredentialsSignin {
    code = 'password-reset-required';
}

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:3002';

async function getUserByUsername(username: string) {
    const response = await fetch(
        `${API_BASE_URL}/users?USR_LOGIN=${encodeURIComponent(username)}`,
        {
            cache: 'no-store',
        },
    );

    if (!response.ok) {
        throw new Error('Unable to fetch users from API');
    }

    const users = (await response.json()) as ApiUser[];
    return users[0] ?? null;
}

function mapUserToSessionUser(user: ApiUser) {
    return {
        id: String(user.USR_ID),
        name: user.USR_NAME,
        email: user.USR_EMAIL,
        role: user.GROUPS?.[0]?.GRP_NAME ?? '',
        department: user.USR_POSITION,
        groupId: user.GROUPS?.[0]?.GRP_ID,
        groupCode: user.GROUPS?.[0]?.GRP_CODE ?? '',
    };
}

/**
 * NextAuth configuration
 *
 * ใช้ Credentials provider (username + password) — คล้ายกับ Passport Local Strategy
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    // ต้องมี secret สำหรับเข้ารหัส JWT/session และ token ภายในของ Auth.js
    secret: process.env.AUTH_SECRET,

    providers: [
        Credentials({
            // ฟิลด์ที่จะแสดงในฟอร์ม (ใช้เฉพาะ built-in page ถ้าไม่ได้สร้าง custom)
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            /**
             * authorize — ตรวจสอบ username/password
             */
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };

                if (!username || !password) {
                    return null;
                }

                try {
                    const user = await getUserByUsername(username);

                    if (!user || user.USER_STATUS !== 1) {
                        return null;
                    }

                    if (user.USR_PASSWORD !== hashPassword(password)) {
                        return null;
                    }

                    if (isPasswordResetRequired(user.USR_RESETDATE)) {
                        throw new PasswordResetRequiredError();
                    }

                    // ส่งกลับ user object (จะถูกเก็บใน JWT token)
                    return mapUserToSessionUser(user);
                } catch (error) {
                    if (error instanceof PasswordResetRequiredError) {
                        throw error;
                    }

                    console.error('Authorize failed', error);
                    return null;
                }
            },
        }),
    ],

    // กำหนดหน้า login เอง (ไม่ใช้ built-in)
    pages: {
        signIn: '/login',
    },

    callbacks: {
        /**
         * jwt callback — เพิ่ม role และ department เข้าไปใน token
         */
        async jwt({ token, user }) {
            if (user) {
                (token as Record<string, unknown>).role = user.role;
                (token as Record<string, unknown>).department = user.department;
                (token as Record<string, unknown>).groupId = user.groupId;
                (token as Record<string, unknown>).groupCode = user.groupCode;
            }
            return token;
        },

        /**
         * session callback — ส่ง role และ department ไปยัง client session
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.role = (token as Record<string, unknown>).role as
                    | string
                    | undefined;
                session.user.department = (token as Record<string, unknown>)
                    .department as string | undefined;
                session.user.groupId = (token as Record<string, unknown>)
                    .groupId as number | undefined;
                session.user.groupCode = (token as Record<string, unknown>)
                    .groupCode as string | undefined;
            }
            return session;
        },
    },

    // ใช้ JWT strategy (ไม่ต้องมี database)
    session: {
        strategy: 'jwt',
    },
});
