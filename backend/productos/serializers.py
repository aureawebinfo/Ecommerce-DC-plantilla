# productos/serializers.py

from rest_framework import serializers
from .models import Categoria, Producto # Asegúrate de importar ambos modelos

class CategoriaSerializer(serializers.ModelSerializer):
    # 🎯 Asegúrate de que esta clase exista y esté correctamente indentada.
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = [
            'id', 
            'nombre', 
            'descripcion', 
            'precio', 
            'categoria', 
            'categoria_nombre', 
            'stock',
            'imagen',
            'destacado'
        ]