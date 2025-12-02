'use client'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'

// 1. IMPORTAR ICONOS
import {
    ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight,
    ShieldCheck, Store, MapPin, Clock, Phone, Mail,
    Facebook, Instagram, Youtube, Quote, Menu, X, LogIn, LogOut, User,
    ShoppingBasket, Linkedin, MessageCircle
} from 'lucide-react'

const DEBUG = false
const BACKEND_URL = !DEBUG ? "https://ecommerce-dc-plantilla.onrender.com" : 'http://localhost:8000'

const DJANGO_BASE_URL = `${BACKEND_URL}`;
const DJANGO_MEDIA_PATH = '/media/';

export default function Carrito() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, getCartItemsCount } = useCart()
    const { user, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
        } else {
            updateQuantity(productId, newQuantity)
        }
    }

    // --- HEADER COMPONENTE ---
    const Header = () => (
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
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#009045] rounded-2xl shadow-xl border-t-4 border-yellow-400 overflow-hidden lg:hidden z-50 animate-fade-in">
                        <div className="flex flex-col p-4 space-y-2">
                            {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
                                <Link key={item} href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="block py-3 px-4 rounded-xl hover:bg-[#007a3a] font-black text-lg text-white transition-colors border-b border-[#007a3a] last:border-0" onClick={() => setMobileMenuOpen(false)}>
                                    {item.toUpperCase()}
                                </Link>
                            ))}
                            {!user ? (
                                <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-[#007a3a]">
                                    <Link href="/login" className="py-2 px-4 text-white hover:text-yellow-300 font-bold flex items-center gap-2"><LogIn size={18} /> Ingresar</Link>
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
    )

    // --- FOOTER COMPONENTE ---
    const Footer = () => (
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
                        Plantilla desarollada por <a href="https://aurea-web.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-yellow-300 transition-colors">Áurea Web</a>
                    </p>
                </div>
            </div>
        </footer>
    )

    // --- ESTADO VACÍO ---
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center pt-32 pb-12 px-4">
                    <div className="text-center max-w-lg bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400"></div>
                        <div className="text-gray-200 mb-6 flex justify-center animate-bounce-gentle">
                            <ShoppingBasket size={120} strokeWidth={1} />
                        </div>
                        <h1 className="text-4xl font-black text-[#009045] mb-4">Tu Carrito está Vacío</h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Parece que aún no has elegido tus antojos. ¡Nuestros brownies te están esperando!
                        </p>
                        <Link href="/productos" className="bg-[#009045] hover:bg-[#007a3a] text-white px-8 py-4 rounded-full font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2">
                            <Store size={24} /> Ir a la Tienda
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    // --- ESTADO CON PRODUCTOS (CORREGIDO CON ENCABEZADO VERDE) ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />

            {/* NUEVO: Encabezado Verde Estilo Checkout */}
            <div className="bg-[#009045] pt-32 md:pt-40 pb-20 rounded-br-[4rem] md:rounded-br-[6rem] shadow-lg mb-8 relative overflow-hidden">
                {/* Decoración de fondo opcional */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-md">
                        Tu <span className="text-yellow-400">Carrito</span>
                    </h1>
                    <p className="text-green-100 text-base md:text-lg font-medium max-w-2xl mx-auto">
                        Estás a un paso de disfrutar el auténtico sabor.
                    </p>
                </div>
            </div>

            {/* Main content - Padding superior ajustado (ya no es pt-48) */}
            <main className="container mx-auto px-4 py-8 flex-1">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* Lista de Productos */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                                    <ShoppingBasket size={24} className="text-[#009045]" /> Productos ({cart.length})
                                </h2>
                                <button onClick={clearCart} className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-full transition-colors">
                                    <Trash2 size={16} /> Vaciar todo
                                </button>
                            </div>

                            <div className="space-y-6">
                                {cart.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-3xl hover:shadow-md transition-all duration-300 border border-transparent hover:border-green-200 group">

                                        {/* Imagen */}
                                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-sm text-4xl shrink-0 overflow-hidden relative">
                                            <img
                                                src={item.imagen && !item.imagen.includes('http') ? `${DJANGO_BASE_URL}${DJANGO_MEDIA_PATH}${item.imagen}` : item.imagen}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-lg font-black text-gray-800 mb-1">{item.nombre}</h3>
                                            <p className="text-[#009045] font-bold text-xl">${item.precio?.toLocaleString()}</p>
                                        </div>

                                        {/* Controles */}
                                        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#009045] transition-colors"><Minus size={18} strokeWidth={3} /></button>
                                            <span className="w-8 text-center font-black text-gray-800 text-lg">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#009045] transition-colors"><Plus size={18} strokeWidth={3} /></button>
                                        </div>

                                        {/* Total Item */}
                                        <div className="text-right min-w-[100px] flex flex-col items-center sm:items-end">
                                            <p className="font-black text-gray-800 text-xl">${(item.precio * item.quantity).toLocaleString()}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                                                <Trash2 size={12} /> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-left">
                            <Link href="/productos" className="inline-flex items-center gap-2 text-[#009045] font-black hover:text-yellow-500 transition-colors text-lg border-b-2 border-transparent hover:border-yellow-500 pb-1">
                                <ArrowLeft size={20} /> Seguir Comprando
                            </Link>
                        </div>
                    </div>

                    {/* Resumen del Pedido (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#009045] rounded-[2.5rem] shadow-2xl p-8 text-white sticky top-32 overflow-hidden relative">
                            {/* Decoración */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full pointer-events-none"></div>

                            <h2 className="text-2xl font-black mb-8 border-b border-white/20 pb-4">Resumen</h2>

                            <div className="space-y-4 mb-8 text-green-100 font-medium text-lg">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold">${getCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className="text-yellow-300 font-bold flex items-center gap-1"><Store size={16} /> Gratis</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Impuestos (19%)</span>
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
                                FINALIZAR COMPRA <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-6 bg-[#007a3a] p-3 rounded-xl text-sm text-center text-green-100 font-bold flex items-center justify-center gap-2">
                                <ShieldCheck size={18} /> Pago 100% Seguro
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}