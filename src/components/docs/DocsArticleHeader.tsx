import Link from "next/link";
import { ChevronRight, Calendar, Clock } from "lucide-react";
import { type ArticleMetadata } from "@/lib/content/mdx";

interface DocsArticleHeaderProps {
    metadata: ArticleMetadata;
}

export function DocsArticleHeader({ metadata }: DocsArticleHeaderProps) {
    const categoryTitle =
        metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1);

    return (
        <div className="space-y-4 pb-6 mb-8">
            {/* Breadcrumbs - smaller and subtle */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">
                    Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/${metadata.category}`} className="hover:text-primary transition-colors">
                    {categoryTitle}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-foreground truncate max-w-[200px]">{metadata.title}</span>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                    {metadata.title}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                    {metadata.description}
                </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30 mt-4">
                <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground/70">By</span>
                    <span>BatteryBlueprint Editorial</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={metadata.updated}>
                        Updated {new Date(metadata.updated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </div>
                {metadata.readingMinutes && (
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{metadata.readingMinutes} min read</span>
                    </div>
                )}
            </div>
        </div>
    );
}
