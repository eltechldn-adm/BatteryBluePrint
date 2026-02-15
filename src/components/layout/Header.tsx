"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Menu,
    X,
    ChevronDown,
    BookOpen,
    Calculator as CalcIcon,
    DollarSign,
    GitCompare,
    Wrench,
    Gift,
    Sparkles,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Calculator", href: "/calculator" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const HUB_ITEMS = [
    { label: "Basics", href: "/basics", icon: BookOpen, desc: "Core concepts" },
    { label: "Sizing", href: "/sizing", icon: CalcIcon, desc: "Calculations" },
    { label: "Cost", href: "/cost", icon: DollarSign, desc: "Pricing & ROI" },
    { label: "Comparisons", href: "/comparisons", icon: GitCompare, desc: "Tech battles" },
    { label: "How-To", href: "/how-to", icon: Wrench, desc: "Guides" },
    { label: "Incentives", href: "/incentives", icon: Gift, desc: "Tax credits" },
    { label: "Future", href: "/future", icon: Sparkles, desc: "Trends" },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hubDropdownOpen, setHubDropdownOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-border/50 py-3"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-primary tracking-tight z-50 relative">
                    BatteryBlueprint
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/calculator"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Calculator
                    </Link>

                    {/* Energy Hub Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setHubDropdownOpen(true)}
                        onMouseLeave={() => setHubDropdownOpen(false)}
                    >
                        <button
                            className={cn(
                                "flex items-center gap-1 text-sm font-medium transition-colors py-2",
                                hubDropdownOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Energy Hub
                            <ChevronDown
                                className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    hubDropdownOpen ? "rotate-180" : ""
                                )}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            className={cn(
                                "absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] transition-all duration-200 ease-in-out",
                                hubDropdownOpen
                                    ? "opacity-100 translate-y-0 visible"
                                    : "opacity-0 translate-y-2 invisible"
                            )}
                        >
                            <div className="bg-popover border border-border/50 rounded-2xl shadow-xl p-6 grid grid-cols-2 gap-4">
                                <div className="col-span-2 mb-2 pb-4 border-b border-border/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary" /> Energy Hub
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Engineering-grade guides & resources</p>
                                    </div>
                                    <Link href="/guide" className="text-xs font-medium text-primary hover:underline">
                                        View All Guides →
                                    </Link>
                                </div>

                                {HUB_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group/item"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.desc}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>
                </nav>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/calculator">
                        <Button size="sm" className="btn-premium shadow-sm">
                            Start Sizing
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden z-50 relative p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6 text-foreground" />
                    ) : (
                        <Menu className="w-6 h-6 text-foreground" />
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                <div
                    className={cn(
                        "fixed inset-0 bg-background/98 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 md:hidden transition-all duration-300 ease-in-out",
                        mobileMenuOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-full pointer-events-none"
                    )}
                >
                    <nav className="flex flex-col gap-6">
                        <Link
                            href="/calculator"
                            className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Calculator
                        </Link>

                        <div className="space-y-4 py-2 border-b border-border/50">
                            <div className="text-lg font-medium text-muted-foreground">
                                Energy Hub
                            </div>
                            <div className="grid grid-cols-2 gap-3 pl-2">
                                {HUB_ITEMS.map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-2 text-sm text-foreground/80 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="w-4 h-4 text-primary" />
                                        {item.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/guide"
                                    className="col-span-2 text-sm font-medium text-primary mt-2 flex items-center gap-1"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    View All Guides <ChevronDown className="w-3 h-3 -rotate-90" />
                                </Link>
                            </div>
                        </div>

                        <Link
                            href="/about"
                            className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        <Link href="/calculator" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full btn-premium py-6 text-lg">
                                Start Sizing Now
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
