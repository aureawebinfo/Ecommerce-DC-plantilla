from django.contrib import admin
from .models import Categoria, Producto, Banner

# -------------------
# CATEGORÍA
# -------------------
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']


# -------------------
# PRODUCTO
# -------------------
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio', 'categoria', 'stock', 'destacado']
    list_filter = ['categoria', 'destacado']
    search_fields = ['nombre']


# -------------------
# BANNER
# -------------------
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tag', 'activo')
    list_filter = ('activo',)
    search_fields = ('titulo', 'subtitulo', 'tag')
