'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import React, { useState, Suspense } from 'react';
import Logo from '../../public/logo.svg';

/** ฟอร์ม Login — แยกออกมาเพราะใช้ useSearchParams (ต้องอยู่ใน Suspense) */
function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const errorParam = searchParams.get('error');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(
        errorParam ? 'Username หรือ Password ไม่ถูกต้อง' : '',
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await signIn('credentials', {
            username,
            password,
            callbackUrl,
            redirect: false,
        });

        if (result?.error) {
            setError('Username หรือ Password ไม่ถูกต้อง');
            setIsLoading(false);
        } else {
            // login สำเร็จ — redirect ไปหน้าที่ต้องการ
            window.location.href = callbackUrl;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor="username"
                    className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
                >
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                    placeholder="กรอก username"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                    placeholder="กรอก password"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand hover:bg-brand-hover text-white font-bold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>

            {/* บอก mock credentials สำหรับ dev */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-500">
                <p className="font-bold mb-1">ทดสอบด้วย:</p>
                <p>
                    Admin: <code className="text-slate-700">admin</code> /{' '}
                    <code className="text-slate-700">admin123</code>
                </p>
                <p>
                    User: <code className="text-slate-700">user</code> /{' '}
                    <code className="text-slate-700">user123</code>
                </p>
            </div>
        </form>
    );
}

/** หน้า Login */
export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo + Branding */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Image src={Logo} alt="Logo" height={50} />
                        <div className="h-10 w-px bg-slate-300" />
                        <div className="flex flex-col font-bold text-xs tracking-tighter leading-tight text-left">
                            <span>MITSUBISHI</span>
                            <span>ELEVATOR ASIA CO.,LTD</span>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800">
                        Supply Chain Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        เข้าสู่ระบบเพื่อดำเนินการต่อ
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <Suspense
                        fallback={
                            <div className="text-center text-sm text-slate-400">
                                Loading...
                            </div>
                        }
                    >
                        <LoginForm />
                    </Suspense>
                </div>

                <p className="text-[10px] text-center text-slate-400 mt-6 uppercase tracking-widest font-bold">
                    Changes for the Better
                </p>
            </div>
        </div>
    );
}
