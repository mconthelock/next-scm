function DesktopMenuSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <li key={`desktop-skeleton-${index}`}>
                    <span
                        className="block h-4 rounded bg-slate-200/80 animate-pulse"
                        style={{ width: `${64 + index * 12}px` }}
                    />
                </li>
            ))}
        </>
    );
}

function MobileMenuSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <li key={`mobile-skeleton-${index}`} className="px-8 py-4">
                    <span
                        className="block h-4 rounded bg-slate-200/80 animate-pulse"
                        style={{ width: `${160 + (index % 2) * 36}px` }}
                    />
                </li>
            ))}
        </>
    );
}

export { DesktopMenuSkeleton, MobileMenuSkeleton };
