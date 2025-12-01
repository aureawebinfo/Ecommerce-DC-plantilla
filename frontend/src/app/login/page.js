'use client'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'

// 1. IMPORTAR ICONOS (Lucide React)
import {
  ShoppingCart, X, Search, Filter, ArrowLeft, ArrowRight,
  LayoutGrid, CheckCircle, ImageOff, LogIn, LogOut, User, Menu,
  Star, Tag, MapPin, Clock, Phone, Mail, Facebook, Instagram, Youtube, Quote,
  Linkedin, MessageCircle, // <--- Agregados para el footer
  Drumstick, Milk, Croissant, Coffee, Candy,
  AlertCircle, Lock
} from 'lucide-react'

// (Eliminado WaveDivider para consistencia visual)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { login, user, logout } = useAuth() // Agregué user y logout aquí para el header
  const { getCartItemsCount } = useCart()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)

    if (result.success) {
      window.location.href = '/'
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  if (loading) return <LoadingSpinner text="Iniciando sesión..." />

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      {/* --- HEADER (Reutilizado) --- */}
      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4">
        <div className="container mx-auto bg-[#009045] text-white rounded-2xl md:rounded-full shadow-2xl py-3 px-4 md:px-8 flex flex-wrap justify-between items-center border-b-[4px] border-[#007a3a] relative">

          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-white p-0 rounded-full border-2 border-yellow-400 group-hover:rotate-12 transition-transform shadow-md w-12 h-12 overflow-hidden">
              <img src="/icons/DC.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight hidden sm:block">
              <h1 className="text-xl font-black tracking-wide">DELICIAS</h1>
              <p className="text-xs text-yellow-300 font-bold">COLOMBIANAS</p>
            </div>
          </Link>

          <nav className="hidden lg:flex gap-8 font-black text-lg tracking-wide">
            {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
              <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="hover:text-yellow-300 transition-all duration-300 relative group py-2">
                {item.toUpperCase()}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {!user ? (
              <div className="hidden md:flex items-center gap-4 font-bold text-base">
                <Link href="/registro" className="bg-yellow-400 text-[#009045] px-5 py-2 rounded-full font-black hover:bg-white hover:scale-105 shadow-md transition-all">Regístrate</Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 font-bold text-sm">
                <div className="flex items-center gap-1 bg-[#007a3a] px-3 py-1 rounded-full"><User size={16} className="text-yellow-300" /><span className="truncate max-w-[100px]">{user.nombre}</span></div>
                <button onClick={logout} className="hover:text-red-300 transition-colors"><LogOut size={18} /></button>
              </div>
            )}

            <Link href="/carrito" className="relative group hover:scale-110 transition-transform">
              <div className="bg-[#007a3a] p-2 md:px-4 md:py-2 rounded-full font-bold hover:bg-yellow-400 hover:text-[#009045] transition-all flex items-center gap-2">
                <ShoppingCart size={20} />
                {getCartItemsCount() > 0 && <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-600 text-white text-xs font-black w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 border-white">{getCartItemsCount()}</span>}
              </div>
            </Link>

            {/* Botón Móvil */}
            <button className="lg:hidden text-white p-2 hover:text-yellow-300 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Menú Móvil */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#009045] rounded-2xl shadow-xl border-t-4 border-yellow-400 overflow-hidden lg:hidden z-50 animate-fade-in">
              <div className="flex flex-col p-4 space-y-2">
                {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
                  <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="block py-3 px-4 rounded-xl hover:bg-[#007a3a] font-black text-lg text-white transition-colors border-b border-[#007a3a] last:border-0" onClick={() => setMobileMenuOpen(false)}>
                    {item.toUpperCase()}
                  </Link>
                ))}
                {!user ? (
                  <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-[#007a3a]">
                    <Link href="/registro" className="py-2 px-4 bg-yellow-400 text-[#009045] rounded-xl font-black text-center">Regístrate</Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#007a3a] px-4">
                    <div className="flex items-center gap-2 font-bold text-white"><User size={18} className="text-yellow-300" /> {user.nombre}</div>
                    <button onClick={logout} className="text-red-300 font-bold text-sm">Salir</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- HERO BACKGROUND (Sin olas, borde curvo) --- */}
      <div className="bg-[#009045] pt-40 pb-32 relative text-center rounded-br-[4rem] md:rounded-br-[8rem] shadow-xl overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-md">
            ¡Hola de Nuevo!
          </h1>
          <p className="text-green-100 text-xl font-medium max-w-2xl mx-auto">
            Ingresa a tu cuenta para continuar disfrutando.
          </p>
        </div>
        {/* Decoración sutil */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-10 -translate-x-10"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl translate-y-10 translate-x-10"></div>
      </div>

      <main className="container mx-auto px-4 py-8 -mt-24 relative z-20 flex-1">
        <div className="max-w-md mx-auto animate-slide-up">

          {/* TARJETA DE LOGIN */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">

            {/* Decoración superior */}
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#009045] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white">
                <LogIn size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black text-gray-800">Iniciar Sesión</h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 animate-shake font-medium text-sm flex items-center gap-3">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium text-gray-700"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium text-gray-700"
                    placeholder="Tu contraseña"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#009045] hover:bg-[#007a3a] text-white py-4 rounded-full font-black text-lg tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'ENTRANDO...' : (<>INGRESAR <ArrowRight size={20} /></>)}
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600 font-medium mb-4">
                ¿No tienes cuenta?{' '}
                <Link href="/registro" className="text-[#009045] font-black hover:text-yellow-500 transition-colors underline decoration-2 underline-offset-2">
                  Regístrate gratis
                </Link>
              </p>
            </div>

            {/* Tip (Sin estilo nota adhesiva, más limpio) */}
            <div className="mt-4 p-3 bg-green-50 rounded-xl text-center border border-green-100">
              <p className="text-xs text-[#009045] font-bold flex items-center justify-center gap-2">
                <CheckCircle size={14} /> Tip: Puedes usar cualquier email para probar.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* --- FOOTER COMPLETO (Ajustado) --- */}
      <footer className="bg-[#009045] text-white mt-auto flex flex-col font-sans border-t-[8px] border-yellow-400">

        {/* PARTE SUPERIOR: INFORMACIÓN */}
        <div className="container mx-auto px-4 md:px-8 py-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Contactanos */}
            <div>
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Contáctanos</h3>
              <p className="mb-2 text-green-50">Desde celular a nivel nacional</p>
              <p className="font-bold text-yellow-300 text-lg mb-4">601 486 5000</p>
              <p className="text-sm mb-4 text-green-50">Opción 1: Ventas<br />Opción 3: Posventa</p>
              <p className="mb-2 text-green-50">Línea Whatsapp</p>
              <p className="font-bold text-yellow-300 text-lg">311 2281010</p>
            </div>

            {/* Nosotros */}
            <div>
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Nosotros</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Quiénes somos</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Nuestra Historia</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Negocios Institucionales</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Sostenibilidad</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Noticias</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Trabaja con nosotros</a></li>
              </ul>
            </div>

            {/* Legales & Servicios */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Legales</h3>
                <ul className="space-y-2 text-sm text-green-50">
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Aviso de privacidad</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Políticas</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Términos</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Servicios</h3>
                <ul className="space-y-2 text-sm text-green-50">
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Domicilios</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Retiro en tienda</a></li>
                </ul>
              </div>
            </div>

            {/* Club & Social */}
            <div>
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Club Delicias</h3>
              <ul className="space-y-2 mb-6">
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Inscríbete</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Beneficios</a></li>
              </ul>
              <div className="flex space-x-3 mt-4">
                <a href="#" className="bg-white text-[#009045] p-2 rounded-full hover:bg-yellow-300 hover:text-white transition"><Facebook size={18} /></a>
                <a href="#" className="bg-white text-[#009045] p-2 rounded-full hover:bg-yellow-300 hover:text-white transition"><Instagram size={18} /></a>
                <a href="#" className="bg-white text-[#009045] p-2 rounded-full hover:bg-yellow-300 hover:text-white transition"><Linkedin size={18} /></a>
                <a href="#" className="bg-white text-[#009045] p-2 rounded-full hover:bg-yellow-300 hover:text-white transition"><Youtube size={18} /></a>
                <a href="#" className="bg-white text-[#009045] p-2 rounded-full hover:bg-yellow-300 hover:text-white transition"><MessageCircle size={18} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* PARTE INFERIOR: LOGO FLOTANTE, COPYRIGHT Y CRÉDITO AUREA */}
        <div className="relative bg-[#007a3a] pt-16 pb-6 mt-auto shadow-inner">

          {/* LOGO CENTRAL FLOTANTE */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 z-20">
            <div className="bg-white p-1 rounded-full border-[6px] border-[#007a3a] shadow-xl hover:scale-105 transition-transform w-28 h-28 flex items-center justify-center overflow-hidden">
              <img src="/icons/DC.png" alt="Logo Footer" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* COPYRIGHT Y CREDITOS */}
          <div className="container mx-auto px-4 text-center flex flex-col gap-2 relative z-10">
            <p className="text-sm font-medium">© 2025 Delicias Colombianas. Todos los derechos reservados.</p>

            <p className="text-xs opacity-70 flex items-center justify-center gap-1 text-yellow-300">
              <Quote size={10} /> Calidad y Tradición <Quote size={10} />
            </p>
            <p className="text-xs text-green-100/60 mt-2">
              Plantilla desarollada por <a href="https://aurea-web.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-yellow-300 transition-colors">Áurea Web</a>
            </p>
          </div>
        </div>

      </footer>
    </div>
  )
}