# Base de Datos de Energía Renovable

Este proyecto contiene un esquema PostgreSQL normalizado para almacenar datos de energía renovable de múltiples archivos CSV.

## Estructura del Proyecto

```
energia_renovables/
├── archivos/                    # 17 archivos CSV originales
│   ├── 01 renewable-share-energy.csv
│   ├── 02 modern-renewable-energy-consumption.csv
│   └── ...
├── schema_energy.sql           # Esquema de la base de datos
├── import_data.py              # Script de importación Python
└── README.md                   # Este archivo
```

## Requisitos

- PostgreSQL 12+
- Python 3.8+
- Paquetes Python: `psycopg2`

## Paso a Paso

### 1. Crear la Base de Datos

```sql
CREATE DATABASE energy_db;
```

O desde terminal:
```bash
createdb energy_db
```

### 2. Instalar Dependencias Python

```bash
pip install psycopg2-binary
```

### 3. Ejecutar el Esquema

```bash
psql -h localhost -p 5432 -U postgres -d energy_db -f schema_energy.sql
```

desde PowerShell:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d energy_db -f schema_energy.sql
```

desde PgAdmin:
```
Abre un "query tool" pega y ejecuta energy_model.sql
```

### 4. Importar los Datos

```bash
python import_data.py
```

## Modelo de Datos

### Tablas Creadas

| Tabla | Descripción |
|-------|-------------|
| `energy.dim_entities` | Países y regiones |
| `energy.dim_energy_type` | 17 tipos de energía renovable |
| `energy.fact_energy_data` | Datos de mediciones |

### Tipos de Energía Incluidos

1. Renewable Share Energy (%)
2. Modern Renewable Energy Consumption (TWh)
3. Modern Renewable Production (TWh)
4. Share Electricity Renewables (%)
5. Hydropower Consumption (TWh)
6. Hydro Share Energy (%)
7. Share Electricity Hydro (%)
8. Wind Generation (TWh)
9. Cumulative Wind Capacity (GW)
10. Wind Share Energy (%)
11. Share Electricity Wind (%)
12. Solar Energy Consumption (TWh)
13. Installed Solar PV Capacity (GW)
14. Solar Share Energy (%)
15. Share Electricity Solar (%)
16. Biofuel Production (TWh)
17. Installed Geothermal Capacity (GW)

## Consultas de Ejemplo

### Ver todos los datos de un país
```sql
SELECT e.name AS entidad, et.name AS tipo_energia, ed.year, ed.value, et.unit
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE e.name = 'Spain'
ORDER BY ed.year;
```

### Evolución de energía renovable por año
```sql
SELECT ed.year, AVG(ed.value) AS promedio
FROM energy.fact_energy_data ed
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.name = 'Renewable Share Energy'
GROUP BY ed.year
ORDER BY ed.year;
```

### Capacidad solar por país (más reciente)
```sql
SELECT e.name, ed.value, et.unit
FROM energy.fact_energy_data ed
JOIN energy.dim_entities e ON ed.entity_id = e.id
JOIN energy.dim_energy_type et ON ed.energy_type_id = et.id
WHERE et.name = 'Installed Solar PV Capacity'
AND ed.year = (SELECT MAX(year) FROM energy.fact_energy_data 
               WHERE energy_type_id = et.id AND entity_id = ed.entity_id)
ORDER BY ed.value DESC
LIMIT 10;
```

## Licencia

MIT
