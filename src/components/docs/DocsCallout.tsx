import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsCalloutProps {
    title: string;
    description: string;
    href: string;
    ctaText: string;
    icon?: "calculator" | "blueprint";
    variant?: "default" | "outline";
}

export function DocsCallout({
    title,
    description,
    href,
    ctaText,
    icon = "calculator",
    variant = "default",
}: DocsCalloutProps) {
    const Icon = icon === "calculator" ? Calculator : FileText;

    return (
        <div className="my-8 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground pt-2">{description}</p>
            </div>
            <div className="p-6 pt-0">
                <Link href={href}>
                    <Button variant={variant} size="sm" className="w-full sm:w-auto">
                        {ctaText}
                        {variant === "default" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
