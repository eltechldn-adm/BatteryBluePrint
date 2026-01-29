import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';

export async function generateBlueprintPdf(
    results: any,
    recommendations: any
): Promise<Uint8Array> {
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

    // Header
    drawLine('Battery Blueprint', boldFont, 24);
    y -= 10;
    drawLine(`Generated on: ${new Date().toLocaleDateString()}`, font, 12);
    y -= 20;

    // --- Results Section ---
    drawLine('System Analysis Results', boldFont, 16);
    y -= 10;

    const safeResults = results || {};
    // Flatten and print interesting keys if they exist, or just dump JSON
    // Let's try to format it slightly better than raw JSON if possible

    if (safeResults.batteryUsableNeeded_kWh) {
        drawLine(`Usable Battery Capacity Needed: ${safeResults.batteryUsableNeeded_kWh} kWh`, font, 12);
    }
    if (safeResults.batteryNameplateNeeded_kWh) {
        drawLine(`Nameplate Battery Capacity: ${safeResults.batteryNameplateNeeded_kWh} kWh`, font, 12);
    }
    if (safeResults.breakdown) {
        drawLine(`Daily Load Base: ${safeResults.breakdown.loadBase} kWh`);
        drawLine(`Autonomy Multiplier: ${safeResults.breakdown.autonomyMult.toFixed(2)}x`);
        drawLine(`Winter Multiplier: ${safeResults.breakdown.winterMult.toFixed(2)}x`);
        drawLine(`Buffer Multiplier: ${safeResults.breakdown.bufferMult.toFixed(2)}x`);
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
                const name = item.battery?.model || 'Unknown Model';
                const count = item.count || 0;
                const totalCap = item.totalCapacity_kWh || 0;
                // e.g. "2x Tesla Powerwall 2 (27 kWh)"
                drawLine(`• ${count}x ${name} (Total: ${totalCap} kWh)`);
            });
        }
    });

    // Fallback: If minimal info, dump JSON
    if (Object.keys(safeResults).length === 0 && (!recommendations || Object.keys(recommendations).length === 0)) {
        y -= 20;
        drawLine('Raw Data Dump (Debug):');
        const dump = JSON.stringify({ results, recommendations }, null, 2).split('\n');
        dump.forEach(line => drawLine(line, font, 8));
    }

    return await pdfDoc.save();
}
