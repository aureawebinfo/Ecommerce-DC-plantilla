// src/app/ClientWrapper.js

'use client' // ⬅️ ¡La directiva obligatoria para usar Hooks!

import { useEffect } from 'react'

// 🔗 Configuración de la URL de Heartbeat
const DEBUG = false
const HEARTBEAT_URL = !DEBUG ? "https://ecommerce-dc-plantilla.onrender.com/api/productos/heartbeat/" : 'http://127.0.0.1:8000/api/productos/heartbeat/'; 
const INTERVALO_MS = 5 * 60 * 1000;

function KeepAlive() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch(HEARTBEAT_URL, { method: 'GET' });
      } catch (error) {
        console.error('Error enviando heartbeat al backend:', error);
      }
    };
    sendHeartbeat();
    const intervalId = setInterval(sendHeartbeat, INTERVALO_MS);
    return () => clearInterval(intervalId);
  }, []);
  
  return null;
}

// 3. 🧩 Exportar el componente que envuelve a los hijos y añade KeepAlive
export function ClientWrapper({ children }) {
    return (
        <>
            <KeepAlive /> 
            {children}
        </>
    );
}