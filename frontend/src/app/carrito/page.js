'use client'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'
import BackToHome from '../../components/BackToHome'


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

export default function Carrito() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, getCartItemsCount } = useCart()
    const { user } = useAuth()

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
        } else {
            updateQuantity(productId, newQuantity)
        }
    }

    // --- ESTADO VACÍO ---
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
                {/* Header Simplificado */}
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
                                <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="hover:text-yellow-300 transition-colors">{item.toUpperCase()}</Link>
                            ))}
                        </nav>
                        <div className="w-8"></div> {/* Espaciador */}
                    </div>
                </header>

                <div className="flex-1 flex items-center justify-center pt-32 pb-12 px-4">
                    <div className="text-center max-w-lg bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400"></div>
                        <div className="text-8xl mb-6 animate-bounce-gentle">🛒</div>
                        <h1 className="text-4xl font-black text-[#009045] mb-4">Tu Carrito está Vacío</h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Parece que aún no has elegido tus antojos. ¡Nuestros brownies te están esperando!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/productos" className="bg-[#009045] hover:bg-[#007a3a] text-white px-8 py-4 rounded-full font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                🛍️ Ir a la Tienda
                            </Link>
                        </div>
                    </div>
                </div>
                <footer className="bg-[#009045] py-6 text-center text-white text-sm font-bold">© 2025 Delicias Colombianas</footer>
            </div>
        )
    }

    // --- ESTADO CON PRODUCTOS ---
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
                            <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="hover:text-yellow-300 transition-all relative group py-2">
                                {item.toUpperCase()}
                                <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4 shrink-0">
                        {!user && <Link href="/login" className="hidden md:block font-bold hover:text-yellow-300">Ingresar</Link>}
                        <div className="bg-[#007a3a] p-2 px-4 rounded-full font-bold text-white flex items-center gap-2">
                            <span>🛒</span>
                            {getCartItemsCount() > 0 && <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{getCartItemsCount()}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 pt-48">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
                        Tu <span className="text-[#009045]">Carrito</span>
                    </h1>
                    <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* Lista de Productos */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-black text-gray-800">Productos ({cart.length})</h2>
                                <button onClick={clearCart} className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-full transition-colors">
                                    🗑️ Vaciar todo
                                </button>
                            </div>

                            <div className="space-y-6">
                                {cart.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-3xl hover:shadow-md transition-all duration-300 border border-transparent hover:border-green-200">

                                        {/* Imagen */}
                                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-sm text-4xl shrink-0 overflow-hidden relative">
                                            <img
                                                // Si item.imagen no es una URL completa (no tiene http), concatenamos la base.
                                                src={item.imagen && !item.imagen.includes('http') ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${item.imagen}` : item.imagen}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-lg font-black text-gray-800 mb-1">{item.nombre}</h3>
                                            <p className="text-[#009045] font-bold text-xl">${item.precio?.toLocaleString()}</p>
                                        </div>

                                        {/* Controles */}
                                        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#009045] font-bold text-xl transition-colors">-</button>
                                            <span className="w-8 text-center font-black text-gray-800 text-lg">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#009045] font-bold text-xl transition-colors">+</button>
                                        </div>

                                        {/* Total Item */}
                                        <div className="text-right min-w-[100px]">
                                            <p className="font-black text-gray-800 text-xl">${(item.precio * item.quantity).toLocaleString()}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs font-bold mt-1 underline">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-left">
                            <Link href="/productos" className="inline-flex items-center gap-2 text-[#009045] font-black hover:text-yellow-500 transition-colors text-lg">
                                ← Seguir Comprando
                            </Link>
                        </div>
                    </div>

                    {/* Resumen del Pedido (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#009045] rounded-[2.5rem] shadow-2xl p-8 text-white sticky top-32 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>

                            <h2 className="text-2xl font-black mb-8">Resumen</h2>

                            <div className="space-y-4 mb-8 text-green-100 font-medium text-lg">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold">${getCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className="text-yellow-300 font-bold">Gratis</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Impuestos</span>
                                    <span className="text-white font-bold">${(getCartTotal() * 0.19).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-white/20 pt-4 mt-4">
                                    <div className="flex justify-between text-2xl font-black text-white">
                                        <span>Total</span>
                                        <span>${(getCartTotal() * 1.19).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="w-full bg-white text-[#009045] py-4 rounded-full font-black text-lg hover:bg-yellow-400 hover:text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                                FINALIZAR COMPRA <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>

                            <div className="mt-6 bg-[#007a3a] p-4 rounded-xl text-sm text-center text-green-100 font-medium">
                                🔒 Pago 100% Seguro
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