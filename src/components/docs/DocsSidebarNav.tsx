"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
    title: string;
    href: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

export function DocsSidebarNav({ groups }: { groups: NavGroup[] }) {
    const pathname = usePathname();

    return (
        <nav className="w-full" aria-label="Docs Navigation">
            {groups.map((group) => (
                <div key={group.title} className="docs-sidebar-section">
                    <h4 className="docs-sidebar-section-title">
                        {group.title}
                    </h4>
                    <div className="space-y-0.5">
                        {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "docs-sidebar-link",
                                        isActive && "docs-sidebar-link-active"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
