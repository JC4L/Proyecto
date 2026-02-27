package com.energia.api.dto;

import java.math.BigDecimal;

public class TotalProductionEnergyDTO {
  private String region;
  private String energyType;
  private Integer year;
  private String unit;
  private BigDecimal total;

  public TotalProductionEnergyDTO(String region, String energyType,Integer year, String unit, BigDecimal total) {
    this.region = region;
    this.energyType = energyType;
    this.unit = unit;
    this.total = total;
    this.year = year;
  }

  public String getRegion() {
    return region;
  }

  public String getEnergyType() {
    return energyType;
  }

  public String getUnit() {
    return unit;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public Integer getYear() {
    return year;
  }
}
