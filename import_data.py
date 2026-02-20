#!/usr/bin/env python3
"""
Script ETL para importar datos de energía renovable a PostgreSQL
Requiere: pip install psycopg2-binary pandas
"""

import os
import glob
import pandas as pd
import psycopg2
from psycopg2 import sql

# =============================================
# CONFIGURACIÓN - Modificar según sea necesario
# =============================================
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'energy_db',
    'user': 'postgres',
    'password': '123'
}

DATA_DIR = os.path.join(os.path.dirname(__file__), 'archive')

MAPPING_FILES = {
    '01 renewable-share-energy.csv': 'Renewable Share Energy',
    '02 modern-renewable-energy-consumption.csv': 'Modern Renewable Energy Consumption',
    '03 modern-renewable-prod.csv': 'Modern Renewable Production',
    '04 share-electricity-renewables.csv': 'Share Electricity Renewables',
    '05 hydropower-consumption.csv': 'Hydropower Consumption',
    '06 hydro-share-energy.csv': 'Hydro Share Energy',
    '07 share-electricity-hydro.csv': 'Share Electricity Hydro',
    '08 wind-generation.csv': 'Wind Generation',
    '09 cumulative-installed-wind-energy-capacity-gigawatts.csv': 'Cumulative Wind Capacity',
    '10 wind-share-energy.csv': 'Wind Share Energy',
    '11 share-electricity-wind.csv': 'Share Electricity Wind',
    '12 solar-energy-consumption.csv': 'Solar Energy Consumption',
    '13 installed-solar-PV-capacity.csv': 'Installed Solar PV Capacity',
    '14 solar-share-energy.csv': 'Solar Share Energy',
    '15 share-electricity-solar.csv': 'Share Electricity Solar',
    '16 biofuel-production.csv': 'Biofuel Production',
    '17 installed-geothermal-capacity.csv': 'Installed Geothermal Capacity'
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def ensure_entities_exist(cursor, entities_df):
    """Inserta entidades que no existen y retorna mapa de name -> id"""
    for _, row in entities_df.iterrows():
        cursor.execute("""
            INSERT INTO energy.dim_entities (name, code)
            VALUES (%s, %s)
            ON CONFLICT (name) DO NOTHING
        """, (row['Entity'], row.get('Code')))
    
    cursor.execute("SELECT id, name FROM energy.dim_entities")
    return {row[1]: row[0] for row in cursor.fetchall()}

def get_energy_type_id(cursor, energy_type_name):
    cursor.execute(
        "SELECT id FROM energy.dim_energy_type WHERE name = %s",
        (energy_type_name,)
    )
    result = cursor.fetchone()
    return result[0] if result else None

def import_csv_to_db(filepath, energy_type_name):
    """Importa un archivo CSV a la base de datos"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        df = pd.read_csv(filepath)
        
        # Obtener ID del tipo de energía
        energy_type_id = get_energy_type_id(cursor, energy_type_name)
        if not energy_type_id:
            print(f"  [WARN] Tipo de energía no encontrado: {energy_type_name}")
            return 0
        
        # Asegurar que existen las entidades
        entity_map = ensure_entities_exist(cursor, df[['Entity', 'Code']].drop_duplicates())
        conn.commit()
        
        # Reconsultar el mapa de entidades
        cursor.execute("SELECT id, name FROM energy.dim_entities")
        entity_map = {row[1]: row[0] for row in cursor.fetchall()}
        
        # Insertar datos
        insert_count = 0
        for _, row in df.iterrows():
            entity_id = entity_map.get(row['Entity'])
            if entity_id is None:
                continue
            
            value = row.iloc[3]  # La columna de valor es la 4ta
            
            cursor.execute("""
                INSERT INTO energy.fact_energy_data 
                (entity_id, energy_type_id, year, value)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (entity_id, energy_type_id, row['Year'], value))
            insert_count += 1
        
        conn.commit()
        print(f"  [OK] {os.path.basename(filepath)}: {insert_count} registros insertados")
        return insert_count
        
    except Exception as e:
        conn.rollback()
        print(f"  [ERROR] {filepath}: {e}")
        return 0
    finally:
        cursor.close()
        conn.close()

def main():
    print("=" * 60)
    print("ETL: Importando datos de energía renovable a PostgreSQL")
    print("=" * 60)
    
    csv_files = glob.glob(os.path.join(DATA_DIR, '*.csv'))
    total_records = 0
    
    for filepath in sorted(csv_files):
        filename = os.path.basename(filepath)
        energy_type = MAPPING_FILES.get(filename)
        
        if energy_type:
            print(f"Procesando: {filename}")
            count = import_csv_to_db(filepath, energy_type)
            total_records += count
        else:
            print(f"[SKIP] Archivo no mapeado: {filename}")
    
    print("=" * 60)
    print(f"Total de registros importados: {total_records}")
    print("=" * 60)

if __name__ == '__main__':
    main()
