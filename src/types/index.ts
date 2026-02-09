// Tipos principales para Factory Manager PY

// Moneda: Guaraníes Paraguayos (PYG)

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precioMayorista: number;  // Precio por mayor
  precioMinorista: number;  // Precio por menor
  costoProduccion: number;  // Costo calculado según gastos del mes
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface VentaItem {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;  // Precio aplicado (mayorista o minorista)
  tipoPrecio: 'mayorista' | 'minorista';
  subtotal: number;
}

export interface Venta {
  id: string;
  fecha: string;
  mes: number;  // 0-11
  anio: number;
  items: VentaItem[];
  subtotal: number;
  descuento: number;  // Porcentaje 0-100
  total: number;
  cliente?: string;
  notas?: string;
}

export interface GastoFabrica {
  id: string;
  fecha: string;
  mes: number;
  anio: number;
  concepto: string;
  monto: number;
  categoria: 'materia_prima' | 'mano_obra' | 'servicios' | 'mantenimiento' | 'otros';
}

export interface GastoPersonal {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  categoria: 'alimentacion' | 'transporte' | 'salud' | 'educacion' | 'ocio' | 'otros';
}

export interface Produccion {
  id: string;
  fecha: string;
  mes: number;
  anio: number;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  costoUnitario: number;  // Calculado según gastos del mes
}

export interface DatosMes {
  mes: number;
  anio: number;
  ventas: Venta[];
  gastosFabrica: GastoFabrica[];
  produccion: Produccion[];
  costoProductoPromedio: number;
}

export interface EstadoFinanciero {
  dineroTotal: number;  // Dinero real disponible (se actualiza con ventas y gastos personales)
  gastosPersonales: GastoPersonal[];
  historialMeses: DatosMes[];
}

export interface DashboardData {
  dineroTotal: number;
  ventasMes: number;
  gastosFabricaMes: number;
  gastosPersonalesMes: number;
  unidadesFabricadasMes: number;
  stockTotal: number;
  costoProductoPromedio: number;
  gananciaMes: number;
}

export type CategoriaGastoFabrica = 'materia_prima' | 'mano_obra' | 'servicios' | 'mantenimiento' | 'otros';
export type CategoriaGastoPersonal = 'alimentacion' | 'transporte' | 'salud' | 'educacion' | 'ocio' | 'otros';

export const CATEGORIAS_GASTO_FABRICA: Record<CategoriaGastoFabrica, string> = {
  materia_prima: 'Materia Prima',
  mano_obra: 'Mano de Obra',
  servicios: 'Servicios',
  mantenimiento: 'Mantenimiento',
  otros: 'Otros'
};

export const CATEGORIAS_GASTO_PERSONAL: Record<CategoriaGastoPersonal, string> = {
  alimentacion: 'Alimentación',
  transporte: 'Transporte',
  salud: 'Salud',
  educacion: 'Educación',
  ocio: 'Ocio',
  otros: 'Otros'
};

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
