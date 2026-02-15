import Link from 'next/link';
import { ArrowRight, FileText, Calculator } from 'lucide-react';

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
/*                           2. Blueprint Upgrade Block                       */
/* -------------------------------------------------------------------------- */

export function BlueprintUpgradeCTA() {
    return (
        <div className="my-12 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Want the Printable Version?</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Get a complete, engineering-grade report to hand to your installer.
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span> Avoid being oversold on capacity you don't need
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span> Get specific brand recommendations for your climate
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span> Return on Investment (ROI) calculations included
                </li>
            </ul>
            <Link href="/blueprint">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto">
                    Download Design Blueprint <ArrowRight className="w-5 h-5" />
                </button>
            </Link>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                        3. End-of-Article Next Step                         */
/* -------------------------------------------------------------------------- */

export function NextStepsCTA({ category }: { category: string }) {
    return (
        <div className="py-12 border-t border-border/50">
            <h3 className="text-center text-xl font-bold mb-8 uppercase tracking-widest text-muted-foreground">Your Next Step</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/calculator" className="group">
                    <div className="h-full p-6 border border-border rounded-xl hover:border-primary/50 transition-colors bg-card hover:shadow-md text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-2">Build Your System</h4>
                        <p className="text-sm text-muted-foreground">Get exact battery sizing numbers.</p>
                    </div>
                </Link>

                <Link href="/blueprint" className="group">
                    <div className="h-full p-6 border border-border rounded-xl hover:border-secondary/50 transition-colors bg-card hover:shadow-md text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-2">Get the Blueprint</h4>
                        <p className="text-sm text-muted-foreground">Download the PDF report.</p>
                    </div>
                </Link>

                <Link href={`/${category}`} className="group">
                    <div className="h-full p-6 border border-border rounded-xl hover:border-muted-foreground/50 transition-colors bg-card hover:shadow-md text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                            <ArrowRight className="w-6 h-6" />
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
