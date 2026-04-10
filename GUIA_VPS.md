# 🚀 Guía Completa de Despliegue en VPS (Ubuntu)

Esta guía te ayudará a configurar tu VPS desde cero para que el proyecto de **Agencia de Viaje** funcione perfectamente con **Nginx**, **PM2** y **SSL (HTTPS)**.

---

## 1. Preparación Inicial del VPS

Una vez que hayas accedido a tu VPS vía SSH (`ssh root@tu_ip`), ejecuta los siguientes comandos para actualizar el sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Node.js (Versión LTS recomedada)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Instalar herramientas necesarias
```bash
sudo apt install -y git nginx build-essential
sudo npm install -g pm2
```

---

## 2. Clonar y Configurar el Proyecto

Clona tu repositorio en la carpeta deseada (ej. `/var/www/`):

```bash
cd /var/www
git clone https://tu-repositorio.git topotours
cd topotours
```

### Dar permisos (importante)
```bash
sudo chown -R $USER:$USER /var/www/topotours
```

---

## 3. Despliegue Automático

El proyecto ya incluye un script que prepara todo (Backend, Frontend y CRM). Solo debes ejecutarlo:

```bash
chmod +x deploy.sh
./deploy.sh
```

> **Nota:** Este script instalará dependencias, generará el cliente de Prisma, construirá el frontend/CRM y lanzará el proceso con PM2.

---

## 4. Configurar Nginx (Servidor Web)

Nginx funcionará como un "proxy inverso", redirigiendo el tráfico del puerto 80 al puerto 3000 de Node.js.

### Crear configuración
```bash
sudo nano /etc/nginx/sites-available/topotours
```

**Pega el siguiente contenido (reemplaza `tu-dominio.com`):**

```nginx
server {
    listen 80;
    server_name tu-dominio.com; # Cambia esto por tu dominio

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Aumentar límite de subida para imágenes (si usas CRM)
    client_max_body_size 10M;
}
```

### Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/topotours /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. Configurar SSL Gratis (HTTPS) con Certbot

Es fundamental tener HTTPS para un sitio profesional.

```bash
sudo apt install -y python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```
*Sigue las instrucciones en pantalla para activar la redirección automática a HTTPS.*

---

## 6. Mantenimiento y Comandos Útiles

- **Ver estado del servidor:** `pm2 status`
- **Ver logs en tiempo real:** `pm2 logs topotours`
- **Reiniciar aplicación:** `pm2 restart topotours`
- **Actualizar el código:**
  ```bash
  git pull
  ./deploy.sh
  ```

---

## ✅ ¡Listo!
Tu proyecto ahora debería estar en línea en `https://tu-dominio.com`. El CRM estará disponible en `https://tu-dominio.com/admin`.
