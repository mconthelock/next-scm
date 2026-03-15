'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

/** props สำหรับปุ่มสลับภาษา */
interface LocaleSwitcherProps {
    className?: string;
}

function LocaleButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded-md px-2.5 py-1 text-xs font-bold transition-colors',
                active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
            )}
        >
            {label}
        </button>
    );
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
    const { locale, setLocale, messages } = useLocale();

    function handleChange(nextLocale: Locale) {
        if (nextLocale !== locale) {
            setLocale(nextLocale);
        }
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/90 p-1',
                className,
            )}
            aria-label={messages.common.language}
        >
            <LocaleButton
                active={locale === 'th'}
                label="TH"
                onClick={() => handleChange('th')}
            />
            <LocaleButton
                active={locale === 'en'}
                label="EN"
                onClick={() => handleChange('en')}
            />
        </div>
    );
}
