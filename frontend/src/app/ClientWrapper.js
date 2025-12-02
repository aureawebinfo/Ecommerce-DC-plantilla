// src/app/ClientWrapper.js

'use client' // ⬅️ ¡Esta línea es la clave! Convierte esto en componente de cliente.

import { useEffect } from 'react'
import { AuthProvider } from '../context/AuthContext' // Asegúrate que esta ruta sea correcta
import { CartProvider } from '../context/CartContext' // Asegúrate que esta ruta sea correcta

// 🔗 Configuración de la URL de Heartbeat
// Ajusta el dominio si es necesario
const DEBUG = false
const HEARTBEAT_URL = !DEBUG ? "https://ecommerce-dc-plantilla.onrender.com/api/productos/heartbeat/" : 'http://127.0.0.1:8000/api/productos/heartbeat/'; 
const INTERVALO_MS = 5 * 60 * 1000; // 5 minutos

// Componente interno para el Heartbeat
function KeepAlive() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch(HEARTBEAT_URL, { method: 'GET' });
        // console.log('Heartbeat enviado'); // Descomentar para probar
      } catch (error) {
        console.error('Error enviando heartbeat:', error);
      }
    };

    // Llamada inmediata y luego por intervalo
    sendHeartbeat();
    const intervalId = setInterval(sendHeartbeat, INTERVALO_MS);
    return () => clearInterval(intervalId);
  }, []);
  
  return null;
}

// 📦 Componente Wrapper que exportamos
export function ClientWrapper({ children }) {
    return (
        <>
            <KeepAlive /> 
            <AuthProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AuthProvider>
        </>
    );
}