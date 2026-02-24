package com.energia.api.dto;

import java.math.BigDecimal;

public class TopEnergyYearDTO {

    private String country;
    private String code;
    private BigDecimal windGenerationTwh;

    public TopEnergyYearDTO(String country, String code, BigDecimal windGenerationTwh) {
        this.country = country;
        this.code = code;
        this.windGenerationTwh = windGenerationTwh;
    }

    public String getCountry() { return country; }
    public String getCode() { return code; }
    public BigDecimal getWindGenerationTwh() { return windGenerationTwh; }
}
