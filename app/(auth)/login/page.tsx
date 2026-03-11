'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React, { useState, Suspense } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';

/** response จาก API ตอนขอ reset ticket */
interface PasswordResetTicketResponse {
    resetTicket?: string;
    message?: string;
}

/** ฟอร์ม Login — แยกออกมาเพราะใช้ useSearchParams (ต้องอยู่ใน Suspense) */
function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const errorParam = searchParams.get('error');
    const codeParam = searchParams.get('code');
    const messageParam = searchParams.get('message');
    const usernameParam = searchParams.get('username') || '';
    const forgotPasswordHref = `/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    const [username, setUsername] = useState(usernameParam);
    const [password, setPassword] = useState('');
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
    const successMessage =
        messageParam === 'password-changed'
            ? 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่'
            : '';

    async function createPasswordResetTicket() {
        const response = await fetch('/api/auth/password-reset-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = (await response.json()) as PasswordResetTicketResponse;

        if (!response.ok || !data.resetTicket) {
            throw new Error(
                data.message ?? 'ไม่สามารถเริ่มขั้นตอนเปลี่ยนรหัสผ่านได้',
            );
        }

        return data.resetTicket;
    }

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
            try {
                const resetTicket = await createPasswordResetTicket();
                const forcedResetHref = `/change-password?callbackUrl=${encodeURIComponent(callbackUrl)}&token=${encodeURIComponent(resetTicket)}&reason=password-expired`;
                window.location.href = forcedResetHref;
            } catch (ticketError) {
                setError(
                    ticketError instanceof Error
                        ? ticketError.message
                        : 'ไม่สามารถเริ่มขั้นตอนเปลี่ยนรหัสผ่านได้',
                );
                setIsLoading(false);
            }

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
                        <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            placeholder="••••••••"
                        />
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
                    {successMessage ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
                            {successMessage}
                        </div>
                    ) : null}
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
        <div className="relative min-h-screen">
            <div
                className="fixed z-[-1] top-0 min-h-screen w-screen bg-cover bg-center"
                style={{
                    backgroundImage: "url('/bg_pagetitle_01_lg.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative flex items-center justify-center min-h-[calc(100vh-6rem)] mt-24 mb-5">
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
    );
}
