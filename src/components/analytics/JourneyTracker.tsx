"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics/journey";

export function JourneyTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastPathRef = useRef<string | null>(null);

    useEffect(() => {
        const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        // Allow re-tracking if params change significantly, but basic debounce on path string
        if (lastPathRef.current === fullPath) return;
        lastPathRef.current = fullPath;

        let pageType = 'other';
        let category = undefined;
        let slug = undefined;

        if (pathname === '/') {
            pageType = 'home';
        } else if (pathname === '/calculator') {
            pageType = 'calculator';
            track('calculator_view', { pageType });
        } else if (pathname.startsWith('/admin')) {
            pageType = 'admin';
        } else if (pathname.startsWith('/') && pathname.split('/').length === 3) {
            const parts = pathname.split('/');
            category = parts[1];
            slug = parts[2];
            pageType = 'article';
            if (category && slug) {
                track('article_view', { category, slug, pageType });
            }
        } else if (pathname.startsWith('/') && pathname.split('/').length === 2 && pathname !== '/') {
            category = pathname.substring(1);
            pageType = 'category';
            track('category_view', { category, pageType });
        }

        // Always track generic page_view with detailed metadata
        track('page_view', {
            pageType,
            category: category || null,
            slug: slug || null,
            path: pathname
        });

    }, [pathname, searchParams]);

    return null;
}
