package com.energia.api.repository;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.energia.api.dto.TopEnergyYearDTO;
import com.energia.api.modelo.FactEnergyData;

public interface FactEnergyDataRepository extends JpaRepository<FactEnergyData, Long> {

  // Petición: Los 10 países con mayor producción de energía eólica en un año
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
}
