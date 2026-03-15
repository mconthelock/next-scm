'use client';

import { useEffect, useState } from 'react';

import {
    publicNavItems,
    type MenuErrorResponse,
    type MenuItem,
    type MenuResponse,
} from '@/lib/menu';

/** ค่าที่ custom hook ส่งกลับให้ Header ใช้แสดงผลเมนู */
interface UseUserMenuResult {
    navItems: MenuItem[];
    isMenuLoading: boolean;
    menuError: string | null;
    retryLoadMenu: () => void;
}

export function useUserMenu(
    isLoggedIn: boolean,
    isSessionLoading: boolean,
    locale: string,
    groupId?: number,
): UseUserMenuResult {
    const [navItems, setNavItems] = useState<MenuItem[]>(publicNavItems);
    const [isMenuLoading, setIsMenuLoading] = useState(false);
    const [menuError, setMenuError] = useState<string | null>(null);
    const [menuRetryKey, setMenuRetryKey] = useState(0);

    function retryLoadMenu() {
        setMenuRetryKey((currentValue) => currentValue + 1);
    }

    useEffect(() => {
        let isCancelled = false;

        async function loadMenu() {
            if (isSessionLoading) {
                return;
            }

            if (!isLoggedIn) {
                setNavItems(publicNavItems);
                setIsMenuLoading(false);
                setMenuError(null);
                return;
            }

            if (!groupId) {
                setNavItems([]);
                setIsMenuLoading(false);
                setMenuError('This account has no menu group assigned.');
                return;
            }

            try {
                setIsMenuLoading(true);
                setMenuError(null);

                const searchParams = new URLSearchParams({ locale });
                const response = await fetch(
                    `/api/menu/me?${searchParams.toString()}`,
                    {
                        cache: 'no-store',
                    },
                );
                const payload = (await response.json().catch(() => null)) as
                    | MenuResponse
                    | MenuErrorResponse
                    | null;

                if (!response.ok) {
                    throw new Error(
                        (payload as MenuErrorResponse | null)?.message ??
                            'Unable to load menu',
                    );
                }

                const data = payload as MenuResponse;

                if (!isCancelled) {
                    setNavItems(data.menu);
                }
            } catch (error) {
                console.error('Failed to load navigation menu', error);

                if (!isCancelled) {
                    setNavItems([]);
                    setMenuError(
                        error instanceof Error
                            ? error.message
                            : 'Unable to load menu',
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsMenuLoading(false);
                }
            }
        }

        void loadMenu();

        return () => {
            isCancelled = true;
        };
    }, [groupId, isLoggedIn, isSessionLoading, locale, menuRetryKey]);

    return {
        navItems,
        isMenuLoading,
        menuError,
        retryLoadMenu,
    };
}
