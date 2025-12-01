'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'
import { apiService } from '../../services/ApiService'

// ICONOS
import {
  ShoppingCart, X, Search, Filter, ArrowLeft, ArrowRight,
  LayoutGrid, CheckCircle, ImageOff, LogIn, LogOut, User, Menu,
  Star, Tag, MapPin, Clock, Phone, Mail, Facebook, Instagram, Youtube, Quote,
  Linkedin, MessageCircle, // <--- Agregados para el footer
  Drumstick, Milk, Croissant, Coffee, Candy
} from 'lucide-react'

const DJANGO_BASE_URL = 'http://127.0.0.1:8000';
const DJANGO_MEDIA_PATH = '/media/';

// --- MODAL DE ÉXITO (Estilo Retail Moderno) ---
const SuccessModal = ({ isOpen, onClose, lastAdded, recommendations, onAddRecommendation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white w-full max-w-3xl md:rounded-[2rem] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gray-50 p-6 text-center border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-white border-4 border-[#009045] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm animate-bounce-gentle">
            <CheckCircle size={32} className="text-[#009045]" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">¡Excelente elección!</h2>
          <p className="text-gray-500 text-sm mt-1">Producto agregado al carrito. Mira esto también:</p>
        </div>

        <div className="p-6 bg-white overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {recommendations.slice(0, 6).map((rec) => (
              <div key={rec.id} className="min-w-[150px] max-w-[150px] snap-center bg-white border border-gray-200 rounded-2xl p-3 flex flex-col hover:shadow-lg transition-shadow relative group">
                {rec.oferta && <span className="absolute top-2 right-2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">OFERTA</span>}

                <div className="h-24 w-full flex items-center justify-center mb-2 relative overflow-hidden">
                  {rec.imagen ? (
                    <img src={rec.imagen} alt={rec.nombre} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="text-gray-300"><ImageOff size={24} /></div>
                  )}
                </div>

                <h4 className="text-xs font-bold text-gray-800 leading-tight mb-1 line-clamp-2 h-8">{rec.nombre}</h4>
                <p className="text-sm font-black text-[#009045] mb-2">${rec.precio.toLocaleString()}</p>

                <button
                  onClick={() => onAddRecommendation(rec)}
                  className="w-full mt-auto bg-[#009045] hover:bg-[#007a3a] text-white text-[10px] font-bold py-2 rounded-full flex items-center justify-center gap-1 transition-colors active:scale-95"
                >
                  <ShoppingCart size={12} /> Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50">
          <button onClick={onClose} className="w-full bg-white border-2 border-[#009045] text-[#009045] font-bold py-3 rounded-full hover:bg-green-50 transition-colors">
            Seguir comprando
          </button>
          <Link href="/carrito" className="w-full">
            <button className="w-full bg-[#009045] text-white font-bold py-3.5 rounded-full hover:bg-[#007a3a] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95">
              Ir al carrito <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- MODAL DE DETALLE (VISTA RÁPIDA) ---
const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [isClosing, setIsClosing] = useState(false)
  const handleClose = () => { setIsClosing(true); setTimeout(onClose, 300) }
  if (!product) return null

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
      <div className={`bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`} onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 bg-white/80 hover:bg-red-100 text-gray-500 hover:text-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20 shadow-sm"><X size={20} /></button>

        {/* Lado Izquierdo: Color del producto */}
        <div className={`md:w-1/2 p-10 flex items-center justify-center ${product.cardColor} relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
          <div className="absolute w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          {product.imagen ? <img src={product.imagen} alt={product.nombre} className="w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" /> : <div className="flex flex-col items-center text-white/50"><ImageOff size={64} /></div>}
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-4"><span className="bg-yellow-400 text-[#009045] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1"><Tag size={12} fill="currentColor" /> {product.categoria}</span></div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 leading-tight">{product.nombre}</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">{product.descripcion || "Disfruta del auténtico sabor colombiano."}</p>
          <div className="flex items-end gap-4 mb-8 border-b border-gray-100 pb-8">
            <span className="text-5xl font-black text-[#009045] tracking-tight">${product.precio.toLocaleString()}</span>
            {product.precio_original && <span className="text-xl text-gray-400 line-through font-bold mb-2">${product.precio_original.toLocaleString()}</span>}
          </div>
          <button onClick={() => { onAddToCart(product); handleClose(); }} className="flex-1 bg-[#009045] text-white font-bold py-4 rounded-xl hover:bg-[#007a3a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg group active:scale-95">
            <ShoppingCart size={24} className="group-hover:animate-bounce" /> AGREGAR AL CARRITO
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Productos() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState('destacados')
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { addToCart, getCartItemsCount } = useCart()
  const { user, logout } = useAuth()

  // COLORES "VINTAGE" CARACTERÍSTICOS
  const getCardColor = (categoria) => {
    const colors = {
      'Carnes': 'bg-[#741b47]',    // Vino tinto
      'Lacteos': 'bg-[#2062af]',   // Azul fuerte
      'Panadería': 'bg-[#c27803]', // Ocre
      'Bebidas': 'bg-[#5b3626]',   // Café oscuro
      'Dulces': 'bg-[#e69138]',    // Naranja
      'default': 'bg-[#009045]'    // Verde
    }
    const key = Object.keys(colors).find(k => categoria && k.toLowerCase() === categoria.toLowerCase())
    return colors[key] || colors['default']
  }

  // CATEGORÍAS
  const categories = [
    { id: 'todos', name: 'Todo', icon: <LayoutGrid size={18} />, count: 0 },
    { id: 'Carnes', name: 'Carnes', icon: <Drumstick size={18} />, count: 0 },
    { id: 'Lacteos', name: 'Lácteos', icon: <Milk size={18} />, count: 0 },
    { id: 'Panadería', name: 'Panadería', icon: <Croissant size={18} />, count: 0 },
    { id: 'Bebidas', name: 'Bebidas', icon: <Coffee size={18} />, count: 0 },
    { id: 'Dulces', name: 'Dulces', icon: <Candy size={18} />, count: 0 }
  ]

  const sortOptions = [
    { id: 'destacados', name: 'Relevantes' },
    { id: 'precio-asc', name: 'Menor precio' },
    { id: 'precio-desc', name: 'Mayor precio' },
    { id: 'nombre', name: 'Nombre A-Z' }
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await apiService.getProducts()
      if (!productsData || productsData.length === 0) {
        setProducts([]); return
      }
      const categoryIdMap = { 1: 'Carnes', 2: 'Lacteos', 3: 'Panadería', 4: 'Bebidas', 5: 'Dulces' }
      const transformedProducts = productsData.map((product, index) => {
        let categoria = 'General'
        if (typeof product.categoria === 'number') categoria = categoryIdMap[product.categoria] || 'General'
        else if (typeof product.categoria === 'string') {
          categoria = product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1).toLowerCase()
          if (categoria === 'Lacteos') categoria = 'Lácteos';
          if (categoria === 'Panaderia') categoria = 'Panadería';
        }
        const precio = parseFloat(product.precio) || 0
        const precio_original = product.precio_original ? parseFloat(product.precio_original) : null
        const imageUrl = product.imagen && !product.imagen.includes('http')
          ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${product.imagen}`
          : product.imagen;

        return {
          id: product.id || Date.now() + index,
          nombre: product.nombre || 'Producto',
          descripcion: product.descripcion,
          precio: precio,
          precio_original: precio_original,
          categoria: categoria,
          destacado: product.destacado || false,
          imagen: imageUrl,
          oferta: precio_original && precio_original > precio,
          nuevo: product.nuevo || Math.random() > 0.8,
          cardColor: getCardColor(categoria)
        }
      })
      setProducts(transformedProducts)
      setFilteredProducts(transformedProducts)
    } catch (error) {
      console.error(error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    categories.forEach(cat => {
      if (cat.id === 'todos') cat.count = products.length
      else cat.count = products.filter(p => p.categoria.toLowerCase().includes(cat.id.toLowerCase()) || (cat.id === 'Lacteos' && p.categoria.toLowerCase().includes('lácteos'))).length
    })
    let filtered = products
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(p => {
        const catProd = p.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const catSel = selectedCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return catProd.includes(catSel)
      })
    }
    if (searchTerm) filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

    if (sortBy === 'precio-asc') filtered = [...filtered].sort((a, b) => a.precio - b.precio)
    if (sortBy === 'precio-desc') filtered = [...filtered].sort((a, b) => b.precio - a.precio)
    if (sortBy === 'nombre') filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre))

    setFilteredProducts(filtered)
  }, [selectedCategory, sortBy, searchTerm, products])

  const handleAddToCart = (product) => {
    addToCart(product)
    setLastAddedProduct(product)
    setShowSuccessModal(true)
  }

  if (loading) return <LoadingSpinner text="Preparando el menú..." />

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-800">

      {/* HEADER */}
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
              <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="hover:text-yellow-300 transition-all relative group py-2">
                {item.toUpperCase()}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            {!user ? (
              <div className="hidden md:flex items-center gap-4 font-bold text-base">
                <Link href="/login" className="flex items-center gap-2 hover:text-yellow-300 transition-colors"><LogIn size={18} /> Ingresar</Link>
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
            <div className="absolute top-full left-0 w-full mt-2 bg-[#009045] rounded-2xl shadow-xl border-t-4 border-yellow-400 overflow-hidden lg:hidden animate-fade-in z-50">
              <div className="flex flex-col p-4 space-y-2">
                {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
                  <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="block py-3 px-4 rounded-xl hover:bg-[#007a3a] font-black text-lg transition-colors border-b border-[#007a3a] last:border-0" onClick={() => setMobileMenuOpen(false)}>
                    {item.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* CABECERA (Estilo Retail) */}
      <div className="bg-[#009045] pt-32 md:pt-40 pb-20 rounded-br-[4rem] md:rounded-br-[6rem] shadow-lg mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-md">NUESTROS PRODUCTOS</h1>
          <p className="text-green-100 text-base md:text-lg font-medium max-w-2xl mx-auto">Sabor tradicional en cada bocado.</p>
        </div>
      </div>

      {/* MODALS */}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />}
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} lastAdded={lastAddedProduct} recommendations={products} onAddRecommendation={handleAddToCart} />

      <main className="container mx-auto px-2 md:px-4 pb-20">

        {/* BUSCADOR Y FILTROS STICKY */}
        <div className="sticky top-20 z-40 bg-[#f8f9fa] py-2 transition-all">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input type="text" placeholder="¿Qué buscas hoy?" className="w-full bg-gray-50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="hidden md:flex relative items-center border-l pl-2 border-gray-100">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent font-bold text-xs text-gray-600 outline-none pr-6 cursor-pointer">
                {sortOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
              <ArrowRight size={14} className="absolute right-0 rotate-90 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 shadow-sm ${selectedCategory === cat.id ? 'bg-[#009045] text-white border-[#009045]' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID DE PRODUCTOS: ESTILO VINTAGE COLORIDO CON SOMBRA CIRCULAR --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mt-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`
                    rounded-3xl p-4 flex flex-col relative group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full
                    ${product.cardColor} text-white
                 `}
              >
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
                  {product.oferta && <span className="bg-white text-red-500 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">OFERTA</span>}
                  {product.nuevo && <span className="bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NUEVO</span>}
                </div>

                {/* Imagen con "Sombrita" Circular Detrás */}
                <div className="h-32 md:h-44 w-full flex items-center justify-center mb-3 relative">
                  {/* Círculo de sombra detrás */}
                  <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-black/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>

                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="h-full w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                  ) : (
                    <div className="text-white/50 relative z-10"><ImageOff size={40} /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <h3 className="text-xs md:text-sm font-black leading-tight mb-2 line-clamp-2 h-8 md:h-10 drop-shadow-md">
                    {product.nombre}
                  </h3>

                  <div className="mt-auto w-full">
                    <div className="flex flex-col items-center mb-3">
                      {product.precio_original && (
                        <p className="text-[10px] opacity-70 line-through">${product.precio_original.toLocaleString()}</p>
                      )}
                      <p className="text-lg md:text-xl font-black text-yellow-300 drop-shadow-sm">
                        ${product.precio.toLocaleString()}
                      </p>
                    </div>

                    {/* Botón Estilo Vintage (Claro) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className="w-full bg-[#fdf0d5] text-[#009045] text-xs md:text-sm font-black py-2.5 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart size={16} /> AGREGAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center mt-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300"><Search size={40} /></div>
            <h3 className="text-xl font-black text-gray-800 mb-2">No encontramos resultados</h3>
            <button onClick={() => { setSelectedCategory('todos'); setSearchTerm('') }} className="bg-[#009045] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#007a3a] text-sm transition-all flex items-center gap-2">
              Ver todo el menú
            </button>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
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