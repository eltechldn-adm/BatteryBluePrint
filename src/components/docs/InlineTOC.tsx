"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TocItem {
    title: string;
    url: string;
    level: number;
}

export function InlineTOC() {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [isExpanded, setIsExpanded] = useState(true);

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
                    level: parseInt(elem.tagName.substring(1)),
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
        <div className="inline-toc">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full inline-toc-title cursor-pointer hover:text-primary transition-colors"
            >
                <span>On This Page</span>
                <span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
            </button>

            <ul className={cn("inline-toc-list", !isExpanded && "hidden")}>
                {items.map((item) => (
                    <li key={item.url} className="inline-toc-item" style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}>
                        <a
                            href={item.url}
                            className={cn(
                                "inline-toc-link text-sm",
                                item.url === `#${activeId}` && "active"
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
