import type { Metadata } from 'next';
import { Noto_Sans_Thai, Roboto } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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
    title: 'AMECSCM',
    description: 'Supply Chain Management System',
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
                <div className="flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                        <Footer />
                    </main>
                </div>
            </body>
        </html>
    );
}
