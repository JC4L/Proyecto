-- =============================================
-- MODELO DE DATOS: ENERGÍA RENOVABLE
-- Arquitectura: Star Schema
-- PostgreSQL 14+
-- =============================================

-- Esquema
CREATE SCHEMA IF NOT EXISTS energy;

-- =============================================
-- DIMENSION: ENTITIES (Países/Regiones)
-- =============================================
DROP TABLE IF EXISTS energy.dim_entities CASCADE;
CREATE TABLE energy.dim_entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_entities_name ON energy.dim_entities(name);
CREATE INDEX idx_entities_code ON energy.dim_entities(code);

-- =============================================
-- DIMENSION: ENERGY TYPE (Tipos de Energía)
-- =============================================
DROP TABLE IF EXISTS energy.dim_energy_type CASCADE;
CREATE TABLE energy.dim_energy_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_energy_type_name ON energy.dim_energy_type(name);

-- Carga inicial de tipos de energía
INSERT INTO energy.dim_energy_type (name, unit, category, description) VALUES
    ('Renewable Share Energy', '%', 'General', 'Porcentaje de energía renovable sobre energía primaria equivalente'),
    ('Modern Renewable Energy Consumption', 'TWh', 'Modern Renewable', 'Consumo de energía renovable moderna'),
    ('Modern Renewable Production', 'TWh', 'Modern Renewable', 'Producción de energía renovable moderna'),
    ('Share Electricity Renewables', '%', 'Electricity', 'Porcentaje de electricidad renovable'),
    ('Hydropower Consumption', 'TWh', 'Hydro', 'Consumo de energía hidroeléctrica'),
    ('Hydro Share Energy', '%', 'Hydro', 'Porcentaje de energía hidroeléctrica'),
    ('Share Electricity Hydro', '%', 'Hydro', 'Porcentaje de electricidad hidroeléctrica'),
    ('Wind Generation', 'TWh', 'Wind', 'Generación de energía eólica'),
    ('Cumulative Wind Capacity', 'GW', 'Wind', 'Capacidad instalada acumulada de energía eólica'),
    ('Wind Share Energy', '%', 'Wind', 'Porcentaje de energía eólica'),
    ('Share Electricity Wind', '%', 'Wind', 'Porcentaje de electricidad eólica'),
    ('Solar Energy Consumption', 'TWh', 'Solar', 'Consumo de energía solar'),
    ('Installed Solar PV Capacity', 'GW', 'Solar', 'Capacidad instalada solar fotovoltaica'),
    ('Solar Share Energy', '%', 'Solar', 'Porcentaje de energía solar'),
    ('Share Electricity Solar', '%', 'Solar', 'Porcentaje de electricidad solar'),
    ('Biofuel Production', 'TWh', 'Biofuel', 'Producción de biocombustibles'),
    ('Installed Geothermal Capacity', 'GW', 'Geothermal', 'Capacidad instalada geotérmica')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- FACT TABLE: ENERGY DATA
-- =============================================
DROP TABLE IF EXISTS energy.fact_energy_data CASCADE;
CREATE TABLE energy.fact_energy_data (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL REFERENCES energy.dim_entities(id),
    energy_type_id INTEGER NOT NULL REFERENCES energy.dim_energy_type(id),
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    value DECIMAL(20,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices optimizados para consultas analíticas
CREATE INDEX idx_fact_entity_year_type ON energy.fact_energy_data(entity_id, year, energy_type_id);
CREATE INDEX idx_fact_year_type ON energy.fact_energy_data(year, energy_type_id);
CREATE INDEX idx_fact_entity_type ON energy.fact_energy_data(entity_id, energy_type_id);
CREATE INDEX idx_fact_year ON energy.fact_energy_data(year);

-- =============================================
-- VISTAS ANALÍTICAS
-- =============================================

-- Vista: Evolución de energía renovable por país
DROP VIEW IF EXISTS energy.v_renewable_evolution;
CREATE VIEW energy.v_renewable_evolution AS
SELECT 
    e.name AS country,
    e.code,
    f.year,
    f.value AS renewable_share_pct
FROM energy.fact_energy_data f
JOIN energy.dim_entities e ON f.entity_id = e.id
JOIN energy.dim_energy_type t ON f.energy_type_id = t.id
WHERE t.name = 'Renewable Share Energy'
ORDER BY e.name, f.year;

-- Vista: Capacidad solar por país
DROP VIEW IF EXISTS energy.v_solar_capacity;
CREATE VIEW energy.v_solar_capacity AS
SELECT 
    e.name AS country,
    e.code,
    f.year,
    f.value AS solar_capacity_gw
FROM energy.fact_energy_data f
JOIN energy.dim_entities e ON f.entity_id = e.id
JOIN energy.dim_energy_type t ON f.energy_type_id = t.id
WHERE t.name = 'Installed Solar PV Capacity'
ORDER BY e.name, f.year;

-- Vista: Capacidad eólica por país
DROP VIEW IF EXISTS energy.v_wind_capacity;
CREATE VIEW energy.v_wind_capacity AS
SELECT 
    e.name AS country,
    e.code,
    f.year,
    f.value AS wind_capacity_gw
FROM energy.fact_energy_data f
JOIN energy.dim_entities e ON f.entity_id = e.id
JOIN energy.dim_energy_type t ON f.energy_type_id = t.id
WHERE t.name = 'Cumulative Wind Capacity'
ORDER BY e.name, f.year;

-- Vista: Últimos datos disponibles por país
DROP VIEW IF EXISTS energy.v_latest_by_country;
CREATE VIEW energy.v_latest_by_country AS
SELECT 
    e.name AS country,
    e.code,
    t.name AS energy_type,
    t.unit,
    f.year,
    f.value
FROM energy.fact_energy_data f
JOIN energy.dim_entities e ON f.entity_id = e.id
JOIN energy.dim_energy_type t ON f.energy_type_id = t.id
WHERE (e.id, t.id, f.year) IN (
    SELECT f2.entity_id, f2.energy_type_id, MAX(f2.year)
    FROM energy.fact_energy_data f2
    GROUP BY f2.entity_id, f2.energy_type_id
);

-- =============================================
-- FUNCIONES ÚTILES
-- =============================================

-- Función: Obtener datos por rango de años
DROP FUNCTION IF EXISTS energy.get_data_by_year_range;
CREATE OR REPLACE FUNCTION energy.get_data_by_year_range(
    p_start_year INTEGER,
    p_end_year INTEGER,
    p_energy_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    country VARCHAR,
    code VARCHAR,
    year INTEGER,
    energy_type VARCHAR,
    value DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.name,
        e.code,
        f.year,
        t.name::VARCHAR,
        f.value
    FROM energy.fact_energy_data f
    JOIN energy.dim_entities e ON f.entity_id = e.id
    JOIN energy.dim_energy_type t ON f.energy_type_id = t.id
    WHERE f.year BETWEEN p_start_year AND p_end_year
      AND (p_energy_type IS NULL OR t.name = p_energy_type)
    ORDER BY e.name, f.year;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMENTARIOS
-- =============================================
COMMENT ON SCHEMA energy IS 'Esquema para datos de energía renovable';
COMMENT ON TABLE energy.dim_entities IS 'Dimensión de países y regiones';
COMMENT ON TABLE energy.dim_energy_type IS 'Catálogo de tipos de métricas de energía';
COMMENT ON TABLE energy.fact_energy_data IS 'Tabla de hechos con datos históricos de energía';

-- Ver estructura
SELECT 'Modelo creado exitosamente' AS status;
