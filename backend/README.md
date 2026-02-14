# Backend

## Desarrollo

```bash
npm install
npm run dev
```

## Base de datos (SQLite + Prisma)

1) Crear la base local y migrar:
```bash
npm run migrate
```

2) Abrir Prisma Studio (opcional):
```bash
npm run studio
```

3) Cargar datos de ejemplo:
```bash
npm run seed
```

## Variables de entorno

- `PORT`: puerto del servidor (por defecto 3000).
- `DATABASE_URL`: cadena de conexión SQLite (ejemplo en deploy: `file:./prisma/dev.db`).

## Endpoints base

- `GET /api/destinos`
- `GET /api/destinos/:id`
- `GET /api/destinos/slug/:slug`
- `GET /api/ofertas`
- `GET /api/ofertas/:id`
- `GET /api/ofertas/slug/:slug`
- `GET /api/actividades`
- `GET /api/actividades/:id`
- `GET /api/actividades/slug/:slug`
- `GET /api/nosotros`
