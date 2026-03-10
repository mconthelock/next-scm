'use client';
import Image from 'next/image';
import {
    Search,
    Globe,
    Menu,
    X,
    User,
    ChevronRight,
    LayoutDashboard,
    Package,
    Truck,
    BarChart3,
    Users,
    Settings,
    ChevronLeft,
    LogOut,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '../../public/logo.svg';

/** รายการเมนู */
interface NavItem {
    title: string;
    href: string;
    /** true = ต้อง login ถึงจะเห็น, false = เห็นตอนยังไม่ login, undefined = เห็นทุกสถานะ */
    requireAuth?: boolean;
}

/**
 * เมนูทั้งหมด — ใช้ requireAuth แบ่งว่าเห็นตอนไหน
 * - requireAuth: true  → เห็นเฉพาะตอน login แล้ว
 * - requireAuth: false → เห็นเฉพาะตอนยังไม่ login
 * - ไม่ใส่ (undefined)  → เห็นทุกสถานะ
 */
const allNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', requireAuth: true },
    { title: 'Inventory', href: '/inventory', requireAuth: true },
    { title: 'Logistics', href: '/logistics', requireAuth: true },
    { title: 'Analytics', href: '/analytics', requireAuth: true },
    { title: 'Users', href: '/users', requireAuth: true },
    { title: 'Settings', href: '/settings', requireAuth: true },
    // ตัวอย่างเมนูที่เห็นตอนยังไม่ login
    // { title: 'About', href: '/about', requireAuth: false },
    // ตัวอย่างเมนูที่เห็นทุกสถานะ
    // { title: 'Home', href: '/' },
];

/** กรองเมนูตามสถานะ login */
function getVisibleNavItems(isLoggedIn: boolean): NavItem[] {
    return allNavItems.filter(
        (item) =>
            item.requireAuth === undefined || item.requireAuth === isLoggedIn,
    );
}

export function Header() {
    // ดึง session จาก NextAuth — ได้ข้อมูล user + สถานะ login
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isLoggedIn = !!session?.user;
    const visibleNavItems = getVisibleNavItems(isLoggedIn);

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
                    <div className="h-14 w-px bg-slate-400 mx-1 hidden md:block" />
                    <div className="flex flex-col font-bold text-xs tracking-tighter leading-tight">
                        <span>MITSUBISHI</span>
                        <span>ELEVATOR ASIA CO.,LTD</span>
                    </div>
                </div>

                {/* Desktop Nav — แสดงเฉพาะเมนูที่ตรงตามสถานะ login */}
                <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
                    <ul className="flex items-center gap-8">
                        {visibleNavItems.map((item) => (
                            <li key={item.title}>
                                <a
                                    href={item.href}
                                    className="text-[13px] font-bold uppercase tracking-wide text-slate-700 hover:text-brand transition-colors relative group py-2"
                                >
                                    {item.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

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
                                <span className="hidden sm:block max-w-[120px] truncate">
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
                                        <a
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </a>
                                        <a
                                            href="/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </a>
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
                        <a
                            href="/login"
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md text-slate-600 font-bold text-sm"
                        >
                            <User className="h-5 w-5" />
                            <span className="hidden sm:block">Login</span>
                        </a>
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
                        <ul className="flex flex-col">
                            {visibleNavItems.map((item) => (
                                <li key={item.title}>
                                    <a
                                        href={item.href}
                                        className="flex items-center justify-between px-8 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChevronLeft className="h-4 w-4 opacity-20" />
                                            {item.title}
                                        </div>
                                    </a>
                                </li>
                            ))}
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
                                    onClick={() => {
                                        setIsOpen(false);
                                        signOut({ callbackUrl: '/login' });
                                    }}
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <a
                                href="/login"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#333] text-white rounded font-bold text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-4 w-4" /> Account Login
                            </a>
                        )}
                        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
                            Changes for the Better
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
