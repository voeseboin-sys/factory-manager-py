import { useState, useEffect, useCallback } from 'react';
import type { Producto, Venta, GastoFabrica, GastoPersonal, Produccion } from '@/types';

const STORAGE_KEYS = {
  PRODUCTOS: 'factory_productos',
  VENTAS: 'factory_ventas',
  GASTOS_FABRICA: 'factory_gastos_fabrica',
  GASTOS_PERSONALES: 'factory_gastos_personales',
  PRODUCCION: 'factory_produccion',
  DINERO_TOTAL: 'factory_dinero_total',
};

// Helper para obtener datos del localStorage
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper para guardar datos en localStorage
function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Hook para Productos
export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = getStorageItem<Producto[]>(STORAGE_KEYS.PRODUCTOS, []);
    setProductos(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setStorageItem(STORAGE_KEYS.PRODUCTOS, productos);
    }
  }, [productos, loaded]);

  const addProducto = useCallback((producto: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>) => {
    const nuevo: Producto = {
      ...producto,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProductos(prev => [...prev, nuevo]);
    return nuevo;
  }, []);

  const updateProducto = useCallback((id: string, updates: Partial<Producto>) => {
    setProductos(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
  }, []);

  const deleteProducto = useCallback((id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProductoById = useCallback((id: string) => {
    return productos.find(p => p.id === id);
  }, [productos]);

  return {
    productos,
    loaded,
    addProducto,
    updateProducto,
    deleteProducto,
    getProductoById,
  };
}

// Hook para Ventas
export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = getStorageItem<Venta[]>(STORAGE_KEYS.VENTAS, []);
    setVentas(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setStorageItem(STORAGE_KEYS.VENTAS, ventas);
    }
  }, [ventas, loaded]);

  const addVenta = useCallback((venta: Omit<Venta, 'id'>) => {
    const nueva: Venta = {
      ...venta,
      id: Date.now().toString(),
    };
    setVentas(prev => [...prev, nueva]);
    return nueva;
  }, []);

  const deleteVenta = useCallback((id: string) => {
    setVentas(prev => prev.filter(v => v.id !== id));
  }, []);

  const getVentasByMes = useCallback((mes: number, anio: number) => {
    return ventas.filter(v => v.mes === mes && v.anio === anio);
  }, [ventas]);

  const getTotalVentasMes = useCallback((mes: number, anio: number) => {
    return ventas
      .filter(v => v.mes === mes && v.anio === anio)
      .reduce((sum, v) => sum + v.total, 0);
  }, [ventas]);

  return {
    ventas,
    loaded,
    addVenta,
    deleteVenta,
    getVentasByMes,
    getTotalVentasMes,
  };
}

// Hook para Gastos de Fábrica
export function useGastosFabrica() {
  const [gastos, setGastos] = useState<GastoFabrica[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = getStorageItem<GastoFabrica[]>(STORAGE_KEYS.GASTOS_FABRICA, []);
    setGastos(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setStorageItem(STORAGE_KEYS.GASTOS_FABRICA, gastos);
    }
  }, [gastos, loaded]);

  const addGasto = useCallback((gasto: Omit<GastoFabrica, 'id'>) => {
    const nuevo: GastoFabrica = {
      ...gasto,
      id: Date.now().toString(),
    };
    setGastos(prev => [...prev, nuevo]);
    return nuevo;
  }, []);

  const deleteGasto = useCallback((id: string) => {
    setGastos(prev => prev.filter(g => g.id !== id));
  }, []);

  const getGastosByMes = useCallback((mes: number, anio: number) => {
    return gastos.filter(g => g.mes === mes && g.anio === anio);
  }, [gastos]);

  const getTotalGastosMes = useCallback((mes: number, anio: number) => {
    return gastos
      .filter(g => g.mes === mes && g.anio === anio)
      .reduce((sum, g) => sum + g.monto, 0);
  }, [gastos]);

  return {
    gastos,
    loaded,
    addGasto,
    deleteGasto,
    getGastosByMes,
    getTotalGastosMes,
  };
}

// Hook para Gastos Personales
export function useGastosPersonales() {
  const [gastos, setGastos] = useState<GastoPersonal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = getStorageItem<GastoPersonal[]>(STORAGE_KEYS.GASTOS_PERSONALES, []);
    setGastos(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setStorageItem(STORAGE_KEYS.GASTOS_PERSONALES, gastos);
    }
  }, [gastos, loaded]);

  const addGasto = useCallback((gasto: Omit<GastoPersonal, 'id'>) => {
    const nuevo: GastoPersonal = {
      ...gasto,
      id: Date.now().toString(),
    };
    setGastos(prev => [...prev, nuevo]);
    return nuevo;
  }, []);

  const deleteGasto = useCallback((id: string) => {
    setGastos(prev => prev.filter(g => g.id !== id));
  }, []);

  const getGastosByMes = useCallback((mes: number, anio: number) => {
    return gastos.filter(g => {
      const fecha = new Date(g.fecha);
      return fecha.getMonth() === mes && fecha.getFullYear() === anio;
    });
  }, [gastos]);

  const getTotalGastosMes = useCallback((mes: number, anio: number) => {
    return gastos
      .filter(g => {
        const fecha = new Date(g.fecha);
        return fecha.getMonth() === mes && fecha.getFullYear() === anio;
      })
      .reduce((sum, g) => sum + g.monto, 0);
  }, [gastos]);

  return {
    gastos,
    loaded,
    addGasto,
    deleteGasto,
    getGastosByMes,
    getTotalGastosMes,
  };
}

// Hook para Producción
export function useProduccion() {
  const [produccion, setProduccion] = useState<Produccion[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = getStorageItem<Produccion[]>(STORAGE_KEYS.PRODUCCION, []);
    setProduccion(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setStorageItem(STORAGE_KEYS.PRODUCCION, produccion);
    }
  }, [produccion, loaded]);

  const addProduccion = useCallback((prod: Omit<Produccion, 'id'>) => {
    const nuevo: Produccion = {
      ...prod,
      id: Date.now().toString(),
    };
    setProduccion(prev => [...prev, nuevo]);
    return nuevo;
  }, []);

  const deleteProduccion = useCallback((id: string) => {
    setProduccion(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduccionByMes = useCallback((mes: number, anio: number) => {
    return produccion.filter(p => p.mes === mes && p.anio === anio);
  }, [produccion]);

  const getTotalUnidadesMes = useCallback((mes: number, anio: number) => {
    return produccion
      .filter(p => p.mes === mes && p.anio === anio)
      .reduce((sum, p) => sum + p.cantidad, 0);
  }, [produccion]);

  return {
    produccion,
    loaded,
    addProduccion,
    deleteProduccion,
    getProduccionByMes,
    getTotalUnidadesMes,
  };
}

// Hook para Dinero Total
export function useDineroTotal() {
  const [dineroTotal, setDineroTotal] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = getStorageItem<number>(STORAGE_KEYS.DINERO_TOTAL, 0);
    setDineroTotal(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setStorageItem(STORAGE_KEYS.DINERO_TOTAL, dineroTotal);
    }
  }, [dineroTotal, loaded]);

  const incrementar = useCallback((monto: number) => {
    setDineroTotal(prev => prev + monto);
  }, []);

  const decrementar = useCallback((monto: number) => {
    setDineroTotal(prev => Math.max(0, prev - monto));
  }, []);

  const establecer = useCallback((monto: number) => {
    setDineroTotal(Math.max(0, monto));
  }, []);

  return {
    dineroTotal,
    loaded,
    incrementar,
    decrementar,
    establecer,
  };
}
