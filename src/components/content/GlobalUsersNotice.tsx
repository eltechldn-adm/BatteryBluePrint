import Link from 'next/link';
import { Globe, ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function GlobalUsersNotice() {
    return (
        <Card className="bg-muted/30 border-dashed border-border mb-8 overflow-hidden relative">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <Globe className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div>
                            <h4 className="font-semibold text-foreground text-lg mb-1">
                                Not in the UK or US?
                            </h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Most of our cost and incentive data is tailored for these regions, but the physics of batteries works the same everywhere! Here's how to adapt this guide:
                            </p>
                        </div>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>Look up your local electricity rate per kWh (and peak/off-peak logic).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>Check your local government website for solar/battery incentives.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>Use our calculator with your daily kWh usage—the sizing math is universal.</span>
                            </li>
                        </ul>

                        <div className="pt-2">
                            <Link href="/calculator">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Calculator className="w-4 h-4" />
                                    Use Universal Calculator
                                    <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
