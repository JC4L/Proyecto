package com.energia.api.dto;

import java.math.BigDecimal;

public class TotalProductionEnergyDTO {
  private String region;
  private String energyType;
  private String unit;
  private BigDecimal total;

  public TotalProductionEnergyDTO(String region, String energyType, String unit, BigDecimal total) {
    this.region = region;
    this.energyType = energyType;
    this.unit = unit;
    this.total = total;
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
}
