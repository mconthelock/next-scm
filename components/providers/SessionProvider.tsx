'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

/**
 * SessionProvider — ครอบ app ทั้งหมดเพื่อให้ทุก component ใช้ useSession() ได้
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
    return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
