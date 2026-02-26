package com.energia.api.dto;

import java.math.BigDecimal;

public class TrendEnergyDTO {
  private Integer year;
  private String unit;
  private BigDecimal totalSolarCapacity;
  private String country;

  public TrendEnergyDTO(Integer year, String unit, BigDecimal totalSolarCapacity, String country) {
    this.year = year;
    this.unit = unit;
    this.totalSolarCapacity = totalSolarCapacity;
    this.country = country;
  }

  public Integer getYear() {
    return year;
  }

  public String getUnit() {
    return unit;
  }

  public BigDecimal getTotalSolarCapacity() {
    return totalSolarCapacity;
  }

  public String getCountry() {
    return country;
  }
}
