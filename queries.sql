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
WHERE ed.year = 2018 -- AND et.name = 'Biofuel Production' para buscar por tipo
    AND e.code IS NULL  -- Regiones (sin código ISO)
GROUP BY e.name, et.name, et.unit
ORDER BY et.name, total_value DESC;


-- 2. Porcentaje de energía renovable en el consumo eléctrico total de cada región
-- =================================================================================
WITH renewable_share AS (
    SELECT 
        e.id AS entity_id,
        e.name AS region,
        ed.value AS renewable_pct
    FROM energy.fact_energy_data ed
    JOIN energy.dim_entities e ON ed.entity_id = e.id
    JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
    WHERE et.name = 'Share Electricity Renewables'
        AND ed.year = 2018
        AND e.code IS NULL
),
total_electricity AS (
    SELECT 
        e.id AS entity_id,
        e.name AS region,
        ed.value AS total_pct
    FROM energy.fact_energy_data ed
    JOIN energy.dim_entities e ON ed.entity_id = e.id
    JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
    WHERE et.name = 'Share Electricity Renewables'
        AND ed.year = 2018
)
SELECT 
    rs.region,
    rs.renewable_pct AS percentage_renewable_electricity
FROM renewable_share rs
ORDER BY rs.renewable_pct DESC;


-- 3. Tendencia de la capacidad instalada de energía solar a lo largo de los años
-- ==============================================================================
SELECT 
    ed.year,
    SUM(ed.value) AS total_solar_capacity_gw,
    COUNT(DISTINCT ed.entity_id) AS countries_count
FROM energy.fact_energy_data ed
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.name = 'Installed Solar PV Capacity'
GROUP BY ed.year
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
WHERE et.name = 'Wind Generation'
    AND ed.year = 2018
    AND e.code IS NOT NULL  -- Solo países (con código ISO)
    --AND e.code != 'OWID_WRL' Agregar condicional para que no salga el mundo
ORDER BY ed.value DESC
LIMIT 10;


-- 5. Participación de todas las fuentes de energía en el consumo eléctrico total a nivel global
-- =============================================================================================
SELECT 
    et.name AS energy_source,
    et.category,
    et.unit,
    AVG(ed.value) AS global_average,
    MIN(ed.value) AS min_value,
    MAX(ed.value) AS max_value,
    COUNT(ed.id) AS data_points
FROM energy.fact_energy_data ed
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE ed.year >= 2010 -- AND et.unit = '%' agregar para solo el porcentaje
    AND et.category IN ('Hydro', 'Wind', 'Solar', 'Biofuel')
GROUP BY et.name, et.category, et.unit
ORDER BY et.category, global_average DESC;


-- =====================================================
-- CONSULTAS ADICIONALES ÚTILES
-- =====================================================

-- Evolución de energía renovable por país (top 5)
-- =====================================================
SELECT 
    e.name AS country,
    e.code,
    et.name AS energy_type,
    ed.year,
    ed.value
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.name = 'Renewable Share Energy'
    AND e.code IS NOT NULL
    AND e.name IN ('China', 'United States', 'Germany', 'Brazil', 'India')
ORDER BY e.name, ed.year;

-- Capacidad instalada por tipo de energía (último año disponible)
-- ================================================================
SELECT 
    et.name AS energy_type,
    et.unit,
    SUM(ed.value) AS total_capacity
FROM energy.fact_energy_data ed
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.category = 'capacity'
    AND ed.year = (SELECT MAX(year) FROM energy.fact_energy_data WHERE energy_type_id = et.id)
GROUP BY et.name, et.unit
ORDER BY total_capacity DESC;

-- Países que han incrementado más su capacidad solar (2010 vs 2018)
-- ==================================================================
WITH solar_2010 AS (
    SELECT entity_id, value FROM energy.fact_energy_data ed
    JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
    WHERE et.name = 'Installed Solar PV Capacity' AND ed.year = 2010
),
solar_2018 AS (
    SELECT entity_id, value FROM energy.fact_energy_data ed
    JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
    WHERE et.name = 'Installed Solar PV Capacity' AND ed.year = 2018
)
SELECT 
    e.name AS country,
    e.code,
    s2010.value AS capacity_2010_gw,
    s2018.value AS capacity_2018_gw,
    s2018.value - s2010.value AS increment,
    ROUND((s2018.value - s2010.value) / NULLIF(s2010.value, 0) * 100, 1) AS growth_pct
FROM solar_2010 s2010
JOIN solar_2018 s2018 ON s2010.entity_id = s2018.entity_id
JOIN energy.dim_entities e ON s2010.entity_id = e.id
WHERE s2010.value > 0
ORDER BY increment DESC
LIMIT 10;
