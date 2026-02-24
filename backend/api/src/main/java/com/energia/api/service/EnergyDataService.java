package com.energia.api.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.energia.api.dto.TopEnergyYearDTO;
import com.energia.api.repository.FactEnergyDataRepository;

@Service
public class EnergyDataService {

  private final FactEnergyDataRepository repository;

  public EnergyDataService(FactEnergyDataRepository repository) {
    this.repository = repository;
  }

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
}
