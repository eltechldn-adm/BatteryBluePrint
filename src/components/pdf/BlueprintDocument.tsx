import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SizingResult } from '@/lib/calc/battery-sizing';
import { RecommendationResult } from '@/lib/calc/recommend-batteries';

// Create styles - READABILITY OPTIMIZED
const styles = StyleSheet.create({
    page: {
        padding: 28,
        fontFamily: 'Helvetica',
        fontSize: 11,
        color: '#333',
        lineHeight: 1.3,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: '#E35336',
        paddingBottom: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E35336',
        lineHeight: 1.2,
    },
    subtitle: {
        fontSize: 9,
        color: '#666',
        lineHeight: 1.2,
    },
    section: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#F5F5DC',
        borderRadius: 3,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#2D241E',
        borderBottomWidth: 1,
        borderBottomColor: '#DCCFB8',
        paddingBottom: 3,
        lineHeight: 1.2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
        lineHeight: 1.3,
    },
    label: {
        color: '#666',
        width: '62%',
        fontSize: 11,
    },
    value: {
        fontWeight: 'bold',
        width: '38%',
        textAlign: 'right',
        fontSize: 11,
    },
    note: {
        fontSize: 9,
        color: '#666',
        marginTop: 2,
        lineHeight: 1.3,
    },
    // Hardware table-like layout
    hardwareTable: {
        marginBottom: 8,
    },
    hardwareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 8,
        marginBottom: 6,
        borderRadius: 3,
        borderLeftWidth: 4,
    },
    hardwareLeft: {
        width: '65%',
        paddingRight: 8,
    },
    hardwareRight: {
        width: '35%',
        textAlign: 'right',
    },
    tierLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 2,
        lineHeight: 1.2,
    },
    modelName: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 3,
        lineHeight: 1.3,
    },
    hardwareDetails: {
        fontSize: 9,
        color: '#666',
        lineHeight: 1.3,
    },
    hardwareValue: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
        lineHeight: 1.2,
    },
    hardwareUsable: {
        fontSize: 10,
        color: '#666',
        lineHeight: 1.2,
    },
    premiumBorder: { borderLeftColor: '#E35336' },
    midBorder: { borderLeftColor: '#F4A460' },
    diyBorder: { borderLeftColor: '#A0522D' },
    // Checklist 2-column grid
    checklistContainer: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#F5F5DC',
        borderRadius: 3,
    },
    checklistGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 14,
    },
    checklistColumn: {
        width: '48%',
    },
    checklistItem: {
        flexDirection: 'row',
        marginBottom: 6,
        lineHeight: 1.3,
    },
    bullet: {
        width: 18,
        color: '#E35336',
        fontWeight: 'bold',
        fontSize: 11,
        lineHeight: 1.3,
    },
    checklistText: {
        fontSize: 10.5,
        flex: 1,
        lineHeight: 1.3,
    },
    // Disclaimer
    disclaimerContainer: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    disclaimerText: {
        fontSize: 9.5,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 1.4,
    },
});

interface BlueprintDocumentProps {
    results: SizingResult;
    recommendations: RecommendationResult;
}

