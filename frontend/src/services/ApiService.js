const API_BASE_URL = 'http://localhost:8000/api'

export const apiService = {

  // ---------------------------
  // 📌 OBTENER PRODUCTOS
  // ---------------------------
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.categoria && filters.categoria !== 'todos') {
        queryParams.append('categoria', filters.categoria)
      }
      if (filters.search) {
        queryParams.append('search', filters.search)
      }

      const url = `${API_BASE_URL}/productos/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      console.log('🔄 Fetching products from:', url)
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      const data = await response.json()
      console.log('📦 Raw response:', data)

      // Si hay paginación, vienen en data.results
      return data.results || data
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      throw error
    }
  },

  // ---------------------------
  // ⭐ PRODUCTOS DESTACADOS
  // ---------------------------
  async getFeaturedProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/destacados/`)
      if (!response.ok) throw new Error('Error fetching featured products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  },

  // ---------------------------
  // 📂 CATEGORÍAS
  // ---------------------------
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/categorias/`)
      if (!response.ok) throw new Error('Error fetching categories')
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // ---------------------------
  // 🔍 PRODUCTO INDIVIDUAL
  // ---------------------------
  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}/`)
      if (!response.ok) throw new Error('Error fetching product')
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // ---------------------------
  // 🖼️ BANNERS (CORREGIDO)
  // ---------------------------
  async getBanners() {
    try {
      // NOTA: Aquí la URL debe ser /api/banners/ (si es que incluyes las rutas de productos)
      const response = await fetch(`${API_BASE_URL}/productos/banners/`)
      if (!response.ok) throw new Error('Error fetching banners')

      // --- CAMBIO CLAVE AQUÍ ---
      const data = await response.json()
      return data.results || []          // ⬅️ AQUÍ DEVUELVES SOLO EL ARRAY
      // -------------------------

    } catch (error) {
      console.error('❌ Error fetching banners:', error)
      return []
    }
  }
} // <--- ¡Asegúrate de que la llave de cierre final esté AQUÍ!