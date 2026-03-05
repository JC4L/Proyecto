package com.energia.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.energia.api.dto.PercentElectricalTotalDTO;
import com.energia.api.dto.TopEnergyYearDTO;
import com.energia.api.dto.TotalProductionEnergyDTO;
import com.energia.api.dto.TrendEnergyDTO;
import com.energia.api.dto.ParticipationElectricalConsumptionDTO;
import com.energia.api.service.EnergyDataService;

@RestController
@RequestMapping("/api/energy")
public class EnergyDataController {

  private final EnergyDataService service;

  public EnergyDataController(EnergyDataService service) {
    this.service = service;
  }

  // Peticion 1: Mostrar el total por tipo de energía y año especifico
  @GetMapping("/total")
  public List<TotalProductionEnergyDTO> getTotalProductionEnergy(
      @RequestParam("energyType") String energyType,
      @RequestParam("year") Integer year,
      @RequestParam(name = "limit", defaultValue = "10") Integer limit) {
    return service.getTotalEnergy(energyType, year, limit);
  }

  // Petición 2: Porcentaje de energía electrica renovable
  @GetMapping("/percent")
  public List<PercentElectricalTotalDTO> getPercentElectricalTotal(
      @RequestParam("year") Integer year,
      @RequestParam(name = "limit", defaultValue = "10") Integer limit) {
    return service.getPercentElectricalTotal(year, limit);
  }

  // Petición 3: Método para mostrar la tendencia por tipo de energía y país
  @GetMapping("/trend")
  public List<TrendEnergyDTO> getTrendEnergy(
      @RequestParam(name = "energyType") String energyType,
      @RequestParam(name = "entityName", defaultValue = "World") String entityName,
      @RequestParam(name = "limit", defaultValue = "10") Integer limit) {
    return service.getTrendByTypeAndYear(energyType, entityName, limit);
  }

  // Petición 4: Método para mostrar el top de países con más consumo, generación
  // o compartido
  // de energía
  @GetMapping("/top")
  public List<TopEnergyYearDTO> getTopEnergy(
      @RequestParam(name = "year") Integer year,
      @RequestParam(name = "energyType", defaultValue = "Wind Generation") String energyType,
      @RequestParam(name = "limit", defaultValue = "10") Integer limit) {

    return service.getTopEnergy(energyType, year, limit);
  }

  // Petición 5: participación global de fuentes energéticas en electricidad
  @GetMapping("/participation")
  public List<ParticipationElectricalConsumptionDTO> getParticipation(
      @RequestParam(name = "entityName", defaultValue = "World") String entityName,
      @RequestParam(name = "year") Integer year,
      @RequestParam(name = "limit", defaultValue = "10") Integer limit) {

    List<String> energyTypes = List.of(
        "Share Electricity Hydro",
        "Share Electricity Wind",
        "Share Electricity Solar");

    return service.getParticipationElectricalConsumption(entityName, year, energyTypes, limit);
  }
}