'use client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const { getCartItemsCount } = useCart()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)

      // Detectar sección activa
      const sections = ['inicio', 'productos', 'nosotros', 'contacto']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Inicio', path: '/', id: 'inicio' },
    { name: 'Productos', path: '/productos', id: 'productos' },
    { name: 'Nosotros', path: '/nosotros', id: 'nosotros' },
    { name: 'Contacto', path: '/contacto', id: 'contacto' }
  ]

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-800/20' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-lg">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-emerald-700 font-bold text-sm">DC</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-gray-900">Delicias Colombianas</h1>
              <p className="text-emerald-700 text-xs mt-1">Sabores auténticos</p>
            </div>
          </Link>

          {/* Navegación Central */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`px-4 py-2 font-medium text-sm uppercase tracking-wider transition-all duration-300 relative group ${
                  activeSection === item.id 
                    ? 'text-emerald-700' 
                    : 'text-gray-700 hover:text-emerald-700'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-700 transition-all duration-300 ${
                  activeSection === item.id ? 'scale-100' : 'scale-0 group-hover:scale-100'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            {/* Carrito */}
            <Link 
              href="/carrito" 
              className="relative p-3 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full text-white hover:scale-110 transition-all duration-300 shadow-lg group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Menú Mobile */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-emerald-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>

            {/* Autenticación Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm">
                    {user.nombre?.charAt(0) || 'U'}
                  </div>
                  <button 
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-300 text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors duration-300 text-sm"
                  >
                    Ingresar
                  </Link>
                  <Link 
                    href="/registro" 
                    className="px-6 py-2 bg-gradient-to-br from-amber-700 to-amber-800 text-white rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 bg-white/95 backdrop-blur-md animate-slide-down">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.path}
                  className={`px-4 py-3 font-medium text-gray-700 hover:text-emerald-700 transition-colors duration-300 border-l-4 ${
                    activeSection === item.id 
                      ? 'border-emerald-700 text-emerald-700 bg-emerald-50' 
                      : 'border-transparent hover:border-emerald-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!user && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                  <Link 
                    href="/login" 
                    className="flex-1 text-center px-4 py-3 text-emerald-700 hover:text-emerald-800 font-medium transition-colors duration-300 border border-emerald-700 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ingresar
                  </Link>
                  <Link 
                    href="/registro" 
                    className="flex-1 text-center px-4 py-3 bg-gradient-to-br from-amber-700 to-amber-800 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}