/**
 * /session — legacy redirect page.
 *
 * The My Projects / Session dashboard has been removed.
 * This page exists solely to cleanly redirect any cached URLs or
 * bookmarks that still point to /session, avoiding a 404 or a
 * [category] route-match error on static export.
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/calculator");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center text-muted-foreground text-sm">
            Redirecting…
        </div>
    );
}
