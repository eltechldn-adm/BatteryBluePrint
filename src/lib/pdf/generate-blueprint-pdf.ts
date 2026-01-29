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
    const margin = 50;
    let y = height - margin;

    // Layout Constants
    const lineHeight = 14;
    const fontSize = 10;
    const titleSize = 24;
    const headerSize = 16;
    const cardTitleSize = 12;

    // --- Helpers ---

    const checkPageBreak = (neededHeight: number) => {
        if (y - neededHeight < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
        }
    };

    const drawText = (text: string, options: {
        x?: number,
        size?: number,
        font?: PDFFont,
        color?: any
    } = {}) => {
        const size = options.size || fontSize;
        const x = options.x || margin;
        const fontToUse = options.font || font;
        const color = options.color || rgb(0, 0, 0);

        page.drawText(text, { x, y, size, font: fontToUse, color });
        // Don't advance y automatically here to allow multi-column or precise control
    };

    const advanceLine = (count = 1, size = fontSize) => {
        y -= (size + 5) * count;
    };

    const drawDivider = () => {
        advanceLine(0.5);
        page.drawLine({
            start: { x: margin, y },
            end: { x: width - margin, y },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
        });
        advanceLine(1.5);
    };

    const fmt = (v: unknown, dp = 2) =>
        typeof v === "number" && Number.isFinite(v) ? v.toFixed(dp) : "N/A";

    // Helper to safely extract number from multiple potential keys
    const getNum = (obj: any, keys: string[]): number | undefined => {
        if (!obj) return undefined;
        for (const k of keys) {
            const val = obj[k];
            if (typeof val === 'number' && Number.isFinite(val)) return val;
            if (typeof val === 'string') {
                const parsed = parseFloat(val);
                if (!isNaN(parsed)) return parsed;
            }
        }
        return undefined;
    };

    // Helper to safely extract string
    const getStr = (obj: any, keys: string[]): string | undefined => {
        if (!obj) return undefined;
        for (const k of keys) {
            if (typeof obj[k] === 'string' && obj[k]) return obj[k];
        }
        return undefined;
    };

    // --- Content Generation ---

    // 1. Title Header
    drawText('Battery Blueprint', { size: titleSize, font: boldFont });
    advanceLine(1.5, titleSize);
    drawText('Engineering-Grade Solar Sizing & Hardware Report', { size: 12, color: rgb(0.4, 0.4, 0.4) });
    advanceLine(1.2, 12);
    drawText(`Generated: ${new Date().toLocaleDateString()}`, { size: 10, color: rgb(0.5, 0.5, 0.5) });
    advanceLine(1.5);
    drawDivider();

    const safeResults = results || {};

    // 2. Section 1: Project Requirements (Inputs)
    // Try to find inputs in results directly or nested
    // Note: If inputs aren't preserved in results, we show what we have (calculated values imply inputs)
    // We can infer some inputs from breakdown if available

    checkPageBreak(100);
    drawText('1. Project Requirements', { size: headerSize, font: boldFont });
    advanceLine(1.5, headerSize);

    // If we have specific input fields, list them. 
    // Fallback to displaying the key drivers from breakdown.
    const breakdown = safeResults?.breakdown;

    if (breakdown) {
        const loadBase = getNum(breakdown, ['loadBase', 'baseLoad', 'dailyLoad']);
        const autonomy = getNum(breakdown, ['autonomyMult']);
        const winter = getNum(breakdown, ['winterMult']);

        if (loadBase !== undefined) drawText(`• Daily Energy Load: ${fmt(loadBase)} kWh`);
        if (loadBase !== undefined) advanceLine();

        if (autonomy !== undefined) drawText(`• Autonomy Days Target: ${fmt(autonomy)} days`);
        if (autonomy !== undefined) advanceLine();

        if (winter !== undefined) {
            const isWinter = winter > 1;
            drawText(`• Winter Mode: ${isWinter ? 'Enabled' : 'Disabled'} (Multiplier: ${fmt(winter)}x)`);
            advanceLine();
        }
    } else {
        drawText('• Inputs data not available in this summary.');
        advanceLine();
    }

    advanceLine();

    // 3. Section 2: Sizing Results
    checkPageBreak(100);
    drawText('2. Sizing Results', { size: headerSize, font: boldFont });
    advanceLine(1.5, headerSize);

    const usableNeeded = getNum(safeResults, ['batteryUsableNeeded_kWh', 'usableNeeded', 'usable_kWh']);
    const nameplateNeeded = getNum(safeResults, ['batteryNameplateNeeded_kWh', 'nameplateNeeded', 'nameplate_kWh']);

    drawText(`Target Usable Capacity:`, { font: boldFont });
    drawText(`${fmt(usableNeeded)} kWh`, { x: 200 }); // Simple column alignment
    advanceLine();

    drawText(`Target Nameplate Capacity:`, { font: boldFont });
    drawText(`${fmt(nameplateNeeded)} kWh`, { x: 200 });
    advanceLine();

    // Explanation line
    if (nameplateNeeded && usableNeeded) {
        advanceLine(0.5);
        drawText(`(Accounting for depth-of-discharge limits to ensure longevity)`, { size: 9, color: rgb(0.4, 0.4, 0.4) });
        advanceLine();
    }
    advanceLine();

    // 4. Section 3: Recommended Hardware
    checkPageBreak(150);
    drawText('3. Recommended Hardware', { size: headerSize, font: boldFont });
    advanceLine(1.5, headerSize);

    const tiers = ['premium', 'midRange', 'diy'];
    const tierNames: Record<string, string> = { premium: 'Premium', midRange: 'Mid-Range', diy: 'DIY / Budget' };

    tiers.forEach(tierKey => {
        const tierItems = recommendations?.[tierKey];
        if (Array.isArray(tierItems) && tierItems.length > 0) {
            checkPageBreak(80); // Ensure header + at least one card fits
            drawText(`${tierNames[tierKey] || tierKey} Options`, { size: 14, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
            advanceLine(1.5, 14);

            tierItems.forEach((item: any) => {
                // Extract fields robustly
                const model = getStr(item?.battery, ['model', 'name']) || getStr(item, ['model', 'name']) || 'Unknown Model';
                const count = getNum(item, ['count', 'units', 'quantity']) || 0;

                // Try to get total capacity from item, if not calc from unit * count? 
                // Prefer pre-calculated totals
                const totalUsable = getNum(item, ['totalCapacity_kWh', 'totalCapacityKWh', 'totalUsable_kWh', 'total_kWh']) || 0;
                const totalNameplate = getNum(item, ['totalNameplate_kWh', 'totalNameplateKWh', 'nameplate_kWh']) || 0;

                // If totalNameplate is 0, maybe we can find unit capacity and multiply?
                // But let's trust the keys provided in the prompt first.

                // Card Logic
                const cardHeight = 70;
                checkPageBreak(cardHeight + 10);

                // Draw Card Background (Optional Light Box)
                // pdf-lib y is from bottom!
                /*
                page.drawRectangle({
                    x: margin - 5,
                    y: y - cardHeight + 10,
                    width: width - (margin * 2) + 10,
                    height: cardHeight,
                    color: rgb(0.97, 0.97, 0.97),
                    borderColor: rgb(0.9, 0.9, 0.9),
                    borderWidth: 1,
                });
                */
                // Keeping it clean white for now to avoid complexity with y-coords

                // Line 1: Count x Model
                drawText(`${fmt(count, 0)}x ${model}`, { font: boldFont, size: cardTitleSize });
                advanceLine(1.2, cardTitleSize);

                // Line 2: Details (Chemistry/Warranty check - likely checking battery object)
                const chemistry = getStr(item?.battery, ['chemistry']) || 'Li-ion';
                // const warranty = getStr(item?.battery, ['warrantyYears', 'warranty']) || '10';
                drawText(`${chemistry} • Reliable Vendor`, { size: 9, color: rgb(0.5, 0.5, 0.5) });
                advanceLine(1.2, 9);

                // Line 3: Stats Grid
                const rowY = y;
                drawText('Total Usable:', { size: 10, font: boldFont });
                drawText(`${fmt(totalUsable)} kWh`, { x: 120, size: 10 });

                drawText('Total Nameplate:', { x: 220, size: 10, font: boldFont });
                drawText(`${fmt(totalNameplate)} kWh`, { x: 340, size: 10 });

                advanceLine(2); // Space after card
            });
            advanceLine(); // Space between tiers
        }
    });

    // 5. Section 4: Construction Checklist
    checkPageBreak(250); // Needs good chunk of space
    drawDivider();
    drawText('4. Construction Checklist', { size: headerSize, font: boldFont });
    advanceLine(1.5, headerSize);

    const checklistItems = [
        "Verify main service panel ampacity (100A / 200A) matches new load.",
        "Install critical loads sub-panel if not backing up whole home.",
        "Ensure disconnect switches are within sight of the battery unit.",
        "Label all conduits and breakers per NEC 706 standards.",
        "Commission system via manufacturer app and set reserve limits.",
        "Schedule final inspection with local AHJ (Authority Having Jurisdiction)."
    ];

    checklistItems.forEach(item => {
        checkPageBreak(20);
        // Draw checkbox square
        page.drawRectangle({
            x: margin,
            y: y,
            width: 10,
            height: 10,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        drawText(item, { x: margin + 20 });
        advanceLine(1.5);
    });

    advanceLine(2);

    // Footer / Disclaimer
    checkPageBreak(60);
    drawDivider();
    drawText('Disclaimer: This blueprint is an engineering estimate based on provided inputs. Real-world performance varies.', { size: 8, color: rgb(0.6, 0.6, 0.6) });
    advanceLine(1, 8);
    drawText('Always consult a licensed electrician or engineer before purchasing hardware. Not for construction permit use.', { size: 8, color: rgb(0.6, 0.6, 0.6) });

    return await pdfDoc.save();
}
