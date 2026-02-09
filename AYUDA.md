# Ayuda - Factory Manager PY

## 📖 Cómo Usar la Aplicación

### Primeros Pasos

1. **Al abrir la app por primera vez**, verás el Dashboard con valores en 0
2. **Establece tu capital inicial**:
   - Ve a "Gastos Personales"
   - Registra un gasto negativo (concepto: "Capital inicial", monto: -1000000)
   - O simplemente registra una venta inicial

3. **Crea tus productos**:
   - Ve a "Productos"
   - Click en "Nuevo Producto"
   - Ingresa nombre, precio mayorista, precio minorista y stock inicial

4. **Registra gastos de fábrica**:
   - Ve a "Gastos Fábrica"
   - Registra todos los gastos de producción (materia prima, mano de obra, etc.)
   - Estos gastos afectarán el costo unitario de los productos

5. **Registra producción**:
   - Ve a "Producción"
   - Registra las unidades fabricadas
   - El costo unitario se calcula automáticamente

6. **Comienza a vender**:
   - Ve a "Ventas"
   - Selecciona productos, cantidades y tipo de precio
   - Aplica descuentos si es necesario
   - Finaliza la venta

---

## 💡 Consejos de Uso

### Organización Mensual
- Los **gastos de fábrica** se organizan por mes y afectan el costo de ese mes
- Las **ventas** se registran con fecha y se suman al dinero total
- Los **gastos personales** se descuentan inmediatamente del dinero total
- La **producción** queda registrada en el mes correspondiente

### Cálculo de Costos
```
Costo Unitario = Total Gastos Fábrica del Mes / Total Unidades Producidas del Mes
```

### Flujo Correcto
1. Registra gastos de fábrica durante el mes
2. Registra producción
3. El costo unitario se calcula automáticamente
4. Vende productos con el costo ya calculado
5. Registra gastos personales según ocurran

---

## ❓ Preguntas Frecuentes

### ¿Por qué el dinero total no cambia con los gastos de fábrica?
Los gastos de fábrica **NO** afectan el dinero total directamente. Afectan el **costo del producto**. El dinero total solo cambia con:
- **Ventas** (incrementan)
- **Gastos personales** (decrementan)

### ¿Cómo se calcula el costo del producto?
El costo se calcula dividiendo los gastos de fábrica del mes entre las unidades producidas ese mismo mes.

### ¿Puedo vender productos de meses anteriores?
¡Sí! El stock es acumulativo. Los productos fabricados en enero pueden venderse en febrero, pero mantendrán el costo de enero.

### ¿Qué pasa si elimino una venta?
El monto de la venta se **descuenta** del dinero total y el stock de los productos se **reintegra**.

### ¿Qué pasa si elimino un gasto personal?
El monto se **reintegra** al dinero total.

### ¿Qué pasa si elimino un gasto de fábrica?
El gasto se elimina, pero los costos unitarios ya calculados **NO** se actualizan automáticamente.

### ¿Cómo hago un respaldo de mis datos?
Genera un **Reporte PDF** mensual desde la sección "Reportes PDF". Esto crea un extracto completo que puedes guardar o compartir.

### ¿Los datos se guardan en la nube?
No. Los datos se guardan **localmente** en tu dispositivo. Al desinstalar la app, se pierden los datos.

---

## 🐛 Solución de Problemas

### La app no abre
- Cierra y vuelve a abrir
- Reinicia tu dispositivo
- Reinstala la app (perderás los datos)

### No puedo registrar una venta
- Verifica que haya **stock disponible**
- Verifica que los **productos estén creados**

### El PDF no se genera
- Verifica que tengas **espacio disponible** en el dispositivo
- Intenta con un mes con menos datos

### Los números no cuadran
- Revisa que todos los gastos estén registrados
- Verifica que no haya ventas eliminadas
- Recuerda que los gastos de fábrica afectan el costo, no el dinero total

---

## 📊 Entendiendo el Dashboard

| Métrica | Descripción | Cálculo |
|---------|-------------|---------|
| **Dinero Total** | Efectivo real disponible | Ventas - Gastos Personales |
| **Ventas del Mes** | Total vendido este mes | Suma de todas las ventas del mes |
| **Gastos de Fábrica** | Costos de producción | Suma de gastos de fábrica del mes |
| **Gastos Personales** | Gastos personales | Suma de gastos personales del mes |
| **Unidades Fabricadas** | Producción del mes | Suma de unidades producidas |
| **Stock Total** | Inventario actual | Suma de stock de todos los productos |
| **Costo por Unidad** | Costo promedio | Gastos Fábrica / Unidades Fabricadas |
| **Ganancia del Mes** | Utilidad | Ventas - Gastos de Fábrica |

---

## 🎯 Ejemplo Práctico

### Mes de Enero

1. **Gastos de Fábrica**:
   - Materia prima: ₲500,000
   - Mano de obra: ₲300,000
   - Total: ₲800,000

2. **Producción**:
   - 100 unidades del Producto A
   - Costo unitario: ₲800,000 / 100 = ₲8,000

3. **Ventas**:
   - Vendes 80 unidades a ₲15,000 = ₲1,200,000
   - Dinero total: +₲1,200,000

4. **Gastos Personales**:
   - Alimentación: ₲200,000
   - Dinero total: -₲200,000

5. **Resultado**:
   - Dinero Total: ₲1,000,000
   - Ganancia: ₲1,200,000 - ₲800,000 = ₲400,000
   - Stock: 20 unidades

---

## 📞 Contacto

Para soporte técnico o sugerencias, crea un **Issue** en el repositorio de GitHub.

---

**¡Éxito en tu negocio!** 🚀
