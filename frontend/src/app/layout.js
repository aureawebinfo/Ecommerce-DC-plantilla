import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import './globals.css'

export const metadata = {
  title: 'Delicias Colombianas - Sabores Auténticos de Colombia',
  description: 'Productos tradicionales colombianos elaborados con recetas ancestrales. Chicharrón, queso campesino, empanadas y más.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}