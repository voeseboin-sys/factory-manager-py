// Configuración de la aplicación
// Factory Manager PY

export const APP_CONFIG = {
  // Información de la app
  nombre: 'Factory Manager PY',
  version: '1.0.0',
  descripcion: 'Sistema de gestión empresarial para fábricas',
  
  // Moneda
  moneda: {
    codigo: 'PYG',
    nombre: 'Guaraníes Paraguayos',
    simbolo: '₲',
    locale: 'es-PY',
  },
  
  // Tema
  tema: {
    default: 'dark' as 'dark' | 'light',
    permitirCambio: true,
  },
  
  // Almacenamiento
  storage: {
    prefix: 'factory_',
    keys: {
      productos: 'factory_productos',
      ventas: 'factory_ventas',
      gastosFabrica: 'factory_gastos_fabrica',
      gastosPersonales: 'factory_gastos_personales',
      produccion: 'factory_produccion',
      dineroTotal: 'factory_dinero_total',
    },
  },
  
  // Fechas
  fecha: {
    meses: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    formatoFecha: 'DD/MM/YYYY',
    formatoFechaHora: 'DD/MM/YYYY HH:mm',
  },
  
  // Categorías de gastos de fábrica
  categoriasGastoFabrica: {
    materia_prima: 'Materia Prima',
    mano_obra: 'Mano de Obra',
    servicios: 'Servicios',
    mantenimiento: 'Mantenimiento',
    otros: 'Otros',
  },
  
  // Categorías de gastos personales
  categoriasGastoPersonal: {
    alimentacion: 'Alimentación',
    transporte: 'Transporte',
    salud: 'Salud',
    educacion: 'Educación',
    ocio: 'Ocio',
    otros: 'Otros',
  },
};

// Función helper para formatear moneda
export function formatMoneda(monto: number): string {
  return new Intl.NumberFormat(APP_CONFIG.moneda.locale, {
    style: 'currency',
    currency: APP_CONFIG.moneda.codigo,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
}

// Función helper para formatear número corto
export function formatMonedaCorta(monto: number): string {
  if (monto >= 1000000) {
    return `${APP_CONFIG.moneda.simbolo}${(monto / 1000000).toFixed(1)}M`;
  }
  if (monto >= 1000) {
    return `${APP_CONFIG.moneda.simbolo}${(monto / 1000).toFixed(0)}K`;
  }
  return `${APP_CONFIG.moneda.simbolo}${monto}`;
}

// Función helper para obtener nombre de mes
export function getNombreMes(mes: number): string {
  return APP_CONFIG.fecha.meses[mes] || '';
}
