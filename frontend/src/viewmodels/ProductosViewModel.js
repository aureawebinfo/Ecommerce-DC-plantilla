import { ApiService } from '../services/ApiService';
import { Producto } from '../models/Producto';

export class ProductosViewModel {
  constructor() {
    this.productos = [];
    this.productosDestacados = [];
    this.categorias = [];
    this.loading = false;
    this.error = null;
  }

  async cargarProductos() {
    this.loading = true;
    this.error = null;
    
    try {
      const productosData = await ApiService.getProductos();
      this.productos = productosData.map(data => new Producto(data));
    } catch (error) {
      this.error = 'Error al cargar los productos';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async cargarProductosDestacados() {
    this.loading = true;
    this.error = null;
    
    try {
      const destacadosData = await ApiService.getProductosDestacados();
      this.productosDestacados = destacadosData.map(data => new Producto(data));
    } catch (error) {
      this.error = 'Error al cargar productos destacados';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async cargarCategorias() {
    try {
      const categoriasData = await ApiService.getCategorias();
      this.categorias = categoriasData;
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }
}
