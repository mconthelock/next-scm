import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * (main) group layout — ใช้สำหรับทุกหน้าที่ต้องแสดง Header + Footer
 * หน้า login จะไม่อยู่ใน group นี้จึงไม่มี Header/Footer
 */
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
                <Footer />
            </main>
        </div>
    );
}
