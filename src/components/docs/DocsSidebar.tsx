import { CONTENT_CATEGORIES, getArticlesByCategory } from "@/lib/content/mdx";
import { DocsSidebarNav } from "./DocsSidebarNav";
import { MobileDocsNav } from "./MobileDocsNav";
import { Search } from "lucide-react";

// Helper to format category names (e.g., "how-to" -> "How To")
function formatCategoryTitle(category: string) {
    return category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export async function DocsSidebar() {
    const categories = CONTENT_CATEGORIES;

    const groups = categories.map((category) => {
        const articles = getArticlesByCategory(category);
        return {
            title: formatCategoryTitle(category),
            items: articles.map((article) => ({
                title: article.title,
                href: `/${category}/${article.slug}`,
            })).concat([
                { title: "Overview", href: `/${category}` }
            ]).sort((a, b) => {
                if (a.title === "Overview") return -1;
                if (b.title === "Overview") return 1;
                return 0;
            })
        };
    });

    return (
        <>
            {/* Mobile Trigger - visible only on small screens */}
            <div className="md:hidden border-b p-4 mb-4 bg-background">
                <MobileDocsNav groups={groups} />
            </div>

            {/* Desktop Sidebar - Premium Dark Style */}
            <aside className="docs-sidebar hidden md:block">
                {/* Search Input */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search docs..."
                        className="docs-sidebar-search pl-10"
                        readOnly
                    />
                </div>

                {/* Navigation */}
                <div className="space-y-6">
                    <DocsSidebarNav groups={groups} />
                </div>
            </aside>
        </>
    );
}
