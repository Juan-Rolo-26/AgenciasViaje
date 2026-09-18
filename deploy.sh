#!/usr/bin/env bash

# Salir en caso de error
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "🚀 Iniciando despliegue de Topotours..."

# 1. Asegurar estructura de carpetas
command -v node >/dev/null || { echo "❌ Falta Node.js"; exit 1; }
command -v npm >/dev/null || { echo "❌ Falta npm"; exit 1; }
command -v pm2 >/dev/null || { echo "❌ Falta PM2: npm install -g pm2"; exit 1; }

if [ ! -f backend/.env ]; then
    echo "⚠️ Creando backend/.env con configuración local segura..."
    ADMIN_SECRET="$(openssl rand -hex 32 2>/dev/null || date +%s)"
    cat > backend/.env <<EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
NODE_ENV=production
ADMIN_SECRET="$ADMIN_SECRET"
EOF
fi

# 2. Preparar Backend
echo "📦 Instalando dependencias del Backend..."
cd backend
npm install
npm exec prisma generate
npm exec prisma db push

# 3. Preparar Frontend y CRM
echo "📦 Construyendo Frontend..."
cd ../frontend
npm install
npm run build

echo "📦 Construyendo CRM..."
cd ../crm
npm install
npm run build

# 4. Volver al root y reiniciar proceso
echo "🔄 Reiniciando aplicación con PM2..."
cd ..

test -f backend/public/index.html
test -f backend/public/admin/index.html

echo "🌐 Configurando Nginx..."
if command -v nginx >/dev/null && [ -d /etc/nginx ]; then
    mkdir -p /var/www/certbot
    install -m 0644 deploy/nginx-topotours.conf /etc/nginx/sites-available/topotours.com.conf
    ln -sfn /etc/nginx/sites-available/topotours.com.conf /etc/nginx/sites-enabled/topotours.com.conf
    rm -f /etc/nginx/sites-enabled/admin.topotours.com
    nginx -t
    systemctl reload nginx
fi

echo "🧹 Eliminando procesos duplicados de esta aplicación..."
pm2 delete topo-api topo-crm 2>/dev/null || true
pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save

sleep 2
curl --fail --silent http://127.0.0.1:3000/health >/dev/null
curl --fail --silent http://127.0.0.1:3000/admin/ >/dev/null

echo "✅ Despliegue completado con éxito!"
