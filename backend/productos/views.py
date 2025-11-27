from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer

class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]

class ProductoListView(generics.ListAPIView):
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Producto.objects.all()
        
        # Filtros
        categoria = self.request.query_params.get('categoria')
        search = self.request.query_params.get('search')
        
        if categoria:
            queryset = queryset.filter(categoria__nombre=categoria)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        return queryset

class ProductoDetailView(generics.RetrieveAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
def productos_destacados(request):
    productos = Producto.objects.all()[:8]  # Primeros 8 productos
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)