'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
    Menu,
    X,
    User,
    ChevronDown,
    Settings,
    ChevronLeft,
    LogOut,
    MessageCircle,
    BookSearch,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '../../public/logo.svg';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { useLocale } from '@/components/providers/LocaleProvider';
import { type MenuItem } from '@/lib/menu';
import { translateMenuLabel } from '@/lib/i18n';
import { useUserMenu } from '@/lib/use-user-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** กรองเมนูตามสถานะ login */
function getVisibleNavItems(
    navItems: MenuItem[],
    isLoggedIn: boolean,
): MenuItem[] {
    return navItems
        .map((item) => ({
            ...item,
            children: item.children?.filter(
                (child) =>
                    child.requireAuth === undefined ||
                    child.requireAuth === isLoggedIn,
            ),
        }))
        .filter((item) => {
            const isParentVisible =
                item.requireAuth === undefined ||
                item.requireAuth === isLoggedIn;

            if (!isParentVisible) {
                return false;
            }

            return !!item.href || (item.children?.length ?? 0) > 0;
        });
}

export function Header() {
    // ดึง session จาก NextAuth — ได้ข้อมูล user + สถานะ login
    const { data: session, status } = useSession();
    const { locale, messages } = useLocale();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
        null,
    );
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isLoggedIn = !!session?.user;
    const isSessionLoading = status === 'loading';
    const { navItems } = useUserMenu(
        isLoggedIn,
        isSessionLoading,
        locale,
        session?.user?.groupId,
    );
    const visibleNavItems = getVisibleNavItems(navItems, isLoggedIn);

    // ข้อมูล user จาก session (มี role, department จาก JWT callback)
    const user = session?.user
        ? {
              name: session.user.name ?? '',
              role: session.user.role ?? '',
              groupId: session.user.groupId,
              vendor: session.user.vendoder,
          }
        : null;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    useEffect(() => {
        setExpandedMobileMenu(null);
    }, [navItems]);

    return (
        <header
            className={`w-full h-21 fixed top-0 left-0 z-60 transition-transform duration-500 ease-in-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="max-w-345 mx-auto px-4 flex h-20 items-center justify-between bg-white shadow-sm">
                {/* Logo Section */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center justify-center">
                        <Image src={Logo} alt="" height={50} />
                    </div>
                    <div className="h-14 w-px bg-slate-200 mx-1 hidden md:block" />
                    <div className="flex flex-col font-bold text-xs tracking-tighter leading-tight">
                        <span>MITSUBISHI</span>
                        <span>ELEVATOR ASIA CO.,LTD</span>
                    </div>
                </div>

                {/* Desktop Nav — แสดงเฉพาะเมนูที่ตรงตามสถานะ login */}
                <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
                    <ul className="flex items-center gap-8">
                        {visibleNavItems.map((item) => {
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
                                                            {translateMenuLabel(
                                                                messages,
                                                                child.title,
                                                            )}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </li>
                                );
                            }

                            if (!item.href) {
                                return null;
                            }

                            return (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="text-[13px] font-bold uppercase tracking-wide text-slate-700 hover:text-brand transition-colors relative group py-2"
                                    >
                                        {translateMenuLabel(
                                            messages,
                                            item.title,
                                        )}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Tools Section — เปลี่ยนตามสถานะ login */}
                <div className="flex items-center gap-1 shrink-0">
                    <LocaleSwitcher className="hidden md:inline-flex" />
                    <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

                    {user ? (
                        /* --- Login แล้ว: แสดงชื่อ + dropdown --- */
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md text-slate-600 font-bold text-sm"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="hidden sm:block max-w-30 truncate">
                                    {user.name}
                                </span>
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-2">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-bold text-slate-800">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {user.role ||
                                                    messages.header
                                                        .noRoleAssigned}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <User className="h-4 w-4" />
                                            {messages.header.profile}
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Settings className="h-4 w-4" />
                                            {messages.header.settings}
                                        </Link>
                                        <Link
                                            href="/tickets"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            {messages.header.tickets}
                                        </Link>
                                        <Link
                                            href="/manual"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <BookSearch className="h-4 w-4" />
                                            {messages.header.manual}
                                        </Link>
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    signOut({
                                                        callbackUrl: '/login',
                                                    });
                                                }}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {messages.header.logout}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* --- ยังไม่ login: แสดงปุ่ม Login --- */
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md text-slate-600 font-bold text-sm"
                        >
                            <User className="h-5 w-5" />
                            <span className="hidden sm:block">
                                {messages.header.login}
                            </span>
                        </Link>
                    )}

                    {/* Toggle Menu/X Icon: เปลี่ยนไอคอนตามสถานะ isOpen */}
                    <button
                        className="lg:hidden p-2 text-slate-700 ml-2 hover:bg-slate-50 rounded-full transition-all"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="h-7 w-7 text-slate-700 animate-in zoom-in duration-300" />
                        ) : (
                            <Menu className="h-7 w-7" />
                        )}
                    </button>
                </div>
            </div>

            {/* --- MOBILE RIGHT SIDE DRAWER (STAYS BELOW NAVBAR) --- */}
            {/* 1. Backdrop: เริ่มที่ top-[80px] */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 40, top: '80px' }}
                onClick={() => setIsOpen(false)}
            />

            {/* 2. Side Drawer: เริ่มที่ top-[80px] และสูงที่เหลือของจอ */}
            <div
                className={`fixed right-0 h-[calc(100vh-80px)] w-full sm:w-[320px] bg-white shadow-2xl transform transition-transform duration-500 ease-out lg:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ zIndex: 50, top: '80px' }}
            >
                <div className="h-1 w-full bg-brand" />
                <div className="flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="px-8 pb-4 lg:hidden">
                            <LocaleSwitcher className="flex" />
                        </div>
                        <ul className="flex flex-col">
                            {visibleNavItems.map((item) => {
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
                                                    {translateMenuLabel(
                                                        messages,
                                                        item.title,
                                                    )}
                                                </div>
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${
                                                        isExpanded
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>

                                            {isExpanded && (
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
                                                                        setIsOpen(
                                                                            false,
                                                                        );
                                                                        setExpandedMobileMenu(
                                                                            null,
                                                                        );
                                                                    }}
                                                                >
                                                                    {translateMenuLabel(
                                                                        messages,
                                                                        child.title,
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                }

                                if (!item.href) {
                                    return null;
                                }

                                return (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center justify-between px-8 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <ChevronLeft className="h-4 w-4 opacity-20" />
                                                {translateMenuLabel(
                                                    messages,
                                                    item.title,
                                                )}
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
                                            {user.role ||
                                                messages.header.noRoleAssigned}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded font-bold text-sm"
                                    onClick={() => {
                                        setIsOpen(false);
                                        signOut({ callbackUrl: '/login' });
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />{' '}
                                    {messages.header.logout}
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#333] text-white rounded font-bold text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-4 w-4" />{' '}
                                {messages.header.accountLogin}
                            </Link>
                        )}
                        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
                            {messages.header.mobileTagline}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
