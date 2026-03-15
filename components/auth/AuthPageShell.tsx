import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';

/** props สำหรับครอบหน้า auth ที่ใช้ background และ card layout ร่วมกัน */
interface AuthPageShellProps {
    bg?: string;
}

export function AuthPageShell({
    bg = '/bg_pagetitle_01_lg.jpg',
}: AuthPageShellProps) {
    return (
        <>
            <div
                className="fixed top-0 z-[-1] min-h-screen w-screen bg-cover bg-center"
                style={{
                    backgroundImage: `url('${bg}')`,
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50" />
            </div>

            <div className="fixed right-4 top-4 z-30">
                <LocaleSwitcher />
            </div>
        </>
    );
}
