import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from productos.models import Categoria, Producto
from django.contrib.auth.models import User
from usuarios.models import Perfil

def cargar_datos_rapidos():
    print("📦 Cargando datos de ejemplo...")
    
    # Crear categorías
    categorias = ['Carnes', 'Lácteos', 'Panadería', 'Bebidas', 'Dulces']
    for nombre in categorias:
        cat, creada = Categoria.objects.get_or_create(nombre=nombre)
        if creada:
            print(f"✅ Categoría creada: {nombre}")
    
    # Crear productos de ejemplo
    productos = [
        {
            'nombre': 'Chicharrón Premium 500g',
            'descripcion': 'Chicharrón de cerdo crocante y dorado perfectamente',
            'precio': 18000,
            'categoria': 'Carnes',
            'stock': 50
        },
        {
            'nombre': 'Café Colombiano 500g', 
            'descripcion': 'Café premium de altura tostado medio',
            'precio': 22000,
            'categoria': 'Bebidas',
            'stock': 100
        },
        {
            'nombre': 'Queso Campesino 500g',
            'descripcion': 'Queso fresco campesino tradicional',
            'precio': 14000,
            'categoria': 'Lácteos',
            'stock': 75
        },
        {
            'nombre': 'Arepas de Maíz x6',
            'descripcion': 'Arepas tradicionales listas para asar',
            'precio': 12500,
            'categoria': 'Panadería',
            'stock': 200
        },
        {
            'nombre': 'Arequipe Colombiano 400g',
            'descripcion': 'Dulce de leche cremoso tradicional',
            'precio': 8200,
            'categoria': 'Dulces',
            'stock': 120
        }
    ]
    
    for prod in productos:
        categoria = Categoria.objects.get(nombre=prod['categoria'])
        producto, creado = Producto.objects.get_or_create(
            nombre=prod['nombre'],
            defaults={
                'descripcion': prod['descripcion'],
                'precio': prod['precio'],
                'categoria': categoria,
                'stock': prod['stock']
            }
        )
        if creado:
            print(f"✅ Producto creado: {prod['nombre']} - ${prod['precio']}")
    
    print(f"\n🎉 BASE DE DATOS LISTA!")
    print(f"📊 Categorías: {Categoria.objects.count()}")
    print(f"📊 Productos: {Producto.objects.count()}")
    print(f"\n🌐 Accede a http://127.0.0.1:8000/admin para ver los datos")

if __name__ == '__main__':
    cargar_datos_rapidos()