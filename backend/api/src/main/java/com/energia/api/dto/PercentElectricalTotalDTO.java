package com.energia.api.dto;

import java.math.BigDecimal;

public class PercentElectricalTotalDTO {
    private String region;
    private Integer year;
    private String unit;
    private BigDecimal percentageRenewableEnergy;

    public PercentElectricalTotalDTO(String region, Integer year, String unit, BigDecimal percentageRenewableEnergy) {
        this.region = region;
        this.year = year;
        this.unit = unit;
        this. percentageRenewableEnergy = percentageRenewableEnergy;
    }

    public String getRegion() {
        return region;
    }
    public Integer getYear() {
        return year;
    }
    public String getUnit() {
        return unit;
    }
    public BigDecimal getPercentageRenewableEnergy() {
        return percentageRenewableEnergy;
    }

    
}
