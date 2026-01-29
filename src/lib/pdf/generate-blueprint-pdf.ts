import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { logger } from '@/lib/logger';

export async function generateBlueprintPdf(
    results: any,
    recommendations: any
): Promise<Uint8Array> {

    // Debug logging to inspect incoming payload structure
    logger.info("PDF payload keys", {
        resultsKeys: Object.keys(results || {}),
        recKeys: Object.keys(recommendations || {})
    });

    const pdfDoc = await PDFDocument.create();

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Initial page
    let page = pdfDoc.addPage();
    let { width, height } = page.getSize();
    let y = height - 50;
    const margin = 50;
    const lineHeight = 15;
    const fontSize = 10;

    // Helper to add text and handle pagination
    const checkPageBreak = () => {
        if (y < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
        }
    };

    const drawLine = (text: string, fontToUse: PDFFont = font, size: number = fontSize) => {
        checkPageBreak();
        page.drawText(text, {
            x: margin,
            y,
            size,
            font: fontToUse,
            color: rgb(0, 0, 0),
        });
        y -= (size + 5);
    };

    // Safe formatter for numbers
    const fmt = (v: unknown, dp = 2) =>
        typeof v === "number" && Number.isFinite(v) ? v.toFixed(dp) : "N/A";

    // Header
    drawLine('Battery Blueprint', boldFont, 24);
    y -= 10;
    drawLine(`Generated on: ${new Date().toLocaleDateString()}`, font, 12);
    y -= 20;

    // --- Results Section ---
    drawLine('System Analysis Results', boldFont, 16);
    y -= 10;

    const safeResults = results || {};

    // Use optional chaining and nullish coalescing for safety
    if (safeResults?.batteryUsableNeeded_kWh !== undefined) {
        drawLine(`Usable Battery Capacity Needed: ${fmt(safeResults.batteryUsableNeeded_kWh)} kWh`, font, 12);
    }
    if (safeResults?.batteryNameplateNeeded_kWh !== undefined) {
        drawLine(`Nameplate Battery Capacity: ${fmt(safeResults.batteryNameplateNeeded_kWh)} kWh`, font, 12);
    }

    if (safeResults?.breakdown) {
        // Safe access to nested properties
        const b = safeResults.breakdown;
        drawLine(`Daily Load Base: ${fmt(b?.loadBase, 2)} kWh`);
        drawLine(`Autonomy Multiplier: ${fmt(b?.autonomyMult)}x`);
        drawLine(`Winter Multiplier: ${fmt(b?.winterMult)}x`);
        drawLine(`Buffer Multiplier: ${fmt(b?.bufferMult)}x`);
    }

    y -= 20;

    // --- Recommendations Section ---
    checkPageBreak();
    drawLine('Recommended Batteries', boldFont, 16);
    y -= 10;

    const tiers = ['premium', 'midRange', 'diy'];
    const tierNames: Record<string, string> = { premium: 'Premium', midRange: 'Mid-Range', diy: 'DIY / Budget' };

    tiers.forEach(tierKey => {
        const tierItems = recommendations?.[tierKey];
        if (Array.isArray(tierItems) && tierItems.length > 0) {
            y -= 10;
            checkPageBreak();
            drawLine(`${tierNames[tierKey] || tierKey} Options`, boldFont, 14);

            tierItems.forEach((item: any) => {
                const name = item?.battery?.model || 'Unknown Model';
                const count = item?.count || 0;
                const totalCap = item?.totalCapacity_kWh || 0;

                // e.g. "2x Tesla Powerwall 2 (27 kWh)"
                drawLine(`• ${count}x ${name} (Total: ${fmt(totalCap)} kWh)`);
            });
        }
    });

    // Fallback: If minimal info, dump JSON
    if (Object.keys(safeResults).length === 0 && (!recommendations || Object.keys(recommendations).length === 0)) {
        y -= 20;
        drawLine('Raw Data Dump (Debug):');
        // Ensure circular references don't crash JSON.stringify (though unlikely here)
        try {
            const dump = JSON.stringify({ results, recommendations }, null, 2).split('\n');
            dump.forEach(line => drawLine(line, font, 8));
        } catch (e) {
            drawLine('Error dumping raw data', font, 8);
        }
    }

    return await pdfDoc.save();
}
