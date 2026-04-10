#!/bin/bash

# Salir en caso de error
set -e

echo "🚀 Iniciando despliegue de Topotours..."

# 1. Asegurar estructura de carpetas
mkdir -p backend/public

# 2. Preparar Backend
echo "📦 Instalando dependencias del Backend..."
cd backend
npm install
npx prisma generate
npx prisma db push --accept-data-loss

# Copiar .env de ejemplo si no existe
if [ ! -f .env ]; then
    echo "⚠️ .env no encontrado en backend. Creando uno por defecto..."
    echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
    echo 'PORT=3000' >> .env
fi

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

# Verificar si PM2 está instalado, si no lanzar con node directo o avisar
if command -v pm2 &> /dev/null; then
    pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
else
    echo "⚠️ PM2 no encontrado. Iniciando servidor con Node (no recomendado para producción)..."
    cd backend && npm start &
fi

echo "✅ Despliegue completado con éxito!"
