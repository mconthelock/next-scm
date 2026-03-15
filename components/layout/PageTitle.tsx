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
    imageSrc?: string;
    imageAlt?: string;
    children?: React.ReactNode;
}

export function PageTitle({
    title,
    subtitle,
    titleKey,
    subtitleKey,
    imageSrc,
    imageAlt = '',
    children,
}: PageTitleProps) {
    const { messages } = useLocale();
    const resolvedTitle = titleKey
        ? messages.pageTitle[titleKey]
        : (title ?? '');
    const resolvedSubtitle = subtitleKey
        ? messages.pageTitle[subtitleKey]
        : subtitle;

    return (
        <section
            className={[
                'relative w-full h-88 flex flex-col justify-end overflow-hidden',
                'mt-20 lg:mt-0',
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
