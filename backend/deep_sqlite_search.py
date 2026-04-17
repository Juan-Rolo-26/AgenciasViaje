import sqlite3
import os

db_path = './prisma/dev.db'
if not os.path.exists(db_path):
    print(f"File {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

for table in tables:
    table_name = table[0]
    cursor.execute(f"PRAGMA table_info(\"{table_name}\");")
    columns = cursor.fetchall()
    for col in columns:
        col_name = col[1]
        try:
            cursor.execute(f"SELECT * FROM \"{table_name}\" WHERE \"{col_name}\" LIKE '%(%';")
            rows = cursor.fetchall()
            for row in rows:
                if 'Formosa (' in str(row):
                    print(f"FOUND IN {table_name}, row: {row}")
        except:
            pass

conn.close()
