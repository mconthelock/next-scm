import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import type { MenuItem } from '@/lib/menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DesktopMenuSkeleton } from '@/components/layout/header/MenuSkeletons';

/** props สำหรับ desktop nav ใน header */
interface DesktopNavProps {
    items: MenuItem[];
    isMenuLoading: boolean;
    isLoggedIn: boolean;
    menuError: string | null;
    showEmptyMenu: boolean;
    onRetry: () => void;
}

export function DesktopNav({
    items,
    isMenuLoading,
    isLoggedIn,
    menuError,
    showEmptyMenu,
    onRetry,
}: DesktopNavProps) {
    const showMenuError = isLoggedIn && !isMenuLoading && !!menuError;

    return (
        <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center gap-8">
                {isMenuLoading && isLoggedIn ? <DesktopMenuSkeleton /> : null}
                {showMenuError ? (
                    <li className="flex items-center gap-3">
                        <span className="text-[13px] font-bold text-red-500">
                            {menuError}
                        </span>
                        <button
                            className="text-[12px] font-bold uppercase tracking-wide text-brand"
                            onClick={onRetry}
                        >
                            Retry
                        </button>
                    </li>
                ) : null}
                {showEmptyMenu ? (
                    <li>
                        <span className="text-[13px] font-bold uppercase tracking-wide text-slate-400 py-2">
                            No menu available
                        </span>
                    </li>
                ) : null}
                {items.map((item) => {
                    if (item.children?.length) {
                        return (
                            <li key={item.title}>
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-[13px] font-bold uppercase tracking-wide text-slate-700 hover:text-brand transition-colors relative group py-2 inline-flex items-center gap-1">
                                            {item.title}
                                            <ChevronDown className="h-3.5 w-3.5" />
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="z-70"
                                    >
                                        {item.children.map((child) => (
                                            <DropdownMenuItem
                                                asChild
                                                key={child.title}
                                            >
                                                <Link href={child.href}>
                                                    {child.title}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        );
                    }

                    return (
                        <li key={item.title}>
                            <Link
                                href={item.href ?? '/'}
                                className="text-[13px] font-bold uppercase tracking-wide text-slate-700 hover:text-brand transition-colors relative group py-2"
                            >
                                {item.title}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
