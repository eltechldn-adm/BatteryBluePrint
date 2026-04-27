/**
 * generateBlueprint.ts
 * BatteryBlueprint PDF export — brand-aligned to batteryblueprint.com
 *
 * BRAND TOKENS (sourced directly from src/app/globals.css):
 *   background:   #FAF8F5  (cream/warm white)
 *   foreground:   #2D241E  (deep warm brown)
 *   primary:      #E35336  (terracotta/burnt orange)
 *   secondary:    #F4A460  (sandy tan)
 *   muted:        #DCCFB8  (warm beige)
 *   muted-fg:     #6B5B4D  (medium brown)
 *   accent:       #A0522D  (dark sienna)
 *   border:       #DCCFB8
 *   card:         #FFFFFF
 *
 * Pure client-side — jsPDF + jspdf-autotable — no server deps.
 */

import type { SizingResult } from '@/lib/calc/battery-sizing';
import type { RecommendedBattery } from '@/lib/calc/recommend-batteries';

export interface BlueprintInputs {
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
  generatedAt?: string;
}

// ─── BRAND TOKEN MAP (from globals.css) ────────────────────────────────────────
type RGB = [number, number, number];

const B: Record<string, RGB> = {
  background:  [250, 248, 245],
  surface:     [255, 255, 255],
  primary:     [227,  83,  54],
  accent:      [160,  82,  45],
  foreground:  [ 45,  36,  30],
  mutedFg:     [107,  91,  77],
  border:      [220, 207, 184],
  white:       [255, 255, 255],
};

// ─── SPACING SCALE (pt) ───────────────────────────────────────────────────────
const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

// ─── FONT SIZES (pt) ──────────────────────────────────────────────────────────
const F = { h1: 22, h2: 14, body: 9.5, small: 8, tiny: 7.5 };

// Line-height multiplier used throughout so every height calc agrees
const LH = 1.45;

// ─── PAGE GEOMETRY (A4 in pt) ─────────────────────────────────────────────────
const PAGE_W    = 595.28;
const PAGE_H    = 841.89;
const MARGIN    = 36;
const CW        = PAGE_W - MARGIN * 2;   // 523.28 pt
const HEADER_H  = 28;
const FOOTER_H  = 22;
// First y position content may be drawn on a fresh page
const SAFE_TOP    = MARGIN + HEADER_H + S.lg;
// Last y position content may be drawn before the footer zone
const SAFE_BOTTOM = PAGE_H - FOOTER_H - MARGIN - 4;

// ─── TEXT SANITISER ───────────────────────────────────────────────────────────
function clean(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/&/g, 'and')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

