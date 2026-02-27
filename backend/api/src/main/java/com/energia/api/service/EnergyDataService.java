package com.energia.api.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.energia.api.dto.PercentElectricalTotalDTO;
import com.energia.api.dto.TopEnergyYearDTO;
import com.energia.api.dto.TotalProductionEnergyDTO;
import com.energia.api.dto.TrendEnergyDTO;
import com.energia.api.dto.ParticipationElectricalConsumptionDTO;
import com.energia.api.repository.FactEnergyDataRepository;

@Service
public class EnergyDataService {

  private final FactEnergyDataRepository repository;

  public EnergyDataService(FactEnergyDataRepository repository) {
    this.repository = repository;
  }

  // Peticion 1: Producción total de energía renovable por tipo de fuente en un
  // año específico, agrupada por regiones
  public List<TotalProductionEnergyDTO> getTotalEnergy(
      String energyType,
      Integer year,
      Integer limit) {
    return repository.findTotalProductionByEnergyTypeAndYear(
        energyType,
        year,
        PageRequest.of(0, limit));
  }
  // Petición 2: Porcentaje de energía renovable en el consumo eléctrico total de cada región
  public List<PercentElectricalTotalDTO> getPercentElectricalTotal(Integer year, Integer limit) {
    return repository.findPercentElectricalTotalDTO(
      year,
      PageRequest.of(0, limit));
  }
  //Petición 3: Tendencia de la capacidad instalada de energía solar a lo largo de los años
  public List<TrendEnergyDTO> getTrendByTypeAndYear(
      String energyType,
      String entityName,
      Integer limit) {
    return repository.findTrendByEnergyTypeAndEntity(
        energyType,
        entityName,
        PageRequest.of(0, limit));
  }
  // Petición 4: Los 10 países con mayor producción de energía eólica en un año específico
  public List<TopEnergyYearDTO> getTopEnergy(
      String energyType,
      Integer year,
      Integer limit) {

    List<String> excluded = List.of("OWID_WRL");

    return repository.findTopByEnergyTypeAndYear(
        energyType,
        year,
        excluded,
        PageRequest.of(0, limit));
  }

  // Petición 5: Participación de todas las fuentes de energía en el consumo eléctrico total a nivel global
  public List<ParticipationElectricalConsumptionDTO> getParticipationElectricalConsumption(
      String entityName,
      Integer year,
      List<String> energyTypes,
      Integer limit) {
    return repository.findParticipationElectricalConsumptionDTO(
        entityName,
        year,
        energyTypes,
        PageRequest.of(0, limit));
  }
}
