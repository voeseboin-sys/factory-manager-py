import { useState, useRef } from 'react';
import { Download, TrendingUp, Factory, User, Package, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MESES } from '@/types';
import { formatPYG, useDashboard } from '@/hooks/useDashboard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportesProps {
  productos: ReturnType<typeof import('@/hooks/useStorage').useProductos>;
  ventas: ReturnType<typeof import('@/hooks/useStorage').useVentas>;
  gastosFabrica: ReturnType<typeof import('@/hooks/useStorage').useGastosFabrica>;
  gastosPersonales: ReturnType<typeof import('@/hooks/useStorage').useGastosPersonales>;
  produccion: ReturnType<typeof import('@/hooks/useStorage').useProduccion>;
  dineroTotal: ReturnType<typeof import('@/hooks/useStorage').useDineroTotal>;
  toast: typeof import('sonner').toast;
}

export default function Reportes({
  productos,
  ventas,
  gastosFabrica,
  gastosPersonales,
  produccion,
  dineroTotal,
  toast,
}: ReportesProps) {
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [generando, setGenerando] = useState(false);
  const reporteRef = useRef<HTMLDivElement>(null);

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

  const ventasMes = ventas.getVentasByMes(mesSeleccionado, anioSeleccionado);
  const gastosFabMes = gastosFabrica.getGastosByMes(mesSeleccionado, anioSeleccionado);
  const gastosPersMes = gastosPersonales.getGastosByMes(mesSeleccionado, anioSeleccionado);
  const prodMes = produccion.getProduccionByMes(mesSeleccionado, anioSeleccionado);

  const generarPDF = async () => {
    if (!reporteRef.current) return;
    
    setGenerando(true);
    toast.info('Generando PDF...');

    try {
      const canvas = await html2canvas(reporteRef.current, {
        scale: 2,
        backgroundColor: '#1f2937',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Extracto_${MESES[mesSeleccionado]}_${anioSeleccionado}.pdf`);
      
      toast.success('PDF descargado correctamente');
    } catch (error) {
      toast.error('Error al generar PDF');
      console.error(error);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={mesSeleccionado.toString()} onValueChange={(v) => setMesSeleccionado(parseInt(v))}>
                <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {MESES.map((mes, index) => (
                    <SelectItem key={index} value={index.toString()} className="text-white">
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
                  {[2024, 2025, 2026].map((anio) => (
                    <SelectItem key={anio} value={anio.toString()} className="text-white">
                      {anio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generarPDF} 
              disabled={generando}
              className="bg-red-600 hover:bg-red-700 w-full lg:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {generando ? 'Generando...' : 'Descargar PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vista previa del reporte */}
      <div ref={reporteRef} className="bg-gray-800 p-8 rounded-lg border border-gray-700">
        {/* Encabezado */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-600">
          <h1 className="text-3xl font-bold text-white mb-2">Factory Manager PY</h1>
          <p className="text-gray-400">Extracto Mensual de Operaciones</p>
          <p className="text-xl text-blue-400 font-semibold mt-2">
            {MESES[mesSeleccionado]} {anioSeleccionado}
          </p>
        </div>

        {/* Resumen Financiero */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Resumen Financiero
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Dinero Total</p>
              <p className="text-2xl font-bold text-emerald-400">{formatPYG(data.dineroTotal)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Ventas del Mes</p>
              <p className="text-2xl font-bold text-blue-400">{formatPYG(data.ventasMes)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Gastos de Fábrica</p>
              <p className="text-2xl font-bold text-orange-400">{formatPYG(data.gastosFabricaMes)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Gastos Personales</p>
              <p className="text-2xl font-bold text-pink-400">{formatPYG(data.gastosPersonalesMes)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Ganancia del Mes</p>
              <p className={`text-2xl font-bold ${data.gananciaMes >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPYG(data.gananciaMes)}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Costo Unitario Promedio</p>
              <p className="text-2xl font-bold text-yellow-400">{formatPYG(data.costoProductoPromedio)}</p>
            </div>
          </div>
        </div>

        {/* Producción */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-400" />
            Producción
          </h2>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Unidades Fabricadas</p>
                <p className="text-xl font-bold text-purple-400">{data.unidadesFabricadasMes.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Stock Total</p>
                <p className="text-xl font-bold text-cyan-400">{data.stockTotal.toLocaleString()}</p>
              </div>
            </div>
            {prodMes.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Detalle por Producto:</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-600">
                      <th className="text-left py-2">Producto</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Costo/u</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prodMes.map((p) => (
                      <tr key={p.id} className="border-b border-gray-700/50">
                        <td className="py-2 text-white">{p.productoNombre}</td>
                        <td className="py-2 text-right text-purple-400">{p.cantidad}</td>
                        <td className="py-2 text-right text-yellow-400">{formatPYG(p.costoUnitario)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Ventas Detalladas */}
        {ventasMes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Ventas del Mes ({ventasMes.length} ventas)
            </h2>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-600">
                    <th className="text-left py-2">Fecha</th>
                    <th className="text-left py-2">Cliente</th>
                    <th className="text-right py-2">Items</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasMes.map((v) => (
                    <tr key={v.id} className="border-b border-gray-700/50">
                      <td className="py-2 text-gray-300">
                        {new Date(v.fecha).toLocaleDateString('es-PY')}
                      </td>
                      <td className="py-2 text-white">{v.cliente || 'N/A'}</td>
                      <td className="py-2 text-right text-gray-300">{v.items.length}</td>
                      <td className="py-2 text-right text-emerald-400 font-semibold">{formatPYG(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gastos de Fábrica */}
        {gastosFabMes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Factory className="h-5 w-5 text-orange-400" />
              Gastos de Fábrica ({gastosFabMes.length} gastos)
            </h2>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-600">
                    <th className="text-left py-2">Fecha</th>
                    <th className="text-left py-2">Concepto</th>
                    <th className="text-left py-2">Categoría</th>
                    <th className="text-right py-2">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosFabMes.map((g) => (
                    <tr key={g.id} className="border-b border-gray-700/50">
                      <td className="py-2 text-gray-300">
                        {new Date(g.fecha).toLocaleDateString('es-PY')}
                      </td>
                      <td className="py-2 text-white">{g.concepto}</td>
                      <td className="py-2 text-gray-400">{g.categoria}</td>
                      <td className="py-2 text-right text-orange-400">{formatPYG(g.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gastos Personales */}
        {gastosPersMes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-pink-400" />
              Gastos Personales ({gastosPersMes.length} gastos)
            </h2>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-600">
                    <th className="text-left py-2">Fecha</th>
                    <th className="text-left py-2">Concepto</th>
                    <th className="text-left py-2">Categoría</th>
                    <th className="text-right py-2">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosPersMes.map((g) => (
                    <tr key={g.id} className="border-b border-gray-700/50">
                      <td className="py-2 text-gray-300">
                        {new Date(g.fecha).toLocaleDateString('es-PY')}
                      </td>
                      <td className="py-2 text-white">{g.concepto}</td>
                      <td className="py-2 text-gray-400">{g.categoria}</td>
                      <td className="py-2 text-right text-pink-400">{formatPYG(g.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pie de página */}
        <div className="mt-8 pt-6 border-t border-gray-600 text-center">
          <p className="text-gray-500 text-sm">
            Generado el {new Date().toLocaleDateString('es-PY', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-gray-600 text-xs mt-1">Factory Manager PY - Sistema de Gestión</p>
        </div>
      </div>
    </div>
  );
}
