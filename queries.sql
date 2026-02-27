-- =====================================================
-- CONSULTAS ANALÍTICAS PARA DATOS DE ENERGÍA RENOVABLE
-- =====================================================

-- 1. Producción total de energía renovable por tipo de fuente en un año específico, agrupada por regiones
-- ==============================================================================================================
-- Nota: Las entidades sin código ISO son regiones (Africa, Europe, World, etc.)
SELECT 
    e.name AS region,
    et.name AS energy_type,
    et.unit,
    SUM(ed.value) AS total_value
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE ed.year = 2018  AND et.name = 'Wind Production'
    AND e.code IS NULL  -- Regiones (sin código ISO)
GROUP BY e.name, et.name, et.unit
ORDER BY et.name, total_value DESC;

-- 2. Porcentaje de energía renovable en el consumo eléctrico total de cada región
-- =================================================================================
SELECT 
    e.name AS region,
    ed.year,
    ed.value AS percentage_renewable_electricity
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.name = 'Share Electricity Renewables'
  AND e.code IS NULL  -- Filtro clave: Al ser nulo, nos aseguramos de traer solo regiones (y no países)
ORDER BY ed.year DESC, ed.value DESC;

-- 3. Tendencia de la capacidad instalada de energía solar a lo largo de los años
-- ==============================================================================
SELECT 
    ed.year,
	et.unit,
    ed.value AS total_solar_capacity,
    enti.name AS country
FROM energy.fact_energy_data ed
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
JOIN energy.dim_entities enti on ed.entity_id = enti.id
WHERE et.name = 'Installed Solar PV Capacity' and enti.name = 'World'
ORDER BY ed.year;

-- 4. Los 10 países con mayor producción de energía eólica en un año específico
-- =============================================================================
SELECT 
    e.name AS country,
    e.code,
    ed.value AS wind_generation_twh
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.name = 'Wind Production'
    AND ed.year = 2018
    AND e.code IS NOT NULL  -- Solo países (con código ISO)
    --AND e.code != 'OWID_WRL' Agregar condicional para que no salga el mundo
ORDER BY ed.value DESC
LIMIT 10;

-- 5. Participación de todas las fuentes de energía en el consumo eléctrico total a nivel global
-- =============================================================================================
SELECT 
    ed.year,
    et.name AS energy_source,
    ed.value AS share_percentage,
    et.unit
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE e.name = 'World'
  AND et.name IN (
      'Share Electricity Renewables',
      'Share Electricity Hydro', 
      'Share Electricity Wind', 
      'Share Electricity Solar'
  )
ORDER BY ed.year DESC, ed.value DESC;



