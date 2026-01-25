export interface BatteryModel {
    id: string;
    brand: string;
    model: string;
    nameplate_kWh_per_unit: number;
    usable_kWh_per_unit: number | null; // If null, assume DoD * nameplate
    continuous_output_kW: number | null;
    chemistry: 'LiFePO4' | 'NMC' | 'Other';
    warranty_years: number | null;
    price_range_usd: string | null; // e.g. "$8,000 - $10,000"
    category: 'Premium' | 'Mid-Range' | 'DIY/ServerRack';
    source_note: string;
}

export const BATTERY_DATABASE: BatteryModel[] = [
    {
        id: 'tesla-pw3',
        brand: 'Tesla',
        model: 'Powerwall 3',
        nameplate_kWh_per_unit: 13.5,
        usable_kWh_per_unit: 13.5, // Tesla often markets 100% DoD or integrated buffer
        continuous_output_kW: 11.5,
        chemistry: 'Other', // Proprietary optimization
        warranty_years: 10,
        price_range_usd: '$8,500 - $11,000 (Installed)',
        category: 'Premium',
        source_note: 'Tesla Datasheet 2024. Integrated inverter.'
    },
    {
        id: 'enphase-iq5p',
        brand: 'Enphase',
        model: 'IQ Battery 5P',
        nameplate_kWh_per_unit: 5.0,
        usable_kWh_per_unit: 4.96, // Often cited as ~5kWh usable
        continuous_output_kW: 3.84,
        chemistry: 'LiFePO4',
        warranty_years: 15,
        price_range_usd: '$3,500 - $5,000 (Per unit, installed)',
        category: 'Premium',
        source_note: 'Enphase 5P Datasheet. Modular.'
    },
    {
        id: 'ruixu-sible',
        brand: 'Ruixu',
        model: 'Sible 48V',
        nameplate_kWh_per_unit: 5.12,
        usable_kWh_per_unit: null,
        continuous_output_kW: 5.0,
        chemistry: 'LiFePO4',
        warranty_years: 10,
        price_range_usd: '$1,300 - $1,700',
        category: 'Mid-Range',
        source_note: 'Example Mid-Range placeholder.'
    },
    {
        id: 'eg4-lifepower4',
        brand: 'EG4',
        model: 'LifePower4 (Server Rack)',
        nameplate_kWh_per_unit: 5.12,
        usable_kWh_per_unit: null, // Standard 80-90% DoD recommended
        continuous_output_kW: 5.12, // 100A BMS
        chemistry: 'LiFePO4',
        warranty_years: 5,
        price_range_usd: '$1,300 - $1,600 (Battery only)',
        category: 'DIY/ServerRack',
        source_note: 'Signature Solar / EG4 Datasheet. Requires inverter.'
    }
];

export function getRecommendedBatteries(totalNameplateNeeded: number): BatteryModel[] {
    return BATTERY_DATABASE;
}
