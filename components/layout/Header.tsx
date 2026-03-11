'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '../../public/logo.svg';
import type { MenuItem } from '@/lib/menu';
import { useUserMenu } from '@/lib/use-user-menu';
import { DesktopNav } from '@/components/layout/header/DesktopNav';
import { MobileNavDrawer } from '@/components/layout/header/MobileNavDrawer';

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
    const [showUserMenu, setShowUserMenu] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
        null,
    );
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isLoggedIn = !!session?.user;
    const isSessionLoading = status === 'loading';
    const userGroupId = session?.user?.groupId;
    const { navItems, isMenuLoading, menuError, retryLoadMenu } = useUserMenu(
        isLoggedIn,
        isSessionLoading,
        userGroupId,
    );
    const visibleNavItems = getVisibleNavItems(navItems, isLoggedIn);
    const showEmptyMenu =
        isLoggedIn &&
        !isMenuLoading &&
        !menuError &&
        visibleNavItems.length === 0;

    // ข้อมูล user จาก session (มี role, department จาก JWT callback)
    const user = session?.user
        ? {
              name: session.user.name ?? '',
              role: session.user.role ?? '',
              department: session.user.department ?? '',
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

    return (
        <header
            className={`w-full h-21 fixed top-0 left-0 z-60 transition-transform duration-500 ease-in-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="max-w-300 mx-auto px-4 flex h-20 items-center justify-between bg-white shadow-sm">
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
                <DesktopNav
                    items={visibleNavItems}
                    isMenuLoading={isMenuLoading}
                    isLoggedIn={isLoggedIn}
                    menuError={menuError}
                    showEmptyMenu={showEmptyMenu}
                    onRetry={retryLoadMenu}
                />

                {/* Tools Section — เปลี่ยนตามสถานะ login */}
                <div className="flex items-center gap-1 shrink-0">
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
                                                {user.role} · {user.department}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
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
                                                Logout
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
                            <span className="hidden sm:block">Login</span>
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

            <MobileNavDrawer
                items={visibleNavItems}
                isMenuLoading={isMenuLoading}
                isLoggedIn={isLoggedIn}
                menuError={menuError}
                showEmptyMenu={showEmptyMenu}
                onRetry={retryLoadMenu}
                isOpen={isOpen}
                expandedMobileMenu={expandedMobileMenu}
                setExpandedMobileMenu={setExpandedMobileMenu}
                onClose={() => setIsOpen(false)}
                user={user}
                onLogout={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/login' });
                }}
            />
        </header>
    );
}
