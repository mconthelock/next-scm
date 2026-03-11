import Link from 'next/link';
import { ChevronDown, ChevronLeft, LogOut, User } from 'lucide-react';

import type { MenuItem } from '@/lib/menu';
import { MobileMenuSkeleton } from '@/components/layout/header/MenuSkeletons';

/** ข้อมูลผู้ใช้ที่ใช้แสดงใน drawer */
interface MobileDrawerUser {
    name: string;
    role: string;
}

/** props สำหรับ mobile drawer ของ header */
interface MobileNavDrawerProps {
    items: MenuItem[];
    isMenuLoading: boolean;
    isLoggedIn: boolean;
    menuError: string | null;
    showEmptyMenu: boolean;
    onRetry: () => void;
    isOpen: boolean;
    expandedMobileMenu: string | null;
    setExpandedMobileMenu: (value: string | null) => void;
    onClose: () => void;
    user: MobileDrawerUser | null;
    onLogout: () => void;
}

export function MobileNavDrawer({
    items,
    isMenuLoading,
    isLoggedIn,
    menuError,
    showEmptyMenu,
    onRetry,
    isOpen,
    expandedMobileMenu,
    setExpandedMobileMenu,
    onClose,
    user,
    onLogout,
}: MobileNavDrawerProps) {
    const showMenuError = isLoggedIn && !isMenuLoading && !!menuError;

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 40, top: '80px' }}
                onClick={onClose}
            />

            <div
                className={`fixed right-0 h-[calc(100vh-80px)] w-full sm:w-[320px] bg-white shadow-2xl transform transition-transform duration-500 ease-out lg:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ zIndex: 50, top: '80px' }}
            >
                <div className="h-1 w-full bg-brand" />
                <div className="flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="flex flex-col">
                            {isMenuLoading && isLoggedIn ? (
                                <MobileMenuSkeleton />
                            ) : null}
                            {showMenuError ? (
                                <li className="px-8 py-4 text-sm text-red-500">
                                    <p>{menuError}</p>
                                    <button
                                        className="mt-2 text-xs font-bold uppercase tracking-wide text-brand"
                                        onClick={onRetry}
                                    >
                                        Retry
                                    </button>
                                </li>
                            ) : null}
                            {showEmptyMenu ? (
                                <li className="px-8 py-4 text-sm font-medium text-slate-400">
                                    No menu available
                                </li>
                            ) : null}
                            {items.map((item) => {
                                if (item.children?.length) {
                                    const isExpanded =
                                        expandedMobileMenu === item.title;

                                    return (
                                        <li key={item.title}>
                                            <button
                                                className="w-full flex items-center justify-between px-8 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                                                onClick={() =>
                                                    setExpandedMobileMenu(
                                                        isExpanded
                                                            ? null
                                                            : item.title,
                                                    )
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ChevronLeft className="h-4 w-4 opacity-20" />
                                                    {item.title}
                                                </div>
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${
                                                        isExpanded
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>

                                            {isExpanded ? (
                                                <ul className="bg-slate-50 border-y border-slate-100">
                                                    {item.children.map(
                                                        (child) => (
                                                            <li
                                                                key={
                                                                    child.title
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    className="flex items-center gap-3 pl-14 pr-8 py-3 text-sm text-slate-600 hover:text-brand hover:bg-slate-100 transition-colors"
                                                                    onClick={() => {
                                                                        onClose();
                                                                        setExpandedMobileMenu(
                                                                            null,
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        child.title
                                                                    }
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : null}
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href ?? '/'}
                                            className="flex items-center justify-between px-8 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                                            onClick={onClose}
                                        >
                                            <div className="flex items-center gap-3">
                                                <ChevronLeft className="h-4 w-4 opacity-20" />
                                                {item.title}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="p-6 border-t bg-slate-50">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded font-bold text-sm"
                                    onClick={onLogout}
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#333] text-white rounded font-bold text-sm"
                                onClick={onClose}
                            >
                                <User className="h-4 w-4" /> Account Login
                            </Link>
                        )}
                        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
                            Changes for the Better
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
