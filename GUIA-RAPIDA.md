# Guía Rápida - Factory Manager PY

## 🚀 Subir a GitHub y Compilar APK

### Opción 1: Script Automático (Recomendado)

```bash
# Dar permisos al script
chmod +x setup-github.sh

# Ejecutar con tu usuario de GitHub
./setup-github.sh TU_USUARIO_GITHUB

# Subir código
git push -u origin main
```

### Opción 2: Comandos Manuales

```bash
# Inicializar git
git init

# Agregar archivos
git add .

# Commit
git commit -m "Initial commit"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/factory-manager-py.git

# Subir
git push -u origin main
```

---

## 📱 Compilar APK en GitHub

1. **Ve a tu repositorio en GitHub**
2. **Click en "Actions"**
3. **Selecciona "Build Android APK"**
4. **Click en "Run workflow" → "Run workflow"**
5. **Espera 5-10 minutos**
6. **Descarga el APK desde "Artifacts"**

El APK también aparecerá automáticamente en **"Releases"**.

---

## 💻 Compilar APK Localmente

### Requisitos
- Node.js 20+
- Java JDK 17
- Android Studio

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Construir web
npm run build

# 3. Agregar Android
npx cap add android

# 4. Sincronizar
npx cap sync android

# 5. Abrir Android Studio
npx cap open android

# 6. En Android Studio: Build → Build APK
```

O usa el script:
```bash
npm run cap:build
```

---

## 🎨 Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Métricas financieras del mes |
| **Productos** | Gestión con precio mayorista/minorista |
| **Ventas** | Con descuentos y múltiples items |
| **Gastos Fábrica** | Afectan costo del producto |
| **Gastos Personales** | Se descuentan del dinero total |
| **Producción** | Registro de unidades fabricadas |
| **Reportes PDF** | Extracto mensual descargable |

---

## 💰 Flujo de Dinero

```
VENTAS → Incrementan DINERO TOTAL
GASTOS PERSONALES → Decrementan DINERO TOTAL
GASTOS FÁBRICA → Afectan COSTO DEL PRODUCTO
PRODUCCIÓN → Incrementan STOCK
```

---

## 📁 Estructura de Datos

Los datos se guardan en **localStorage** del dispositivo:
- `factory_productos`
- `factory_ventas`
- `factory_gastos_fabrica`
- `factory_gastos_personales`
- `factory_produccion`
- `factory_dinero_total`

---

## 🆘 Solución de Problemas

### Error al compilar
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error en Android
```bash
# Sincronizar nuevamente
npx cap sync android
```

### Datos perdidos
- Los datos se guardan localmente en el dispositivo
- Al desinstalar la app, se pierden los datos
- Exporta PDFs regularmente como respaldo

---

## 📞 Soporte

Crea un **Issue** en GitHub para reportar problemas.

---

**¡Listo para usar!** 🇵🇾
