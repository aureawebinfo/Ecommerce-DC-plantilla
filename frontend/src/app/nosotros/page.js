'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext' // Asegurar rutas correctas
import { useAuth } from '../../context/AuthContext' // Asegurar rutas correctas
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'
import ScrollReveal from '../../components/ScrollReveal'

// Componente de Onda
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

export default function Nosotros() {
  const [loading, setLoading] = useState(true)
  const { getCartItemsCount } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  const valores = [
    { icon: "🌱", titulo: "Tradición", descripcion: "Recetas de la abuela, intactas.", color: "bg-[#741b47]" }, // Vino
    { icon: "⭐", titulo: "Calidad", descripcion: "Ingredientes 100% seleccionados.", color: "bg-[#2062af]" }, // Azul
    { icon: "❤️", titulo: "Pasión", descripcion: "Amor en cada bocado.", color: "bg-[#c27803]" }, // Dorado
    { icon: "🤝", titulo: "Unión", descripcion: "Apoyamos al agro local.", color: "bg-[#e69138]" } // Naranja
  ]

  const equipo = [
    { nombre: "María G.", puesto: "Fundadora", desc: "La mente maestra detrás del sabor.", imagen: "👩‍🍳" },
    { nombre: "Carlos R.", puesto: "Calidad", desc: "Nada sale sin su aprobación.", imagen: "👨‍💼" },
    { nombre: "Ana M.", puesto: "Innovación", desc: "Creando el futuro dulce.", imagen: "👩‍🔬" }
  ]

  const hitos = [
    { año: "1990", evento: "El Inicio", detalle: "Una pequeña cocina en Bogotá." },
    { año: "2005", evento: "Expansión", detalle: "Llegamos a todo el país." },
    { año: "2023", evento: "Digital", detalle: "¡Lanzamos nuestra tienda online!" }
  ]

  if (loading) return <LoadingSpinner text="Conociendo nuestra historia..." />

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

      {/* --- HERO SECTION --- */}
      <div className="bg-[#009045] pt-48 pb-32 relative text-center text-white overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <span className="bg-yellow-400 text-[#009045] px-4 py-1 rounded-full font-black text-sm mb-6 inline-block transform -rotate-2 shadow-lg">DESDE 1990</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-lg leading-tight">
                Nuestra Historia <br/><span className="text-yellow-300">Sabe a Colombia</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto text-green-100 leading-relaxed">
                Más de 30 años amasando tradición, horneando sueños y entregando felicidad en cada paquete.
              </p>
            </ScrollReveal>
         </div>
         <div className="absolute top-40 left-10 text-8xl opacity-20 animate-pulse hidden lg:block">🇨🇴</div>
         <div className="absolute bottom-20 right-10 text-8xl opacity-20 animate-bounce hidden lg:block">❤️</div>
         <WaveDivider color="fill-gray-50" />
      </div>

      <main className="container mx-auto px-4 py-12 -mt-10 relative z-20">
        
        {/* --- VALORES (Tarjetas de Colores) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {valores.map((valor, index) => (
            <ScrollReveal key={index} className={`delay-${index * 100}`}>
              <div className={`${valor.color} rounded-[2rem] p-8 text-center text-white shadow-xl hover:-translate-y-2 transition-transform duration-300 group`}>
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{valor.icon}</div>
                <h3 className="text-2xl font-black mb-2">{valor.titulo}</h3>
                <p className="font-medium opacity-90">{valor.descripcion}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* --- HISTORIA (Línea de Tiempo) --- */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-2">El Camino Recorrido</h2>
            <div className="w-20 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Línea Central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full rounded-full"></div>
            
            <div className="space-y-12">
              {hitos.map((hito, index) => (
                <ScrollReveal key={index}>
                  <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white p-6 rounded-[2rem] shadow-lg border-2 border-gray-100 hover:border-[#009045] transition-colors group">
                        <span className="text-[#009045] font-black text-2xl block mb-1 group-hover:scale-110 transition-transform origin-right">{hito.año}</span>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{hito.evento}</h4>
                        <p className="text-gray-600 font-medium">{hito.detalle}</p>
                      </div>
                    </div>
                    {/* Punto Central */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 border-4 border-white rounded-full shadow-md z-10"></div>
                    <div className="w-1/2"></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- EQUIPO (Avatar Cards) --- */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-2">La Familia</h2>
            <p className="text-gray-500 font-bold text-lg">Manos expertas, corazones apasionados.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipo.map((miembro, index) => (
              <ScrollReveal key={index} className={`delay-${index * 100}`}>
                <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-xl border-b-8 border-[#009045] hover:-translate-y-2 transition-transform">
                  <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-inner border-4 border-white">
                    {miembro.imagen}
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">{miembro.nombre}</h3>
                  <span className="bg-yellow-100 text-[#009045] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block mt-2">
                    {miembro.puesto}
                  </span>
                  <p className="text-gray-600 font-medium">{miembro.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

      </main>

      {/* --- FOOTER COMPLETO --- */}
      <footer className="bg-[#009045] text-white pt-16 relative overflow-hidden border-t-8 border-yellow-400">
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
        <div className="bg-[#006831] py-6 text-center text-sm font-bold text-green-100">
            © 2025 Delicias Colombianas | Hecho con ❤️ y Sabor
        </div>
      </footer>
    </div>
  )
}