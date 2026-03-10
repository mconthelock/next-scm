import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Middleware — บังคับ login ทุกหน้า
 * ถ้ายังไม่ login จะ redirect ไปหน้า /login พร้อมส่ง callbackUrl กลับ
 */
export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth?.user;

    // ถ้ายังไม่ login → redirect ไป /login
    if (!isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

/**
 * matcher — ไม่ apply กับ:
 * - /login (หน้า login)
 * - /forgot-password (หน้า reset password)
 * - /api/auth/* (NextAuth API routes)
 * - /_next/* (Next.js internal)
 * - /favicon.ico, /logo.svg, /images/* (static files)
 * - *.jpg, *.png, *.svg, *.gif, *.webp (รูปภาพใน public)
 */
export const config = {
    matcher: [
        '/((?!login|forgot-password|api/auth|_next/static|_next/image|about|favicon\\.ico|logo\\.svg|images|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico)$).*)',
    ],
};
