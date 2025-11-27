'use client'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'

const DJANGO_BASE_URL = 'http://127.0.0.1:8000';
const DJANGO_MEDIA_PATH = '/media/';

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

export default function Checkout() {
  const { cart, getCartTotal, clearCart, getCartItemsCount } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // NUEVO: Estado para recordar el total antes de borrar el carrito
  const [lastOrderTotal, setLastOrderTotal] = useState(0)

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    direccion: user?.direccion || '',
    ciudad: '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    metodoPago: 'tarjeta',
    terminos: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' })
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es obligatorio'
    if (!formData.direccion.trim()) errors.direccion = 'La dirección es obligatoria'
    if (!formData.ciudad.trim()) errors.ciudad = 'La ciudad es obligatoria'
    if (!formData.telefono.trim()) errors.telefono = 'El teléfono es obligatorio'

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido'
    }

    if (!formData.terminos) errors.terminos = 'Debes aceptar los términos'
    return errors
  }

  const generateOrderNumber = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const sendOrderConfirmation = async (orderData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      return response.ok
    } catch (error) {
      console.error('Error enviando correo:', error)
      return false
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('Por favor inicia sesión para continuar con la compra')
      return
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      const firstError = Object.keys(errors)[0]
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)

    try {
      // 1. Calcular totales ANTES de borrar nada
      const totalBase = getCartTotal()
      const totalFinal = totalBase * 1.19

      const orderData = {
        orderNumber: generateOrderNumber(),
        user: { ...formData, userId: user.id },
        products: cart,
        total: totalBase,
        tax: totalBase * 0.19,
        finalTotal: totalFinal,
        orderDate: new Date().toISOString(),
      }

      // Simular tiempo de espera
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Intentar enviar correo
      await sendOrderConfirmation(orderData)

      // 2. Guardar el total en el estado para mostrarlo en la siguiente pantalla
      setLastOrderTotal(totalFinal)

      // 3. Mostrar pantalla de éxito y limpiar carrito
      setOrderComplete(true)
      clearCart()

    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error procesando tu orden.')
    } finally {
      setLoading(false)
    }
  }

  // --- VISTA DE ORDEN COMPLETADA ---
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#009045] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-20 left-20 text-6xl animate-bounce opacity-50">🎉</div>
        <div className="absolute bottom-20 right-20 text-6xl animate-pulse opacity-50">🍫</div>

        <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center max-w-lg w-full relative z-10 animate-slide-up">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-4xl font-black text-[#009045] mb-4">¡Orden Recibida!</h2>
          <p className="text-gray-600 mb-8 text-lg font-medium">
            Tu pedido ha sido procesado con éxito. Hemos enviado un correo con los detalles.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <p className="text-gray-500 text-sm uppercase font-bold tracking-wider mb-1">Total Pagado</p>
            {/* AQUI ESTA EL CAMBIO: Usamos lastOrderTotal en vez de getCartTotal */}
            <p className="text-3xl font-black text-gray-800">${lastOrderTotal.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-bold mt-1">IVA INCLUIDO</p>
          </div>
          <Link
            href="/"
            className="w-full bg-[#009045] hover:bg-[#007a3a] text-white py-4 rounded-full font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-block"
          >
            🏠 Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  // --- VISTA PRINCIPAL (Checkout) ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4">
        <div className="container mx-auto bg-[#009045] text-white rounded-full shadow-2xl py-3 px-4 md:px-8 flex justify-between items-center border-b-[4px] border-[#007a3a]">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            {/* LOGO ICONO */}
            <div className="bg-white p-0 rounded-full border-2 border-yellow-400 group-hover:rotate-12 transition-transform shadow-md">
              <img
                src="/icons/DC.png"
                alt="Delicias Colombianas Logo"
                className="w-10 h-10 object-contain"
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
              <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="hover:text-yellow-300 transition-colors">{item.toUpperCase()}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            {!user && <Link href="/login" className="hidden md:block font-bold hover:text-yellow-300">Ingresar</Link>}
            <Link href="/carrito" className="bg-[#007a3a] p-2 px-4 rounded-full font-bold hover:bg-yellow-400 hover:text-[#009045] transition-all flex items-center gap-2">
              <span>🛒</span>{getCartItemsCount() > 0 && <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{getCartItemsCount()}</span>}
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-[#009045] pt-40 pb-24 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-md">Finalizar Compra</h1>
          <p className="text-green-100 text-lg font-medium">Estás a un paso de disfrutar.</p>
        </div>
        <WaveDivider color="fill-gray-50" />
      </div>

      <main className="container mx-auto px-4 pb-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-md">📦</div>
                <h2 className="text-2xl font-black text-gray-800">Información de Envío</h2>
              </div>

              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Nombre Completo</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={`w-full bg-gray-50 border-2 rounded-xl px-5 py-3 focus:bg-white transition-all outline-none font-medium ${formErrors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#009045]'}`} placeholder="Ej: Juan Pérez" />
                    {formErrors.nombre && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{formErrors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Ciudad</label>
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className={`w-full bg-gray-50 border-2 rounded-xl px-5 py-3 focus:bg-white transition-all outline-none font-medium ${formErrors.ciudad ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#009045]'}`} placeholder="Ej: Bogotá" />
                    {formErrors.ciudad && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{formErrors.ciudad}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Dirección de Entrega</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className={`w-full bg-gray-50 border-2 rounded-xl px-5 py-3 focus:bg-white transition-all outline-none font-medium ${formErrors.direccion ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#009045]'}`} placeholder="Calle 123 # 45-67, Apto 101" />
                  {formErrors.direccion && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{formErrors.direccion}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Teléfono</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className={`w-full bg-gray-50 border-2 rounded-xl px-5 py-3 focus:bg-white transition-all outline-none font-medium ${formErrors.telefono ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#009045]'}`} placeholder="+57 300..." />
                    {formErrors.telefono && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{formErrors.telefono}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-gray-50 border-2 rounded-xl px-5 py-3 focus:bg-white transition-all outline-none font-medium ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#009045]'}`} placeholder="correo@ejemplo.com" />
                    {formErrors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{formErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Método de Pago</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['tarjeta', 'pse', 'efectivo'].map((metodo) => (
                      <label key={metodo} className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.metodoPago === metodo ? 'border-[#009045] bg-green-50' : 'border-gray-200 hover:border-yellow-400'}`}>
                        <input type="radio" name="metodoPago" value={metodo} checked={formData.metodoPago === metodo} onChange={handleChange} className="hidden" />
                        <div className="text-2xl mb-1">{metodo === 'tarjeta' ? '💳' : metodo === 'pse' ? '🏦' : '💰'}</div>
                        <div className="font-bold text-sm capitalize">{metodo}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" name="terminos" checked={formData.terminos} onChange={handleChange} className="w-5 h-5 accent-[#009045]" />
                    <span className="text-sm font-medium text-gray-600">Acepto los términos y condiciones de compra</span>
                  </label>
                  {formErrors.terminos && <p className="text-red-500 text-xs font-bold mt-1 ml-10">{formErrors.terminos}</p>}
                </div>

              </form>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-[#009045] text-white rounded-[2.5rem] shadow-2xl p-8 sticky top-32 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>

              <h2 className="text-2xl font-black mb-6">Tu Pedido</h2>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-green-800 scrollbar-thumb-yellow-400">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-[#007a3a] p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white text-xl flex items-center justify-center rounded-lg shadow-sm overflow-hidden">
                        <img
                          // Construimos la URL completa con el fallback
                          src={item.imagen && !item.imagen.includes('http') ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${item.imagen}` : item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="font-bold text-sm">${(item.precio * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4 space-y-2 text-lg">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">${getCartTotal().toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>IVA (19%)</span><span className="font-bold">${(getCartTotal() * 0.19).toLocaleString()}</span></div>
                <div className="flex justify-between text-yellow-300 text-sm"><span>Envío</span><span className="font-bold">Gratis</span></div>

                <div className="flex justify-between text-2xl font-black pt-4 mt-2 border-t border-white/20">
                  <span>Total</span>
                  <span>${(getCartTotal() * 1.19).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full bg-yellow-400 hover:bg-white text-[#009045] py-4 rounded-full font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-[#009045] border-t-transparent rounded-full animate-spin"></div>
                    <span>PROCESANDO...</span>
                  </>
                ) : 'CONFIRMAR PEDIDO'}
              </button>
            </div>
          </div>

        </div>
      </main>

      <div className="relative bg-gray-50 h-16 w-full z-10 mt-12">
        <WaveDivider color="fill-[#009045]" position="bottom" />
      </div>

      <footer className="bg-[#009045] text-white pt-16 relative overflow-hidden">
        <div className="container mx-auto px-4 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="text-[100px] leading-none drop-shadow-xl cursor-pointer hover:scale-110 transition-transform">🏪</div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">📍 Fábrica</h3>
              <div className="space-y-2 font-medium text-green-50"><p>Carrera 68 D Nº 98-23</p><p>Bogotá</p></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">🕒 Horarios</h3>
              <div className="space-y-4 font-medium text-green-50"><p>Lunes a Viernes: 8am - 5pm</p></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">✉️ Contacto</h3>
              <div className="space-y-4 font-medium text-green-50"><p className="font-bold text-yellow-300 text-lg">018000 514020</p></div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">💼 Equipo</h3>
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