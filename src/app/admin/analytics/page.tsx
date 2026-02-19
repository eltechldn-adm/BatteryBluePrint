"use client";

import { useEffect, useState } from "react";
import { track, getEvents, clearEvents, summarize, exportJSON, exportCSV, JourneyEvent } from "@/lib/analytics/journey";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function AnalyticsDashboard() {
    const [events, setEvents] = useState<JourneyEvent[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    const loadData = () => {
        const data = getEvents();
        setEvents(data);
        setSummary(summarize());
    };

    useEffect(() => {
        setMounted(true);
        loadData();

        // Auto-track that admin viewed this page
        track('page_view', { is_admin: true });
    }, []);

    const handleClear = () => {
        if (confirm("Are you sure you want to clear all analytics data? This cannot be undone.")) {
            clearEvents();
            loadData();
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!mounted) return <div className="p-10 text-center">Loading Analytics...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto px-4 py-24 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Journey Analytics</h1>
                        <p className="text-slate-500">Local device tracking (Debugging Mode)</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={loadData}>Refresh</Button>
                        <Button variant="destructive" onClick={handleClear}>Clear Data</Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary?.totalEvents || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Calculations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{summary?.calcUsage || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary?.counts['page_view'] || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Exports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => downloadFile(exportJSON(), 'journey_log.json', 'application/json')}>JSON</Button>
                                <Button size="sm" variant="outline" onClick={() => downloadFile(exportCSV(), 'journey_log.csv', 'text/csv')}>CSV</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Top Pages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Content</CardTitle>
                            <CardDescription>Most visited paths</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {summary?.topPaths.map(([path, count]: [string, number]) => (
                                    <div key={path} className="flex justify-between items-center p-2 rounded bg-slate-100/50">
                                        <span className="text-sm font-mono truncate max-w-[200px]" title={path}>{path}</span>
                                        <span className="font-semibold text-sm">{count}</span>
                                    </div>
                                ))}
                                {summary?.topPaths.length === 0 && <p className="text-sm text-muted-foreground italic">No data yet.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top CTAs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top CTAs</CardTitle>
                            <CardDescription>Highest converting clicks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {summary?.topCtas?.map(([cta, count]: [string, number]) => (
                                    <div key={cta} className="flex justify-between items-center p-2 rounded bg-primary/5 border border-primary/10">
                                        <span className="text-sm font-medium text-primary truncate max-w-[200px]" title={cta}>{cta}</span>
                                        <span className="font-bold text-sm text-primary">{count}</span>
                                    </div>
                                ))}
                                {(!summary?.topCtas || summary.topCtas.length === 0) && <p className="text-sm text-muted-foreground italic">No clicks recorded yet.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Stream (Recent) */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Last 50 events stream</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[400px] overflow-y-auto">
                            <div className="space-y-2">
                                {events.slice(0, 50).map((e) => (
                                    <div key={e.id} className="text-xs border-b border-border/40 pb-2 mb-2 last:border-0">
                                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                                            <span className="uppercase tracking-wider text-[10px] text-primary">{e.name}</span>
                                            <span className="text-slate-400">{new Date(e.ts).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="font-mono text-slate-600 truncate max-w-[150px]">{e.path}</span>
                                            {e.meta && (
                                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 max-w-[120px] truncate">
                                                    {JSON.stringify(e.meta)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
