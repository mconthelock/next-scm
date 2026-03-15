import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Noto_Sans_Thai, Roboto } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/lib/i18n';

// โหลด Noto Sans Thai จาก Google Fonts ให้ใช้ทั้งระบบ
const notoSansThai = Noto_Sans_Thai({
    subsets: ['latin', 'thai'],
    weight: ['400', '500', '700'],
    variable: '--font-noto-sans-thai',
});

// โหลด Roboto สำหรับข้อความภาษาอังกฤษ
const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-roboto',
});

export const metadata: Metadata = {
    title: 'Mitsubishi Elevator Asia Co.Ltd. | AMEC SCM',
    description: 'Supply Chain Management System',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

    return (
        <html lang={locale}>
            <body
                className={`${notoSansThai.variable} ${roboto.variable} font-sans antialiased bg-slate-50 text-slate-900`}
            >
                <SessionProvider>
                    <LocaleProvider initialLocale={locale}>
                        {children}
                    </LocaleProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
