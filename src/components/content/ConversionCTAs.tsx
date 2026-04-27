import Link from 'next/link';
import { ArrowRight, Calculator, BookOpen, CheckCircle, TrendingUp, AlertTriangle, DollarSign, HelpCircle } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                          1. Contextual In-Article CTA                      */
/* -------------------------------------------------------------------------- */

export function ContextualInArticleCTA({ category }: { category: string }) {
    let text = "Size your system correctly";
    if (category === 'sizing') text = "Run the calculator with your real numbers";
    if (category === 'cost') text = "Estimate your savings properly";
    if (category === 'comparisons') text = "Compare options with your actual load";

    return (
        <div className="my-10 p-6 bg-secondary/10 border-l-4 border-secondary rounded-r-lg">
            <h4 className="font-bold text-lg mb-2 text-foreground">Stop guessing.</h4>
            <p className="text-muted-foreground mb-4">{text}</p>
            <Link href="/calculator">
                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
                    Use Calculator <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                        2. Decision Guide Strip                              */
/* -------------------------------------------------------------------------- */

export function DecisionGuideCTA() {
    const guides = [
        {
            href: '/worth-it',
            icon: CheckCircle,
            label: 'Is It Worth It?',
            desc: 'Financial verdict for 2026',
        },
        {
            href: '/hidden-costs',
            icon: DollarSign,
            label: 'Hidden Costs',
            desc: 'What installers don\'t mention',
        },
        {
            href: '/payback-reality',
            icon: TrendingUp,
            label: 'Payback Reality',
            desc: 'UK vs US vs Global',
        },
        {
            href: '/common-mistakes',
            icon: AlertTriangle,
            label: 'Common Mistakes',
            desc: 'Avoid costly errors',
        },
        {
            href: '/when-not-to-buy',
            icon: HelpCircle,
            label: 'When NOT to Buy',
            desc: '5 conditions for skipping',
        },
        {
            href: '/choose-battery',
            icon: BookOpen,
            label: 'Choose a Battery',
            desc: 'Decision guide by use case',
        },
    ];

    return (
        <div className="my-12 p-6 rounded-2xl border border-border/60 bg-muted/20">
            <h3 className="font-bold text-lg mb-1 text-foreground">Before You Buy: Decision Guides</h3>
            <p className="text-sm text-muted-foreground mb-5">
                Independent engineering guidance to help you make the right call.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {guides.map(({ href, icon: Icon, label, desc }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group flex flex-col gap-1 p-3 rounded-xl border border-border/50 bg-background hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                        3. End-of-Article Next Step                         */
/* -------------------------------------------------------------------------- */

export function NextStepsCTA({ category }: { category: string }) {
    // Category-specific decision page recommendations
    const categoryDecision: Record<string, { href: string; label: string }> = {
        cost: { href: '/worth-it', label: 'Is It Worth It in 2026?' },
        sizing: { href: '/choose-battery', label: 'How to Choose a Battery' },
        comparisons: { href: '/choose-battery', label: 'Battery Decision Guide' },
        incentives: { href: '/hidden-costs', label: 'Hidden Costs to Know' },
        markets: { href: '/payback-reality', label: 'Payback Reality by Market' },
        future: { href: '/when-not-to-buy', label: 'When NOT to Buy' },
        'how-to': { href: '/common-mistakes', label: 'Common Mistakes to Avoid' },
        basics: { href: '/worth-it', label: 'Is Storage Worth It?' },
    };

    const decision = categoryDecision[category] || { href: '/worth-it', label: 'Is It Worth It in 2026?' };

    return (
        <div className="py-12 border-t border-border/50">
            <h3 className="text-center text-xl font-bold mb-8 uppercase tracking-widest text-muted-foreground">Your Next Step</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/calculator" className="group">
                    <div className="h-full p-6 border border-border rounded-xl hover:border-primary/50 transition-colors bg-card hover:shadow-md text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Calculator className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-2">Size Your System</h4>
                        <p className="text-sm text-muted-foreground">Get exact battery sizing numbers.</p>
                    </div>
                </Link>

                <Link href={decision.href} className="group">
                    <div className="h-full p-6 border border-border rounded-xl hover:border-secondary/50 transition-colors bg-card hover:shadow-md text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-2">{decision.label}</h4>
                        <p className="text-sm text-muted-foreground">Independent decision guide.</p>
                    </div>
                </Link>

                <Link href={`/${category}`} className="group">
                    <div className="h-full p-6 border border-border rounded-xl hover:border-muted-foreground/50 transition-colors bg-card hover:shadow-md text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-2">Explore Category</h4>
                        <p className="text-sm text-muted-foreground">Read more about {category}.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                         4. Guide Reinforcement CTA                         */
/* -------------------------------------------------------------------------- */

export function GuideReinforcementCTA() {
    return (
        <div className="my-16 text-center">
            <div className="inline-block p-6 bg-background border border-border rounded-xl shadow-sm max-w-2xl">
                <h4 className="text-lg font-bold mb-2">Done reading? Start building.</h4>
                <p className="text-muted-foreground mb-4">
                    The theory is great, but your home is unique. Run the numbers to see what you actually need.
                </p>
                <Link href="/calculator">
                    <button className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                        Go to Calculator <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                        5. BlueprintUpgradeCTA (kept for back-compat)       */
/* -------------------------------------------------------------------------- */

export function BlueprintUpgradeCTA() {
    return (
        <div className="my-12 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Size Your System?</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Use our engineering-grade calculator to get exact battery recommendations based on your load, location, and autonomy requirements.
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span> Engineering-grade sizing with DoD and efficiency factors
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span> Brand recommendations matched to your region
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span> Adjust autonomy days, winter mode, and assumptions
                </li>
            </ul>
            <Link href="/calculator">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto">
                    Open Calculator <ArrowRight className="w-5 h-5" />
                </button>
            </Link>
        </div>
    );
}
