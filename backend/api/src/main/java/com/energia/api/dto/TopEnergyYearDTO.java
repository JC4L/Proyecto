package com.energia.api.dto;

import java.math.BigDecimal;

public class TopEnergyYearDTO {

    private String country;
    private String code;
    private BigDecimal energy;
    private String unit;
    private String energyType;

    public TopEnergyYearDTO(String country, String code, BigDecimal energy, String unit, String energyType) {
        this.country = country;
        this.code = code;
        this.energy = energy;
        this.unit = unit;
        this.energyType = energyType;
    }

    public String getCountry() { return country; }
    public String getCode() { return code; }
    public BigDecimal getenergy() { return energy; }
    public String getUnit() { return unit; }
    public String getEnergyType() { return energyType; }
}
