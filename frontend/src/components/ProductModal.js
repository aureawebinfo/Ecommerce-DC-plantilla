'use client'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function ProductModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  if (!isOpen) return null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Image */}
          <div className="bg-gray-100 aspect-square">
            <img 
              src={product.imagen} 
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs text-green-600 uppercase tracking-wider font-semibold">{product.categoria}</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{product.nombre}</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.descripcion}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-gray-900">${product.precio.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-gray-700 font-medium">Cantidad:</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-gray-300 hover:border-gray-400 flex items-center justify-center transition-colors duration-300"
                >
                  <span className="text-gray-600">-</span>
                </button>
                <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-gray-300 hover:border-gray-400 flex items-center justify-center transition-colors duration-300"
                >
                  <span className="text-gray-600">+</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 font-semibold uppercase tracking-wider text-sm hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}