import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Producto } from '@/types';
import { formatPYG } from '@/hooks/useDashboard';

interface ProductosProps {
  productos: ReturnType<typeof import('@/hooks/useStorage').useProductos>;
  toast: typeof import('sonner').toast;
}

export default function Productos({ productos, toast }: ProductosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioMayorista: '',
    precioMinorista: '',
    stock: '',
  });

  const productosFiltrados = productos.productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precioMayorista: parseFloat(formData.precioMayorista) || 0,
      precioMinorista: parseFloat(formData.precioMinorista) || 0,
      costoProduccion: 0,
      stock: parseInt(formData.stock) || 0,
    };

    if (productoEditando) {
      productos.updateProducto(productoEditando.id, data);
      toast.success('Producto actualizado correctamente');
    } else {
      productos.addProducto(data);
      toast.success('Producto agregado correctamente');
    }

    setDialogoAbierto(false);
    resetForm();
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioMayorista: producto.precioMayorista.toString(),
      precioMinorista: producto.precioMinorista.toString(),
      stock: producto.stock.toString(),
    });
    setDialogoAbierto(true);
  };

  const handleEliminar = (id: string) => {
    productos.deleteProducto(id);
    toast.success('Producto eliminado correctamente');
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precioMayorista: '',
      precioMinorista: '',
      stock: '',
    });
    setProductoEditando(null);
  };

  const abrirNuevo = () => {
    resetForm();
    setDialogoAbierto(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botón */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
              <DialogTrigger asChild>
                <Button onClick={abrirNuevo} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precioMayorista">Precio Mayorista (₲) *</Label>
                      <Input
                        id="precioMayorista"
                        type="number"
                        value={formData.precioMayorista}
                        onChange={(e) => setFormData({ ...formData, precioMayorista: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="precioMinorista">Precio Minorista (₲) *</Label>
                      <Input
                        id="precioMinorista"
                        type="number"
                        value={formData.precioMinorista}
                        onChange={(e) => setFormData({ ...formData, precioMinorista: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Inicial</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      {productoEditando ? 'Guardar Cambios' : 'Crear Producto'}
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

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productosFiltrados.map((producto) => (
          <Card key={producto.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{producto.nombre}</CardTitle>
                    <p className="text-gray-400 text-sm">{producto.descripcion}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditar(producto)}
                    className="h-8 w-8 text-gray-400 hover:text-blue-400"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">¿Eliminar producto?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Esta acción no se puede deshacer. El producto "{producto.nombre}" será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleEliminar(producto.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Precio Mayorista</p>
                  <p className="text-emerald-400 font-semibold">{formatPYG(producto.precioMayorista)}</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Precio Minorista</p>
                  <p className="text-blue-400 font-semibold">{formatPYG(producto.precioMinorista)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">Stock</p>
                  <p className={`text-lg font-bold ${producto.stock > 0 ? 'text-white' : 'text-red-400'}`}>
                    {producto.stock} unidades
                  </p>
                </div>
                {producto.costoProduccion > 0 && (
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Costo Prod.</p>
                    <p className="text-orange-400 font-semibold">{formatPYG(producto.costoProduccion)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay productos registrados</p>
            <p className="text-gray-500 text-sm mt-1">Agrega tu primer producto para comenzar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
