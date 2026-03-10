'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ForgotPasswordForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const backToLoginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    return (
        <form className="space-y-6">
            <FieldSet className="w-full max-w-sm">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="username">
                            Username หรือ Email
                        </FieldLabel>
                        <Input
                            id="username"
                            type="text"
                            autoComplete="username"
                            placeholder="กรอก username หรือ email"
                        />
                    </Field>

                    <Button type="submit">ส่งลิงก์รีเซ็ตรหัสผ่าน</Button>

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
                <div className="mb-8 text-center">
                    <h1 className="text-xl font-bold text-slate-800">
                        Forgot Password
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        กรอก username หรือ email
                        เพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน
                    </p>
                </div>

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
    );
}
