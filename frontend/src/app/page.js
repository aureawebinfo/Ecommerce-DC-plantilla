'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiService } from '../services/ApiService'
import ScrollReveal from '../components/ScrollReveal'

const DJANGO_BASE_URL = 'http://127.0.0.1:8000';
const DJANGO_MEDIA_PATH = '/media/';

// Componente de Onda SVG
const WaveDivider = ({ color = "fill-white", position = "bottom", flip = false }) => (
  <div className={`absolute left-0 w-full overflow-hidden leading-[0] z-10 ${position === 'top' ? '-top-1 rotate-180' : '-bottom-1'}`}>
    <svg
      className={`relative block w-[calc(100%+1.3px)] h-[60px] md:h-[120px] ${flip ? 'scale-x-[-1]' : ''}`}
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={color}></path>
    </svg>
  </div>
)

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, getCartItemsCount } = useCart()
  const { user, logout } = useAuth()

  // --- 1. FUNCIONES AUXILIARES ---

  const getCategoryColor = (cat) => {
    const map = {
      'Carnes': 'bg-amber-100',
      'Lacteos': 'bg-blue-100',
      'Postres': 'bg-pink-100',
      'Bebidas': 'bg-orange-100',
      'Dulces': 'bg-purple-100',
      'default': 'bg-green-100'
    }
    const key = typeof cat === 'string' ? cat : 'default'
    return map[key] || map['default']
  }

  const loadSampleData = () => {
    console.log("⚠️ Cargando datos de ejemplo...")
    setFeaturedProducts([
      { id: 101, nombre: "Chicharrón Crocante", descripcion: "El más crocante de la ciudad, con arepa.", precio: 18000, imagen: getProductIcon('Carnes'), categoria: "Carnes", bgColor: "bg-amber-100", destacado: true }, // Usar getProductIcon
      { id: 102, nombre: "Postre de Natas", descripcion: "Receta de la abuela, dulce y suave.", precio: 12000, imagen: getProductIcon('Postres'), categoria: "Postres", bgColor: "bg-pink-100", destacado: true },
      { id: 103, nombre: "Kumins Casero", descripcion: "Fermentado natural, botella 1L.", precio: 8000, imagen: getProductIcon('Lacteos'), categoria: "Lacteos", bgColor: "bg-blue-100", destacado: true },
      { id: 104, nombre: "Empanadas x10", descripcion: "Surtidas de carne y pollo.", precio: 25000, imagen: getProductIcon('Carnes'), categoria: "Carnes", bgColor: "bg-orange-100", destacado: true }
    ])
  }

  const getProductIcon = (categoria) => {
    const iconMap = { 'Carnes': '🥓', 'Lacteos': '🥛', 'Lácteos': '🥛', 'Postres': '🍮', 'Bebidas': '☕', 'Dulces': '🍬', 'default': '📦' }
    return iconMap[categoria] || '📦'
  }

  // --- 2. CARGA DE DATOS ---

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true)
      try {
        console.log("🔄 Intentando cargar productos desde API...")
        if (!apiService || !apiService.getProducts) throw new Error("ApiService no configurado")

        const data = await apiService.getProducts()

        if (data && Array.isArray(data) && data.length > 0) {
          const transformed = data
            // Filtramos solo productos destacados y tomamos los primeros 4
            .filter(p => p.destacado === true || p.destacado === 1 || p.destacado === "true")
            .slice(0, 4)
            .map(product => {

              // 🎯 APLICAR LÓGICA DE URL COMPLETA Y FALLBACK
              const imageUrl = product.imagen && !product.imagen.includes('http')
                ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${product.imagen}`
                : product.imagen || getProductIcon(product.categoria); // Usa el emoji si no hay imagen en el API

              return {
                ...product,
                imagen: imageUrl,
                precio: parseFloat(product.precio) || 0,
                bgColor: product.bgColor || getCategoryColor(product.categoria)
              }
            })

          if (transformed.length > 0) {
            setFeaturedProducts(transformed)
          } else {
            // Si no hay productos destacados, cargamos los de muestra
            loadSampleData()
          }
        } else {
          throw new Error("Base de datos vacía")
        }
      } catch (error) {
        console.warn("Error en carga (usando fallback):", error.message)
        loadSampleData()
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  // Renderizado condicional para carga inicial
  if (loading && featuredProducts.length === 0) {
    return <LoadingSpinner text="Preparando delicias..." />
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* --- HEADER MODIFICADO (Texto grande, sin FI, animación Ingresar) --- */}
      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4">
        <div className="container mx-auto bg-[#009045] text-white rounded-full shadow-2xl py-3 px-4 md:px-8 flex justify-between items-center border-b-[4px] border-[#007a3a]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            {/* 🎯 LOGO: Aumentar w/h y eliminar padding innecesario */}
            <div className="bg-white p-0 rounded-full border-2 border-yellow-400 group-hover:rotate-12 transition-transform shadow-md">
              <img
                src="/icons/DC.png"
                alt="Delicias Colombianas Logo"
                className="w-10 h-10 object-contain" // ⬅️ Aumentado a w-10 h-10
              />
            </div>

            {/* 🎯 TEXTO AÑADIDO: Mostrar "Delicias Colombianas" al lado */}
            <div className="leading-tight hidden sm:block">
              <h1 className="text-xl font-black tracking-wide">DELICIAS</h1>
              <p className="text-xs text-yellow-300 font-bold">COLOMBIANAS</p>
            </div>
          </Link>

          {/* Menú Central - TEXTO MÁS GRANDE */}
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

          {/* Acciones Derecha */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">

            {/* Botones de Sesión ANIMADOS */}
            {!user ? (
              <div className="hidden md:flex items-center gap-4 font-bold text-base">
                <Link
                  href="/login"
                  className="hover:text-yellow-300 hover:scale-110 transform transition-all duration-200"
                >
                  Ingresar
                </Link>
                <Link href="/registro" className="bg-yellow-400 text-[#009045] px-5 py-2 rounded-full font-black hover:bg-white hover:scale-105 shadow-md transition-all">
                  Regístrate
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 font-bold text-sm">
                <span className="text-yellow-300 truncate max-w-[100px]">Hola, {user.nombre || 'Usuario'}</span>
                <button onClick={logout} className="hover:text-red-300 transition-colors">Salir</button>
              </div>
            )}

            {/* Carrito */}
            <Link href="/carrito" className="relative group hover:scale-110 transition-transform">
              <div className="bg-[#007a3a] p-2 md:px-4 md:py-2 rounded-full font-bold hover:bg-yellow-400 hover:text-[#009045] transition-all flex items-center gap-2">
                <span>🛒</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-600 text-white text-xs font-black w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 border-white">
                    {getCartItemsCount()}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION MODIFICADO (Imagen Brownie) --- */}
      <section className="relative bg-[#009045] pt-32 md:pt-44 pb-40 md:pb-48 overflow-visible">
        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">

            <div className="flex-1 text-center md:text-left space-y-6">
              <ScrollReveal>
                <span className="inline-block bg-yellow-400 text-[#009045] px-4 py-1 rounded-full font-black text-sm mb-4 transform -rotate-2 shadow-lg">
                  ¡NUEVOS SABORES!
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md">
                  Sabor Irresistible <br />
                  <span className="text-yellow-300">100% Colombiano</span>
                </h1>
                <p className="text-xl text-green-100 max-w-lg mx-auto md:mx-0 font-medium">
                  Descubre la tradición en cada mordida.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/productos" className="bg-white text-[#009045] px-8 py-4 rounded-full font-black text-lg shadow-lg hover:translate-y-1 transition-all">
                    VER PRODUCTOS
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Imagen del Brownie */}
            <div className="flex-1 flex justify-center items-center relative">
              <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
              <img
                src="/productos/hero-brownie.png"
                alt="Brownie"
                className="w-full max-w-[500px] object-contain drop-shadow-2xl animate-[bounce_3s_infinite]"
              />
            </div>

          </div>
        </div>
        <WaveDivider color="fill-[#fffdf7]" />
      </section>

      {/* --- SECCIÓN DESTACADOS --- */}
      <section className="py-24 pb-40 bg-[#fffdf7] relative z-10">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#4a3b32] mb-4">
                EXPLORA NUESTROS <span className="text-[#009045]">FAVORITOS</span>
              </h2>
              <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
            </div>
          </ScrollReveal>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ScrollReveal key={product.id} className={`delay-${index * 100}`}>
                  <div className="group relative bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-yellow-400 h-full flex flex-col">

                    <div className={`h-48 ${product.bgColor || 'bg-gray-100'} flex items-center justify-center relative overflow-hidden`}>
                      {/* 🎯 LÓGICA DE RENDERIZADO CONDICIONAL CON LLAVES {} */}
                      {product.imagen && product.imagen.includes('http') ? (
                        // 1. SI ES URL (http://...): Renderizar <img>
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="h-48 w-full object-cover object-center drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        // 2. SI ES EMOJI (FALLBACK): Renderizar <span>
                        <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                          {product.imagen}
                        </span>
                      )}
                    </div>

                    <div className="p-6 pt-10 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[#4a3b32] leading-tight mb-2 group-hover:text-[#009045] transition-colors">
                          {product.nombre}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium">
                          {product.descripcion}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-[#009045] text-white font-bold py-3 rounded-xl hover:bg-[#007a3a] transition-colors shadow-[0_4px_0_#006831] active:shadow-none active:translate-y-[4px]"
                      >
                        AGREGAR
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-red-50 rounded-xl">
              <p className="text-xl text-red-500 font-bold">No se pudieron cargar los productos.</p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/productos" className="inline-block text-[#009045] font-black text-lg border-b-4 border-yellow-400 hover:text-yellow-500 transition-colors pb-1">
              VER TODO EL MENÚ &rarr;
            </Link>
          </div>
        </div>
        <WaveDivider color="fill-[#4a3b32]" position="bottom" />
      </section>

      {/* --- BANNERS PROMOCIONALES --- */}
      <section className="bg-[#4a3b32] pt-32 pb-24 relative overflow-visible">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal>
              <div className="bg-[#009045] rounded-[2rem] p-8 text-white h-full flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl min-h-[300px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
                <div>
                  <h3 className="text-2xl font-black mb-4">Tour Estudiantil 2025</h3>
                  <p className="font-medium opacity-90 mb-6">¡Llevamos el sabor a tu universidad!</p>
                </div>
                <button className="bg-white text-[#009045] font-bold py-3 px-6 rounded-full w-max hover:bg-yellow-400 transition-colors">VER MÁS &gt;</button>
              </div>
            </ScrollReveal>
            <ScrollReveal className="delay-100">
              <div className="bg-yellow-400 rounded-[2rem] p-8 text-[#4a3b32] h-full flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl min-h-[300px]">
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div>
                  <span className="bg-[#4a3b32] text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">NUEVO</span>
                  <h3 className="text-3xl font-black mb-4 leading-none">¡Llegó la Torta!</h3>
                  <p className="font-bold text-lg mb-6">Puro chocolate</p>
                </div>
                <div className="self-center text-6xl absolute right-4 bottom-20 opacity-50 md:opacity-100 md:static">🎂</div>
                <button className="bg-[#4a3b32] text-white font-bold py-3 px-6 rounded-full w-full hover:bg-opacity-90 transition-colors mt-auto z-10 relative">COMPRAR AHORA</button>
              </div>
            </ScrollReveal>
            <ScrollReveal className="delay-200">
              <div className="bg-[#9c27b0] rounded-[2rem] p-8 text-white h-full flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl min-h-[300px]">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
                <div>
                  <h3 className="text-2xl font-black mb-4">¡Gana con Delicias!</h3>
                  <p className="font-medium opacity-90 mb-6">Participa por premios inmediatos.</p>
                </div>
                <button className="bg-white text-[#9c27b0] font-bold py-3 px-6 rounded-full w-max hover:bg-yellow-400 hover:text-white transition-colors">PARTICIPAR &gt;</button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- FOOTER TRANSITION --- */}
      <div className="relative bg-[#4a3b32] h-16 w-full">
        <WaveDivider color="fill-[#009045]" position="bottom" />
      </div>

      {/* --- FOOTER COMPLETO --- */}
      <footer className="bg-[#009045] text-white pt-16 relative overflow-hidden font-sans">
        <div className="absolute top-10 right-10 text-yellow-300 text-6xl animate-pulse hidden lg:block">☀️</div>
        <div className="absolute top-20 left-10 text-white opacity-50 text-5xl hidden lg:block">☁️</div>

        <div className="container mx-auto px-4 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <img
                src="/icons/shop_footer.png" // Ruta de tu imagen de tienda
                alt="Tienda Delicias Colombianas"
                // 🎯 MODIFICADO: Aumentamos el límite a 300px
                className="w-full h-full object-contain max-w-[300px] max-h-[300px] drop-shadow-xl transform hover:scale-110 transition-transform cursor-pointer"
              />
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">📍</span> Punto de fábrica</h3>
              <div className="space-y-2 font-medium text-green-50"><p className="font-bold text-white">Dirección</p><p>Bogotá - Colombia</p></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">🕒</span> Horario</h3>
              <div className="space-y-4 font-medium text-green-50"><div><p className="font-bold text-white">Lunes a viernes</p><p>8am - 4pm</p></div></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">✉️</span> Contacto</h3>
              <div className="space-y-4 font-medium text-green-50"><div><p className="font-bold text-white">Línea nacional</p><p className="text-lg font-black text-yellow-300">018000 514020</p></div></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><span className="text-2xl">💼</span> Empleo</h3>
              <div className="font-medium text-green-50"><a href="#" className="underline font-bold text-white">Enviar hoja de vida</a></div>
            </div>
          </div>
        </div>

        <div className="bg-[#007a3a] py-6 relative z-20 mt-12 lg:mt-0 shadow-lg">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
            <div className="flex flex-wrap justify-center gap-6 font-bold text-sm uppercase tracking-wider">
              {['Carnes', 'Lácteos', 'Postres'].map(item => (<Link key={item} href={`/productos`} className="hover:text-yellow-300">{item}</Link>))}
            </div>
            <div className="lg:-mt-20 relative z-30 order-first lg:order-none">
              {/* Contenedor Exterior (Círculo Blanco/Borde Verde) */}
              {/* Eliminamos p-1 del contenedor exterior para dar más espacio a la imagen */}
              <div className="bg-white p-1 rounded-full border-[6px] border-[#007a3a] shadow-xl hover:scale-105 transition-transform">

                {/* Contenedor Interior (Círculo Verde) - Aseguramos que sea transparente si el logo tiene su propio fondo */}
                <div className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-transparent rounded-full">
                  <img
                    src="/icons/DC.png"
                    alt="Delicias Colombianas Logo"

                    // 🎯 CAMBIOS CLAVE AQUÍ:
                    // 1. w-full h-full object-cover: Fuerza a la imagen a llenar el espacio.
                    // 2. Quitamos el p-1: Para que el logo se pegue a los bordes del círculo interno.
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="font-bold text-sm uppercase">Síguenos</span>
              <div className="flex gap-3 text-2xl"><span>🔵</span><span>🟣</span><span>🔴</span></div>
            </div>
          </div>
        </div>

        <div className="bg-[#006831] py-8 text-sm font-medium border-t border-[#00582a]">
          <div className="container mx-auto px-4 text-center"><p>© 2025 Delicias Colombianas</p></div>
        </div>
      </footer>
    </div>
  )
}