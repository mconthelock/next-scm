'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Users } from './columns';

/** ค่าที่ hook ส่งกลับไปให้หน้า users ใช้แสดงผล */
interface UseUsersResult {
    data: Users[];
    isLoading: boolean;
    loadError: string | null;
    retryLoadUsers: () => Promise<void>;
}

export function useUsers(): UseUsersResult {
    const [data, setData] = useState<Users[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    const loadUsers = useCallback(async () => {
        if (!isMountedRef.current) {
            return;
        }

        setIsLoading(true);
        setLoadError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/users`,
                {
                    cache: 'no-store',
                },
            );

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const users = (await response.json()) as Users[];

            if (isMountedRef.current) {
                setData(users);
            }
        } catch (error) {
            console.error('Failed to load users', error);

            if (isMountedRef.current) {
                setData([]);
                setLoadError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to load users data.',
                );
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        void loadUsers();

        return () => {
            isMountedRef.current = false;
        };
    }, [loadUsers]);

    return {
        data,
        isLoading,
        loadError,
        retryLoadUsers: loadUsers,
    };
}
