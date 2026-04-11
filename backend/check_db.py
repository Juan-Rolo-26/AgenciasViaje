import sqlite3
import os

db_path = "/home/juampi26/AgenciasViaje/backend/prisma/dev.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    for table in ["Crucero", "Destino"]:
        print(f"\nColumns in {table}:")
        cursor.execute(f"PRAGMA table_info({table})")
        columns = cursor.fetchall()
        for col in columns:
            print(col)
    conn.close()
else:
    print(f"DB not found at {db_path}")
