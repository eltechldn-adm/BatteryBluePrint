import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { logger } from '@/lib/logger';

// --- Colors ---
// Cream: #F5F5DC
const COL_BG = rgb(245 / 255, 245 / 255, 220 / 255);
// Burnt Sienna (Primary): #F4A460
const COL_PRIMARY = rgb(244 / 255, 164 / 255, 96 / 255);
// Dark Text: #1F1F1F
const COL_TEXT_DARK = rgb(31 / 255, 31 / 255, 31 / 255);
// Muted Text: #4B4B4B
const COL_TEXT_MUTED = rgb(75 / 255, 75 / 255, 75 / 255);
// White (Card BG): #FFFFFF
const COL_WHITE = rgb(1, 1, 1);
// Soft Border: #E6E0D2
const COL_BORDER = rgb(230 / 255, 224 / 255, 210 / 255);

export async function generateBlueprintPdf(
    results: any,
    recommendations: any
): Promise<Uint8Array> {
    // Debug logging
    logger.info("PDF payload keys", {
        resultsKeys: Object.keys(results || {}),
        recKeys: Object.keys(recommendations || {})
    });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Layout State
    let page = pdfDoc.addPage();
    let { width, height } = page.getSize();
    const margin = 50;
    let y = height;

    // --- Drawing Helpers ---

    const drawBackground = () => {
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: COL_BG,
        });
    };

    const drawHeader = () => {
        const headerH = 80;
        // Header Band
        page.drawRectangle({
            x: 0,
            y: height - headerH,
            width,
            height: headerH,
            color: COL_PRIMARY,
        });

        // Title
        page.drawText('Battery Blueprint', {
            x: margin,
            y: height - 40,
            size: 28,
            font: boldFont,
            color: COL_WHITE,
        });

        // Subtitle
        page.drawText('Your personalised battery sizing report', {
            x: margin,
            y: height - 60,
            size: 12,
            font,
            color: COL_WHITE,
        });

        // Date
        const dateStr = new Date().toLocaleDateString();
        const dateWidth = font.widthOfTextAtSize(dateStr, 12);
        page.drawText(dateStr, {
            x: width - margin - dateWidth,
            y: height - 40,
            size: 12,
            font,
            color: COL_WHITE,
        });

        // Update y to below header
        y = height - headerH - 30; // 30px padding below header
    };

    const fmt = (v: unknown, dp = 2) =>
        typeof v === "number" && Number.isFinite(v) ? v.toFixed(dp) : "N/A";

    const checkPageBreak = (neededH: number) => {
        if (y - neededH < margin) {
            page = pdfDoc.addPage();
            drawBackground();
            // Draw a compact header logic or just reset Y
            // For branded feel, let's draw a mini header or just spacer
            // Let's re-draw full header for consistency on every page
            drawHeader();
        }
    };

    const drawText = (text: string, opts: { x?: number, y?: number, size?: number, font?: PDFFont, color?: any } = {}) => {
        page.drawText(text, {
            x: opts.x ?? margin,
            y: opts.y ?? y,
            size: opts.size ?? 12,
            font: opts.font ?? font,
            color: opts.color ?? COL_TEXT_DARK,
        });
    };

    // Helper to extract numeric values safely (fallback logic)
    const getNum = (obj: any, keys: string[]): number | undefined => {
        if (!obj) return undefined;
        for (const k of keys) {
            const val = obj[k];
            if (typeof val === 'number' && Number.isFinite(val)) return val;
            if (typeof val === 'string') {
                const parsed = parseFloat(val);
                if (!isNaN(parsed) && isFinite(parsed)) return parsed;
            }
        }
        return undefined;
    };

    const getStr = (obj: any, keys: string[]): string | undefined => {
        if (!obj) return undefined;
        for (const k of keys) {
            if (typeof obj[k] === 'string' && obj[k]) return obj[k];
        }
        return undefined;
    };


    // Initial Setup
    drawBackground();
    drawHeader();


    // --- 1. System Analysis Results (Card) ---
    const resultsH = 160;
    checkPageBreak(resultsH);

    // Card BG
    page.drawRectangle({
        x: margin,
        y: y - resultsH,
        width: width - (margin * 2),
        height: resultsH,
        color: COL_WHITE,
        borderColor: COL_BORDER,
        borderWidth: 1,
    });

    // Content inside card
    let cy = y - 30; // internal card y
    const cx = margin + 20;

    // Title
    page.drawText('System Analysis Results', { x: cx, y: cy, size: 16, font: boldFont, color: COL_TEXT_DARK });
    cy -= 30;

    const safeResults = results || {};
    const usableNeeded = getNum(safeResults, ['batteryUsableNeeded_kWh', 'usableNeeded', 'usable_kWh']);
    const nameplateNeeded = getNum(safeResults, ['batteryNameplateNeeded_kWh', 'nameplateNeeded', 'nameplate_kWh']);
    const breakdown = safeResults?.breakdown;

    // Grid Setup
    const col2 = cx + 220;

    // Row 1: Key Metrics
    page.drawText('Usable Capacity Needed:', { x: cx, y: cy, size: 10, font: boldFont, color: COL_TEXT_DARK });
    page.drawText(`${fmt(usableNeeded)} kWh`, { x: col2, y: cy, size: 10, font, color: COL_TEXT_DARK });
    cy -= 20;

    page.drawText('Nameplate Capacity:', { x: cx, y: cy, size: 10, font: boldFont, color: COL_TEXT_DARK });
    page.drawText(`${fmt(nameplateNeeded)} kWh`, { x: col2, y: cy, size: 10, font, color: COL_TEXT_DARK });
    cy -= 20;

    // Divider inside card
    page.drawLine({ start: { x: cx, y: cy - 5 }, end: { x: width - margin - 20, y: cy - 5 }, thickness: 1, color: COL_BORDER });
    cy -= 25;

    // Row 2: Parameters (if available)
    if (breakdown) {
        const load = getNum(breakdown, ['loadBase', 'baseLoad', 'dailyLoad']);
        const autonomy = getNum(breakdown, ['autonomyMult']);
        const winter = getNum(breakdown, ['winterMult']);
        const buffer = getNum(breakdown, ['bufferMult']);

        let infoStr = '';
        if (load !== undefined) infoStr += `Daily Load: ${fmt(load)} kWh   `;
        if (autonomy !== undefined) infoStr += `Autonomy: ${fmt(autonomy)} days   `;
        if (winter !== undefined && winter > 1) infoStr += `Winter Mode: On (${fmt(winter)}x)`;

        page.drawText('Design Parameters:', { x: cx, y: cy, size: 9, font: boldFont, color: COL_TEXT_MUTED });
        cy -= 15;
        page.drawText(infoStr || 'Standard Configuration', { x: cx, y: cy, size: 9, font, color: COL_TEXT_MUTED });
    } else {
        page.drawText('Design Parameters: Data not available', { x: cx, y: cy, size: 9, font, color: COL_TEXT_MUTED });
    }

    y -= (resultsH + 40); // Move main cursor past card


    // --- 2. Recommended Batteries ---
    checkPageBreak(30);
    drawText('Recommended Batteries', { size: 18, font: boldFont, color: COL_TEXT_DARK });
    y -= 30;

    const tiers = ['premium', 'midRange', 'diy'];
    const tierLabels: Record<string, string> = { premium: 'Premium', midRange: 'Mid-Range', diy: 'DIY / Budget' };

    tiers.forEach(tierKey => {
        const items = recommendations?.[tierKey];
        if (Array.isArray(items) && items.length > 0) {

            // Tier Section Check
            checkPageBreak(50);

            // Tier Label Pill
            const label = tierLabels[tierKey] || tierKey;
            const labelW = boldFont.widthOfTextAtSize(label, 12) + 20;
            const labelH = 24;

            checkPageBreak(labelH + 10);

            // Draw Pill
            page.drawRectangle({
                x: margin,
                y: y - labelH,
                width: labelW,
                height: labelH,
                color: COL_PRIMARY,
            });
            page.drawText(label, {
                x: margin + 10,
                y: y - labelH + 7, // center vertically somewhat
                size: 12,
                font: boldFont,
                color: COL_WHITE,
            });

            y -= (labelH + 15);

            // Items in this tier
            items.forEach((item: any) => {
                const cardH = 70;
                checkPageBreak(cardH + 10);

                // Card BG
                page.drawRectangle({
                    x: margin,
                    y: y - cardH,
                    width: width - (margin * 2),
                    height: cardH,
                    color: COL_WHITE,
                    borderColor: COL_BORDER,
                    borderWidth: 1,
                });

                // Content
                const icy = y - 25;
                const icx = margin + 15;

                // Data Extraction
                const model = getStr(item?.battery, ['model', 'name']) || getStr(item, ['model', 'name']) || 'Unknown Model';
                const count = getNum(item, ['count', 'units', 'quantity']) || 0;

                // Total Capacity Logic: Try direct keys first, then calc
                let totalCap = getNum(item, ['totalCapacity_kWh', 'totalCapacityKWh', 'totalUsable_kWh', 'total_kWh']);

                if (totalCap === undefined) {
                    // Try to calc
                    const unitCap = getNum(item?.battery, ['capacity_kWh', 'capacityKwh', 'usable_kWh', 'usableKwh']);
                    if (unitCap !== undefined && count > 0) {
                        totalCap = unitCap * count;
                    }
                }

                // Line 1: 2x Tesla Powerwall ...
                page.drawText(`${fmt(count, 0)}x ${model}`, {
                    x: icx,
                    y: icy,
                    size: 12,
                    font: boldFont,
                    color: COL_TEXT_DARK
                });

                // Line 2: Stats
                // Right aligned total
                const totalText = totalCap !== undefined ? `${fmt(totalCap)} kWh Total` : 'N/A kWh';
                const totalW = boldFont.widthOfTextAtSize(totalText, 12);

                page.drawText(totalText, {
                    x: width - margin - totalW - 15,
                    y: icy,
                    size: 12,
                    font: boldFont,
                    color: COL_PRIMARY // Highlight the total
                });

                // Chemistry / Vendor
                const chemistry = getStr(item?.battery, ['chemistry']) || 'Li-ion';
                page.drawText(`${chemistry} Chemistry`, {
                    x: icx,
                    y: icy - 20,
                    size: 10,
                    font,
                    color: COL_TEXT_MUTED
                });

                y -= (cardH + 15); // Space between cards
            });

            y -= 10; // Extra space between tiers
        }
    });

    // --- Footer ---
    // Force footer to bottom of current page
    const footerY = 30;
    // If y is too low, add page? Footer shouldn't overlap.
    if (y < footerY + 20) {
        page = pdfDoc.addPage();
        drawBackground();
        // No header on pure footer page? Or keep consistency.
        drawHeader();
    }

    // Draw Footer Line
    page.drawLine({
        start: { x: margin, y: footerY + 15 },
        end: { x: width - margin, y: footerY + 15 },
        thickness: 1,
        color: COL_BORDER
    });

    page.drawText('batteryblueprint.com', {
        x: margin,
        y: footerY,
        size: 9,
        font,
        color: COL_TEXT_MUTED
    });

    const discText = 'Generated for planning purposes';
    const discW = font.widthOfTextAtSize(discText, 9);
    page.drawText(discText, {
        x: width - margin - discW,
        y: footerY,
        size: 9,
        font,
        color: COL_TEXT_MUTED
    });


    return await pdfDoc.save();
}
