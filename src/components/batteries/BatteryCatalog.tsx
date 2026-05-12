"use client";

import { useState, useMemo } from "react";
import { BATTERY_DATABASE, BatteryModel } from "@/data/batteries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Thermometer, Battery as BatteryIcon, Filter, X } from "lucide-react";
import Link from "next/link";

type FilterState = {
    chemistry: string[];
    coupling: string[];
    category: string[];
    blackout_support: string[];
    smart_tariff: boolean | null;
};

export default function BatteryCatalog() {
    const [filters, setFilters] = useState<FilterState>({
        chemistry: [],
        coupling: [],
        category: [],
        blackout_support: [],
        smart_tariff: null
    });
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredBatteries = useMemo(() => {
        return BATTERY_DATABASE.filter(battery => {
            if (filters.chemistry.length > 0 && !filters.chemistry.includes(battery.chemistry)) return false;
            if (filters.coupling.length > 0 && !filters.coupling.includes(battery.coupling)) return false;
            if (filters.category.length > 0 && !filters.category.includes(battery.category)) return false;
            if (filters.blackout_support.length > 0 && !filters.blackout_support.includes(battery.blackout_support)) return false;
            if (filters.smart_tariff !== null && battery.smart_tariff_integration !== filters.smart_tariff) return false;
            return true;
        }).sort((a, b) => (b.usable_kWh_per_unit || 0) - (a.usable_kWh_per_unit || 0)); // Default sort by capacity
    }, [filters]);

    const toggleFilter = (key: keyof Omit<FilterState, 'smart_tariff'>, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value) 
                ? prev[key].filter(item => item !== value)
                : [...prev[key], value]
        }));
    };

    const clearFilters = () => {
        setFilters({
            chemistry: [],
            coupling: [],
            category: [],
            blackout_support: [],
            smart_tariff: null
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
                <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <Filter className="w-4 h-4" />
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </Button>
            </div>

            {/* Sidebar Filters */}
            <div className={`w-full md:w-64 flex-shrink-0 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground h-8 px-2">
                        Clear All
                    </Button>
                </div>

                {/* Chemistry Filter */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Chemistry</h4>
                    <div className="space-y-2">
                        {['LiFePO4', 'NMC'].map(chem => (
                            <label key={chem} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-border text-primary focus:ring-primary/20 bg-card"
                                    checked={filters.chemistry.includes(chem)}
                                    onChange={() => toggleFilter('chemistry', chem)}
                                />
                                <span className="text-sm">{chem}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Coupling Filter */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Coupling</h4>
                    <div className="space-y-2">
                        {['AC', 'DC', 'Hybrid'].map(coup => (
                            <label key={coup} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-border text-primary focus:ring-primary/20 bg-card"
                                    checked={filters.coupling.includes(coup)}
                                    onChange={() => toggleFilter('coupling', coup)}
                                />
                                <span className="text-sm">{coup}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Blackout Support Filter */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Backup Power</h4>
                    <div className="space-y-2">
                        {['Whole-Home', 'Partial', 'None'].map(support => (
                            <label key={support} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-border text-primary focus:ring-primary/20 bg-card"
                                    checked={filters.blackout_support.includes(support)}
                                    onChange={() => toggleFilter('blackout_support', support)}
                                />
                                <span className="text-sm">{support}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-muted-foreground">Showing {filteredBatteries.length} batteries</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredBatteries.map(battery => (
                        <Card key={battery.id} className="bg-card/50 border border-border/50 hover:border-primary/50 transition-colors duration-300 overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-primary mb-1">{battery.brand}</p>
                                            <h3 className="text-xl font-bold">{battery.model}</h3>
                                        </div>
                                        <Badge variant={battery.category === 'Premium' ? 'default' : 'secondary'}>
                                            {battery.category}
                                        </Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <BatteryIcon className="w-3.5 h-3.5" /> Usable Capacity
                                            </p>
                                            <p className="font-semibold">{battery.usable_kWh_per_unit} kWh</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Zap className="w-3.5 h-3.5" /> Peak Output
                                            </p>
                                            <p className="font-semibold">{battery.peak_output_kW || battery.continuous_output_kW} kW</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Shield className="w-3.5 h-3.5" /> Cycle Life
                                            </p>
                                            <p className="font-semibold">{battery.cycle_life?.toLocaleString()} cycles</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Thermometer className="w-3.5 h-3.5" /> Min Temp
                                            </p>
                                            <p className="font-semibold">{battery.operating_temp_min_c}°C</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <Badge variant="outline" className="bg-background/50">{battery.chemistry}</Badge>
                                        <Badge variant="outline" className="bg-background/50">{battery.coupling} Coupled</Badge>
                                        {battery.blackout_support === 'Whole-Home' && (
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Whole-Home Backup</Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="bg-background/50 p-4 border-t border-border/50 flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Est: {battery.price_range_usd}
                                    </p>
                                    <Button asChild size="sm">
                                        {/* TODO: Add link to dynamic battery page once created */}
                                        <Link href={`/batteries/${battery.id}/`}>
                                            View Specs
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredBatteries.length === 0 && (
                    <div className="text-center py-24 bg-card/30 rounded-xl border border-border/50 border-dashed">
                        <BatteryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No batteries found</h3>
                        <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results.</p>
                        <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
