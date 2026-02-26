-- =====================================================
-- ESQUEMA PARA ENERGÍAS RENOVABLES
-- =====================================================

-- Crear esquema
CREATE SCHEMA IF NOT EXISTS energy;

-- =============================================
-- DIMENSION: ENTITIES (Países/Regiones)
-- =============================================
CREATE TABLE energy.dim_entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50)
);

CREATE UNIQUE INDEX idx_entities_name ON energy.dim_entities(name);
CREATE INDEX idx_entities_code ON energy.dim_entities(code);

-- =============================================
-- DIMENSION: ENERGY TYPE (Tipos de Energía)
-- =============================================
CREATE TABLE energy.dim_energy_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    description TEXT
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
CREATE TABLE energy.fact_energy_data (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL REFERENCES energy.dim_entities(id),
    energy_type_id INTEGER NOT NULL REFERENCES energy.dim_energy_type(id),
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    value DECIMAL(20,6),
    
    CONSTRAINT uk_fact_energy_data UNIQUE (entity_id, energy_type_id, year)
);

-- Índices optimizados para consultas analíticas
CREATE INDEX idx_fact_entity_year_type ON energy.fact_energy_data(entity_id, year, energy_type_id);
CREATE INDEX idx_fact_year_type ON energy.fact_energy_data(year, energy_type_id);
CREATE INDEX idx_fact_entity_type ON energy.fact_energy_data(entity_id, energy_type_id);
CREATE INDEX idx_fact_year ON energy.fact_energy_data(year);

-- Verificar creación
SELECT 
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'energy') AS tablas_creadas,
    (SELECT COUNT(*) FROM energy.dim_energy_type) AS tipos_de_energia;

--TODO: Hacer las vistas pertinentes a los queries solicitados
--TODO: Implementar función para obtener datos por rango de años