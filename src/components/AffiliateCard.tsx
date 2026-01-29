import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink, ShoppingCart } from "lucide-react";

interface ProductProps {
    name: string;
    description: string;
    specs: string;
    url: string;
}

export function AffiliateCard({ name, description, specs, url }: ProductProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/40 group">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {name}
                    </CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed pt-2">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4 pt-0">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50">
                    {specs}
                </div>

                <a
                    href={url}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="block w-full"
                >
                    <Button
                        className="w-full gap-2 font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                        size="lg"
                    >
                        View on Amazon
                        <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                    </Button>
                </a>
            </CardContent>
        </Card>
    );
}
