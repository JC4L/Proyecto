package com.energia.api.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "fact_energy_data",
    schema = "energy",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"entity_id", "energy_type_id", "year"})
    }
)
public class FactEnergyData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private DimEntity entity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "energy_type_id", nullable = false)
    private DimEnergyType energyType;

    @Column(nullable = false)
    private Integer year;

    @Column(precision = 20, scale = 6)
    private BigDecimal value;

    public Integer getId() {
        return id;
    }

    public DimEntity getEntity() {
        return entity;
    }

    public DimEnergyType getEnergyType() {
        return energyType;
    }

    public Integer getYear() {
        return year;
    }

    public BigDecimal getValue() {
        return value;
    }
}
