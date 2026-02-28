"""
Script para importar datos de energía renovable desde archivos CSV a PostgreSQL
"""

import os
import csv
import psycopg2
from psycopg2.extras import execute_batch
from pathlib import Path

# ============== CONFIGURACIÓN ==============
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'energy_db',
    'user': 'postgres',
    'password': 'luzenith9424'
}

CSV_DIR = Path(__file__).parent / 'archivos'

# Mapeo de archivos CSV a tipos de energía
CSV_MAPPING = {
    '01 renewable-share-energy.csv': 'Renewable Share Energy',
    '02 geo-biomass-consumption.csv': 'Geo Biomass Consumption',
    '03 wind-consumption.csv': 'Wind Consumption',
    '04 share-electricity-renewables.csv': 'Share Electricity Renewables',
    '05 hydropower-consumption.csv': 'Hydropower Consumption',
    '06 hydro-share-energy.csv': 'Hydro Share Energy',
    '07 share-electricity-hydro.csv': 'Share Electricity Hydro',
    '08 wind-production.csv': 'Wind Production',
    '09 cumulative-installed-wind-energy-capacity-gigawatts.csv': 'Cumulative Wind Capacity',
    '10 wind-share-energy.csv': 'Wind Share Energy',
    '11 share-electricity-wind.csv': 'Share Electricity Wind',
    '12 solar-energy-consumption.csv': 'Solar Energy Consumption',
    '13 installed-solar-PV-capacity.csv': 'Installed Solar PV Capacity',
    '14 solar-share-energy.csv': 'Solar Share Energy',
    '15 share-electricity-solar.csv': 'Share Electricity Solar',
    '16 biofuel-production.csv': 'Biofuel Production',
    '17 installed-geothermal-capacity.csv': 'Installed Geothermal Capacity',
    '18 hydro-production.csv': 'Hydro Production',
    '19 solar-production.csv': 'Solar Production',
}


def get_db_connection():
    """Establecer conexión a la base de datos"""
    return psycopg2.connect(**DB_CONFIG)


def load_entities(cursor):
    """Cargar todas las entidades de los archivos CSV"""
    entities = {}
    
    for csv_file in CSV_MAPPING.keys():
        file_path = CSV_DIR / csv_file
        if not file_path.exists():
            print(f"⚠️ Archivo no encontrado: {csv_file}")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                entity_name = row.get('Entity', '').strip()
                entity_code = row.get('Code', '').strip()
                
                if entity_name and entity_name not in entities:
                    entities[entity_name] = entity_code
    
    # Insertar entidades
    insert_query = """
        INSERT INTO energy.dim_entities (name, code)
        VALUES (%s, %s)
        ON CONFLICT (name) DO UPDATE SET code = EXCLUDED.code
        RETURNING id, name
    """
    
    entity_data = [(name, code if code else None) for name, code in entities.items()]
    execute_batch(cursor, insert_query, entity_data)
    
    # Obtener IDs
    cursor.execute("SELECT id, name FROM energy.dim_entities")
    return {row[1]: row[0] for row in cursor.fetchall()}


def load_energy_data(cursor, entity_ids):
    """Cargar todos los datos de energía"""
    
    # Obtener mapeo de tipos de energía
    cursor.execute("SELECT id, name FROM energy.dim_energy_type")
    energy_type_ids = {row[1]: row[0] for row in cursor.fetchall()}
    
    all_data = []
    
    for csv_file, energy_type_name in CSV_MAPPING.items():
        file_path = CSV_DIR / csv_file
        energy_type_id = energy_type_ids.get(energy_type_name)
        
        if not energy_type_id:
            print(f"⚠️ Tipo de energía no encontrado: {energy_type_name}")
            continue
        
        print(f"📄 Procesando: {csv_file}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                entity_name = row.get('Entity', '').strip()
                year = row.get('Year', '').strip()
                
                # Saltar filas sin año válido
                if not year or not year.isdigit():
                    continue
                
                entity_id = entity_ids.get(entity_name)
                if not entity_id:
                    continue
                
                # Obtener el valor (última columna)
                values = [v for k, v in row.items() if k not in ['Entity', 'Code', 'Year']]
                if not values:
                    continue
                
                try:
                    value = float(values[0]) if values[0] else None
                except (ValueError, TypeError):
                    value = None
                
                if value is not None:
                    all_data.append((entity_id, energy_type_id, int(year), value))
    
    # Insertar datos
    insert_query = """
        INSERT INTO energy.fact_energy_data (entity_id, energy_type_id, year, value)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (entity_id, energy_type_id, year) DO UPDATE SET value = EXCLUDED.value
    """
    
    print(f"💾 Insertando {len(all_data)} registros...")
    execute_batch(cursor, insert_query, all_data, page_size=1000)
    
    return len(all_data)


def main():
    """Función principal"""
    print("=" * 50)
    print("IMPORTACIÓN DE DATOS DE ENERGÍA RENOVABLE")
    print("=" * 50)
    
    try:
        conn = get_db_connection()
        conn.autocommit = False
        cursor = conn.cursor()
        
        # Paso 1: Cargar entidades
        print("\n📍 Paso 1: Cargando entidades...")
        entity_ids = load_entities(cursor)
        print(f"   ✓ {len(entity_ids)} entidades cargadas/actualizadas")
        
        # Paso 2: Cargar datos
        print("\n📊 Paso 2: Cargando datos de energía...")
        total_records = load_energy_data(cursor, entity_ids)
        
        conn.commit()
        print(f"\n✅ Importación completada: {total_records} registros")
        
        # Mostrar estadísticas
        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM energy.dim_entities) AS entidades,
                (SELECT COUNT(*) FROM energy.dim_energy_type) AS tipos_energia,
                (SELECT COUNT(*) FROM energy.fact_energy_data) AS registros
        """)
        result = cursor.fetchone()
        print(f"\n📈 ESTADÍSTICAS FINALES:")
        print(f"   - Entidades: {result[0]}")
        print(f"   - Tipos de energía: {result[1]}")
        print(f"   - Registros totales: {result[2]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        raise


if __name__ == '__main__':
    main()
