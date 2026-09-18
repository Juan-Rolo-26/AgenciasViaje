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

echo "⚙️ Escribiendo backend/.env..."
cat > backend/.env <<EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
NODE_ENV=production
ADMIN_SECRET="topotours2026admin"
EOF

# 2. Preparar Backend
echo "📦 Instalando dependencias del Backend..."
cd backend
npm install
npm exec prisma generate
npm exec prisma db push

echo "🗂️ Restaurando assets versionados del catálogo..."
cd ..
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git restore -- backend/public/assets
fi

# 3. Preparar Frontend y CRM
echo "📦 Construyendo Frontend..."
cd frontend
npm install
npm run build

echo "🖼️ Sincronizando imágenes públicas..."
mkdir -p ../backend/public/assets
if [ -d public/assets ]; then
    cp -a public/assets/. ../backend/public/assets/
fi

echo "📦 Construyendo CRM..."
cd ../crm
npm install
npm run build

# 4. Volver al root y reiniciar proceso
echo "🔄 Reiniciando aplicación con PM2..."
cd ..

test -f backend/public/index.html
test -f backend/public/admin/index.html
test -f backend/public/assets/logo.png || test -f backend/public/assets/logo-COoolgsY.png

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
