import sqlite3
import os

db_path = "/home/juampi26/AgenciasViaje/backend/prisma/dev.db.backup_20260409"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM Crucero")
        rows = cursor.fetchall()
        print(f"Cruises in backup: {len(rows)}")
        for row in rows:
            print(row)
    except Exception as e:
        print(f"Error reading Crucero table: {e}")
    conn.close()
else:
    print(f"Backup not found at {db_path}")