export function BlueprintDocument({ results, recommendations }: BlueprintDocumentProps) {
    const date = new Date().toLocaleDateString();

    // Split checklist items into two columns
    const checklistItems = [
        'Confirm inverter output (kW) exceeds peak load',
        'Verify fire codes for battery placement',
        'Ask about "island mode" gateway hardware',
        'Check generator integration support',
    ];
    const midpoint = Math.ceil(checklistItems.length / 2);
    const leftColumn = checklistItems.slice(0, midpoint);
    const rightColumn = checklistItems.slice(midpoint);

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>BatteryBlueprint</Text>
                        <Text style={styles.subtitle}>Engineering-Grade Solar Sizing</Text>
                    </View>
                    <Text style={styles.subtitle}>{date}</Text>
                </View>

                {/* Requirements Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Project Requirements</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Average Daily Load:</Text>
                        <Text style={styles.value}>{results.breakdown.loadBase} kWh</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Days of Autonomy:</Text>
                        <Text style={styles.value}>{results.breakdown.autonomyMult} Days</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Winter Buffer:</Text>
                        <Text style={styles.value}>{results.breakdown.winterMult > 1 ? "+20%" : "Off"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Safety Reserve:</Text>
                        <Text style={styles.value}>15%</Text>
                    </View>
                </View>

                {/* Results Metrics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Sizing Results</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Load Energy Target (AC):</Text>
                        <Text style={styles.value}>{results.loadTarget_kWh} kWh</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Battery Usable Needed (DC):</Text>
                        <Text style={styles.value}>{results.batteryUsableNeeded_kWh} kWh</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Recommended Nameplate:</Text>
                        <Text style={styles.value}>{results.batteryNameplateNeeded_kWh} kWh</Text>
                    </View>
                    <Text style={styles.note}>
                        Accounts for 90% inverter efficiency & 80% DoD over {results.breakdown.autonomyMult} days with buffers.
                    </Text>
                </View>

                {/* Hardware Recommendations - Table Layout */}
                <View style={styles.hardwareTable}>
                    <Text style={styles.sectionTitle}>3. Recommended Hardware</Text>

                    {/* Premium Tier */}
                    {recommendations.premium.length > 0 ? (
                        recommendations.premium.slice(0, 3).map((rec, index) => (
                            <View key={rec.battery.id} style={[styles.hardwareRow, styles.premiumBorder]}>
                                <View style={styles.hardwareLeft}>
                                    <Text style={styles.tierLabel}>PREMIUM{index === 0 ? '' : ` (Option ${index + 1})`}</Text>
                                    <Text style={styles.modelName}>{rec.battery.brand} {rec.battery.model}</Text>
                                    <Text style={styles.hardwareDetails}>
                                        {rec.battery.chemistry} • {rec.battery.warrantyYears ? `${rec.battery.warrantyYears}yr warranty` : 'Warranty varies'}
                                        {rec.battery.continuousKwPerUnit ? ` • ${rec.battery.continuousKwPerUnit}kW output` : ''}
                                    </Text>
                                </View>
                                <View style={styles.hardwareRight}>
                                    <Text style={styles.hardwareValue}>{rec.count} Units</Text>
                                    <Text style={styles.hardwareUsable}>{rec.totalUsable_kWh.toFixed(1)} kWh usable</Text>
                                    {rec.battery.nameplateKwhPerUnit && (
                                        <Text style={styles.hardwareUsable}>{(rec.battery.nameplateKwhPerUnit * rec.count).toFixed(1)} kWh nameplate</Text>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={[styles.hardwareRow, styles.premiumBorder]}>
                            <Text style={styles.note}>No matching premium batteries found for this region.</Text>
                        </View>
                    )}

                    {/* Mid-Range Tier */}
                    {recommendations.midRange.length > 0 ? (
                        recommendations.midRange.slice(0, 3).map((rec, index) => (
                            <View key={rec.battery.id} style={[styles.hardwareRow, styles.midBorder]}>
                                <View style={styles.hardwareLeft}>
                                    <Text style={styles.tierLabel}>MID-RANGE{index === 0 ? '' : ` (Option ${index + 1})`}</Text>
                                    <Text style={styles.modelName}>{rec.battery.brand} {rec.battery.model}</Text>
                                    <Text style={styles.hardwareDetails}>
                                        {rec.battery.chemistry} • {rec.battery.warrantyYears ? `${rec.battery.warrantyYears}yr warranty` : 'Warranty varies'}
                                        {rec.battery.continuousKwPerUnit ? ` • ${rec.battery.continuousKwPerUnit}kW output` : ''}
                                    </Text>
                                </View>
                                <View style={styles.hardwareRight}>
                                    <Text style={styles.hardwareValue}>{rec.count} Units</Text>
                                    <Text style={styles.hardwareUsable}>{rec.totalUsable_kWh.toFixed(1)} kWh usable</Text>
                                    {rec.battery.nameplateKwhPerUnit && (
                                        <Text style={styles.hardwareUsable}>{(rec.battery.nameplateKwhPerUnit * rec.count).toFixed(1)} kWh nameplate</Text>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={[styles.hardwareRow, styles.midBorder]}>
                            <Text style={styles.note}>No matching mid-range batteries found for this region.</Text>
                        </View>
                    )}

                    {/* DIY Tier */}
                    {recommendations.diy.length > 0 ? (
                        recommendations.diy.slice(0, 3).map((rec, index) => (
                            <View key={rec.battery.id} style={[styles.hardwareRow, styles.diyBorder]}>
                                <View style={styles.hardwareLeft}>
                                    <Text style={styles.tierLabel}>DIY / RACK MOUNT{index === 0 ? '' : ` (Option ${index + 1})`}</Text>
                                    <Text style={styles.modelName}>{rec.battery.brand} {rec.battery.model}</Text>
                                    <Text style={styles.hardwareDetails}>
                                        {rec.battery.chemistry} • {rec.battery.warrantyYears ? `${rec.battery.warrantyYears}yr warranty` : 'Warranty varies'}
                                        {rec.battery.continuousKwPerUnit ? ` • ${rec.battery.continuousKwPerUnit}kW output` : ''}
                                    </Text>
                                </View>
                                <View style={styles.hardwareRight}>
                                    <Text style={styles.hardwareValue}>{rec.count} Units</Text>
                                    <Text style={styles.hardwareUsable}>{rec.totalUsable_kWh.toFixed(1)} kWh usable</Text>
                                    {rec.battery.nameplateKwhPerUnit && (
                                        <Text style={styles.hardwareUsable}>{(rec.battery.nameplateKwhPerUnit * rec.count).toFixed(1)} kWh nameplate</Text>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={[styles.hardwareRow, styles.diyBorder]}>
                            <Text style={styles.note}>No matching DIY batteries found for this region.</Text>
                        </View>
                    )}
                </View>

                {/* Checklist - True 2-Column Grid */}
                <View style={styles.checklistContainer}>
                    <Text style={styles.sectionTitle}>4. Construction Checklist</Text>
                    <View style={styles.checklistGrid}>
                        <View style={styles.checklistColumn}>
                            {leftColumn.map((item, index) => (
                                <View key={index} style={styles.checklistItem}>
                                    <Text style={styles.bullet}>[ ]</Text>
                                    <Text style={styles.checklistText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.checklistColumn}>
                            {rightColumn.map((item, index) => (
                                <View key={index} style={styles.checklistItem}>
                                    <Text style={styles.bullet}>[ ]</Text>
                                    <Text style={styles.checklistText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Disclaimer - Properly Positioned Footer */}
                <View style={styles.disclaimerContainer}>
                    <Text style={styles.disclaimerText}>
                        Disclaimer: Engineering estimate only. Actual requirements may vary based on local codes, surge loads, and site conditions. Consult a licensed electrician before purchasing.
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
