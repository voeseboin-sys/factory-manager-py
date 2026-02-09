# Factory Manager PY

Sistema de gestión empresarial para fábricas. Aplicación Android con soporte web, diseñada específicamente para empresas paraguayas que operan con Guaraníes (PYG).

## Características

### Panel Principal (Dashboard)
- **Dinero Total**: Monto real disponible (se actualiza con ventas y gastos personales)
- **Ventas del Mes**: Valor total vendido en el mes seleccionado
- **Gastos de Fábrica**: Gastos de producción del mes
- **Gastos Personales**: Gastos personales del mes (se descuentan del dinero total)
- **Unidades Fabricadas**: Total producido en el mes
- **Stock Total**: Unidades disponibles en inventario
- **Costo por Unidad**: Calculado automáticamente según gastos del mes
- **Ganancia del Mes**: Ventas menos gastos de fábrica

### Gestión de Productos
- Precio mayorista y minorista
- Control de stock
- Costo de producción automático
- CRUD completo (Crear, Leer, Actualizar, Eliminar)

### Sistema de Ventas
- Selección de productos con validación de stock
- Precio mayorista o minorista por item
- Descuentos por porcentaje antes de finalizar
- Registro de cliente (opcional)
- Notas adicionales
- Eliminación de ventas (reintegra al dinero total)

### Gastos de Fábrica
- Categorías: Materia Prima, Mano de Obra, Servicios, Mantenimiento, Otros
- Se reflejan automáticamente en el costo del producto del mes
- Organización por mes y año

### Gastos Personales
- Categorías: Alimentación, Transporte, Salud, Educación, Ocio, Otros
- Se descuentan directamente del dinero total
- Organización por mes y año

### Producción
- Registro de unidades fabricadas por producto
- Cálculo automático de costo unitario
- Actualización automática de stock
- Historial por mes

### Reportes PDF
- Extracto mensual completo
- Incluye todas las métricas, ventas, gastos y producción
- Formato profesional para impresión o compartir

## Moneda
**Guaraníes Paraguayos (PYG)** - Símbolo: ₲

## Tecnologías
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Capacitor (para Android)
- LocalStorage (persistencia de datos)
- jsPDF + html2canvas (exportación PDF)

---

## Guía para Subir a GitHub y Compilar APK

### Paso 1: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** (New repository)
3. Nombre del repositorio: `factory-manager-py`
4. Selecciona **"Public"** o **"Private"**
5. NO inicialices con README (ya tenemos uno)
6. Haz clic en **"Create repository"**

### Paso 2: Subir el Código

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Crear primer commit
git commit -m "Initial commit: Factory Manager PY"

# Conectar con GitHub (reemplaza TU_USUARIO con tu nombre de usuario)
git remote add origin https://github.com/TU_USUARIO/factory-manager-py.git

# Subir código
git push -u origin main
```

> **Nota**: Si tu rama principal se llama `master` en lugar de `main`, usa:
> ```bash
> git push -u origin master
> ```

### Paso 3: Configurar GitHub Actions

El workflow ya está configurado en `.github/workflows/build-apk.yml`. 

Para que funcione correctamente, necesitas:

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** → **"Actions"** → **"General"**
3. En **"Workflow permissions"**, selecciona:
   - ☑️ **Read and write permissions**
   - ☑️ **Allow GitHub Actions to create and approve pull requests**
4. Haz clic en **"Save"**

### Paso 4: Compilar el APK Automáticamente

Cada vez que hagas push a `main` o `master`, el APK se compilará automáticamente.

Para compilar manualmente:

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Selecciona el workflow **"Build Android APK"**
3. Haz clic en **"Run workflow"** → **"Run workflow"**
4. Espera 5-10 minutos

### Paso 5: Descargar el APK

1. Una vez completado el workflow, ve a **"Actions"**
2. Selecciona la ejecución más reciente
3. Desplázate hacia abajo a **"Artifacts"**
4. Descarga **"apk-debug"**
5. También puedes encontrarlo en **"Releases"** del repositorio

---

## Compilar APK Localmente (Opcional)

Si prefieres compilar en tu computadora:

### Requisitos
- Node.js 20+
- Java JDK 17
- Android Studio
- Android SDK

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Construir la app web
npm run build

# 3. Agregar plataforma Android
npx cap add android

# 4. Sincronizar cambios
npx cap sync android

# 5. Abrir en Android Studio
npx cap open android

# 6. En Android Studio:
#    - Build → Build Bundle(s) / APK(s) → Build APK(s)
#    - O usa: Build → Generate Signed Bundle / APK
```

