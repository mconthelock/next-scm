'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';

/** response ตอน validate reset ticket */
interface ChangePasswordTicketResponse {
    username?: string;
    displayName?: string;
    message?: string;
}

/** response ตอน submit เปลี่ยนรหัสผ่าน */
interface ChangePasswordSubmitResponse {
    message?: string;
    username?: string;
    errors?: string[];
}

function ChangePasswordForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const token = searchParams.get('token') || '';
    const backToLoginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCheckingTicket, setIsCheckingTicket] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [policyErrors, setPolicyErrors] = useState<string[]>([]);

    useEffect(() => {
        let isCancelled = false;
        async function validateTicket() {
            if (!token) {
                setError('ลิงก์เปลี่ยนรหัสผ่านไม่ถูกต้องหรือหมดอายุ');
                setIsCheckingTicket(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/auth/change-password?token=${encodeURIComponent(token)}`,
                );
                const data =
                    (await response.json()) as ChangePasswordTicketResponse;

                if (!response.ok || !data.username) {
                    throw new Error(
                        data.message ??
                            'ลิงก์เปลี่ยนรหัสผ่านไม่ถูกต้องหรือหมดอายุ',
                    );
                }

                if (!isCancelled) {
                    setUsername(data.username);
                    setError('');
                }
            } catch (ticketError) {
                if (!isCancelled) {
                    setError(
                        ticketError instanceof Error
                            ? ticketError.message
                            : 'ลิงก์เปลี่ยนรหัสผ่านไม่ถูกต้องหรือหมดอายุ',
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsCheckingTicket(false);
                }
            }
        }

        void validateTicket();

        return () => {
            isCancelled = true;
        };
    }, [token]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setPolicyErrors([]);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmPassword,
                }),
            });
            const data =
                (await response.json()) as ChangePasswordSubmitResponse;

            if (!response.ok) {
                setPolicyErrors(data.errors ?? []);
                throw new Error(data.message ?? 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
            }

            const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}&message=password-changed&username=${encodeURIComponent(data.username ?? username)}`;
            window.location.href = loginHref;
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
            );
            setIsSubmitting(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-sm">
                <FieldGroup>
                    <Field className="hidden">
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            readOnly
                            autoComplete="username"
                            placeholder="Username"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="new-password">
                            New Password
                        </FieldLabel>
                        <PasswordInput
                            id="new-password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            placeholder="กรอกรหัสผ่านใหม่"
                            required
                            minLength={14}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirm-new-password">
                            Confirm New Password
                        </FieldLabel>
                        <PasswordInput
                            id="confirm-new-password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            placeholder="ยืนยันรหัสผ่านใหม่"
                            required
                            minLength={14}
                        />
                    </Field>

                    <Button
                        type="submit"
                        disabled={
                            isCheckingTicket ||
                            isSubmitting ||
                            !token ||
                            !username
                        }
                    >
                        {isCheckingTicket
                            ? 'กำลังตรวจสอบสิทธิ์...'
                            : isSubmitting
                              ? 'กำลังเปลี่ยนรหัสผ่าน...'
                              : 'เปลี่ยนรหัสผ่าน'}
                    </Button>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <p className="font-bold text-slate-800">
                            Password policy
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>ต้องมีความยาวอย่างน้อย 14 ตัวอักษร</li>
                            <li>
                                ต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข
                                และอักขระพิเศษอย่างละ 1
                            </li>
                            <li>ต้องไม่เป็น pattern เรียงหรือเดาง่าย</li>
                            <li>
                                ต้องไม่ซ้ำกับรหัสผ่านปัจจุบันหรือประวัติรหัสผ่าน
                                3 ครั้งล่าสุด
                            </li>
                        </ul>
                    </div>

                    {policyErrors.length > 0 ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <ul className="list-disc space-y-1 pl-5">
                                {policyErrors.map((policyError) => (
                                    <li key={policyError}>{policyError}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
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

export default function ChangePasswordPage() {
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
                <div className="w-full max-w-md bg-white p-8 shadow-lg border border-slate-200">
                    <div className="mb-8 text-center">
                        <h1 className="text-xl font-bold text-slate-800">
                            Change Password
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            เปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบอีกครั้ง
                        </p>
                    </div>

                    <Suspense
                        fallback={
                            <div className="text-center text-sm text-slate-400">
                                Loading...
                            </div>
                        }
                    >
                        <ChangePasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
