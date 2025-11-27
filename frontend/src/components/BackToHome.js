import Link from 'next/link'

export default function BackToHome() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Volver al Inicio
    </Link>
  )
}