El APK se generará en:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## Estructura del Proyecto

```
factory-manager-py/
├── .github/
│   └── workflows/
│       └── build-apk.yml      # Workflow de GitHub Actions
├── android/                    # Proyecto Android (generado por Capacitor)
├── src/
│   ├── components/ui/          # Componentes shadcn/ui
│   ├── hooks/
│   │   ├── useStorage.ts       # Hooks para persistencia de datos
│   │   └── useDashboard.ts     # Hooks para métricas
│   ├── sections/
│   │   ├── Dashboard.tsx       # Panel principal
│   │   ├── Productos.tsx       # Gestión de productos
│   │   ├── Ventas.tsx          # Sistema de ventas
│   │   ├── GastosFabrica.tsx   # Gastos de fábrica
│   │   ├── GastosPersonales.tsx # Gastos personales
│   │   ├── Produccion.tsx      # Registro de producción
│   │   └── Reportes.tsx        # Exportación PDF
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Punto de entrada
├── capacitor.config.ts         # Configuración de Capacitor
├── package.json
├── README.md
└── ...
```

---

## Uso de la Aplicación

### Primer Uso

1. Al abrir la app, el **Dinero Total** será 0
2. Ve a **"Gastos Personales"** y registra un ingreso inicial (concepto: "Capital inicial")
3. Crea tus productos en **"Productos"**
4. Registra gastos de fábrica en **"Gastos Fábrica"**
5. Registra producción en **"Producción"**
6. Comienza a registrar ventas en **"Ventas"**

### Flujo de Trabajo Mensual

1. **Registra gastos de fábrica** según ocurran
2. **Registra producción** diaria/semanal
3. **Registra ventas** en tiempo real
4. **Registra gastos personales** según ocurran
5. Al final del mes, genera un **Reporte PDF**

### Lógica de Negocio

- **Gastos de fábrica** de un mes afectan el **costo unitario** de los productos fabricados ese mes
- **Ventas** incrementan el **dinero total**
- **Gastos personales** decrementan el **dinero total**
- **Producción** incrementa el **stock** de productos
- **Ventas** decrementan el **stock** de productos

---

## Actualizar la App

Para actualizar después de hacer cambios:

```bash
# Hacer cambios en el código...

# Subir a GitHub
git add .
git commit -m "Descripción de cambios"
git push origin main

# GitHub Actions compilará automáticamente el nuevo APK
```

---

## Solución de Problemas

### Error: "No se puede instalar el APK"
- Activa "Orígenes desconocidos" en Configuración → Seguridad

### Datos perdidos
- Los datos se guardan en el dispositivo (localStorage)
- Al desinstalar, se pierden los datos
- Exporta PDFs periódicamente como respaldo

### Error en GitHub Actions
- Ve a **Actions** → selecciona el workflow fallido
- Revisa los logs para identificar el error
- Asegúrate de que `package.json` y `package-lock.json` estén en el repositorio

---

## Licencia

MIT License - Libre para uso personal y comercial.

---

## Soporte

Para reportar problemas o sugerencias, crea un **Issue** en el repositorio de GitHub.

---

**Desarrollado para fábricas paraguayas** 🇵🇾
