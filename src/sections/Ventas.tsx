import { useState, useMemo } from 'react';
import { Plus, ShoppingCart, Trash2, User, Percent, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { VentaItem } from '@/types';
import { formatPYG } from '@/hooks/useDashboard';

interface VentasProps {
  productos: ReturnType<typeof import('@/hooks/useStorage').useProductos>;
  ventas: ReturnType<typeof import('@/hooks/useStorage').useVentas>;
  dineroTotal: ReturnType<typeof import('@/hooks/useStorage').useDineroTotal>;
  toast: typeof import('sonner').toast;
}

export default function Ventas({ productos, ventas, dineroTotal, toast }: VentasProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [items, setItems] = useState<VentaItem[]>([]);
  const [descuento, setDescuento] = useState('');
  const [cliente, setCliente] = useState('');
  const [notas, setNotas] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [tipoPrecio, setTipoPrecio] = useState<'mayorista' | 'minorista'>('minorista');

  const hoy = new Date();

  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.subtotal, 0),
  [items]);

  const descuentoMonto = useMemo(() => 
    subtotal * (parseFloat(descuento) || 0) / 100,
  [subtotal, descuento]);

  const total = subtotal - descuentoMonto;

  const agregarItem = () => {
    if (!productoSeleccionado || !cantidad) return;
    
    const producto = productos.getProductoById(productoSeleccionado);
    if (!producto) return;

    const cant = parseInt(cantidad);
    if (cant > producto.stock) {
      toast.error(`Stock insuficiente. Disponible: ${producto.stock}`);
      return;
    }

    const precio = tipoPrecio === 'mayorista' ? producto.precioMayorista : producto.precioMinorista;
    
    const nuevoItem: VentaItem = {
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad: cant,
      precioUnitario: precio,
      tipoPrecio,
      subtotal: cant * precio,
    };

    setItems([...items, nuevoItem]);
    setProductoSeleccionado('');
    setCantidad('');
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }

    // Crear la venta
    const venta = {
      fecha: new Date().toISOString(),
      mes: hoy.getMonth(),
      anio: hoy.getFullYear(),
      items: [...items],
      subtotal,
      descuento: parseFloat(descuento) || 0,
      total,
      cliente: cliente || undefined,
      notas: notas || undefined,
    };

    ventas.addVenta(venta);
    
    // Actualizar stock de productos
    items.forEach(item => {
      const producto = productos.getProductoById(item.productoId);
      if (producto) {
        productos.updateProducto(item.productoId, {
          stock: producto.stock - item.cantidad
        });
      }
    });

    // Incrementar dinero total
    dineroTotal.incrementar(total);

    toast.success(`Venta registrada: ${formatPYG(total)}`);
    
    setDialogoAbierto(false);
    resetForm();
  };

  const resetForm = () => {
    setItems([]);
    setDescuento('');
    setCliente('');
    setNotas('');
    setProductoSeleccionado('');
    setCantidad('');
    setTipoPrecio('minorista');
  };

  const handleEliminarVenta = (id: string, monto: number) => {
    ventas.deleteVenta(id);
    dineroTotal.decrementar(monto);
    toast.success('Venta eliminada');
  };

  const ventasRecientes = [...ventas.ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-6">
      {/* Header con botón nueva venta */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Registrar Nueva Venta</h3>
            <p className="text-gray-400 text-sm">Agrega productos y aplica descuentos</p>
          </div>
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Venta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Nueva Venta
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Agregar items */}
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                  <Label className="text-gray-300">Agregar Productos</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 sm:col-span-2">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {productos.productos
                          .filter(p => p.stock > 0)
                          .map(p => (
                            <SelectItem key={p.id} value={p.id} className="text-white">
                              {p.nombre} (Stock: {p.stock})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      min="1"
                    />
                    <Button type="button" onClick={agregarItem} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPrecio"
                        value="minorista"
                        checked={tipoPrecio === 'minorista'}
                        onChange={(e) => setTipoPrecio(e.target.value as 'minorista')}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-300">Minorista</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPrecio"
                        value="mayorista"
                        checked={tipoPrecio === 'mayorista'}
                        onChange={(e) => setTipoPrecio(e.target.value as 'mayorista')}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-300">Mayorista</span>
                    </label>
                  </div>
                </div>

                {/* Lista de items */}
                {items.length > 0 && (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <Label className="text-gray-300 mb-2 block">Items de la venta</Label>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/50 p-3 rounded">
                          <div>
                            <p className="text-white font-medium">{item.productoNombre}</p>
                            <p className="text-gray-400 text-sm">
                              {item.cantidad} x {formatPYG(item.precioUnitario)} ({item.tipoPrecio})
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400 font-semibold">{formatPYG(item.subtotal)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarItem(index)}
                              className="h-8 w-8 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descuento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descuento" className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Descuento (%)
                    </Label>
                    <Input
                      id="descuento"
                      type="number"
                      value={descuento}
                      onChange={(e) => setDescuento(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cliente" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Cliente (opcional)
                    </Label>
                    <Input
                      id="cliente"
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notas">Notas (opcional)</Label>
                  <Input
                    id="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Notas adicionales..."
                  />
                </div>

                {/* Totales */}
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>{formatPYG(subtotal)}</span>
                  </div>
                  {descuentoMonto > 0 && (
                    <div className="flex justify-between text-orange-400">
                      <span>Descuento ({descuento}%):</span>
                      <span>-{formatPYG(descuentoMonto)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-emerald-400 pt-2 border-t border-gray-600">
                    <span>TOTAL:</span>
                    <span>{formatPYG(total)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Finalizar Venta
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
        </CardContent>
      </Card>

      {/* Lista de ventas recientes */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg">Ventas Recientes</h3>
        {ventasRecientes.map((venta) => (
          <Card key={venta.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">
                      {new Date(venta.fecha).toLocaleDateString('es-PY', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {venta.cliente && (
                      <>
                        <span className="text-gray-600">•</span>
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{venta.cliente}</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-1">
                    {venta.items.map((item, idx) => (
                      <p key={idx} className="text-gray-400 text-sm">
                        {item.cantidad}x {item.productoNombre} ({formatPYG(item.precioUnitario)})
                      </p>
                    ))}
                  </div>
                  {venta.notas && (
                    <p className="text-gray-500 text-sm mt-2 italic">{venta.notas}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {venta.descuento > 0 && (
                      <p className="text-orange-400 text-sm">-{venta.descuento}% desc.</p>
                    )}
                    <p className="text-emerald-400 text-xl font-bold">{formatPYG(venta.total)}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">¿Eliminar venta?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Esta acción revertirá el monto de {formatPYG(venta.total)} del dinero total.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleEliminarVenta(venta.id, venta.total)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ventasRecientes.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay ventas registradas</p>
            <p className="text-gray-500 text-sm mt-1">Registra tu primera venta para comenzar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
