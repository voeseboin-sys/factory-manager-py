import { useState, useMemo } from 'react';
import { Plus, TrendingUp, Trash2, Calendar, Package, Factory } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MESES } from '@/types';
import { formatPYG } from '@/hooks/useDashboard';

interface ProduccionProps {
  productos: ReturnType<typeof import('@/hooks/useStorage').useProductos>;
  produccion: ReturnType<typeof import('@/hooks/useStorage').useProduccion>;
  gastosFabrica: ReturnType<typeof import('@/hooks/useStorage').useGastosFabrica>;
  toast: typeof import('sonner').toast;
}

export default function ProduccionSection({ productos, produccion, gastosFabrica, toast }: ProduccionProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  // Calcular costo unitario basado en gastos del mes
  const costoUnitarioEstimado = useMemo(() => {
    const gastosMes = gastosFabrica.getTotalGastosMes(mesSeleccionado, anioSeleccionado);
    const unidadesMes = produccion.getTotalUnidadesMes(mesSeleccionado, anioSeleccionado);
    return unidadesMes > 0 ? gastosMes / unidadesMes : 0;
  }, [gastosFabrica, produccion, mesSeleccionado, anioSeleccionado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productoId) {
      toast.error('Selecciona un producto');
      return;
    }

    const producto = productos.getProductoById(formData.productoId);
    if (!producto) return;

    const fecha = new Date(formData.fecha);
    const cantidad = parseInt(formData.cantidad);

    // Calcular costo unitario para esta producción
    const gastosMes = gastosFabrica.getTotalGastosMes(fecha.getMonth(), fecha.getFullYear());
    const unidadesMes = produccion.getTotalUnidadesMes(fecha.getMonth(), fecha.getFullYear());
    const costoUnitario = unidadesMes + cantidad > 0 ? gastosMes / (unidadesMes + cantidad) : 0;

    produccion.addProduccion({
      fecha: formData.fecha,
      mes: fecha.getMonth(),
      anio: fecha.getFullYear(),
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad,
      costoUnitario,
    });

    // Actualizar stock del producto
    productos.updateProducto(producto.id, {
      stock: producto.stock + cantidad,
      costoProduccion: costoUnitario,
    });

    toast.success(`Producción registrada: ${cantidad} unidades de ${producto.nombre}`);
    setDialogoAbierto(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productoId: '',
      cantidad: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  const handleEliminar = (id: string) => {
    const prod = produccion.produccion.find(p => p.id === id);
    if (prod) {
      // Restar del stock
      const producto = productos.getProductoById(prod.productoId);
      if (producto) {
        productos.updateProducto(prod.productoId, {
          stock: Math.max(0, producto.stock - prod.cantidad),
        });
      }
    }
    produccion.deleteProduccion(id);
    toast.success('Registro de producción eliminado');
  };

  const produccionDelMes = produccion.getProduccionByMes(mesSeleccionado, anioSeleccionado);
  const totalUnidadesMes = produccion.getTotalUnidadesMes(mesSeleccionado, anioSeleccionado);
  const gastosMes = gastosFabrica.getTotalGastosMes(mesSeleccionado, anioSeleccionado);

  // Agrupar por producto
  const produccionPorProducto = produccionDelMes.reduce((acc, prod) => {
    if (!acc[prod.productoId]) {
      acc[prod.productoId] = {
        nombre: prod.productoNombre,
        cantidad: 0,
      };
    }
    acc[prod.productoId].cantidad += prod.cantidad;
    return acc;
  }, {} as Record<string, { nombre: string; cantidad: number }>);

  return (
    <div className="space-y-6">
      {/* Selector de período y botón */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
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
            <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Producción
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Registrar Producción
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="producto">Producto *</Label>
                    <Select value={formData.productoId} onValueChange={(v) => setFormData({ ...formData, productoId: v })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {productos.productos.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="text-white">
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cantidad">Cantidad Producida *</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="0"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      <strong>Nota:</strong> El costo unitario se calculará automáticamente 
                      dividiendo los gastos de fábrica del mes entre las unidades producidas.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setDialogoAbierto(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Resumen del mes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Unidades Fabricadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-400">{totalUnidadesMes.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{MESES[mesSeleccionado]} {anioSeleccionado}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Gastos de Fábrica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-400">{formatPYG(gastosMes)}</p>
            <p className="text-xs text-gray-500">Total del mes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Costo Unitario Estimado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">
              {formatPYG(costoUnitarioEstimado)}
            </p>
            <p className="text-xs text-gray-500">Por unidad producida</p>
          </CardContent>
        </Card>
      </div>

      {/* Producción por producto */}
      {Object.keys(produccionPorProducto).length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Producción por Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(produccionPorProducto).map(([productoId, data]) => (
                <div key={productoId} className="bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Package className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{data.nombre}</p>
                      <p className="text-purple-400 text-xl font-bold">{data.cantidad} unidades</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista detallada */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Detalle de Producción - {MESES[mesSeleccionado]} {anioSeleccionado}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {produccionDelMes
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .map((prod) => (
                <div 
                  key={prod.id} 
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Factory className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{prod.productoNombre}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(prod.fecha).toLocaleDateString('es-PY')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-purple-400 font-bold text-lg">{prod.cantidad} unidades</p>
                      <p className="text-yellow-400 text-sm">{formatPYG(prod.costoUnitario)}/u</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">¿Eliminar registro?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Se eliminarán {prod.cantidad} unidades de {prod.productoNombre} del stock.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEliminar(prod.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </div>

          {produccionDelMes.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No hay producción registrada este mes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
