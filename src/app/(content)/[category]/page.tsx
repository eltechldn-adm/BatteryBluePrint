import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    getArticlesByCategory,
    CONTENT_CATEGORIES,
    isSupportedCategory,
    type ContentCategory,
} from '@/lib/content/mdx';
import { Button } from '@/components/ui/button';
import { Calculator, BookOpen, Search } from 'lucide-react';
import { GlobalUsersNotice } from '@/components/content/GlobalUsersNotice';

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    return CONTENT_CATEGORIES.map((category) => ({
        category,
    }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { category } = await params;

    if (!isSupportedCategory(category)) {
        return {};
    }

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${categoryTitle} Articles | BatteryBlueprint`,
        description: `Learn about battery ${category} with our comprehensive guides and articles.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;

    if (!isSupportedCategory(category)) {
        notFound();
    }

    const articles = getArticlesByCategory(category as ContentCategory);
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">{categoryTitle} Articles</h1>
                <p className="text-xl text-muted-foreground max-w-[85%]">
                    Explore our collection of guides and resources about battery {category}.
                </p>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-12 px-6 rounded-xl border border-dashed bg-muted/30">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-6">We're working on guides for this section.</p>
                    <Link href="/calculator">
                        <Button>Use Calculator</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/${article.category}/${article.slug}`}
                            className="block group"
                        >
                            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {article.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {article.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
