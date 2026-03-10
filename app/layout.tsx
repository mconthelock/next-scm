import type { Metadata } from 'next';
import { Noto_Sans_Thai, Roboto } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${notoSansThai.variable} ${roboto.variable} font-sans antialiased bg-slate-50 text-slate-900`}
            >
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
