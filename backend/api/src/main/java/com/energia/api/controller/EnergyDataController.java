package com.energia.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.energia.api.dto.TopEnergyYearDTO;
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
}