package com.energia.api.dto;

import java.math.BigDecimal;

public class ParticipationElectricalConsumptionDTO {
  private Integer year;
  private String energySource;
  private String entity;
  private BigDecimal sharePercent;
  private String unit;

  public ParticipationElectricalConsumptionDTO(Integer year, String energySource, String entity, BigDecimal sharePercent, String unit) {
    this.year = year;
    this.energySource = energySource;
    this.entity = entity;
    this.sharePercent = sharePercent;
    this.unit = unit;
  }

  public Integer getYear() {
    return year;
  }

  public String getEnergySource() {
    return energySource;
  }

  public BigDecimal getSharePercent() {
    return sharePercent;
  }

  public String getUnit() {
    return unit;
  }

  public String getEntity() {
    return entity;
  }
  
}
