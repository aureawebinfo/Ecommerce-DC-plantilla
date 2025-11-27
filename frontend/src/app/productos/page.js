'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'
import BackToHome from '../../components/BackToHome'
import { apiService } from '../../services/ApiService'


const DJANGO_BASE_URL = 'http://127.0.0.1:8000';
const DJANGO_MEDIA_PATH = '/media/';

// --- COMPONENTE MODAL (VISTA RÁPIDA) ---
const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative animate-slide-up"
        onClick={e => e.stopPropagation()} // Evita cerrar al hacer clic dentro
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors z-10"
        >
          ✕
        </button>

        {/* Columna Imagen (Con el color del producto) */}
        <div className={`md:w-1/2 p-8 flex items-center justify-center ${product.cardColor || 'bg-green-100'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5"></div>
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Columna Info */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-2">
            <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {product.categoria}
            </span>
          </div>

          <h2 className="text-4xl font-black text-gray-800 mb-4 leading-tight">{product.nombre}</h2>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {product.descripcion || "Disfruta del auténtico sabor colombiano con este producto elaborado con los mejores ingredientes tradicionales."}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-black text-[#009045]">${product.precio.toLocaleString()}</span>
            {product.precio_original && (
              <span className="text-xl text-gray-400 line-through font-bold">${product.precio_original.toLocaleString()}</span>
            )}
          </div>

          <button
            onClick={() => { onAddToCart(product); onClose(); }}
            className="w-full bg-[#009045] text-white font-black py-4 rounded-xl hover:bg-[#007a3a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
          >
            <span>🛒</span> AGREGAR AL CARRITO
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de Onda Decorativa
const WaveTitle = () => (
  <div className="w-full overflow-hidden leading-[0] rotate-180 mb-[-1px]">
    <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
    </svg>
  </div>
)

export default function Productos() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState('destacados')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null) // Estado para el modal

  const { addToCart, getCartItemsCount } = useCart()
  const { user, logout } = useAuth()

  // Paleta de colores estilo Mama-ia para las tarjetas
  const getCardColor = (categoria) => {
    const colors = {
      'Carnes': 'bg-[#741b47]',    // Vino tinto 
      'Lacteos': 'bg-[#2062af]',   // Azul fuerte
      'Panadería': 'bg-[#c27803]', // Ocre/Dorado
      'Bebidas': 'bg-[#5b3626]',   // Café oscuro
      'Dulces': 'bg-[#e69138]',    // Naranja
      'default': 'bg-[#009045]'    // Verde marca
    }
    // Búsqueda insensible a mayúsculas/minúsculas
    const key = Object.keys(colors).find(k =>
      categoria && k.toLowerCase() === categoria.toLowerCase()
    )
    return colors[key] || colors['default']
  }

  // Asegúrate de que los IDs coincidan exactamente con lo que viene de tu BD o del mapeo
  const categories = [
    { id: 'todos', name: 'Todo el Menú', icon: '📋', count: 0 },
    { id: 'Carnes', name: 'Carnes', icon: '🍖', count: 0 },
    { id: 'Lacteos', name: 'Lácteos', icon: '🥛', count: 0 },
    { id: 'Panadería', name: 'Panadería', icon: '🥖', count: 0 },
    { id: 'Bebidas', name: 'Bebidas', icon: '☕', count: 0 },
    { id: 'Dulces', name: 'Dulces', icon: '🍬', count: 0 }
  ]

  const sortOptions = [
    { id: 'destacados', name: 'Más relevantes' },
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
      console.log('🔄 Iniciando carga de productos...')

      const productsData = await apiService.getProducts()

      if (!productsData || productsData.length === 0) {
        loadSampleProducts()
        return
      }

      // Mapeo para normalizar IDs numéricos a Strings si la BD usa números
      const categoryIdMap = {
        1: 'Carnes', 2: 'Lacteos', 3: 'Panadería', 4: 'Bebidas', 5: 'Dulces'
      }

      const transformedProducts = productsData.map((product, index) => {
        let categoria = 'General'

        if (typeof product.categoria === 'number') {
          categoria = categoryIdMap[product.categoria] || 'General'
        } else if (typeof product.categoria === 'string') {
          categoria = product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1).toLowerCase()
          if (categoria === 'Lacteos') categoria = 'Lácteos';
          if (categoria === 'Panaderia') categoria = 'Panadería';
        }

        const precio = parseFloat(product.precio) || 0
        const precio_original = product.precio_original ? parseFloat(product.precio_original) : null

        return {
          id: product.id || Date.now() + index,
          nombre: product.nombre || 'Producto sin nombre',
          descripcion: product.descripcion || 'Descripción no disponible',
          precio: precio,
          precio_original: precio_original,
          categoria: categoria, // Categoría normalizada
          destacado: product.destacado || false,
          stock: true,
          imagen: product.imagen || getProductIcon(categoria),
          envio_gratis: precio > 50000,
          vendidos: product.vendidos || Math.floor(Math.random() * 100) + 10,
          calificacion: product.calificacion || (Math.random() * 1 + 4).toFixed(1),
          oferta: precio_original && precio_original > precio,
          nuevo: product.nuevo || Math.random() > 0.7,
          cardColor: getCardColor(categoria)
        }
      })

      setProducts(transformedProducts)
      setFilteredProducts(transformedProducts)

    } catch (error) {
      console.error('❌ Error loading products:', error)
      loadSampleProducts()
    } finally {
      setLoading(false)
    }
  }

  const loadSampleProducts = () => {
    const sampleProducts = [
      { id: 1, nombre: "Chicharrón Crocante", descripcion: "100% natural y crocante.", precio: 18000, categoria: "Carnes", imagen: "🥓", cardColor: getCardColor("Carnes") },
      { id: 2, nombre: "Café Premium", descripcion: "Tostión media, sabor intenso.", precio: 22000, categoria: "Bebidas", imagen: "☕", cardColor: getCardColor("Bebidas") },
      { id: 3, nombre: "Queso Campesino", descripcion: "Fresco y suave.", precio: 14000, categoria: "Lacteos", imagen: "🧀", cardColor: getCardColor("Lacteos") },
      { id: 4, nombre: "Postre de Natas", descripcion: "Receta de la abuela.", precio: 12000, categoria: "Dulces", imagen: "🍮", cardColor: getCardColor("Dulces") },
      { id: 5, nombre: "Almojábana", descripcion: "Recién horneada.", precio: 3500, categoria: "Panadería", imagen: "🥖", cardColor: getCardColor("Panadería") }
    ]
    setProducts(sampleProducts)
    setFilteredProducts(sampleProducts)
  }

  const getProductIcon = (categoria) => {
    const iconMap = { 'Carnes': '🥓', 'Lacteos': '🧀', 'Lácteos': '🧀', 'Panadería': '🥖', 'Panaderia': '🥖', 'Bebidas': '☕', 'Dulces': '🍬', 'General': '📦' }
    return iconMap[categoria] || '📦'
  }

  // --- LÓGICA DE FILTRADO MEJORADA ---
  useEffect(() => {
    // Calcular contadores primero para mostrarlos siempre correctos
    categories.forEach(cat => {
      if (cat.id === 'todos') {
        cat.count = products.length
      } else {
        cat.count = products.filter(p =>
          // Comparación flexible (incluye tildes y mayúsculas)
          p.categoria.toLowerCase().includes(cat.id.toLowerCase()) ||
          (cat.id === 'Lacteos' && p.categoria.toLowerCase().includes('lácteos'))
        ).length
      }
    })

    let filtered = products

    // Filtrado por categoría
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product => {
        // Normalizamos ambas cadenas para comparar
        const catProd = product.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const catSel = selectedCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return catProd.includes(catSel)
      })
    }

    // Filtrado por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenamiento
    switch (sortBy) {
      case 'precio-asc': filtered = [...filtered].sort((a, b) => a.precio - b.precio); break;
      case 'precio-desc': filtered = [...filtered].sort((a, b) => b.precio - a.precio); break;
      case 'nombre': filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      default: break;
    }
    setFilteredProducts(filtered)
  }, [selectedCategory, sortBy, searchTerm, products])

  const handleAddToCart = (product) => {
    addToCart(product)
    // Opcional: Un toast o alerta aquí
  }

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  if (loading) return <LoadingSpinner text="Preparando el menú..." />

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* --- HEADER FLOTANTE --- */}
      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4">
        <div className="container mx-auto bg-[#009045] text-white rounded-full shadow-2xl py-3 px-4 md:px-8 flex justify-between items-center border-b-[4px] border-[#007a3a]">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            {/* LOGO ICONO */}
            <div className="bg-white p-0 rounded-full border-2 border-yellow-400 group-hover:rotate-12 transition-transform shadow-md">
              <img
                src="/icons/DC.png"
                alt="Delicias Colombianas Logo"
                className="w-10 h-10 object-contain" // Tamaño 40px x 40px
              />
            </div>

            {/* TEXTO DE LA MARCA */}
            <div className="leading-tight hidden sm:block">
              <h1 className="text-xl font-black tracking-wide">DELICIAS</h1>
              <p className="text-xs text-yellow-300 font-bold">COLOMBIANAS</p>
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

          <div className="flex items-center gap-4 shrink-0">
            {!user ? (
              <div className="hidden md:flex items-center gap-3 font-bold text-sm">
                <Link href="/login" className="hover:text-yellow-300">Ingresar</Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 font-bold text-sm">
                <span className="text-yellow-300">Hola, {user.nombre}</span>
              </div>
            )}
            <Link href="/carrito" className="bg-[#007a3a] p-2 px-4 rounded-full font-bold hover:bg-yellow-400 hover:text-[#009045] transition-all flex items-center gap-2">
              <span>🛒</span>
              {getCartItemsCount() > 0 && <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{getCartItemsCount()}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Espaciador y Onda */}
      <div className="h-24 md:h-32 bg-[#009045]"></div>
      <WaveTitle />

      {/* MODAL DE PRODUCTO */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <main className="container mx-auto px-4 pb-20 pt-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar de Filtros */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-[2rem] shadow-lg p-6 sticky top-28 border border-gray-100">
              <h3 className="font-black text-xl text-[#009045] mb-6 flex items-center gap-2">
                Categorías <span className="text-2xl">📂</span>
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 font-bold text-sm ${selectedCategory === category.id
                      ? 'bg-yellow-400 text-[#009045] shadow-md transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#009045]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    {category.count > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id ? 'bg-white/50' : 'bg-gray-100'}`}>
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid de Productos */}
          <div className="flex-1">

            {/* --- NUEVO: BUSCADOR GRANDE --- */}
            <div className="mb-8">
              <div className="relative group w-full shadow-sm rounded-full">
                <input
                  type="text"
                  placeholder="🔎 ¿Qué se te antoja hoy? (Ej: Brownie, Arequipe...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 text-gray-700 placeholder-gray-400 rounded-full py-4 px-8 focus:border-[#009045] focus:ring-4 focus:ring-green-50 transition-all outline-none font-bold text-lg"
                />
                <button className="absolute right-2 top-2 bg-[#009045] text-white p-2 rounded-full hover:bg-[#007a3a] transition-colors">
                  BUSCAR
                </button>
              </div>
            </div>

            {/* Barra Superior */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 px-2">
              <h2 className="text-2xl font-black text-gray-800">
                {selectedCategory === 'todos' ? 'Todos los Productos' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-sm font-medium text-gray-500 ml-3 bg-white px-3 py-1 rounded-full shadow-sm">
                  {filteredProducts.length} resultados
                </span>
              </h2>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="text-sm font-bold text-gray-500">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-bold text-[#009045] bg-transparent outline-none cursor-pointer"
                >
                  {sortOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>
            </div>

            {/* --- GRID DE TARJETAS (Interactivas) --- */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    // Al hacer clic en la tarjeta, abrimos el modal
                    onClick={() => setSelectedProduct(product)}
                    className={`${product.cardColor || 'bg-[#009045]'} cursor-pointer rounded-[2.5rem] p-6 relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center min-h-[400px]`}
                  >
                    {/* Header de Tarjeta */}
                    <div className="w-full flex justify-between items-start absolute top-6 px-6 z-10">
                      {product.nuevo && <span className="bg-yellow-400 text-[#009045] text-xs font-black px-3 py-1 rounded-full shadow-md">NUEVO</span>}
                      {product.oferta && <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md animate-pulse">OFERTA</span>}
                    </div>

                    {/* Imagen Flotante */}
                    <div className="mt-8 mb-4 transform transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-white/30"
                      />
                    </div>

                    {/* Información */}
                    <div className="mt-auto w-full">
                      <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-md">
                        {product.nombre}
                      </h3>

                      <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-yellow-300 font-black text-xl">
                          ${formatNumber(product.precio)}
                        </span>
                      </div>

                      {/* Botón Agregar (stopPropagation evita abrir el modal) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // IMPORTANTE: Evita que el clic abra el modal
                          handleAddToCart(product);
                        }}
                        className="bg-[#fdf0d5] text-[#009045] w-full py-3 rounded-full font-black text-sm tracking-wider hover:bg-white hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:shadow-white/20"
                      >
                        <span>🛒</span> AGREGAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] shadow-lg p-12 text-center border border-gray-100">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">¡Ups! No encontramos eso</h3>
                <p className="text-gray-500 mb-6">Intenta buscando en otra categoría.</p>
                <button onClick={() => { setSelectedCategory('todos'); setSearchTerm('') }} className="bg-[#009045] text-white px-8 py-3 rounded-full font-bold hover:bg-[#007a3a]">
                  Ver todo el menú
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-16">
          <BackToHome />
        </div>
      </main>

      {/* --- FOOTER --- */}
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