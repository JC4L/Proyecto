package com.energia.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.energia.api.dto.TopEnergyYearDTO;
import com.energia.api.dto.TotalProductionEnergyDTO;
import com.energia.api.dto.TrendEnergyDTO;
import com.energia.api.service.EnergyDataService;

@RestController
@RequestMapping("/api/energy")
public class EnergyDataController {

  private final EnergyDataService service;

  public EnergyDataController(EnergyDataService service) {
    this.service = service;
  }

  // Método para mostrar el top de países con más consumo, generación o compartido de energía
  @GetMapping("/top")
  public List<TopEnergyYearDTO> getTopEnergy(
      @RequestParam Integer year,
      @RequestParam(defaultValue = "Wind Generation") String energyType,
      @RequestParam(defaultValue = "10") Integer limit) {

    return service.getTopEnergy(energyType, year, limit);
  }
  // Método para mostrar el total por tipo de energía y año especifico
  @GetMapping("/total")
  public List<TotalProductionEnergyDTO> getTotalProductionEnergy(
    @RequestParam String energyType,
    @RequestParam Integer year,
    @RequestParam(defaultValue = "10") Integer limit
  ) {
    return service.getTotalEnergy(energyType, year, limit);
  }
  // Método para mostrar la tendencia por tipo de energía y país
  @GetMapping("/trend")
  public List<TrendEnergyDTO> getTrendEnergy(
    @RequestParam String energyType,
    @RequestParam(defaultValue = "World") String entityName,
    @RequestParam(defaultValue = "10") Integer limit
  ) {
    return service.getTrendByTypeAndYear(energyType, entityName, limit);
  }
  
}