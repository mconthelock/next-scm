import React from 'react';
import Image from 'next/image';

interface PageTitleProps {
    title: string;
    subtitle?: string;
    imageSrc?: string;
    imageAlt?: string;
    children?: React.ReactNode;
}

export function PageTitle({
    title,
    subtitle,
    imageSrc,
    imageAlt = '',
    children,
}: PageTitleProps) {
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
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-2 text-base lg:text-lg text-white/70">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
