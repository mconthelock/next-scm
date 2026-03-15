'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { useLocale } from '@/components/providers/LocaleProvider';
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
    const { messages } = useLocale();
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
                setError(messages.auth.changePassword.invalidTicket);
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
                            messages.auth.changePassword.invalidTicket,
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
                            : messages.auth.changePassword.invalidTicket,
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
    }, [messages.auth.changePassword.invalidTicket, token]);

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
                throw new Error(
                    data.message ?? messages.auth.changePassword.unableToChange,
                );
            }

            const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}&message=password-changed&username=${encodeURIComponent(data.username ?? username)}`;
            window.location.href = loginHref;
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : messages.auth.changePassword.unableToChange,
            );
            setIsSubmitting(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-sm">
                <FieldGroup>
                    <Field className="hidden">
                        <FieldLabel htmlFor="username">
                            {messages.auth.changePassword.username}
                        </FieldLabel>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            readOnly
                            autoComplete="username"
                            placeholder={messages.auth.changePassword.username}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="new-password">
                            {messages.auth.changePassword.newPassword}
                        </FieldLabel>
                        <PasswordInput
                            id="new-password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            placeholder={
                                messages.auth.changePassword.newPassword
                            }
                            required
                            minLength={14}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirm-new-password">
                            {messages.auth.changePassword.confirmNewPassword}
                        </FieldLabel>
                        <PasswordInput
                            id="confirm-new-password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            placeholder={
                                messages.auth.changePassword.confirmNewPassword
                            }
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
                            ? messages.auth.changePassword.checkingAccess
                            : isSubmitting
                              ? messages.auth.changePassword.submitting
                              : messages.auth.changePassword.submit}
                    </Button>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <p className="font-bold text-slate-800">
                            {messages.auth.changePassword.policyTitle}
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            {messages.auth.changePassword.policyItems.map(
                                (policyItem) => (
                                    <li key={policyItem}>{policyItem}</li>
                                ),
                            )}
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
                        {messages.auth.changePassword.backToLogin}
                    </Link>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

export default function ChangePasswordPage() {
    const { messages } = useLocale();

    return (
        <div className="relative min-h-screen">
            <AuthPageShell />
            <div className="relative flex items-center justify-center min-h-[calc(100vh-6rem)] mt-24 mb-5 px-5">
                <div className="w-full max-w-md py-8 bg-white shadow-lg border border-slate-200">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <h1 className="text-xl font-bold text-slate-800">
                                {messages.auth.changePassword.title}
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                {messages.auth.changePassword.subtitle}
                            </p>
                        </div>
                        <div className="w-full p-8">
                            <Suspense
                                fallback={
                                    <div className="text-center text-sm text-slate-400">
                                        {messages.common.loading}
                                    </div>
                                }
                            >
                                <ChangePasswordForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
