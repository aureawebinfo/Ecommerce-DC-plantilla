'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiService } from '../services/ApiService'
import ScrollReveal from '../components/ScrollReveal'

// ICONOS
import {
  ShoppingCart, User, Utensils, ImageOff, LogIn, LogOut,
  Star, Tag, Percent, ArrowRight, Quote, Menu, X, ChevronRight, Truck,
  MapPin, Phone, Mail, Facebook, Instagram, Youtube, Linkedin, MessageCircle // Iconos footer
} from 'lucide-react'

const DJANGO_BASE_URL = 'http://127.0.0.1:8000';
const DJANGO_MEDIA_PATH = '/media/';

export default function Home() {
  // --- ESTADOS ---
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bannerItems, setBannerItems] = useState([]) // Estado para el slider dinámico
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { addToCart, getCartItemsCount } = useCart()
  const { user, logout } = useAuth()

  // --- DATOS POR DEFECTO (FALLBACK) ---
  // Si no has creado la tabla en Django aún, se mostrarán estos.
  const defaultBanners = [
    {
      id: 1,
      tag: "OFERTA WEB",
      titulo: "20% OFF en Tortas",
      subtitulo: "Celebra los momentos dulces con descuento.",
      imagen: "/productos/hero-brownie.png",
      color_fondo: "bg-[#741b47]",
      color_texto: "text-pink-100",
      texto_boton: "VER TORTAS",
      enlace: "/productos"
    },
    {
      id: 2,
      tag: "DOMICILIOS",
      titulo: "Desayunos Sorpresa",
      subtitulo: "El regalo perfecto llega a la puerta.",
      imagen: "/productos/combo-ejemplo.png",
      color_fondo: "bg-[#e69138]",
      color_texto: "text-orange-50",
      texto_boton: "PEDIR AHORA",
      enlace: "/productos"
    }
  ];

  // --- EFECTOS (CARGA DE DATOS) ---

  // 1. Carrusel Automático
  useEffect(() => {
    if (bannerItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [bannerItems])

  // 2. Fetch de Datos (Productos y Banners)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // A. Cargar Productos Destacados
        if (!apiService || !apiService.getProducts) throw new Error("ApiService no configurado")
        const productsData = await apiService.getProducts()

        if (productsData && Array.isArray(productsData)) {
          const allProducts = productsData.map(product => ({
            ...product,
            imagen: product.imagen && !product.imagen.includes('http')
              ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${product.imagen}`
              : product.imagen,
            precio: parseFloat(product.precio) || 0,
            bgColor: 'bg-green-50'
          }));
          // Filtrar destacados
          const featured = allProducts
            .filter(p => p.destacado === true || p.destacado === 1 || p.destacado === "true")
            .slice(0, 4);
          setFeaturedProducts(featured);
        }


        // B. Cargar Banners (Slider)
        let bannersData = [];
        try {
          // bannersData ahora es el array limpio (Array(1))
          bannersData = await apiService.getBanners();

          // 1. PROCESAR Y APLICAR DATOS
          if (bannersData && bannersData.length > 0) {
            const processedBanners = bannersData.map(b => ({
              ...b,
              // Aseguramos que la URL de la imagen esté completa
              imagen: b.imagen && !b.imagen.includes('http')
                ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${b.imagen}`
                : b.imagen,
              // Usamos los campos del modelo
              titulo: b.titulo,
              color_fondo: b.color_fondo,
              color_texto: b.color_texto,
              texto_boton: b.texto_boton,
              enlace: b.enlace
            }));
            setBannerItems(processedBanners);
          } else {
            setBannerItems([]);
          }

        } catch (error) {
          // Si la API falla por completo, el slider se queda vacío pero ya no da 404
          console.error("Error cargando Banners desde API:", error);
          setBannerItems([]);
        }
        // ...

      } catch (error) {
        console.warn("Error API:", error.message)
        // En caso de error total, ponemos datos falsos para que se vea diseño
        setBannerItems(defaultBanners);
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  if (loading && featuredProducts.length === 0) {
    return <LoadingSpinner text="Horneando delicias..." />
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* --- HEADER --- */}
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
                <Link href="/login" className="flex items-center gap-2 hover:text-yellow-300 transition-colors"><LogIn size={18} /> Ingresar</Link>
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
            <button className="lg:hidden text-white p-2 hover:text-yellow-300 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#009045] rounded-2xl shadow-xl border-t-4 border-yellow-400 overflow-hidden lg:hidden z-50 animate-fade-in">
              <div className="flex flex-col p-4 space-y-2">
                {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
                  <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="block py-3 px-4 rounded-xl hover:bg-[#007a3a] font-black text-lg transition-colors border-b border-[#007a3a] last:border-0" onClick={() => setMobileMenuOpen(false)}>
                    {item.toUpperCase()}
                  </Link>
                ))}
                {!user ? (
                  <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-[#007a3a]">
                    <Link href="/login" className="py-2 px-4 hover:text-yellow-300 font-bold flex items-center gap-2"><LogIn size={18} /> Ingresar</Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#007a3a] px-4">
                    <div className="flex items-center gap-2 font-bold"><User size={18} className="text-yellow-300" /> {user.nombre}</div>
                    <button onClick={logout} className="text-red-300 font-bold text-sm">Salir</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#009045] pt-32 md:pt-44 pb-32 rounded-br-[4rem] md:rounded-br-[8rem] shadow-xl z-20">
        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 bg-yellow-400 text-[#009045] px-4 py-1 rounded-full font-black text-sm mb-4 transform -rotate-2 shadow-lg">
                  <Star size={16} fill="currentColor" /> ¡NUEVOS SABORES!
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md">
                  Sabor Irresistible <br />
                  <span className="text-yellow-300">100% Colombiano</span>
                </h1>
                <p className="text-xl text-green-100 max-w-lg mx-auto md:mx-0 font-medium">
                  Descubre la tradición en cada mordida.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/productos" className="bg-white text-[#009045] px-8 py-4 rounded-full font-black text-lg shadow-lg hover:translate-y-1 transition-all flex items-center gap-2">
                    VER PRODUCTOS <ArrowRight size={20} strokeWidth={3} />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
            <div className="flex-1 flex justify-center items-center relative">
              <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
              <img src="/productos/hero-brownie.png" alt="Brownie" className="w-full max-w-[500px] object-contain drop-shadow-2xl animate-[bounce_3s_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CARRUSEL DE NOVEDADES (BACKEND CONNECTED) --- */}
      <section className="py-12 bg-gray-50 overflow-hidden">

        {/* TITULO */}
        <div className="container mx-auto px-4 mb-8 text-center">
          <h3 className="text-2xl font-black text-[#4a3b32] uppercase tracking-wider flex items-center justify-center gap-3">
            <Percent className="text-[#009045]" /> Novedades y Ofertas
          </h3>
        </div>

        {/* SLIDER */}
        <div className="container mx-auto px-4">
          <div className="relative w-full max-w-6xl mx-auto h-[350px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            {bannerItems.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${item.color_fondo || 'bg-gray-800'} flex flex-col md:flex-row`}
                style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
              >
                {/* Texto */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start p-8 md:p-16 relative z-10">
                  <span className="bg-yellow-400 text-[#009045] text-xs font-black px-3 py-1 rounded-full mb-4 animate-pulse uppercase">
                    {item.tag}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-none">{item.titulo}</h2>
                  <p className={`text-lg font-medium ${item.color_texto || 'text-white'} mb-6`}>{item.subtitulo}</p>

                  <Link href={item.enlace || '/productos'} className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-300 transition-colors flex items-center gap-2 group">
                    {item.texto_boton} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Imagen */}
                <div className="w-full md:w-1/2 h-full relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 skew-x-12 transform origin-bottom-left"></div>
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    className="relative z-10 w-3/4 h-3/4 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}

            {/* Puntos */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {bannerItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FAVORITOS (GRID) --- */}
      <section className="py-20 bg-[#fffdf7]">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#4a3b32] mb-4">
                FAVORITOS <span className="text-[#009045]">DEL PÚBLICO</span>
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
                      {product.imagen ? (
                        <img src={product.imagen} alt={product.nombre} className="h-48 w-full object-cover object-center drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 opacity-50"><ImageOff size={48} /></div>
                      )}
                    </div>
                    <div className="p-6 pt-10 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[#4a3b32] leading-tight mb-2 group-hover:text-[#009045] transition-colors">{product.nombre}</h3>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium">{product.descripcion}</p>
                      </div>
                      <button onClick={() => handleAddToCart(product)} className="w-full bg-[#009045] text-white font-bold py-3 rounded-xl hover:bg-[#007a3a] transition-colors shadow-[0_4px_0_#006831] active:shadow-none active:translate-y-[4px] flex justify-center items-center gap-2">
                        <ShoppingCart size={18} /> AGREGAR
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-red-50 rounded-3xl border-2 border-red-100">
              <p className="text-xl text-red-500 font-bold">No hay productos destacados por ahora.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- PROMOCIONES FUNCIONALES --- */}
      <section className="bg-[#4a3b32] pt-24 pb-24 relative overflow-visible rounded-tl-[4rem] md:rounded-tl-[8rem] z-10 -mt-10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1: Descuentos */}
            <ScrollReveal>
              <div className="bg-[#009045] rounded-[2rem] p-8 text-white h-full flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl min-h-[300px]">
                <div className="absolute top-4 right-4 opacity-20"><Percent size={80} /></div>
                <div>
                  <h3 className="text-2xl font-black mb-4">¡Ofertas del Mes!</h3>
                  <p className="font-medium opacity-90 mb-6">Descuentos especiales en productos seleccionados.</p>
                </div>
                {/* AHORA ES UN LINK FUNCIONAL A PRODUCTOS */}
                <Link href="/productos" className="bg-white text-[#009045] font-bold py-3 px-6 rounded-full w-max hover:bg-yellow-400 transition-colors flex items-center gap-2">
                  VER DESCUENTOS <Tag size={18} />
                </Link>
              </div>
            </ScrollReveal>

            {/* CARD 2: Cotizar (Contacto) */}
            <ScrollReveal className="delay-100">
              <div className="bg-yellow-400 rounded-[2rem] p-8 text-[#4a3b32] h-full flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl min-h-[300px]">
                <div>
                  <span className="bg-[#4a3b32] text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">POPULAR</span>
                  <h3 className="text-3xl font-black mb-4 leading-none">Catering y Eventos</h3>
                  <p className="font-bold text-lg mb-6">Atendemos tus reuniones empresariales.</p>
                </div>
                <div className="absolute right-4 bottom-20 opacity-50"><Utensils size={80} /></div>
                {/* AHORA LLEVA A CONTACTO */}
                <Link href="/contacto" className="bg-[#4a3b32] text-white font-bold py-3 px-6 rounded-full w-full hover:bg-opacity-90 transition-colors mt-auto z-10 relative flex justify-center">
                  COTIZAR AHORA
                </Link>
              </div>
            </ScrollReveal>

            {/* CARD 3: Pedir Ya (Productos) */}
            <ScrollReveal className="delay-200">
              <div className="bg-[#9c27b0] rounded-[2rem] p-8 text-white h-full flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl min-h-[300px]">
                <div>
                  <h3 className="text-2xl font-black mb-4">Envíos a Domicilio</h3>
                  <p className="font-medium opacity-90 mb-6">Llegamos a la puerta de tu casa en tiempo récord.</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-20"><Truck size={100} /></div>
                {/* LLEVA A PRODUCTOS */}
                <Link href="/productos" className="bg-white text-[#9c27b0] font-bold py-3 px-6 rounded-full w-max hover:bg-yellow-400 hover:text-white transition-colors flex items-center gap-2">
                  PEDIR YA <ChevronRight size={18} />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* --- FOOTER FUNCIONAL --- */}
      <footer className="bg-[#009045] text-white mt-auto flex flex-col font-sans border-t-[8px] border-yellow-400">
        <div className="container mx-auto px-4 md:px-8 py-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div>
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Contáctanos</h3>
              <p className="mb-2 text-green-50">Desde celular a nivel nacional</p>
              <p className="font-bold text-yellow-300 text-lg mb-4">601 486 5000</p>
              <p className="text-sm mb-4 text-green-50">Opción 1: Ventas<br />Opción 3: Posventa</p>
              <p className="mb-2 text-green-50">Línea Whatsapp</p>
              <p className="font-bold text-yellow-300 text-lg">311 2281010</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Nosotros</h3>
              <ul className="space-y-2">
                {/* Enlaces funcionales */}
                <li><Link href="/nosotros" className="hover:text-yellow-300 transition-colors">Quiénes somos</Link></li>
                <li><Link href="/nosotros" className="hover:text-yellow-300 transition-colors">Nuestra Historia</Link></li>
                <li><Link href="/contacto" className="hover:text-yellow-300 transition-colors">Negocios Institucionales</Link></li>
                <li><Link href="/nosotros" className="hover:text-yellow-300 transition-colors">Sostenibilidad</Link></li>
                <li><Link href="/contacto" className="hover:text-yellow-300 transition-colors">Trabaja con nosotros</Link></li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Legales</h3>
                <ul className="space-y-2 text-sm text-green-50">
                  {/* Estos pueden quedar con # si no existen las páginas aún */}
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Aviso de privacidad</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Políticas</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Términos</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Servicios</h3>
                <ul className="space-y-2 text-sm text-green-50">
                  <li><Link href="/contacto" className="hover:text-yellow-300 transition-colors">Domicilios</Link></li>
                  <li><Link href="/contacto" className="hover:text-yellow-300 transition-colors">Retiro en tienda</Link></li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#007a3a]">Club Delicias</h3>
              <ul className="space-y-2 mb-6">
                <li><Link href="/registro" className="hover:text-yellow-300 transition-colors">Inscríbete</Link></li>
                <li><Link href="/productos" className="hover:text-yellow-300 transition-colors">Beneficios</Link></li>
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

        <div className="relative bg-[#007a3a] pt-16 pb-6 mt-auto shadow-inner">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 z-20">
            <div className="bg-white p-1 rounded-full border-[6px] border-[#007a3a] shadow-xl hover:scale-105 transition-transform w-28 h-28 flex items-center justify-center overflow-hidden">
              <img src="/icons/DC.png" alt="Logo Footer" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="container mx-auto px-4 text-center flex flex-col gap-2 relative z-10">
            <p className="text-sm font-medium">© 2025 Delicias Colombianas. Todos los derechos reservados.</p>
            <p className="text-xs opacity-70 flex items-center justify-center gap-1 text-yellow-300">
              <Quote size={10} /> Calidad y Tradición <Quote size={10} />
            </p>
            <p className="text-xs text-green-100/60 mt-2">
              Plantilla de <a href="https://aurea-web.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-yellow-300 transition-colors">Áurea Web</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}