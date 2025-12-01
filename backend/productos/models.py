from django.db import models

# ---------------------------
#   CATEGORÍA
# ---------------------------
class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre


# ---------------------------
#   PRODUCTO
# ---------------------------
class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True) 
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    stock = models.IntegerField(default=0)
    
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)

    destacado = models.BooleanField(default=False, verbose_name="Producto Destacado")
    
    def __str__(self):
        return self.nombre


# ---------------------------
#   BANNER (Nuevo)
# ---------------------------
class Banner(models.Model):
    titulo = models.CharField(max_length=100)
    subtitulo = models.CharField(max_length=200)
    tag = models.CharField(max_length=50, default="NUEVO")  # Ej: OFERTA, NUEVO

    imagen = models.ImageField(upload_to="banners/")

    # Se guardan clases Tailwind o HEX para personalización
    color_fondo = models.CharField(
        max_length=50,
        default="bg-green-600",
        help_text="Clase de Tailwind ej: bg-red-500 o un código Hex",
    )
    color_texto = models.CharField(max_length=50, default="text-white")

    texto_boton = models.CharField(max_length=50, default="VER MÁS")
    enlace = models.CharField(max_length=200, default="/productos")

    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo
