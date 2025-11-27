const API_BASE_URL = 'http://localhost:8000/api'

export const apiService = {
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Raw response from backend:', data)
      
      // ✅ MANEJAR PAGINACIÓN: Los productos están en data.results
      const products = data.results || data
      console.log('📦 Products array:', products)
      console.log('🔢 Number of products:', products.length)
      
      return products
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      throw error
    }
  },

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

  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}/`)
      if (!response.ok) throw new Error('Error fetching product')
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }
}