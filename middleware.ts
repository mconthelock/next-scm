export { auth as middleware } from '@/lib/auth';

/**
 * Middleware config — บังคับ login ทุกหน้า ยกเว้นที่ระบุไว้
 *
 * matcher จะไม่ apply กับ:
 * - /login (หน้า login)
 * - /api/auth/* (NextAuth API routes)
 * - /_next/* (Next.js internal)
 * - /favicon.ico, /logo.svg, /images/* (static files)
 */
export const config = {
    matcher: [
        '/((?!login|api/auth|_next/static|_next/image|favicon\\.ico|logo\\.svg|images).*)',
    ],
};
