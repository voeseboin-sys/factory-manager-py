import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Factory, 
  User,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboard, formatPYG } from '@/hooks/useDashboard';
import { MESES } from '@/types';

interface DashboardProps {
  productos: ReturnType<typeof import('@/hooks/useStorage').useProductos>;
  ventas: ReturnType<typeof import('@/hooks/useStorage').useVentas>;
  gastosFabrica: ReturnType<typeof import('@/hooks/useStorage').useGastosFabrica>;
  gastosPersonales: ReturnType<typeof import('@/hooks/useStorage').useGastosPersonales>;
  produccion: ReturnType<typeof import('@/hooks/useStorage').useProduccion>;
  dineroTotal: ReturnType<typeof import('@/hooks/useStorage').useDineroTotal>;
  toast: typeof import('sonner').toast;
}

export default function Dashboard({
  productos,
  ventas,
  gastosFabrica,
  gastosPersonales,
  produccion,
  dineroTotal,
}: DashboardProps) {
  const hoy = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());

  const data = useDashboard(
    dineroTotal.dineroTotal,
    ventas.ventas,
    gastosFabrica.gastos,
    gastosPersonales.gastos,
    produccion.produccion,
    productos.productos,
    mesSeleccionado,
    anioSeleccionado
  );

  const anios = useMemo(() => {
    const aniosSet = new Set<number>();
    aniosSet.add(hoy.getFullYear());
    aniosSet.add(hoy.getFullYear() - 1);
    ventas.ventas.forEach(v => aniosSet.add(v.anio));
    gastosFabrica.gastos.forEach(g => aniosSet.add(g.anio));
    produccion.produccion.forEach(p => aniosSet.add(p.anio));
    return Array.from(aniosSet).sort((a, b) => b - a);
  }, [ventas.ventas, gastosFabrica.gastos, produccion.produccion]);

  const stats = [
    {
      title: 'Dinero Total',
      value: formatPYG(data.dineroTotal),
      description: 'Dinero real disponible',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Ventas del Mes',
      value: formatPYG(data.ventasMes),
      description: `${MESES[mesSeleccionado]} ${anioSeleccionado}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Gastos de Fábrica',
      value: formatPYG(data.gastosFabricaMes),
      description: 'Gastos de producción',
      icon: Factory,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      title: 'Gastos Personales',
      value: formatPYG(data.gastosPersonalesMes),
      description: 'Gastos del mes',
      icon: User,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
    },
    {
      title: 'Unidades Fabricadas',
      value: data.unidadesFabricadasMes.toLocaleString(),
      description: 'Total del mes',
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Stock Total',
      value: data.stockTotal.toLocaleString(),
      description: 'Unidades en inventario',
      icon: Package,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
    {
      title: 'Costo por Unidad',
      value: formatPYG(data.costoProductoPromedio),
      description: 'Promedio del mes',
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      title: 'Ganancia del Mes',
      value: formatPYG(data.gananciaMes),
      description: 'Ventas - Gastos Fábrica',
      icon: data.gananciaMes >= 0 ? TrendingUp : TrendingDown,
      color: data.gananciaMes >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: data.gananciaMes >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: data.gananciaMes >= 0 ? 'border-green-500/20' : 'border-red-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-blue-400" />
              <span className="font-medium">Período:</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Select value={mesSeleccionado.toString()} onValueChange={(v) => setMesSeleccionado(parseInt(v))}>
                <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {MESES.map((mes, index) => (
                    <SelectItem key={index} value={index.toString()} className="text-white hover:bg-gray-600">
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={anioSeleccionado.toString()} onValueChange={(v) => setAnioSeleccionado(parseInt(v))}>
                <SelectTrigger className="w-full sm:w-32 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {anios.map((anio) => (
                    <SelectItem key={anio} value={anio.toString()} className="text-white hover:bg-gray-600">
                      {anio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`bg-gray-800 ${stat.borderColor} border-2`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumen del mes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            Resumen de {MESES[mesSeleccionado]} {anioSeleccionado}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Ingresos</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatPYG(data.ventasMes)}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Egresos (Fábrica)</p>
              <p className="text-2xl font-bold text-orange-400">
                {formatPYG(data.gastosFabricaMes)}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Balance</p>
              <p className={`text-2xl font-bold ${data.gananciaMes >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPYG(data.gananciaMes)}
              </p>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <p className="text-blue-300 text-sm">
              <strong>Nota:</strong> Los gastos de fábrica de {MESES[mesSeleccionado]} se reflejan 
              automáticamente en el costo de los productos vendidos este mes. 
              Los gastos personales se deducen directamente del Dinero Total.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
