import { useState } from 'react';
import { Plus, User, Trash2, Calendar, Tag, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CATEGORIAS_GASTO_PERSONAL, MESES } from '@/types';
import type { CategoriaGastoPersonal } from '@/types';
import { formatPYG } from '@/hooks/useDashboard';

interface GastosPersonalesProps {
  gastosPersonales: ReturnType<typeof import('@/hooks/useStorage').useGastosPersonales>;
  dineroTotal: ReturnType<typeof import('@/hooks/useStorage').useDineroTotal>;
  toast: typeof import('sonner').toast;
}

export default function GastosPersonales({ gastosPersonales, dineroTotal, toast }: GastosPersonalesProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    categoria: '' as CategoriaGastoPersonal | '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoria) {
      toast.error('Selecciona una categoría');
      return;
    }

    const monto = parseFloat(formData.monto);
    
    if (monto > dineroTotal.dineroTotal) {
      toast.error('No tienes suficiente dinero disponible');
      return;
    }

    gastosPersonales.addGasto({
      fecha: formData.fecha,
      concepto: formData.concepto,
      monto,
      categoria: formData.categoria as CategoriaGastoPersonal,
    });

    // Descontar del dinero total
    dineroTotal.decrementar(monto);

    toast.success('Gasto personal registrado');
    setDialogoAbierto(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      concepto: '',
      monto: '',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  const handleEliminar = (id: string, monto: number) => {
    gastosPersonales.deleteGasto(id);
    // Reintegrar al dinero total
    dineroTotal.incrementar(monto);
    toast.success('Gasto eliminado');
  };

  const gastosDelMes = gastosPersonales.getGastosByMes(mesSeleccionado, anioSeleccionado);
  const totalMes = gastosPersonales.getTotalGastosMes(mesSeleccionado, anioSeleccionado);

  const gastosPorCategoria = gastosDelMes.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
    return acc;
  }, {} as Record<CategoriaGastoPersonal, number>);

  return (
    <div className="space-y-6">
      {/* Info de dinero disponible */}
      <Card className="bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 border-emerald-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Wallet className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 text-sm">Dinero Total Disponible</p>
              <p className="text-3xl font-bold text-emerald-400">
                {formatPYG(dineroTotal.dineroTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <Button onClick={resetForm} className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Nuevo Gasto Personal
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                    <p className="text-emerald-300 text-sm">
                      Dinero disponible: <strong>{formatPYG(dineroTotal.dineroTotal)}</strong>
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="concepto">Concepto *</Label>
                    <Input
                      id="concepto"
                      value={formData.concepto}
                      onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Ej: Compra de víveres"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v as CategoriaGastoPersonal })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {Object.entries(CATEGORIAS_GASTO_PERSONAL).map(([key, label]) => (
                          <SelectItem key={key} value={key} className="text-white">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="monto">Monto (₲) *</Label>
                    <Input
                      id="monto"
                      type="number"
                      value={formData.monto}
                      onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="0"
                      required
                      min="0"
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
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Gasto
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-pink-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-400">{formatPYG(totalMes)}</p>
            <p className="text-xs text-gray-500">{MESES[mesSeleccionado]} {anioSeleccionado}</p>
          </CardContent>
        </Card>
        
        {Object.entries(CATEGORIAS_GASTO_PERSONAL).map(([key, label]) => {
          const monto = gastosPorCategoria[key as CategoriaGastoPersonal] || 0;
          if (monto === 0) return null;
          return (
            <Card key={key} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-white">{formatPYG(monto)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de gastos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Gastos Personales de {MESES[mesSeleccionado]} {anioSeleccionado}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gastosDelMes
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .map((gasto) => (
                <div 
                  key={gasto.id} 
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                      <User className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{gasto.concepto}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(gasto.fecha).toLocaleDateString('es-PY')}
                        <span className="text-gray-600">•</span>
                        <Tag className="h-3 w-3" />
                        {CATEGORIAS_GASTO_PERSONAL[gasto.categoria]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-pink-400 font-bold text-lg">
                      {formatPYG(gasto.monto)}
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">¿Eliminar gasto?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            El gasto "{gasto.concepto}" será eliminado y el monto se reintegrará al dinero total.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEliminar(gasto.id, gasto.monto)}
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

          {gastosDelMes.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No hay gastos personales este mes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
