'use client';

import { useEffect, useState } from 'react';

const DEBUG = false
const API_URL = !DEBUG ? "https://ecommerce-dc-plantilla.onrender.com/api" : 'http://localhost:8000/api'

export default function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${API_URL}/productos/`);
        const data = await response.json();
        setProductos(data.results || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  if (loading) {
    return <div className='text-center py-8'>Cargando productos...</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {productos.map((producto) => (
        <div key={producto.id} className='bg-white rounded-lg shadow-md p-4'>
          <h3 className='font-bold text-lg'>{producto.nombre}</h3>
          <p className='text-gray-600'></p>
          <p className='text-sm text-gray-500'>{producto.tipo}</p>
        </div>
      ))}
    </div>
  );
}
