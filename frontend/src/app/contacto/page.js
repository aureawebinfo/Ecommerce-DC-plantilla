'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import LoadingSpinner from '../../components/LoadingSpinner'

// Componente de Onda (Decorativo para el footer)
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

export default function Contacto() {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const { user } = useAuth()
  const { getCartItemsCount } = useCart()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- HEADER FLOTANTE --- */}
      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4">
        <div className="container mx-auto bg-[#009045] text-white rounded-full shadow-2xl py-3 px-4 md:px-8 flex justify-between items-center border-b-[4px] border-[#007a3a]">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-white text-[#009045] p-2 rounded-full font-black text-xl border-2 border-yellow-400 group-hover:rotate-12 transition-transform">DC</div>
              <div className="leading-tight hidden sm:block">
                <h1 className="text-xl font-black tracking-wide">DELICIAS</h1>
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
              {!user ? <Link href="/login" className="hidden md:block font-bold hover:text-yellow-300">Ingresar</Link> : <span className="hidden md:block font-bold text-yellow-300">Hola, {user.nombre}</span>}
              <Link href="/carrito" className="bg-[#007a3a] p-2 px-4 rounded-full font-bold hover:bg-yellow-400 hover:text-[#009045] transition-all flex items-center gap-2">
                <span>🛒</span>{getCartItemsCount() > 0 && <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{getCartItemsCount()}</span>}
              </Link>
            </div>
          </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      {/* CORRECCIÓN: Aumenté pt-32 a pt-48 para que baje más y no lo tape el header */}
      <main className="container mx-auto px-4 py-12 pt-48">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Formulario */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <h2 className="text-3xl font-black text-gray-800 mb-6">Envíanos un mensaje</h2>
            {enviado && <div className="bg-green-100 text-[#009045] p-4 rounded-xl mb-6 font-bold border border-green-200">✅ ¡Mensaje enviado! Pronto te contactaremos.</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Nombre Completo</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:bg-white transition-all outline-none font-medium" placeholder="Tu nombre" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:bg-white transition-all outline-none font-medium" placeholder="tucorreo@ejemplo.com" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:bg-white transition-all outline-none font-medium" placeholder="+57 300..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Mensaje</label>
                <textarea rows="4" name="mensaje" value={formData.mensaje} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-[#009045] focus:bg-white transition-all outline-none resize-none font-medium" placeholder="¿Cómo podemos ayudarte?" required></textarea>
              </div>
              <button type="submit" className="w-full bg-[#009045] hover:bg-[#007a3a] text-white py-4 rounded-full font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 mt-2">📨 ENVIAR MENSAJE</button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
             {/* Card Contacto */}
             <div className="bg-[#009045] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                <h3 className="text-2xl font-black mb-6">Información Directa</h3>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">📞</div>
                      <div><p className="text-sm opacity-80 font-bold">Teléfono</p><p className="text-lg font-black">+57 1 234 5678</p></div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">✉️</div>
                      <div><p className="text-sm opacity-80 font-bold">Email</p><p className="text-lg font-black">info@delicias.com</p></div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">📍</div>
                      <div><p className="text-sm opacity-80 font-bold">Ubicación</p><p className="text-lg font-black">Bogotá, Colombia</p></div>
                   </div>
                </div>
             </div>

             {/* Card Horario */}
             <div className="bg-yellow-400 rounded-[2.5rem] p-10 text-[#009045] shadow-xl relative overflow-hidden group">
                <h3 className="text-2xl font-black mb-6">Horario de Atención</h3>
                <div className="space-y-3 font-bold text-lg">
                   <div className="flex justify-between border-b border-[#009045]/20 pb-2"><span className="opacity-80">Lunes - Viernes</span><span>8:00 AM - 6:00 PM</span></div>
                   <div className="flex justify-between border-b border-[#009045]/20 pb-2"><span className="opacity-80">Sábados</span><span>9:00 AM - 2:00 PM</span></div>
                   <div className="flex justify-between text-red-600"><span className="opacity-80">Domingos</span><span>Cerrado</span></div>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER TRANSITION --- */}
      <div className="relative bg-gray-50 h-16 w-full z-10 mt-12">
         <WaveDivider color="fill-[#009045]" position="bottom" />
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-[#009045] text-white pt-16 relative overflow-hidden">
        <div className="container mx-auto px-4 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="text-[100px] leading-none drop-shadow-xl cursor-pointer hover:scale-110 transition-transform">🏪</div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">📍</span> Fábrica</h3>
              <div className="space-y-2 font-medium text-green-50"><p>Carrera 68 D Nº 98-23</p><p>Bogotá - Colombia</p></div>
            </div>
             <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">🕒</span> Horarios</h3>
              <div className="space-y-4 font-medium text-green-50"><p>Lunes a Viernes: 8am - 5pm</p></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">✉️</span> Contacto</h3>
              <div className="space-y-4 font-medium text-green-50"><p className="font-bold text-yellow-300 text-lg">018000 514020</p></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">💼</span> Equipo</h3>
              <div className="font-medium text-green-50"><a href="#" className="underline hover:text-yellow-300">Trabaja con nosotros</a></div>
            </div>
          </div>
        </div>
        <div className="bg-[#006831] py-6 text-center text-sm font-bold text-green-100 border-t border-[#00582a]">
            © 2025 Delicias Colombianas | Hecho con ❤️ y Sabor
        </div>
      </footer>
    </div>
  )
}