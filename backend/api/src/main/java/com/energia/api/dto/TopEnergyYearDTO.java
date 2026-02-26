package com.energia.api.dto;

import java.math.BigDecimal;

public class TopEnergyYearDTO {

    private String country;
    private String code;
    private BigDecimal energyGenerationTwh;

    public TopEnergyYearDTO(String country, String code, BigDecimal energyGenerationTwh) {
        this.country = country;
        this.code = code;
        this.energyGenerationTwh = energyGenerationTwh;
    }

    public String getCountry() { return country; }
    public String getCode() { return code; }
    public BigDecimal getenergyGenerationTwh() { return energyGenerationTwh; }
}
