import NextAuth, { type DefaultSession } from 'next-auth';
import { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { hashPassword, isPasswordResetRequired } from '@/lib/password-utils';

declare module 'next-auth' {
    interface User {
        role?: string;
        groupId?: number;
        groupCode?: string;
        vendoder?: number;
    }

    interface Session {
        user: {
            role?: string;
            groupId?: number;
            groupCode?: string;
            vendoder?: number;
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
    VENDOR: number;
    GROUPS?: Array<{
        GRP_ID: number;
        GRP_CODE: string;
        GRP_NAME: string;
    }>;
}

class PasswordResetRequiredError extends CredentialsSignin {
    code = 'password-reset-required';
}

async function getUserByUsername(username: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users?USR_LOGIN=${encodeURIComponent(username)}`,
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
        vendoder: user.VENDOR,
    };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
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

                    // if (isPasswordResetRequired(user.USR_RESETDATE)) {
                    //     throw new PasswordResetRequiredError();
                    // }

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
    pages: { signIn: '/login' },
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                (token as Record<string, unknown>).role = user.role;
                (token as Record<string, unknown>).groupId = user.groupId;
                (token as Record<string, unknown>).groupCode = user.groupCode;
                (token as Record<string, unknown>).vendoder = user.vendoder;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = (token as Record<string, unknown>).role as
                    | string
                    | undefined;
                session.user.groupId = (token as Record<string, unknown>)
                    .groupId as number | undefined;
                session.user.groupCode = (token as Record<string, unknown>)
                    .groupCode as string | undefined;
                session.user.vendoder = (token as Record<string, unknown>)
                    .vendoder as number | undefined;
            }
            return session;
        },
    },
});