function fmt(n: number, dp = 1): string {
  return Number(n.toFixed(dp)).toString();
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export async function generateBlueprintPDF(inputs: BlueprintInputs): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  let y = SAFE_TOP;

  // ── DRAWING PRIMITIVES ────────────────────────────────────────────────────────
  const setFont = (size: number, color: RGB, weight: 'normal'|'bold'|'italic' = 'normal') => {
    doc.setFont('helvetica', weight);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const hline = (x1: number, ly: number, x2: number, color: RGB = B.border, w = 0.5) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(w);
    doc.line(x1, ly, x2, ly);
  };

  const fillBox = (rx: number, ry: number, rw: number, rh: number, color: RGB, r = 0) => {
    doc.setFillColor(...color);
    r > 0 ? doc.roundedRect(rx, ry, rw, rh, r, r, 'F') : doc.rect(rx, ry, rw, rh, 'F');
  };

  const strokeBox = (rx: number, ry: number, rw: number, rh: number, color: RGB, w = 0.5, r = 0) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(w);
    r > 0 ? doc.roundedRect(rx, ry, rw, rh, r, r, 'S') : doc.rect(rx, ry, rw, rh, 'S');
  };

  // Measures text lines without drawing or advancing y
  const measure = (text: string, maxW: number, size: number): string[] => {
    doc.setFontSize(size);
    return doc.splitTextToSize(clean(text), maxW);
  };

  // Block height for N lines at given font size
  const blockH = (lines: string[], size: number) => lines.length * size * LH;

  // ── PAGE MANAGEMENT ───────────────────────────────────────────────────────────
  const drawHeader = () => {
    fillBox(0, 0, PAGE_W, HEADER_H, B.background);
    hline(0, HEADER_H, PAGE_W, B.border);
    setFont(11, B.primary, 'bold');
    doc.text('BatteryBlueprint', MARGIN, 18);
    setFont(F.small, B.mutedFg);
    doc.text(`Page ${doc.getNumberOfPages()}`, PAGE_W - MARGIN, 18, { align: 'right' });
  };

  const drawFooter = () => {
    const fy = PAGE_H - FOOTER_H;
    hline(MARGIN, fy, PAGE_W - MARGIN, B.border);
    setFont(F.tiny, B.mutedFg);
    doc.text(
      'Engineering guidance only. Not a licensed design firm. Consult a certified installer before purchase.',
      MARGIN, fy + 13,
    );
    setFont(F.tiny, B.primary);
    doc.text('batteryblueprint.com', PAGE_W - MARGIN, fy + 13, { align: 'right' });
  };

  const newPage = () => {
    drawFooter();
    doc.addPage();
    fillBox(0, 0, PAGE_W, PAGE_H, B.background);
    y = SAFE_TOP;
    drawHeader();
  };

  // Only breaks if `needed` pt genuinely won't fit before SAFE_BOTTOM
  const softBreak = (needed: number) => {
    if (y + needed > SAFE_BOTTOM) newPage();
  };

  // ── SECTION HEADING ───────────────────────────────────────────────────────────
  // Returns exact pt height consumed so callers can check before calling
  const sectionHeading = (title: string, subtitle?: string): number => {
    // Accent bar — aligned to current y
    fillBox(MARGIN, y, 3, 16, B.primary);

    setFont(F.h2, B.foreground, 'bold');
    // Baseline of heading text sits at y + 12 (inside the 16pt bar)
    doc.text(clean(title), MARGIN + 10, y + 12);
    y += 20;  // 16pt bar + 4pt gap below it

    let consumed = 20;

    if (subtitle) {
      y += S.sm;
      consumed += S.sm;
      setFont(F.small, B.mutedFg);
      const lines = doc.splitTextToSize(clean(subtitle), CW);
      // First line baseline at y + F.small
      doc.text(lines, MARGIN, y + F.small);
      const h = blockH(lines, F.small) + S.md;
      y += h;
      consumed += h;
    }

    return consumed;
  };

  // ── METRIC CARDS ─────────────────────────────────────────────────────────────
  const drawMetricCards = () => {
    const CARD_H = 76;
    const GAP    = 10;
    const cw     = (CW - GAP * 2) / 3;

    softBreak(CARD_H + S.lg);

    const metrics = [
      { label: 'LOAD TARGET',      value: fmt(inputs.result.loadTarget_kWh),            unit: 'kWh', sub: 'AC energy required',    accent: false },
      { label: 'BATTERY USABLE',   value: fmt(inputs.result.batteryUsableNeeded_kWh),    unit: 'kWh', sub: 'DC capacity needed',    accent: true  },
      { label: 'NAMEPLATE NEEDED', value: fmt(inputs.result.batteryNameplateNeeded_kWh), unit: 'kWh', sub: 'Sticker rating to buy', accent: false },
    ];

    metrics.forEach((m, i) => {
      const cx = MARGIN + i * (cw + GAP);
      const cy = y;

      fillBox(cx, cy, cw, CARD_H, m.accent ? B.primary : B.surface, 3);
      strokeBox(cx, cy, cw, CARD_H, m.accent ? B.primary : B.border, 0.5, 3);

      const textCol: RGB  = m.accent ? B.white : B.foreground;
      const subCol: RGB   = m.accent ? [255, 220, 210] : B.mutedFg;

      // Label — 14pt down from card top
      setFont(F.tiny, m.accent ? ([255, 220, 210] as RGB) : B.mutedFg, 'bold');
      doc.text(m.label, cx + cw / 2, cy + 18, { align: 'center' });

      // Value — 20pt font, centred vertically in card
      setFont(20, textCol, 'bold');
      doc.text(m.value, cx + cw / 2, cy + 47, { align: 'center' });

      // Unit sits right of value on same baseline
      const valW = doc.getTextWidth(m.value);
      setFont(10, subCol);
      doc.text(m.unit, cx + cw / 2 + valW / 2 + 3, cy + 47);

      // Sub text — 10pt from card bottom
      setFont(F.tiny, subCol);
      doc.text(m.sub, cx + cw / 2, cy + CARD_H - 10, { align: 'center' });
    });

    y += CARD_H + S.lg;
  };

  // ── FORMULA BOX ──────────────────────────────────────────────────────────────
  const drawFormulaBox = () => {
    const bd = inputs.result.breakdown;
    const calcStr = clean(
      `= (${fmt(inputs.dailyLoad_kWh)} x ${inputs.daysOfAutonomy} x ${bd.reserveMult.toFixed(2)} x ${bd.winterMult.toFixed(1)}) / ${fmt(inputs.efficiency)} / ${fmt(inputs.dod)} = ${fmt(inputs.result.batteryNameplateNeeded_kWh)} kWh`,
    );

    // Pre-measure both text rows
    const row1Lines = measure('Nameplate = (Daily kWh x Days x Reserve x Winter) / Inverter Efficiency / DoD', CW - 32, F.small);
    const row2Lines = measure(calcStr, CW - 32, F.small);

    // Box height: top padding 10 + label row + gap + row1 + gap + row2 + bottom padding 10
    const PAD = 10;
    const labelH = F.small * LH;
    const row1H  = blockH(row1Lines, F.small);
    const row2H  = blockH(row2Lines, F.small);
    const BOX_H  = PAD + labelH + S.xs + row1H + S.xs + row2H + PAD;

    softBreak(BOX_H + S.md);

    fillBox(MARGIN, y, CW, BOX_H, B.background, 3);
    strokeBox(MARGIN, y, CW, BOX_H, B.border, 0.5, 3);
    fillBox(MARGIN, y, 3, BOX_H, B.primary);   // left accent stripe

    // Row positions — all baselines from box top
    let ty = y + PAD;

    // Label
    setFont(F.small, B.primary, 'bold');
    doc.text('Engineering Formula', MARGIN + 12, ty + F.small);
    ty += labelH + S.xs;

    // Formula template
    setFont(F.small, B.foreground);
    doc.text(row1Lines, MARGIN + 12, ty + F.small);
    ty += row1H + S.xs;

    // Calculated result
    setFont(F.small, B.mutedFg);
    doc.text(row2Lines, MARGIN + 12, ty + F.small);

    y += BOX_H + S.lg;
  };

  // ── ASSUMPTIONS TABLE ────────────────────────────────────────────────────────
  const drawAssumptionsTable = () => {
    const rows = [
      ['Daily Load',               `${fmt(inputs.dailyLoad_kWh)} kWh/day`],
      ['Days of Autonomy',         `${inputs.daysOfAutonomy} day(s)`],
      ['Depth of Discharge (DoD)', `${Math.round(inputs.dod * 100)}%`],
      ['Inverter Efficiency',      `${Math.round(inputs.efficiency * 100)}%`],
      ['Reserve Buffer',           `${Math.round(inputs.reserveBuffer * 100)}%`],
      ['Winter Mode',              inputs.winterMode ? 'ON (+20% capacity)' : 'OFF'],
    ];

    autoTable(doc, {
      startY: y,
      head: [['Parameter', 'Value']],
      body: rows,
      theme: 'plain',
      tableWidth: CW,
      styles: {
        font: 'helvetica',
        fontSize: F.small,
        cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
        textColor: B.foreground as unknown as string,
        fillColor: B.surface as unknown as string,
        lineColor: B.border as unknown as string,
        lineWidth: 0.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: B.background as unknown as string,
        textColor: B.mutedFg as unknown as string,
        fontStyle: 'bold',
        fontSize: F.tiny,
      },
      alternateRowStyles: { fillColor: B.background as unknown as string },
      columnStyles: {
        0: { cellWidth: 180, fontStyle: 'bold', textColor: B.mutedFg as unknown as string },
        1: { cellWidth: CW - 180 },
      },
      margin: { left: MARGIN, right: MARGIN },
    });

    y = (doc as any).lastAutoTable.finalY + S.lg;
  };

  // ── RECOMMENDATIONS TABLE ─────────────────────────────────────────────────────
  const drawRecsTable = () => {
    if (inputs.recommendations.length === 0) {
      softBreak(20);
      setFont(F.body, B.mutedFg);
      doc.text('No recommendations — run the calculator at batteryblueprint.com.', MARGIN, y + F.body);
      y += F.body * LH + S.sm;
      return;
    }

    const rows = inputs.recommendations.slice(0, 8).map((b, i) => [
      `${i + 1}`,
      clean(b.battery.brand),
      clean(b.battery.model),
      `${fmt(b.totalUsable_kWh)} kWh`,
      `${fmt(b.totalNameplate_kWh)} kWh`,
      clean(b.battery.chemistry),
      clean(b.battery.tier === 'premium' ? 'Premium' : b.battery.tier === 'mid' ? 'Mid-Range' : 'Budget'),
    ]);

    // Column widths lock: 24+88+130+62+70+66+83.28 = 523.28 = CW exactly
    autoTable(doc, {
      startY: y,
      head: [['#', 'Brand', 'Model', 'Usable', 'Nameplate', 'Chemistry', 'Tier']],
      body: rows,
      theme: 'plain',
      tableWidth: CW,
      styles: {
        font: 'helvetica',
        fontSize: F.small,
        cellPadding: { top: 7, bottom: 7, left: 7, right: 7 },
        textColor: B.foreground as unknown as string,
        fillColor: B.surface as unknown as string,
        lineColor: B.border as unknown as string,
        lineWidth: 0.5,
        overflow: 'linebreak',
        valign: 'middle',
      },
      headStyles: {
        fillColor: B.background as unknown as string,
        textColor: B.mutedFg as unknown as string,
        fontStyle: 'bold',
        fontSize: F.tiny,
      },
      alternateRowStyles: { fillColor: B.background as unknown as string },
      columnStyles: {
        0: { cellWidth: 24,    halign: 'center', textColor: B.mutedFg as unknown as string },
        1: { cellWidth: 88,    fontStyle: 'bold' },
        2: { cellWidth: 130 },
        3: { cellWidth: 62,    halign: 'center', textColor: B.primary as unknown as string },
        4: { cellWidth: 70,    halign: 'center' },
        5: { cellWidth: 66,    halign: 'center' },
        6: { cellWidth: 83.28 },
      },
      margin: { left: MARGIN, right: MARGIN },
      willDrawPage: () => {
        fillBox(0, 0, PAGE_W, PAGE_H, B.background);
        drawHeader();
        drawFooter();
      },
    });

    y = (doc as any).lastAutoTable.finalY + S.lg;
  };

  // ── COVERAGE NOTE ─────────────────────────────────────────────────────────────
  const drawCoverageNote = () => {
    const NOTE_H = 26;
    softBreak(NOTE_H + S.md);

    fillBox(MARGIN, y, CW, NOTE_H, B.background, 3);
    strokeBox(MARGIN, y, CW, NOTE_H, B.border, 0.5, 3);

    // Text vertically centred in NOTE_H: baseline = y + NOTE_H/2 + F.small/2
    const baseY = y + NOTE_H / 2 + F.small / 2;
    setFont(F.small, B.mutedFg, 'bold');
    doc.text('Coverage:', MARGIN + 10, baseY);
    setFont(F.small, B.mutedFg);
    doc.text('Battery meets your needs when Usable Capacity >= Battery Usable Needed.', MARGIN + 68, baseY);

    y += NOTE_H + S.lg;
  };

  // ── CHECKLIST GROUP ───────────────────────────────────────────────────────────
  const checklistGroup = (groupTitle: string, items: string[]) => {
    // Need at least the group title + first item before allowing placement
    const titleH = F.body * LH + S.sm;
    const firstItemLines = measure(items[0] ?? '', CW - 18, F.small);
    const firstItemH = blockH(firstItemLines, F.small) + S.sm;
    softBreak(titleH + firstItemH);

    // Group title
    setFont(F.body, B.accent, 'bold');
    doc.text(clean(groupTitle), MARGIN, y + F.body);
    y += F.body * LH + S.sm;

    items.forEach((item) => {
      const lines = measure(item, CW - 18, F.small);
      // Total height for this item: text block + gap below
      const itemH = blockH(lines, F.small) + S.sm;
      softBreak(itemH + 2);   // +2 safety so bullet never touches bottom

      // Bullet: centre vertically with first text line
      // Text baseline is at y + F.small; visual mid of first line is y + F.small/2
      const bulletCY = y + F.small / 2 + 1;
      doc.setFillColor(...B.primary);
      doc.circle(MARGIN + 4, bulletCY, 2, 'F');

      setFont(F.small, B.foreground);
      doc.text(lines, MARGIN + 12, y + F.small);
      y += itemH;
    });

    y += S.md;
  };

  // ── QUESTION CARD ─────────────────────────────────────────────────────────────
  const questionCard = (text: string) => {
    const lines = measure(text, CW - 22, F.small);
    // Padding inside card: top 10 + text block + bottom 10
    const INNER_PAD = 10;
    const CARD_H = INNER_PAD + blockH(lines, F.small) + INNER_PAD;
    softBreak(CARD_H + S.sm);

    fillBox(MARGIN, y, CW, CARD_H, B.surface, 3);
    strokeBox(MARGIN, y, CW, CARD_H, B.border, 0.5, 3);
    fillBox(MARGIN, y, 3, CARD_H, B.primary);   // accent stripe

    // Text: first baseline at y + INNER_PAD + F.small
    setFont(F.small, B.foreground, 'italic');
    doc.text(lines, MARGIN + 12, y + INNER_PAD + F.small);

    y += CARD_H + S.sm;
  };

  // ─── DOCUMENT ASSEMBLY ─────────────────────────────────────────────────────────

  // ── PAGE 1 ───────────────────────────────────────────────────────────────────
  fillBox(0, 0, PAGE_W, PAGE_H, B.background);
  drawHeader();

  // Cover strip — sits entirely within the SAFE_TOP zone
  const COVER_TOP = MARGIN + HEADER_H + S.sm;
  const COVER_H   = 72;
  fillBox(0, COVER_TOP, PAGE_W, COVER_H, B.background);
  hline(0, COVER_TOP + COVER_H, PAGE_W, B.border, 0.5);

  // Cover text — absolute positions within the cover strip
  setFont(F.tiny, B.primary, 'bold');
  doc.text('BATTERYBLUEPRINT.COM', MARGIN, COVER_TOP + 14);

  setFont(F.h1, B.foreground, 'bold');
  doc.text('Battery Sizing Blueprint', MARGIN, COVER_TOP + 36);

  setFont(F.body, B.mutedFg);
  doc.text('Engineering-grade battery storage sizing report', MARGIN, COVER_TOP + 52);

  const genDate = inputs.generatedAt ?? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  setFont(F.tiny, B.mutedFg);
  doc.text(
    `Generated: ${clean(genDate)}   |   Location: ${clean(inputs.location)}   |   Country: ${clean(inputs.country)}`,
    MARGIN, COVER_TOP + 64,
  );

  // y starts immediately below the cover strip + a gap
  y = COVER_TOP + COVER_H + S.xl;

  // ── SECTION 1 ────────────────────────────────────────────────────────────────
  sectionHeading('1.  Your Sizing Results', 'Calculated from your inputs using industry-standard engineering formulas.');
  drawMetricCards();
  drawAssumptionsTable();
  drawFormulaBox();
  drawFooter();

  // ── SECTION 2 ────────────────────────────────────────────────────────────────
  // Section 2 always starts on its own page (content is too long to share page 1)
  newPage();
  sectionHeading('2.  Recommended Batteries', 'Models from our engineering-verified catalog that match your sizing requirements.');
  drawRecsTable();
  drawCoverageNote();

  // ── SECTION 3 ────────────────────────────────────────────────────────────────
  // Only create a new page if there is not enough room for the heading + 2 first items
  softBreak(S.xl + 20 + 80);
  y += S.xl;   // consistent gap whether we stayed on page 2 or moved to page 3
  sectionHeading('3.  Installer Checklist', 'A professional installer will address every item below without hesitation.');
  y += S.sm;

  const checklist: Array<{ group: string; items: string[] }> = [
    {
      group: 'System Sizing and Design',
      items: [
        'Installer has reviewed your actual electricity bills, not estimates',
        'System sized to real daily kWh consumption, not a generic average-home figure',
        'Autonomy days confirmed and documented',
        'Winter / low-sun season factored into the sizing calculations',
        'AC-coupled vs DC-coupled configuration discussed and justified',
      ],
    },
    {
      group: 'Battery Specification',
      items: [
        'Battery chemistry confirmed (LFP recommended for safety and longevity)',
        'Usable vs Nameplate capacity difference clearly explained',
        'Cycle life warranty obtained (min. 3,000 cycles or 10 years at 80% retention)',
        'Operating temperature range matched to your install location',
        'IP or NEMA rating confirmed for indoor vs outdoor installation',
      ],
    },
    {
      group: 'Inverter and Integration',
      items: [
        'Inverter continuous kW rating exceeds your peak appliance load',
        'Inverter surge capacity confirmed for motor-start loads (HVAC, pumps)',
        'Inverter and battery brand compatibility confirmed',
        'Backup configuration (whole-home vs partial) formally agreed',
        'Smart monitoring app included or quoted separately',
      ],
    },
    {
      group: 'Installation and Compliance',
      items: [
        'Installer holds current MCS (UK) / NABCEP (US) / CEC (AU) or local equivalent',
        'All permits and grid connection notifications included in scope',
        'Warranty includes both parts AND labour in writing',
        'Emergency isolator demonstrated on installation day',
      ],
    },
    {
      group: 'Financial and Contract',
      items: [
        'Full itemised quote received (hardware, labour, commissioning as separate line items)',
        'Available government incentives applied for and documented',
        'Payback calculation uses your actual electricity rate, not a marketing assumption',
        'Payment milestones set — avoid paying 100% upfront before installation',
      ],
    },
  ];

  checklist.forEach(({ group, items }) => checklistGroup(group, items));
  drawFooter();

  // ── SECTION 4 ────────────────────────────────────────────────────────────────
  softBreak(S.xl + 20 + 80);
  y += S.xl;
  sectionHeading('4.  Questions to Ask Your Installer', 'Engineering-grade questions that reveal genuine competency.');
  y += S.sm;

  const qGroups: Array<{ group: string; questions: string[] }> = [
    {
      group: 'System Design',
      questions: [
        '"Can you show me the exact calculation you used to arrive at this battery size?"',
        '"What is the round-trip efficiency of this battery and inverter combination?"',
        '"How did you account for my winter consumption in the sizing?"',
        '"What happens during a grid outage — will my critical loads stay on automatically?"',
      ],
    },
    {
      group: 'Battery and Equipment',
      questions: [
        '"What is the actual usable capacity vs the nameplate capacity of this battery?"',
        '"What does the warranty cover if capacity falls below 80% before 10 years?"',
        '"Is this inverter DC-coupled or AC-coupled, and which is correct for my setup?"',
        '"Can this system be expanded in future, and what are the compatibility limits?"',
      ],
    },
    {
      group: 'Installation and Compliance',
      questions: [
        '"Which specific certifications do you hold, and can I verify them online?"',
        '"Who handles the DNO or grid connection notification, and is it included in your quote?"',
        '"Will you provide a complete handover pack and all equipment manuals on completion day?"',
      ],
    },
    {
      group: 'Financial and ROI',
      questions: [
        '"What electricity rate have you used to calculate my payback period?"',
        '"Am I eligible for any government grants or incentives, and will you handle the application?"',
        '"Is any part of this quote dependent on future incentives that may not be confirmed?"',
      ],
    },
  ];

  qGroups.forEach(({ group, questions }) => {
    // Group title + at least first card
    const firstCardLines = measure(questions[0] ?? '', CW - 22, F.small);
    const firstCardH = blockH(firstCardLines, F.small) + 20 + S.sm;
    softBreak(F.body * LH + S.sm + firstCardH);

    setFont(F.body, B.accent, 'bold');
    doc.text(clean(group), MARGIN, y + F.body);
    y += F.body * LH + S.sm;

    questions.forEach(q => questionCard(q));
    y += S.xs;
  });

  // ── DISCLAIMER ────────────────────────────────────────────────────────────────
  const discText = clean(
    'BatteryBlueprint is an engineering planning tool, not a licensed engineering firm. All results are estimates based on standard industry formulas and should not be treated as a final system design. Always have your installation designed and executed by a licensed electrician or MCS / NABCEP-certified solar installer. Local codes, grid tariffs, and site conditions may significantly affect your final system.',
  );
  const discLines = measure(discText, CW - 24, F.small);
  const DISC_H = blockH(discLines, F.small) + 30;  // 12pt top + text + 12pt bottom

  // Gap above disclaimer + full disclaimer box must fit
  softBreak(S.xl + DISC_H + S.lg + 20);
  y += S.xl;

  // Divider
  hline(MARGIN, y, PAGE_W - MARGIN, B.border);
  y += S.lg;

  // Disclaimer box
  fillBox(MARGIN, y, CW, DISC_H, B.background, 3);
  strokeBox(MARGIN, y, CW, DISC_H, B.border, 0.5, 3);

  const dbY = y;
  setFont(F.small, B.accent, 'bold');
  doc.text('Important Disclaimer', MARGIN + 12, dbY + 14);

  setFont(F.small, B.mutedFg);
  // Text baseline starts at 14 (title) + F.small*LH gap + F.small for first line baseline
  doc.text(discLines, MARGIN + 12, dbY + 14 + F.small * LH + F.small);

  y += DISC_H + S.lg;

  // CTA line
  softBreak(20);
  setFont(F.small, B.mutedFg);
  doc.text('Re-run your calculation any time:', MARGIN, y + F.small);
  setFont(F.small, B.primary, 'bold');
  doc.text('batteryblueprint.com/calculator', MARGIN + 150, y + F.small);

  drawFooter();

  return doc.output('blob');
}
