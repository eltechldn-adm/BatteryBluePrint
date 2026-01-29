import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { logger } from '@/lib/logger';

// --- Colors (Extracted from globals.css) ---
// Background: #FAF8F5 (Warm Cream)
const COL_BG = rgb(250 / 255, 248 / 255, 245 / 255);
// Primary: #E35336 (Orange/Red)
const COL_PRIMARY = rgb(227 / 255, 83 / 255, 54 / 255);
// Text Dark: #2D241E (Dark Brown)
const COL_TEXT_DARK = rgb(45 / 255, 36 / 255, 30 / 255);
// Muted Text: #6B5B4D (Medium Brown)
const COL_TEXT_MUTED = rgb(107 / 255, 91 / 255, 77 / 255);
// Muted/Border: #DCCFB8 (Beige)
const COL_BORDER = rgb(220 / 255, 207 / 255, 184 / 255);
// White: #FFFFFF
const COL_WHITE = rgb(1, 1, 1);
// Row Stripe: #F5F5F0 (Subtle offset from BG)
const COL_ROW_STRIPE = rgb(245 / 255, 245 / 255, 240 / 255);

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

    // Layout Constants
    const margin = 50;

    // Initial Page
    let page = pdfDoc.addPage();
    let { width, height } = page.getSize();
    let y = height;

    // --- Helpers ---

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
        const headerH = 100;
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
            y: height - 45,
            size: 28,
            font: boldFont,
            color: COL_WHITE,
        });

        // Subtitle
        page.drawText('Your personalised battery sizing report', {
            x: margin,
            y: height - 70,
            size: 14,
            font,
            color: COL_WHITE,
        });

        // Date
        const dateStr = new Date().toLocaleDateString();
        const dateW = font.widthOfTextAtSize(dateStr, 12);
        page.drawText(dateStr, {
            x: width - margin - dateW,
            y: height - 45,
            size: 12,
            font,
            color: COL_WHITE,
        });

        // Reset Y
        y = height - headerH - 40;
    };

    const checkPageBreak = (neededH: number) => {
        if (y - neededH < margin) {
            page = pdfDoc.addPage();
            drawBackground();
            drawHeader();
        }
    };

    const fmt = (v: unknown, dp = 2) =>
        typeof v === "number" && Number.isFinite(v) ? v.toFixed(dp) : "N/A";

    // Safe extraction
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

    // --- Start Drawing ---
    drawBackground();
    drawHeader();

    const safeResults = results || {};

    // --- Section 1: System Analysis Results ---
    const s1Height = 180;
    checkPageBreak(s1Height);

    // Section Title
    page.drawText('System Analysis Results', {
        x: margin,
        y,
        size: 18,
        font: boldFont,
        color: COL_PRIMARY,
    });
    y -= 25;

    // Card Panel
    page.drawRectangle({
        x: margin,
        y: y - s1Height + 30, // Adjust for top padding
        width: width - (margin * 2),
        height: s1Height - 30,
        color: COL_WHITE,
        borderColor: COL_BORDER,
        borderWidth: 1,
    });

    let cy = y - 20; // Card Cursor
    const cx = margin + 20;

    // Metrics to show
    const loadTarget = getNum(safeResults, ['loadTarget_kWh', 'loadTarget', 'load']);
    const usableNeeded = getNum(safeResults, ['batteryUsableNeeded_kWh', 'usableNeeded']);
    const nameplateNeeded = getNum(safeResults, ['batteryNameplateNeeded_kWh', 'nameplateNeeded']);

    // Row 1
    page.drawText('Usable Battery Capacity Needed', { x: cx, y: cy, size: 12, font: boldFont, color: COL_TEXT_DARK });
    page.drawText(`${fmt(usableNeeded)} kWh`, { x: width - margin - 150, y: cy, size: 14, font: boldFont, color: COL_PRIMARY });
    cy -= 25;
    page.drawText('Accounts for inverter efficiency losses', { x: cx, y: cy, size: 10, font, color: COL_TEXT_MUTED });
    cy -= 30;

    // Row 2
    page.drawText('Recommended Nameplate Capacity', { x: cx, y: cy, size: 12, font: boldFont, color: COL_TEXT_DARK });
    page.drawText(`${fmt(nameplateNeeded)} kWh`, { x: width - margin - 150, y: cy, size: 14, font: boldFont, color: COL_TEXT_DARK });
    cy -= 25;
    page.drawText('Adjusted for depth-of-discharge (DoD) to protect battery life', { x: cx, y: cy, size: 10, font, color: COL_TEXT_MUTED });
    cy -= 30;

    // Parameters (Row 3 - smaller)
    const breakdown = safeResults?.breakdown;
    if (breakdown) {
        const load = getNum(breakdown, ['loadBase', 'baseLoad']);
        const autonomy = getNum(breakdown, ['autonomyMult']);
        const winter = getNum(breakdown, ['winterMult']);

        let pText = `Based on: ${fmt(load)} kWh/day, ${fmt(autonomy)} days autonomy`;
        if (winter && winter > 1) pText += `, Winter Mode`;

        page.drawLine({ start: { x: cx, y: cy + 10 }, end: { x: width - margin - 20, y: cy + 10 }, thickness: 1, color: COL_BORDER });
        page.drawText(pText, { x: cx, y: cy - 5, size: 10, font, color: COL_TEXT_MUTED });
    }

    y -= s1Height;


    // --- Section 2: Recommended Batteries ---
    y -= 30;
    checkPageBreak(50);

    page.drawText('Recommended Batteries', {
        x: margin,
        y,
        size: 18,
        font: boldFont,
        color: COL_PRIMARY,
    });
    y -= 30;

    const tiers = ['premium', 'midRange', 'diy'];
    const tierLabels: Record<string, string> = { premium: 'Premium', midRange: 'Mid-Range', diy: 'DIY / Budget' };
    const tierWhy: Record<string, string> = { premium: 'Best warranty + integrated inverter', midRange: 'Great value + reliable performance', diy: 'Lowest cost per kWh' };

    tiers.forEach(tierKey => {
        const items = recommendations?.[tierKey];
        if (Array.isArray(items) && items.length > 0) {

            checkPageBreak(80);

            // Tier Box
            // Gray-ish header bar for the tier
            const tierHeaderH = 30;
            page.drawRectangle({
                x: margin,
                y: y - tierHeaderH,
                width: width - (margin * 2),
                height: tierHeaderH,
                color: COL_TEXT_DARK, // Dark header
            });

            const tierLabel = tierLabels[tierKey] || tierKey;
            page.drawText(tierLabel, {
                x: margin + 10,
                y: y - 20,
                size: 12,
                font: boldFont,
                color: COL_WHITE,
            });

            const why = tierWhy[tierKey];
            if (why) {
                const wW = font.widthOfTextAtSize(why, 10);
                page.drawText(why, {
                    x: width - margin - wW - 10,
                    y: y - 20,
                    size: 10,
                    font,
                    color: rgb(0.8, 0.8, 0.8),
                });
            }

            y -= tierHeaderH;

            // List Items (Table Style)
            items.forEach((item: any, idx: number) => {
                const rowH = 50;
                checkPageBreak(rowH); // Ensure row fits

                // Alternating background
                if (idx % 2 === 0) {
                    page.drawRectangle({
                        x: margin,
                        y: y - rowH,
                        width: width - (margin * 2),
                        height: rowH,
                        color: COL_ROW_STRIPE
                    });
                } else {
                    page.drawRectangle({
                        x: margin,
                        y: y - rowH,
                        width: width - (margin * 2),
                        height: rowH,
                        color: COL_WHITE
                    });
                }
                // Row Border
                page.drawRectangle({
                    x: margin,
                    y: y - rowH,
                    width: width - (margin * 2),
                    height: rowH,
                    color: undefined,
                    borderColor: COL_BORDER,
                    borderWidth: 0.5,
                });

                // Data
                const model = getStr(item?.battery, ['model', 'name']) || getStr(item, ['model', 'name']) || 'Unknown Model';
                const brand = getStr(item?.battery, ['brand']) || '';
                const count = getNum(item, ['count', 'units', 'quantity']) || 0;
                let totalCap = getNum(item, ['totalCapacity_kWh', 'totalCapacityKWh', 'totalUsable_kWh', 'total_kWh']);

                // Approx calc if missing
                if (totalCap === undefined) {
                    const unit = getNum(item?.battery, ['capacity_kWh', 'usable_kWh']);
                    if (unit && count) totalCap = unit * count;
                }

                let textY = y - 30;

                // Count + Name
                page.drawText(`${fmt(count, 0)}x`, { x: margin + 15, y: textY, size: 14, font: boldFont, color: COL_PRIMARY });
                page.drawText(`${brand} ${model}`, { x: margin + 50, y: textY, size: 12, font: boldFont, color: COL_TEXT_DARK });

                // Total
                if (totalCap !== undefined) {
                    const tStr = `${fmt(totalCap)} kWh Total`;
                    const tW = boldFont.widthOfTextAtSize(tStr, 12);
                    page.drawText(tStr, { x: width - margin - tW - 15, y: textY, size: 12, font: boldFont, color: COL_TEXT_DARK });
                }

                y -= rowH;
            });

            y -= 25; // Space after tier
        }
    });

    // --- Footer ---
    const footerY = 40;
    if (y < footerY + 20) {
        page = pdfDoc.addPage();
        drawBackground();
        // Skip header on pure footer page or keep minimal?
    }

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
        font: boldFont,
        color: COL_PRIMARY
    });

    page.drawText(`Generated on ${new Date().toLocaleDateString()} • For planning purposes only`, {
        x: margin + 120,
        y: footerY,
        size: 9,
        font,
        color: COL_TEXT_MUTED
    });


    return await pdfDoc.save();
}
