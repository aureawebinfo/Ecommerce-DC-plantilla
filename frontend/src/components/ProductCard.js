'use client'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    addToCart(product)
    
    // Simular proceso de agregado
    await new Promise(resolve => setTimeout(resolve, 600))
    setIsAdding(false)
  }

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="card-premium card-premium-hover group overflow-hidden">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-6 relative">
          {/* Imagen/icono */}
          <div className={`transform transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="text-4xl">{product.imagen}</span>
          </div>

          {/* Badges superpuestos */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.envio_gratis && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                🚚 Gratis
              </span>
            )}
            {product.nuevo && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                Nuevo
              </span>
            )}
            {product.oferta && product.precio_original > product.precio && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                -{Math.round((1 - product.precio / product.precio_original) * 100)}%
              </span>
            )}
          </div>

          {/* Efecto de hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Precio */}
        <div className="mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${formatNumber(product.precio)}
            </span>
            {product.precio_original > product.precio && (
              <span className="text-sm text-gray-500 line-through">
                ${formatNumber(product.precio_original)}
              </span>
            )}
          </div>
          {product.precio_original > product.precio && (
            <p className="text-xs text-green-600 font-semibold mt-1">
              Ahorras ${formatNumber(product.precio_original - product.precio)}
            </p>
          )}
        </div>

        {/* Nombre y descripción */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary-500 transition-colors duration-300">
          {product.nombre}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {product.descripcion}
        </p>

        {/* Rating y ventas */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {renderStars(product.calificacion)}
            <span className="text-xs text-gray-500">({product.calificacion})</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.vendidos} vendidos
          </span>
        </div>

        {/* Botón agregar al carrito */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
            isAdding 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-premium-hover'
          } text-white`}
        >
          {isAdding ? (
            <>
              <div className="loader-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span>Agregando...</span>
            </>
          ) : (
            <>
              <span>🛒</span>
              <span>Agregar al Carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}