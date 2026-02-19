import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 px-6 border-t border-border/50 bg-muted/20">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-bold text-primary">BatteryBlueprint</div>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Engineering-grade solar battery calculations without the sales fluff.
                            </p>
                        </div>
                    </div>

                    {/* Tools Column */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-foreground">Tools</h4>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="/calculator" className="hover:text-primary transition-colors">Calculator</Link>
                            <Link href="/guide" className="hover:text-primary transition-colors flex items-center gap-2">
                                Energy Hub <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">New</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-foreground">Company</h4>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                            <Link href="/editorial-team" className="hover:text-primary transition-colors">Editorial Team</Link>
                            <Link href="/editorial-policy" className="hover:text-primary transition-colors">Editorial Policy</Link>
                            <Link href="/methodology" className="hover:text-primary transition-colors">Methodology</Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        </nav>
                    </div>

                    {/* Contact/Legal Column */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-foreground">Connect</h4>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <a href="mailto:support@batteryblueprint.com" className="hover:text-primary transition-colors">
                                support@batteryblueprint.com
                            </a>
                            <div className="pt-4 text-xs text-muted-foreground/60">
                                Built for engineers, by engineers.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Disclaimer */}
                <div className="mt-12 pt-8 border-t border-border/50 text-center">
                    <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-4xl mx-auto">
                        &copy; {currentYear} BatteryBlueprint. For planning purposes only. Not professional engineering advice.<br />
                        All results are estimates only. Consult a licensed electrician or solar installer before purchasing or installing any equipment. BatteryBlueprint may display ads and affiliate links — see our <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-primary">Terms</Link>.
                    </p>
                </div>
            </div>
        </footer>
    );
}
