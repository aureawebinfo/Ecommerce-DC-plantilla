export class Producto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.precio = data.precio;
    this.precio_descuento = data.precio_descuento;
    this.precio_final = data.precio_final;
    this.tipo = data.tipo;
    this.categoria = data.categoria;
    this.categoria_nombre = data.categoria_nombre;
    this.imagen_url = data.imagen_url;
    this.stock = data.stock;
    this.en_stock = data.en_stock;
    this.activo = data.activo;
    this.destacado = data.destacado;
    this.created_at = data.created_at;
  }

  get precioDisplay() {
    if (this.precio_descuento) {
      return $;
    }
    return $;
  }

  get tieneDescuento() {
    return this.precio_descuento !== null;
  }

  get precioOriginal() {
    return this.tieneDescuento ? $ : null;
  }
}
