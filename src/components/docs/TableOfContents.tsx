"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TocItem {
    title: string;
    url: string;
    items?: TocItem[];
}

export function TableOfContents() {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll("h2, h3"));
        const headings: TocItem[] = [];

        elements.forEach((elem) => {
            // Ensure element has an ID
            if (!elem.id) {
                const slug = elem.textContent
                    ?.toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_-]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                if (slug) elem.id = slug;
            }

            if (elem.id) {
                headings.push({
                    title: elem.textContent || "",
                    url: `#${elem.id}`,
                });
            }
        });

        setItems(headings);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (!items.length) {
        return null;
    }

    return (
        <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground mb-4">On This Page</p>
            <ul className="space-y-2 text-sm">
                {items.map((item) => (
                    <li key={item.url}>
                        <a
                            href={item.url}
                            className={cn(
                                "block py-1 transition-colors hover:text-foreground border-l-2 pl-3 -ml-px",
                                item.url === `#${activeId}`
                                    ? "border-primary text-foreground font-medium"
                                    : "border-transparent text-muted-foreground"
                            )}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
