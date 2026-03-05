import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    TotalProductionEnergy,
    PercentElectricalTotal,
    TrendEnergy,
    TopEnergyYear,
    ParticipationElectricalConsumption,
} from '../models/energy.models';

@Injectable({ providedIn: 'root' })
export class EnergyService {
    private readonly http = inject(HttpClient);
    private readonly BASE_URL = '/api/energy';

    /**
     * Endpoint 1: Total production by energy type and year (grouped by regions)
     */
    getTotalProduction(energyType: string, year: number, limit = 10): Observable<TotalProductionEnergy[]> {
        const params = new HttpParams()
            .set('energyType', energyType)
            .set('year', year.toString())
            .set('limit', limit.toString());
        return this.http.get<TotalProductionEnergy[]>(`${this.BASE_URL}/total`, { params });
    }

    /**
     * Endpoint 2: % of renewable energy in electrical consumption by region
     */
    getPercentElectrical(year: number, limit = 10): Observable<PercentElectricalTotal[]> {
        const params = new HttpParams()
            .set('year', year.toString())
            .set('limit', limit.toString());
        return this.http.get<PercentElectricalTotal[]>(`${this.BASE_URL}/percent`, { params });
    }

    /**
     * Endpoint 3: Temporal trend of an energy type for an entity
     */
    getTrend(energyType: string, entityName = 'World', limit = 10): Observable<TrendEnergy[]> {
        const params = new HttpParams()
            .set('energyType', energyType)
            .set('entityName', entityName)
            .set('limit', limit.toString());
        return this.http.get<TrendEnergy[]>(`${this.BASE_URL}/trend`, { params });
    }

    /**
     * Endpoint 4: Top countries by energy type in a year
     */
    getTopCountries(year: number, energyType = 'Wind Generation', limit = 10): Observable<TopEnergyYear[]> {
        const params = new HttpParams()
            .set('year', year.toString())
            .set('energyType', energyType)
            .set('limit', limit.toString());
        return this.http.get<TopEnergyYear[]>(`${this.BASE_URL}/top`, { params });
    }

    /**
     * Endpoint 5: Global participation of energy sources in electricity
     */
    getParticipation(year: number, entityName = 'World', limit = 10): Observable<ParticipationElectricalConsumption[]> {
        const params = new HttpParams()
            .set('entityName', entityName)
            .set('year', year.toString())
            .set('limit', limit.toString());
        return this.http.get<ParticipationElectricalConsumption[]>(`${this.BASE_URL}/participation`, { params });
    }
}
