export default function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-600 mt-6 text-sm font-medium">{text}</p>
      </div>
    </div>
  )
}