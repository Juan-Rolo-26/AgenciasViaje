# Guía de Despliegue en VPS - Topotours

Esta guía contiene los pasos necesarios para hostear la aplicación en un VPS.

## Opción 1: Despliegue con PM2 (Recomendado para Node.js nativo)

### Requisitos previos
- Node.js (v18+)
- NPM
- PM2 (`npm install -g pm2`)
- Nginx (opcional, para reverse proxy)

### Pasos
1. Clona el repositorio en tu VPS.
2. Crea el archivo `.env` en la carpeta `backend/` basándote en el archivo de ejemplo.
3. Ejecuta el script de despliegue:
   ```bash
   ./deploy.sh
   ```
4. La aplicación estará corriendo en el puerto 3000.
5. Configura PM2 para que inicie al bootear el sistema:
   ```bash
   pm2 startup
   pm2 save
   ```

## Opción 2: Despliegue con Docker (Más fácil y aislado)

### Requisitos previos
- Docker
- Docker Compose

### Pasos
1. Ejecuta el siguiente comando en la raíz del proyecto:
   ```bash
   docker-compose up -d --build
   ```
2. La aplicación estará corriendo en `http://localhost:3000`.

## Configuración de Nginx
Se ha incluido un archivo `nginx.conf` como plantilla. Debes copiar su contenido a `/etc/nginx/sites-available/topotours` (o similar) y crear un enlace simbólico a `sites-enabled`.

```bash
sudo cp nginx.conf /etc/nginx/sites-available/topotours
# Edita el archivo para poner tu dominio
sudo nano /etc/nginx/sites-available/topotours
sudo ln -s /etc/nginx/sites-available/topotours /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Base de Datos
Actualmente se utiliza SQLite por simplicidad. El archivo de base de datos se encuentra en `backend/prisma/dev.db`.
Si decides usar Docker, se ha configurado un volumen para que los datos persistan en el host.
