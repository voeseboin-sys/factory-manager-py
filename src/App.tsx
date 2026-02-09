import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Factory, 
  User, 
  TrendingUp,
  FileText,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster, toast } from 'sonner';

import { useProductos, useVentas, useGastosFabrica, useGastosPersonales, useProduccion, useDineroTotal } from '@/hooks/useStorage';

import Dashboard from '@/sections/Dashboard';
import Productos from '@/sections/Productos';
import Ventas from '@/sections/Ventas';
import GastosFabrica from '@/sections/GastosFabrica';
import GastosPersonales from '@/sections/GastosPersonales';
import Produccion from '@/sections/Produccion';
import Reportes from '@/sections/Reportes';

export type Vista = 'dashboard' | 'productos' | 'ventas' | 'gastos-fabrica' | 'gastos-personales' | 'produccion' | 'reportes';

const menuItems = [
  { id: 'dashboard' as Vista, label: 'Panel Principal', icon: LayoutDashboard },
  { id: 'productos' as Vista, label: 'Productos', icon: Package },
  { id: 'ventas' as Vista, label: 'Ventas', icon: ShoppingCart },
  { id: 'gastos-fabrica' as Vista, label: 'Gastos Fábrica', icon: Factory },
  { id: 'gastos-personales' as Vista, label: 'Gastos Personales', icon: User },
  { id: 'produccion' as Vista, label: 'Producción', icon: TrendingUp },
  { id: 'reportes' as Vista, label: 'Reportes PDF', icon: FileText },
];

function App() {
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(true);

  // Hooks de datos
  const productos = useProductos();
  const ventas = useVentas();
  const gastosFabrica = useGastosFabrica();
  const gastosPersonales = useGastosPersonales();
  const produccion = useProduccion();
  const dineroTotal = useDineroTotal();

  const renderVista = () => {
    const props = {
      productos,
      ventas,
      gastosFabrica,
      gastosPersonales,
      produccion,
      dineroTotal,
      toast,
    };

    switch (vistaActual) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'productos':
        return <Productos {...props} />;
      case 'ventas':
        return <Ventas {...props} />;
      case 'gastos-fabrica':
        return <GastosFabrica {...props} />;
      case 'gastos-personales':
        return <GastosPersonales {...props} />;
      case 'produccion':
        return <Produccion {...props} />;
      case 'reportes':
        return <Reportes {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  const VistaActualIcon = menuItems.find(m => m.id === vistaActual)?.icon || LayoutDashboard;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${temaOscuro ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster 
        position="top-right" 
        richColors 
        theme={temaOscuro ? 'dark' : 'light'}
      />
      
      {/* Header móvil */}
      <header className="lg:hidden bg-gray-800 dark:bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gray-800 border-gray-700 w-72">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Factory Manager</h2>
                  </div>
                  <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => {
                                setVistaActual(item.id);
                                setMenuAbierto(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                vistaActual === item.id
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <VistaActualIcon className="h-5 w-5" />
              {menuItems.find(m => m.id === vistaActual)?.label}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTemaOscuro(!temaOscuro)}
            className="text-white"
          >
            {temaOscuro ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex flex-col w-72 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 fixed h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Factory Manager</h2>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setVistaActual(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        vistaActual === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setTemaOscuro(!temaOscuro)}
            >
              {temaOscuro ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {temaOscuro ? 'Modo Claro' : 'Modo Oscuro'}
            </Button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-72 p-4 lg:p-8 bg-gray-900 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <VistaActualIcon className="h-8 w-8 text-blue-500" />
                {menuItems.find(m => m.id === vistaActual)?.label}
              </h1>
            </div>
            
            {renderVista()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
