// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... otras configuraciones
  images: {
    remotePatterns: [
      {
        protocol: 'http', // o 'https'
        hostname: 'localhost', // ⬅️ Ajusta al dominio de tu DJANGO_BASE_URL
        port: '8000', // ⬅️ Ajusta al puerto de tu DJANGO_BASE_URL
        pathname: '/media/**', // ⬅️ Permite cualquier ruta dentro de /media
      },
      // Agrega tu dominio de producción aquí también
    ],
    // También puedes usar solo domains, pero remotePatterns es más seguro y recomendado
    // domains: ['localhost', 'tudominiodeproduccion.com'],
  },
};

module.exports = nextConfig;