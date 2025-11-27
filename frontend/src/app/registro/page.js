'use client'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'

// Componente de Onda Decorativa
const WaveDivider = ({ color = "fill-white", position = "bottom", flip = false }) => (
  <div className={`absolute left-0 w-full overflow-hidden leading-[0] z-10 ${position === 'top' ? '-top-1 rotate-180' : '-bottom-1'}`}>
    <svg 
      className={`relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] ${flip ? 'scale-x-[-1]' : ''}`} 
      data-name="Layer 1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none"
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={color}></path>
    </svg>
  </div>
)

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const { getCartItemsCount } = useCart()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    setLoading(true)
    const result = await register(formData)
    
    if (result.success) {
      window.location.href = '/'
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  if (loading) return <LoadingSpinner text="Horneando tu cuenta..." />

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- HEADER FLOTANTE --- */}
      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4">
        <div className="container mx-auto bg-[#009045] text-white rounded-full shadow-2xl py-3 px-4 md:px-8 flex justify-between items-center border-b-[4px] border-[#007a3a]">
            
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-white text-[#009045] p-2 rounded-full font-black text-xl border-2 border-yellow-400 group-hover:rotate-12 transition-transform">
                DC
              </div>
              <div className="leading-tight hidden sm:block">
                <h1 className="text-xl font-black tracking-wide">DELICIAS</h1>
              </div>
            </Link>

            <nav className="hidden lg:flex gap-8 font-black text-lg tracking-wide">
              {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`}
                  className="hover:text-yellow-300 transition-all duration-300 relative group py-2"
                >
                  {item.toUpperCase()}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 md:gap-6 shrink-0">
              <Link href="/login" className="hidden md:block font-bold hover:text-yellow-300 transition-colors">
                Ingresar
              </Link>
              <Link href="/carrito" className="relative group hover:scale-110 transition-transform">
                <div className="bg-[#007a3a] p-2 md:px-4 md:py-2 rounded-full font-bold hover:bg-yellow-400 hover:text-[#009045] transition-all flex items-center gap-2">
                  <span>🛒</span>
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
      </header>

      {/* --- CORRECCIÓN AQUÍ: AUMENTÉ EL PADDING SUPERIOR (pt-48) --- */}
      {/* Antes era pt-32, ahora es pt-48 para que baje el contenido */}
      <div className="bg-[#009045] pt-48 pb-24 relative">
         <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-md">
              ¡Únete a la Familia!
            </h1>
            <p className="text-green-100 text-xl font-medium max-w-2xl mx-auto">
              Crea tu cuenta hoy y empieza a disfrutar de los auténticos sabores colombianos.
            </p>
         </div>
         
         {/* Emojis decorativos flotantes */}
         <div className="absolute top-32 left-10 text-6xl animate-bounce hidden lg:block opacity-80">📝</div>
         <div className="absolute top-48 right-20 text-6xl animate-pulse hidden lg:block opacity-80">🍪</div>
         
         <WaveDivider color="fill-gray-50" />
      </div>
      
      <main className="container mx-auto px-4 py-8 -mt-16 relative z-20">
        <div className="max-w-2xl mx-auto animate-slide-up">
          
          {/* TARJETA DE REGISTRO */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-bl-[100%]"></div>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#009045] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl border-4 border-yellow-400">
                👤
              </div>
              <h2 className="text-3xl font-black text-gray-800">Crear Cuenta</h2>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 animate-shake font-medium">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium"
                  placeholder="Ej: Pepito Pérez"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Teléfono</label>
                  <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium"
                    placeholder="+57..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Contraseña</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium"
                    placeholder="******"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none font-medium"
                  placeholder="******"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Dirección de Envío</label>
                <textarea 
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:ring-0 focus:bg-white transition-all outline-none resize-none font-medium"
                  placeholder="Dirección para recibir tus pedidos..."
                  rows="2"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#009045] hover:bg-[#007a3a] text-white py-4 rounded-full font-black text-lg tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'CREANDO...' : 'REGISTRARME AHORA'}
              </button>
            </form>
            
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600 font-medium">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-[#009045] font-black hover:text-yellow-500 transition-colors underline decoration-2">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER COMPLETO --- */}
      <footer className="bg-[#009045] text-white pt-16 relative overflow-hidden border-t-8 border-yellow-400 mt-20">
        <div className="container mx-auto px-4 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="text-[100px] leading-none drop-shadow-xl transform hover:scale-110 transition-transform cursor-pointer">
                🏪
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">📍</span> Fábrica</h3>
              <div className="space-y-2 font-medium text-green-50">
                <p>Carrera 68 D Nº 98-23</p>
                <p>Bogotá - Colombia</p>
              </div>
            </div>

             <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">🕒</span> Horarios</h3>
              <div className="space-y-4 font-medium text-green-50">
                <p>Lunes a Viernes: 8am - 5pm</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">✉️</span> Contacto</h3>
              <div className="space-y-4 font-medium text-green-50">
                <p className="font-bold text-yellow-300 text-lg">018000 514020</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">💼</span> Equipo</h3>
              <div className="font-medium text-green-50">
                <a href="#" className="underline hover:text-yellow-300">Trabaja con nosotros</a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#006831] py-6 text-center text-sm font-bold text-green-100">
            © 2025 Delicias Colombianas | Hecho con ❤️ y Sabor
        </div>
      </footer>
    </div>
  )
}