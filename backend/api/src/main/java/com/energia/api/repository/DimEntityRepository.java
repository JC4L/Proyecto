package com.energia.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.energia.api.modelo.DimEntity;

public interface DimEntityRepository extends JpaRepository<DimEntity, Long> {

}
