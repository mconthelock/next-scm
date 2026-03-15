'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Logs } from './columns';
interface UseLogsResult {
    data: Logs[];
    isLoading: boolean;
    loadError: string | null;
    retryLoadLogs: () => Promise<void>;
}

export function useLogs(): UseLogsResult {
    const [data, setData] = useState<Logs[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    const loadLogs = useCallback(async () => {
        if (!isMountedRef.current) {
            return;
        }

        setIsLoading(true);
        setLoadError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/logs`,
                {
                    cache: 'no-store',
                },
            );

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const users = (await response.json()) as Logs[];

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
        void loadLogs();

        return () => {
            isMountedRef.current = false;
        };
    }, [loadLogs]);

    return {
        data,
        isLoading,
        loadError,
        retryLoadLogs: loadLogs,
    };
}
