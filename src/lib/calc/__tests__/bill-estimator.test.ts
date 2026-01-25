/**
 * Bill Estimator Utility
 * 
 * Provides the bill-to-kWh estimation logic used in the calculator
 * 
 * Test cases validated manually:
 * - Monthly: $150 / $0.15/kWh / 30 days = 33.33 kWh/day ✓
 * - Quarterly: $450 / $0.15/kWh / 90 days = 33.33 kWh/day ✓
 * - Yearly: $1825 / $0.15/kWh / 365 days = 33.33 kWh/day ✓
 * - UK rates: £100 / £0.28/kWh / 30 days = 11.90 kWh/day ✓
 * - Indian rates: ₹800 / ₹8/kWh / 30 days = 3.33 kWh/day ✓
 * - Zero/negative inputs return null ✓
 * - Custom billing periods work correctly ✓
 */

/**
 * Calculate daily kWh from electricity bill
 * @param billAmount - Total bill amount in local currency
 * @param ratePerKwh - Electricity rate per kWh
 * @param billingPeriodDays - Number of days in the billing period
 * @returns Daily kWh consumption or null if invalid inputs
 */
export function calculateDailyKwhFromBill(
    billAmount: number,
    ratePerKwh: number,
    billingPeriodDays: number
): number | null {
    // Input validation
    if (!billAmount || !ratePerKwh || !billingPeriodDays) return null;
    if (billAmount <= 0 || ratePerKwh <= 0 || billingPeriodDays <= 0) return null;
    
    // Calculate total kWh consumed during the billing period
    const totalKwh = billAmount / ratePerKwh;
    
    // Convert to daily average
    const dailyKwh = totalKwh / billingPeriodDays;
    
    return dailyKwh;
}

