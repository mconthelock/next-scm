'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Tickets } from './columns';
interface UseTicketsResult {
    data: Tickets[];
    isLoading: boolean;
    loadError: string | null;
    retryLoadTickets: () => Promise<void>;
}

export function useTickets(): UseTicketsResult {
    const [data, setData] = useState<Tickets[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    const loadTickets = useCallback(async () => {
        if (!isMountedRef.current) {
            return;
        }

        setIsLoading(true);
        setLoadError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tickets`,
                {
                    cache: 'no-store',
                },
            );

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const users = (await response.json()) as Tickets[];

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
        void loadTickets();
        return () => {
            isMountedRef.current = false;
        };
    }, [loadTickets]);

    return {
        data,
        isLoading,
        loadError,
        retryLoadTickets: loadTickets,
    };
}
