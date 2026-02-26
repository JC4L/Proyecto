package com.energia.api.modelo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "dim_entities", schema = "energy")
public class DimEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 50)
    private String code;

    @OneToMany(mappedBy = "entity", fetch = FetchType.LAZY)
    private List<FactEnergyData> energyData;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public List<FactEnergyData> getEnergyData() {
        return energyData;
    }
}