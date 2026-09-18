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
    echo "❌ Falta backend/.env; no se crea automáticamente."
    exit 1
fi

# 2. Preparar Backend
echo "📦 Instalando dependencias del Backend..."
cd backend
npm install
npm exec prisma generate

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

pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save

sleep 2
curl --fail --silent http://127.0.0.1:3000/health >/dev/null
curl --fail --silent http://127.0.0.1:3000/admin/ >/dev/null

echo "✅ Despliegue completado con éxito!"
