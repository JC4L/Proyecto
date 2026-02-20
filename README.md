# Energía Renovable - Modelo de Datos PostgreSQL

## Archivos Generados

| Archivo | Descripción |
|---------|-------------|
| `energy_model.sql` | Script SQL con el modelo star schema completo |
| `import_data.py` | Script Python ETL para importar los CSV |
| `README.md` | Este archivo |

## Instrucciones de Uso

### 1. Crear la Base de Datos

```sql
-- En psql o pgAdmin
CREATE DATABASE energy_db;
```

### 2. Ejecutar el Modelo

```bash
psql -U postgres -d energy_db -f energy_model.sql
```

### 3. Configurar y Ejecutar la Importación

```bash
# Editar credenciales en import_data.py
# DB_CONFIG = {...}

# Ejecutar importación
pip install psycopg2-binary pandas
python import_data.py
```

## Consultas de Ejemplo

```sql
-- Ver evolución de energía renovable en España
SELECT * FROM energy.v_renewable_evolution 
WHERE code = 'ESP';

-- Últimos datos de capacidad solar
SELECT * FROM energy.v_latest_by_country 
WHERE energy_type = 'Installed Solar PV Capacity'
ORDER BY value DESC LIMIT 10;

-- Función: Datos por rango de años
SELECT * FROM energy.get_data_by_year_range(2020, 2023, 'Solar Share Energy');
```

## Estructura del Modelo

```
dim_entities ─────┐
                  ├──▶ fact_energy_data
dim_energy_type ─┘
```

## Vistas Disponibles

- `v_renewable_evolution` - Evolución % renovable por país
- `v_solar_capacity` - Capacidad solar por país
- `v_wind_capacity` - Capacidad eólica por país
- `v_latest_by_country` - Últimos datos por país
