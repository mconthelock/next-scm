'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

/** props ของช่องกรอกรหัสผ่านที่มีปุ่ม show/hide ในตัว */
interface PasswordInputProps extends Omit<
    React.ComponentPropsWithoutRef<'input'>,
    'type'
> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={showPassword ? 'text' : 'password'}
                className={['pr-10', className].filter(Boolean).join(' ')}
            />
            <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                aria-pressed={showPassword}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}
