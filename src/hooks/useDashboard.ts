import { useMemo } from 'react';
import type { 
  Venta, 
  GastoFabrica, 
  GastoPersonal, 
  Produccion, 
  Producto,
  DashboardData 
} from '@/types';

export function useDashboard(
  dineroTotal: number,
  ventas: Venta[],
  gastosFabrica: GastoFabrica[],
  gastosPersonales: GastoPersonal[],
  produccion: Produccion[],
  productos: Producto[],
  mes: number,
  anio: number
): DashboardData {
  return useMemo(() => {
    // Filtrar por mes y año
    const ventasMes = ventas.filter(v => v.mes === mes && v.anio === anio);
    const gastosFabMes = gastosFabrica.filter(g => g.mes === mes && g.anio === anio);
    const prodMes = produccion.filter(p => p.mes === mes && p.anio === anio);
    
    // Filtrar gastos personales por mes (usando fecha)
    const gastosPersMes = gastosPersonales.filter(g => {
      const fecha = new Date(g.fecha);
      return fecha.getMonth() === mes && fecha.getFullYear() === anio;
    });

    // Calcular totales
    const totalVentas = ventasMes.reduce((sum, v) => sum + v.total, 0);
    const totalGastosFabrica = gastosFabMes.reduce((sum, g) => sum + g.monto, 0);
    const totalGastosPersonales = gastosPersMes.reduce((sum, g) => sum + g.monto, 0);
    const unidadesFabricadas = prodMes.reduce((sum, p) => sum + p.cantidad, 0);
    
    // Stock total (suma de todos los productos)
    const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);

    // Costo promedio del producto (basado en gastos de fábrica del mes)
    const costoProductoPromedio = unidadesFabricadas > 0 
      ? totalGastosFabrica / unidadesFabricadas 
      : 0;

    // Ganancia del mes (ventas - gastos de fábrica)
    const gananciaMes = totalVentas - totalGastosFabrica;

    return {
      dineroTotal,
      ventasMes: totalVentas,
      gastosFabricaMes: totalGastosFabrica,
      gastosPersonalesMes: totalGastosPersonales,
      unidadesFabricadasMes: unidadesFabricadas,
      stockTotal,
      costoProductoPromedio,
      gananciaMes,
    };
  }, [dineroTotal, ventas, gastosFabrica, gastosPersonales, produccion, productos, mes, anio]);
}

// Hook para estadísticas históricas
export function useEstadisticas(
  ventas: Venta[],
  gastosFabrica: GastoFabrica[],
  produccion: Produccion[],
  anio: number
) {
  return useMemo(() => {
    const meses = Array.from({ length: 12 }, (_, i) => i);
    
    return meses.map(mes => {
      const ventasMes = ventas.filter(v => v.mes === mes && v.anio === anio);
      const gastosMes = gastosFabrica.filter(g => g.mes === mes && g.anio === anio);
      const prodMes = produccion.filter(p => p.mes === mes && p.anio === anio);

      const totalVentas = ventasMes.reduce((sum, v) => sum + v.total, 0);
      const totalGastos = gastosMes.reduce((sum, g) => sum + g.monto, 0);
      const unidades = prodMes.reduce((sum, p) => sum + p.cantidad, 0);

      return {
        mes,
        ventas: totalVentas,
        gastos: totalGastos,
        ganancia: totalVentas - totalGastos,
        unidades,
      };
    });
  }, [ventas, gastosFabrica, produccion, anio]);
}

// Formatear moneda (Guaraníes Paraguayos)
export function formatPYG(monto: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
}

// Formatear número corto (para gráficos)
export function formatCortoPYG(monto: number): string {
  if (monto >= 1000000) {
    return `₲${(monto / 1000000).toFixed(1)}M`;
  }
  if (monto >= 1000) {
    return `₲${(monto / 1000).toFixed(0)}K`;
  }
  return `₲${monto}`;
}
