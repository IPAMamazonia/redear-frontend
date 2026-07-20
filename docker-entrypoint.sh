#!/bin/bash
set -e

echo "Instalando dependencias..."
npm install

echo "Iniciando o servidor de desenvolvimento Vite (Hot-Reload)..."
exec npm run dev -- --host
