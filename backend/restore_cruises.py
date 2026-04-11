import sqlite3
import os

db_path = "/home/juampi26/AgenciasViaje/backend/prisma/dev.db"

cruceros = [
    {
        "nombre": "Costa Favolosa",
        "slug": "costa-favolosa",
        "naviera": "Costa Cruceros",
        "barco": "Costa Favolosa",
        "imagenPortada": "/assets/cruceros/crucero.webp",
        "descripcion": "Disfrutá del encanto italiano a bordo del Costa Favolosa. Un palacio flotante lleno de arte, entretenimiento y gastronomía de primer nivel.",
        "galeria": ["/assets/cruceros/crucero2.jpg", "/assets/cruceros/crucero3.jpg", "/assets/cruceros/crucero4.jpg"]
    },
    {
        "nombre": "Costa Diadema",
        "slug": "costa-diadema",
        "naviera": "Costa Cruceros",
        "barco": "Costa Diadema",
        "imagenPortada": "/assets/cruceros/costadiadema.jpg",
        "descripcion": "El Costa Diadema es la joya de la flota. Ofrece las experiencias más completas de relax, diversión y sabores mediterráneos.",
        "galeria": ["/assets/cruceros/costadiadema1.jpg", "/assets/cruceros/costadiadma2.jpg", "/assets/cruceros/costadiadema3.jpg"]
    },
    {
        "nombre": "Costa Serena",
        "slug": "costa-serena",
        "naviera": "Costa Cruceros",
        "barco": "Costa Serena",
        "imagenPortada": "/assets/cruceros/costaserene.webp",
        "descripcion": "Inspirado en la mitología clásica, el Costa Serena es un barco espacioso diseñado para el bienestar y el confort absoluto.",
        "galeria": ["/assets/cruceros/costaserene1.webp", "/assets/cruceros/costaserene2.webp", "/assets/cruceros/costaserene3.jpg"]
    }
]

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    for c in cruceros:
        try:
            # Insert Crucero
            cursor.execute("""
                INSERT INTO Crucero (nombre, slug, naviera, barco, imagenPortada, descripcion, activa, destacada, orden, creadoEn)
                VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, CURRENT_TIMESTAMP)
            """, (c['nombre'], c['slug'], c['naviera'], c['barco'], c['imagenPortada'], c['descripcion']))
            
            crucero_id = cursor.lastrowid
            
            # Insert Gallery
            for i, img in enumerate(c['galeria']):
                cursor.execute("""
                    INSERT INTO ImagenCrucero (cruceroId, imagen, orden)
                    VALUES (?, ?, ?)
                """, (crucero_id, img, i))
                
            print(f"Crucero {c['nombre']} insertado OK")
            
        except sqlite3.IntegrityError:
            print(f"Crucero {c['nombre']} ya existía")
        except Exception as e:
            print(f"Error insertando {c['nombre']}: {e}")
            
    conn.commit()
    conn.close()
else:
    print(f"DB not found at {db_path}")
