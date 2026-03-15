'use client';

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BadgeAlert, BadgeCheck, BadgeHelp, Clock3, Info } from 'lucide-react';

/** โทนสีของ status badge เพื่อใช้ซ้ำข้ามหลายหน้า */
export type StatusBadgeTone =
    | 'neutral'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

/** props สำหรับแสดง badge สถานะที่ปรับข้อความและโทนสีได้ */
export interface StatusBadgeProps {
    label: string;
    tone?: StatusBadgeTone;
    icon?: ReactNode;
    showIcon?: boolean;
    className?: string;
}

const toneClassMap: Record<StatusBadgeTone, string> = {
    neutral: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    success: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    danger: 'bg-red-100 text-red-800 hover:bg-red-100',
    info: 'bg-sky-100 text-sky-800 hover:bg-sky-100',
};

const toneIconMap: Record<StatusBadgeTone, ReactNode> = {
    neutral: <BadgeHelp data-icon="inline-start" />,
    success: <BadgeCheck data-icon="inline-start" />,
    warning: <Clock3 data-icon="inline-start" />,
    danger: <BadgeAlert data-icon="inline-start" />,
    info: <Info data-icon="inline-start" />,
};

export function StatusBadge({
    label,
    tone = 'neutral',
    icon,
    showIcon = true,
    className,
}: StatusBadgeProps) {
    return (
        <Badge
            variant="secondary"
            className={cn('border-transparent', toneClassMap[tone], className)}
        >
            {showIcon ? (icon ?? toneIconMap[tone]) : null}
            {label}
        </Badge>
    );
}
