'use client';

import React, { useState } from 'react';
import { Download, Mail, FileText, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';
import type { SizingResult } from '@/lib/calc/battery-sizing';
import type { RecommendedBattery } from '@/lib/calc/recommend-batteries';

interface BlueprintDownloadProps {
  result: SizingResult;
  recommendations: RecommendedBattery[];
  country: string;
  location: string;
  dailyLoad_kWh: number;
  daysOfAutonomy: number;
  winterMode: boolean;
  dod: number;
  efficiency: number;
  reserveBuffer: number;
}

type DownloadState = 'idle' | 'generating' | 'done' | 'error';
type EmailState = 'idle' | 'sending' | 'sent' | 'error';

export function BlueprintDownload(props: BlueprintDownloadProps) {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailState, setEmailState] = useState<EmailState>('idle');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const buildInputs = () => ({
    result: props.result,
    recommendations: props.recommendations,
    country: props.country,
    location: props.location,
    dailyLoad_kWh: props.dailyLoad_kWh,
    daysOfAutonomy: props.daysOfAutonomy,
    winterMode: props.winterMode,
    dod: props.dod,
    efficiency: props.efficiency,
    reserveBuffer: props.reserveBuffer,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  });

  const handleDownload = async () => {
    if (downloadState === 'generating') return;
    setDownloadState('generating');
    try {
      const { generateBlueprintPDF } = await import('@/lib/pdf/generateBlueprint');
      const blob = await generateBlueprintPDF(buildInputs());
      setPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BatteryBlueprint-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadState('done');
      setTimeout(() => setDownloadState('idle'), 4000);
    } catch (err) {
      console.error('Blueprint PDF generation failed:', err);
      setDownloadState('error');
      setTimeout(() => setDownloadState('idle'), 4000);
    }
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailState('sending');

    try {
      // Generate PDF if not already done
      let blob = pdfBlob;
      if (!blob) {
        const { generateBlueprintPDF } = await import('@/lib/pdf/generateBlueprint');
        blob = await generateBlueprintPDF(buildInputs());
        setPdfBlob(blob);
      }

      // Convert blob to base64 for transmission
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64 = btoa(String.fromCharCode(...Array.from(uint8Array)));

      // POST to Cloudflare Pages Function
      const res = await fetch('/api/send-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name.trim() || undefined,
          pdfBase64: base64,
          sizingData: {
            loadTarget: props.result.loadTarget_kWh,
            batteryUsable: props.result.batteryUsableNeeded_kWh,
            batteryNameplate: props.result.batteryNameplateNeeded_kWh,
            country: props.country,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setEmailState('sent');
    } catch (err) {
      console.error('Blueprint email failed:', err);
      setEmailState('error');
    }
  };

  return (
    <>
      {/* ── Download Card (Dark Theme) ─────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#2D241C] p-6 shadow-xl border border-[#3E342B]">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-6 h-6 text-primary flex-shrink-0" />
          <h3 className="font-bold text-white text-[22px]">Unlock Full Blueprint PDF</h3>
        </div>

        <p className="text-[15px] text-[#D1C6B9] mb-5 leading-relaxed tracking-wide">
          Includes comparison table, installer checklist, and questions to ask installers.
        </p>

        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-[18px] h-[18px] text-primary flex-shrink-0" />
          <span className="text-[14px] text-[#D9A566] font-medium tracking-wide">Instant download &middot; No signup required</span>
        </div>

        <div>
          <button
            id="blueprint-download-btn"
            onClick={handleDownload}
            disabled={downloadState === 'generating'}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-primary text-white font-bold text-[17px] hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(227,83,54,0.39)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {downloadState === 'generating' && <Loader2 className="w-5 h-5 animate-spin" />}
            {downloadState === 'done' && <CheckCircle className="w-5 h-5" />}
            {downloadState === 'error' && <AlertCircle className="w-5 h-5" />}
            {downloadState === 'idle' && ''}
            {downloadState === 'generating' && 'Generating...'}
            {downloadState === 'done' && 'Downloaded!'}
            {downloadState === 'error' && 'Failed — Try Again'}
            {downloadState === 'idle' && 'Get My PDF'}
          </button>
          
          <div className="mt-4 text-center">
            <button
              id="blueprint-email-btn"
              onClick={() => setShowEmailModal(true)}
              className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors cursor-pointer"
            >
              Or send to email
            </button>
          </div>
        </div>
      </div>

      {/* ── Email Modal (Unchanged structurally, just UI) ───────────────────── */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowEmailModal(false); setEmailState('idle'); }}
          />

          <div className="relative z-10 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-6">
            <button
              onClick={() => { setShowEmailModal(false); setEmailState('idle'); }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-xl">Email Your Blueprint</h2>
                <p className="text-sm text-muted-foreground">Attach the PDF directly to your inbox.</p>
              </div>
            </div>

            {emailState === 'sent' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-foreground text-xl mb-2">Blueprint Sent!</h3>
                <p className="text-[15px] text-muted-foreground mb-6">
                  Check your inbox at <strong className="text-foreground">{email}</strong>.
                </p>
                <button
                  onClick={() => { setShowEmailModal(false); setEmailState('idle'); }}
                  className="w-full px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSend} className="space-y-5">
                <div>
                  <label htmlFor="blueprint-email-input" className="block text-[14px] font-semibold text-foreground mb-2">
                    Email address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="blueprint-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-muted bg-background text-foreground text-[15px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  />
                  {emailError && (
                    <p className="text-[13px] font-medium text-destructive mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="blueprint-name-input" className="block text-[14px] font-semibold text-foreground mb-2">
                    Your name <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="blueprint-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full px-4 py-3 rounded-xl border-2 border-muted bg-background text-foreground text-[15px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  />
                </div>

                {emailState === 'error' && (
                  <div className="flex items-start gap-2.5 p-4 rounded-xl bg-destructive/10 text-destructive text-[14px] font-medium border border-destructive/20">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Could not send the email. You can still{' '}
                      <button
                        type="button"
                        onClick={() => { setShowEmailModal(false); handleDownload(); }}
                        className="underline font-bold hover:text-destructive/80"
                      >
                        download the PDF directly
                      </button>.
                    </span>
                  </div>
                )}

                <p className="text-[13px] text-muted-foreground leading-relaxed text-center px-2">
                  No account created, no marketing emails. We will only send you the requested PDF.
                </p>

                <button
                  id="blueprint-email-send-btn"
                  type="submit"
                  disabled={emailState === 'sending'}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl bg-foreground text-background font-bold text-[16px] hover:bg-foreground/90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {emailState === 'sending' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send My PDF
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
