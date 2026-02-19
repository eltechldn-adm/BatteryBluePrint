"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Admin Leads page — static placeholder.
 *
 * Lead data is no longer stored server-side in this static deployment.
 * To collect and view leads, integrate a third-party service such as:
 *   - Resend Audiences (https://resend.com/audiences)
 *   - ConvertKit / Mailchimp
 *   - Airtable form submissions
 *   - Cloudflare D1 via a separate API worker
 */
export default function AdminLeadsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Lead Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            This site is deployed as a pure static export. Lead storage requires
            a server-side integration.
          </p>
          <p className="text-muted-foreground text-sm">
            To collect leads, connect a third-party service (e.g. Resend
            Audiences, ConvertKit, or Airtable) and update the calculator&apos;s
            email capture form to POST directly to that service.
          </p>
          <div className="pt-4 border-t">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
