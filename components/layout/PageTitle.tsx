'use client';

import React from 'react';
import Image from 'next/image';

import { useLocale } from '@/components/providers/LocaleProvider';
import type { PageTitleMessages } from '@/lib/i18n/messages/page-title';

/** key ที่ใช้ map ข้อความจาก dictionary ของ PageTitle */
type PageTitleMessageKey = keyof PageTitleMessages;

interface PageTitleProps {
    title?: string;
    subtitle?: string;
    titleKey?: PageTitleMessageKey;
    subtitleKey?: PageTitleMessageKey;
    /** ค่าที่ใช้แทน placeholder เช่น {name} ในข้อความ title */
    titleParams?: Record<string, string | number>;
    /** ค่าที่ใช้แทน placeholder เช่น {name} ในข้อความ subtitle */
    subtitleParams?: Record<string, string | number>;
    imageSrc?: string;
    isHomepage?: boolean;
    imageAlt?: string;
    children?: React.ReactNode;
}

function interpolateMessage(
    message: string,
    params?: Record<string, string | number>,
) {
    if (!params) {
        return message;
    }

    return Object.entries(params).reduce(
        (currentMessage, [key, value]) =>
            currentMessage.replaceAll(`{${key}}`, String(value)),
        message,
    );
}

export function PageTitle({
    title,
    subtitle,
    titleKey,
    subtitleKey,
    titleParams,
    subtitleParams,
    imageSrc,
    imageAlt = '',
    children,
    isHomepage = false,
}: PageTitleProps) {
    const { messages } = useLocale();
    const resolvedTitle = interpolateMessage(
        titleKey ? messages.pageTitle[titleKey] : (title ?? ''),
        titleParams,
    );
    const resolvedSubtitle = interpolateMessage(
        subtitleKey ? messages.pageTitle[subtitleKey] : (subtitle ?? ''),
        subtitleParams,
    );

    return (
        <section
            className={[
                'relative w-full  flex flex-col justify-end overflow-hidden',
                'mt-20 lg:mt-0',
                isHomepage ? 'h-88' : 'h-48 lg:h-72',
                !imageSrc &&
                    'bg-linear-to-br from-page-title-from to-page-title-to',
                'text-white',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {/* รูปภาพพื้นหลัง (แสดงเฉพาะเมื่อมี imageSrc) */}
            {imageSrc && (
                <>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* overlay มืดเพื่อให้อ่านข้อความได้ชัด */}
                    <div className="absolute inset-0 bg-black/50" />
                </>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-10">
                {children}
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    {resolvedTitle}
                </h1>
                {resolvedSubtitle && (
                    <p className="mt-2 text-base lg:text-lg text-white/70">
                        {resolvedSubtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
