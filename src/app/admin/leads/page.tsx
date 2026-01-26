"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Shield, ArrowLeft } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  firstName?: string;
  timestamp: string;
  calculatorInputs?: {
    dailyLoad: number;
    autonomyDays: number;
    winterMode: boolean;
  };
  resultsSummary?: {
    batteryUsableNeeded: number;
    batteryNameplateNeeded: number;
  };
  recommendations?: {
    premium?: string;
    midRange?: string;
    diy?: string;
  };
  selectedTier?: string;
}

export default function AdminLeadsPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json() as { leads: Lead[] };
        setLeads(data.leads);
        setIsAuthenticated(true);
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Failed to fetch leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Email",
      "First Name",
      "Timestamp",
      "Daily Load (kWh)",
      "Autonomy Days",
      "Winter Mode",
      "Battery Usable Needed",
      "Battery Nameplate Needed",
      "Premium Recommendation",
      "Mid-Range Recommendation",
      "DIY Recommendation",
      "Selected Tier",
    ];

    const rows = leads.map((lead) => [
      lead.id,
      lead.email,
      lead.firstName || "",
      lead.timestamp,
      lead.calculatorInputs?.dailyLoad || "",
      lead.calculatorInputs?.autonomyDays || "",
      lead.calculatorInputs?.winterMode ? "Yes" : "No",
      lead.resultsSummary?.batteryUsableNeeded || "",
      lead.resultsSummary?.batteryNameplateNeeded || "",
      lead.recommendations?.premium || "",
      lead.recommendations?.midRange || "",
      lead.recommendations?.diy || "",
      lead.selectedTier || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `batteryblueprint-leads-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Access Leads"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Lead Management</h1>
            <p className="text-muted-foreground">
              {leads.length} total lead{leads.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button onClick={exportCSV} disabled={leads.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {leads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No leads yet</p>
              </CardContent>
            </Card>
          ) : (
            leads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-semibold">{lead.email}</p>
                      {lead.firstName && (
                        <p className="text-sm">{lead.firstName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(lead.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {lead.calculatorInputs && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Calculator Inputs
                        </p>
                        <p className="text-sm">
                          {lead.calculatorInputs.dailyLoad} kWh/day
                        </p>
                        <p className="text-sm">
                          {lead.calculatorInputs.autonomyDays} days autonomy
                        </p>
                        <p className="text-sm">
                          Winter:{" "}
                          {lead.calculatorInputs.winterMode ? "On" : "Off"}
                        </p>
                      </div>
                    )}

                    {lead.resultsSummary && (
                      <div>
                        <p className="text-sm text-muted-foreground">Results</p>
                        <p className="text-sm">
                          Usable: {lead.resultsSummary.batteryUsableNeeded} kWh
                        </p>
                        <p className="text-sm">
                          Nameplate:{" "}
                          {lead.resultsSummary.batteryNameplateNeeded} kWh
                        </p>
                        {lead.selectedTier && (
                          <p className="text-sm font-semibold mt-1">
                            Tier: {lead.selectedTier}
                          </p>
                        )}
                      </div>
                    )}

                    {lead.recommendations && (
                      <div className="col-span-full border-t pt-3 mt-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Recommendations
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          {lead.recommendations.premium && (
                            <div>
                              <span className="font-semibold">Premium: </span>
                              {lead.recommendations.premium}
                            </div>
                          )}
                          {lead.recommendations.midRange && (
                            <div>
                              <span className="font-semibold">Mid-Range: </span>
                              {lead.recommendations.midRange}
                            </div>
                          )}
                          {lead.recommendations.diy && (
                            <div>
                              <span className="font-semibold">DIY: </span>
                              {lead.recommendations.diy}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
