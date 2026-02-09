#!/bin/bash

# Script de configuración para GitHub
# Factory Manager PY

echo "=========================================="
echo "Factory Manager PY - Setup GitHub"
echo "=========================================="
echo ""

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instala Git primero."
    exit 1
fi

# Verificar si se proporcionó el usuario de GitHub
if [ -z "$1" ]; then
    echo "Uso: ./setup-github.sh <tu-usuario-github> [nombre-repositorio]"
    echo ""
    echo "Ejemplo:"
    echo "  ./setup-github.sh miusuario factory-manager-py"
    echo ""
    exit 1
fi

GITHUB_USER=$1
REPO_NAME=${2:-"factory-manager-py"}

echo "📝 Configuración:"
echo "   Usuario GitHub: $GITHUB_USER"
echo "   Repositorio: $REPO_NAME"
echo ""

# Inicializar git si no existe
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando repositorio Git..."
    git init
fi

# Agregar todos los archivos
echo "📁 Agregando archivos..."
git add .

# Crear commit inicial
echo "💾 Creando commit inicial..."
git commit -m "Initial commit: Factory Manager PY - Sistema de gestión empresarial"

# Verificar si ya existe remote
if git remote | grep -q "origin"; then
    echo "🔄 Actualizando remote origin..."
    git remote remove origin
fi

# Agregar remote
echo "🔗 Conectando con GitHub..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "=========================================="
echo "✅ Configuración completada!"
echo "=========================================="
echo ""
echo "Ahora ejecuta:"
echo ""
echo "  git push -u origin main"
echo ""
echo "O si tu rama principal es 'master':"
echo ""
echo "  git push -u origin master"
echo ""
echo "=========================================="
echo "📱 Para compilar el APK automáticamente:"
echo "=========================================="
echo ""
echo "1. Ve a: https://github.com/$GITHUB_USER/$REPO_NAME/actions"
echo "2. Selecciona 'Build Android APK'"
echo "3. Click en 'Run workflow'"
echo "4. Espera 5-10 minutos"
echo "5. Descarga el APK desde 'Artifacts'"
echo ""
