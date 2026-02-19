"use client";

import Link from "next/link";
import { ArrowRight, Calculator, List } from "lucide-react";
import { track } from "@/lib/analytics/journey";
import { Button } from "@/components/ui/button";

interface ArticleNextActionProps {
    category: string;
    slug: string;
}

export function ArticleNextAction({ category, slug }: ArticleNextActionProps) {

    const handleTrack = (cta: string) => {
        track('cta_click', {
            location: 'article_footer',
            cta,
            articleSlug: slug,
            category
        });
    };

    return (
        <div className="mt-16 py-12 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to plan your system?</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                Stop guessing. Use our engineering-grade calculator to find the exact battery size you need for your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/calculator" onClick={() => handleTrack('calculator')}>
                    <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                        <Calculator className="w-5 h-5 mr-2" />
                        Run Calculator
                    </Button>
                </Link>

                <Link href={`/${category}`} onClick={() => handleTrack('category_hub')}>
                    <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                        <List className="w-5 h-5 mr-2" />
                        More {category} Guides
                    </Button>
                </Link>
            </div>
        </div>
    );
}
