'use client'
import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
    
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('cart')
    if (saved) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isClient])

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + (item.precio * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cart: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isClient, // Para saber si estamos en el cliente
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}