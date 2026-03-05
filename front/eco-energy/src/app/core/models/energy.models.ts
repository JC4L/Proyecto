export interface TotalProductionEnergy {
    region: string;
    energyType: string;
    year: number;
    unit: string;
    total: number;
}

export interface PercentElectricalTotal {
    region: string;
    year: number;
    unit: string;
    percentageRenewableEnergy: number;
}

export interface TrendEnergy {
    year: number;
    unit: string;
    totalSolarCapacity: number;
    country: string;
}

export interface TopEnergyYear {
    country: string;
    code: string;
    energy: number;
    unit: string;
    energyType: string;
}

export interface ParticipationElectricalConsumption {
    year: number;
    energySource: string;
    entity: string;
    sharePercent: number;
    unit: string;
}

/** Energy type definitions for dropdowns and references */
export interface EnergyType {
    id: number;
    name: string;
    unit: string;
    category: string;
}

export const ENERGY_TYPES: EnergyType[] = [
    { id: 1, name: 'Renewable Share Energy', unit: '%', category: 'General' },
    { id: 2, name: 'Geo Biomass Consumption', unit: 'TWh', category: 'Consumption' },
    { id: 3, name: 'Wind Consumption', unit: 'TWh', category: 'Consumption' },
    { id: 4, name: 'Share Electricity Renewables', unit: '%', category: 'Electricity' },
    { id: 5, name: 'Hydropower Consumption', unit: 'TWh', category: 'Consumption' },
    { id: 6, name: 'Hydro Share Energy', unit: '%', category: 'Hydro' },
    { id: 7, name: 'Share Electricity Hydro', unit: '%', category: 'Hydro' },
    { id: 8, name: 'Wind Production', unit: 'TWh', category: 'Production' },
    { id: 9, name: 'Cumulative Wind Capacity', unit: 'GW', category: 'Wind' },
    { id: 10, name: 'Wind Share Energy', unit: '%', category: 'Wind' },
    { id: 11, name: 'Share Electricity Wind', unit: '%', category: 'Wind' },
    { id: 12, name: 'Solar Energy Consumption', unit: 'TWh', category: 'Consumption' },
    { id: 13, name: 'Installed Solar PV Capacity', unit: 'GW', category: 'Solar' },
    { id: 14, name: 'Solar Share Energy', unit: '%', category: 'Solar' },
    { id: 15, name: 'Share Electricity Solar', unit: '%', category: 'Solar' },
    { id: 16, name: 'Biofuel Production', unit: 'TWh', category: 'Production' },
    { id: 17, name: 'Installed Geothermal Capacity', unit: 'GW', category: 'Geothermal' },
    { id: 18, name: 'Hydro Production', unit: 'TWh', category: 'Production' },
    { id: 19, name: 'Solar Production', unit: 'TWh', category: 'Production' },
];
