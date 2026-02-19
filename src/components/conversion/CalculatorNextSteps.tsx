"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Coins, Info } from "lucide-react";
import { useCountry } from "@/lib/geo/useCountry";
import { track } from "@/lib/analytics/journey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CalculatorNextSteps() {
    const { country } = useCountry();

    const isUK = country.code === 'GB';
    const isUS = country.code === 'US';

    const handleTrack = (cta: string) => {
        track('cta_click', {
            location: 'calculator_results',
            cta,
            country: country.code
        });
    };

    return (
        <div className="mt-12 space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold tracking-tight">Understanding Your Results</h3>
                <p className="text-muted-foreground mt-2">Recommended reading based on your calculation</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* 1. kWh Explained */}
                <Link
                    href="/basics/kwh-explained"
                    onClick={() => handleTrack('kwh_explained')}
                    className="group block"
                >
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                        <CardHeader className="pb-2">
                            <Info className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                What is a kWh?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Understand the units behind your energy bill and battery capacity.
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-primary">
                                Read Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* 2. Sizing Guide */}
                <Link
                    href="/sizing/how-to-size-solar-battery-uk-us"
                    onClick={() => handleTrack('sizing_guide')}
                    className="group block"
                >
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                        <CardHeader className="pb-2">
                            <BookOpen className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                Sizing Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                See the step-by-step math we used to calculate your battery size.
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-primary">
                                See the Math <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* 3. Cost & Payback */}
                <Link
                    href="/cost/solar-battery-payback-period"
                    onClick={() => handleTrack('payback_guide')}
                    className="group block"
                >
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                        <CardHeader className="pb-2">
                            <Coins className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {isUK ? 'UK ROI Guide' : isUS ? 'US ROI Guide' : 'Payback & ROI'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {isUK
                                    ? 'Calculate payback periods for UK solar battery systems.'
                                    : isUS
                                        ? 'Analyze ROI and tax incentives for US homeowners.'
                                        : 'Learn how to calculate the return on investment for batteries.'}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-primary">
                                Check Costs <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
