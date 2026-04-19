#!/bin/bash
# ============================================
# update.sh - Actualiza topotours sin tocar
# la base de datos ni las webs de Elina/Mabel
# ============================================

set -e
cd ~/AgenciasViaje

echo "📦 Guardando cambios locales del VPS (si los hay)..."
git stash

echo "⬇️  Descargando últimos cambios de GitHub..."
git pull

echo "🗑️  Descartando stash (los cambios locales del VPS no importan)..."
git stash drop 2>/dev/null || true

echo "🔨 Compilando frontend..."
cd frontend
npm install --silent
npm run build
cd ..

echo "⚙️  Actualizando dependencias del backend..."
cd backend
npm install --silent
cd ..

echo "🖥️  Actualizando dependencias del CRM..."
cd crm
npm install --silent
npm run build
cd ..

echo "🔄 Reiniciando servicios de topotours..."
pm2 restart agencia-real topo-api topo-crm
pm2 save

echo ""
echo "✅ Listo! Estado actual:"
pm2 list
echo ""
echo "🌐 Verificando servicios..."
sleep 2
curl -s -o /dev/null -w "Frontend (3005): %{http_code}\n" http://localhost:3005
curl -s -o /dev/null -w "API     (4000): %{http_code}\n" http://localhost:4000/health
