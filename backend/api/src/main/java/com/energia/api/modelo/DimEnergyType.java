package com.energia.api.modelo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "dim_energy_type", schema = "energy")
public class DimEnergyType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(length = 50)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "energyType", fetch = FetchType.LAZY)
    private List<FactEnergyData> energyData;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUnit() {
        return unit;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public List<FactEnergyData> getEnergyData() {
        return energyData;
    }
}