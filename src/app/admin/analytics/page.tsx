
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAnalyticsSummary } from '@/lib/analytics/metrics';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
    // 1. Security Check
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin_token');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
                <div className="max-w-md w-full p-6 bg-destructive/10 border border-destructive rounded-lg text-center">
                    <h1 className="text-xl font-bold text-destructive mb-2">Configuration Error</h1>
                    <p>ADMIN_PASSWORD environment variable is not set.</p>
                </div>
            </div>
        );
    }

    const isAuthenticated = authCookie?.value === adminPassword;

    // 2. Login View
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="max-w-sm w-full space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Admin Access</h1>
                        <p className="text-muted-foreground mt-2">Enter password to view analytics</p>
                    </div>
                    <form
                        action={async (formData: FormData) => {
                            'use server';
                            const password = formData.get('password') as string;
                            if (password === process.env.ADMIN_PASSWORD) {
                                const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
                                const cookieStore = await cookies();
                                cookieStore.set('admin_token', password, {
                                    expires: expiry,
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === 'production',
                                    path: '/'
                                });
                                // Using redirect inside server action to refresh page state
                                redirect('/admin/analytics');
                            }
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="password"
                            name="password"
                            placeholder="*************"
                            className="w-full px-4 py-2 rounded-md border border-input bg-background"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 3. Dashboard View (Authenticated)
    const data = await getAnalyticsSummary();

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Internal Analytics</h1>
                        <p className="text-muted-foreground">Real-time usage metrics from Redis</p>
                    </div>
                    <form action={async () => {
                        'use server';
                        const cookieStore = await cookies();
                        cookieStore.delete('admin_token');
                        redirect('/admin/analytics');
                    }}>
                        <button type="submit" className="text-sm text-destructive hover:underline">
                            Logout
                        </button>
                    </form>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard label="Total Leads" value={data.totalLeads} />
                    <StatCard label="Total Events" value={data.totalEvents} />
                    <StatCard label="Calculator Runs" value={data.calculatorSubmissions} />
                    <StatCard label="7-Day Activity" value={data.eventsLast7Days.reduce((acc, curr) => acc + curr.count, 0)} />
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-12">

                    {/* Activity Chart (Table) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Last 7 Days (Events)</h3>
                        <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-right">Count</th>
                                        <th className="px-4 py-2 text-left w-1/3">Visual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.eventsLast7Days.map((day) => (
                                        <tr key={day.date}>
                                            <td className="px-4 py-2 font-mono">{day.date}</td>
                                            <td className="px-4 py-2 text-right">{day.count}</td>
                                            <td className="px-4 py-2">
                                                <div
                                                    className="h-2 bg-primary rounded-full"
                                                    style={{ width: `${Math.min(100, (day.count / Math.max(1, ...data.eventsLast7Days.map(d => d.count))) * 100)}%` }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Events */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Top Event Types</h3>
                        <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-right">Count</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.topEventTypes.map((type) => (
                                        <tr key={type.type}>
                                            <td className="px-4 py-2 font-mono">{type.type}</td>
                                            <td className="px-4 py-2 text-right">{type.count}</td>
                                        </tr>
                                    ))}
                                    {data.topEventTypes.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">No events found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Logs Table */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Raw Logs (Most Recent 50)</h3>
                    <div className="border border-border rounded-lg overflow-auto max-h-[500px]">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-muted-foreground sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left">Time</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {data.recentEvents.map((event, i) => (
                                    <tr key={i} className="hover:bg-muted/50">
                                        <td className="px-4 py-2 font-mono whitespace-nowrap text-xs text-muted-foreground">
                                            {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                            {event.type || event.action || 'unknown'}
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                                            {JSON.stringify(event).slice(0, 100) + (JSON.stringify(event).length > 100 ? '...' : '')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: number }) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</h4>
            <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        </div>
    );
}
