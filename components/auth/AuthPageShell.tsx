import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

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

            {/* <div className="relative mt-24 mb-5 flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
                <div className={cn('w-full', innerClassName)}>
                    <div
                        className={cn(
                            'border border-slate-200 bg-white p-8 shadow-lg',
                            cardClassName,
                        )}
                    >
                        <div className="mb-8 text-center">
                            <h1 className="text-xl font-bold text-slate-800">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
}
