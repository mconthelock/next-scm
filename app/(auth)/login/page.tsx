'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React, { useState, Suspense } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

/** ฟอร์ม Login — แยกออกมาเพราะใช้ useSearchParams (ต้องอยู่ใน Suspense) */
function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const errorParam = searchParams.get('error');
    const codeParam = searchParams.get('code');
    const forgotPasswordHref = `/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(() => {
        if (codeParam === 'password-reset-required') {
            return 'รหัสผ่านหมดอายุ กรุณาเปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบ';
        }

        if (errorParam) {
            return 'Username หรือ Password ไม่ถูกต้อง';
        }

        return '';
    });

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

        if (result?.code === 'password-reset-required') {
            const forcedResetHref = `/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}&username=${encodeURIComponent(username)}&reason=password-expired`;
            window.location.href = forcedResetHref;
            return;
        }

        if (result?.error) {
            setError('Username หรือ Password ไม่ถูกต้อง');
            setIsLoading(false);
        } else {
            window.location.href = callbackUrl;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-xs">
                <FieldGroup>
                    <Field {...(error ? { 'data-invalid': true } : {})}>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                            placeholder="Username"
                        />
                    </Field>
                    <Field {...(error ? { 'data-invalid': true } : {})}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                                aria-label={
                                    showPassword
                                        ? 'ซ่อนรหัสผ่าน'
                                        : 'แสดงรหัสผ่าน'
                                }
                                aria-pressed={showPassword}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </Button>
                    <Link
                        href={forgotPasswordHref}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        ลืมรหัสผ่าน?
                    </Link>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

/** หน้า Login */
export default function LoginPage() {
    return (
        <>
            <div
                className="relative h-screen bg-cover bg-center"
                style={{
                    backgroundImage: "url('/bg_pagetitle_01_lg.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative flex items-center justify-center h-full">
                    <div className="text-center p-4">
                        <div className="min-w-md flex items-center justify-center bg-slate-50 shadow-lg px-8 py-12">
                            <div className="w-full max-w-md">
                                {/* Login header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-xl font-bold text-slate-800">
                                        Supply Chain Management
                                    </h1>
                                    <p className="text-sm text-slate-500 mt-1">
                                        เข้าสู่ระบบเพื่อดำเนินการต่อ
                                    </p>
                                </div>

                                {/* Login Card */}
                                <div className="w-full p-8">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
