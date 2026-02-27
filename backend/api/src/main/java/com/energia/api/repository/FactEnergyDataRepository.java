package com.energia.api.repository;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.energia.api.dto.ParticipationElectricalConsumptionDTO;
import com.energia.api.dto.PercentElectricalTotalDTO;
import com.energia.api.dto.TopEnergyYearDTO;
import com.energia.api.dto.TotalProductionEnergyDTO;
import com.energia.api.dto.TrendEnergyDTO;
import com.energia.api.modelo.FactEnergyData;

public interface FactEnergyDataRepository extends JpaRepository<FactEnergyData, Long> {

    // 1. Petición: Producción total de energía renovable por tipo de fuente en un
    // año específico
    // agrupada por regiones
    @Query("""
                SELECT new com.energia.api.dto.TotalProductionEnergyDTO(
                    e.name,
                    et.name,
                    f.year,
                    et.unit,
                    SUM(f.value)
                )
                FROM FactEnergyData f
                JOIN f.entity e
                JOIN f.energyType et
                WHERE f.year = :year
                    AND et.name = :energyType
                    AND e.code IS NULL
                GROUP BY e.name, et.name, f.year, et.unit
                ORDER BY et.name, SUM(f.value) DESC
            """)
    List<TotalProductionEnergyDTO> findTotalProductionByEnergyTypeAndYear(
            @Param("energyType") String energyType,
            @Param("year") Integer year,
            PageRequest pageable);

    // 2. Petición: Porcentaje de energía renovable en el consumo eléctrico total de
    // cada región
    @Query("""
            SELECT new com.energia.api.dto.PercentElectricalTotalDTO(
                e.name,
                f.year,
                et.unit,
                f.value
            )
            FROM FactEnergyData f
            JOIN f.entity e
            JOIN f.energyType et
            WHERE et.name = 'Share Electricity Renewables'
                AND f.year = :year
                AND e.code IS NULL
            """)
    List<PercentElectricalTotalDTO> findPercentElectricalTotalDTO(
            @Param("year") Integer year,
            PageRequest pageable);
    
    // 3. Petición: Tendencia de la capacidad instalada de energía solar a lo largo
    // de los años
    @Query("""
                SELECT new com.energia.api.dto.TrendEnergyDTO(
                    f.year,
                    et.unit,
                    f.value,
                    e.name
                )
                FROM FactEnergyData f
                JOIN f.energyType et
                JOIN f.entity e
                WHERE et.name = :energyType
                    AND e.name = :entityName
                ORDER BY f.year
            """)
    List<TrendEnergyDTO> findTrendByEnergyTypeAndEntity(
            @Param("energyType") String energyType,
            @Param("entityName") String entityName,
            PageRequest pageable);

    // 4. Petición: Los 10 países con mayor producción de energía eólica en un año
    // específico
    @Query("""
                SELECT new com.energia.api.dto.TopEnergyYearDTO(
                    e.name,
                    e.code,
                    f.value,
                    et.unit,
                    et.name
                )
                FROM FactEnergyData f
                JOIN f.entity e
                JOIN f.energyType et
                WHERE et.name = :energyType
                    AND f.year = :year
                    AND e.code IS NOT NULL
                    AND e.code NOT IN :excludedCodes
                ORDER BY f.value DESC
            """)
    List<TopEnergyYearDTO> findTopByEnergyTypeAndYear(
            @Param("energyType") String energyType,
            @Param("year") Integer year,
            @Param("excludedCodes") List<String> excludedCodes,
            PageRequest pageable);
    
    // 5. Participación de todas las fuentes de energía en el consumo eléctrico total 
    // a nivel global
    @Query("""
            SELECT new com.energia.api.dto.ParticipationElectricalConsumptionDTO(
                f.year,
                et.name,
                e.name,
                f.value,
                et.unit
            )
            FROM FactEnergyData f
            JOIN f.entity e
            JOIN f.energyType et
            WHERE e.name = :entityName
                AND f.year = :year
                AND et.name IN :energyTypes
            ORDER BY f.year DESC, f.value DESC
            """)
    List<ParticipationElectricalConsumptionDTO> findParticipationElectricalConsumptionDTO(
            @Param("entityName") String entityName,
            @Param("year") Integer year,
            @Param("energyTypes") List<String> energyTypes,
            PageRequest pageable);
}
