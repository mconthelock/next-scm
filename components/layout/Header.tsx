'use client';
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
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
interface UserProfile {
    name: string;
    role: string;
    department: string;
}

interface NavItem {
    title: string;
    href: string;
}

const mockUser: UserProfile = {
    name: 'Somsak Mitsubishi',
    role: 'Administrator',
    department: 'SCM Department',
};
const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Inventory', href: '/inventory' },
    { title: 'Logistics', href: '/logistics' },
    { title: 'Analytics', href: '/analytics' },
    { title: 'Users', href: '/users' },
    { title: 'Settings', href: '/settings' },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // ถ้าเลื่อนลงมากกว่า 80px ให้เริ่มซ่อน
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            } else {
                // ถ้าเลื่อนขึ้น ให้โชว์ทันที
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // ป้องกันการ Scroll เมื่อเปิดเมนู Drawer
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <header
            className={`w-full bg-white border-b border-slate-200 fixed top-0 left-0 z-50 transition-transform duration-500 ease-in-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* Red Brand Bar */}
            <div className="h-0.75 w-full bg-[#E60012]" />

            <div className="max-w-7xl mx-auto px-4 flex h-20 items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-[#E60012] flex items-center justify-center text-white font-bold">
                        M
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tighter leading-none">
                            MITSUBISHI ELECTRIC
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                            Thailand
                        </span>
                    </div>
                </div>

                {/* Navigation Menu (Desktop) */}
                <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
                    <ul className="flex items-center gap-8">
                        {mainNavItems.map((item) => (
                            <li key={item.title}>
                                <a
                                    href={item.href}
                                    className="text-[13px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#E60012] transition-colors relative group py-2"
                                >
                                    {item.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E60012] transition-all group-hover:w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right Tools */}
                <div className="flex items-center gap-1 shrink-0">
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-600">
                        <Search className="h-5 w-5" />
                    </button>
                    <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md text-slate-600 font-bold text-sm">
                        <User className="h-5 w-5" />
                        <span className="hidden sm:block">Login</span>
                    </button>

                    {/* Hamburger Icon */}
                    <button
                        className="lg:hidden p-2 text-slate-700"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* --- MOBILE SIDE DRAWER --- */}
            <div
                className={`fixed inset-0 bg-black/60 transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 100 }}
                onClick={() => setIsOpen(false)}
            />

            <div
                className={`fixed top-0 right-0 h-full w-75 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out lg:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ zIndex: 101 }}
            >
                <div className="h-1 w-full bg-[#E60012]" />

                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-full"
                        >
                            <X className="h-6 w-6 text-slate-500" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[10px] tracking-tighter text-right">
                                MITSUBISHI
                                <br />
                                ELECTRIC
                            </span>
                            <div className="w-8 h-8 bg-[#E60012] flex items-center justify-center text-white font-bold text-xs">
                                M
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="flex flex-col">
                            {mainNavItems.map((item) => (
                                <li key={item.title}>
                                    <a
                                        href={item.href}
                                        className="flex items-center justify-between px-8 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#E60012] transition-colors"
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
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#333] text-white rounded font-bold text-sm">
                            <User className="h-4 w-4" /> Account Login
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
                            Changes for the Better
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
