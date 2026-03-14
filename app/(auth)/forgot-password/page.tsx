'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ForgotPasswordForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const username = searchParams.get('username') || '';
    const reason = searchParams.get('reason');
    const messageParam = searchParams.get('message');
    const backToLoginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    const [successMessage, setSuccessMessage] = useState('');
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSuccessMessage('xxxx');
    }
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-sm">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="username">
                            Username หรือ Email
                        </FieldLabel>
                        <Input
                            id="username"
                            type="text"
                            defaultValue={username}
                            autoComplete="username"
                            placeholder="กรอก username หรือ email"
                        />
                    </Field>

                    {reason === 'password-expired' ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            รหัสผ่านของบัญชีนี้หมดอายุแล้ว
                            กรุณาดำเนินการรีเซ็ตรหัสผ่านก่อนเข้าสู่ระบบอีกครั้ง
                        </div>
                    ) : null}

                    <Button type="submit">ส่งลิงก์รีเซ็ตรหัสผ่าน</Button>

                    {successMessage ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
                            {successMessage}
                        </div>
                    ) : null}

                    <Link
                        href={backToLoginHref}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        กลับไปหน้า Login
                    </Link>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

export default function ForgotPasswordPage() {
    return (
        <div className="relative min-h-screen">
            <AuthPageShell />
            <div className="relative flex items-center justify-center min-h-[calc(100vh-6rem)] mt-24 mb-5 px-5">
                <div className="w-full max-w-md py-8 bg-white shadow-lg border border-slate-200">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <h1 className="text-xl font-bold text-slate-800">
                                Forgot Password
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                กรอก username หรือ email
                                เพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน
                            </p>
                        </div>
                        <div className="w-full p-8">
                            <Suspense
                                fallback={
                                    <div className="text-center text-sm text-slate-400">
                                        Loading...
                                    </div>
                                }
                            >
                                <ForgotPasswordForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
